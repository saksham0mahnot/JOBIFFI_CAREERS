const jwt = require('jsonwebtoken');
const Candidate = require('../models/Candidate');
const Employee = require('../models/Employee');

// Middleware to protect routes - Verify JWT and load the correct user model
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Load from the correct collection based on userType in token
        if (decoded.userType === 'employee') {
            req.user = await Employee.findById(decoded.id).select('-password');
            req.userRole = 'employee';
        } else {
            req.user = await Candidate.findById(decoded.id).select('-password');
            req.userRole = 'candidate';
        }

        if (!req.user) {
            return res.status(401).json({ message: 'Account no longer exists' });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token invalid' });
    }
};

// Middleware for role-based access control
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.userRole)) {
            return res.status(403).json({
                message: `Access denied. This route requires: ${roles.join(', ')}`
            });
        }
        next();
    };
};
