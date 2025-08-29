const express = require("express");
const router = express.Router();
const User = require("../models/User");
const TripGroup = require("../models/TripGroup");

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, gender } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use." });
    }

    const newUser = new User({ name, email, password, gender });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Failed to register user." });
  }
});

// Login with email and password
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed." });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users." });
  }
});

// Filter users by gender
router.get("/filter", async (req, res) => {
  try {
    const { gender } = req.query;
    
    if (!gender) {
      return res.status(400).json({ error: "Gender parameter is required." });
    }
    
    const users = await User.find({ gender: gender }).select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error("Filter users error:", err);
    res.status(500).json({ error: "Failed to filter users." });
  }
});

// Get user by ID
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found." });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user." });
  }
});

// Update user profile
router.put("/:userId", async (req, res) => {
  try {
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, updates, { new: true });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile." });
  }
});

// Delete user
router.delete("/:userId", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user." });
  }
});

// Create a new trip group
router.post("/groups", async (req, res) => {
  try {
    const group = new TripGroup({
      name: req.body.name,
      destination: req.body.destination,
      members: req.body.members, // array of user IDs
      createdBy: req.body.createdBy
    });
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    console.error("Group creation error:", err);
    res.status(500).json({ error: "Failed to create group." });
  }
});

module.exports = router;