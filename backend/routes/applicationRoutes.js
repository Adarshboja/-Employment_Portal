const express = require('express');
const router = express.Router();
const { applyForJob, getMyApplications, getJobApplicants, updateApplicationStatus, checkApplication } = require('../controllers/applicationController');
const { protect, recruiter } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.post('/:jobId', protect, upload.single('resume'), applyForJob);
router.get('/check/:jobId', protect, checkApplication);
router.get('/myapplications', protect, getMyApplications);
router.get('/job/:jobId', protect, recruiter, getJobApplicants);
router.put('/:id/status', protect, recruiter, updateApplicationStatus);

module.exports = router;
