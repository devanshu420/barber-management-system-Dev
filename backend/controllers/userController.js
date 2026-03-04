const User = require("../models/User")
const Booking = require("../models/Booking")

// Get user profile
// const Booking = require("../models/bookingModel"); // path adjust karo

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // yahan se bookings count lao
    const bookingsCount = await Booking.countDocuments({
      userId: req.user.id, // ya jo field hai, e.g. customer: req.user.id
    });

    // const reviewsCount = await Review.countDocuments({
    //   user: req.user.id, // agar reviews model hai, optional
    // });

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        bookings: bookingsCount,
        // reviews: reviewsCount,
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};



// Get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("barberId", "shopName")
      .sort({ bookingDate: -1 })

    res.status(200).json({
      success: true,
      data: bookings,
    })
  } catch (error) {
    console.error("Error fetching bookings:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    })
  }
}

// Get wallet balance
exports.getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("walletBalance")

    res.status(200).json({
      success: true,
      data: {
        walletBalance: user.walletBalance,
      },
    })
  } catch (error) {
    console.error("Error fetching wallet:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch wallet",
      error: error.message,
    })
  }
}

// Add money to wallet
exports.addToWallet = async (req, res) => {
  try {
    const { amount } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      })
    }

    const user = await User.findByIdAndUpdate(req.user.id, { $inc: { walletBalance: amount } }, { new: true })

    res.status(200).json({
      success: true,
      message: "Amount added to wallet",
      data: {
        walletBalance: user.walletBalance,
      },
    })
  } catch (error) {
    console.error("Error adding to wallet:", error)
    res.status(500).json({
      success: false,
      message: "Failed to add to wallet",
      error: error.message,
    })
  }
}

// Get loyalty points
exports.getLoyaltyPoints = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("loyaltyPoints")

    res.status(200).json({
      success: true,
      data: {
        loyaltyPoints: user.loyaltyPoints,
      },
    })
  } catch (error) {
    console.error("Error fetching loyalty points:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch loyalty points",
      error: error.message,
    })
  }
}

// Deactivate account
exports.deactivateAccount = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { isActive: false })

    res.status(200).json({
      success: true,
      message: "Account deactivated successfully",
    })
  } catch (error) {
    console.error("Error deactivating account:", error)
    res.status(500).json({
      success: false,
      message: "Failed to deactivate account",
      error: error.message,
    })
  }
}



// Update user profile 
const { uploadImage, deleteImage } = require("../services/imagekit.services");

exports.updateUserProfile = async (req, res) => {
  try{
    const userId = req.user.id; // from authenticate middleware

    let { name, email, phone } = req.body;

    // 1) Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2) Basic validation
    // Name
    if (name !== undefined) {
      name = name.trim();
      if (name.length < 2 || name.length > 50) {
        return res.status(400).json({
          success: false,
          message: "Name must be between 2 and 50 characters",
        });
      }
    }

    // Email
    if (email !== undefined) {
      email = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid email address",
        });
      }

      // Unique check excluding current user
      const existingEmailUser = await User.findOne({
        email,
        _id: { $ne: userId },
      });
      if (existingEmailUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use by another account",
        });
      }
    }

    // Phone
    if (phone !== undefined) {
      phone = phone.trim();
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          success: false,
          message: "Phone number must be exactly 10 digits",
        });
      }

      const existingPhoneUser = await User.findOne({
        phone,
        _id: { $ne: userId },
      });
      if (existingPhoneUser) {
        return res.status(400).json({
          success: false,
          message: "Phone number is already in use by another account",
        });
      }
    }

    // 3) Handle profile photo upload (if any)
    let newProfilePhotoUrl = user.profilePhoto;
    let newProfilePhotoId = user.profilePhotoId;

    if (req.file) {
      // optional: delete old image if exists
      if (user.profilePhotoId) {
        try {
          await deleteImage(user.profilePhotoId);
        } catch (delErr) {
          console.error("Failed to delete old ImageKit file:", delErr);
        }
      }

      const uploadedImage = await uploadImage({
        buffer: req.file.buffer,
        folder: "/barber-book/users",
      });

      newProfilePhotoUrl = uploadedImage.url;
      newProfilePhotoId = uploadedImage.id; // depends on your uploadImage response
    }

    // 4) Track whether email/phone changed
    const emailChanged = email !== undefined && email !== user.email;
    const phoneChanged = phone !== undefined && phone !== user.phone;

    // 5) Update fields (only allowed; never role, wallet, password here)
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;

    user.profilePhoto = newProfilePhotoUrl;
    user.profilePhotoId = newProfilePhotoId;

    if (emailChanged) {
      user.isEmailVerified = false;
      // optional: trigger email verification flow
    }

    if (phoneChanged) {
      user.isPhoneVerified = false;
      // optional: trigger OTP flow
    }

    // 6) Save
    await user.save();

    // 7) Prepare safe response (no password)
    const responseUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profilePhoto: user.profilePhoto,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
    };

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: responseUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    // Handle Mongo duplicate key errors as backup
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "field";
      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};
