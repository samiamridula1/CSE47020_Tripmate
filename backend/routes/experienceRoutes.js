const express = require("express");
const {
  getAllExperiences,
  createExperience,
  getFeaturedExperiences,
  getUserExperiences,
  updateExperience,
  deleteExperience,
} = require("../controllers/experienceController");

const router = express.Router();

// GET: Get all experiences
router.get("/", getAllExperiences);

// POST: Share a new experience
router.post("/", createExperience);

// GET: Featured experiences
router.get("/featured", getFeaturedExperiences);

// GET: Get experiences by user
router.get("/user/:userId", getUserExperiences);

// PUT: Update an experience (only by the owner)
router.put("/:id", updateExperience);

// DELETE: Delete an experience (only by the owner)
router.delete("/:id", deleteExperience);

module.exports = router;