const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'accepted', 'rejected'],
        default: 'pending'
    },
    resume: {
        type: String,
        required: [true, 'Please provide a resume URL']
    },
    coverLetter: {
        type: String,
        trim: true
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'career_applications' // Explicit collection name
});

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
