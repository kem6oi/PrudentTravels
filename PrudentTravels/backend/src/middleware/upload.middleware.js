const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const { FILE_UPLOAD } = require('../config/constants');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/temp'));
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = crypto.randomBytes(6).toString('hex');
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${uniqueSuffix}${ext}`;
    cb(null, name);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Check file type
  if (FILE_UPLOAD.ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${FILE_UPLOAD.ALLOWED_TYPES.join(', ')}`), false);
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: FILE_UPLOAD.MAX_SIZE,
    files: FILE_UPLOAD.MAX_FILES
  }
});

// Error handler for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({
        success: false,
        message: `File too large. Maximum size is ${FILE_UPLOAD.MAX_SIZE / (1024 * 1024)}MB`
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: `Too many files. Maximum is ${FILE_UPLOAD.MAX_FILES} files`
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};

module.exports = upload;
module.exports.handleMulterError = handleMulterError;
