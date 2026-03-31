const express = require('express');
const router = express.Router();
const { getJobs, getJobById, createJob, deleteJob, getRecruiterJobs } = require('../controllers/jobController');
const { protect, recruiter } = require('../middlewares/authMiddleware');
const { toggleSaveJob, getSavedJobs } = require('../controllers/jobController');

router.route('/')
  .get(getJobs)
  .post(protect, recruiter, createJob);

router.get('/recruiter/me', protect, recruiter, getRecruiterJobs);
router.get('/saved/me', protect, getSavedJobs);
router.post('/:id/save', protect, toggleSaveJob);

router.route('/:id')
  .get(getJobById)
  .delete(protect, recruiter, deleteJob);

module.exports = router;
