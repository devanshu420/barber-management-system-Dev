const express = require("express");
const multer = require("multer");

const {HairController, getMyPhotos} = require("../controllers/HairController");
const {authenticate} = require("../middlewares/authMiddleware");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/hairstyle-generator",
    upload.single("image"),
    authenticate,
    HairController
);


router.get("/all-photos", authenticate, getMyPhotos);

module.exports = router;
