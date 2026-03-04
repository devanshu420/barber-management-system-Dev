const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const { authenticate, authorize } = require("../middlewares/authMiddleware")
const { profilePhotoUploadMiddleware } = require("../middlewares/uploadProfilePhoto")

// Get user profile
router.get("/profile", authenticate, userController.getUserProfile)


// Get user bookings
router.get("/bookings", authenticate, userController.getUserBookings)

// Get user wallet
router.get("/wallet", authenticate, userController.getWallet)

// Add money to wallet
router.post("/wallet/add", authenticate, userController.addToWallet)

// Get loyalty points
router.get("/loyalty", authenticate, userController.getLoyaltyPoints)

// Deactivate account
router.put("/deactivate", authenticate, userController.deactivateAccount)

// PUT /api/users/update-profile
router.put(
  "/update-profile",
  authenticate,               // JWT → req.user.id
  profilePhotoUploadMiddleware, // profilePhoto single file
  userController.updateUserProfile           // controller
);

module.exports = router
