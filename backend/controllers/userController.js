const User = require("../models/User")
const Booking = require("../models/Booking")

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("Error fetching profile:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    })
  }
}

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, location, profilePhoto } = req.body

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, location, profilePhoto },
      { new: true, runValidators: true },
    )

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    })
  }
}

// Get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("barberId", "shopName")
      .sort({ bookingDate: -1 })

    res.status(200).json({
      success: true,
      data: bookings,
    })
  } catch (error) {
    console.error("Error fetching bookings:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    })
  }
}

// Get wallet balance
exports.getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("walletBalance")

    res.status(200).json({
      success: true,
      data: {
        walletBalance: user.walletBalance,
      },
    })
  } catch (error) {
    console.error("Error fetching wallet:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch wallet",
      error: error.message,
    })
  }
}

// Add money to wallet
exports.addToWallet = async (req, res) => {
  try {
    const { amount } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      })
    }

    const user = await User.findByIdAndUpdate(req.user.id, { $inc: { walletBalance: amount } }, { new: true })

    res.status(200).json({
      success: true,
      message: "Amount added to wallet",
      data: {
        walletBalance: user.walletBalance,
      },
    })
  } catch (error) {
    console.error("Error adding to wallet:", error)
    res.status(500).json({
      success: false,
      message: "Failed to add to wallet",
      error: error.message,
    })
  }
}

// Get loyalty points
exports.getLoyaltyPoints = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("loyaltyPoints")

    res.status(200).json({
      success: true,
      data: {
        loyaltyPoints: user.loyaltyPoints,
      },
    })
  } catch (error) {
    console.error("Error fetching loyalty points:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch loyalty points",
      error: error.message,
    })
  }
}

// Deactivate account
exports.deactivateAccount = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { isActive: false })

    res.status(200).json({
      success: true,
      message: "Account deactivated successfully",
    })
  } catch (error) {
    console.error("Error deactivating account:", error)
    res.status(500).json({
      success: false,
      message: "Failed to deactivate account",
      error: error.message,
    })
  }
}
