const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // ✅ ONE MEMBERSHIP PER USER
  },

  // MEMBERSHIP ID
  membershipId: {
    type: String,
    required: true,
    unique: true,
  },

  // CARD DATA
  name: String,
  rollNo: String,
  department: String,
  year: String,

  // FULL FORM DATA
  email: String,
  phone: String,
  dob: String,
  gender: String,
  scholarType: String,
  previousMember: String,
  aboutYuva: String,
  expectedBenefits: String,
  address: String,

  // MEMBERSHIP VALIDITY
  validTill: {
    type: Date,
    required: true,
  },

  // ✅ CARD PDF PATH (VERY IMPORTANT)
  cardUrl: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Membership", membershipSchema);
