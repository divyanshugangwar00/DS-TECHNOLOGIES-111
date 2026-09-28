const mongoose = require('mongoose');
const Application = require('../models/Application');
const Job = require('../models/Job');
const sendEmail = require('../utils/sendEmail');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Public / Private

const applyJob = async (req, res) => {
  try {
    const { jobId, name, email, phone, coverLetter, experience, course, currentCompany, expectedSalary, jobTitle } = req.body;

    const resumePath = req.file ? `/uploads/resumes/${req.file.filename}` : null;
    if (!resumePath) {
      return res.status(400).json({ message: 'Resume is required' });
    }

    let job = null;
    const isValidOid = jobId && mongoose.Types.ObjectId.isValid(jobId) && String(new mongoose.Types.ObjectId(jobId)) === String(jobId);

    if (isValidOid) {
      job = await Job.findById(jobId);
      if (!job || (job.status && job.status !== 'Open')) {
        return res.status(404).json({ message: 'Job not found or closed' });
      }
    } else {
      // Catalog ids like dst-job-1 — optional lookup by custom code
      job = await Job.findOne({ $or: [{ jobCode: jobId }, { slug: jobId }, { code: jobId }] }).catch(() => null);
    }

    const payload = {
      user: req.user ? req.user._id : undefined,
      name,
      email,
      phone,
      resume: resumePath,
      coverLetter,
      experience,
      course,
      currentCompany,
      expectedSalary,
      jobCode: jobId,
      jobTitle: job?.title || jobTitle || String(jobId || 'Open role'),
    };
    if (job && job._id) {
      payload.job = job._id;
    }

    const application = await Application.create(payload);

    try {
      const adminTo = process.env.ADMIN_NOTIFY_EMAIL || process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
      if (adminTo) {
        await sendEmail({
          to: adminTo,
          subject: 'DS-TECHNOLOGIES – New job application',
          html: `<p>New application from <strong>${name}</strong> (${email})</p>
            <p>Phone: ${phone || '-'} · Role: ${payload.jobTitle || ''}</p>`,
        });
      }
    } catch (e) { console.log('Admin apply notify skipped', e.message); }


    // Send confirmation email
    try {
      const titleForMail = (job && job.title) || payload.jobTitle || 'Open role';
      await sendEmail({
        email,
        subject: `Application Received - ${titleForMail} | DS-TECHNOLOGIES`,
        html: `
          <h2>Thank you for applying!</h2>
          <p>Dear ${name},</p>
          <p>We have received your application for the position of <strong>${titleForMail}</strong>.</p>
          <p>Our recruitment team will review your profile and get back to you soon.</p>
          <br/>
          <p>Best regards,<br/>DS-TECHNOLOGIES Careers Team</p>
        `,
      });
    } catch (emailErr) {
      console.log('Email send failed:', emailErr.message);
    }

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all applications (Admin)
// @route   GET /api/applications
// @access  Private/Admin
const getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('job', 'title department')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
const updateApplicationStatus = async (req, res) => {
  try {
    const {
      status,
      notes,
      interviewDate,
      joiningDate,
      reportingManager,
      workLocation,
      employmentType,
      departmentSelected,
      positionSelected,
      offerPackage,
      ctc,
      workingHours,
      probationPeriod,
      noticePeriod,
      offerAccepted,
      offerRejected,
      joiningForm,
      bankDetails,
      nominee,
      policiesAccepted,
      declaration,
      hrVerification,
      generatedEmployeeId,
      employeeAccountCreated,
      joiningConfirmed,
      pipelineStep,
      selectionStatus,
    } = req.body;

    const application = await Application.findById(req.params.id).populate('job', 'title department');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (status) application.status = status;
    if (notes !== undefined) application.notes = notes;
    if (interviewDate) application.interviewDate = interviewDate;
    if (joiningDate) application.joiningDate = joiningDate;
    if (reportingManager !== undefined) application.reportingManager = reportingManager;
    if (workLocation !== undefined) application.workLocation = workLocation;
    if (employmentType) application.employmentType = employmentType;
    if (departmentSelected !== undefined) application.departmentSelected = departmentSelected;
    if (positionSelected !== undefined) application.positionSelected = positionSelected;
    if (offerPackage !== undefined) application.offerPackage = offerPackage;
    if (ctc !== undefined) application.ctc = ctc;
    if (workingHours !== undefined) application.workingHours = workingHours;
    if (probationPeriod !== undefined) application.probationPeriod = probationPeriod;
    if (noticePeriod !== undefined) application.noticePeriod = noticePeriod;
    if (offerAccepted === true) {
      application.offerAccepted = true;
      application.offerRejected = false;
      application.offerRespondedAt = new Date();
      application.status = 'Document Verification';
      application.pipelineStep = 'Employee Form';
    }
    if (bankDetails && typeof bankDetails === 'object') {
      application.bankDetails = { ...(application.bankDetails?.toObject?.() || application.bankDetails || {}), ...bankDetails };
    }
    if (nominee && typeof nominee === 'object') {
      application.nominee = { ...(application.nominee?.toObject?.() || application.nominee || {}), ...nominee };
    }
    if (policiesAccepted && typeof policiesAccepted === 'object') {
      application.policiesAccepted = { ...(application.policiesAccepted?.toObject?.() || application.policiesAccepted || {}), ...policiesAccepted };
    }
    if (declaration && typeof declaration === 'object') {
      application.declaration = { ...(application.declaration?.toObject?.() || application.declaration || {}), ...declaration };
    }
    if (hrVerification && typeof hrVerification === 'object') {
      application.hrVerification = { ...(application.hrVerification?.toObject?.() || application.hrVerification || {}), ...hrVerification };
    }
    if (generatedEmployeeId !== undefined) application.generatedEmployeeId = generatedEmployeeId;
    if (employeeAccountCreated !== undefined) application.employeeAccountCreated = employeeAccountCreated;
    if (joiningConfirmed !== undefined) application.joiningConfirmed = joiningConfirmed;
    if (joiningForm && typeof joiningForm === 'object') {
      application.joiningForm = { ...(application.joiningForm?.toObject?.() || application.joiningForm || {}), ...joiningForm };
    }
    if (offerRejected === true) {
      application.offerRejected = true;
      application.offerAccepted = false;
      application.offerRespondedAt = new Date();
      application.status = 'Rejected';
      application.pipelineStep = '';
    }
    if (pipelineStep) application.pipelineStep = pipelineStep;
    if (selectionStatus !== undefined) application.selectionStatus = selectionStatus;
    else if (status === 'Selected' || status === 'Accepted') application.selectionStatus = 'Selected';

    if (['Selected', 'Accepted', 'Offer'].includes(status) && !application.pipelineStep) {
      application.pipelineStep = status === 'Offer' ? 'Offer' : 'Selection';
    }

    application.reviewedBy = req.user?._id;
    await application.save();

    // Email optional
    try {
      if (application.email && status) {
        await sendEmail({
          to: application.email,
          subject: `DS-TECHNOLOGIES – Application update: ${status}`,
          html: `<p>Dear ${application.name},</p>
          <p>Your application for <strong>${application.job?.title || application.jobTitle || 'the role'}</strong> is now: <strong>${status}</strong>.</p>
          <p>${status === 'Rejected' ? 'Thank you for your interest. We encourage you to apply again for future openings.' : status === 'Selected' || status === 'Accepted' ? 'Congratulations! Our team will contact you with next steps.' : status === 'Interview' || status === 'Scheduled' ? 'Please be available for the interview as communicated by HR.' : 'We will keep you updated.'}</p>
          ${application.joiningDate ? `<p>Proposed joining: ${new Date(application.joiningDate).toLocaleDateString()}</p>` : ''}
          <p>Regards,<br/>DS-TECHNOLOGIES HR</p>`,
        }).catch(() => {});
      }
    } catch (_) {}

    const updated = await Application.findById(application._id).populate('job', 'title department location');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Not found' });
    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: 'Application deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = { applyJob, getApplications, updateApplicationStatus, deleteApplication };

