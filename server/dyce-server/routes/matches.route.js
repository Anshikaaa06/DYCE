const express = require("express");
const router = express.Router();
const matchController = require("../controllers/matches.controller");
const { verifyToken } = require("../middleware/verify_token");
const { checkHealth } = require("../controllers/health.controller");

router.get("/healthy", checkHealth);

router.use(verifyToken);

// Get profiles for matching with filters
router.get("/profiles", matchController.getProfiles);

// Like a user profile
router.post("/like/:profileId", matchController.likeProfile);

// Pass (skip) a profile (can be a no-op or tracked later)
router.post("/pass/:profileId", matchController.passProfile);

router.post("/block/:profileId", matchController.blockProfile);

router.post("/unmatch/:matchId", matchController.unmatchProfile);

// Add anonymous comment to a profile
router.post("/comment/:profileId", matchController.addComment);

// Get current user's matches
router.get("/", matchController.getMatches);

// Get compatibility score with another user
router.get("/compatibility/:userId", matchController.getCompatibilityScore);

module.exports = router;
