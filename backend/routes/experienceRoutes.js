const express = require("express");
const Experience = require("../models/Experience");

const router = express.Router();

// GET: Get all experiences
router.get("/", async (req, res) => {
  try {
    const experiences = await Experience.find().populate('userId', 'name email');
    res.json(experiences);
  } catch (err) {
    console.error("Error fetching experiences:", err);
    res.status(500).json({ message: "Error fetching experiences" });
  }
});

// POST: Share a new experience
router.post("/", async (req, res) => {
  try {
    const { story, userId, location, imageBase64 } = req.body;

    const imageUrl = imageBase64?.startsWith("data:image")
      ? imageBase64
      : null;

    const newExperience = new Experience({ story, userId, location, imageUrl });
    await newExperience.save();

    res.status(201).json({ message: "Experience shared!", experience: newExperience });
  } catch (err) {
    console.error("Error sharing experience:", err);
    res.status(500).json({ message: "Error sharing experience" });
  }
});

// GET: Featured experiences
router.get("/featured", async (req, res) => {
  try {
    const featured = await Experience.find({ isFeatured: true }).populate('userId', 'name email');
    res.json(featured);
  } catch (err) {
    console.error("Error fetching featured experiences:", err);
    res.status(500).json({ message: "Error fetching featured experiences" });
  }
});

// GET: Get experiences by user
router.get("/user/:userId", async (req, res) => {
  try {
    const experiences = await Experience.find({ userId: req.params.userId }).populate('userId', 'name email');
    res.json(experiences);
  } catch (err) {
    console.error("Error fetching user experiences:", err);
    res.status(500).json({ message: "Error fetching user experiences" });
  }
});

// PUT: Update an experience (only by the owner)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, story, location, imageBase64 } = req.body;

    const experience = await Experience.findById(id);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    // Check if the user owns this experience
    if (experience.userId.toString() !== userId) {
      return res.status(403).json({ message: "You can only update your own experiences" });
    }

    if (story !== undefined) experience.story = story;
    if (location !== undefined) experience.location = location;
    if (imageBase64 && imageBase64.startsWith("data:image")) {
      experience.imageUrl = imageBase64;
    }
    // If no new image is uploaded, keep the existing imageUrl
    // (do nothing, just don't overwrite imageUrl)

    await experience.save();
    res.json({ message: "Experience updated successfully", experience });
  } catch (err) {
    console.error("Error updating experience:", err);
    res.status(500).json({ message: "Error updating experience" });
  }
});

// DELETE: Delete an experience (only by the owner)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body; // We'll send userId to verify ownership
    
    const experience = await Experience.findById(id);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }
    
    // Check if the user owns this experience
    if (experience.userId.toString() !== userId) {
      return res.status(403).json({ message: "You can only delete your own experiences" });
    }
    
    await Experience.findByIdAndDelete(id);
    res.json({ message: "Experience deleted successfully" });
  } catch (err) {
    console.error("Error deleting experience:", err);
    res.status(500).json({ message: "Error deleting experience" });
  }
});

module.exports = router;