"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { CheckCircle, Calendar, Clock, MapPin, AlertCircle, Loader } from "lucide-react";

axios.defaults.baseURL = "http://localhost:5000";

export function BookingConfirmation({ bookingData, onBack }) {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handleConfirmBooking = async () => {
    setIsConfirming(true);
    setConfirmationMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setConfirmationMessage("❌ You must be logged in to confirm bookings.");
        setIsConfirming(false);
        return;
      }

      const payload = {
        shopId: bookingData.shop?.id || bookingData.shop?._id,
        serviceId: bookingData.service?.id || bookingData.service?._id,
        serviceName: bookingData.service?.name,
        bookingDate: new Date(bookingData.date).toISOString(),
        bookingTime: {
          startTime: bookingData.time?.startTime || "10:00 AM",
          endTime: bookingData.time?.endTime || "10:30 AM",
        },
        amount: bookingData.service?.price || 0,
        paymentMethod: "razorpay",
        notes: bookingData.notes || "",
      };

      const response = await axios.post("/api/bookings/create-bookings", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        setConfirmationMessage("✅ Booking confirmed successfully!");
        setTimeout(() => {
          router.push("/dashboard/customer");
        }, 2000);
      } else {
        setConfirmationMessage(`❌ Failed to confirm booking: ${response.data.message || "Unknown error"}`);
        setIsConfirming(false);
      }
    } catch (error) {
      setConfirmationMessage(
        `❌ Failed to confirm booking: ${error.response?.data?.message || error.message || "Unknown error"}`
      );
      setIsConfirming(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500/30 to-amber-500/30 rounded-full mb-4 border border-yellow-500/30">
          <CheckCircle className="w-8 h-8 text-yellow-400" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Confirm Your Booking</h3>
        <p className="text-gray-400">Please review your appointment details</p>
      </motion.div>

      {/* Booking Summary Cards */}
      <div className="space-y-4">
        {/* Location */}
        {bookingData.userLocation && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl hover:border-blue-500/50 transition-all"
          >
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-blue-300 text-sm font-semibold mb-1">📍 Your Location</p>
                <p className="text-white font-medium">{bookingData.userLocation.address}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Shop */}
        {bookingData.shop && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-xl hover:border-indigo-500/50 transition-all"
          >
            <div className="flex items-start space-x-3">
              <img
                src={bookingData.shop.image || "/placeholder.svg"}
                alt={bookingData.shop.name}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
              />
              <div>
                <p className="text-indigo-300 text-sm font-semibold mb-1">🏪 Barbershop</p>
                <p className="text-white font-medium">{bookingData.shop.name}</p>
                <p className="text-gray-400 text-sm">
                  {bookingData.shop.distance?.toFixed(1) || "N/A"} km away
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Service */}
        {bookingData.service && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/30 rounded-xl hover:border-orange-500/50 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-orange-300 text-sm font-semibold mb-2">✂️ Service</p>
                <h4 className="text-white font-bold text-lg">{bookingData.service.name}</h4>
                <div className="flex items-center space-x-4 mt-2 text-sm">
                  <div className="flex items-center space-x-1 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{bookingData.service.duration} minutes</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Price</p>
                <p className="text-2xl font-bold text-orange-400">₹{bookingData.service.price}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Date & Time */}
        {bookingData.date && bookingData.time && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl hover:border-green-500/50 transition-all"
          >
            <div className="space-y-3">
              <p className="text-green-300 text-sm font-semibold">📅 Date & Time</p>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-white font-medium">{formatDate(bookingData.date)}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-white font-medium">
                  {bookingData.time.startTime} - {bookingData.time.endTime}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Price Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 bg-gray-800/50 border border-gray-700/50 rounded-xl"
      >
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Service Fee</span>
            <span className="text-white font-semibold">₹{bookingData.service?.price || 0}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-400">
            <span>Taxes & Fees</span>
            <span>₹0</span>
          </div>
          <div className="border-t border-gray-700 pt-3 flex justify-between items-center">
            <span className="text-white font-bold">Total Amount</span>
            <span className="text-3xl font-bold text-teal-400">₹{bookingData.service?.price || 0}</span>
          </div>
        </div>
      </motion.div>

      {/* Important Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-start space-x-3"
      >
        <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-300">
          <p className="font-semibold mb-1">Important:</p>
          <p>Please arrive 5 minutes early. Cancellations must be made 24 hours before the appointment.</p>
        </div>
      </motion.div>

      {/* Confirmation Message */}
      {confirmationMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg text-center text-sm font-medium border ${
            confirmationMessage.startsWith("✅")
              ? "bg-green-500/20 text-green-400 border-green-500/50"
              : "bg-red-500/20 text-red-400 border-red-500/50"
          }`}
        >
          {confirmationMessage}
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex gap-3 pt-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          disabled={isConfirming}
          className="flex-1 border-2 border-gray-700 bg-gray-800/30 text-gray-300 hover:bg-gray-800/50 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Edit Details
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleConfirmBooking}
          disabled={isConfirming}
          className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-black font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isConfirming ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Confirming...
            </>
          ) : (
            "Confirm Booking"
          )}
        </motion.button>
      </motion.div>

      {/* Booking Reference Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg text-center"
      >
        <p className="text-gray-400 text-sm mb-2">Confirmation details will be sent to your email</p>
        <p className="text-gray-500 text-xs">
          Booking Ref: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
        </p>
      </motion.div>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import {
//   CheckCircle,
//   Calendar,
//   Clock,
//   MapPin,
//   AlertCircle,
// } from "lucide-react";

// axios.defaults.baseURL = "http://localhost:5000";

// export function BookingConfirmation({ bookingData }) {
//   const router = useRouter();
//   const [isConfirming, setIsConfirming] = useState(false);
//   const [confirmationMessage, setConfirmationMessage] = useState("");

//   const formatDate = (dateString) =>
//     new Date(dateString).toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });

//   const handleConfirmBooking = async () => {
//     setIsConfirming(true);
//     setConfirmationMessage("");

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setConfirmationMessage("❌ You must be logged in to confirm bookings.");
//         setIsConfirming(false);
//         return;
//       }

//       // Construct payload with required fields including serviceId
//       const payload = {
//         shopId: bookingData.shop?.id || bookingData.shop?._id,
//         serviceId: bookingData.service?.id || bookingData.service?._id,
//         serviceName: bookingData.service?.name,
//         bookingDate: new Date(bookingData.date).toISOString(),
//         bookingTime: {
//           startTime:
//             typeof bookingData.time === "string"
//               ? bookingData.time
//               : bookingData.time?.startTime || "10:00 AM",
//           endTime:
//             typeof bookingData.time === "string"
//               ? bookingData.time
//               : bookingData.time?.endTime || "10:30 AM",
//         },
//         amount: bookingData.service?.price || bookingData.amount || 0,
//         paymentMethod: "razorpay", // adapt to your logic
//         notes: bookingData.notes || "",
//       };

//       console.log("Booking payload:", payload);

//       // Make POST request to backend
//       const response = await axios.post("/api/bookings/create-bookings", payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.data.success) {
//         setConfirmationMessage("✅ Booking confirmed successfully!");
//         setTimeout(() => {
//           router.push("/dashboard/customer");
//         }, 2000);
//       } else {
//         setConfirmationMessage(
//           `❌ Failed to confirm booking: ${
//             response.data.message || "Unknown error"
//           }`
//         );
//         setIsConfirming(false);
//       }
//     } catch (error) {
//       console.error(
//         "Booking confirmation error:",
//         error.response?.data || error.message || error
//       );
//       setConfirmationMessage(
//         `❌ Failed to confirm booking: ${
//           error.response?.data?.message || error.message || "Unknown error"
//         }`
//       );
//       setIsConfirming(false);
//     }
//   };

//   const handleCancel = () => {
//     router.back();
//   };

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div className="text-center mb-8">
//         <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-full mb-4">
//           <CheckCircle className="w-8 h-8 text-yellow-400" />
//         </div>
//         <h3 className="text-2xl font-bold text-white mb-2">Confirm Your Booking</h3>
//         <p className="text-gray-400">Please review your appointment details</p>
//       </div>

//       {/* Booking Summary Cards */}
//       <div className="space-y-4">
//         {bookingData.userLocation && (
//           <div className="p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl">
//             <div className="flex items-start space-x-3">
//               <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
//               <div>
//                 <p className="text-blue-300 text-sm font-semibold mb-1">📍 Your Location</p>
//                 <p className="text-white font-medium">{bookingData.userLocation.address}</p>
//               </div>
//             </div>
//           </div>
//         )}
//         {bookingData.shop && (
//           <div className="p-4 bg-gradient-to-r from-indigo-500/10 to-indigo-600/10 border border-indigo-500/30 rounded-xl">
//             <div className="flex items-start space-x-3">
//               <img
//                 src={bookingData.shop.image || "/placeholder.svg"}
//                 alt={bookingData.shop.name}
//                 className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
//               />
//               <div>
//                 <p className="text-indigo-300 text-sm font-semibold mb-1">🏪 Barbershop</p>
//                 <p className="text-white font-medium">{bookingData.shop.name}</p>
//                 <p className="text-gray-400 text-sm">{bookingData.shop.distance?.toFixed(1)} km away</p>
//               </div>
//             </div>
//           </div>
//         )}
//         {bookingData.barber && (
//           <div className="p-4 bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl">
//             <div className="flex items-start justify-between">
//               <div className="flex items-start space-x-3 flex-1">
//                 <img
//                   src={bookingData.barber.image || "/placeholder.svg"}
//                   alt={bookingData.barber.name}
//                   className="w-12 h-12 rounded-full object-cover flex-shrink-0"
//                 />
//                 <div>
//                   <p className="text-purple-300 text-sm font-semibold mb-1">👨‍💼 Your Barber</p>
//                   <p className="text-white font-medium">{bookingData.barber.name}</p>
//                   <p className="text-gray-400 text-sm">⭐ {bookingData.barber.rating} rating</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//         {bookingData.service && (
//           <div className="p-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-xl">
//             <div className="flex items-start justify-between">
//               <div className="flex-1">
//                 <p className="text-orange-300 text-sm font-semibold mb-2">✂️ Service</p>
//                 <h4 className="text-white font-bold text-lg">{bookingData.service.name}</h4>
//                 <div className="flex items-center space-x-4 mt-2 text-sm">
//                   <div className="flex items-center space-x-1 text-gray-400">
//                     <Clock className="w-4 h-4" />
//                     <span>{bookingData.service.duration} minutes</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <p className="text-gray-400 text-sm">Price</p>
//                 <p className="text-2xl font-bold text-orange-400">₹{bookingData.service.price}</p>
//               </div>
//             </div>
//           </div>
//         )}
//         {bookingData.date && bookingData.time && (
//           <div className="p-4 bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/30 rounded-xl">
//             <div className="space-y-3">
//               <p className="text-green-300 text-sm font-semibold">📅 Date & Time</p>
//               <div className="flex items-center space-x-3">
//                 <Calendar className="w-5 h-5 text-green-400 flex-shrink-0" />
//                 <span className="text-white font-medium">{formatDate(bookingData.date)}</span>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <Clock className="w-5 h-5 text-green-400 flex-shrink-0" />
//                 <span className="text-white font-medium">
//                   {bookingData.time.startTime} - {bookingData.time.endTime}
//                 </span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Price Summary */}
//       <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl">
//         <div className="space-y-3">
//           <div className="flex justify-between items-center">
//             <span className="text-gray-400">Service Fee</span>
//             <span className="text-white font-semibold">₹{bookingData.service?.price || 0}</span>
//           </div>
//           <div className="flex justify-between items-center text-sm text-gray-400">
//             <span>Taxes & Fees</span>
//             <span>₹0</span>
//           </div>
//           <div className="border-t border-gray-700 pt-3 flex justify-between items-center">
//             <span className="text-white font-bold">Total Amount</span>
//             <span className="text-3xl font-bold text-teal-400">₹{bookingData.service?.price || 0}</span>
//           </div>
//         </div>
//       </div>

//       {/* Terms & Conditions */}
//       <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-start space-x-3">
//         <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
//         <div className="text-sm text-blue-300">
//           <p className="font-semibold mb-1">Important:</p>
//           <p>Please arrive 5 minutes early. Cancellations must be made 24 hours before the appointment.</p>
//         </div>
//       </div>

//       {/* Confirmation Message */}
//       {confirmationMessage && (
//         <div
//           className={`p-4 rounded-lg text-center text-sm font-medium transition ${
//             confirmationMessage.startsWith("✅")
//               ? "bg-green-500/20 text-green-400 border border-green-500/50"
//               : "bg-red-500/20 text-red-400 border border-red-500/50"
//           }`}
//         >
//           {confirmationMessage}
//         </div>
//       )}

//       {/* Action Buttons */}
//       <div className="flex gap-3 pt-4">
//         <Button
//           onClick={handleCancel}
//           disabled={isConfirming}
//           variant="outline"
//           className="flex-1 border-gray-700 bg-gray-800/30 text-gray-300 hover:bg-gray-800/50 hover:text-white py-3 rounded-lg font-semibold transition"
//         >
//           Edit Details
//         </Button>
//         <Button
//           onClick={handleConfirmBooking}
//           disabled={isConfirming}
//           className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-black font-semibold py-3 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {isConfirming ? "Confirming..." : "Confirm Booking"}
//         </Button>
//       </div>

//       {/* Booking Reference Info */}
//       <div className="p-4 bg-gray-800/30 border border-gray-700 rounded-lg text-center">
//         <p className="text-gray-400 text-sm mb-2">Confirmation details will be sent to your email</p>
//         <p className="text-gray-500 text-xs">Booking Ref: #{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
//       </div>
//     </div>
//   );
// }

