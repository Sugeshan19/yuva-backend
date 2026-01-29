const express = require("express");
const router = express.Router();

const { createMembership } = require("../controllers/membershipController");
const authMiddleware = require("../middleware/authMiddleware");

// Apply for membership
router.post("/apply", authMiddleware, createMembership);

module.exports = router;