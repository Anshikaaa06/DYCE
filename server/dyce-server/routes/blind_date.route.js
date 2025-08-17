const express = require("express");
const router = express.Router();
const blindDateController = require("../controllers/blind_date.controller");
const { verifyToken } = require("../middleware/verify_token");
const { checkHealth } = require("../controllers/health.controller");

router.get("/healthy", checkHealth);

router.use(verifyToken);

// Start a new blind date
router.post("/start", blindDateController.startBlindDate);

// Get the current active blind date session
router.get("/current", blindDateController.getCurrentBlindDate);

// Send a message within a blind date
router.post("/message", blindDateController.sendBlindDateMessage);

// Agree to reveal identity in a blind date
router.post("/:blindDateId/reveal", blindDateController.agreeToReveal);

// End a blind date manually
router.post("/:blindDateId/end", blindDateController.endBlindDate);

// Get blind date history
router.get("/history", blindDateController.getBlindDateHistory);

module.exports = router;
