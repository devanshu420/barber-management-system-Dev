const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Verify JWT token
exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token is required",
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Find user
    const user = await User.findById(decoded.userId)

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid token or user not found",
      })
    }

    // Add user to request
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    }

    next()
  } catch (error) {
    console.error("Authentication error:", error)
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message,
    })
  }
}

// Role-based access control
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      })
    }

    next()
  }
}

// Admin access control
exports.requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    })
  }
  next()
}

// Barber access control
exports.requireBarber = (req, res, next) => {
  if (!req.user || !["barber", "admin"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Barber access required",
    })
  }
  next()
}

// User access control (authenticated users)
exports.requireUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "User authentication required",
    })
  }
  next()
}
