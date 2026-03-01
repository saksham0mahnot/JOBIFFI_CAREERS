require('dotenv').config();
const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');

const createEmployee = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to database...');

        const employeesToSeed = [
            {
                email: 'anamika.baruah@jobiffi.com',
                name: 'Anamika',
                password: 'Password@123'
            },
            {
                email: 'saksham.mahnot@jobiffi.com',
                name: 'Saksham Mahnot',
                password: 'Password@456'
            }
        ];

        for (let emp of employeesToSeed) {
            const { email, name, password } = emp;
            const existing = await Employee.findOne({ email });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            if (existing) {
                console.log(`Updating password for existing employee: ${email}`);
                existing.password = hashedPassword;
                await existing.save();
            } else {
                console.log(`Creating new employee account: ${email}`);
                const employee = new Employee({ name, email, password: hashedPassword });
                await employee.save();
            }

            console.log('\n--- LOGIN DETAILS ---');
            console.log(`Email:    ${email}`);
            console.log(`Password: ${password}`);
            console.log('---------------------\n');
        }

        process.exit();
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

createEmployee();
