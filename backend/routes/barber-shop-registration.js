// Complete routes for barber shop registration and management
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { body, validationResult } = require("express-validator");
const BarberShop = require("../models/barbershopnewmodel");


// // ============================================
// // VALIDATION MIDDLEWARE
// // ============================================

// const validateShopRegistration = [
//   body("shopName")
//     .trim()
//     .notEmpty()
//     .withMessage("Shop name is required")
//     .isLength({ min: 2, max: 100 })
//     .withMessage("Shop name must be 2-100 characters"),

//   body("description")
//     .trim()
//     .optional()
//     .isLength({ max: 500 })
//     .withMessage("Description cannot exceed 500 characters"),

//   body("location")
//     .notEmpty()
//     .withMessage("Location is required"),

//   body("location.address")
//     .trim()
//     .notEmpty()
//     .withMessage("Address is required")
//     .isLength({ min: 5, max: 200 })
//     .withMessage("Address must be 5-200 characters"),

//   body("location.city")
//     .trim()
//     .notEmpty()
//     .withMessage("City is required"),

//   body("location.state")
//     .trim()
//     .notEmpty()
//     .withMessage("State is required"),

//   body("location.zipCode")
//     .optional()
//     .matches(/^[0-9]{5,6}$/)
//     .withMessage("Invalid zip code format"),

//   // coordinates: [lng, lat]
//   body("location.coordinates")
//     .isArray({ min: 2 })
//     .withMessage("Coordinates are required"),

//   body("location.coordinates.0")
//     .isFloat({ min: -180, max: 180 })
//     .withMessage("Invalid longitude"),

//   body("location.coordinates.1")
//     .isFloat({ min: -90, max: 90 })
//     .withMessage("Invalid latitude"),
// ];

// const handleValidationErrors = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     // agar kabhi files use karo to yahan delete kar sakte ho
//     if (req.files) {
//       req.files.forEach((file) => {
//         fs.unlink(file.path, (err) => {
//           if (err) console.error("Error deleting file:", err);
//         });
//       });
//     }
//     return res.status(400).json({
//       success: false,
//       message: "Validation failed",
//       errors: errors.array(),
//     });
//   }
//   next();
// };

// // ============================================
// // ROUTE 2: REGISTER SHOP
// // ============================================

// // NOTE: abhi upload.single("image") hata diya hai, images: [] store ho rahi
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
//         services =
//           typeof req.body.services === "string"
//             ? JSON.parse(req.body.services)
//             : req.body.services || [];

//         services = services.map((s) => ({
//           _id: new mongoose.Types.ObjectId(),
//           name: s.name,
//           price: s.price,
//           duration: s.duration,
//           category: s.category || "General",
//           isActive: true,
//         }));

//         workingHours =
//           typeof req.body.workingHours === "string"
//             ? JSON.parse(req.body.workingHours)
//             : req.body.workingHours || {};

//         staff =
//           typeof req.body.staff === "string"
//             ? JSON.parse(req.body.staff)
//             : req.body.staff || [];
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

//       // location JSON string ko parse karo
//       let location = req.body.location;
//       if (typeof location === "string") {
//         location = JSON.parse(location);
//       }

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
//               parseFloat(coords[0]) || 0, // longitude
//               parseFloat(coords[1]) || 0, // latitude
//             ],
//           },
//         },
//         images: [], // abhi image store nahi kar rahe
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
//           imageCount: 0,
//           images: [],
//           servicesCount: services.length,
//           staffCount: staff.length,
//           location: savedShop.location,
//         },
//       });
//     } catch (error) {
//       console.error("Registration error:", error);
//       return res.status(500).json({
//         success: false,
//         message: "Failed to register shop",
//         error:
//           process.env.NODE_ENV === "development" ? error.message : undefined,
//       });
//     }
//   }
// );






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

  body("location")
    .notEmpty()
    .withMessage("Location is required"),

  body("location.address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 5, max: 200 })
    .withMessage("Address must be 5-200 characters"),

  body("location.city")
    .trim()
    .notEmpty()
    .withMessage("City is required"),

  body("location.state")
    .trim()
    .notEmpty()
    .withMessage("State is required"),

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

router.post(
  "/register-shop",
  validateShopRegistration,
  handleValidationErrors,
  async (req, res) => {
    try {
      console.log("BODY:", req.body);

      let services = [];
      let workingHours = {};
      let staff = [];

      try {
        // Frontend se services, workingHours, staff direct JSON aa rahe honge
        services = req.body.services || [];
        workingHours = req.body.workingHours || {};
        staff = req.body.staff || [];
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid JSON format in services, working hours, or staff",
        });
      }

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

      const location = req.body.location;
      const coords = Array.isArray(location.coordinates)
        ? location.coordinates
        : [];

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
        images: [], // koi image nahi
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
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to register shop",
      });
    }
  }
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
    const shop = await BarberShop.findById(req.params.id)
      .select("-__v")
      .lean();

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
      error:
        process.env.NODE_ENV === "development" ? error.message : undefined,
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
      error:
        process.env.NODE_ENV === "development" ? error.message : undefined,
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
        message:
          "Missing required fields: name, price, duration, category",
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
      { new: true }
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
      { new: true }
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


















// // Complete routes for barber shop registration and management
// const mongoose = require("mongoose");
// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// const { body, validationResult } = require("express-validator");
// const BarberShop = require("../models/barbershopnewmodel");

// // ============================================
// // MULTER CONFIGURATION
// // ============================================

// const uploadsDir = path.join(__dirname, "../uploads/shops");
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
//   console.log("✓ Created uploads/shops directory");
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadsDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, "shop-" + uniqueSuffix + path.extname(file.originalname));
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
//   if (allowedMimes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error(`Invalid file type: ${file.mimetype}`), false);
//   }
// };

// // SINGLE FILE ONLY
// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB
//   },
// });

// // ============================================
// // VALIDATION MIDDLEWARE
// // ============================================


// // const validateShopRegistration = [
// //   body("shopName")
// //     .trim()
// //     .notEmpty()
// //     .withMessage("Shop name is required")
// //     .isLength({ min: 2, max: 100 })
// //     .withMessage("Shop name must be 2-100 characters"),

// //   body("description")
// //     .trim()
// //     .optional()
// //     .isLength({ max: 500 })
// //     .withMessage("Description cannot exceed 500 characters"),

// //   body("location.address")
// //     .trim()
// //     .notEmpty()
// //     .withMessage("Address is required")
// //     .isLength({ min: 5, max: 200 })
// //     .withMessage("Address must be 5-200 characters"),

// //   body("location.city").trim().notEmpty().withMessage("City is required"),

// //   body("location.state").trim().notEmpty().withMessage("State is required"),

// //   body("location.zipCode")
// //     .optional()
// //     .matches(/^[0-9]{5,6}$/)
// //     .withMessage("Invalid zip code format"),

// //   body("location.coordinates.coordinates")
// //     .isArray({ min: 2 })
// //     .withMessage("Coordinates are required"),

// //   body("location.coordinates.coordinates.0")
// //     .isFloat({ min: -180, max: 180 })
// //     .withMessage("Invalid longitude"),

// //   body("location.coordinates.coordinates.1")
// //     .isFloat({ min: -90, max: 90 })
// //     .withMessage("Invalid latitude"),
// // ];


// const validateShopRegistration = [
//   body("shopName")
//     .trim()
//     .notEmpty().withMessage("Shop name is required")
//     .isLength({ min: 2, max: 100 }).withMessage("Shop name must be 2-100 characters"),

//   body("description")
//     .trim()
//     .optional()
//     .isLength({ max: 500 }).withMessage("Description cannot exceed 500 characters"),

//   body("location")
//     .notEmpty().withMessage("Location is required"),

//   body("location.address")
//     .notEmpty().withMessage("Address is required")
//     .isLength({ min: 5, max: 200 }).withMessage("Address must be 5-200 characters"),

//   body("location.city")
//     .notEmpty().withMessage("City is required"),

//   body("location.state")
//     .notEmpty().withMessage("State is required"),

//   body("location.zipCode")
//     .optional()
//     .matches(/^[0-9]{5,6}$/).withMessage("Invalid zip code format"),

//   // coordinates: [lng, lat]
//   body("location.coordinates.coordinates")
//     .isArray({ min: 2 }).withMessage("Coordinates are required"),

//   body("location.coordinates.coordinates.0")
//     .isFloat({ min: -180, max: 180 }).withMessage("Invalid longitude"),

//   body("location.coordinates.coordinates.1")
//     .isFloat({ min: -90, max: 90 }).withMessage("Invalid latitude"),
// ];



// const handleValidationErrors = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     if (req.files) {
//       req.files.forEach((file) => {
//         fs.unlink(file.path, (err) => {
//           if (err) console.error("Error deleting file:", err);
//         });
//       });
//     }
//     return res.status(400).json({
//       success: false,
//       message: "Validation failed",
//       errors: errors.array(),
//     });
//   }
//   next();
// };

// // ============================================
// // ROUTE 2: REGISTER SHOP
// // ============================================

// // router.post(
// //   "/register-shop",
// //   upload.single("image"), // only single file
// //   validateShopRegistration,
// //   handleValidationErrors,
// //   async (req, res) => {
// //     try {
// //       console.log("BODY:", req.body);
// //       // Parse JSON fields
// //       let services = [];
// //       let workingHours = {};
// //       let staff = [];

// //       try {
// //         // services = JSON.parse(req.body.services || '[]');
// //         //         services = (req.body.services || '[]').map(s => ({
// //         //   _id: new mongoose.Types.ObjectId(),
// //         //   name: s.name,
// //         //   price: s.price,
// //         //   duration: s.duration,
// //         //   category: s.category || "General",
// //         //   isActive: true
// //         // }));
// //         services =
// //           typeof req.body.services === "string"
// //             ? JSON.parse(req.body.services)
// //             : req.body.services || [];

// //         services = services.map((s) => ({
// //           _id: new mongoose.Types.ObjectId(),
// //           name: s.name,
// //           price: s.price,
// //           duration: s.duration,
// //           category: s.category || "General",
// //           isActive: true,
// //         }));
// //         // workingHours = (req.body.workingHours || '{}');
// //         // staff = (req.body.staff || '[]');

// //         workingHours =
// //           typeof req.body.workingHours === "string"
// //             ? JSON.parse(req.body.workingHours)
// //             : req.body.workingHours || {};

// //         staff =
// //           typeof req.body.staff === "string"
// //             ? JSON.parse(req.body.staff)
// //             : req.body.staff || [];
// //       } catch (parseError) {
// //         // Delete uploaded file on parse error
// //         if (req.file) fs.unlink(req.file.path, () => {});
// //         return res.status(400).json({
// //           success: false,
// //           message: "Invalid JSON format in services, working hours, or staff",
// //         });
// //       }

// //       // Validate services
// //       if (!services || services.length === 0) {
// //         if (req.file) fs.unlink(req.file.path, () => {});
// //         return res.status(400).json({
// //           success: false,
// //           message: "At least one service is required",
// //         });
// //       }

// //       // Prepare image data
// //       const imagePaths = req.file
// //         ? [
// //             {
// //               filename: req.file.filename,
// //               path: `/uploads/shops/${req.file.filename}`,
// //               size: req.file.size,
// //               mimetype: req.file.mimetype,
// //               uploadedAt: new Date(),
// //             },
// //           ]
// //         : [];

// //       // Create shop object
// //       //       const shopData = {
// //       //         shopName: req.body.shopName,
// //       //         description: req.body.description || '',
// //       //         location: {
// //       //           address: req.body.address,
// //       //           city: req.body.city,
// //       //           state: req.body.state,
// //       //           zipCode: req.body.zipCode || '',
// //       //           coordinates: {
// //       //   type: "Point",
// //       //   coordinates: [
// //       //     parseFloat(req.body.longitude),
// //       //     parseFloat(req.body.latitude)
// //       //   ]
// //       // }
// //       //         },
// //       //         images: imagePaths,
// //       //         services,
// //       //         workingHours,
// //       //         staff: staff.filter(s => s.name && s.name.trim()),
// //       //         barberOwner: req.body.barberOwner,
// //       //         isActive: true,
// //       //         isVerified: true
// //       //       };
// //       // Create shop object
// //       const shopData = {
// //         barberOwner: req.body.barberOwner, // 👈 ADD THIS

// //         shopName: req.body.shopName,
// //         description: req.body.description || "",
// //         location: {
// //           address: req.body.location.address,
// //           city: req.body.location.city,
// //           state: req.body.location.state,
// //           zipCode: req.body.location.zipCode || "",
// //           coordinates: {
// //             type: "Point",
// //             coordinates: [
// //               parseFloat(req.body.location.coordinates.coordinates[0]),
// //               parseFloat(req.body.location.coordinates.coordinates[1]),
// //             ],
// //           },
// //         },
// //         images: imagePaths,
// //         services,
// //         workingHours,
// //         staff,
// //         isActive: true,
// //         isVerified: true,
// //       };

// //       const newShop = new BarberShop(shopData);
// //       const savedShop = await newShop.save();

// //       return res.status(201).json({
// //         success: true,
// //         message: "Shop registered successfully",
// //         data: {
// //           shopId: savedShop._id,
// //           shopName: savedShop.shopName,
// //           imageCount: imagePaths.length,
// //           images: imagePaths,
// //           servicesCount: services.length,
// //           staffCount: staff.length,
// //           location: savedShop.location,
// //         },
// //       });
// //     } catch (error) {
// //       console.error("Registration error:", error);
// //       if (req.file) fs.unlink(req.file.path, () => {});
// //       return res.status(500).json({
// //         success: false,
// //         message: "Failed to register shop",
// //         error:
// //           process.env.NODE_ENV === "development" ? error.message : undefined,
// //       });
// //     }
// //   },
// // );
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
//         services =
//           typeof req.body.services === "string"
//             ? JSON.parse(req.body.services)
//             : req.body.services || [];

//         services = services.map((s) => ({
//           _id: new mongoose.Types.ObjectId(),
//           name: s.name,
//           price: s.price,
//           duration: s.duration,
//           category: s.category || "General",
//           isActive: true,
//         }));

//         workingHours =
//           typeof req.body.workingHours === "string"
//             ? JSON.parse(req.body.workingHours)
//             : req.body.workingHours || {};

//         staff =
//           typeof req.body.staff === "string"
//             ? JSON.parse(req.body.staff)
//             : req.body.staff || [];
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

//       // ❌ imagePaths, req.file sab hata do

//       // Agar frontend se `location` JSON string aa rahi hai:
//       let location = req.body.location;
//       if (typeof location === "string") {
//         location = JSON.parse(location);
//       }

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
//               parseFloat(location.coordinates.coordinates[0]),
//               parseFloat(location.coordinates.coordinates[1]),
//             ],
//           },
//         },
//         images: [], // ✅ ab empty array
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
//           imageCount: 0,
//           images: [],
//           servicesCount: services.length,
//           staffCount: staff.length,
//           location: savedShop.location,
//         },
//       });
//     } catch (error) {
//       console.error("Registration error:", error);
//       return res.status(500).json({
//         success: false,
//         message: "Failed to register shop",
//         error:
//           process.env.NODE_ENV === "development"
//             ? error.message
//             : undefined,
//       });
//     }
//   }
// );



// /**
//  * GET /api/barber/shops
//  * Get all registered barber shops with pagination
//  *
//  * Query Parameters:
//  * - page (number, default 1)
//  * - limit (number, default 20)
//  * - city (string, optional - filter by city)
//  * - minRating (number, optional - filter by minimum rating)
//  */

// router.get("/shops", async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 20;
//     const skip = (page - 1) * limit;
//     const city = req.query.city;
//     const minRating = parseFloat(req.query.minRating) || 0;

//     // Build filter
//     // let filter = { isActive: true, isVerified: true, rating: { $gte: minRating } };
//     let filter = { isActive: true, isVerified: true };

//     if (city) {
//       filter["location.city"] = { $regex: city, $options: "i" };
//     }

//     // Get total count
//     const total = await BarberShop.countDocuments(filter);

//     // Get shops
//     const shops = await BarberShop.find(filter)
//       .select("-__v")
//       .sort({ rating: -1, createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .lean();

//     return res.json({
//       success: true,
//       count: shops.length,
//       total: total,
//       page: page,
//       pages: Math.ceil(total / limit),
//       data: shops,
//     });
//   } catch (error) {
//     console.error("Get shops error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch shops",
//     });
//   }
// });

// // ============================================
// // ROUTE 3: GET SHOP BY ID
// // ============================================

// /**
//  * GET /api/barber/shops/:id
//  * Get shop details by ID
//  *
//  * Parameters:
//  * - id (string, required - Shop ID)
//  */

// router.get("/shops/:id", async (req, res) => {
//   try {
//     const shop = await BarberShop.findById(req.params.id).select("-__v").lean();

//     if (!shop) {
//       return res.status(404).json({
//         success: false,
//         message: "Shop not found",
//       });
//     }

//     return res.json({
//       success: true,
//       data: shop,
//     });
//   } catch (error) {
//     console.error("Get shop error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch shop",
//     });
//   }
// });

// // ============================================
// // ROUTE 4: SEARCH SHOPS BY CITY
// // ============================================

// /**
//  * GET /api/barber/shops-by-city/:city
//  * Get shops by city
//  *
//  * Parameters:
//  * - city (string, required)
//  */

// router.get("/shops-by-city/:city", async (req, res) => {
//   try {
//     const city = req.params.city;

//     const shops = await BarberShop.find({
//       "location.city": { $regex: city, $options: "i" },
//       isActive: true,
//       isVerified: true,
//     })
//       .select("-__v")
//       .sort({ rating: -1 })
//       .lean();

//     return res.json({
//       success: true,
//       count: shops.length,
//       city: city,
//       data: shops,
//     });
//   } catch (error) {
//     console.error("Search by city error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to search shops",
//     });
//   }
// });

// // ============================================
// // ROUTE 5: SEARCH NEARBY SHOPS (GEOSPATIAL)
// // ============================================

// /**
//  * GET /api/barber/nearby-shops
//  * Find shops near given coordinates
//  *
//  * Query Parameters:
//  * - latitude (number, required)
//  * - longitude (number, required)
//  * - maxDistance (number, optional - in km, default 5)
//  * - limit (number, optional - default 20)
//  */

// router.get("/nearby-shops", async (req, res) => {
//   try {
//     const latitude = parseFloat(req.query.latitude);
//     const longitude = parseFloat(req.query.longitude);
//     const maxDistance = (parseFloat(req.query.maxDistance) || 5) * 1000; // Convert km to meters
//     const limit = parseInt(req.query.limit) || 20;

//     // Validate coordinates
//     if (isNaN(latitude) || isNaN(longitude)) {
//       return res.status(400).json({
//         success: false,
//         message: "Valid latitude and longitude required",
//       });
//     }

//     if (
//       latitude < -90 ||
//       latitude > 90 ||
//       longitude < -180 ||
//       longitude > 180
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid coordinates range",
//       });
//     }

//     // Query nearby shops
//     const shops = await BarberShop.aggregate([
//       {
//         $geoNear: {
//           near: {
//             type: "Point",
//             coordinates: [longitude, latitude],
//           },
//           distanceField: "distance",
//           distanceMultiplier: 0.001, // meters to km
//           maxDistance: maxDistance,
//           spherical: true,
//         },
//       },
//       {
//         $match: {
//           isActive: true,
//           isVerified: true,
//         },
//       },
//       {
//         $sort: { distance: 1, rating: -1 },
//       },
//       {
//         $limit: limit,
//       },
//       {
//         $project: {
//           _id: 1,
//           shopName: 1,
//           description: 1,
//           "location.address": 1,
//           "location.city": 1,
//           "location.coordinates": 1,
//           "ratings.average": 1,
//           "ratings.count": 1,
//           images: 1,
//           distance: { $round: ["$distance", 2] },
//         },
//       },
//     ]);

//     return res.json({
//       success: true,
//       count: shops.length,
//       center: { latitude, longitude },
//       maxDistance: parseFloat(req.query.maxDistance) || 5,
//       data: shops,
//     });
//   } catch (error) {
//     console.error("Nearby shops error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to find nearby shops",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// });

// // ============================================
// // ROUTE 6: UPDATE SHOP
// // ============================================

// /**
//  * PUT /api/barber/shops/:id
//  * Update shop details
//  *
//  * Parameters:
//  * - id (string, required - Shop ID)
//  *
//  * Body:
//  * - shopName (string, optional)
//  * - description (string, optional)
//  * - address (string, optional)
//  * - city (string, optional)
//  * - state (string, optional)
//  * - services (JSON string, optional)
//  * - workingHours (JSON string, optional)
//  */

// router.put("/shops/:id", async (req, res) => {
//   try {
//     const shopId = req.params.id;

//     // Parse JSON if provided
//     let updateData = { ...req.body };
//     if (req.body.services) {
//       updateData.services = JSON.parse(req.body.services);
//     }
//     if (req.body.workingHours) {
//       updateData.workingHours = JSON.parse(req.body.workingHours);
//     }

//     const shop = await BarberShop.findByIdAndUpdate(shopId, updateData, {
//       new: true,
//       runValidators: true,
//     }).select("-__v");

//     if (!shop) {
//       return res.status(404).json({
//         success: false,
//         message: "Shop not found",
//       });
//     }

//     return res.json({
//       success: true,
//       message: "Shop updated successfully",
//       data: shop,
//     });
//   } catch (error) {
//     console.error("Update shop error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to update shop",
//     });
//   }
// });

// // ============================================
// // ROUTE 7: DELETE SHOP
// // ============================================

// /**
//  * DELETE /api/barber/shops/:id
//  * Delete a shop
//  *
//  * Parameters:
//  * - id (string, required - Shop ID)
//  */

// router.delete("/shops/:id", async (req, res) => {
//   try {
//     const shop = await BarberShop.findByIdAndDelete(req.params.id);

//     if (!shop) {
//       return res.status(404).json({
//         success: false,
//         message: "Shop not found",
//       });
//     }

//     return res.json({
//       success: true,
//       message: "Shop deleted successfully",
//       data: { id: shop._id },
//     });
//   } catch (error) {
//     console.error("Delete shop error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete shop",
//     });
//   }
// });

// router.get("/barbershops/:ownerId", async (req, res) => {
//   try {
//     const { ownerId } = req.params;

//     const shops = await BarberShop.find({ barberOwner: ownerId })
//       .select("-__v")
//       .sort({ createdAt: -1 })
//       .lean();

//     if (!shops || shops.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No shops found for this owner",
//       });
//     }

//     return res.json({
//       success: true,
//       count: shops.length,
//       data: shops,
//     });
//   } catch (error) {
//     console.error("Fetch owner shops error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch shops",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// });

// // router.get('/barbershops/:ownerId', async (req, res) => {
// //   try {
// //     const shops = await BarberShop.find({
// //       barberOwner: req.params.ownerId
// //     })
// //       .select('-__v')
// //       .sort({ createdAt: -1 })
// //       .lean();

// //       console.log('OwnerId route hit:', req.params.ownerId);

// //     return res.json({
// //       success: true,
// //       count: shops.length,
// //       data: shops
// //     });

// //   } catch (error) {
// //     console.error('Get owner shops error:', error);
// //     return res.status(500).json({
// //       success: false,
// //       message: 'Failed to fetch your shops'
// //     });
// //   }
// // });

// // ============================================
// // ROUTE 9: SEARCH SHOPS
// // ============================================

// /**
//  * GET /api/barber/search
//  * Search shops by name, city, or services
//  *
//  * Query Parameters:
//  * - q (string, required - search query)
//  * - type (string, optional - 'name', 'city', 'service', default all)
//  * - limit (number, optional - default 20)
//  */

// router.get("/search", async (req, res) => {
//   try {
//     const searchQuery = req.query.q;
//     const searchType = req.query.type || "all";
//     const limit = parseInt(req.query.limit) || 20;

//     if (!searchQuery || searchQuery.length < 2) {
//       return res.status(400).json({
//         success: false,
//         message: "Search query must be at least 2 characters",
//       });
//     }

//     let filter = { isActive: true, isVerified: true };
//     const regex = { $regex: searchQuery, $options: "i" };

//     if (searchType === "name") {
//       filter.shopName = regex;
//     } else if (searchType === "city") {
//       filter["location.city"] = regex;
//     } else if (searchType === "service") {
//       filter["services.name"] = regex;
//     } else {
//       // Search all
//       filter.$or = [
//         { shopName: regex },
//         { "location.city": regex },
//         { "services.name": regex },
//         { "location.address": regex },
//       ];
//     }

//     const shops = await BarberShop.find(filter)
//       .select("-__v")
//       .sort({ rating: -1 })
//       .limit(limit)
//       .lean();

//     return res.json({
//       success: true,
//       count: shops.length,
//       query: searchQuery,
//       searchType: searchType,
//       data: shops,
//     });
//   } catch (error) {
//     console.error("Search error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Search failed",
//     });
//   }
// });

// // ============================================
// // ROUTE 10: ADD SERVICE TO SHOP
// // ============================================

// /**
//  * POST /api/barber/shops/:id/services
//  * Add a new service to shop
//  *
//  * Parameters:
//  * - id (string, required - Shop ID)
//  *
//  * Body:
//  * - name (string, required)
//  * - price (number, required)
//  * - duration (number, required)
//  * - category (string, required)
//  */

// router.post("/shops/:id/services", async (req, res) => {
//   try {
//     const { name, price, duration, category } = req.body;

//     if (!name || !price || !duration || !category) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields: name, price, duration, category",
//       });
//     }

//     const shop = await BarberShop.findByIdAndUpdate(
//       req.params.id,
//       {
//         $push: {
//           services: {
//             name,
//             price: Number(price),
//             duration: Number(duration),
//             category,
//             isActive: true,
//           },
//         },
//       },
//       { new: true },
//     ).select("-__v");

//     if (!shop) {
//       return res.status(404).json({
//         success: false,
//         message: "Shop not found",
//       });
//     }

//     return res.json({
//       success: true,
//       message: "Service added successfully",
//       data: shop,
//     });
//   } catch (error) {
//     console.error("Add service error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to add service",
//     });
//   }
// });

// // ============================================
// // ROUTE 11: REMOVE SERVICE FROM SHOP
// // ============================================

// /**
//  * DELETE /api/barber/shops/:id/services/:serviceId
//  * Remove a service from shop
//  *
//  * Parameters:
//  * - id (string, required - Shop ID)
//  * - serviceId (string, required - Service ID)
//  */

// router.delete("/shops/:id/services/:serviceId", async (req, res) => {
//   try {
//     const shop = await BarberShop.findByIdAndUpdate(
//       req.params.id,
//       {
//         $pull: {
//           services: { _id: req.params.serviceId },
//         },
//       },
//       { new: true },
//     ).select("-__v");

//     if (!shop) {
//       return res.status(404).json({
//         success: false,
//         message: "Shop not found",
//       });
//     }

//     return res.json({
//       success: true,
//       message: "Service removed successfully",
//       data: shop,
//     });
//   } catch (error) {
//     console.error("Remove service error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to remove service",
//     });
//   }
// });

// // ============================================
// // ROUTE 12: GET TOP RATED SHOPS
// // ============================================

// /**
//  * GET /api/barber/top-rated
//  * Get top rated barber shops
//  *
//  * Query Parameters:
//  * - limit (number, optional - default 10)
//  * - minRating (number, optional - minimum rating)
//  */

// router.get("/top-rated", async (req, res) => {
//   try {
//     const limit = parseInt(req.query.limit) || 10;
//     const minRating = parseFloat(req.query.minRating) || 0;

//     const shops = await BarberShop.find({
//       isActive: true,
//       isVerified: true,
//       rating: { $gte: minRating },
//     })
//       .select("-__v")
//       .sort({ rating: -1 })
//       .limit(limit)
//       .lean();

//     return res.json({
//       success: true,
//       count: shops.length,
//       data: shops,
//     });
//   } catch (error) {
//     console.error("Top rated shops error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch top rated shops",
//     });
//   }
// });

// module.exports = router;
