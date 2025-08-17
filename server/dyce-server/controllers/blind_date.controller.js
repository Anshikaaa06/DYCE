const { PrismaClient } = require("../generated/prisma/client.js");
const { findRandomMatch } = require("../services/matching.service.js");
const { triggerNotification } = require("../services/notification.service.js");

const prisma = new PrismaClient();

const startBlindDate = async (req, res) => {
  try {
    const userId = req.userId;

    // Check if user is already in a blind date
    const existingDate = await prisma.blindDate.findFirst({
      where: {
        OR: [
          { initiatorId: userId, active: true },
          { receiverId: userId, active: true },
        ],
      },
    });

    if (existingDate) {
      return res.status(400).json({
        success: false,
        message: "You are already in an active blind date",
      });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        gender: true,
      },
    });

    // Find a random user for blind date
    const potentialMatch = await findRandomMatch(userId, user.gender);

    if (!potentialMatch) {
      return res.status(404).json({
        success: false,
        message: "No available users for blind date at the moment",
      });
    }

    // Create blind date session
    const blindDate = await prisma.blindDate.create({
      data: {
        initiatorId: userId,
        receiverId: potentialMatch.id,
        active: true,
      },
    });

    await triggerNotification(
      potentialMatch.id,
      "Blind Date Paired",
      "You've been paired for a blind date!"
    );

    res.status(201).json({
      success: true,
      message: "Blind date started successfully",
      data: {
        blindDateId: blindDate.id,
        partnerId: potentialMatch.id,
      },
    });
  } catch (error) {
    console.error("Error starting blind date:", error);
    res.status(500).json({
      success: false,
      message: "Failed to start blind date",
    });
  }
};

const getCurrentBlindDate = async (req, res) => {
  try {
    const userId = req.userId;

    const blindDate = await prisma.blindDate.findFirst({
      where: {
        OR: [
          { initiatorId: userId, active: true },
          { receiverId: userId, active: true },
        ],
      },
    });

    if (!blindDate) {
      return res.status(404).json({
        success: false,
        message: "No active blind date found",
      });
    }

    const isInitiator = blindDate.initiatorId === userId;
    const partnerId = isInitiator
      ? blindDate.receiverId
      : blindDate.initiatorId;
    let partner = null;
    if (
      isInitiator
        ? blindDate.initiatorAgreeToReveal
        : blindDate.receiverAgreeToReveal
    ) {
      partner = await prisma.user.findUnique({
        where: { id: partnerId },
        select: {
          id: true,
          name: true,
          age: true,
          college: true,
          profileImages: {
            take: 1,
            orderBy: { order: "asc" },
          },
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        blindDateId: blindDate.id,
        partnerId,
        userRevealed: isInitiator
          ? blindDate.initiatorAgreeToReveal
          : blindDate.receiverAgreeToReveal,
        // bothRevealed: blindDate.bothAgreeToReveal,
        partner,
      },
    });
  } catch (error) {
    console.error("Error getting current blind date:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get blind date",
    });
  }
};

const sendBlindDateMessage = async (req, res) => {
  try {
    const { blindDateId, content, type = "TEXT" } = req.body;
    const senderId = req.userId;

    // Validate blind date exists and user is part of it
    const blindDate = await prisma.blindDate.findFirst({
      where: {
        id: blindDateId,
        OR: [{ initiatorId: senderId }, { receiverId: senderId }],
        active: true,
      },
    });

    if (!blindDate) {
      return res.status(404).json({
        success: false,
        message: "Blind date not found or inactive",
      });
    }

    // Check if blind date has expired
    if (new Date() > blindDate.expiresAt) {
      await prisma.blindDate.update({
        where: { id: blindDate.id },
        data: { active: false },
      });

      return res.status(410).json({
        success: false,
        message: "Blind date has expired",
      });
    }

    // Only allow text and emoji messages
    if (type !== "TEXT" && type !== "EMOJI") {
      return res.status(400).json({
        success: false,
        message: "Only text and emoji messages are allowed in blind dates",
      });
    }

    const message = await prisma.blindDateMessage.create({
      data: {
        blindDateId,
        senderId,
        content,
        type,
        anonymous: !blindDate.revealed,
      },
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    console.error("Error sending blind date message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

const agreeToReveal = async (req, res) => {
  try {
    const { blindDateId } = req.params;
    const userId = req.userId;

    const blindDate = await prisma.blindDate.findFirst({
      where: {
        id: blindDateId,
        OR: [{ initiatorId: userId }, { receiverId: userId }],
        active: true,
      },
    });

    if (!blindDate) {
      return res.status(404).json({
        success: false,
        message: "Blind date not found or inactive",
      });
    }

    // Update user's reveal preference
    const isInitiator = blindDate.initiatorId === userId;
    const updateData = isInitiator
      ? { initiatorAgreeToReveal: true }
      : { receiverAgreeToReveal: true };

    const updatedBlindDate = await prisma.blindDate.update({
      where: { id: blindDateId },
      data: updateData,
    });

    // Check if both users agreed to reveal
    if (
      updatedBlindDate.initiatorAgreeToReveal &&
      updatedBlindDate.receiverAgreeToReveal
    ) {
      await prisma.blindDate.update({
        where: { id: blindDateId },
        data: {
          // bothAgreeToReveal: true,
          active: false,
        },
      });

      await triggerNotification(
        blindDate.initiatorId,
        "Blind Date Reveal",
        "Both revealed the identities! You are now a match."
      );
      await triggerNotification(
        blindDate.receiverId,
        "Blind Date Reveal",
        "Both revealed the identities! You are now a match."
      );

      return res.status(200).json({
        success: true,
        message: "Identities revealed!",
        data: {
          userRevealed: true,
          bothRevealed: true,

        },
      });
    }

    const partnerId = isInitiator
      ? blindDate.receiverId
      : blindDate.initiatorId;
    const partner = await prisma.user.findUnique({
      where: { id: partnerId },
      select: {
        id: true,
        name: true,
        age: true,
        college: true,
        profileImages: {
          take: 1,
          orderBy: { order: "asc" },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Waiting for your partner to agree to reveal identities",
      data: {
        userRevealed: true,
        // bothRevealed: false,
        partner,
      },
    });
  } catch (error) {
    console.error("Error agreeing to reveal:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process reveal request",
    });
  }
};

const endBlindDate = async (req, res) => {
  try {
    const { blindDateId } = req.params;
    const userId = req.userId;

    const blindDate = await prisma.blindDate.findFirst({
      where: {
        id: blindDateId,
        OR: [{ initiatorId: userId }, { receiverId: userId }],
      },
    });

    if (!blindDate) {
      return res.status(404).json({
        success: false,
        message: "Blind date not found",
      });
    }

    await prisma.blindDate.update({
      where: { id: blindDateId },
      data: {
        active: false,
      },
    });

    const partnerId =
      blindDate.initiatorId === userId
        ? blindDate.receiverId
        : blindDate.initiatorId;
    await triggerNotification(
      partnerId,
      "Blind Date Ended",
      "Your blind date has ended. Thank you for participating!"
    );

    res.status(200).json({
      success: true,
      message: "Blind date ended successfully",
    });
  } catch (error) {
    console.error("Error ending blind date:", error);
    res.status(500).json({
      success: false,
      message: "Failed to end blind date",
    });
  }
};

const getBlindDateHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10 } = req.query;

    const blindDates = await prisma.blindDate.findMany({
      where: {
        OR: [{ initiatorId: userId }, { receiverId: userId }],
        active: false,
      },
      include: {
        initiator: {
          select: {
            id: true,
            name: true,
            profileImages: {
              take: 1,
              orderBy: { order: "asc" },
            },
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            profileImages: {
              take: 1,
              orderBy: { order: "asc" },
            },
          },
        },
        messages: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            senderId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    });

    const formattedDates = blindDates.map((date) => ({
      id: date.id,
      partner: date.initiatorId === userId ? date.receiver : date.initiator,
      duration: date.duration,
      revealed: date.revealed,
      messageCount: date.messages.length,
      createdAt: date.createdAt,
      endedAt: date.endedAt,
    }));

    res.status(200).json({
      success: true,
      data: formattedDates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: blindDates.length,
      },
    });
  } catch (error) {
    console.error("Error getting blind date history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get blind date history",
    });
  }
};

module.exports = {
  startBlindDate,
  getCurrentBlindDate,
  sendBlindDateMessage,
  agreeToReveal,
  endBlindDate,
  getBlindDateHistory,
};
