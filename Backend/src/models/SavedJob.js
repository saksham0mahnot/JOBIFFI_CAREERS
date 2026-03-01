const mongoose = require('mongoose');

const savedJobSchema = new mongoose.Schema({
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    }
}, {
    timestamps: true,
    collection: 'career_saved_jobs'
});

// Compound index: A candidate can only save a specific job once
savedJobSchema.index({ candidate: 1, job: 1 }, { unique: true });

const SavedJob = mongoose.model('SavedJob', savedJobSchema);
module.exports = SavedJob;
