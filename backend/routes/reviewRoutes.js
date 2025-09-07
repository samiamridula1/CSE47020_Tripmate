const express = require("express");
const {
    getAllReviews,
    createReview,
    getReviewsByLocation,
    getReviewsByUser,
    updateReview,
    deleteReview,
} = require("../controllers/reviewController");

const router = express.Router();

// Get all reviews
router.get("/", getAllReviews);

// POST a new review
router.post("/", createReview);

// GET reviews by location
router.get("/location/:location", getReviewsByLocation);

// Get reviews by user
router.get("/user/:userId", getReviewsByUser);

// Update review
router.put("/:id", updateReview);

// Delete review
router.delete("/:id", deleteReview);

module.exports = router;
