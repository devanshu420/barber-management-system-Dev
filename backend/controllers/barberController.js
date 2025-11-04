const Barber = require("../models/Barber")
const Service = require("../models/Service")
const User = require("../models/User")

// Get all barbers
exports.getAllBarbers = async (req, res) => {
  try {
    const barbers = await Barber.find({ isActive: true })
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
    const barber = await Barber.findById(req.params.id)
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
exports.registerBarber = async (req, res) => {
  try {
    const { shopName, description, location, services } = req.body

    // Check if barber already registered
    const existingBarber = await Barber.findOne({ barberId: req.user.id })

    if (existingBarber) {
      return res.status(400).json({
        success: false,
        message: "Barber profile already exists",
      })
    }

    // Create barber profile
    const barber = new Barber({
      barberId: req.user.id,
      shopName,
      description,
      location,
      services: services || [],
    })

    await barber.save()

    res.status(201).json({
      success: true,
      message: "Barber profile created successfully",
      data: barber,
    })
  } catch (error) {
    console.error("Error registering barber:", error)
    res.status(500).json({
      success: false,
      message: "Failed to register barber",
      error: error.message,
    })
  }
}

// Update barber profile
exports.updateBarber = async (req, res) => {
  try {
    const { shopName, description, location, workingHours, staff } = req.body

    const barber = await Barber.findByIdAndUpdate(
      req.params.id,
      { shopName, description, location, workingHours, staff },
      { new: true, runValidators: true },
    )

    res.status(200).json({
      success: true,
      message: "Barber profile updated successfully",
      data: barber,
    })
  } catch (error) {
    console.error("Error updating barber:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update barber",
      error: error.message,
    })
  }
}

// Add service
exports.addService = async (req, res) => {
  try {
    const { serviceName, price, duration, category, description } = req.body

    const barber = await Barber.findById(req.params.id)

    if (!barber) {
      return res.status(404).json({
        success: false,
        message: "Barber not found",
      })
    }

    barber.services.push({
      name: serviceName,
      price,
      duration,
      category,
    })

    await barber.save()

    res.status(201).json({
      success: true,
      message: "Service added successfully",
      data: barber,
    })
  } catch (error) {
    console.error("Error adding service:", error)
    res.status(500).json({
      success: false,
      message: "Failed to add service",
      error: error.message,
    })
  }
}

// Get availability
exports.getAvailability = async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id).select("availability")

    if (!barber) {
      return res.status(404).json({
        success: false,
        message: "Barber not found",
      })
    }

    res.status(200).json({
      success: true,
      data: barber.availability,
    })
  } catch (error) {
    console.error("Error fetching availability:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch availability",
      error: error.message,
    })
  }
}

// Update availability
exports.updateAvailability = async (req, res) => {
  try {
    const { date, timeSlots } = req.body

    const barber = await Barber.findById(req.params.id)

    if (!barber) {
      return res.status(404).json({
        success: false,
        message: "Barber not found",
      })
    }

    // Update or add availability for date
    const existingIndex = barber.availability.findIndex(
      (a) => new Date(a.date).toDateString() === new Date(date).toDateString(),
    )

    if (existingIndex > -1) {
      barber.availability[existingIndex].timeSlots = timeSlots
    } else {
      barber.availability.push({ date, timeSlots })
    }

    await barber.save()

    res.status(200).json({
      success: true,
      message: "Availability updated",
      data: barber,
    })
  } catch (error) {
    console.error("Error updating availability:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update availability",
      error: error.message,
    })
  }
}

// Get earnings
exports.getEarnings = async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id).select("earnings")

    if (!barber) {
      return res.status(404).json({
        success: false,
        message: "Barber not found",
      })
    }

    res.status(200).json({
      success: true,
      data: barber.earnings,
    })
  } catch (error) {
    console.error("Error fetching earnings:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch earnings",
      error: error.message,
    })
  }
}

// Add review
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body

    const barber = await Barber.findById(req.params.id)

    if (!barber) {
      return res.status(404).json({
        success: false,
        message: "Barber not found",
      })
    }

    barber.reviews.push({
      userId: req.user.id,
      rating,
      comment,
    })

    barber.calculateAverageRating()
    await barber.save()

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: barber,
    })
  } catch (error) {
    console.error("Error adding review:", error)
    res.status(500).json({
      success: false,
      message: "Failed to add review",
      error: error.message,
    })
  }
}
