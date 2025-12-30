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