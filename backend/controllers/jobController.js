const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Get all jobs (with search & filters)
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const { keyword, location, skills, experience, minSalary, maxSalary, sort, remote } = req.query;

    let query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { company: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (skills) {
      const skillsArray = skills.split(',').map((s) => new RegExp(s.trim(), 'i'));
      query.skills = { $in: skillsArray };
    }

    if (experience) {
      query.experience = experience;
    }

    if (remote) {
      if (remote.toLowerCase() === 'remote') {
        query.location = { $regex: 'remote', $options: 'i' };
      } else if (remote.toLowerCase() === 'onsite') {
        query.location = { $not: /remote/i };
      }
    }

    // Sort configuration
    let sortConfig = { createdAt: -1 }; // Default: Latest
    if (sort === 'salary') {
      sortConfig = { salary: -1 }; // Basic string sort, adjust to numeric if needed
    } else if (sort === 'title') {
      sortConfig = { title: 1 };
    }

    let jobs = await Job.find(query).sort(sortConfig).populate('recruiter', 'name company');

    // Apply salary filtering on string salary field by parsing numbers
    if (minSalary || maxSalary) {
      const min = minSalary ? Number(minSalary) : 0;
      const max = maxSalary ? Number(maxSalary) : Number.MAX_SAFE_INTEGER;
      jobs = jobs.filter((job) => {
        const match = job.salary ? job.salary.match(/\\d+/g) : null;
        if (!match) return false;
        const nums = match.map(Number);
        const low = Math.min(...nums);
        const high = Math.max(...nums);
        return low >= min && high <= max;
      });
    }

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiter', 'name company');
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private/Recruiter
const createJob = async (req, res) => {
  try {
    const { title, company, location, salary, experience, skills, description } = req.body;

    const job = new Job({
      recruiter: req.user._id,
      title,
      company,
      location,
      salary,
      experience,
      skills,
      description,
    });

    const createdJob = await job.save();
    res.status(201).json(createdJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private/Recruiter
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (job) {
      if (job.recruiter.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to delete this job' });
      }
      await job.deleteOne();
      res.json({ message: 'Job removed' });
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in recruiter's jobs
// @route   GET /api/jobs/recruiter/me
// @access  Private/Recruiter
const getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// @desc Toggle save/unsave job for a user
// @route POST /api/jobs/:id/save
// @access Private
const toggleSaveJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    const user = await User.findById(req.user._id);
    const exists = user.savedJobs.some((id) => id.toString() === jobId);
    if (exists) {
      user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
    } else {
      user.savedJobs.push(jobId);
    }
    await user.save();
    const populated = await user.populate('savedJobs');
    res.json({ savedJobs: populated.savedJobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get saved jobs for logged in user
// @route GET /api/jobs/saved/me
// @access Private
const getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedJobs');
    res.json(user.savedJobs || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getJobs, getJobById, createJob, deleteJob, getRecruiterJobs, toggleSaveJob, getSavedJobs };
