const Job = require('../models/Job');

// @desc    Get all open jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const { department, location, type, search } = req.query;
    const filter = { status: 'Open' };

    if (department) filter.department = department;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const mongoose = require('mongoose');

const getJobById = async (req, res) => {
  try {
    const id = req.params.id;
    const isValidOid =
      id && mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id);

    let job = null;
    if (isValidOid) {
      job = await Job.findById(id);
    } else {
      job = await Job.findOne({ $or: [{ jobCode: id }, { slug: id }, { code: id }] });
    }

    if (job) {
      res.json(job);
    } else {
      // Catalog-only ids are handled on frontend — return 404 without CastError
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a job (Admin/HR)
// @route   POST /api/jobs
// @access  Private/Admin
const createJob = async (req, res) => {
  try {
    const body = { ...req.body };
    if (!body.slug && body.title) {
      body.slug = String(body.title)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') + '-' + Date.now();
    }
    if (!body.jobCode) body.jobCode = `dst-${Date.now()}`;
    const job = await Job.create({
      ...body,
      postedBy: req.user._id,
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private/Admin
const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private/Admin
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (job) {
      res.json({ message: 'Job removed' });
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob };
