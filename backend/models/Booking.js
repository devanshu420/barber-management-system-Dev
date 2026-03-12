const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BarberShop",
      required: true,
    },

    // ✅ MULTIPLE SERVICES SUPPORT
    services: [
      {
        serviceId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        duration: {
          type: Number,
          required: true,
        },
      },
    ],

    bookingDate: {
      type: Date,
      required: true,
    },

    bookingTime: {
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "in-progress",
        "completed",
        "cancelled",
        "no-show",
      ],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    amount: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative"],
    },

    discount: {
      type: Number,
      default: 0,
    },

    finalAmount: {
      type: Number,
    },

    paymentMethod: {
      type: String,
      enum: ["razorpay", "stripe", "wallet", "cash"],
      default: "razorpay",
    },

    transactionId: {
      type: String,
      default: null,
    },

    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },

    reminderSent: {
      type: Boolean,
      default: false,
    },

    cancelledAt: Date,
  },
  {
    timestamps: true,
  }
);

// indexes
bookingSchema.index({ userId: 1, bookingDate: -1 });
bookingSchema.index({ shopId: 1, bookingDate: -1 });
bookingSchema.index({ status: 1, bookingDate: 1 });

bookingSchema.pre("save", async function () {
  const amount = this.amount || 0;
  const discount = this.discount || 0;
  this.finalAmount = Math.max(amount - discount, 0);
});

module.exports = mongoose.model("booking", bookingSchema);











// // models/Booking.js
// const mongoose = require("mongoose");

// const bookingSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     shopId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "BarberShop", 
//       required: true,
//     },
//     serviceId: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//     },
//     serviceName: {
//       type: String,
//       required: true,
//     },
//     bookingDate: {
//       type: Date,
//       required: true,
//     },
//     bookingTime: {
//       startTime: {
//         type: String,
//         required: true,
//       },
//       endTime: {
//         type: String,
//         required: true,
//       },
//     },
//     status: {
//       type: String,
//       enum: ["pending", "confirmed", "in-progress", "completed", "cancelled", "no-show"],
//       default: "pending",
//     },
//     paymentStatus: {
//       type: String,
//       enum: ["pending", "paid", "failed", "refunded"],
//       default: "pending",
//     },
//     amount: {
//       type: Number,
//       required: true,
//       min: [0, "Amount cannot be negative"],
//     },
//     discount: {
//       type: Number,
//       default: 0,
//     },
//     finalAmount: {
//       type: Number,
//     },
//     paymentMethod: {
//       type: String,
//       enum: ["razorpay", "stripe", "wallet", "cash"],
//       default: "razorpay",
//     },
//     transactionId: {
//       type: String,
//       default: null,
//     },
//     notes: {
//       type: String,
//       maxlength: [500, "Notes cannot exceed 500 characters"],
//     },
//     cancellationReason: {
//       type: String,
//       maxlength: [200, "Cancellation reason cannot exceed 200 characters"],
//     },
//     rescheduleHistory: [
//       {
//         oldDate: Date,
//         oldTime: {
//           startTime: String,
//           endTime: String,
//         },
//         newDate: Date,
//         newTime: {
//           startTime: String,
//           endTime: String,
//         },
//         reason: String,
//         rescheduledAt: {
//           type: Date,
//           default: Date.now,
//         },
//       },
//     ],
//     rating: {
//       type: Number,
//       min: 1,
//       max: 5,
//     },
//     review: {
//       type: String,
//       maxlength: [500, "Review cannot exceed 500 characters"],
//     },
//     isReviewed: {
//       type: Boolean,
//       default: false,
//     },
//     reminderSent: {
//       type: Boolean,
//       default: false,
//     },
//     cancelledAt: Date,
//     reviewDate: Date,
//   },
//   {
//     timestamps: true,
//   }
// );

// // Indexes
// bookingSchema.index({ userId: 1, bookingDate: -1 });
// bookingSchema.index({ shopId: 1, bookingDate: -1 });
// bookingSchema.index({ status: 1, bookingDate: 1 });

// // Pre-save hook
// bookingSchema.pre("save", async function () {
//   const amount = this.amount || 0;
//   const discount = this.discount || 0;

//   this.finalAmount = Math.max(amount - discount, 0);
// });


// module.exports = mongoose.model("booking", bookingSchema);
