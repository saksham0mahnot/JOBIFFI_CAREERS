const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a job title'],
        trim: true
    },
    company: {
        type: String,
        required: [true, 'Please provide a company name'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Please provide a location'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a job description']
    },
    salary: {
        type: String,
        trim: true
    },
    jobType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
        default: 'Full-time'
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    refCode: {
        type: String,
        unique: true,
        sparse: true
    }
}, {
    timestamps: true,
    collection: 'career_jobs' // Explicit collection name
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
