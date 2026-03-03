const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")

// Public routes
router.post("/register", authController.register)
router.post("/login", authController.login)


router.post("/refresh-token", authController.refreshToken)


router.post("/forgot-password-otp", authController.forgotPasswordOtp);
router.post("/verify-reset-otp", authController.verifyResetOtp); 
router.post("/reset-password-otp", authController.resetPasswordWithOtp);


router.post("/logout", authController.logout)

module.exports = router
