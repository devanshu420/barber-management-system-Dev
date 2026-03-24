const Booking = require("../models/Booking");
const BarberShop = require("../models/barbershopnewmodel");
const User = require("../models/User");
const { sendEmail } = require("../utils/sendEmail.js");

// Create booking
exports.createBooking = async (req, res) => {
  console.log("Request Body:", req.body);
  try {
    const {
      shopId,
      services,
      bookingDate,
      bookingTime,
      amount,
      paymentMethod,
      notes,
    } = req.body;

    // console.log("Booking request body:", req.body); // Debug
    console.log("Req USer ", req.user);

    const formattedDate = new Date(bookingDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    // Validate required fields
    if (
      !shopId ||
      !services ||
      services.length === 0 ||
      !bookingDate ||
      !bookingTime ||
      !amount
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: shopId, services, bookingDate, bookingTime, amount",
      });
    }

    // Validate bookingTime structure
    if (!bookingTime.startTime || !bookingTime.endTime) {
      return res.status(400).json({
        success: false,
        message: "bookingTime must have startTime and endTime",
      });
    }

    // Check if shop exists
    const shop = await BarberShop.findById(shopId);
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    // Check if slot is already booked
    const startDate = new Date(bookingDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(bookingDate);
    endDate.setHours(23, 59, 59, 999);

    const existingBooking = await Booking.findOne({
      shopId,
      bookingDate: {
        $gte: startDate,
        $lte: endDate,
      },
      "bookingTime.startTime": bookingTime.startTime,
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "This time slot is already booked",
      });
    }

    // To Fetch  Shop Name , Service NAme using ShopID
    const shopName = await BarberShop.findById(shopId).select("shopName");
    console.log("Shop Name:", shopName);

    //Create Service Names String
    const serviceNames = services.map((s) => s.name).join(", ");
    console.log("Service Names:", serviceNames);

    // Create new booking
    const booking = new Booking({
      userId: req.user.id,
      shopId,
      services,
      bookingDate: new Date(bookingDate),
      bookingTime: {
        startTime: bookingTime.startTime,
        endTime: bookingTime.endTime,
      },
      amount,
      finalAmount: amount,
      paymentMethod: paymentMethod || "razorpay",
      status: "pending",
      paymentStatus: "pending",
      notes: notes || "",
    });

    console.log("Booking object before save:", booking); // Debug

    await booking.save();

    // --- SEND REAL-TIME NOTIFICATION TO BARBER ---
    // try {
    //   const shopData = await BarberShop.findById(shopId).select(
    //     "shopName barberOwner",
    //   );

    //   if (shopData && shopData.barberOwner) {
    //     const ownerId = shopData.barberOwner.toString();

    //     // global.io.to(ownerId).emit("newBooking", {
    //     //   shopName: shopData.shopName,
    //     //   service: serviceNames,
    //     //   time: bookingTime,
    //     //   bookingId: booking._id,
    //     // });

    //     // console.log("📢 Real-time notification sent to barber:", ownerId);
    //   }
    // } catch (e) {
    //   console.error("Error sending socket event:", e);
    // }

    const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px;">
    <div style="max-width: 540px; margin: auto; background: #ffffff;
                border-radius: 10px; overflow: hidden;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <!-- Header -->
      <div style="background: #111827; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0;">✂ BarberBook</h1>
        <p style="color: #9ca3af; margin: 5px 0 0; font-size: 13px;">
          Booking Received
        </p>
      </div>

      <!-- Body -->
      <div style="padding: 26px 28px 24px; text-align: left;">
        <h2 style="color: #111827; margin: 0 0 10px; font-size: 20px;">
          Hi ${req.user.name || "there"},
        </h2>

        <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0 0 14px;">
          Thank you for booking with <strong>BarberBook</strong>. Here are your
          appointment details:
        </p>

        <!-- Details box -->
        <div style="
          margin: 18px 0;
          padding: 14px 16px;
          background: #f3f4f6;
          border-radius: 8px;
          font-size: 14px;
          color: #111827;
        ">
          <p style="margin: 0 0 6px;">
            <strong>Barbershop:</strong> ${shopName.shopName || "N/A"}
          </p>
          <p style="margin: 0 0 6px;">
            <strong>Service:</strong> ${serviceNames || "N/A"}
          </p>
          <p style="margin: 0 0 6px;">
            <strong>Date:</strong> ${formattedDate || "N/A"}
          </p>
          <p style="margin: 0 0 6px;">
            <strong>Time:</strong> ${
              bookingTime?.startTime && bookingTime?.endTime
                ? `${bookingTime.startTime} – ${bookingTime.endTime}`
                : "N/A"
            }
          </p>
          <p style="margin: 0 0 6px;">
            <strong>Amount:</strong> ₹${amount || "0"}
          </p>
          <p style="margin: 0 0 6px;">
            <strong>Payment Method:</strong> ${
              paymentMethod
                ? paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)
                : "N/A"
            }
          </p>
          <p style="margin: 0 0 0;">
            <strong>Booking Status:</strong> ${booking.status || "pending"} |
            <strong> Payment Status:</strong> ${booking.paymentStatus || "pending"}
          </p>
        </div>

        ${
          notes
            ? `
        <div style="
          margin: 16px 0 10px;
          padding: 12px 14px;
          background: #eef2ff;
          border-radius: 8px;
          font-size: 13px;
          color: #111827;
          border: 1px solid #e0e7ff;
        ">
          <p style="margin: 0 0 4px; font-weight: 600;">Your note for the barber:</p>
          <p style="margin: 0; color: #4b5563;">${notes}</p>
        </div>
        `
            : ""
        }

        <p style="color: #6b7280; font-size: 12px; line-height: 1.6; margin: 12px 0 0;">
          You’ll receive another update if the barbershop changes the status of this
          booking. If any detail looks incorrect, please contact the barbershop or
          update your booking in the BarberBook app.
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #9ca3af;">
        © ${new Date().getFullYear()} BarberBook. All rights reserved.
      </div>
    </div>
  </div>
`;

    //  await sendEmail(req.user.email,`Your ${serviceName} booking at ${shopName.shopName || "Shop"}`,html);
    await sendEmail(
      req.user.email,
      `Your booking at ${shopName.shopName || "Shop"}`,
      html,
    );

    console.log("Booking saved successfully:", booking); // Debug

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

// exports.createBooking = async (req, res) => {
//   try {
//     const {
//       shopId,
//       services,
//       bookingDate,
//       bookingTime,
//       amount,
//       paymentMethod,
//       notes,
//     } = req.body;

//     if (!shopId || !services || !bookingDate || !bookingTime || !amount) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields",
//       });
//     }

//     if (!bookingTime.startTime || !bookingTime.endTime) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid booking time",
//       });
//     }

//     const shop = await BarberShop.findById(shopId);

//     if (!shop) {
//       return res.status(404).json({
//         success: false,
//         message: "Shop not found",
//       });
//     }

//     // Slot check
//     const startDate = new Date(bookingDate);
//     startDate.setHours(0, 0, 0, 0);

//     const endDate = new Date(bookingDate);
//     endDate.setHours(23, 59, 59, 999);

//     const existingBooking = await Booking.findOne({
//       shopId,
//       bookingDate: { $gte: startDate, $lte: endDate },
//       "bookingTime.startTime": bookingTime.startTime,
//       status: { $in: ["pending", "confirmed"] },
//     });

//     if (existingBooking) {
//       return res.status(400).json({
//         success: false,
//         message: "This time slot is already booked",
//       });
//     }

//     const shopData = await BarberShop.findById(shopId).select(
//       "shopName barberOwner"
//     );

//     // services list
//     const serviceNames = services.map((s) => s.name).join(", ");

//     const booking = new Booking({
//       userId: req.user.id,
//       shopId,
//       services,
//       bookingDate: new Date(bookingDate),
//       bookingTime,
//       amount,
//       paymentMethod,
//       notes,
//     });

//     await booking.save();

//     // realtime notification
//     if (shopData.barberOwner) {
//       global.io.to(shopData.barberOwner.toString()).emit("newBooking", {
//         shopName: shopData.shopName,
//         services: serviceNames,
//         time: bookingTime,
//         bookingId: booking._id,
//       });
//     }

//     const servicesHtml = services
//   .map(
//     (s) => `
//     <p style="margin: 0 0 6px;">
//       <strong>${s.name}</strong> - ₹${s.price}
//     </p>
//   `
//   )
//   .join("");

//     // Email HTML
//    const html = `
//   <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px;">
//     <div style="max-width: 540px; margin: auto; background: #ffffff;
//                 border-radius: 10px; overflow: hidden;
//                 box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

//       <!-- Header -->
//       <div style="background: #111827; padding: 20px; text-align: center;">
//         <h1 style="color: #ffffff; margin: 0;">✂ BarberBook</h1>
//         <p style="color: #9ca3af; margin: 5px 0 0; font-size: 13px;">
//           Booking Received
//         </p>
//       </div>

//       <!-- Body -->
//       <div style="padding: 26px 28px 24px; text-align: left;">
//         <h2 style="color: #111827; margin: 0 0 10px; font-size: 20px;">
//           Hi ${req.user.name || "there"},
//         </h2>

//         <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0 0 14px;">
//           Thank you for booking with <strong>BarberBook</strong>. Here are your
//           appointment details:
//         </p>

//         <!-- Details box -->
//         <div style="
//           margin: 18px 0;
//           padding: 14px 16px;
//           background: #f3f4f6;
//           border-radius: 8px;
//           font-size: 14px;
//           color: #111827;
//         ">
//           <p style="margin: 0 0 6px;">
//             <strong>Barbershop:</strong> ${shopName.shopName || "N/A"}
//           </p>

//           <p style="margin: 10px 0 6px;">
//             <strong>Services:</strong>
//           </p>

//           ${servicesHtml}

//           <p style="margin: 10px 0 6px;">
//             <strong>Date:</strong> ${formattedDate || "N/A"}
//           </p>

//           <p style="margin: 0 0 6px;">
//             <strong>Time:</strong>
//             ${
//               bookingTime?.startTime && bookingTime?.endTime
//                 ? `${bookingTime.startTime} – ${bookingTime.endTime}`
//                 : "N/A"
//             }
//           </p>

//           <p style="margin: 0 0 6px;">
//             <strong>Total Amount:</strong> ₹${amount || "0"}
//           </p>

//           <p style="margin: 0 0 6px;">
//             <strong>Payment Method:</strong>
//             ${
//               paymentMethod
//                 ? paymentMethod.charAt(0).toUpperCase() +
//                   paymentMethod.slice(1)
//                 : "N/A"
//             }
//           </p>

//           <p style="margin: 0;">
//             <strong>Booking Status:</strong> ${booking.status || "pending"} |
//             <strong> Payment Status:</strong> ${booking.paymentStatus || "pending"}
//           </p>
//         </div>

//         ${
//           notes
//             ? `
//         <div style="
//           margin: 16px 0 10px;
//           padding: 12px 14px;
//           background: #eef2ff;
//           border-radius: 8px;
//           font-size: 13px;
//           color: #111827;
//           border: 1px solid #e0e7ff;
//         ">
//           <p style="margin: 0 0 4px; font-weight: 600;">Your note for the barber:</p>
//           <p style="margin: 0; color: #4b5563;">${notes}</p>
//         </div>
//         `
//             : ""
//         }

//         <p style="color: #6b7280; font-size: 12px; line-height: 1.6; margin: 12px 0 0;">
//           You’ll receive another update if the barbershop changes the status of this
//           booking. If any detail looks incorrect, please contact the barbershop or
//           update your booking in the BarberBook app.
//         </p>
//       </div>

//       <!-- Footer -->
//       <div style="background: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #9ca3af;">
//         © ${new Date().getFullYear()} BarberBook. All rights reserved.
//       </div>

//     </div>
//   </div>
// `;
//     await sendEmail(
//       req.user.email,
//       `Booking Confirmed at ${shopData.shopName}`,
//       html
//     );

//     res.status(201).json({
//       success: true,
//       message: "Booking created successfully",
//       data: booking,
//     });
//   } catch (error) {
//     console.error("Booking error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to create booking",
//       error: error.message,
//     });
//   }
// };

// Get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    console.log("User ID from token:", req.user.id); // Debug

    const bookings = await Booking.find({ userId: req.user.id })
      .populate("shopId", "shopName location")
      .sort({ bookingDate: -1 });

    console.log("Found bookings:", bookings); // Debug

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

// Get shop bookings (for barbers)
exports.getShopBookings = async (req, res) => {
  try {
    const { shopId } = req.params;

    const bookings = await Booking.find({ shopId })
      .populate("userId", "name email phone")
      .sort({ bookingDate: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Error fetching shop bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

// Get booked slots for a specific date
exports.getBookedSlots = async (req, res) => {
  try {
    const { shopId, date } = req.params;

    // Parse date properly
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      shopId,
      bookingDate: {
        $gte: startDate,
        $lte: endDate,
      },
      status: { $in: ["pending", "confirmed"] },
    });

    const bookedSlots = bookings.map((b) => b.bookingTime);

    res.status(200).json({
      success: true,
      bookedSlots,
      totalBookings: bookedSlots.length,
    });
  } catch (error) {
    console.error("Error fetching booked slots:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booked slots",
      error: error.message,
    });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("userId", "name email phone")
      .populate("shopId", "shopName location");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
      error: error.message,
    });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "in-progress",
      "completed",
      "cancelled",
      "no-show",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    ).populate("userId", "name");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // // 🔥 SEND REAL-TIME NOTIFICATION TO USER
    // global.io.to(booking.userId._id.toString()).emit("bookingUpdate", {
    //   bookingId: booking._id,
    //   status,
    //   message:
    //     status === "confirmed"
    //       ? "Your booking has been confirmed 🎉"
    //       : `Your booking status updated: ${status}`,
    // });

    // console.log("📢 Notification sent to user:", booking.userId._id.toString());

    res.status(200).json({
      success: true,
      message: "Booking status updated",
      data: booking,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update booking",
      error: error.message,
    });
  }
};

// Reschedule booking
exports.rescheduleBooking = async (req, res) => {
  try {
    const { newDate, newTime, reason } = req.body;

    if (!newDate || !newTime || !newTime.startTime || !newTime.endTime) {
      return res.status(400).json({
        success: false,
        message: "New date and full time range are required",
      });
    }

    const booking = await Booking.findById(req.params.id)
      .populate("userId", "name")
      .populate("shopId", "shopName barberOwner");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const newStartDate = new Date(newDate);
    newStartDate.setHours(0, 0, 0, 0);

    const newEndDate = new Date(newDate);
    newEndDate.setHours(23, 59, 59, 999);

    const existingBooking = await Booking.findOne({
      shopId: booking.shopId,
      bookingDate: { $gte: newStartDate, $lte: newEndDate },
      "bookingTime.startTime": newTime.startTime,
      status: { $in: ["pending", "confirmed"] },
      _id: { $ne: booking._id },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "This time slot is already booked",
      });
    }

    booking.rescheduleHistory.push({
      oldDate: booking.bookingDate,
      oldTime: booking.bookingTime,
      newDate: new Date(newDate),
      newTime: {
        startTime: newTime.startTime,
        endTime: newTime.endTime,
      },
      reason,
      rescheduledAt: new Date(),
    });

    booking.bookingDate = new Date(newDate);
    booking.bookingTime = {
      startTime: newTime.startTime,
      endTime: newTime.endTime,
    };

    await booking.save();

    // // USER
    // if (booking.userId?._id) {
    //   const room = booking.userId._id.toString();
    //   global.io.to(room).emit("bookingUpdate", {
    //     bookingId: booking._id.toString(),
    //     type: "rescheduled",
    //     newDate: booking.bookingDate,
    //     newTime: booking.bookingTime,
    //     message: "Your booking has been rescheduled 🔁",
    //   });
    //   console.log("📢 bookingUpdate (reschedule) to USER room:", room);
    // }

    // BARBER
    // if (booking.shopId?.barberOwner) {
    //   const room = booking.shopId.barberOwner.toString();
    //   global.io.to(room).emit("bookingUpdate", {
    //     bookingId: booking._id.toString(),
    //     type: "rescheduled",
    //     newDate: booking.bookingDate,
    //     newTime: booking.bookingTime,
    //     service: booking.serviceName,
    //     message: "A booking has been rescheduled",
    //   });
    //   console.log("📢 bookingUpdate (reschedule) to BARBER room:", room);
    // }

    res.status(200).json({
      success: true,
      message: "Booking rescheduled successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error rescheduling booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reschedule booking",
      error: error.message,
    });
  }
};

// Cancel booking

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status: "cancelled",
        cancellationReason,
        cancelledAt: new Date(),
      },
      { new: true },
    )
      .populate("userId", "name")
      .populate("shopId", "shopName barberOwner");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // USER
    // if (booking.userId?._id) {
    //   const room = booking.userId._id.toString();
    //   global.io.to(room).emit("bookingUpdate", {
    //     bookingId: booking._id.toString(),
    //     type: "cancelled",
    //     message: "Your booking has been cancelled ❌",
    //     reason: cancellationReason,
    //   });
    //   console.log("📢 bookingUpdate sent to USER room:", room);
    // }

    // BARBER
    // if (booking.shopId?.barberOwner) {
    //   const room = booking.shopId.barberOwner.toString();
    //   global.io.to(room).emit("bookingUpdate", {
    //     bookingId: booking._id.toString(),
    //     type: "cancelled",
    //     customerName: booking.userId?.name,
    //     message: "A booking has been cancelled",
    //     reason: cancellationReason,
    //   });
    //   console.log("📢 bookingUpdate sent to BARBER room:", room);
    // }
    const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px;">
    <div style="max-width: 480px; margin: auto; background: #ffffff;
                border-radius: 10px; overflow: hidden;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <!-- Header -->
      <div style="background: #111827; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0;">✂ BarberBook</h1>
        <p style="color: #f97373; margin: 5px 0 0; font-size: 13px;">
          Booking Cancelled
        </p>
      </div>

      <!-- Body -->
      <div style="padding: 24px 26px 22px; text-align: left;">
        <h2 style="color: #111827; margin: 0 0 10px; font-size: 18px;">
          Hi ${req.user.name || "there"},
        </h2>

        <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0 0 10px;">
          Your BarberBook appointment has been cancelled successfully.
        </p>

        <p style="color: #6b7280; font-size: 12px; line-height: 1.6; margin: 8px 0 0;">
          If this wasn’t you or you want to book again, you can create a new
          appointment anytime in the BarberBook app.
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #f9fafb; padding: 14px; text-align: center; font-size: 12px; color: #9ca3af;">
        © ${new Date().getFullYear()} BarberBook. All rights reserved.
      </div>
    </div>
  </div>
`;

    await sendEmail(req.user.email, "Booking Cancelled", html);

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
};

// Add review

exports.addReview = async (req, res) => {
  try {
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        rating,
        review,
        isReviewed: true,
        reviewDate: new Date(),
      },
      { new: true },
    )
      .populate("userId", "name")
      .populate("shopId", "shopName barberOwner");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // if (booking.shopId?.barberOwner) {
    //   const room = booking.shopId.barberOwner.toString();
    //   global.io.to(room).emit("bookingUpdate", {
    //     bookingId: booking._id.toString(),
    //     type: "review",
    //     rating,
    //     review,
    //     message: `New ${rating}⭐ review received`,
    //   });
    //   console.log("📢 bookingUpdate (review) to BARBER room:", room);
    // }

    // if (booking.userId?._id) {
    //   const room = booking.userId._id.toString();
    //   global.io.to(room).emit("bookingUpdate", {
    //     bookingId: booking._id.toString(),
    //     type: "review-confirmation",
    //     message: "Your review has been submitted successfully ⭐",
    //   });
    //   console.log("📢 bookingUpdate (review confirm) to USER room:", room);
    // }

    res.status(200).json({
      success: true,
      message: "Review added successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add review",
      error: error.message,
    });
  }
};

// Get all bookings (admin)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email phone")
      .populate("shopId", "shopName location")
      .sort({ bookingDate: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
      total: bookings.length,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

// Get booking statistics
exports.getBookingStats = async (req, res) => {
  try {
    const { shopId } = req.params;

    const mongoose = require("mongoose");

    const stats = await Booking.aggregate([
      {
        $match: {
          shopId: new mongoose.Types.ObjectId(shopId),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          confirmed: {
            $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] },
          },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
          },
          totalRevenue: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, "$finalAmount", 0],
            },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: stats[0] || {
        total: 0,
        completed: 0,
        confirmed: 0,
        pending: 0,
        cancelled: 0,
        totalRevenue: 0,
      },
    });
  } catch (error) {
    console.error("Error fetching booking stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking statistics",
      error: error.message,
    });
  }
};

// Search booking by booking number
exports.searchBookingByNumber = async (req, res) => {
  try {
    const bookingNumber = req.params.bookingNumber.toUpperCase();

    const booking = await Booking.findOne({ bookingNumber })
      .populate("userId", "name email")
      .populate("shopId", "shopName location")
      .lean();

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.json({
      success: true,
      data: booking,
    });

  } catch (err) {
    console.error("Search booking error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to search booking",
    });
  }
};