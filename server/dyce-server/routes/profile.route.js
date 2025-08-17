const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profile.controller");
const { verifyToken } = require("../middleware/verify_token");
const { checkHealth } = require("../controllers/health.controller");

router.get("/healthy", checkHealth);

router.use(verifyToken);

// Get current user's profile
router.get("/", profileController.getProfile);

// Update user profile
router.put("/", profileController.updateProfile);

// Upload profile image
router.post(
  "/upload-images",
  profileController.upload.array("images", 6),
  profileController.uploadProfileImages
);

router.post(
  "/update-images",
  profileController.upload.any(),
  profileController.updateProfileImages
);

router.get("/completion", profileController.getCompletionPercentage);

// Get engagement stats
router.get("/stats", profileController.getEngagementStats);

// Get users who liked the current profile
router.get("/likes", profileController.getProfileLikes);

// Get received anonymous comments
router.get("/comments", profileController.getAnonymousComments);

router.get("/mood", profileController.getCurrentMood);

// Get user's profile by id
router.get("/:id", profileController.getProfileById);

module.exports = router;
