const express = require("express")
const router = express.Router()
const bookingController = require("../controllers/bookingController")
const { authenticate, authorize } = require("../middlewares/authMiddleware")

// Create booking
router.post("/", authenticate, bookingController.createBooking)

// Get all bookings (user)
router.get("/user", authenticate, bookingController.getUserBookings)

// Get booking by ID
router.get("/:id", authenticate, bookingController.getBookingById)

// Update booking status
router.put("/:id/status", authenticate, bookingController.updateBookingStatus)

// Reschedule booking
router.post("/:id/reschedule", authenticate, bookingController.rescheduleBooking)

// Cancel booking
router.post("/:id/cancel", authenticate, bookingController.cancelBooking)

// Add review
router.post("/:id/review", authenticate, bookingController.addReview)

// Get available slots
router.post("/slots/available", bookingController.getAvailableSlots)

// Admin - get all bookings
router.get("/admin/all", authenticate, authorize("admin"), bookingController.getAllBookings)

module.exports = router
