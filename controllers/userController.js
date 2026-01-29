const User = require("../models/User");
const Membership = require("../models/Membership");

// =========================
// GET USER PROFILE
// =========================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// =========================
// UPDATE USER PROFILE
// =========================
exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      department,
      year,
      rollNo,
      address,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        phone,
        department,
        year,
        rollNo,
        address,
      },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};

// =========================
// GET USER MEMBERSHIP
// =========================
exports.getMyMembership = async (req, res) => {
  try {
    const membership = await Membership.findOne({
      userId: req.user.id,
    });

    if (!membership) {
      return res.json(null); // user hasn't applied yet
    }

    res.json(membership);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch membership" });
  }
};
