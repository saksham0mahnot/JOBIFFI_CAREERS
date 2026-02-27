const UserProfile = require('../models/Profile');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get current user profile
// @route   GET /api/profiles/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
    // Updated 'candidate' to 'user' to match the new schema
    const profile = await UserProfile.findOne({ user: req.user.id }).populate('user', 'name email');
    if (!profile) {
        res.status(404);
        throw new Error('Profile not found');
    }
    res.status(200).json(profile);
});

// @desc    Create or Update user profile
// @route   POST /api/profiles
// @access  Private
exports.createOrUpdateProfile = asyncHandler(async (req, res) => {
    const {
        phoneNumber, bio, skills, experience, education,
        linkedin, github, portfolio, avatar
    } = req.body;

    const profileFields = {
        user: req.user.id,
        phoneNumber,
        bio,
        skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(skill => skill.trim()) : []),
        experience,
        education,
        social: { linkedin, github, portfolio },
        avatar
    };

    let profile = await UserProfile.findOne({ user: req.user.id });

    if (profile) {
        profile = await UserProfile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
        );
        return res.status(200).json(profile);
    }

    profile = new UserProfile(profileFields);
    await profile.save();
    res.status(201).json(profile);
});

// @desc    Delete user profile
// @route   DELETE /api/profiles
// @access  Private
exports.deleteProfile = asyncHandler(async (req, res) => {
    await UserProfile.findOneAndDelete({ user: req.user.id });
    res.status(200).json({ message: 'Profile deleted successfully' });
});
