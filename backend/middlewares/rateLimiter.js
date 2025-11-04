const rateLimit = require("express-rate-limit")

// General rate limiter
exports.rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Auth rate limiter (stricter)
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later.",
  },
  skipSuccessfulRequests: true,
})

// Booking rate limiter
exports.bookingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // limit each IP to 3 booking requests per minute
  message: {
    success: false,
    message: "Too many booking attempts, please wait before trying again.",
  },
})

// Payment rate limiter
exports.paymentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 2, // limit each IP to 2 payment requests per minute
  message: {
    success: false,
    message: "Too many payment attempts, please wait before trying again.",
  },
})

// OTP rate limiter
exports.otpLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // limit each IP to 3 OTP requests per minute
  message: {
    success: false,
    message: "Too many OTP requests, please wait before requesting again.",
  },
})
