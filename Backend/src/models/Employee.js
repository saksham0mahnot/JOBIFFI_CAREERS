const mongoose = require('mongoose');

/**
 * Employee Model — for internal Jobiffi staff only.
 * Employees can log in to post and manage job listings.
 * Accounts are created by an admin, NOT through public registration.
 * Stored in: career_employees
 */
const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide employee name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide employee email'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: (v) => v.endsWith('@jobiffi.com'),
            message: 'Employees must have an @jobiffi.com email address'
        }
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false
    },
    department: {
        type: String,
        default: 'HR'
    }
}, {
    timestamps: true,
    collection: 'career_employees'
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
