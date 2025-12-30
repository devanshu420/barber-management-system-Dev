const express = require("express");
const router = express.Router();
const {
  registerBarberShop,
  getBarberShopByUserId,
  getAllBarberShops,
  getShopsByBarberId,
  updateBarberShop,
  deleteBarberShop,
  getShopById,
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

// Get shop by ID
router.get('/barber-shop/:shopId',authenticate, getShopById);

// Update shop
router.put("/shop/:id", authenticate, updateBarberShop);

// Delete shop
router.delete("/shop/:id", authenticate, deleteBarberShop);

module.exports = router;



