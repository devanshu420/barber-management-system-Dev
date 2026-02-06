const userModel = require("../models/User");
const crypto = require("crypto");

const { generateToken, generateRefreshToken, verifyRefreshToken } = require("../utils/token");

// Registration
exports.register = async (req, res) => {
  try {
    let { name, email, phone, password, role = "customer" } = req.body;
    email = email.toLowerCase();

    const existingUser = await userModel.findOne({ $or: [{ email }, { phone }] });
    if (existingUser)
      return res.status(400).json({ success: false, message: "User already exists" });

    const user = await userModel.create({ name, email, phone, password, role });

    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;

    // Internal OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otp = otp;
      user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
      token,
      refreshToken,
      otp, // for testing
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Registration failed", error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();

    if (!email || !password)
      return res.status(400).json({ success: false, message: "Provide email and password" });

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const isValid = await user.comparePassword(password);
    if (!isValid) return res.status(401).json({ success: false, message: "Invalid credentials" });

    if (!user.isActive)
      return res.status(401).json({ success: false, message: "Account deactivated" });

    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({ success: true, message: "Login successful", user, token, refreshToken });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Login failed", error: error.message });
  }
};

// Refresh token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ success: false, message: "Refresh token required" });

    const decoded = verifyRefreshToken(refreshToken);
    const user = await userModel.findById(decoded.id).select("+refreshToken");

    if (!user || user.refreshToken !== refreshToken)
      return res.status(401).json({ success: false, message: "Invalid refresh token" });

    const newToken = generateToken(user._id, user.role);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.status(200).json({ success: true, message: "Token refreshed", token: newToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(401).json({ success: false, message: "Token refresh failed", error: error.message });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    const userId = req.user.id;
    await userModel.findByIdAndUpdate(userId, { refreshToken: null });
    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "Logout failed", error: error.message });
  }
};

// Send OTP internally
exports.sendOtp = async (req, res) => {
  try {
    const { email, phone, type } = req.body;
    const identifier = type === "email" ? email.toLowerCase() : phone;

    const user = await userModel.findOne({ [type]: identifier });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    res.json({ success: true, message: "OTP generated", otp });
  } catch (error) {
    console.error("sendOtp Error:", error);
    res.status(500).json({ success: false, message: "Failed to generate OTP" });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.otp !== otp || user.otpExpires < Date.now())
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("verifyOtp Error:", error);
    res.status(500).json({ success: false, message: "OTP verification failed" });
  }
};

// Forgot Password

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, message: "Email required" });

    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    // 🔢 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 🔒 Hash OTP
    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    user.resetOtp = hashedOtp;
    user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    // TODO: Nodemailer se email bhejna
    console.log(`RESET OTP for ${email}: ${otp}`);

    res.status(200).json({
      success: true,
      message: "OTP sent to registered email",
      otp, // ❗ testing only (remove in production)
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword)
      return res.status(400).json({
        success: false,
        message: "Email, OTP and new password required",
      });

    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user || !user.resetOtp)
      return res.status(400).json({ success: false, message: "Invalid request" });

    // ⏱️ Check expiry
    if (Date.now() > user.resetOtpExpiry) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // 🔒 Hash incoming OTP
    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    if (hashedOtp !== user.resetOtp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // 🔐 Update password
    user.password = newPassword;

    // 🔥 Invalidate OTP
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ success: false, message: "Password reset failed" });
  }
};




// const { generateToken, generateRefreshToken, verifyRefreshToken } = require("../utils/token");
// const { encrypt, decrypt } = require("../utils/encryption");
// const userModel = require("../models/User");

// // Register user
// exports.register = async (req, res) => {
//   try {
//     const { name, email, phone, password, role = "customer" } = req.body;

//     // Validation
//     if (!email || !phone) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide all required fields",
//       });
//     }

//     // Check if user already exists
//     const existingUser = await userModel.findOne({
//       $or: [{ email }, { phone }],
//     });

//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists with this email or phone",
//       });
//     }

//     // Save new user
//     const user = await userModel.create({
//       name,
//       email,
//       phone,
//       password,
//       role,
//     });

//     // Generate tokens
//     const token = generateToken(user._id, user.role);
//     const refreshToken = generateRefreshToken(user._id);

//     user.refreshToken = refreshToken;

//     // Generate OTP internally (no email)
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     user.otp = otp;
//     user.otpExpires = Date.now() + 10 * 60 * 1000;
//     await user.save();

//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         role: user.role,
//         isEmailVerified: user.isEmailVerified,
//         isPhoneVerified: user.isPhoneVerified,
//       },
//       token,
//       refreshToken,
//       otp, // for testing purpose
//     });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Registration failed",
//       error: error.message,
//     });
//   }
// };

// // Send OTP - works internally, no email
// exports.sendOtp = async (req, res) => {
//   try {
//     const { email, phone, type } = req.body; // type: 'email' or 'phone'
//     const identifier = type === "email" ? email : phone;

//     const user = await userModel.findOne({ [type]: identifier });
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     user.otp = otp;
//     user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 min expiry
//     await user.save();

//     res.json({
//       success: true,
//       message: "OTP generated successfully",
//       otp, // for testing, internal use
//     });
//   } catch (error) {
//     console.error("sendOtp Error:", error);
//     res.status(500).json({ success: false, message: "Failed to generate OTP" });
//   }
// };

// // Verify OTP API
// exports.verifyOtp = async (req, res) => {
//   try {
//     const { userId, otp } = req.body;
//     const user = await userModel.findById(userId);
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     if (user.otp !== otp || user.otpExpires < Date.now()) {
//       return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
//     }

//     user.isVerified = true;
//     user.otp = null;
//     user.otpExpires = null;
//     await user.save();

//     res.json({ success: true, message: "OTP verified successfully" });
//   } catch (error) {
//     console.error("verifyOtp Error:", error);
//     res.status(500).json({ success: false, message: "OTP verification failed" });
//   }
// };

// // Login user
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide email and password",
//       });
//     }

//     const user = await userModel.findOne({ email }).select("+password");

//     if (!user) {
//       return res.status(401).json({ success: false, message: "Invalid credentials" });
//     }

//     const isPasswordValid = await user.comparePassword(password);

//     if (!isPasswordValid) {
//       return res.status(401).json({ success: false, message: "Invalid credentials" });
//     }

//     if (!user.isActive) {
//       return res.status(401).json({
//         success: false,
//         message: "Account is deactivated. Please contact support.",
//       });
//     }

//     const token = generateToken(user._id, user.role);
//     const refreshToken = generateRefreshToken(user._id);

//     user.refreshToken = refreshToken;
//     user.lastLogin = new Date();
//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         role: user.role,
//         profilePhoto: user.profilePhoto,
//         walletBalance: user.walletBalance,
//         loyaltyPoints: user.loyaltyPoints,
//         isEmailVerified: user.isEmailVerified,
//         isPhoneVerified: user.isPhoneVerified,
//       },
//       token,
//       refreshToken,
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ success: false, message: "Login failed", error: error.message });
//   }
// };

// // Refresh token
// exports.refreshToken = async (req, res) => {
//   try {
//     const { refreshToken } = req.body;
//     if (!refreshToken) {
//       return res.status(401).json({ success: false, message: "Refresh token is required" });
//     }

//     const decoded = verifyRefreshToken(refreshToken);
//     const user = await userModel.findById(decoded.id).select("+refreshToken");

//     if (!user || user.refreshToken !== refreshToken) {
//       return res.status(401).json({ success: false, message: "Invalid refresh token" });
//     }

//     const newToken = generateToken(user._id, user.role);
//     const newRefreshToken = generateRefreshToken(user._id);

//     user.refreshToken = newRefreshToken;
//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "Token refreshed successfully",
//       data: { token: newToken, refreshToken: newRefreshToken },
//     });
//   } catch (error) {
//     console.error("Token refresh error:", error);
//     res.status(401).json({ success: false, message: "Token refresh failed", error: error.message });
//   }
// };

// // Logout
// exports.logout = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     await userModel.findByIdAndUpdate(userId, { refreshToken: null });
//     res.status(200).json({ success: true, message: "Logout successful" });
//   } catch (error) {
//     console.error("Logout error:", error);
//     res.status(500).json({ success: false, message: "Logout failed", error: error.message });
//   }
// };

// // Forgot password (internal OTP, no email)
// exports.forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await userModel.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     global.otpStore = global.otpStore || {};
//     global.otpStore[`reset_${email}`] = {
//       otp,
//       expires: Date.now() + 10 * 60 * 1000,
//       userId: user._id,
//     };

//     console.log(`Password reset OTP for ${email}: ${otp}`);

//     res.status(200).json({
//       success: true,
//       message: "Password reset OTP generated",
//       otp, // for testing
//     });
//   } catch (error) {
//     console.error("Forgot password error:", error);
//     res.status(500).json({ success: false, message: "Failed to generate OTP", error: error.message });
//   }
// };

// // Reset password
// exports.resetPassword = async (req, res) => {
//   try {
//     const { email, otp, newPassword } = req.body;
//     if (!email || !otp || !newPassword) {
//       return res.status(400).json({ success: false, message: "Provide email, OTP, and new password" });
//     }

//     global.otpStore = global.otpStore || {};
//     const storedOTP = global.otpStore[`reset_${email}`];

//     if (!storedOTP || storedOTP.otp !== otp || storedOTP.expires < Date.now()) {
//       return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
//     }

//     const user = await userModel.findById(storedOTP.userId);
//     user.password = newPassword;
//     await user.save();

//     delete global.otpStore[`reset_${email}`];

//     res.status(200).json({ success: true, message: "Password reset successful" });
//   } catch (error) {
//     console.error("Reset password error:", error);
//     res.status(500).json({ success: false, message: "Password reset failed", error: error.message });
//   }
// }; 
















// const { generateToken, generateRefreshToken, verifyRefreshToken } = require("../utils/token")
// const { encrypt, decrypt } = require("../utils/encryption")
// const userModel = require("../models/User")

// // Register user

// exports.register = async (req, res) => {
//   try {
//     const { name, email, phone, password, role = "customer" } = req.body

//     // Validation
//     if (!email || !phone) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide all required fields",
//       })
//     }

//     // Check if user already exists
//     const existingUser = await userModel.findOne({
//       $or: [{ email }, { phone }],
//     })

//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists with this email or phone",
//       })
//     }

//     // Save new user
//     const user = await userModel.create({
//       name,
//       email,
//       phone,
//       password,
//       role,
//     })

   

//     const token = generateToken(user._id, user.role)
//     const refreshToken = generateRefreshToken(user._id)

//     user.refreshToken = refreshToken
//     await user.save()

//      const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     user.otp = otp;
//     user.otpExpires = Date.now() + 10 * 60 * 1000;
//     await user.save();

//     await sendEmail(
//       email,
//       'Verify your Email - OTP Code',
//       `Your OTP code is: ${otp}. It expires in 10 minutes.`,
//       `<p>Your OTP code is: <b>${otp}</b>. It expires in 10 minutes.</p>`
//     );


//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         role: user.role,
//         isEmailVerified: user.isEmailVerified,
//         isPhoneVerified: user.isPhoneVerified,
//       },
//       token,
//       refreshToken,
//     })
//   } catch (error) {
//     console.error("Registration error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Registration failed",
//       error: error.message,
//     })
//   }
// }



// // Send OTP - Triggered during registration or password reset
// exports.sendOtp = async (req, res) => {
//   try {
//     const { email, phone, type } = req.body; // type: 'email' or 'phone'
//     const identifier = type === "email" ? email : phone;

//     const user = await userModel.findOne({ [type]: identifier });
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     user.otp = otp;
//     user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 min expiry
//     await user.save();

//     // Send OTP email or SMS based on type
//     if (type === "email") {
//       await sendEmail(
//         email,
//         "Your OTP Code",
//         `Your OTP code is: ${otp}`,
//         `<p>Your OTP code is: <b>${otp}</b></p>`
//       );
//     } else {
//       // Implement SMS sending logic here if required
//     }

//     res.json({ success: true, message: "OTP sent successfully" });
//   } catch (error) {
//     console.error("sendOtp Error:", error);
//     res.status(500).json({ success: false, message: "Failed to send OTP" });
//   }
// };

// // Verify OTP API
// exports.verifyOtp = async (req, res) => {
//   try {
//     const { userId, otp } = req.body;
//     const user = await userModel.findById(userId);
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     if (user.otp !== otp || user.otpExpires < Date.now()) {
//       return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
//     }

//     user.isVerified = true; // For email verification, or set other flags
//     user.otp = null;
//     user.otpExpires = null;
//     await user.save();

//     res.json({ success: true, message: "OTP verified successfully" });
//   } catch (error) {
//     console.error("verifyOtp Error:", error);
//     res.status(500).json({ success: false, message: "OTP verification failed" });
//   }
// };



// // Login user
// // exports.login = async (req, res) => {
// //   try {
// //     const { email, password } = req.body

// //     // Validation
// //     if (!email || !password) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Please provide email and password",
// //       })
// //     }

// //     // Find user and include password
// //     const user = await userModel.findOne({ email }).select("+password")

// //     if (!user) {
// //       return res.status(401).json({
// //         success: false,
// //         message: "Invalid credentials",
// //       })
// //     }

// //     // Check password
// //     const isPasswordValid = await user.comparePassword(password)

// //     if (!isPasswordValid) {
// //       return res.status(401).json({
// //         success: false,
// //         message: "Invalid credentials",
// //       })
// //     }

// //     // Check if user is active
// //     if (!user.isActive) {
// //       return res.status(401).json({
// //         success: false,
// //         message: "Account is deactivated. Please contact support.",
// //       })
// //     }

    
// //     const token = generateToken(user._id, user.role)
// //     const refreshToken = generateRefreshToken(user._id)

    
// //     user.refreshToken = refreshToken
// //     user.lastLogin = new Date()
// //     await user.save()

// //     res.status(200).json({
// //       success: true,
// //       message: "Login successful",
// //       data: {
// //         user: {
// //           id: user._id,
// //           name: user.name,
// //           email: user.email,
// //           phone: user.phone,
// //           role: user.role,
// //           profilePhoto: user.profilePhoto,
// //           walletBalance: user.walletBalance,
// //           loyaltyPoints: user.loyaltyPoints,
// //           isEmailVerified: user.isEmailVerified,
// //           isPhoneVerified: user.isPhoneVerified,
// //         },
// //         token,
// //         refreshToken,
// //       },
// //     })
// //   } catch (error) {
// //     console.error("Login error:", error)
// //     res.status(500).json({
// //       success: false,
// //       message: "Login failed",
// //       error: error.message,
// //     })
// //   }
// // }

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide email and password",
//       });
//     }

//     const user = await userModel.findOne({ email }).select("+password");

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     const isPasswordValid = await user.comparePassword(password);

//     if (!isPasswordValid) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     if (!user.isActive) {
//       return res.status(401).json({
//         success: false,
//         message: "Account is deactivated. Please contact support.",
//       });
//     }

//     const token = generateToken(user._id, user.role);
//     const refreshToken = generateRefreshToken(user._id);

//     user.refreshToken = refreshToken;
//     user.lastLogin = new Date();
//     await user.save();

//     // ✅ user data is top-level now
//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         role: user.role,
//         profilePhoto: user.profilePhoto,
//         walletBalance: user.walletBalance,
//         loyaltyPoints: user.loyaltyPoints,
//         isEmailVerified: user.isEmailVerified,
//         isPhoneVerified: user.isPhoneVerified,
//       },
//       token,
//       refreshToken,
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Login failed",
//       error: error.message,
//     });
//   }
// };


// // Refresh token
// exports.refreshToken = async (req, res) => {
//   try {
//     const { refreshToken } = req.body

//     if (!refreshToken) {
//       return res.status(401).json({
//         success: false,
//         message: "Refresh token is required",
//       })
//     }

//     // Verify refresh token
//     const decoded = verifyRefreshToken(refreshToken)

//     // ✅ FIX: Use correct field name (id not userId)
//     const user = await User.findById(decoded.id).select("+refreshToken")

//     if (!user || user.refreshToken !== refreshToken) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid refresh token",
//       })
//     }

//     // Generate new tokens
//     const newToken = generateToken(user._id, user.role)
//     const newRefreshToken = generateRefreshToken(user._id)

//     // Update refresh token
//     user.refreshToken = newRefreshToken
//     await user.save()

//     res.status(200).json({
//       success: true,
//       message: "Token refreshed successfully",
//       data: {
//         token: newToken,
//         refreshToken: newRefreshToken,
//       },
//     })
//   } catch (error) {
//     console.error("Token refresh error:", error)
//     res.status(401).json({
//       success: false,
//       message: "Token refresh failed",
//       error: error.message,
//     })
//   }
// }



// // Logout
// exports.logout = async (req, res) => {
//   try {
//     const userId = req.user.id

//     // Clear refresh token
//     await userModel.findByIdAndUpdate(userId, { refreshToken: null })

//     res.status(200).json({
//       success: true,
//       message: "Logout successful",
//     })
//   } catch (error) {
//     console.error("Logout error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Logout failed",
//       error: error.message,
//     })
//   }
// }

// // Forgot password
// exports.forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body

//     const user = await userModel.findOne({ email })
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       })
//     }

//     // ✅ FIX: Generate OTP (uncomment if you have the function)
//     // const otp = generateOTP()

//     // For now, generate random 6-digit OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString()

//     // Store OTP
//     global.otpStore = global.otpStore || {}
//     global.otpStore[`reset_${email}`] = {
//       otp,
//       expires: Date.now() + 10 * 60 * 1000,
//       userId: user._id,
//     }

//     // ✅ FIX: Send email (uncomment if you have sendEmail function)
//     // await sendEmail({
//     //   to: email,
//     //   subject: "Password Reset - Barber Booking",
//     //   html: `
//     //     <h2>Password Reset Request</h2>
//     //     <p>Your password reset OTP is: <strong>${otp}</strong></p>
//     //     <p>This OTP will expire in 10 minutes.</p>
//     //     <p>If you didn't request this, please ignore this email.</p>
//     //   `,
//     // })

//     // For testing, log OTP to console
//     console.log(`Password reset OTP for ${email}: ${otp}`)

//     res.status(200).json({
//       success: true,
//       message: "Password reset OTP sent to your email",
//       // ✅ Remove this in production, only for testing
//       otp: otp,
//     })
//   } catch (error) {
//     console.error("Forgot password error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to send reset email",
//       error: error.message,
//     })
//   }
// }

// // Reset password
// exports.resetPassword = async (req, res) => {
//   try {
//     const { email, otp, newPassword } = req.body

//     // Validation
//     if (!email || !otp || !newPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide email, OTP, and new password",
//       })
//     }

//     // Verify OTP
//     global.otpStore = global.otpStore || {}
//     const storedOTP = global.otpStore[`reset_${email}`]

//     if (!storedOTP || storedOTP.otp !== otp || storedOTP.expires < Date.now()) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid or expired OTP",
//       })
//     }

//     // Update password
//     const user = await User.findById(storedOTP.userId)
//     user.password = newPassword
//     await user.save()

//     // Clear OTP
//     delete global.otpStore[`reset_${email}`]

//     res.status(200).json({
//       success: true,
//       message: "Password reset successful",
//     })
//   } catch (error) {
//     console.error("Reset password error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Password reset failed",
//       error: error.message,
//     })
//   }
// }





