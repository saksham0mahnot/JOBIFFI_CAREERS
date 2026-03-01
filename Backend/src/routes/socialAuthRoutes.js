const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Helper function to generate JWT token and redirect to frontend
const issueTokenAndRedirect = (req, res) => {
    if (!req.user) {
        return res.redirect(`${FRONTEND_URL}/login?error=AuthenticationFailed`);
    }

    const token = jwt.sign(
        { id: req.user._id, userType: 'candidate' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    // Redirect to frontend with token and user info as query parameters
    const redirectUrl = `${FRONTEND_URL}/social-auth-success?token=${token}&id=${req.user._id}&name=${encodeURIComponent(req.user.name)}&email=${encodeURIComponent(req.user.email)}&role=candidate`;
    res.redirect(redirectUrl);
};

// ---------------------------
// Google Auth Routes
// ---------------------------
// Trigger Google Login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// Google Callback
router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/login?error=GoogleAuthFailed` }),
    issueTokenAndRedirect
);

// ---------------------------
// LinkedIn Auth Routes
// ---------------------------
// Trigger LinkedIn Login
router.get('/linkedin', passport.authenticate('linkedin', { scope: ['r_emailaddress', 'r_liteprofile'], session: false }));

// LinkedIn Callback
router.get('/linkedin/callback',
    passport.authenticate('linkedin', { session: false, failureRedirect: `${FRONTEND_URL}/login?error=LinkedInAuthFailed` }),
    issueTokenAndRedirect
);

module.exports = router;
