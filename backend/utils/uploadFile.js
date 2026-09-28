const path = require('path');
const fs = require('fs');
const multer = require('multer');

const resumeDir = path.join(__dirname, '..', 'uploads', 'resumes');
if (!fs.existsSync(resumeDir)) {
  fs.mkdirSync(resumeDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resumeDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // Keep the original extension when there is one. Files without an
    // extension are still accepted and stored safely.
    const ext = path.extname(file.originalname || '')
      .slice(0, 20)
      .replace(/[^a-zA-Z0-9.]/g, '');
    cb(null, uniqueSuffix + (ext || ''));
  },
});

// Resume uploads intentionally accept any file type. The browser UI also
// allows every file type, so PDF/DOC/DOCX/PNG/JPG/TXT/ZIP/etc. can be sent.
const fileFilter = (req, file, cb) => {
  cb(null, true);
};

// No application-level file-size limit is imposed here. The actual hosting
// provider, reverse proxy, available disk space and browser can still impose
// their own limits.
const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
