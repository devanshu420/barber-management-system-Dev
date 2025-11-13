const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// ---- CREATE SERVER FOR SOCKET.IO ----
const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
  },
});

// ---- MAKE io GLOBAL ----
global.io = io;

// ---- SOCKET.IO EVENTS ----
io.on("connection", (socket) => {
  console.log("✔ Barber connected:", socket.id);

  // Barber joins its own room
  socket.on("joinBarberRoom", (barberId) => {
    socket.join(barberId);
    console.log(`Barber joined room: ${barberId}`);
  });

  // USER joins their own room
socket.on("joinUserRoom", (userId) => {
  socket.join(userId);
  console.log(`User joined room: ${userId}`);
});


  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// ------------------- REST OF YOUR SERVER -------------------

app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.error(err));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ROUTES
app.use('/api/barbers', require('./routes/barber-shop-registration'));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// START SERVER
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));


// const express = require("express")
// const mongoose = require("mongoose")
// const cors = require("cors")
// const helmet = require("helmet")
// const rateLimit = require("express-rate-limit")
// const dotenv = require("dotenv")
// const path = require("path")

// // Import routes
// const authRoutes = require("./routes/authRoutes")
// const userRoutes = require("./routes/userRoutes")
// const barberRoutes = require("./routes/barberRoutes")
// const bookingRoutes = require("./routes/bookingRoutes")
// const paymentRoutes = require("./routes/paymentRoutes")
// const adminRoutes = require("./routes/adminRoutes")
// const barberShopRoutes = require('./routes/barber-shop-registration');


// // Import middlewares
// const errorHandler = require("./middlewares/errorHandler")
// const { rateLimiter } = require("./middlewares/rateLimiter")

// dotenv.config()

// const app = express()

// // Security middlewares
// app.use(helmet())
// // app.use(
// //   cors({
// //     origin: process.env.FRONTEND_URL || "http://localhost:3000",
// //     credentials: true,
// //   }),
// // )
// app.use(cors({
//   origin: ['http://localhost:3000', 'http://localhost:3001'],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));



// // Rate limiting
// app.use(rateLimiter)

// // Body parsing middleware
// app.use(express.json({ limit: "10mb" }))
// app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// // Static files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// // Database connection
// mongoose
//   .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/barber-booking", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB connected successfully"))
//   .catch((err) => console.error("MongoDB connection error:", err))




// // Routes
// app.use('/api/barbers', barberShopRoutes);

// // Routes
// app.use("/api/auth", authRoutes)
// app.use("/api/users", userRoutes)
// // app.use("/api/barbers", barberRoutes)
// app.use("/api/bookings", bookingRoutes)
// app.use("/api/payments", paymentRoutes)
// app.use("/api/admin", adminRoutes)

// // Health check
// app.get("/api/health", (req, res) => {
//   res.status(200).json({
//     status: "OK",
//     message: "Barber Booking API is running",
//     timestamp: new Date().toISOString(),
//   })
// })

// // Error handling middleware (must be last)
// app.use(errorHandler)

// const PORT = process.env.PORT || 5000
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })

// module.exports = app
