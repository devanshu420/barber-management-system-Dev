// Complete routes for barber shop registration and management
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { body, validationResult } = require("express-validator");
const BarberShop = require("../models/barbershopnewmodel");

const upload = require("../middlewares/uploadShopImage");
const { uploadImage } = require("../services/imagekit.services");

const parseLocationForValidation = require("../middlewares/parseLocationForValidation");

// ====================== VALIDATION ======================

const validateShopRegistration = [
  body("shopName")
    .trim()
    .notEmpty()
    .withMessage("Shop name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Shop name must be 2-100 characters"),

  body("description")
    .trim()
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("location").notEmpty().withMessage("Location is required"),

  body("location.address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 5, max: 200 })
    .withMessage("Address must be 5-200 characters"),

  body("location.city").trim().notEmpty().withMessage("City is required"),

  body("location.state").trim().notEmpty().withMessage("State is required"),

  body("location.zipCode")
    .optional()
    .matches(/^[0-9]{5,6}$/)
    .withMessage("Invalid zip code format"),

  // coordinates: [lng, lat]
  body("location.coordinates")
    .isArray({ min: 2 })
    .withMessage("Coordinates are required"),

  body("location.coordinates.0")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid longitude"),

  body("location.coordinates.1")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid latitude"),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// ====================== REGISTER SHOP (JSON) ======================

// router.post(
//   "/register-shop",
//   validateShopRegistration,
//   handleValidationErrors,
//   async (req, res) => {
//     try {
//       console.log("BODY:", req.body);

//       let services = [];
//       let workingHours = {};
//       let staff = [];

//       try {
//         // Frontend se services, workingHours, staff direct JSON aa rahe honge
//         services = req.body.services || [];
//         workingHours = req.body.workingHours || {};
//         staff = req.body.staff || [];
//       } catch (parseError) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Invalid JSON format in services, working hours, or staff",
//         });
//       }

//       if (!services || services.length === 0) {
//         return res.status(400).json({
//           success: false,
//           message: "At least one service is required",
//         });
//       }

//       services = services.map((s) => ({
//         _id: new mongoose.Types.ObjectId(),
//         name: s.name,
//         price: s.price,
//         duration: s.duration,
//         category: s.category || "General",
//         isActive: true,
//       }));

//       const location = req.body.location;
//       const coords = Array.isArray(location.coordinates)
//         ? location.coordinates
//         : [];

//       const shopData = {
//         barberOwner: req.body.barberOwner,
//         shopName: req.body.shopName,
//         description: req.body.description || "",
//         location: {
//           address: location.address,
//           city: location.city,
//           state: location.state,
//           zipCode: location.zipCode || "",
//           coordinates: {
//             type: "Point",
//             coordinates: [
//               parseFloat(coords[0]) || 0, // lng
//               parseFloat(coords[1]) || 0, // lat
//             ],
//           },
//         },
//         images: [], // koi image nahi
//         services,
//         workingHours,
//         staff,
//         isActive: true,
//         isVerified: true,
//       };

//       const newShop = new BarberShop(shopData);
//       const savedShop = await newShop.save();

//       return res.status(201).json({
//         success: true,
//         message: "Shop registered successfully",
//         data: {
//           shopId: savedShop._id,
//           shopName: savedShop.shopName,
//         },
//       });
//     } catch (error) {
//       console.error("Registration error:", error);
//       return res.status(500).json({
//         success: false,
//         message: "Failed to register shop",
//       });
//     }
//   }
// );

const { authenticate, requireBarber } = require("../middlewares/authMiddleware");

// REGISTER SHOP (with optional single image)
router.post(
  "/register-shop",
  authenticate,
  requireBarber,
  upload.single("image"), // field name from frontend
  parseLocationForValidation,
  validateShopRegistration,
  handleValidationErrors,
  async (req, res) => {
    try {
      console.log("BODY:", req.body);

      let services = [];
      let workingHours = {};
      let staff = [];

      // ===== Parse JSON / plain values safely (frontend may send JSON strings) =====
      try {
        // services
        if (typeof req.body.services === "string") {
          services = JSON.parse(req.body.services);
        } else {
          services = req.body.services || [];
        }

        // workingHours
        if (typeof req.body.workingHours === "string") {
          workingHours = JSON.parse(req.body.workingHours);
        } else {
          workingHours = req.body.workingHours || {};
        }

        // staff
        if (typeof req.body.staff === "string") {
          staff = JSON.parse(req.body.staff);
        } else {
          staff = req.body.staff || [];
        }
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON format in services, working hours, or staff",
        });
      }

      // ===== Validate services =====
      if (!services || services.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one service is required",
        });
      }

      services = services.map((s) => ({
        _id: new mongoose.Types.ObjectId(),
        name: s.name,
        price: s.price,
        duration: s.duration,
        category: s.category || "General",
        isActive: true,
      }));

      // ===== Location parsing (stringified JSON support) =====
      let location = req.body.location;
      if (typeof location === "string") {
        try {
          location = JSON.parse(location);
        } catch (e) {
          return res.status(400).json({
            success: false,
            message: "Invalid JSON format in location",
          });
        }
      }
      if (!location || !location.coordinates) {
        return res.status(400).json({
          success: false,
          message: "Location with coordinates is required",
        });
      }

      const coords = Array.isArray(location.coordinates)
        ? location.coordinates
        : [];

      // ===== Optional image upload to ImageKit =====
      let uploadedImage = null;

      if (req.file) {
        try {
          uploadedImage = await uploadImage({
            buffer: req.file.buffer,
            folder: "/barber-book/shops",
          });
        } catch (err) {
          console.error("ImageKit upload error:", err);
          return res.status(500).json({
            success: false,
            message: "Failed to upload shop image",
          });
        }
      }

      // ===== Build shop data =====
      const shopData = {
        barberOwner: req.body.barberOwner,
        shopName: req.body.shopName,
        description: req.body.description || "",
        location: {
          address: location.address,
          city: location.city,
          state: location.state,
          zipCode: location.zipCode || "",
          coordinates: {
            type: "Point",
            coordinates: [
              parseFloat(coords[0]) || 0, // lng
              parseFloat(coords[1]) || 0, // lat
            ],
          },
        },
        image: uploadedImage
          ? {
              url: uploadedImage.url,
              thumbnail: uploadedImage.thumbnail,
              imageId: uploadedImage.id,
              uploadedAt: new Date(),
            }
          : null,
        services,
        workingHours,
        staff,
        isActive: true,
        isVerified: true,
      };

      const newShop = new BarberShop(shopData);
      const savedShop = await newShop.save();

      return res.status(201).json({
        success: true,
        message: "Shop registered successfully",
        data: {
          shopId: savedShop._id,
          shopName: savedShop.shopName,
          image: savedShop.image,
          servicesCount: services.length,
          staffCount: staff.length,
          location: savedShop.location,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to register shop",
      });
    }
  },
);

module.exports = router;

/**
 * GET /api/barber/shops
 * Get all registered barber shops with pagination
 */
router.get("/shops", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const city = req.query.city;

    let filter = { isActive: true, isVerified: true };

    if (city) {
      filter["location.city"] = { $regex: city, $options: "i" };
    }

    const total = await BarberShop.countDocuments(filter);

    const shops = await BarberShop.find(filter)
      .select("-__v")
      .sort({ rating: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.json({
      success: true,
      count: shops.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: shops,
    });
  } catch (error) {
    console.error("Get shops error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch shops",
    });
  }
});

// ============================================
// ROUTE 3: GET SHOP BY ID
// ============================================

router.get("/shops/:id", async (req, res) => {
  try {
    const shop = await BarberShop.findById(req.params.id).select("-__v").lean();

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    return res.json({
      success: true,
      data: shop,
    });
  } catch (error) {
    console.error("Get shop error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch shop",
    });
  }
});

// ============================================
// ROUTE 4: SEARCH SHOPS BY CITY
// ============================================

router.get("/shops-by-city/:city", async (req, res) => {
  try {
    const city = req.params.city;

    const shops = await BarberShop.find({
      "location.city": { $regex: city, $options: "i" },
      isActive: true,
      isVerified: true,
    })
      .select("-__v")
      .sort({ rating: -1 })
      .lean();

    return res.json({
      success: true,
      count: shops.length,
      city,
      data: shops,
    });
  } catch (error) {
    console.error("Search by city error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to search shops",
    });
  }
});

// ============================================
// ROUTE 5: SEARCH NEARBY SHOPS (GEOSPATIAL)
// ============================================

router.get("/nearby-shops", async (req, res) => {
  try {
    const latitude = parseFloat(req.query.latitude);
    const longitude = parseFloat(req.query.longitude);
    const maxDistance = (parseFloat(req.query.maxDistance) || 5) * 1000;
    const limit = parseInt(req.query.limit) || 20;

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: "Valid latitude and longitude required",
      });
    }

    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid coordinates range",
      });
    }

    const shops = await BarberShop.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          distanceField: "distance",
          distanceMultiplier: 0.001,
          maxDistance,
          spherical: true,
        },
      },
      {
        $match: {
          isActive: true,
          isVerified: true,
        },
      },
      {
        $sort: { distance: 1, rating: -1 },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 1,
          shopName: 1,
          description: 1,
          "location.address": 1,
          "location.city": 1,
          "location.coordinates": 1,
          "ratings.average": 1,
          "ratings.count": 1,
          images: 1,
          distance: { $round: ["$distance", 2] },
        },
      },
    ]);

    return res.json({
      success: true,
      count: shops.length,
      center: { latitude, longitude },
      maxDistance: parseFloat(req.query.maxDistance) || 5,
      data: shops,
    });
  } catch (error) {
    console.error("Nearby shops error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to find nearby shops",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// ============================================
// ROUTE 6: UPDATE SHOP
// ============================================

router.put("/shops/:id", async (req, res) => {
  try {
    const shopId = req.params.id;

    let updateData = { ...req.body };
    if (req.body.services) {
      updateData.services = JSON.parse(req.body.services);
    }
    if (req.body.workingHours) {
      updateData.workingHours = JSON.parse(req.body.workingHours);
    }

    const shop = await BarberShop.findByIdAndUpdate(shopId, updateData, {
      new: true,
      runValidators: true,
    }).select("-__v");

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    return res.json({
      success: true,
      message: "Shop updated successfully",
      data: shop,
    });
  } catch (error) {
    console.error("Update shop error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update shop",
    });
  }
});

// ============================================
// ROUTE 7: DELETE SHOP
// ============================================

router.delete("/shops/:id", async (req, res) => {
  try {
    const shop = await BarberShop.findByIdAndDelete(req.params.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    return res.json({
      success: true,
      message: "Shop deleted successfully",
      data: { id: shop._id },
    });
  } catch (error) {
    console.error("Delete shop error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete shop",
    });
  }
});

// shops by owner
router.get("/barbershops/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const shops = await BarberShop.find({ barberOwner: ownerId })
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean();

    if (!shops || shops.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No shops found for this owner",
      });
    }

    return res.json({
      success: true,
      count: shops.length,
      data: shops,
    });
  } catch (error) {
    console.error("Fetch owner shops error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch shops",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// ============================================
// ROUTE 9: SEARCH SHOPS
// ============================================

router.get("/search", async (req, res) => {
  try {
    const searchQuery = req.query.q;
    const searchType = req.query.type || "all";
    const limit = parseInt(req.query.limit) || 20;

    if (!searchQuery || searchQuery.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters",
      });
    }

    let filter = { isActive: true, isVerified: true };
    const regex = { $regex: searchQuery, $options: "i" };

    if (searchType === "name") {
      filter.shopName = regex;
    } else if (searchType === "city") {
      filter["location.city"] = regex;
    } else if (searchType === "service") {
      filter["services.name"] = regex;
    } else {
      filter.$or = [
        { shopName: regex },
        { "location.city": regex },
        { "services.name": regex },
        { "location.address": regex },
      ];
    }

    const shops = await BarberShop.find(filter)
      .select("-__v")
      .sort({ rating: -1 })
      .limit(limit)
      .lean();

    return res.json({
      success: true,
      count: shops.length,
      query: searchQuery,
      searchType,
      data: shops,
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
});

// ============================================
// ROUTE 10: ADD SERVICE TO SHOP
// ============================================

router.post("/shops/:id/services", async (req, res) => {
  try {
    const { name, price, duration, category } = req.body;

    if (!name || !price || !duration || !category) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, price, duration, category",
      });
    }

    const shop = await BarberShop.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          services: {
            name,
            price: Number(price),
            duration: Number(duration),
            category,
            isActive: true,
          },
        },
      },
      { new: true },
    ).select("-__v");

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    return res.json({
      success: true,
      message: "Service added successfully",
      data: shop,
    });
  } catch (error) {
    console.error("Add service error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add service",
    });
  }
});

// ============================================
// ROUTE 11: REMOVE SERVICE FROM SHOP
// ============================================

router.delete("/shops/:id/services/:serviceId", async (req, res) => {
  try {
    const shop = await BarberShop.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          services: { _id: req.params.serviceId },
        },
      },
      { new: true },
    ).select("-__v");

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    return res.json({
      success: true,
      message: "Service removed successfully",
      data: shop,
    });
  } catch (error) {
    console.error("Remove service error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove service",
    });
  }
});

// ============================================
// ROUTE 12: GET TOP RATED SHOPS
// ============================================

router.get("/top-rated", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const minRating = parseFloat(req.query.minRating) || 0;

    const shops = await BarberShop.find({
      isActive: true,
      isVerified: true,
      rating: { $gte: minRating },
    })
      .select("-__v")
      .sort({ rating: -1 })
      .limit(limit)
      .lean();

    return res.json({
      success: true,
      count: shops.length,
      data: shops,
    });
  } catch (error) {
    console.error("Top rated shops error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch top rated shops",
    });
  }
});

module.exports = router;

