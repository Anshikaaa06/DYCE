const express = require("express");
const {
  updateSettings,
  getSettings,
  changePassword,
  toggleNotifications,
  toggleAnonymousComments,
  deleteAccount,
} = require("../controllers/settings.controller.js");
const { verifyToken } = require("../middleware/verify_token.js");
const { checkHealth } = require("../controllers/health.controller.js");

const router = express.Router();

router.get("/healthy", checkHealth);

router.use(verifyToken);

// Settings routes
router.get("/", getSettings);
router.put("/", updateSettings);

// Password change
router.put("/change-password", changePassword);

// Notification settings
router.put("/notifications", toggleNotifications);

// Anonymous comments toggle
router.put("/anonymous-comments", toggleAnonymousComments);

// Delete account
router.delete("/delete-account", deleteAccount);

module.exports = router;
