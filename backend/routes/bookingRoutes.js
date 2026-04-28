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
  searchBookingByNumber,
} = require("../controllers/bookingController");
const { authenticate, requireBarber } = require("../middlewares/authMiddleware");

// Create booking
router.post("/create-bookings", authenticate, createBooking);

// User bookings
router.get("/user", authenticate, getUserBookings);

// Shop routes
router.get("/shop/:shopId/date/:date", getBookedSlots);
router.get("/shop/:shopId", getShopBookings);

// Admin routes
router.get("/admin/bookings", authenticate, getAllBookings);
router.get("/admin/bookings/stats/:shopId", authenticate, getBookingStats);

// Search
router.get(
  "/search/:bookingNumber",
  authenticate,
  requireBarber,
  searchBookingByNumber,
);

// Single booking by id
router.get("/:id", authenticate, getBookingById);
router.put("/:id/status", authenticate, updateBookingStatus);
router.put("/:id/reschedule", authenticate, rescheduleBooking);
router.put("/:id/cancel", authenticate, cancelBooking);
router.put("/:id/review", authenticate, addReview);

module.exports = router;
