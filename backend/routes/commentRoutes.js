const express = require('express');
const router = express.Router();
const {
  getExperienceComments,
  createComment,
  updateComment,
  deleteComment,
} = require('../controllers/commentController');

// Get comments for an experience
router.get('/experience/:experienceId', getExperienceComments);

// Add a comment to an experience
router.post('/', createComment);

// Update a comment
router.put('/:id', updateComment);

// Delete a comment (only by the comment author)
router.delete('/:commentId', deleteComment);

module.exports = router;
