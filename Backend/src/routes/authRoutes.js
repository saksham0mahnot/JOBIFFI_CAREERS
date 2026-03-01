const express = require('express');
const router = express.Router();
const { register, login, loginEmployee } = require('../controllers/authController');

// ──────────────────────────────────────────────
// CANDIDATE Routes (External Job Seekers)
// ──────────────────────────────────────────────

// @route   POST /api/auth/register
// @desc    Register a new candidate account
// @access  Public
router.post('/register', register);
router.post('/register-candidate', register); // Legacy support

// @route   POST /api/auth/login
// @desc    Candidate login
// @access  Public
router.post('/login', login);
router.post('/login-candidate', login); // Legacy support

// ──────────────────────────────────────────────
// EMPLOYEE Routes (Internal Jobiffi Staff)
// ──────────────────────────────────────────────

// @route   POST /api/auth/employee/login
// @desc    Employee-only login (must have @jobiffi.com email)
// @access  Public (but restricted by email domain)
router.post('/employee/login', loginEmployee);
router.post('/login-recruiter', loginEmployee); // Legacy support

module.exports = router;
