const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 50 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ["customer", "barber"], default: "customer" },
    profilePhoto: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    otp: String,
    otpExpires: Date,
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
    refreshToken: { type: String, select: false },
    walletBalance: { type: Number, default: 0, min: 0 },
    loyaltyPoints: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive info
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};

const User = mongoose.model("User", userSchema);
module.exports = User;

// const mongoose = require("mongoose")
// const bcrypt = require("bcryptjs")

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Name is required"],
//       trim: true,
//       maxlength: [50, "Name cannot exceed 50 characters"],
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       lowercase: true,
//       match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
//     },
//     phone: {
//       type: String,
//       required: [true, "Phone number is required"],
//       unique: true,
//       match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       minlength: [6, "Password must be at least 6 characters"],
//       select: false,
//     },

//     isVerified: {
//       type: Boolean,
//       default: false
//     },

//     otp: {
//       type: String
//     },

//     otpExpires: {
//       type: Date
//     },

//     profilePhoto: {
//       type: String,
//       default: null,
//     },
//     role: {
//       type: String,
//       enum: ["customer", "barber"],
//       default: "customer",
//       required: true,
//     }

//     ,
//     location: {
//       address: String,
//       city: String,
//       state: String,
//       zipCode: String,
//       coordinates: {
//         latitude: Number,
//         longitude: Number,
//       },
//     },
//     walletBalance: {
//       type: Number,
//       default: 0,
//       min: [0, "Wallet balance cannot be negative"],
//     },
//     loyaltyPoints: {
//       type: Number,
//       default: 0,
//       min: [0, "Loyalty points cannot be negative"],
//     },
//     isEmailVerified: {
//       type: Boolean,
//       default: false,
//     },
//     isPhoneVerified: {
//       type: Boolean,
//       default: false,
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//     lastLogin: {
//       type: Date,
//       default: null,
//     },
//     refreshToken: {
//       type: String,
//       select: false,
//     },
//   },
//   {
//     timestamps: true,
//   },
// )

// // Hash password before saving
// // Hash password before saving
// userSchema.pre("save", async function () {
//   if (!this.isModified("password")) return

//   try {
//     const salt = await bcrypt.genSalt(12)
//     this.password = await bcrypt.hash(this.password, salt)
//   } catch (error) {
//     throw error  // Throw error instead of calling next()
//   }
// })

// // Compare password method
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password)
// }

// // Remove sensitive data when converting to JSON
// userSchema.methods.toJSON = function () {
//   const userObject = this.toObject()
//   delete userObject.password
//   delete userObject.refreshToken
//   return userObject
// }

// const userModel = mongoose.model("User", userSchema)
// module.exports = userModel
