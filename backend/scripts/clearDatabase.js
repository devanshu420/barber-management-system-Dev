import mongoose from "mongoose"
import dotenv from "dotenv"
import User from "../models/User.js"
import Barber from "../models/Barber.js"
import Service from "../models/Service.js"
import Booking from "../models/Booking.js"
import BarbershopLocation from "../models/BarbershopLocation.js"
import Notification from "../models/Notification.js"

dotenv.config()

const clearDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("MongoDB connected")

    console.log("Clearing all collections...")
    await User.deleteMany({})
    await Barber.deleteMany({})
    await Service.deleteMany({})
    await Booking.deleteMany({})
    await BarbershopLocation.deleteMany({})
    await Notification.deleteMany({})

    console.log("✓ Database cleared successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Clear database error:", error)
    process.exit(1)
  }
}

clearDatabase()
