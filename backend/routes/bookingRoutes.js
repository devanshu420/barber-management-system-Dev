const express = require("express");
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getShopBookings,
  getBookedSlots,
  getBookingById,
  updateBookingStatus,
  rescheduleBooking,
  cancelBooking,
  addReview,
  getAllBookings,
  getBookingStats,
} = require("../controllers/bookingController");
const { authenticate } = require("../middlewares/authMiddleware");

// 🔹 Create booking (user)
router.post("/create-bookings", authenticate, createBooking);

// 🔹 Get user's bookings
router.get("/user", authenticate, getUserBookings);

// 🔹 Get single booking by ID
router.get("/:id", authenticate, getBookingById);

// 🔹 Get shop's bookings (for barber)
router.get("/shop/:shopId", getShopBookings);  //http://localhost:5000/api/bookings/shop/:shopId

// 🔹 Get booked slots for specific date
router.get("/shop/:shopId/date/:date", getBookedSlots);

// 🔹 Update booking status
router.put("/:id/status", authenticate, updateBookingStatus);

// 🔹 Reschedule booking
router.put("/:id/reschedule", authenticate, rescheduleBooking);

// 🔹 Cancel booking
router.put("/:id/cancel", authenticate, cancelBooking);

// 🔹 Add review
router.put("/:id/review", authenticate, addReview);

// 🔹 Admin: Get all bookings
router.get("/admin/bookings", authenticate, getAllBookings);

// 🔹 Admin: Get booking statistics
router.get("/admin/bookings/stats/:shopId", authenticate, getBookingStats);

module.exports = router;

