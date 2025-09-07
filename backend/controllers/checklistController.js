const Checklist = require("../models/Checklist");

const getUserChecklist = async (req, res) => {
    try {
        let checklist = await Checklist.findOne({ userId: req.params.userId });
        if (!checklist) {
            checklist = new Checklist({ userId: req.params.userId, items: [] });
            await checklist.save();
        }
        res.json(checklist);
    } catch (err) {
        console.error("Error fetching checklist:", err);
        res.status(500).json({ message: "Error fetching checklist" });
    }
};

const updateUserChecklist = async (req, res) => {
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
};

const addChecklistItem = async (req, res) => {
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
};

const removeChecklistItem = async (req, res) => {
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
};

module.exports = {
    getUserChecklist,
    updateUserChecklist,
    addChecklistItem,
    removeChecklistItem,
};
