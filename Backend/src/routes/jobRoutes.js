const express = require('express');
const router = express.Router();
const {
    getJobs,
    getJob,
    getMyJobs,
    createJob,
    updateJob,
    deleteJob
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(getJobs)
    .post(protect, authorize('employee'), createJob);

router.get('/my', protect, authorize('employee'), getMyJobs);

router.route('/:id')
    .get(getJob)
    .put(protect, authorize('employee'), updateJob)
    .delete(protect, authorize('employee'), deleteJob);

module.exports = router;
