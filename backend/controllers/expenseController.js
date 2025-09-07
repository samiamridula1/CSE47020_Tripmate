const Expense = require("../models/Expense");

const getAllExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ createdAt: -1 });
        res.json(expenses);
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ message: "Error fetching expenses", error: error.message });
    }
};

const createExpense = async (req, res) => {
    try {
        const expense = new Expense(req.body);
        await expense.save();
        res.status(201).json({ message: "Expense added!", expense });
    } catch (error) {
        console.error("Error adding expense:", error);
        res.status(400).json({ message: "Error adding expense", error: error.message });
    }
};

const getUserExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.params.userId })
            .sort({ createdAt: -1 });
        res.json(expenses);
    } catch (error) {
        console.error("Error fetching user expenses:", error);
        res.status(500).json({ message: "Error fetching user expenses", error: error.message });
    }
};

const updateExpense = async (req, res) => {
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
    } catch (error) {
        console.error("Error updating expense:", error);
        res.status(500).json({ message: "Error updating expense", error: error.message });
    }
};

const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);
        
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        
        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        console.error("Error deleting expense:", error);
        res.status(500).json({ message: "Error deleting expense", error: error.message });
    }
};

module.exports = {
    getAllExpenses,
    createExpense,
    getUserExpenses,
    updateExpense,
    deleteExpense,
};
