const Booking = require("../models/Booking")
const Barber = require("../models/BarberShop")
const Payment = require("../models/Payment")

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const { barberId, serviceId, serviceName, bookingDate, bookingTime, amount, paymentMethod } = req.body

    const booking = new Booking({
      userId: req.user.id,
      barberId,
      serviceId,
      serviceName,
      bookingDate,
      bookingTime,
      amount,
      finalAmount: amount,
      paymentMethod,
      status: "pending",
      paymentStatus: "pending",
    })

    await booking.save()

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    })
  } catch (error) {
    console.error("Error creating booking:", error)
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
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

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("userId", "name email phone")
      .populate("barberId", "shopName")

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      })
    }

    res.status(200).json({
      success: true,
      data: booking,
    })
  } catch (error) {
    console.error("Error fetching booking:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
      error: error.message,
    })
  }
}

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body

    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true })

    res.status(200).json({
      success: true,
      message: "Booking status updated",
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

// Reschedule booking
exports.rescheduleBooking = async (req, res) => {
  try {
    const { newDate, newTime, reason } = req.body

    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      })
    }

    booking.rescheduleHistory.push({
      oldDate: booking.bookingDate,
      oldTime: booking.bookingTime,
      newDate,
      newTime,
      reason,
    })

    booking.bookingDate = newDate
    booking.bookingTime = newTime

    await booking.save()

    res.status(200).json({
      success: true,
      message: "Booking rescheduled successfully",
      data: booking,
    })
  } catch (error) {
    console.error("Error rescheduling booking:", error)
    res.status(500).json({
      success: false,
      message: "Failed to reschedule booking",
      error: error.message,
    })
  }
}

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const { cancellationReason } = req.body

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled", cancellationReason },
      { new: true },
    )

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    })
  } catch (error) {
    console.error("Error cancelling booking:", error)
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
      error: error.message,
    })
  }
}

// Add review
exports.addReview = async (req, res) => {
  try {
    const { rating, review } = req.body

    const booking = await Booking.findByIdAndUpdate(req.params.id, { rating, review }, { new: true })

    res.status(200).json({
      success: true,
      message: "Review added successfully",
      data: booking,
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

// Get available slots
exports.getAvailableSlots = async (req, res) => {
  try {
    const { barberId, date } = req.body

    const barber = await Barber.findById(barberId)

    if (!barber) {
      return res.status(404).json({
        success: false,
        message: "Barber not found",
      })
    }

    const availability = barber.availability.find(
      (a) => new Date(a.date).toDateString() === new Date(date).toDateString(),
    )

    const slots = availability ? availability.timeSlots : []

    res.status(200).json({
      success: true,
      data: slots,
    })
  } catch (error) {
    console.error("Error fetching slots:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch available slots",
      error: error.message,
    })
  }
}

// Get all bookings (admin)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email phone")
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
