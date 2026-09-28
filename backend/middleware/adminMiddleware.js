const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'hr')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin/HR' });
  }
};

module.exports = { admin };
