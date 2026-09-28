const transporter = require('../config/nodemailer');

const sendEmail = async (options) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email skipped: EMAIL_USER/EMAIL_PASS not configured.');
    return { skipped: true };
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: options.to || options.email,
    subject: options.subject,
    html: options.html,
    text: options.text,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
