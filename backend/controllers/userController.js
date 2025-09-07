const User = require("../models/User");

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({
            firebaseUid: req.params.firebaseUid,
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const saveUserProfile = async (req, res) => {
    try {
        const { firebaseUid, name, email, avatar, bio, interests } = req.body;
        let user = await User.findOne({ firebaseUid });
        if (user) {
            user.name = name;
            user.email = email;
            user.avatar = avatar;
            user.bio = bio;
            user.interests = interests;
            await user.save();
        } else {
            user = new User({
                firebaseUid,
                name,
                email,
                avatar,
                bio,
                interests,
            });
            await user.save();
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-firebaseUid");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const demoLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Demo credentials
        const demoAccounts = [
            {
                email: "demo@tripmate.com",
                password: "demo123",
                user: {
                    firebaseUid: "demo-user-001",
                    name: "Demo User",
                    email: "demo@tripmate.com",
                    avatar: "https://via.placeholder.com/150",
                    bio: "This is a demo account for testing Tripmate features.",
                    interests: [
                        "Travel",
                        "Adventure",
                        "Photography",
                        "Culture",
                    ],
                },
            },
            {
                email: "john@tripmate.com",
                password: "john123",
                user: {
                    firebaseUid: "demo-user-002",
                    name: "John Explorer",
                    email: "john@tripmate.com",
                    avatar: "https://via.placeholder.com/150/0000FF/FFFFFF?text=JE",
                    bio: "Travel enthusiast who loves exploring new cultures and cuisines.",
                    interests: ["Hiking", "Food", "History", "Mountains"],
                },
            },
        ];

        // Find matching demo account
        const demoAccount = demoAccounts.find(
            (account) =>
                account.email === email && account.password === password
        );

        if (!demoAccount) {
            return res.status(401).json({
                error: "Invalid demo credentials",
                availableAccounts: demoAccounts.map((acc) => ({
                    email: acc.email,
                    password: acc.password,
                    name: acc.user.name,
                })),
            });
        }

        res.json({
            success: true,
            user: demoAccount.user,
            token: `demo-token-${demoAccount.user.firebaseUid}`,
            message: "Demo login successful",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const editUserProfile = async (req, res) => {
    const { name, email, avatarUrl, interest, bio, gender } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, avatar: avatarUrl, interest, bio, gender },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: 'Profile update failed. ' + err.message });
    }
};

module.exports = {
    getUserProfile,
    saveUserProfile,
    deleteUser,
    getAllUsers,
    demoLogin,
    editUserProfile,
};