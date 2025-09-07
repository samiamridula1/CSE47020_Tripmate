const express = require("express");
const router = express.Router();
const {
  getAllExpenses,
  createExpense,
  getUserExpenses,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

// Get all expenses
router.get("/", getAllExpenses);

// Create new expense
router.post("/", createExpense);

// Get expenses by user
router.get("/user/:userId", getUserExpenses);

// Update expense
router.put("/:id", updateExpense);

// Delete expense
router.delete("/:id", deleteExpense);

module.exports = router;