const express = require("express")
const router = express.Router()
const adminController = require("../controllers/adminController")
const { authenticate, authorize } = require("../middlewares/authMiddleware")

// All admin routes require authentication and admin role
router.use(authenticate, authorize("admin"))

// Dashboard stats
router.get("/dashboard", adminController.getDashboardStats)

// User management
router.get("/users", adminController.getAllUsers)
router.put("/users/:id", adminController.updateUser)
router.delete("/users/:id", adminController.deleteUser)

// Barber management
router.get("/barbers", adminController.getAllBarbers)
router.put("/barbers/:id/verify", adminController.verifyBarber)
router.delete("/barbers/:id", adminController.deleteBarber)

// Booking management
router.get("/bookings", adminController.getAllBookings)
router.put("/bookings/:id", adminController.updateBooking)

// Financial reports
router.get("/reports/revenue", adminController.getRevenueReport)
router.get("/reports/bookings", adminController.getBookingReport)

// Settings
router.get("/settings", adminController.getSettings)
router.put("/settings", adminController.updateSettings)

module.exports = router
