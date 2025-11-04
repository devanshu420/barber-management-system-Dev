const User = require("../models/User")
const Barber = require("../models/Barber")
const Booking = require("../models/Booking")
const Payment = require("../models/Payment")

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" })
    const totalBarbers = await Barber.countDocuments()
    const totalBookings = await Booking.countDocuments()
    const totalRevenue = await Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalBarbers,
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
      error: error.message,
    })
  }
}

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: users,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    })
  }
}

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { isActive } = req.body

    const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true })

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    })
  } catch (error) {
    console.error("Error updating user:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    })
  }
}

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    })
  }
}

// Get all barbers
exports.getAllBarbers = async (req, res) => {
  try {
    const barbers = await Barber.find().populate("barberId", "name email phone").sort({ createdAt: -1 })

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

// Verify barber
exports.verifyBarber = async (req, res) => {
  try {
    const barber = await Barber.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true })

    res.status(200).json({
      success: true,
      message: "Barber verified successfully",
      data: barber,
    })
  } catch (error) {
    console.error("Error verifying barber:", error)
    res.status(500).json({
      success: false,
      message: "Failed to verify barber",
      error: error.message,
    })
  }
}

// Delete barber
exports.deleteBarber = async (req, res) => {
  try {
    await Barber.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: "Barber deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting barber:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete barber",
      error: error.message,
    })
  }
}

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")
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

// Update booking
exports.updateBooking = async (req, res) => {
  try {
    const { status } = req.body

    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true })

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: booking,
    })
  } catch (error) {
    console.error("Error updating booking:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update booking",
      error: error.message,
    })
  }
}

// Get revenue report
exports.getRevenueReport = async (req, res) => {
  try {
    const report = await Payment.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 30 },
    ])

    res.status(200).json({
      success: true,
      data: report,
    })
  } catch (error) {
    console.error("Error fetching revenue report:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch revenue report",
      error: error.message,
    })
  }
}

// Get booking report
exports.getBookingReport = async (req, res) => {
  try {
    const report = await Booking.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])

    res.status(200).json({
      success: true,
      data: report,
    })
  } catch (error) {
    console.error("Error fetching booking report:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking report",
      error: error.message,
    })
  }
}

// Get settings
exports.getSettings = async (req, res) => {
  try {
    const settings = {
      platformFee: 10,
      cancellationWindow: 2,
      minBookingTime: 15,
      maxBookingDays: 30,
    }

    res.status(200).json({
      success: true,
      data: settings,
    })
  } catch (error) {
    console.error("Error fetching settings:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
      error: error.message,
    })
  }
}

// Update settings
exports.updateSettings = async (req, res) => {
  try {
    const { platformFee, cancellationWindow, minBookingTime, maxBookingDays } = req.body

    const settings = {
      platformFee,
      cancellationWindow,
      minBookingTime,
      maxBookingDays,
    }

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    })
  } catch (error) {
    console.error("Error updating settings:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update settings",
      error: error.message,
    })
  }
}
