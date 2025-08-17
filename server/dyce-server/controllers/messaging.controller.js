const { PrismaClient } = require("../generated/prisma/client.js");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { ICE_BREAKER_PROMPTS } = require("../constants/ice_breaker.constant.js");

const prisma = new PrismaClient();

// Configure multer for chat media uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/chat";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "video/mp4",
      "audio/mpeg",
      "audio/wav",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

// Get chat conversations
const getChatConversations = async (req, res) => {
  try {
    const matches = await prisma.match.findMany({
      where: {
        OR: [{ user1Id: req.userId }, { user2Id: req.userId }],
        isActive: true,
        matchExpired: false,
      },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            profileImages: { take: 1, orderBy: { order: "asc" } },
          },
        },
        user2: {
          select: {
            id: true,
            name: true,
            profileImages: { take: 1, orderBy: { order: "asc" } },
          },
        },
      },
    });

    const conversationsWithLastMessage = await Promise.all(
      matches.map(async (match) => {
        const otherUser =
          match.user1Id === req.userId ? match.user2 : match.user1;

        const lastMessage = await prisma.chat.findFirst({
          where: {
            OR: [
              { senderId: req.userId, receiverId: otherUser.id },
              { senderId: otherUser.id, receiverId: req.userId },
            ],
          },
          orderBy: { createdAt: "desc" },
        });

        const unreadCount = await prisma.chat.count({
          where: {
            senderId: otherUser.id,
            receiverId: req.userId,
            isRead: false,
          },
        });

        return {
          matchId: match.id,
          user: otherUser,
          lastMessage,
          unreadCount,
          createdAt: match.createdAt,
        };
      })
    );

    res.status(200).json({
      success: true,
      conversations: conversationsWithLastMessage.sort(
        (a, b) =>
          new Date(b.lastMessage?.createdAt || b.createdAt) -
          new Date(a.lastMessage?.createdAt || a.createdAt)
      ),
    });
  } catch (error) {
    console.error("Error in getChatConversations:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get messages for a conversation
const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    // Verify match exists
    const match = await prisma.match.findFirst({
      where: {
        OR: [
          { user1Id: req.userId, user2Id: userId },
          { user1Id: userId, user2Id: req.userId },
        ],
        isActive: true,
      },
    });

    if (!match) {
      return res
        .status(403)
        .json({ success: false, message: "No active match found" });
    }

    const messages = await prisma.chat.findMany({
      where: {
        OR: [
          { senderId: req.userId, receiverId: userId },
          { senderId: userId, receiverId: req.userId },
        ],
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: parseInt(limit),
    });

    // Mark messages as read
    await prisma.chat.updateMany({
      where: {
        senderId: userId,
        receiverId: req.userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    res.status(200).json({
      success: true,
      messages: messages.reverse(),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: messages.length === parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error in getMessages:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Send message
const sendMessage = async (req, res) => {
  try {
    const { userId } = req.params;
    const { message, type = "TEXT", gameType } = req.body;

    // Verify match exists and is active
    const match = await prisma.match.findFirst({
      where: {
        OR: [
          { user1Id: req.userId, user2Id: userId },
          { user1Id: userId, user2Id: req.userId },
        ],
        isActive: true,
        matchExpired: false,
      },
    });

    if (!match) {
      return res
        .status(403)
        .json({ success: false, message: "No active match found" });
    }

    // Check if this is the first message
    const existingMessages = await prisma.chat.count({
      where: {
        OR: [
          { senderId: req.userId, receiverId: userId },
          { senderId: userId, receiverId: req.userId },
        ],
      },
    });

    let starterPrompt = null;
    if (existingMessages === 0) {
      starterPrompt =
        ICE_BREAKER_PROMPTS[
          Math.floor(Math.random() * ICE_BREAKER_PROMPTS.length)
        ];
    }

    const newMessage = await prisma.chat.create({
      data: {
        senderId: req.userId,
        receiverId: userId,
        message: message || "",
        type,
        gameType,
        starterPrompt,
        mediaUrl: req.file ? `/uploads/chat/${req.file.filename}` : null,
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: userId,
        message: "You have a new message! 💬",
        type: "MESSAGE",
      },
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      chat: newMessage,
    });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Unmatch user
const unmatchUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const match = await prisma.match.findFirst({
      where: {
        OR: [
          { user1Id: req.userId, user2Id: userId },
          { user1Id: userId, user2Id: req.userId },
        ],
      },
    });

    if (!match) {
      return res
        .status(404)
        .json({ success: false, message: "Match not found" });
    }

    await prisma.match.update({
      where: { id: match.id },
      data: { isActive: false },
    });

    res.status(200).json({
      success: true,
      message: "User unmatched successfully",
    });
  } catch (error) {
    console.error("Error in unmatchUser:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getChatConversations,
  getMessages,
  sendMessage,
  unmatchUser,
  upload,
};
