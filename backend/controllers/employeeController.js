const Employee = require('../models/Employee');
const User = require('../models/User');

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate('user', 'name email phone role')
      .sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEmployee = async (req, res) => {
  try {
    const {
      userId,
      employeeId,
      department,
      designation,
      joiningDate,
      workLocation,
      salary,
      personalEmail,
      companyEmail,
      dateOfBirth,
      gender,
      address,
      city,
      state,
      pin,
      emergencyContact,
      employmentType,
      skills,
      qualification,
      experienceYears,
      isActive,
      profilePhoto,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.body.role === 'hr' || req.body.role === 'admin') {
      user.role = req.body.role;
    } else {
      user.role = 'employee';
    }
    await user.save();

    const employee = await Employee.create({
      user: userId,
      employeeId,
      department,
      designation,
      joiningDate: joiningDate || Date.now(),
      workLocation: workLocation || 'Bareilly / Hybrid',
      salary,
      personalEmail,
      companyEmail: companyEmail || user.email,
      dateOfBirth,
      gender: gender || '',
      address,
      city,
      state,
      pin,
      emergencyContact,
      employmentType: employmentType || 'Full Time',
      skills: Array.isArray(skills) ? skills : (skills ? String(skills).split(',').map((s) => s.trim()).filter(Boolean) : []),
      qualification,
      experienceYears,
      isActive: isActive !== false,
      profilePhoto,
    });

    const populated = await Employee.findById(employee._id).populate('user', 'name email phone role');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyEmployeeProfile = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user._id }).populate('user', 'name email phone');
    if (!employee) return res.status(404).json({ message: 'Employee profile not found' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee removed from organization' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const body = { ...req.body };
    if (typeof body.skills === 'string') {
      body.skills = body.skills.split(',').map((s) => s.trim()).filter(Boolean);
    }
    const employee = await Employee.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    }).populate('user', 'name email phone role');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resign = async (req, res) => {
  try {
    const emp = await Employee.findOne({ user: req.user._id });
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    emp.notes = (emp.notes || '') + ` | RESIGN: ${req.body.reason} LWD:${req.body.lastWorkingDay} ${req.body.feedback || ''}`;
    emp.isActive = true; // HR deactivates later
    await emp.save();
    res.json({ message: 'Resignation submitted', employeeId: emp.employeeId });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = {
  getEmployees,
  createEmployee,
  getMyEmployeeProfile,
  deleteEmployee,
  updateEmployee,
  resign,
};
