import express from "express";
import User from "../models/User.js";
const router = express.Router();

router.post("/profile", async (req, res) => {
  const { firebaseUid, name, email, avatar, bio, interests } = req.body;
  try {
    let user = await User.findOne({ firebaseUid });
    if (user) {
      user.name = name;
      user.avatar = avatar;
      user.bio = bio;
      user.interests = interests;
      await user.save();
    } else {
      user = await User.create({ firebaseUid, name, email, avatar, bio, interests });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:firebaseUid", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
