const express = require('express');
const router = express.Router();
const About = require("../models/About");

// ---------------- CREATE or UPDATE About ----------------
router.post("/", async (req, res) => {
  try {
    // If one About exists, update it; else create new
    const about = await About.findOneAndUpdate(
      {}, // match first or only document
      req.body,
      { new: true, upsert: true, runValidators: true } // create if not exists
    );

    res.status(201).json(about);
  } catch (error) {
    console.error("Error creating About:", error);
    res.status(500).json({ error: error.message });
  }
});

// ---------------- READ About ----------------
router.get("/", async (req, res) => {
  try {
    const about = await About.find();
    if (about.length > 0) {
      res.status(200).json(about);
    } else {
      res.status(404).json({ message: "About not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- UPDATE About by ID ----------------
router.put("/:id", async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "ID parameter is required" });
    }

    const about = await About.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!about) {
      return res.status(404).json({ message: "About not found" });
    }

    res.status(200).json(about);
  } catch (error) {
    console.error("Error updating About:", error);
    res.status(500).json({ error: error.message });
  }
});

// ---------------- DELETE All About ----------------
router.delete("/", async (req, res) => {
  try {
    await About.deleteMany({});
    res.status(200).json({ message: "All About entries deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting About entries", error: error.message });
  }
});

module.exports = router;
