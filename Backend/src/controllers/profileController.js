const CandidateProfile = require('../models/Profile');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get current candidate profile
// @route   GET /api/profiles/me
// @access  Private (Candidate)
exports.getMe = asyncHandler(async (req, res) => {
    const profile = await CandidateProfile.findOne({ candidate: req.user.id }).populate('candidate', 'name email');
    if (!profile) {
        res.status(404);
        throw new Error('Profile not found');
    }
    res.status(200).json(profile);
});

// @desc    Create or Update candidate profile
// @route   POST /api/profiles
// @access  Private (Candidate)
exports.createOrUpdateProfile = asyncHandler(async (req, res) => {
    const {
        phoneNumber, bio, skills, experience, education,
        linkedin, github, portfolio, avatar
    } = req.body;

    const profileFields = {
        candidate: req.user.id,
        phoneNumber,
        bio,
        skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(skill => skill.trim()) : []),
        experience,
        education,
        social: { linkedin, github, portfolio },
        avatar
    };

    let profile = await CandidateProfile.findOne({ candidate: req.user.id });

    if (profile) {
        profile = await CandidateProfile.findOneAndUpdate(
            { candidate: req.user.id },
            { $set: profileFields },
            { new: true }
        );
        return res.status(200).json(profile);
    }

    profile = new CandidateProfile(profileFields);
    await profile.save();
    res.status(201).json(profile);
});

// @desc    Delete candidate profile
// @route   DELETE /api/profiles
// @access  Private (Candidate)
exports.deleteProfile = asyncHandler(async (req, res) => {
    await CandidateProfile.findOneAndDelete({ candidate: req.user.id });
    res.status(200).json({ message: 'Profile deleted successfully' });
});
