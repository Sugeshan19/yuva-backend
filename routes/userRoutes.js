const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// ✅ ADD THIS LINE
const userController = require("../controllers/userController");

// PROFILE
router.get("/profile", authMiddleware, userController.getProfile);
router.put("/profile", authMiddleware, userController.updateProfile);

// MEMBERSHIP
router.get("/membership", authMiddleware, userController.getMyMembership);

module.exports = router;
