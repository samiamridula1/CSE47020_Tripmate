const User = require('../models/User');

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Create new user
        const newUser = new User({ name, email, password });
        const savedUser = await newUser.save();

        // Return user data (excluding password)
        res.status(201).json({ 
            id: savedUser._id, 
            name: savedUser.name, 
            email: savedUser.email 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Simple password comparison (in production, use bcrypt)
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Return user data (excluding password)
        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            isAuthenticated: true
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
};
