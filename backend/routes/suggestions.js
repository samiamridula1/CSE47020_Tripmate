const express = require("express");
const {
    createSuggestion,
    getAllSuggestions,
    getSuggestionsByGender,
    getSuggestionsByUser,
    updateSuggestion,
    deleteSuggestion,
} = require("../controllers/suggestionController");

const router = express.Router();

// Create a new suggestion
router.post("/", createSuggestion);

// Get all suggestions
router.get("/", getAllSuggestions);

// Get suggestions by gender
router.get("/gender/:gender", getSuggestionsByGender);

// Get suggestions by user
router.get("/user/:userId", getSuggestionsByUser);

// Update suggestion
router.put("/:id", updateSuggestion);

// Delete suggestion
router.delete("/:id", deleteSuggestion);
module.exports = router;