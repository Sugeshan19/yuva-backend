const Membership = require("../models/Membership");
const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

exports.createMembership = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      rollNo,
      dob,
      gender,
      scholarType,
      department,
      year,
      previousMember,
      aboutYuva,
      expectedBenefits,
      address,
    } = req.body;

    // =========================
    // 1️⃣ BLOCK DUPLICATE MEMBERSHIP
    // =========================
    const existing = await Membership.findOne({ userId: req.user.id });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Membership already exists" });
    }

    // =========================
// 2️⃣ SET STATIC VALIDITY (OCTOBER 15)
// =========================
const yearNow = new Date().getFullYear();

// If today is after Oct 15, set validity to Oct 15 of next year
const validTill =
  new Date() > new Date(yearNow, 9, 15)
    ? new Date(yearNow + 1, 9, 15)
    : new Date(yearNow, 9, 15);

const validTillText = validTill.toLocaleDateString("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

// =========================
// 3️⃣ GENERATE MEMBERSHIP ID
// =========================
const lastMember = await Membership.findOne()
  .sort({ createdAt: -1 })
  .select("membershipId");

let seq = 1;
if (lastMember?.membershipId) {
  seq = parseInt(lastMember.membershipId.split("-")[2]) + 1;
}

const membershipId = `YUVA-${yearNow}-${String(seq).padStart(4, "0")}`;

    // =========================
    // 4️⃣ PREPARE PDF STORAGE
    // =========================
    const cardsDir = path.join(__dirname, "../uploads/cards");
    if (!fs.existsSync(cardsDir)) {
      fs.mkdirSync(cardsDir, { recursive: true });
    }

    const fileName = `${membershipId}.pdf`;
    const filePath = path.join(cardsDir, fileName);
    const cardUrl = `/uploads/cards/${fileName}`;

    // =========================
    // 5️⃣ SAVE TO DATABASE
    // =========================
    await Membership.create({
      userId: req.user.id,
      membershipId,
      name,
      email,
      phone,
      rollNo,
      dob,
      gender,
      scholarType,
      department,
      year,
      previousMember,
      aboutYuva,
      expectedBenefits,
      address,
      validTill,
      cardUrl,
    });

    // =========================
    // 6️⃣ GENERATE PDF (FILE + RESPONSE)
    // =========================
    const doc = new PDFDocument({ size: [842, 595], margin: 0 });

    const templatePath = path.join(
      __dirname,
      "../assets/membership-template.png"
    );

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);
    doc.pipe(res);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${fileName}`
    );

    // Background
    doc.image(templatePath, 0, 0, { width: 842, height: 595 });

    doc.font("Helvetica-Bold").fillColor("#000");

    // NAME
    doc.fontSize(20).text(name.trim(), 77, 320, {
      width: 789,
      align: "center",
    });

    // REG NO
    doc.fontSize(18).text(rollNo.trim(), 25, 390, {
      width: 445,
      align: "center",
    });

    // DEPT / YEAR
    doc.fontSize(16).text(`${department} / ${year}`, 550, 380, {
      width: 266,
      align: "center",
    });

    // MEMBERSHIP ID
    doc.fontSize(18).fillColor("white").text(
      `MEMBERSHIP ID: ${membershipId}`,
      0,
      550,
      { width: 842, align: "right" }
    );

    // VALIDITY
    doc.fontSize(18).text(`VALID TILL ${validTillText}`, 0, 520, {
      width: 842,
      align: "center",
    });

    doc.end();
  } catch (err) {
    console.error("MEMBERSHIP ERROR:", err);
    res.status(500).json({ message: "Membership failed" });
  }
};
