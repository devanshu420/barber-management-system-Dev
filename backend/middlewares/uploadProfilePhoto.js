const multer = require("multer");

// Memory storage for ImageKit
const storage = multer.memoryStorage();

// Allowed mime types
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

// File filter
function profilePhotoFileFilter(req, file, cb) {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, and WEBP images are allowed."
      ),
      false
    );
  }
}

// 5MB limit
const uploadProfilePhoto = multer({
  storage,
  fileFilter: profilePhotoFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
}).single("profilePhoto");

// Express-friendly middleware wrapper (for error handling)
function profilePhotoUploadMiddleware(req, res, next) {
  uploadProfilePhoto(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Multer-specific errors
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "Profile photo is too large. Max size is 5MB.",
        });
      }
      return res.status(400).json({
        success: false,
        message: `File upload error: ${err.message}`,
      });
    } else if (err) {
      // Custom errors (invalid file type, etc.)
      return res.status(400).json({
        success: false,
        message: err.message || "Failed to upload profile photo.",
      });
    }

    next();
  });
}

module.exports = {
  profilePhotoUploadMiddleware,
};
