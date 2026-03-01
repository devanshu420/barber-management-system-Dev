// models/BarberShop.js
const mongoose = require("mongoose");

const barberShopSchema = new mongoose.Schema(
  {
    // ============================================
    // OWNER & SHOP INFORMATION
    // ============================================
    barberOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    shopName: {
      type: String,
      required: [true, "Shop name is required"],
      trim: true,
      maxlength: [100, "Shop name cannot exceed 100 characters"],
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    // ============================================
    // LOCATION INFORMATION
    // ============================================
    location: {
      address: { type: String, required: true, trim: true, maxlength: 200 },
      city: { type: String, required: true, trim: true, index: true },
      state: { type: String, required: true, trim: true },
      zipCode: { type: String, trim: true },
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true,
        },
      },
    },

    // ============================================
    // IMAGES & CERTIFICATES
    // ============================================
    // images: [
    //   {
    //     _id: mongoose.Schema.Types.ObjectId,
    //     filename: { type: String, required: true },
    //     path: { type: String, required: true },
    //     size: { type: Number, required: true },
    //     mimetype: { type: String, default: "image/jpeg" },
    //     uploadedAt: { type: Date, default: Date.now },
    //   },
    // ],
    // certificates: [String],

    // ============================================
    // SERVICES
    // ============================================
    services: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        name: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        duration: { type: Number, required: true, min: 5, max: 480 },
        category: {
          type: String,
          enum: ["haircut", "beard", "styling", "treatment", "other", "wash"],
          default: "haircut",
        },
        description: String,
        isActive: { type: Boolean, default: true },
      },
    ],

    // ============================================
    // WORKING HOURS
    // ============================================
    workingHours: {
      monday: {
        start: String,
        end: String,
        isOpen: { type: Boolean, default: true },
      },
      tuesday: {
        start: String,
        end: String,
        isOpen: { type: Boolean, default: true },
      },
      wednesday: {
        start: String,
        end: String,
        isOpen: { type: Boolean, default: true },
      },
      thursday: {
        start: String,
        end: String,
        isOpen: { type: Boolean, default: true },
      },
      friday: {
        start: String,
        end: String,
        isOpen: { type: Boolean, default: true },
      },
      saturday: {
        start: String,
        end: String,
        isOpen: { type: Boolean, default: true },
      },
      sunday: {
        start: String,
        end: String,
        isOpen: { type: Boolean, default: false },
      },
    },

    // ============================================
    // STAFF MEMBERS
    // ============================================
    staff: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        name: { type: String, trim: true, required: true },
        role: {
          type: String,
          trim: true,
          enum: ["barber", "assistant", "manager", "other"],
          default: "barber",
        },
        phone: { type: String, match: [/^[0-9]{10}$/, "Invalid phone number"] },
        specialization: [String],
        joinDate: { type: Date, default: Date.now },
        isActive: { type: Boolean, default: true },
      },
    ],

    // ============================================
    // AVAILABILITY & BOOKINGS
    // ============================================
    availability: [
      {
        date: { type: Date, required: true },
        timeSlots: [
          {
            startTime: String,
            endTime: String,
            isBooked: { type: Boolean, default: false },
            bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
          },
        ],
      },
    ],

    // ============================================
    // EARNINGS
    // ============================================
    earnings: {
      total: { type: Number, default: 0 },
      monthly: [
        {
          month: Number,
          year: Number,
          amount: Number,
        },
      ],
      pending: { type: Number, default: 0 },
    },

    // ============================================
    // RATINGS & REVIEWS
    // ============================================
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    reviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, maxlength: 500 },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // ============================================
    // STATUS
    // ============================================
    isVerified: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

// ============================================
// INDEXES
// ============================================
barberShopSchema.index({ shopName: "text", "location.city": "text" });
barberShopSchema.index({ "location.coordinates": "2dsphere" });
barberShopSchema.index({ barberOwner: 1 });
barberShopSchema.index({ isActive: 1 });
barberShopSchema.index({ "ratings.average": -1 });

// ============================================
// VIRTUAL FIELD
// ============================================
barberShopSchema.virtual("fullAddress").get(function () {
  return `${this.location.address}, ${this.location.city}, ${this.location.state} ${this.location.zipCode}`;
});

// ============================================
// INSTANCE METHODS
// ============================================
barberShopSchema.methods.getActiveServices = function () {
  return this.services.filter((service) => service.isActive);
};

barberShopSchema.methods.getActiveStaff = function () {
  return this.staff.filter((member) => member.isActive);
};

barberShopSchema.methods.addImage = function (imageData) {
  this.images.push({ ...imageData, uploadedAt: new Date() });
  return this.save();
};

barberShopSchema.methods.removeImage = function (imageId) {
  this.images = this.images.filter((img) => img._id.toString() !== imageId);
  return this.save();
};

barberShopSchema.methods.addService = function (serviceData) {
  this.services.push({ ...serviceData });
  return this.save();
};

barberShopSchema.methods.removeService = function (serviceId) {
  this.services = this.services.filter((s) => s._id.toString() !== serviceId);
  return this.save();
};

barberShopSchema.methods.addStaffMember = function (staffData) {
  this.staff.push({ ...staffData, joinDate: new Date() });
  return this.save();
};

barberShopSchema.methods.removeStaffMember = function (staffId) {
  this.staff = this.staff.filter((s) => s._id.toString() !== staffId);
  return this.save();
};

barberShopSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) {
    this.ratings.average = 0;
    this.ratings.count = 0;
    return;
  }
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  this.ratings.average = Math.round((sum / this.reviews.length) * 10) / 10;
  this.ratings.count = this.reviews.length;
};

// ============================================
// STATIC METHODS
// ============================================
barberShopSchema.statics.findByCity = function (city) {
  return this.find({
    "location.city": city,
    isActive: true,
    isVerified: true,
  }).sort({
    "ratings.average": -1,
  });
};

barberShopSchema.statics.findNearby = function (
  longitude,
  latitude,
  maxDistance = 5000,
) {
  return this.find({
    "location.coordinates": {
      $near: {
        $geometry: { type: "Point", coordinates: [longitude, latitude] },
        $maxDistance: maxDistance,
      },
    },
    isActive: true,
    isVerified: true,
  }).sort({ "ratings.average": -1 });
};

const BarberShop = mongoose.model("BarberShop", barberShopSchema);

module.exports = BarberShop;
