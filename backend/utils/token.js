const jwt = require("jsonwebtoken")

// Generate access token
exports.generateToken = (userId, role) => {
  return jwt.sign(
    {
      userId,
      role,
      type: "access",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      issuer: "barber-booking-api",
      audience: "barber-booking-app",
    },
  )
}

// Generate refresh token
exports.generateRefreshToken = (userId) => {
  return jwt.sign(
    {
      userId,
      type: "refresh",
    },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
      issuer: "barber-booking-api",
      audience: "barber-booking-app",
    },
  )
}

// Verify access token
exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, {
    issuer: "barber-booking-api",
    audience: "barber-booking-app",
  })
}

// Verify refresh token
exports.verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    issuer: "barber-booking-api",
    audience: "barber-booking-app",
  })
}

// Generate password reset token
exports.generateResetToken = (userId) => {
  return jwt.sign(
    {
      userId,
      type: "reset",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
      issuer: "barber-booking-api",
      audience: "barber-booking-app",
    },
  )
}
