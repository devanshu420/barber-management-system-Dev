const userModel = require("../models/User");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const {sendEmail} = require("../utils/sendEmail.js");

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

    await user.save();

    const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px;">
    <div style="max-width: 500px; margin: auto; background: #ffffff;
                border-radius: 10px; overflow: hidden;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <div style="background: #111827; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0;">✂ BarberBook</h1>
        <p style="color: #9ca3af; margin: 5px 0 0; font-size: 13px;">
          Welcome to your new grooming hub
        </p>
      </div>

      <div style="padding: 30px; text-align: left;">
        <h2 style="color: #111827; margin-bottom: 10px; font-size: 20px;">
          Welcome, ${name || "there"} 👋
        </h2>

        <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0 0 14px;">
          Thanks for creating an account with <strong>BarberBook</strong>.
          You can now easily discover barbers, book appointments, and manage
          all your grooming visits in one place.
        </p>

        <div style="
          margin: 24px 0;
          padding: 14px 16px;
          background: #f3f4f6;
          border-radius: 8px;
          font-size: 14px;
          color: #111827;
        ">
          <p style="margin: 0 0 4px;">
            <strong>What you can do next:</strong>
          </p>
          <ul style="padding-left: 18px; margin: 6px 0 0; color: #4b5563;">
            <li>Browse available barbers and services</li>
            <li>Book a haircut or beard trim in a few taps</li>
            <li>View and manage your upcoming appointments</li>
          </ul>
        </div>

        <p style="color: #6b7280; font-size: 12px; line-height: 1.6; margin: 0;">
          If you didn’t sign up for BarberBook, you can safely ignore this email.
        </p>
      </div>

      <div style="
        background: #f9fafb;
        padding: 15px;
        text-align: center;
        font-size: 12px;
        color: #9ca3af;
      ">
        © ${new Date().getFullYear()} BarberBook. All rights reserved.
      </div>
    </div>
  </div>
`;

    await sendEmail(user.email, "Welcome to BarberBook", html);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
      token,
      refreshToken,
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


// ----------------------
// Forgot Password (Send OTP)
// ----------------------
exports.forgotPasswordOtp = async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    email = email.toLowerCase();

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Forget Password OTP:", otp);

    // Hash OTP before saving
    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    user.resetOtp = hashedOtp;
    user.resetOtpExpire = Date.now() + 5 * 60 * 1000; // 5 minutes

    await user.save();

    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px;">
        <div style="max-width: 500px; margin: auto; background: #ffffff;
                    border-radius: 10px; overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <div style="background: #111827; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0;">✂ BarberBook</h1>
            <p style="color: #9ca3af; margin: 5px 0 0;">Secure Password Reset</p>
          </div>

          <div style="padding: 30px; text-align: center;">
            <h2 style="color: #111827; margin-bottom: 10px;">
              Reset Your Password
            </h2>
            <p style="color: #4b5563; font-size: 14px;">
              Use the OTP below to reset your password.
              This code will expire in <strong>5 minutes</strong>.
            </p>

            <div style="
              margin: 25px auto;
              padding: 15px;
              background: #f3f4f6;
              border-radius: 8px;
              font-size: 28px;
              letter-spacing: 8px;
              font-weight: bold;
              color: #111827;
              width: fit-content;
            ">
              ${otp}
            </div>

            <p style="color: #6b7280; font-size: 12px;">
              If you did not request this password reset, please ignore this email.
            </p>
          </div>

          <div style="background: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #9ca3af;">
            © ${new Date().getFullYear()} BarberBook. All rights reserved.
          </div>
        </div>
      </div>
    `;

    await sendEmail(user.email, "Password Reset OTP", html);

    res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (error) {
    console.error("Forgot password OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

// ----------------------
// NEW: Verify Reset OTP (step 1)
// POST /api/auth/verify-reset-otp
// ----------------------
exports.verifyResetOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    email = email.toLowerCase();

    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    const user = await userModel.findOne({
      email,
      resetOtp: hashedOtp,
      resetOtpExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Optional: yaha koi flag set kar sakte ho (e.g. resetOtpVerified = true)

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Verify reset OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while verifying OTP",
      error: error.message,
    });
  }
};

// ----------------------
// Reset Password with OTP (step 2)
// POST /api/auth/reset-password
// ----------------------
exports.resetPasswordWithOtp = async (req, res) => {
  try {
    let { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and new password are required",
      });
    }

    email = email.toLowerCase();

    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    const user = await userModel.findOne({
      email,
      resetOtp: hashedOtp,
      resetOtpExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Update password (hashing model ke pre-save hook me ho raha hai to direct assign karo)
    user.password = newPassword;

    // Clear OTP fields
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Password reset failed",
      error: error.message,
    });
  }
};

