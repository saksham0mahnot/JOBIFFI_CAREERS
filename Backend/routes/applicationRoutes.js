const express = require('express');
const router = express.Router();
const {
    applyToJob,
    getMyApplications,
    getJobApplications,
    updateStatus
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/:jobId', protect, authorize('candidate'), applyToJob);
router.get('/my', protect, authorize('candidate'), getMyApplications);

router.get('/job/:jobId', protect, authorize('employee'), getJobApplications);
router.put('/:id/status', protect, authorize('employee'), updateStatus);

module.exports = router;
