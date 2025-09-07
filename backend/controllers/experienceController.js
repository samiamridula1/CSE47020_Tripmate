const Experience = require("../models/Experience");

// @desc    Get all experiences
// @route   GET /api/experiences
// @access  Public
const getAllExperiences = async (req, res) => {
    try {
        const experiences = await Experience.find().populate('userId', 'name email');
        res.json(experiences);
    } catch (error) {
        console.error("Error fetching experiences:", error);
        res.status(500).json({ message: "Error fetching experiences", error: error.message });
    }
};

// @desc    Create a new experience
// @route   POST /api/experiences
// @access  Public
const createExperience = async (req, res) => {
    try {
        const { story, userId, location, imageBase64 } = req.body;

        // Validate image data
        const imageUrl = imageBase64?.startsWith("data:image") ? imageBase64 : null;

        const newExperience = new Experience({ 
            story, 
            userId, 
            location, 
            imageUrl 
        });
        
        await newExperience.save();

        res.status(201).json({ 
            message: "Experience shared!", 
            experience: newExperience 
        });
    } catch (error) {
        console.error("Error sharing experience:", error);
        res.status(500).json({ message: "Error sharing experience", error: error.message });
    }
};

// @desc    Get featured experiences
// @route   GET /api/experiences/featured
// @access  Public
const getFeaturedExperiences = async (req, res) => {
    try {
        const featured = await Experience.find({ isFeatured: true }).populate('userId', 'name email');
        res.json(featured);
    } catch (error) {
        console.error("Error fetching featured experiences:", error);
        res.status(500).json({ message: "Error fetching featured experiences", error: error.message });
    }
};

// @desc    Get experiences by user
// @route   GET /api/experiences/user/:userId
// @access  Public
const getUserExperiences = async (req, res) => {
    try {
        const experiences = await Experience.find({ userId: req.params.userId }).populate('userId', 'name email');
        res.json(experiences);
    } catch (error) {
        console.error("Error fetching user experiences:", error);
        res.status(500).json({ message: "Error fetching user experiences", error: error.message });
    }
};

// @desc    Update an experience
// @route   PUT /api/experiences/:id
// @access  Public
const updateExperience = async (req, res) => {
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

        // Update fields
        if (story !== undefined) experience.story = story;
        if (location !== undefined) experience.location = location;
        if (imageBase64 && imageBase64.startsWith("data:image")) {
            experience.imageUrl = imageBase64;
        }

        await experience.save();
        res.json({ message: "Experience updated!", experience });
    } catch (error) {
        console.error("Error updating experience:", error);
        res.status(500).json({ message: "Error updating experience", error: error.message });
    }
};

// @desc    Delete an experience
// @route   DELETE /api/experiences/:id
// @access  Public
const deleteExperience = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const experience = await Experience.findById(id);
        if (!experience) {
            return res.status(404).json({ message: "Experience not found" });
        }

        // Check if the user owns this experience
        if (experience.userId.toString() !== userId) {
            return res.status(403).json({ message: "You can only delete your own experiences" });
        }

        await Experience.findByIdAndDelete(id);
        res.json({ message: "Experience deleted successfully!" });
    } catch (error) {
        console.error("Error deleting experience:", error);
        res.status(500).json({ message: "Error deleting experience", error: error.message });
    }
};

module.exports = {
    getAllExperiences,
    createExperience,
    getFeaturedExperiences,
    getUserExperiences,
    updateExperience,
    deleteExperience,
};
