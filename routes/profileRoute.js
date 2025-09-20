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
 * @desc    Create a new profile
 */
router.post("/", upload.single("profileImg"), async (req, res) => {
  try {
    // Parse roles (stringified array from frontend)
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

    // Parse socials (stringified object from frontend)
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

    const profile = new Profile({
      name: req.body.name || "Neelamohan",
      profileImg: req.file ? `/uploads/${req.file.filename}` : "",
      roles,
      socialLinks: socials,
      cvLink: req.body.cvLink || "",
    });

    await profile.save();

    res.status(201).json({
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
