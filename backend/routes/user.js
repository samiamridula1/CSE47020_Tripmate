
const express = require('express');
const { editUserProfile } = require('../controllers/userController');

const router = express.Router();

// Edit Profile Route (accepts base64 avatar string)
router.put('/edit-profile/:id', editUserProfile);

module.exports = router;