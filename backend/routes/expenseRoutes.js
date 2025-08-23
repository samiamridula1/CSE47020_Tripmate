const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// Get all expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find()
      .sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ message: "Error fetching expenses" });
  }
});

// POST /api/expenses
router.post("/", async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json({ message: "Expense added!", expense });
  } catch (err) {
    console.error("Error adding expense:", err);
    res.status(400).json({ message: "Error adding expense", error: err.message });
  }
});

// GET /api/expenses/user/:userId
router.get("/user/:userId", async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    console.error("Error fetching user expenses:", err);
    res.status(500).json({ message: "Error fetching user expenses" });
  }
});

// Update expense
router.put("/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    
    res.json({ message: "Expense updated!", expense });
  } catch (err) {
    console.error("Error updating expense:", err);
    res.status(500).json({ message: "Error updating expense" });
  }
});

// Delete expense
router.delete("/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    
    res.json({ message: "Expense deleted!" });
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(500).json({ message: "Error deleting expense" });
  }
});

module.exports = router;