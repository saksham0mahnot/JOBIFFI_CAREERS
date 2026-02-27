const mongoose = require('mongoose');

const candidateProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    bio: {
        type: String,
        trim: true
    },
    skills: {
        type: [String],
        default: []
    },
    experience: [{
        title: String,
        company: String,
        location: String,
        from: Date,
        to: Date,
        current: Boolean,
        description: String
    }],
    education: [{
        school: String,
        degree: String,
        fieldOfStudy: String,
        from: Date,
        to: Date,
        current: Boolean,
        description: String
    }],
    social: {
        linkedin: String,
        github: String,
        portfolio: String
    },
    avatar: {
        type: String,
        default: ''
    }
}, {
    timestamps: true,
    collection: 'career_candidate_profiles' // Explicit collection name
});

const CandidateProfile = mongoose.model('CandidateProfile', candidateProfileSchema);

module.exports = CandidateProfile;
