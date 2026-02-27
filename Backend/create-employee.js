require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const createEmployee = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to database...');

        const email = 'anamika.baruah@jobiffi.com'; // From your screenshot
        const name = 'Anamika Baruah';
        const password = 'Password@123'; // Temporary password

        const existing = await User.findOne({ email });
        if (existing) {
            console.log('User already exists. Updating password...');
            const salt = await bcrypt.genSalt(10);
            existing.password = await bcrypt.hash(password, salt);
            await existing.save();
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = new User({
                name,
                email,
                password: hashedPassword,
                role: 'employee'
            });
            await user.save();
            console.log('Successfully created employee account!');
        }

        console.log('--- LOGIN DETAILS ---');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('----------------------');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createEmployee();
