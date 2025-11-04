const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const { authenticate, authorize } = require("../middlewares/authMiddleware")

// Get user profile
router.get("/profile", authenticate, userController.getUserProfile)

// Update user profile
router.put("/profile", authenticate, userController.updateProfile)

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

module.exports = router
