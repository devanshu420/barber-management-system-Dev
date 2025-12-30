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

