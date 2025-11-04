const Payment = require("../models/Payment")
const Booking = require("../models/Booking")
const User = require("../models/User")
const crypto = require("crypto")

// Create payment
exports.createPayment = async (req, res) => {
  try {
    const { bookingId, amount, method } = req.body

    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const payment = new Payment({
      userId: req.user.id,
      bookingId,
      amount,
      method,
      transactionId,
      status: "pending",
    })

    await payment.save()

    // Update booking payment status
    await Booking.findByIdAndUpdate(bookingId, { paymentStatus: "pending" })

    res.status(201).json({
      success: true,
      message: "Payment initiated",
      data: payment,
    })
  } catch (error) {
    console.error("Error creating payment:", error)
    res.status(500).json({
      success: false,
      message: "Failed to create payment",
      error: error.message,
    })
  }
}

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { paymentId, transactionId } = req.body

    const payment = await Payment.findById(paymentId)

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      })
    }

    // Update payment status
    payment.status = "completed"
    payment.gatewayTransactionId = transactionId
    await payment.save()

    // Update booking
    await Booking.findByIdAndUpdate(payment.bookingId, { paymentStatus: "paid", status: "confirmed" })

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: payment,
    })
  } catch (error) {
    console.error("Error verifying payment:", error)
    res.status(500).json({
      success: false,
      message: "Failed to verify payment",
      error: error.message,
    })
  }
}

// Get payment history
exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: payments,
    })
  } catch (error) {
    console.error("Error fetching payment history:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment history",
      error: error.message,
    })
  }
}

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      })
    }

    res.status(200).json({
      success: true,
      data: payment,
    })
  } catch (error) {
    console.error("Error fetching payment:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment",
      error: error.message,
    })
  }
}

// Request refund
exports.requestRefund = async (req, res) => {
  try {
    const { reason } = req.body

    const payment = await Payment.findById(req.params.id)

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      })
    }

    payment.refund.reason = reason
    payment.refund.status = "pending"
    await payment.save()

    res.status(200).json({
      success: true,
      message: "Refund request submitted",
      data: payment,
    })
  } catch (error) {
    console.error("Error requesting refund:", error)
    res.status(500).json({
      success: false,
      message: "Failed to request refund",
      error: error.message,
    })
  }
}

// Razorpay webhook
exports.razorpayWebhook = async (req, res) => {
  try {
    const { payload } = req.body

    // Verify webhook signature
    const shasum = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(JSON.stringify(payload))
      .digest("hex")

    if (shasum !== req.headers["x-razorpay-signature"]) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      })
    }

    // Handle payment events
    if (payload.event === "payment.authorized") {
      // Update payment status
      const payment = await Payment.findOneAndUpdate(
        { transactionId: payload.payload.payment.entity.notes.transactionId },
        { status: "completed" },
        { new: true },
      )

      await Booking.findByIdAndUpdate(payment.bookingId, { paymentStatus: "paid" })
    }

    res.status(200).json({ success: true })
  } catch (error) {
    console.error("Razorpay webhook error:", error)
    res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    })
  }
}

// Stripe webhook
exports.stripeWebhook = async (req, res) => {
  try {
    const event = req.body

    if (event.type === "payment_intent.succeeded") {
      const payment = await Payment.findOneAndUpdate(
        { gatewayTransactionId: event.data.object.id },
        { status: "completed" },
        { new: true },
      )

      await Booking.findByIdAndUpdate(payment.bookingId, { paymentStatus: "paid" })
    }

    res.status(200).json({ received: true })
  } catch (error) {
    console.error("Stripe webhook error:", error)
    res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    })
  }
}
