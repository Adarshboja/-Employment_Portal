const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String, required: true },
    experience: { type: String, required: true },
    skills: { type: [String], required: true }, // tags input
    description: { type: String, required: true },
    postedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
