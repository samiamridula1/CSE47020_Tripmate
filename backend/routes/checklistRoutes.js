const express = require("express");
const {
    getUserChecklist,
    updateUserChecklist,
    addChecklistItem,
    removeChecklistItem,
} = require("../controllers/checklistController");

const router = express.Router();

// GET: Get user's checklist
router.get("/:userId", getUserChecklist);

// PUT: Update user's checklist
router.put("/:userId", updateUserChecklist);

// POST: Add item to checklist
router.post("/:userId/items", addChecklistItem);

// DELETE: Remove item from checklist
router.delete("/:userId/items/:itemId", removeChecklistItem);

module.exports = router;
