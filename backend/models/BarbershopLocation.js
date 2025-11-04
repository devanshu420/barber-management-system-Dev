import mongoose from "mongoose"

const barbershopLocationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide barbershop name"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Please provide address"],
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    waitlist: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.5,
    },
    openHours: {
      open: {
        type: String,
        default: "09:00",
      },
      close: {
        type: String,
        default: "21:00",
      },
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    image: String,
    totalReviews: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
)

barbershopLocationSchema.index({ latitude: 1, longitude: 1 })

export default mongoose.model("BarbershopLocation", barbershopLocationSchema)
