const express = require("express");
const router = express.Router();
const {
  registerBarberShop,
  getBarberShopByUserId,
  getAllBarberShops,
  getShopsByBarberId,
  updateBarberShop,
  deleteBarberShop,
} = require("../controllers/barberShopController");
const { authenticate } = require("../middlewares/authMiddleware");

// Register barber shop
router.post("/barber-shop-registration", authenticate, registerBarberShop);

// Get single shop by barber user ID
router.get("/shop/:id", authenticate, getBarberShopByUserId);

// Get all shops
router.get("/all-shops", getAllBarberShops);

// Get multiple shops by barber ID
router.get("/barbershops", getShopsByBarberId);

// Update shop
router.put("/shop/:id", authenticate, updateBarberShop);

// Delete shop
router.delete("/shop/:id", authenticate, deleteBarberShop);

module.exports = router;




// const express = require("express")
// const router = express.Router()
// const barberController = require("../controllers/barberShopController")
// const { authenticate, authorize } = require("../middlewares/authMiddleware")

// // Get all barbers with location filtering
// router.get("/", barberController.getAllBarbers)

// // Get barber by ID
// router.get("/:id", barberController.getBarberById)

// // Get barbers by location
// router.get("/location/nearby", barberController.getNearbyBarbers)

// // Protected routes - for barbers
// router.post("/shop-register", authenticate, barberController.registerBarberShop)
// router.put("/:id", authenticate, barberController.updateBarber)
// router.post("/:id/services", authenticate, barberController.addService)
// router.get("/:id/availability", barberController.getAvailability)
// router.put("/:id/availability", authenticate, barberController.updateAvailability)
// router.get("/:id/earnings", authenticate, barberController.getEarnings)
// router.post("/:id/reviews", authenticate, barberController.addReview)

// module.exports = router
