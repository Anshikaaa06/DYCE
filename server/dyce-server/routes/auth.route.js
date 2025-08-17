const express = require("express");
const {
  login,
  logout,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} = require("../controllers/auth.controller.js");
const { verifyToken } = require("../middleware/verify_token.js");
const { checkHealth } = require("../controllers/health.controller.js");

const router = express.Router();

router.get("/healthy", checkHealth);

router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

module.exports = router;
