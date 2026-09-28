const upload = require('../utils/uploadFile');

const uploadResume = upload.single('resume');

module.exports = { uploadResume };
