const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminController = require("../controllers/adminController");

// ADMIN STATS
router.get("/stats", authMiddleware, adminController.getAdminStats);

// DOWNLOAD MEMBERS EXCEL
router.get(
  "/download-members",
  authMiddleware,
  adminController.downloadMembersExcel
);

router.get(
  "/members",
  authMiddleware,
  adminController.getAllMembers
);


module.exports = router;
