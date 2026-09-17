const express = require("express");
const {
  signup,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/verify-email/:token", verifyEmail);
router.post(
  "/resend-verification",
  resendVerificationEmail
);

router.get("/me", protect, getMe);
router.post("/logout", logout);

module.exports = router;