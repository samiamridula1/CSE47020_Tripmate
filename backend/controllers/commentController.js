const Comment = require('../models/Comment');
const User = require('../models/User');

// @desc    Get comments for an experience
// @route   GET /api/comments/experience/:experienceId
// @access  Public
const getExperienceComments = async (req, res) => {
    try {
        const comments = await Comment.find({ experienceId: req.params.experienceId })
            .populate('userId', 'name')
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Error fetching comments', error: error.message });
    }
};

// @desc    Add a comment to an experience
// @route   POST /api/comments
// @access  Public
const createComment = async (req, res) => {
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
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ message: 'Error creating comment', error: error.message });
    }
};

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Public
const updateComment = async (req, res) => {
    try {
        const { content, userId } = req.body;
        
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        
        // Check if user owns the comment
        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ message: 'You can only update your own comments' });
        }
        
        comment.content = content;
        await comment.save();
        
        await comment.populate('userId', 'name');
        res.json(comment);
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ message: 'Error updating comment', error: error.message });
    }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:commentId
// @access  Public
const deleteComment = async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ message: 'UserId is required' });
        }
        
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        
        // Check if user owns the comment
        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ message: 'You can only delete your own comments' });
        }
        
        await Comment.findByIdAndDelete(req.params.commentId);
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Error deleting comment', error: error.message });
    }
};

module.exports = {
    getExperienceComments,
    createComment,
    updateComment,
    deleteComment,
};
