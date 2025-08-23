const express = require("express");
const Checklist = require("../models/Checklist");

const router = express.Router();

// GET: Get user's checklist
router.get("/:userId", async (req, res) => {
  try {
    let checklist = await Checklist.findOne({ userId: req.params.userId });
    if (!checklist) {
      // Create a new checklist if it doesn't exist
      checklist = new Checklist({ userId: req.params.userId, items: [] });
      await checklist.save();
    }
    res.json(checklist);
  } catch (err) {
    console.error("Error fetching checklist:", err);
    res.status(500).json({ message: "Error fetching checklist" });
  }
});

// PUT: Update user's checklist
router.put("/:userId", async (req, res) => {
  try {
    const { items } = req.body;
    let checklist = await Checklist.findOne({ userId: req.params.userId });
    
    if (!checklist) {
      checklist = new Checklist({ userId: req.params.userId, items });
    } else {
      checklist.items = items;
      checklist.updatedAt = new Date();
    }
    
    await checklist.save();
    res.json(checklist);
  } catch (err) {
    console.error("Error updating checklist:", err);
    res.status(500).json({ message: "Error updating checklist" });
  }
});

// POST: Add item to checklist
router.post("/:userId/items", async (req, res) => {
  try {
    const { text } = req.body;
    let checklist = await Checklist.findOne({ userId: req.params.userId });
    
    if (!checklist) {
      checklist = new Checklist({ userId: req.params.userId, items: [] });
    }
    
    checklist.items.push({ text, completed: false });
    checklist.updatedAt = new Date();
    await checklist.save();
    
    res.json(checklist);
  } catch (err) {
    console.error("Error adding checklist item:", err);
    res.status(500).json({ message: "Error adding checklist item" });
  }
});

// DELETE: Remove item from checklist
router.delete("/:userId/items/:itemId", async (req, res) => {
  try {
    const checklist = await Checklist.findOne({ userId: req.params.userId });
    if (!checklist) {
      return res.status(404).json({ message: "Checklist not found" });
    }
    
    checklist.items = checklist.items.filter(item => item._id.toString() !== req.params.itemId);
    checklist.updatedAt = new Date();
    await checklist.save();
    
    res.json(checklist);
  } catch (err) {
    console.error("Error removing checklist item:", err);
    res.status(500).json({ message: "Error removing checklist item" });
  }
});

module.exports = router;
