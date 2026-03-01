const Application = require('../models/Application');
const Job = require('../models/Job');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Apply to a job
// @route   POST /api/applications/:jobId
// @access  Private (Candidate)
exports.applyToJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
        res.status(404);
        throw new Error('Job not found');
    }

    const { resume, coverLetter } = req.body;

    const application = new Application({
        job: req.params.jobId,
        applicant: req.user.id,
        resume,
        coverLetter
    });

    await application.save();
    res.status(201).json({ message: 'Application submitted successfully', application });
});

// @desc    Get current candidate's applications
// @route   GET /api/applications/my
// @access  Private (Candidate)
exports.getMyApplications = asyncHandler(async (req, res) => {
    const applications = await Application.find({ applicant: req.user.id })
        .populate({
            path: 'job',
            select: 'title company location'
        });
    res.status(200).json(applications);
});

// @desc    Get applications for a job (Recruiter only)
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter)
exports.getJobApplications = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
        res.status(404);
        throw new Error('Job not found');
    }

    // Ensure only the recruiter who posted the job can see applications
    if (job.postedBy.toString() !== req.user.id) {
        res.status(403);
        throw new Error('Not authorized to view these applications');
    }

    const applications = await Application.find({ job: req.params.jobId })
        .populate('applicant', 'name email');

    res.status(200).json(applications);
});

// @desc    Update application status (Recruiter only)
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter)
exports.updateStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    let application = await Application.findById(req.params.id).populate('job');

    if (!application) {
        res.status(404);
        throw new Error('Application not found');
    }

    // Ensure only the recruiter who posted the job can update status
    if (application.job.postedBy.toString() !== req.user.id) {
        res.status(403);
        throw new Error('Not authorized to update this status');
    }

    application.status = status;
    await application.save();

    res.status(200).json({ message: 'Status updated successfully', application });
});
