const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    permissions: {
      users: {
        view: { type: Boolean, default: true },
        create: { type: Boolean, default: false },
        update: { type: Boolean, default: true },
        delete: { type: Boolean, default: false },
      },
      barbers: {
        view: { type: Boolean, default: true },
        create: { type: Boolean, default: false },
        update: { type: Boolean, default: true },
        delete: { type: Boolean, default: false },
        approve: { type: Boolean, default: true },
      },
      bookings: {
        view: { type: Boolean, default: true },
        create: { type: Boolean, default: false },
        update: { type: Boolean, default: true },
        delete: { type: Boolean, default: false },
        cancel: { type: Boolean, default: true },
      },
      payments: {
        view: { type: Boolean, default: true },
        refund: { type: Boolean, default: true },
        withdraw: { type: Boolean, default: true },
      },
      analytics: {
        view: { type: Boolean, default: true },
        export: { type: Boolean, default: true },
      },
      system: {
        settings: { type: Boolean, default: false },
        maintenance: { type: Boolean, default: false },
        backup: { type: Boolean, default: false },
      },
    },
    department: {
      type: String,
      enum: ["customer-service", "operations", "finance", "technical", "management"],
      default: "customer-service",
    },
    accessLevel: {
      type: String,
      enum: ["junior", "senior", "manager", "super-admin"],
      default: "junior",
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    activityLog: [
      {
        action: String,
        resource: String,
        resourceId: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        ipAddress: String,
        userAgent: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
adminSchema.index({ adminId: 1 })
adminSchema.index({ department: 1, accessLevel: 1 })
adminSchema.index({ isActive: 1 })

module.exports = mongoose.model("Admin", adminSchema)
