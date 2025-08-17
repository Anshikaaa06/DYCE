const { PrismaClient } = require("../generated/prisma/client.js");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const {
  extractSupabasePathFromUrl,
  deleteFromStorage,
  uploadToStorage,
} = require("../utils/upload.js");

const prisma = new PrismaClient();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."));
    }
  },
});

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: {
        profileImages: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const {
      password,
      resetPasswordExpiresAt,
      resetPasswordToken,
      updatedAt,
      createdAt,
      otpCode,
      otpExpiresAt,
      ...profileData
    } = user;
    res.status(200).json({
      success: true,
      profile: profileData,
    });
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getCompletionPercentage = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        age: true,
        email: true,
        height: true,
        branch: true,
        college: true,
        gender: true,
        interests: true,
        personalityType: true,
        campusVibeTags: true,
        hangoutSpot: true,
        favoriteArtist: true,
        funPrompt1: true,
        funPrompt2: true,
        funPrompt3: true,
        currentMood: true,
        connectionIntent: true,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const totalFields = 17; // Total fields to check
    let filledFields = 0;

    for (const key in user) {
      if (user[key] || (Array.isArray(user[key]) && user[key].length > 0))
        filledFields++;
    }

    return res.status(200).json({
      success: true,
      message: "Profile completion percentage calculated",
      percentage: Math.round((filledFields / totalFields) * 100),
    });
  } catch (error) {
    console.error("Error calculating profile completion:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", percentage: 0 });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const {
      age,
      name,
      gender,
      branch,
      interests,
      branchVisible,
      height,
      personalityType,
      campusVibeTags,
      hangoutSpot,
      favoriteArtist,
      funPrompt1,
      funPrompt2,
      funPrompt3,
      currentMood,
      connectionIntent, // 'study_buddy', 'fest_and_fun', 'genuine_connection', 'just_vibing', 'its_complicated'
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(name && { name: name.trim() }),
        ...(age && { age: parseInt(age) }),
        ...(gender && { gender }),
        ...(interests && {
          interests: Array.isArray(interests)
            ? interests
            : interests.split(","),
        }),
        ...(branch && { branch }),
        ...(branchVisible !== undefined && { branchVisible: branchVisible }),
        ...(height && { height: parseFloat(height) }),
        ...(personalityType && { personalityType }),
        ...(campusVibeTags && {
          campusVibeTags: Array.isArray(campusVibeTags)
            ? campusVibeTags
            : campusVibeTags.split(","),
        }),
        ...(hangoutSpot && {
          hangoutSpot: hangoutSpot,
        }),
        ...(favoriteArtist && {
          favoriteArtist: Array.isArray(favoriteArtist)
            ? favoriteArtist
            : favoriteArtist.split(","),
        }),
        ...(funPrompt1 && { funPrompt1 }),
        ...(funPrompt2 && { funPrompt2 }),
        ...(funPrompt3 && { funPrompt3 }),
        ...(currentMood && { currentMood }),
        ...(connectionIntent && { connectionIntent }),
      },
      include: {
        profileImages: {
          orderBy: { order: "asc" },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Upload profile image
const uploadProfileImages = async (req, res) => {
  try {
    const files = req.files;
    const userId = req.userId;

    if (!files || files.length < 3 || files.length > 6) {
      return res.status(400).json({
        success: false,
        message: "Please upload between 3 to 6 images.",
      });
    }

    const imageCount = await prisma.photo.count({
      where: { userId },
    });

    const savedImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const uploadedUrl = await uploadToStorage(file, userId);

      // Save to DB
      const imageRecord = await prisma.photo.create({
        data: {
          userId: req.userId,
          url: uploadedUrl,
          order: imageCount + i,
        },
      });

      savedImages.push(imageRecord);
    }

    res.status(201).json({
      success: true,
      message: "Images uploaded & compressed successfully.",
      images: savedImages,
    });
  } catch (error) {
    console.error("uploadProfileImages error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateProfileImages = async (req, res) => {
  try {
    const userId = req.userId;
    const parsed = JSON.parse(req.body.photos); 

    const currentPhotos = await prisma.photo.findMany({
      where: { userId },
    });

    const updatedIds = parsed.filter((p) => p.id).map((p) => p.id);
    const toDelete = currentPhotos.filter((p) => !updatedIds.includes(p.id));

    // 1. Delete removed photos

    await Promise.all(
      toDelete.map(async (photo) => {
        const filePath = extractSupabasePathFromUrl(photo.url);
        if (filePath) await deleteFromStorage(filePath);
      })
    );

    await prisma.photo.deleteMany({
      where: {
        id: { in: toDelete.map((p) => p.id) },
      },
    });

    // 2. Handle new photos
    const newPhotos = parsed.filter((p) => p.isNew);

    const newPhotoData = await Promise.all(
      newPhotos.map(async (p, i) => {
        const file = req.files[i];
        const uploadedUrl = await uploadToStorage(file, userId);

        return {
          userId,
          url: uploadedUrl,
          order: p.order,
        };
      })
    );

    if (newPhotoData.length) {
      await prisma.photo.createMany({ data: newPhotoData });
    }

    // 3. Update order of existing photos
    const existingToUpdate = parsed.filter((p) => p.id && !p.isNew);

    await Promise.all(
      existingToUpdate.map((p) =>
        prisma.photo.update({
          where: { id: p.id },
          data: { order: p.order },
        })
      )
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in updateProfileImages:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get engagement stats
const getEngagementStats = async (req, res) => {
  try {
    const [likesReceived, matchesCount, messagesReceived, commentsReceived] =
      await Promise.all([
        prisma.like.count({ where: { likedId: req.userId } }),
        prisma.match.count({
          where: {
            OR: [{ user1Id: req.userId }, { user2Id: req.userId }],
            // isActive: true,
          },
        }),
        prisma.chat.count({ where: { receiverId: req.userId } }),
        prisma.comment.count({ where: { userId: req.userId } }),
      ]);

    res.status(200).json({
      success: true,
      stats: {
        likesReceived,
        matchesCount,
        messagesReceived,
        commentsReceived,
      },
    });
  } catch (error) {
    console.error("Error in getEngagementStats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get users who liked the profile
const getProfileLikes = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const likes = await prisma.like.findMany({
      where: { receiverId: req.userId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            age: true,
            profileImages: {
              take: 1,
              orderBy: { order: "asc" },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: parseInt(limit),
    });

    res.status(200).json({
      success: true,
      likes: likes.map((like) => ({
        id: like.id,
        user: like.sender,
        likedAt: like.createdAt,
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: likes.length === parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error in getProfileLikes:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get anonymous comments
const getAnonymousComments = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const comments = await prisma.comment.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: parseInt(limit),
    });

    res.status(200).json({
      success: true,
      comments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: comments.length === parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error in getAnonymousComments:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getProfileById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profileImages: {
          take: 1,
          orderBy: { order: "asc" },
        },
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error in getProfileById:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getCurrentMood = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { currentMood: true },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, currentMood: user.currentMood });
  } catch (error) {
    console.error("Error in getCurrentMood:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfileImages,
  getEngagementStats,
  getProfileLikes,
  getAnonymousComments,
  upload,
  getProfileById,
  getCurrentMood,
  updateProfileImages,
  getCompletionPercentage,
};
