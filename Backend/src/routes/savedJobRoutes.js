const express = require('express');
const router = express.Router();
const {
    toggleSaveJob,
    getSavedJobs
} = require('../controllers/savedJobController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All saved job routes require login
router.use(protect);

// Only candidates can save jobs
router.get('/', authorize('candidate'), getSavedJobs);
router.post('/toggle/:jobId', authorize('candidate'), toggleSaveJob);

module.exports = router;
