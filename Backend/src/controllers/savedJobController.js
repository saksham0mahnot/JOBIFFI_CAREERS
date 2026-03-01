const SavedJob = require('../models/SavedJob');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Toggle Save/Unsave Job
// @route   POST /api/saved-jobs/toggle/:jobId
// @access  Private (Candidate)
exports.toggleSaveJob = asyncHandler(async (req, res) => {
    // Only Candidates should save jobs (based on current architecture)
    if (req.userType !== 'candidate') {
        res.status(401);
        throw new Error('Only candidates can save jobs');
    }

    const jobId = req.params.jobId;
    const candidateId = req.user.id;

    // Check if it already exists
    const existing = await SavedJob.findOne({ candidate: candidateId, job: jobId });

    if (existing) {
        // If exists, REMOVE it (Unsave)
        await existing.deleteOne();
        return res.status(200).json({ message: 'Job removed from saved list', saved: false });
    } else {
        // If NOT exists, CREATE it (Save)
        await SavedJob.create({ candidate: candidateId, job: jobId });
        return res.status(201).json({ message: 'Job saved successfully', saved: true });
    }
});

// @desc    Get All Saved Jobs for current candidate
// @route   GET /api/saved-jobs
// @access  Private (Candidate)
exports.getSavedJobs = asyncHandler(async (req, res) => {
    if (req.userType !== 'candidate') {
        res.status(401);
        throw new Error('Only candidates can have a saved jobs list');
    }

    const savedJobs = await SavedJob.find({ candidate: req.user.id })
        .populate('job')
        .sort('-createdAt');

    // Return just the job objects
    const jobs = savedJobs.map(sj => sj.job).filter(j => j !== null);
    res.status(200).json(jobs);
});
