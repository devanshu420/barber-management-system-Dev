const express = require("express")
const router = express.Router()
const barberController = require("../controllers/barberController")
const { authenticate, authorize } = require("../middlewares/authMiddleware")

// Get all barbers with location filtering
router.get("/", barberController.getAllBarbers)

// Get barber by ID
router.get("/:id", barberController.getBarberById)

// Get barbers by location
router.get("/location/nearby", barberController.getNearbyBarbers)

// Protected routes - for barbers
router.post("/register", authenticate, barberController.registerBarber)
router.put("/:id", authenticate, barberController.updateBarber)
router.post("/:id/services", authenticate, barberController.addService)
router.get("/:id/availability", barberController.getAvailability)
router.put("/:id/availability", authenticate, barberController.updateAvailability)
router.get("/:id/earnings", authenticate, barberController.getEarnings)
router.post("/:id/reviews", authenticate, barberController.addReview)

module.exports = router
