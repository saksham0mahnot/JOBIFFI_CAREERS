const express = require('express');
const router = express.Router();
const { getMe, createOrUpdateProfile, deleteProfile } = require('../controllers/profileController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Only candidates have profiles in this system
router.get('/me', protect, authorize('candidate'), getMe);
router.post('/', protect, authorize('candidate'), createOrUpdateProfile);
router.delete('/', protect, authorize('candidate'), deleteProfile);

module.exports = router;
