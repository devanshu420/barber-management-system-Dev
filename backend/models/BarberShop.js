// // models/BarberShop.js
// const mongoose = require("mongoose");

// const barberSchema = new mongoose.Schema(
//   {
//     barberId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     shopName: {
//       type: String,
//       required: [true, "Shop name is required"],
//       trim: true,
//       maxlength: [100, "Shop name cannot exceed 100 characters"],
//     },
//     description: {
//       type: String,
//       maxlength: [500, "Description cannot exceed 500 characters"],
//     },
//     services: [
//       {
//         name: {
//           type: String,
//           required: true,
//         },
//         price: {
//           type: Number,
//           required: true,
//           min: [0, "Price cannot be negative"],
//         },
//         duration: {
//           type: Number,
//           required: true,
//           min: [15, "Duration must be at least 15 minutes"],
//         },
//         category: {
//           type: String,
//           enum: ["haircut", "beard", "styling", "treatment", "other", "wash"],
//           default: "haircut",
//         },
//       },
//     ],
//     ratings: {
//       average: {
//         type: Number,
//         default: 0,
//         min: 0,
//         max: 5,
//       },
//       count: {
//         type: Number,
//         default: 0,
//       },
//     },
//     reviews: [
//       {
//         userId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//           required: true,
//         },
//         rating: {
//           type: Number,
//           required: true,
//           min: 1,
//           max: 5,
//         },
//         comment: {
//           type: String,
//           maxlength: [500, "Review cannot exceed 500 characters"],
//         },
//         createdAt: {
//           type: Date,
//           default: Date.now,
//         },
//       },
//     ],
//     workingHours: {
//       monday: {
//         start: String,
//         end: String,
//         isOpen: { type: Boolean, default: true },
//       },
//       tuesday: {
//         start: String,
//         end: String,
//         isOpen: { type: Boolean, default: true },
//       },
//       wednesday: {
//         start: String,
//         end: String,
//         isOpen: { type: Boolean, default: true },
//       },
//       thursday: {
//         start: String,
//         end: String,
//         isOpen: { type: Boolean, default: true },
//       },
//       friday: {
//         start: String,
//         end: String,
//         isOpen: { type: Boolean, default: true },
//       },
//       saturday: {
//         start: String,
//         end: String,
//         isOpen: { type: Boolean, default: true },
//       },
//       sunday: {
//         start: String,
//         end: String,
//         isOpen: { type: Boolean, default: false },
//       },
//     },
//     availability: [
//       {
//         date: {
//           type: Date,
//           required: true,
//         },
//         timeSlots: [
//           {
//             startTime: String,
//             endTime: String,
//             isBooked: { type: Boolean, default: false },
//             bookingId: {
//               type: mongoose.Schema.Types.ObjectId,
//               ref: "Booking",
//             },
//           },
//         ],
//       },
//     ],
//     staff: [
//       {
//         name: String,
//         role: String,
//         phone: String,
//         specialization: [String],
//       },
//     ],
//     earnings: {
//       total: {
//         type: Number,
//         default: 0,
//       },
//       monthly: [
//         {
//           month: Number,
//           year: Number,
//           amount: Number,
//         },
//       ],
//       pending: {
//         type: Number,
//         default: 0,
//       },
//     },
//     shopImages: [String],
//     certificates: [String],
//     isVerified: {
//       type: Boolean,
//       default: false,
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//     location: {
//       address: {
//         type: String,
//         required: true,
//       },
//       city: {
//         type: String,
//         required: true,
//       },
//       state: {
//         type: String,
//         required: true,
//       },
//       zipCode: {
//         type: String,
//         required: true,
//       },
//       coordinates: {
//         latitude: {
//           type: Number,
//           required: true,
//         },
//         longitude: {
//           type: Number,
//           required: true,
//         },
//       },
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Index for location-based queries
// barberSchema.index({ "location.coordinates": "2dsphere" });

// // Calculate average rating method
// barberSchema.methods.calculateAverageRating = function () {
//   if (this.reviews.length === 0) {
//     this.ratings.average = 0;
//     this.ratings.count = 0;
//     return;
//   }

//   const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
//   this.ratings.average = Math.round((sum / this.reviews.length) * 10) / 10;
//   this.ratings.count = this.reviews.length;
// };


// const BarberShopModel = mongoose.model("BarberShop", barberSchema);

// module.exports = BarberShopModel;
