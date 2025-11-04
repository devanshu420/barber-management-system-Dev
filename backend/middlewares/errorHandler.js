// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error("[ERROR]", err)

  const status = err.status || err.statusCode || 500
  const message = err.message || "Internal Server Error"

  res.status(status).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? err : {},
  })
}

module.exports = errorHandler
