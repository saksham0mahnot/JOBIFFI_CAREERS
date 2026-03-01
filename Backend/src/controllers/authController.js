const Candidate = require('../models/Candidate');
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');

// ─────────────────────────────────────────
// CANDIDATE: Register
// POST /api/auth/register
// ─────────────────────────────────────────
const registerCandidate = async (req, res) => {
    const { name, email, password } = req.body;

    // Block @jobiffi.com from registering as candidates
    if (email.endsWith('@jobiffi.com')) {
        res.status(403);
        throw new Error('Jobiffi employees cannot register here. Please use the Employer Login.');
    }

    const existing = await Candidate.findOne({ email });
    if (existing) {
        res.status(400);
        throw new Error('An account with this email already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const candidate = new Candidate({ name, email, password: hashedPassword });
    await candidate.save();

    res.status(201).json({ message: 'Account created successfully! You can now log in.' });
};

// ─────────────────────────────────────────
// CANDIDATE: Login
// POST /api/auth/login
// ─────────────────────────────────────────
const loginCandidate = async (req, res) => {
    const { email, password } = req.body;

    const candidate = await Candidate.findOne({ email }).select('+password');
    if (!candidate) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, candidate.password);
    if (!isMatch) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
        { id: candidate._id, userType: 'candidate' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.status(200).json({
        token,
        user: {
            id: candidate._id,
            name: candidate.name,
            email: candidate.email,
            role: 'candidate'
        }
    });
};

// ─────────────────────────────────────────
// EMPLOYEE: Login (No public registration)
// POST /api/auth/employee/login
// ─────────────────────────────────────────
const loginEmployee = async (req, res) => {
    const { email, password } = req.body;

    // Only @jobiffi.com emails are allowed
    if (!email.endsWith('@jobiffi.com')) {
        res.status(403);
        throw new Error('This login is for Jobiffi employees only.');
    }

    const employee = await Employee.findOne({ email }).select('+password');
    if (!employee) {
        res.status(401);
        throw new Error('Invalid credentials. Please contact your administrator.');
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
        { id: employee._id, userType: 'employee' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.status(200).json({
        token,
        user: {
            id: employee._id,
            name: employee.name,
            email: employee.email,
            role: 'employee'
        }
    });
};

// ─────────────────────────────────────────
// Exports
// ─────────────────────────────────────────
exports.register = asyncHandler(registerCandidate);
exports.login = asyncHandler(loginCandidate);
exports.loginEmployee = asyncHandler(loginEmployee);

// Legacy aliases
exports.registerCandidate = asyncHandler(registerCandidate);
exports.loginCandidate = asyncHandler(loginCandidate);
