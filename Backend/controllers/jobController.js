const Job = require('../models/Job');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all jobs with search and filtering
// @route   GET /api/jobs
// @access  Public
exports.getJobs = asyncHandler(async (req, res) => {
    const { query, location, jobType, domain, featured } = req.query;

    let queryObject = {};

    // Unified Search Logic (Search across multiple fields)
    if (query) {
        queryObject.$or = [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { location: { $regex: query, $options: 'i' } },
            { company: { $regex: query, $options: 'i' } },
            { refCode: { $regex: query, $options: 'i' } }
        ];
    }

    // Filter Logic
    if (location) {
        queryObject.location = { $regex: location, $options: 'i' };
    }
    if (jobType) {
        queryObject.jobType = jobType;
    }
    if (featured) {
        queryObject.featured = featured === 'true';
    }

    const jobs = await Job.find(queryObject).populate('postedBy', 'name email companyName');
    res.status(200).json(jobs);
});

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email companyName');
    if (!job) {
        res.status(404);
        throw new Error('Job not found');
    }
    res.status(200).json(job);
});

// @desc    Get jobs posted by current employee
// @route   GET /api/jobs/my
// @access  Private (Employee)
exports.getMyJobs = asyncHandler(async (req, res) => {
    const jobs = await Job.find({ postedBy: req.user.id });
    res.status(200).json(jobs);
});

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Recruiter)
exports.createJob = asyncHandler(async (req, res) => {
    const { title, company, location, description, salary, jobType, featured } = req.body;

    const job = new Job({
        title,
        company,
        location,
        description,
        salary,
        jobType,
        featured,
        postedBy: req.user.id
    });

    await job.save();
    res.status(201).json(job);
});

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter)
exports.updateJob = asyncHandler(async (req, res) => {
    let job = await Job.findById(req.params.id);

    if (!job) {
        res.status(404);
        throw new Error('Job not found');
    }

    // Ensure user is the recruiter who posted it
    if (job.postedBy.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized to update this job');
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json(job);
});

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter)
exports.deleteJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (!job) {
        res.status(404);
        throw new Error('Job not found');
    }

    if (job.postedBy.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized to delete this job');
    }

    await job.deleteOne();
    res.status(200).json({ message: 'Job removed successfully' });
});
