const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '60d',
    });
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        console.log("Register Request Body:", req.body); // Debug log
        const { name, email, password, avatar, role } = req.body;

        // Basic validation
        if (!name || !email || !password || !role) {
            console.log("Missing required fields");
            return res.status(422).json({ message: "Please fill in all fields" });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log("User already exists:", email);
            return res.status(409).json({ message: "User already exists" });
        }

        const user = await User.create({ name, email, password, role, avatar });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                token: generateToken(user._id),
                companyName: user.companyName || '',
                companyDescription: user.companyDescription || '',
                companyLogo: user.companyLogo || '',
                resume: user.resume || '',
            });
        } else {
            console.log("Invalid user data");
            res.status(400).json({ message: "Invalid user data" });
        }
    }
    catch (error) {
        console.error("Register Error:", error); // Debug log
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
            avatar: user.avatar || '',
            companyName: user.companyName || '',
            companyDescription: user.companyDescription || '',
            companyLogo: user.companyLogo || '',
            resume: user.resume || '',
        });
    }
    catch (err) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Get current logged in user  
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    res.json(req.user);
}