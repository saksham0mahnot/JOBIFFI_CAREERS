const mongoose = require('mongoose');

/**
 * Candidate Model — for external job seekers.
 * Candidates register publicly, browse jobs, and apply.
 * Stored in: career_candidates
 */
const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: function () {
            // Password is only required if NOT a social login user
            return !(this.googleId || this.linkedinId);
        },
        minlength: 6,
        select: false
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    linkedinId: {
        type: String,
        unique: true,
        sparse: true
    },
    avatar: {
        type: String
    }
}, {
    timestamps: true,
    collection: 'career_candidates'
});

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;
