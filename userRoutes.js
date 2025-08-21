const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/", (req, res) => {
  res.send("User route working!");
});


router.get("/profile/:firebaseUid", async (req, res) => {
  const { firebaseUid } = req.params;
  if (!firebaseUid) return res.status(400).json({ error: "firebaseUid is required" });

  try {
    const user = await User.findOne({ firebaseUid });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/profile", async (req, res) => {
  const { firebaseUid, name, email, avatar, bio, interests } = req.body;
  if (!firebaseUid || !name || !email) {
    return res.status(400).json({ error: "firebaseUid, name, and email are required" });
  }

  try {
    let user = await User.findOne({ firebaseUid });

    if (user) {

      user.name = name;
      user.avatar = avatar;
      user.bio = bio;
      user.interests = interests || [];
      await user.save();
    } else {

      user = await User.create({ firebaseUid, name, email, avatar, bio, interests: interests || [] });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user ? res.json(user) : res.status(404).json({ message: "User not found" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const saved = await newUser.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
