const Membership = require("../models/Membership");

exports.getAdminStats = async (req, res) => {
  try {
    // SECURITY CHECK
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const totalApplications = await Membership.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const newThisWeek = await Membership.countDocuments({
      createdAt: { $gte: weekAgo },
    });

    const activeMembers = await Membership.countDocuments({
      validTill: { $gte: new Date() },
    });

    res.json({
      totalApplications,
      activeMembers,
      newThisWeek,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};

const ExcelJS = require("exceljs");

exports.downloadMembersExcel = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const members = await Membership.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("YUVA Members");

    worksheet.columns = [
      { header: "Membership ID", key: "membershipId", width: 25 },
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Register No", key: "rollNo", width: 20 },
      { header: "Department", key: "department", width: 30 },
      { header: "Year", key: "year", width: 15 },
      { header: "Applied On", key: "createdAt", width: 20 },
      { header: "Valid Till", key: "validTill", width: 20 },
    ];

    members.forEach((m) => {
      worksheet.addRow({
        membershipId: m.membershipId,
        name: m.name,
        email: m.email,
        phone: m.phone,
        rollNo: m.rollNo,
        department: m.department,
        year: m.year,
        createdAt: m.createdAt.toLocaleDateString(),
        validTill: m.validTill
          ? m.validTill.toLocaleDateString()
          : "—",
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=yuva_members.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Excel download failed" });
  }
};

exports.getAllMembers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const search = req.query.search || "";

    const members = await Membership.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { rollNo: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    res.json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch members" });
  }
};
