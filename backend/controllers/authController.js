const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

const RE_REGISTER_DAYS = 25;

const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });

    if (existing) {
      const last = existing.lastRegistrationAt || existing.createdAt;
      const days = (Date.now() - new Date(last).getTime()) / (1000 * 60 * 60 * 24);

      if (days < RE_REGISTER_DAYS) {
        const wait = Math.ceil(RE_REGISTER_DAYS - days);
        return res.status(400).json({
          message: `Is email se pehle se account hai. Dubara registration sirf ${RE_REGISTER_DAYS} din baad ho sakti hai. ${wait} din baad try karein.`,
          daysRemaining: wait,
        });
      }

      // Allow re-registration after 25 days — reset account
      existing.name = name;
      existing.phone = phone;
      existing.password = password;
      existing._passwordPlainCapture = password;
      existing._passwordChangedBy = 're-register';
      existing.role = 'user';
      existing.isActive = true;
      existing.lastRegistrationAt = new Date();
      await existing.save();

      return res.status(201).json({
        _id: existing._id,
        name: existing.name,
        email: existing.email,
        role: existing.role,
        token: generateToken(existing._id),
        message: 'Account re-activated after 25 days',
      });
    }

    const user = new User({
      name,
      email,
      password,
      phone,
      role: 'user',
      lastRegistrationAt: new Date(),
    });
    user._passwordPlainCapture = password;
    user._passwordChangedBy = 'register';
    await user.save();

    // Notify admin + welcome user (email; WhatsApp needs API — link logged)
    try {
      const adminTo = process.env.ADMIN_NOTIFY_EMAIL || process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
      if (adminTo) {
        await sendEmail({
          to: adminTo,
          subject: 'DS-TECHNOLOGIES – New registration',
          html: `<p>New account registered.</p><p><strong>${name}</strong> · ${email} · ${phone || 'no phone'}</p>`,
        });
      }
      await sendEmail({
        to: email,
        subject: 'Welcome to DS-TECHNOLOGIES',
        html: `<p>Hi ${name},</p><p>Your account on DS-TECHNOLOGIES is ready. You can log in and apply for jobs or track applications.</p><p>— DS-TECHNOLOGIES</p>`,
      });
      if (phone) {
        console.log('WhatsApp notify hint:', `https://wa.me/91${String(phone).replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent('DS-TECHNOLOGIES: Your account was registered successfully.')}`);
      }
    } catch (e) { console.log('Register notify skipped', e.message); }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Register error:', error.message);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    if (error.message.includes('buffering timed out') || error.message.includes('ECONNREFUSED')) {
      return res.status(500).json({ message: 'Database not connected.' });
    }
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const match = await user.matchPassword(req.body.currentPassword);
    if (!match) return res.status(401).json({ message: 'Current password incorrect' });
    user.password = req.body.newPassword;
    user._passwordPlainCapture = req.body.newPassword;
    user._passwordChangedBy = 'user';
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/** Admin: list users with current + history passwords */
const adminListPasswords = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'hr') {
      return res.status(403).json({ message: 'Only Admin/HR' });
    }
    const users = await User.find()
      .select('+currentPasswordPlain name email role phone isActive passwordHistory createdAt lastRegistrationAt')
      .sort({ createdAt: -1 });
    res.json(
      users.map((u) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        phone: u.phone,
        isActive: u.isActive,
        currentPassword: u.currentPasswordPlain || (u.role === 'admin' && u.email === 'admin@dstechnologies.com' ? 'admin123 (default)' : 'Ds@2026 (default seed — Set Password to update)'),
        passwordHistory: u.passwordHistory || [],
        lastRegistrationAt: u.lastRegistrationAt,
        createdAt: u.createdAt,
      }))
    );
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/** Admin: set/reset password */
const adminSetPassword = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'hr') {
      return res.status(403).json({ message: 'Only Admin/HR' });
    }
    const { userId, newPassword } = req.body;
    if (!userId || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'userId and newPassword (min 6) required' });
    }
    const user = await User.findById(userId).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.password = newPassword;
    user._passwordPlainCapture = newPassword;
    user._passwordChangedBy = 'admin';
    await user.save();
    res.json({ message: 'Password updated by admin', email: user.email });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.json({ message: 'If this email is registered, HR/Admin will assist with reset.' });
    }
    // Demo: set temp password and store in history
    const temp = 'Temp@' + Math.floor(1000 + Math.random() * 9000);
    user.password = temp;
    user._passwordPlainCapture = temp;
    user._passwordChangedBy = 'forgot-reset';
    await user.save();
    res.json({
      message: 'Temporary password generated. Contact Admin or use temp password (shown once for demo): ' + temp,
      tempPasswordDemo: temp,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  changePassword,
  adminListPasswords,
  adminSetPassword,
  forgotPassword,
};
