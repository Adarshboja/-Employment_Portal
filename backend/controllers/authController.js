const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role, company, skills, bio } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    company: role === 'Recruiter' ? company : undefined,
    skills: role === 'Seeker' ? skills : undefined,
    bio,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      savedJobs: user.savedJobs,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
      phone: user.phone,
      experience: user.experience,
      skills: user.skills,
      bio: user.bio,
      company: user.company,
      education: user.education,
      institute: user.institute,
      location: user.location,
      gender: user.gender,
      dob: user.dob,
      certifications: user.certifications,
      projects: user.projects,
      avatar: user.avatar,
      savedJobs: user.savedJobs
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
      skills: user.skills,
      experience: user.experience,
      bio: user.bio,
      phone: user.phone,
      education: user.education,
      institute: user.institute,
      location: user.location,
      gender: user.gender,
      dob: user.dob,
      certifications: user.certifications,
      projects: user.projects,
      avatar: user.avatar,
      savedJobs: user.savedJobs
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.bio = req.body.bio || user.bio;
      
      if (user.role === 'Seeker') {
        user.skills = req.body.skills || user.skills;
        user.experience = req.body.experience || user.experience;
        user.education = req.body.education || user.education;
        user.institute = req.body.institute || user.institute;
        user.location = req.body.location || user.location;
        user.gender = req.body.gender || user.gender;
        user.dob = req.body.dob || user.dob;
        user.certifications = req.body.certifications || user.certifications;
        user.projects = req.body.projects || user.projects;
      } else {
        user.company = req.body.company || user.company;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }
      
      if (req.file) {
        user.avatar = req.file.path.replace(/\\/g, '/'); // Normalize path
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        company: updatedUser.company,
        skills: updatedUser.skills,
        experience: updatedUser.experience,
        bio: updatedUser.bio,
        phone: updatedUser.phone,
        education: updatedUser.education,
        institute: updatedUser.institute,
        location: updatedUser.location,
        gender: updatedUser.gender,
        dob: updatedUser.dob,
        certifications: updatedUser.certifications,
        projects: updatedUser.projects,
        avatar: updatedUser.avatar,
        savedJobs: updatedUser.savedJobs,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, authUser, getUserProfile, updateUserProfile };
