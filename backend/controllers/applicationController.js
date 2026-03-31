const Application = require('../models/Application');
const Job = require('../models/Job');
const nodemailer = require('nodemailer');

// Mock email sending
const sendEmail = async (to, subject, text) => {
  try {
    // Generate test SMTP service account from ethereal.email
    let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    let info = await transporter.sendMail({
      from: '"Employment Portal" <noreply@employmentportal.com>',
      to: to,
      subject: subject,
      text: text,
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private/Seeker
const applyForJob = async (req, res) => {
  try {
    if (req.user.role !== 'Seeker') {
      return res.status(401).json({ message: 'Only Job Seekers can apply' });
    }

    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const existingApplication = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a resume' });
    }

    const application = new Application({
      job: req.params.jobId,
      applicant: req.user._id,
      resumeUrl: req.file.path,
      message: req.body.message || ''
    });

    const createdApplication = await application.save();

    // Send mock email
    sendEmail(
      req.user.email,
      'Job Application Received',
      `Your application for ${job.title} at ${job.company} has been received successfully.`
    );

    res.status(201).json(createdApplication);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get seeker's applications
// @route   GET /api/applications/myapplications
// @access  Private/Seeker
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company location salary status')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get applicants for a job
// @route   GET /api/applications/job/:jobId
// @access  Private/Recruiter
const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email skills bio phone experience education institute location gender dob certifications projects avatar')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/Recruiter
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, feedback } = req.body;
    const application = await Application.findById(req.params.id).populate('job').populate('applicant');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    application.status = status;
    application.feedback = feedback || application.feedback;
    
    await application.save();

    // Send mock email
    sendEmail(
      application.applicant.email,
      `Application Status Update: ${application.job.title}`,
      `Your application status has been updated to ${status}. Feedback: ${feedback || 'None'}`
    );

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check if user applied for a job
// @route   GET /api/applications/check/:jobId
// @access  Private/Seeker
const checkApplication = async (req, res) => {
  try {
    const existingApplication = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user._id
    });
    res.json({ hasApplied: !!existingApplication });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { applyForJob, getMyApplications, getJobApplicants, updateApplicationStatus, checkApplication };
