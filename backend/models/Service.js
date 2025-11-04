const mongoose = require("mongoose")

const serviceSchema = new mongoose.Schema(
  {
    barberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Barber",
      required: true,
    },
    serviceName: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      maxlength: [100, "Service name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [15, "Duration must be at least 15 minutes"],
    },
    category: {
      type: String,
      required: true,
      enum: ["haircut", "beard", "styling", "treatment", "package", "other"],
    },
    subCategory: {
      type: String,
      trim: true,
    },
    images: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    popularity: {
      type: Number,
      default: 0,
    },
    bookingCount: {
      type: Number,
      default: 0,
    },
    tags: [String],
    requirements: {
      type: String,
      maxlength: [200, "Requirements cannot exceed 200 characters"],
    },
    aftercareInstructions: {
      type: String,
      maxlength: [300, "Aftercare instructions cannot exceed 300 characters"],
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
serviceSchema.index({ barberId: 1, category: 1 })
serviceSchema.index({ category: 1, price: 1 })
serviceSchema.index({ isActive: 1, popularity: -1 })

module.exports = mongoose.model("Service", serviceSchema)
