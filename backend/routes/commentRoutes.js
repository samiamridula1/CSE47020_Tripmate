const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const User = require('../models/User');

// Get comments for an experience
router.get('/experience/:experienceId', async (req, res) => {
  try {
    const comments = await Comment.find({ experienceId: req.params.experienceId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ message: 'Error fetching comments' });
  }
});

// Add a comment to an experience
router.post('/', async (req, res) => {
  try {
    const { content, userId, experienceId } = req.body;
    
    if (!content || !userId || !experienceId) {
      return res.status(400).json({ message: 'Content, userId, and experienceId are required' });
    }
    
    // Get user name
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const comment = new Comment({
      content,
      userId,
      experienceId,
      userName: user.name
    });
    
    await comment.save();
    
    // Populate the user data before sending response
    await comment.populate('userId', 'name');
    
    res.status(201).json(comment);
  } catch (err) {
    console.error('Error creating comment:', err);
    res.status(500).json({ message: 'Error creating comment' });
  }
});

// Delete a comment (only by the comment author)
router.delete('/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'UserId is required' });
    }
    
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if the user is the author of the comment
    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You can only delete your own comments' });
    }
    
    await Comment.findByIdAndDelete(commentId);
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ message: 'Error deleting comment' });
  }
});

module.exports = router;
