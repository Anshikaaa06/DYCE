const { PrismaClient } = require("../generated/prisma/client.js");
const { triggerNotification } = require("../services/notification.service.js");

const prisma = new PrismaClient();

// Get profiles for matching (excluding already liked/matched/blocked users)
const getProfiles = async (req, res) => {
  try {
    const {
      college,
      minAge,
      maxAge,
      gender,
      personalityTypes,
      page = 1,
      limit = 10,
    } = req.query;

    const skip = (page - 1) * limit;

    // Get users that current user has already interacted with
    const interactedUsers = await prisma.like.findMany({
      where: { likerId: req.userId },
      select: { likedId: true },
    });

    const blockedUsers = await prisma.block.findMany({
      where: { blockerId: req.userId },
      select: { blockedId: true },
    });

    const interactedUserIds = interactedUsers.map((like) => like.likedId);
    interactedUserIds.push(req.userId); // Exclude self

    const blockedUserIds = blockedUsers.map((block) => block.blockedId);
    interactedUserIds.push(...blockedUserIds);

    const whereClause = {
      id: { notIn: interactedUserIds },
      verified: true,
      AND: [],
    };

    // Apply filters
    if (college) {
      whereClause.AND.push({
        branch: { contains: college, mode: "insensitive" },
      });
    }

    if (minAge || maxAge) {
      const ageFilter = {};
      if (minAge) ageFilter.gte = parseInt(minAge);
      if (maxAge) ageFilter.lte = parseInt(maxAge);
      whereClause.AND.push({ age: ageFilter });
    }

    if (gender) {
      whereClause.AND.push({ gender });
    }

    if (
      personalityTypes &&
      Array.isArray(personalityTypes) &&
      personalityTypes.length > 0
    ) {
      whereClause.AND.push({
        personalityType: {
          in: personalityTypes,
        },
      });
    }

    const profiles = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        age: true,
        college: true,
        campusVibeTags: true,
        hangoutSpot: true,
        branch: true,
        branchVisible: true,
        height: true,
        gender: true,
        interests: true,
        personalityType: true,
        favoriteArtist: true,
        funPrompt1: true,
        funPrompt2: true,
        funPrompt3: true,
        allowComments: true,
        connectionIntent: true,
        currentMood: true,
        profileImages: {
          orderBy: { order: "asc" },
        },
      },
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      profiles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: profiles.length === parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error in getProfiles:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Like a profile
const likeProfile = async (req, res) => {
  try {
    const { profileId } = req.params;

    if (profileId === req.userId) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot like your own profile" });
    }

    // Check if already liked
    const existingLike = await prisma.like.findFirst({
      where: {
        likerId: req.userId,
        likedId: profileId,
      },
    });

    if (existingLike) {
      return res
        .status(400)
        .json({ success: false, message: "Profile already liked" });
    }

    // Create like
    const like = await prisma.like.create({
      data: {
        likerId: req.userId,
        likedId: profileId,
      },
    });

    // Check if the other user has liked back (mutual like = match)
    const mutualLike = await prisma.like.findFirst({
      where: {
        likerId: profileId,
        likedId: req.userId,
      },
    });

    let match = null;
    if (mutualLike) {
      // Create match
      match = await prisma.match.create({
        data: {
          user1Id: req.userId,
          user2Id: profileId,
          compatibility: await calculateCompatibility(req.userId, profileId),
        },
      });

      await triggerNotification(req.userId, "Match Notification", "You have a new match!");
      await triggerNotification(profileId, "Match Notification", "You have a new match!");
    }

    res.status(200).json({
      success: true,
      message: match ? "It's a match!" : "Profile liked",
      like,
      match,
      isMatch: !!match,
    });
  } catch (error) {
    console.error("Error in likeProfile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Pass/skip a profile
const passProfile = async (req, res) => {
  try {
    const { profileId } = req.params;

    // We can optionally store passes for analytics
    // For now, we'll just return success
    res.status(200).json({
      success: true,
      message: "Profile passed",
    });
  } catch (error) {
    console.error("Error in passProfile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Add anonymous comment on profile
const addComment = async (req, res) => {
  try {
    const { profileId } = req.params;
    const { content, anonymous = true } = req.body;

    if (!content || content.trim().length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Comment content is required" });
    }

    // Check if the profile allows comments
    const targetUser = await prisma.user.findUnique({
      where: { id: profileId },
      select: { allowComments: true },
    });

    if (!targetUser || !targetUser.allowComments) {
      return res.status(403).json({
        success: false,
        message: "Comments are not allowed on this profile",
      });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        anonymous,
        commenterId: req.userId,
        userId: profileId,
      },
    });

    await triggerNotification(profileId, "Someone left a comment on your profile!", content);


    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: {
        id: comment.id,
        content: comment.content,
        anonymous: comment.anonymous,
        createdAt: comment.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in addComment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get user's matches
const getMatches = async (req, res) => {
  try {
    const { inDetail } = req.query;
    const detailedSelector = {
      id: true,
      name: true,
      age: true,
      college: true,
      campusVibeTags: true,
      hangoutSpot: true,
      branch: true,
      branchVisible: true,
      height: true,
      gender: true,
      interests: true,
      personalityType: true,
      favoriteArtist: true,
      funPrompt1: true,
      funPrompt2: true,
      funPrompt3: true,
      allowComments: true,
      connectionIntent: true,
      currentMood: true,
      profileImages: {
        orderBy: { order: "asc" },
      },
    };
    const briefSelector = {
      id: true,
      name: true,
      age: true,
      branch: true,
      profileImages: {
        take: 1,
        orderBy: { order: "asc" },
      },
    };
    const matches = await prisma.match.findMany({
      where: {
        OR: [{ user1Id: req.userId }, { user2Id: req.userId }],
      },
      include: {
        user1: {
          select: inDetail ? detailedSelector : briefSelector,
        },
        user2: {
          select: inDetail ? detailedSelector : briefSelector,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Format matches to always show the other user
    const formattedMatches = matches.map((match) => ({
      id: match.id,
      compatibility: match.compatibility,
      createdAt: match.createdAt,
      user: match.user1Id === req.userId ? match.user2 : match.user1,
    }));

    res.status(200).json({
      success: true,
      matches: formattedMatches,
    });
  } catch (error) {
    console.error("Error in getMatches:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const blockProfile = async (req, res) => {
  try {
    const { profileId } = req.params;
    if (profileId === req.userId) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot block yourself" });
    }
    // Check if already blocked
    const existingBlock = await prisma.block.findFirst({
      where: {
        blockerId: req.userId,
        blockedId: profileId,
      },
    });
    if (existingBlock) {
      return res
        .status(400)
        .json({ success: false, message: "Profile already blocked" });
    }
    // Create block
    await prisma.block.create({
      data: {
        blockerId: req.userId,
        blockedId: profileId,
      },
    });

    await prisma.like.deleteMany({
      where: {
        OR: [
          { likerId: req.userId, likedId: profileId },
          { likerId: profileId, likedId: req.userId },
        ],
      },
    });

    await prisma.match.deleteMany({
      where: {
        OR: [
          { user1Id: req.userId, user2Id: profileId },
          { user1Id: profileId, user2Id: req.userId },
        ],
      },
    });
    
    await triggerNotification(profileId, "Profile Blocked", `You have been blocked by ${req.userId}. You won't see their profile anymore.`);
    res.status(200).json({
      success: true,
      message: "Profile blocked successfully",
    });
  } catch (error) {
    console.error("Error in blockProfile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const unmatchProfile = async (req, res) => {
  try {
    const { matchId } = req.params;
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      select: { user1Id: true, user2Id: true },
    });
    if (!match) {
      return res.status(404).json({ success: false, message: "Match not found" });
    }
    const isUser1 = match.user1Id === req.userId;
    const otherUserId = isUser1 ? match.user2Id : match.user1Id;
    await prisma.match.delete({
      where: { id: matchId },
    });
    
    await triggerNotification(otherUserId, "Match Unmatched", `Your match with ${isUser1 ? "you" : "them"} has been unmatched.`);
    res.status(200).json({ success: true, message: "Unmatched successfully" });
  } catch (error) {
    console.error("Error in unmatchProfile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Calculate compatibility between two users (placeholder implementation)
// const calculateCompatibility = async (user1Id, user2Id) => {
//   try {
//     // Fetch both users
//     const [user1, user2] = await Promise.all([
//       prisma.user.findUnique({
//         where: { id: user1Id },
//         select: { hobbies: true, personalityType: true, age: true },
//       }),
//       prisma.user.findUnique({
//         where: { id: user2Id },
//         select: { hobbies: true, personalityType: true, age: true },
//       }),
//     ]);

//     if (!user1 || !user2) return 0;

//     let score = 0;

//     // Common hobbies (40% weight)
//     if (user1.hobbies && user2.hobbies) {
//       const commonHobbies = user1.hobbies.filter((hobby) =>
//         user2.hobbies.includes(hobby)
//       );
//       const hobbyScore =
//         (commonHobbies.length /
//           Math.max(user1.hobbies.length, user2.hobbies.length)) *
//         40;
//       score += hobbyScore;
//     }

//     // Personality compatibility (30% weight)
//     if (user1.personalityType && user2.personalityType) {
//       if (user1.personalityType === user2.personalityType) {
//         score += 20;
//       } else if (
//         (user1.personalityType === "INTROVERT" &&
//           user2.personalityType === "EXTROVERT") ||
//         (user1.personalityType === "EXTROVERT" &&
//           user2.personalityType === "INTROVERT")
//       ) {
//         score += 30; // Opposites attract
//       } else {
//         score += 25; // Ambivert combinations
//       }
//     }

//     // Age compatibility (30% weight)
//     const ageDiff = Math.abs(user1.age - user2.age);
//     if (ageDiff <= 2) score += 30;
//     else if (ageDiff <= 4) score += 20;
//     else if (ageDiff <= 6) score += 10;

//     return Math.min(Math.round(score), 100);
//   } catch (error) {
//     console.error("Error calculating compatibility:", error);
//     return 0;
//   }
// };

const calculateCompatibility = async (user1Id, user2Id) => {
  try {
    // Fetch both users with relevant fields
    const [user1, user2] = await Promise.all([
      prisma.user.findUnique({
        where: { id: user1Id },
        select: { interests: true, personalityType: true, age: true },
      }),
      prisma.user.findUnique({
        where: { id: user2Id },
        select: { interests: true, personalityType: true, age: true },
      }),
    ]);

    if (!user1 || !user2) return 0;

    let score = 0;

    // 1. Common Interests (40% weight)
    if (user1.interests?.length && user2.interests?.length) {
      const commonInterests = user1.interests.filter((i) =>
        user2.interests.includes(i)
      );
      const interestScore =
        (commonInterests.length /
          Math.max(user1.interests.length, user2.interests.length)) *
        40;
      score += interestScore;
    }

    // 2. Personality Compatibility (30% weight)
    if (user1.personalityType && user2.personalityType) {
      const type1 = user1.personalityType;
      const type2 = user2.personalityType;

      if (type1 === type2) {
        score += 20; // Same type
      } else if (
        (type1 === "INTROVERT" && type2 === "EXTROVERT") ||
        (type1 === "EXTROVERT" && type2 === "INTROVERT")
      ) {
        score += 30; // Opposites attract
      } else {
        score += 25; // Ambivert with other types
      }
    }

    // 3. Age Compatibility (30% weight)
    if (typeof user1.age === "number" && typeof user2.age === "number") {
      const ageDiff = Math.abs(user1.age - user2.age);
      if (ageDiff <= 2) score += 30;
      else if (ageDiff <= 4) score += 20;
      else if (ageDiff <= 6) score += 10;
      // no points beyond 6+ years
    }

    return Math.min(Math.round(score), 100);
  } catch (error) {
    console.error("Error calculating compatibility:", error);
    return 0;
  }
};

// Get compatibility score between two users
const getCompatibilityScore = async (req, res) => {
  try {
    const { userId } = req.params;
    const score = await calculateCompatibility(req.userId, userId);

    res.status(200).json({
      success: true,
      compatibility: score,
    });
  } catch (error) {
    console.error("Error in getCompatibilityScore:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



module.exports = {
  getProfiles,
  likeProfile,
  passProfile,
  addComment,
  getMatches,
  getCompatibilityScore,
  unmatchProfile,
  blockProfile 
};
