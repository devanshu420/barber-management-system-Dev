const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")

// Public routes
router.post("/register", authController.register)
router.post("/login", authController.login)
router.post("/refresh-token", authController.refreshToken)
router.post("/verify-otp", authController.verifyOTP)
router.post("/forgot-password", authController.forgotPassword)
router.post("/reset-password", authController.resetPassword)

// Protected routes
router.post("/logout", authController.logout)

module.exports = router
