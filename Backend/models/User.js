const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['candidate', 'employee'],
        default: 'candidate'
    },
    companyName: {
        type: String,
        default: 'Jobiffi'
    }
}, {
    timestamps: true,
    collection: 'career_users'
});

// Auto-assign role based on email domain before saving
userSchema.pre('save', function () {
    if (this.isModified('email')) {
        if (this.email.endsWith('@jobiffi.com')) {
            this.role = 'employee';
        } else {
            this.role = 'candidate';
        }
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
