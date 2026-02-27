const express = require('express');
const router = express.Router();
const {
    register,
    login
} = require('../controllers/authController');

// @route   POST api/auth/register
// @desc    Register a new user (Candidate or Employee based on email)
// @access  Public
router.post('/register', register);
router.post('/register-candidate', register); // Legacy support

// @route   POST api/auth/login
// @desc    Login for both Candidates and Employees
// @access  Public
router.post('/login', login);
router.post('/login-candidate', login); // Legacy support
router.post('/login-recruiter', login); // Legacy support

module.exports = router;
