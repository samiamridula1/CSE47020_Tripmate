const Suggestion = require("../models/Suggestion");

const createSuggestion = async (req, res) => {
    try {
        const { title, description, location, gender, userId } = req.body;

        const newSuggestion = new Suggestion({
            title,
            description,
            location,
            gender,
            userId
        });

        const saved = await newSuggestion.save();
        res.status(201).json(saved);
    } catch (err) {
        console.error("Error saving suggestion:", err);
        res.status(500).json({ message: "Error saving suggestion" });
    }
};

const getAllSuggestions = async (req, res) => {
    try {
        const suggestions = await Suggestion.find().populate('userId', 'name email');
        res.json(suggestions);
    } catch (err) {
        console.error("Error fetching suggestions:", err);
        res.status(500).json({ message: "Error fetching suggestions" });
    }
};

const getSuggestionsByGender = async (req, res) => {
    try {
        const userSuggestions = await Suggestion.find({ 
            gender: req.params.gender 
        }).populate('userId', 'name email');
        res.json(userSuggestions);
    } catch (err) {
        console.error("Error fetching user suggestions:", err);
        res.status(500).json({ message: "Error fetching user suggestions" });
    }
};

const getSuggestionsByUser = async (req, res) => {
    try {
        const userSuggestions = await Suggestion.find({ 
            userId: req.params.userId 
        }).populate('userId', 'name email');
        res.json(userSuggestions);
    } catch (err) {
        console.error("Error fetching user suggestions:", err);
        res.status(500).json({ message: "Error fetching user suggestions" });
    }
};

const updateSuggestion = async (req, res) => {
    try {
        const suggestion = await Suggestion.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('userId', 'name email');
        
        if (!suggestion) {
            return res.status(404).json({ message: "Suggestion not found" });
        }
        
        res.json({ message: "Suggestion updated!", suggestion });
    } catch (err) {
        console.error("Error updating suggestion:", err);
        res.status(500).json({ message: "Error updating suggestion" });
    }
};

const deleteSuggestion = async (req, res) => {
    try {
        const suggestion = await Suggestion.findByIdAndDelete(req.params.id);
        if (!suggestion) {
            return res.status(404).json({ message: "Suggestion not found" });
        }
        res.json({ message: "Suggestion deleted successfully" });
    } catch (err) {
        console.error("Error deleting suggestion:", err);
        res.status(500).json({ message: "Error deleting suggestion" });
    }
};

module.exports = {
    createSuggestion,
    getAllSuggestions,
    getSuggestionsByGender,
    getSuggestionsByUser,
    updateSuggestion,
    deleteSuggestion,
};
