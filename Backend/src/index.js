require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');

// Load passport configuration
require('./config/passport')(passport);


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true, // Allow all origins during development
  credentials: true
}));
app.use(express.json());

// Initialize Passport middleware
app.use(passport.initialize());


const errorHandler = require('./middleware/errorMiddleware');

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/auth', require('./routes/socialAuthRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/profiles', require('./routes/profileRoutes'));
app.use('/api/saved-jobs', require('./routes/savedJobRoutes'));

// Basic Route
app.get('/', (req, res) => {
  res.send('Jobiffi Careers API is running...');
});

// Error Middleware - MUST go after routes
app.use(errorHandler);

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  });
