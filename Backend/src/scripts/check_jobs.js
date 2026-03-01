require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('../models/Job');
const Employee = require('../models/Employee');

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);
    const jobs = await Job.find({});
    console.log("Found jobs:", jobs.length);
    if (jobs.length > 0) {
        console.log("First few jobs postedBy:", jobs.slice(0, 3).map(j => j.postedBy));
    }
    const emp = await Employee.findOne({});
    console.log("Current employee ID:", emp ? emp._id : "None");

    // Check if any job matches
    const matchingJobs = await Job.find({ postedBy: emp ? emp._id : null });
    console.log("Matching jobs for current employee:", matchingJobs.length);

    process.exit(0);
}
run();
