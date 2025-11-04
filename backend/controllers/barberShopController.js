// const Barber = require("../models/BarberShop")
const Service = require("../models/Service")
const User = require("../models/User")
const BarberShopModel = require("../models/BarberShop");


// Get all barbers
exports.getAllBarbers = async (req, res) => {
  try {
    const barbers = await BarberShopModel.find({ isActive: true })
      .populate("barberId", "name phone profilePhoto")
      .sort({ "ratings.average": -1 })

    res.status(200).json({
      success: true,
      data: barbers,
    })
  } catch (error) {
    console.error("Error fetching barbers:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch barbers",
      error: error.message,
    })
  }
}

// Get barber by ID
exports.getBarberById = async (req, res) => {
  try {
    const barber = await BarberShopModel.findById(req.params.id)
      .populate("barberId", "name phone profilePhoto email")
      .populate("reviews.userId", "name profilePhoto")

    if (!barber) {
      return res.status(404).json({
        success: false,
        message: "Barber not found",
      })
    }

    res.status(200).json({
      success: true,
      data: barber,
    })
  } catch (error) {
    console.error("Error fetching barber:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch barber",
      error: error.message,
    })
  }
}

// Get nearby barbers
exports.getNearbyBarbers = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5 } = req.query

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      })
    }

    const barbers = await Barber.find({
      isActive: true,
      "location.coordinates": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number.parseFloat(longitude), Number.parseFloat(latitude)],
          },
          $maxDistance: radius * 1000, // Convert km to meters
        },
      },
    })
      .populate("barberId", "name phone profilePhoto")
      .limit(10)

    res.status(200).json({
      success: true,
      data: barbers,
    })
  } catch (error) {
    console.error("Error fetching nearby barbers:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch nearby barbers",
      error: error.message,
    })
  }
}




// Register barber

// Register a new barber shop
// exports.registerBarberShop = async (req, res) => {
//   try {
//     const {
//       shopName,
//       description,
//       location,
//       services,
//       workingHours,
//       staff,
//     } = req.body;

//     // Validate required fields
//     if (!shopName || !location || !location.address || !location.city) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields",
//       });
//     }

   
   

 
//       return res.status(400).json({
//         success: false,
//         message: "You already have a registered shop",
//       });
    

//     // Create new barber shop
//     const barberShop = new BarberShopModel({
//       barberId: req.user.id,
//       shopName,
//       description,
//       location,
//       services: services || [],
//       workingHours: workingHours || {},
//       staff: staff || [],
//     });

//     await barberShop.save();

//     return res.status(201).json({
//       success: true,
//       message: "Shop registered successfully",
//       shop: barberShop,
//     });
//   } catch (error) {
//     console.error("Error registering barber shop:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to register shop",
//       error: error.message,
//     });
//   }
// };


exports.registerBarberShop = async (req, res) => {
  try {
    const {
      shopName,
      description,
      location,
      services,
      workingHours,
      staff,
    } = req.body;

    // Validate required fields
    if (!shopName || !location || !location.address || !location.city) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

   

    // Create new barber shop document
    const barberShop = new BarberShopModel({
      barberId: req.user.id,
      shopName,
      description,
      location,
      services: services || [],
      workingHours: workingHours || {},
      staff: staff || [],
      
    });

    // Save shop to database
    await barberShop.save();

    return res.status(201).json({
      success: true,
      message: "Shop registered successfully",
      shop: barberShop,
    });
  } catch (error) {
    console.error("Error registering barber shop:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to register shop",
      error: error.message,
    });
  }
};


// Get barber shop by barber ID
exports.getBarberShopByUserId = async (req, res) => {
  try {
    const { id } = req.params;

    const shop = await BarberShopModel.findOne({ barberId: id })
      .populate("reviews.userId", "name")
      .lean();

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    return res.json({
      success: true,
      shop,
    });
  } catch (error) {
    console.error("Error fetching barber shop:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch shop",
      error: error.message,
    });
  }
};

// Get all barber shops (for customers)
exports.getAllBarberShops = async (req, res) => {
  try {
    const shops = await BarberShopModel.find({ isActive: true }).lean();

    return res.json({
      success: true,
      shops,
    });
  } catch (error) {
    console.error("Error fetching shops:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch shops",
      error: error.message,
    });
  }
};

// Get shops by barber ID (multiple shops)
exports.getShopsByBarberId = async (req, res) => {
  try {
    const { barberId } = req.query;

    if (!barberId) {
      return res.status(400).json({
        success: false,
        message: "Barber ID is required",
      });
    }

    const shops = await BarberShopModel.find({ barberId }).lean();

    return res.json({
      success: true,
      shops,
    });
  } catch (error) {
    console.error("Error fetching shops:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch shops",
      error: error.message,
    });
  }
};

// Update barber shop
exports.updateBarberShop = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const shop = await BarberShopModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    return res.json({
      success: true,
      message: "Shop updated successfully",
      shop,
    });
  } catch (error) {
    console.error("Error updating shop:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update shop",
      error: error.message,
    });
  }
};

// Delete barber shop
exports.deleteBarberShop = async (req, res) => {
  try {
    const { id } = req.params;

    const shop = await BarberShopModel.findByIdAndDelete(id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    return res.json({
      success: true,
      message: "Shop deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting shop:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete shop",
      error: error.message,
    });
  }
};









// // Add service
// exports.addService = async (req, res) => {
//   try {
//     const { serviceName, price, duration, category, description } = req.body

//     const barber = await Barber.findById(req.params.id)

//     if (!barber) {
//       return res.status(404).json({
//         success: false,
//         message: "Barber not found",
//       })
//     }

//     barber.services.push({
//       name: serviceName,
//       price,
//       duration,
//       category,
//     })

//     await barber.save()

//     res.status(201).json({
//       success: true,
//       message: "Service added successfully",
//       data: barber,
//     })
//   } catch (error) {
//     console.error("Error adding service:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to add service",
//       error: error.message,
//     })
//   }
// }

// // Get availability
// exports.getAvailability = async (req, res) => {
//   try {
//     const barber = await Barber.findById(req.params.id).select("availability")

//     if (!barber) {
//       return res.status(404).json({
//         success: false,
//         message: "Barber not found",
//       })
//     }

//     res.status(200).json({
//       success: true,
//       data: barber.availability,
//     })
//   } catch (error) {
//     console.error("Error fetching availability:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch availability",
//       error: error.message,
//     })
//   }
// }

// // Update availability
// exports.updateAvailability = async (req, res) => {
//   try {
//     const { date, timeSlots } = req.body

//     const barber = await Barber.findById(req.params.id)

//     if (!barber) {
//       return res.status(404).json({
//         success: false,
//         message: "Barber not found",
//       })
//     }

//     // Update or add availability for date
//     const existingIndex = barber.availability.findIndex(
//       (a) => new Date(a.date).toDateString() === new Date(date).toDateString(),
//     )

//     if (existingIndex > -1) {
//       barber.availability[existingIndex].timeSlots = timeSlots
//     } else {
//       barber.availability.push({ date, timeSlots })
//     }

//     await barber.save()

//     res.status(200).json({
//       success: true,
//       message: "Availability updated",
//       data: barber,
//     })
//   } catch (error) {
//     console.error("Error updating availability:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to update availability",
//       error: error.message,
//     })
//   }
// }

// // Get earnings
// exports.getEarnings = async (req, res) => {
//   try {
//     const barber = await Barber.findById(req.params.id).select("earnings")

//     if (!barber) {
//       return res.status(404).json({
//         success: false,
//         message: "Barber not found",
//       })
//     }

//     res.status(200).json({
//       success: true,
//       data: barber.earnings,
//     })
//   } catch (error) {
//     console.error("Error fetching earnings:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch earnings",
//       error: error.message,
//     })
//   }
// }

// // Add review
// exports.addReview = async (req, res) => {
//   try {
//     const { rating, comment } = req.body

//     const barber = await Barber.findById(req.params.id)

//     if (!barber) {
//       return res.status(404).json({
//         success: false,
//         message: "Barber not found",
//       })
//     }

//     barber.reviews.push({
//       userId: req.user.id,
//       rating,
//       comment,
//     })

//     barber.calculateAverageRating()
//     await barber.save()

//     res.status(201).json({
//       success: true,
//       message: "Review added successfully",
//       data: barber,
//     })
//   } catch (error) {
//     console.error("Error adding review:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to add review",
//       error: error.message,
//     })
//   }
// }
