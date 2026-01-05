const express = require("express");
const router = express.Router();

const {
  register,
  verifyEmail,
  login,
  googleLogin,
} = require("../controllers/authController");

// AUTH ROUTES
router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/google", googleLogin);

module.exports = router;
