const Contact = require('../models/Contact');
const sendEmail = require('../utils/sendEmail');

const submitContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);

    // Notify admin (optional)
    try {
      await sendEmail({
        email: process.env.EMAIL_USER,
        subject: `New Contact Form - ${contact.subject || 'No Subject'}`,
        html: `<p><strong>${contact.name}</strong> (${contact.email}) sent a message:</p><p>${contact.message}</p>`,
      });
    } catch (e) {}

    res.status(201).json({ message: 'Message sent successfully', contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitContact, getContacts };
