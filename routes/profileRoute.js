const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Profile = require("../models/profile");

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

/**
 * @route   POST /api/profiles
 * @desc    Create a new profile (replaces old one)
 */
router.post("/", upload.single("profileImg"), async (req, res) => {
  try {
    // ✅ Step 1: Find and delete previous profile
    const oldProfile = await Profile.findOne().sort({ createdAt: -1 });

    if (oldProfile) {
      // Delete old image file (if exists)
      if (oldProfile.profileImg) {
        const oldImagePath = path.join(__dirname, "..", oldProfile.profileImg);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log("🗑️ Deleted old image:", oldImagePath);
        }
      }

      // Delete old document
      await Profile.deleteOne({ _id: oldProfile._id });
      console.log("🗑️ Deleted old profile record");
    }

    // ✅ Step 2: Parse fields from frontend
    let roles = [];
    if (req.body.roles) {
      try {
        roles = JSON.parse(req.body.roles);
      } catch {
        roles = Array.isArray(req.body.roles)
          ? req.body.roles
          : [req.body.roles];
      }
    }

    let socials = {};
    if (req.body.socialLinks) {
      try {
        socials = JSON.parse(req.body.socialLinks);
      } catch {
        socials = {
          linkedin: req.body.linkedin || "",
          github: req.body.github || "",
          twitter: req.body.twitter || "",
          instagram: req.body.instagram || "",
        };
      }
    }

    // ✅ Step 3: Create new profile
    const profile = new Profile({
      name: req.body.name || "Neelamohan",
      profileImg: req.file ? `/uploads/${req.file.filename}` : "",
      roles,
      socialLinks: socials,
      cvLink: req.body.cvLink || "",
    });

    await profile.save();

    // ✅ Step 4: Send response
    res.status(201).json({
      message: "✅ Profile saved successfully (old data removed)",
      name: profile.name,
      image: profile.profileImg,
      roles: profile.roles,
      socials: profile.socialLinks,
      cv: profile.cvLink,
    });
  } catch (err) {
    console.error("❌ Error saving profile:", err.message);
    res.status(500).json({ error: "Failed to save profile" });
  }
});

/**
 * @route   GET /api/profiles
 * @desc    Get the latest profile
 */
router.get("/", async (req, res) => {
  try {
    const profile = await Profile.findOne().sort({ createdAt: -1 });
    if (!profile) return res.json({});

    res.json({
      name: profile.name,
      image: profile.profileImg,
      roles: profile.roles,
      socials: profile.socialLinks,
      cv: profile.cvLink,
    });
  } catch (err) {
    console.error("❌ Error fetching profile:", err.message);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

module.exports = router;
