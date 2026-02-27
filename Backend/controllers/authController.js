const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');

// --- Control Logic ---

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    // Block official domain from public registration
    if (email.endsWith('@jobiffi.com')) {
        res.status(403);
        throw new Error('Official company accounts cannot be registered here. Please contact your administrator.');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400);
        throw new Error('User already exists with this email');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
        name,
        email,
        password: hashedPassword
    });

    await user.save();

    res.status(201).json({
        message: 'Account created successfully',
        role: user.role
    });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    // Generate JWT
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.status(200).json({
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};

// --- Exports ---
// We wrap everything in asyncHandler and export as clean functions

exports.register = asyncHandler(registerUser);
exports.login = asyncHandler(loginUser);

// Aliases for frontend backward compatibility
exports.loginCandidate = asyncHandler(loginUser);
exports.loginRecruiter = asyncHandler(loginUser);
exports.registerCandidate = asyncHandler(registerUser);
