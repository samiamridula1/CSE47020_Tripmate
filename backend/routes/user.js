const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Edit Profile Route
router.put('/edit-profile/:id', async (req, res) => {
  const { name, email, avatarUrl, interest, bio, gender } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, avatarUrl, interest, bio, gender },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Profile update failed. ' + err.message });
  }
});

module.exports = router;