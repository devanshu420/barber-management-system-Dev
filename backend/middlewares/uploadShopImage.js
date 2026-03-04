// middlewares/uploadShopImage.js
const multer = require("multer");

// 5MB
const MAX_SIZE = 5 * 1024 * 1024; 

// memory storage (no disk writes)
const storage = multer.memoryStorage();

// secure file filter
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error("Only JPG, JPEG, PNG and WEBP images are allowed");
    error.statusCode = 400;
    cb(error, false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_SIZE,
  },
  fileFilter,
});

module.exports = upload;
