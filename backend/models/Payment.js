const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    barberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Barber",
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative"],
    },
    method: {
      type: String,
      required: true,
      enum: ["razorpay", "stripe", "wallet", "cash"],
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    gatewayTransactionId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "cancelled", "refunded"],
      default: "pending",
    },
    currency: {
      type: String,
      default: "INR",
    },
    paymentDetails: {
      cardLast4: String,
      cardBrand: String,
      bankName: String,
      upiId: String,
    },
    refund: {
      amount: {
        type: Number,
        default: 0,
      },
      reason: String,
      refundId: String,
      refundedAt: Date,
      status: {
        type: String,
        enum: ["pending", "processed", "failed"],
        default: "pending",
      },
    },
    commission: {
      platformFee: {
        type: Number,
        default: 0,
      },
      barberEarning: {
        type: Number,
        default: 0,
      },
    },
    metadata: {
      ipAddress: String,
      userAgent: String,
      deviceInfo: String,
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
paymentSchema.index({ userId: 1, createdAt: -1 })
paymentSchema.index({ barberId: 1, createdAt: -1 })
paymentSchema.index({ status: 1, createdAt: -1 })

module.exports = mongoose.model("Payment", paymentSchema)
