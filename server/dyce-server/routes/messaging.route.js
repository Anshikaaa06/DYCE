const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messaging.controller");

const { verifyToken } = require("../middleware/verify_token.js");
const { checkHealth } = require("../controllers/health.controller.js");

router.get("/healthy", checkHealth);

router.use(verifyToken);

// Get all chat conversations for the logged-in user
router.get("/", messageController.getChatConversations);

// Get messages with a specific user (pagination supported)
router.get("/:userId/messages", messageController.getMessages);

// Send a message to a specific user
router.post(
  "/:userId/message",
  messageController.upload.single("media"), // Handle media upload
  messageController.sendMessage
);

// Unmatch a user
router.post("/:userId/unmatch", messageController.unmatchUser);

module.exports = router;
