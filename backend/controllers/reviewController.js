const Review = require("../models/Review");

const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        console.error("Error fetching reviews:", err);
        res.status(500).json({ message: "Error fetching reviews" });
    }
};

const createReview = async (req, res) => {
    try {
        const { user, content, rating, location } = req.body;
        const newReview = new Review({ user, content, rating, location });
        await newReview.save();
        await newReview.populate("user", "name email");
        res.status(201).json({ message: "Review added!", review: newReview });
    } catch (err) {
        console.error("Error adding review:", err);
        res.status(500).json({ message: "Error adding review" });
    }
};

const getReviewsByLocation = async (req, res) => {
    try {
        const reviews = await Review.find({ location: req.params.location })
            .populate("user", "name email")
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        console.error("Error fetching reviews:", err);
        res.status(500).json({ message: "Error fetching reviews" });
    }
};

const getReviewsByUser = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.params.userId })
            .populate("user", "name email")
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        console.error("Error fetching user reviews:", err);
        res.status(500).json({ message: "Error fetching user reviews" });
    }
};

const updateReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate("user", "name email");
        
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        
        res.json({ message: "Review updated!", review });
    } catch (err) {
        console.error("Error updating review:", err);
        res.status(500).json({ message: "Error updating review" });
    }
};

const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        res.json({ message: "Review deleted successfully" });
    } catch (err) {
        console.error("Error deleting review:", err);
        res.status(500).json({ message: "Error deleting review" });
    }
};

module.exports = {
    getAllReviews,
    createReview,
    getReviewsByLocation,
    getReviewsByUser,
    updateReview,
    deleteReview,
};
