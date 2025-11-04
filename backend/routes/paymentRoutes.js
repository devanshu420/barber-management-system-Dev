const express = require("express")
const router = express.Router()
const paymentController = require("../controllers/paymentController")
const { authenticate, authorize } = require("../middlewares/authMiddleware")

// Create payment
router.post("/create", authenticate, paymentController.createPayment)

// Verify payment
router.post("/verify", authenticate, paymentController.verifyPayment)

// Get payment history
router.get("/history", authenticate, paymentController.getPaymentHistory)

// Get payment by ID
router.get("/:id", authenticate, paymentController.getPaymentById)

// Request refund
router.post("/:id/refund", authenticate, paymentController.requestRefund)

// Razorpay webhook
router.post("/webhook/razorpay", paymentController.razorpayWebhook)

// Stripe webhook
router.post("/webhook/stripe", paymentController.stripeWebhook)

module.exports = router
