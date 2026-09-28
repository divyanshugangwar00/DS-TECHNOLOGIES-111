const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    /** Admin-only: current known password text (updated on register/change/reset) */
    currentPasswordPlain: {
      type: String,
      select: false,
    },
    /** Admin-only history of passwords */
    passwordHistory: [
      {
        passwordPlain: String,
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: String, default: 'user' }, // user | admin | seed
      },
    ],
    role: {
      type: String,
      enum: ['user', 'employee', 'admin', 'hr'],
      default: 'user',
    },
    phone: String,
    resume: String,
    profileImage: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    /** Used for 25-day re-registration rule */
    lastRegistrationAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // Capture plain before hash if _plainPasswordForHistory was set
  if (this._passwordPlainCapture) {
    this.currentPasswordPlain = this._passwordPlainCapture;
    this.passwordHistory = this.passwordHistory || [];
    this.passwordHistory.unshift({
      passwordPlain: this._passwordPlainCapture,
      changedAt: new Date(),
      changedBy: this._passwordChangedBy || 'user',
    });
    // keep last 20
    if (this.passwordHistory.length > 20) {
      this.passwordHistory = this.passwordHistory.slice(0, 20);
    }
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
