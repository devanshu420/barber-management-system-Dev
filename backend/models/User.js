const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 50 },

    email: {
      type: String,
      required: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },

    phone: {
      type: String,
      default: null,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },

    password: {
      type: String,
      select: false,
      default: null,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["customer", "barber"],
      default: "customer",
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    googleId: {
      type: String,
      default: null,
    },

    profilePhoto: { type: String, default: null },
    profilePhotoId: { type: String, default: null },

    isVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },

    resetOtp: String,
    resetOtpExpire: Date,

    isActive: { type: Boolean, default: true },
    lastLogin: Date,

    refreshToken: { type: String, select: false },

    walletBalance: { type: Number, default: 0, min: 0 },
    loyaltyPoints: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);


// 🔥 UNIQUE INDEXES (IMPORTANT)

// email unique
userSchema.index(
  { email: 1 },
  {
    unique: true,
    name: "unique_email_idx",
  }
);

// phone unique ONLY when present
userSchema.index(
  { phone: 1 },
  {
    unique: true,
    partialFilterExpression: {
      phone: { $type: "string" },
    },
    name: "unique_phone_if_present_idx",
  }
);

// googleId unique ONLY when present
userSchema.index(
  { googleId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      googleId: { $type: "string" },
    },
    name: "unique_googleId_if_present_idx",
  }
);


// 🔐 Hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// 🔑 Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// 🧼 Clean response
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.resetOtp;
  delete obj.resetOtpExpire;
  return obj;
};

module.exports = mongoose.model("User", userSchema);









// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true, maxlength: 50 },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       match: [
//         /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
//         "Please enter a valid email",
//       ],
//     },

//     phone: {
//       type: String,
//       required: function () {
//         return this.authProvider === "local";
//       },
//       unique: false, // unique index alag se niche banayenge
//       match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
//       default: null,
//     },

//     password: {
//       type: String,
//       required: function () {
//         return this.authProvider === "local";
//       },
//       minlength: 6,
//       select: false,
//       default: null,
//     },

//     role: {
//       type: String,
//       enum: ["customer", "barber"],
//       default: "customer",
//     },

//     // NEW: auth provider (local / google)
//     authProvider: {
//       type: String,
//       enum: ["local", "google"],
//       default: "local",
//     },

//     // NEW: google id (sub from Google ID token)
//     googleId: {
//       type: String,
//       default: null,
//     },

//     profilePhoto: { type: String, default: null },

//     profilePhotoId: {
//       type: String, // ImageKit image ID (for optional deletion)
//       default: null,
//     },

//     isVerified: { type: Boolean, default: false },

//     resetOtp: String,
//     resetOtpExpire: Date,

//     isEmailVerified: { type: Boolean, default: false },
//     isPhoneVerified: { type: Boolean, default: false },

//     isActive: { type: Boolean, default: true },

//     lastLogin: Date,

//     refreshToken: { type: String, select: false },

//     walletBalance: { type: Number, default: 0, min: 0 },

//     loyaltyPoints: { type: Number, default: 0, min: 0 },
//   },
//   { timestamps: true },
// );

// // Indexes
// userSchema.index(
//   { email: 1 },
//   {
//     unique: true,
//     name: "unique_email_idx",
//   },
// );

// // phone unique only when string present
// userSchema.index(
//   { phone: 1 },
//   {
//     unique: true,
//     partialFilterExpression: { phone: { $type: "string" } },
//     name: "unique_phone_if_present_idx",
//   },
// );

// // googleId unique only when present
// userSchema.index(
//   { googleId: 1 },
//   {
//     unique: true,
//     partialFilterExpression: { googleId: { $type: "string" } },
//     name: "unique_googleId_if_present_idx",
//   },
// );

// // Hash password before saving
// userSchema.pre("save", async function () {
//   if (!this.isModified("password") || !this.password) return;
//   const salt = await bcrypt.genSalt(12);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// // Compare password
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   if (!this.password) return false;
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// // Remove sensitive info
// userSchema.methods.toJSON = function () {
//   const obj = this.toObject();
//   delete obj.password;
//   delete obj.refreshToken;
//   delete obj.resetOtp;
//   delete obj.resetOtpExpire;
//   return obj;
// };

// const User = mongoose.model("User", userSchema);
// module.exports = User;











// // const mongoose = require("mongoose");
// // const bcrypt = require("bcryptjs");

// // const userSchema = new mongoose.Schema(
// //   {
// //     name: { type: String, required: true, trim: true, maxlength: 50 },
// //     email: {
// //       type: String,
// //       required: true,
// //       unique: true,
// //       lowercase: true,
// //       match: [
// //         /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
// //         "Please enter a valid email",
// //       ],
// //     },
// //     phone: {
// //       type: String,
// //       required: true,
// //       unique: true,
// //       match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
// //     },
// //     password: { type: String, required: true, minlength: 6, select: false },
// //     role: { type: String, enum: ["customer", "barber"], default: "customer" },
// //     profilePhoto: { type: String, default: null },
// //     profilePhotoId: {
// //       type: String, // ImageKit image ID (for optional deletion)
// //       default: null,
// //     },
// //     isVerified: { type: Boolean, default: false },
// //     resetOtp: String,
// //     resetOtpExpire: Date,
// //     isEmailVerified: { type: Boolean, default: false },
// //     isPhoneVerified: { type: Boolean, default: false },
// //     isActive: { type: Boolean, default: true },
// //     lastLogin: Date,
// //     refreshToken: { type: String, select: false }, 
// //     walletBalance: { type: Number, default: 0, min: 0 },
// //     loyaltyPoints: { type: Number, default: 0, min: 0 },
// //   },
// //   { timestamps: true },
// // );

// // // Hash password before saving
// // userSchema.pre("save", async function () {
// //   if (!this.isModified("password")) return;
// //   const salt = await bcrypt.genSalt(12);
// //   this.password = await bcrypt.hash(this.password, salt);
// // });

// // // Compare password
// // userSchema.methods.comparePassword = async function (candidatePassword) {
// //   return await bcrypt.compare(candidatePassword, this.password);
// // };

// // // Remove sensitive info
// // userSchema.methods.toJSON = function () {
// //   const obj = this.toObject();
// //   delete obj.password;
// //   delete obj.refreshToken;
// //   return obj;
// // };

// // const User = mongoose.model("User", userSchema);
// // module.exports = User;
