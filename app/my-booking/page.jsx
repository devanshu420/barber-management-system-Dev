"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import API from "../../lib/api";
import {
  Calendar,
  Clock,
  User,
  Scissors,
  X,
  ArrowLeft,
  MapPin,
  AlertCircle,
  Loader,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

//   useEffect(() => {
//     async function fetchBookings() {
//       setLoading(true);
//       setError("");
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           router.push("/auth/login");
//           return;
//         }

//         const response = await axios.get("/api/bookings/user", {
//   headers: {
//     Authorization: `Bearer ${token}`,
//   },
// });
// console.log("API Response:", response);
// console.log("API Response Data:", response.data);
// if (!response.data.success) {
//   console.error("API responded with failure:", response.data);
//   setError("Failed to load bookings");
//   setLoading(false);
//   return;
// }
        

//         if (response.data.success) {
//           const transformedBookings = response.data.data.map((booking) => ({
//             id: booking._id,
//             shopName: booking.shopId?.shopName || "Unknown Shop",
//             shopLocation: booking.shopId?.location?.address || "Unknown Location",
//             date: new Date(booking.bookingDate).toLocaleDateString("en-GB"),
//             time: booking.bookingTime,
//             service: booking.serviceName,
//             price: `₹${booking.finalAmount || booking.amount}`,
//             status: booking.status,
//             paymentStatus: booking.paymentStatus,
//             rating: booking.rating,
//             review: booking.review,
//             isReviewed: booking.isReviewed,
//             createdAt: booking.createdAt,
//             bookingData: booking,
//           }));

//           setBookings(transformedBookings);
//         } else {
//           setError("Failed to load bookings");
//         }
//       } catch (err) {
//         if (err.response?.status === 401) {
//           router.push("/auth/login");
//         } else {
//           setError("Unable to load bookings. Please try again.");
//           console.error("Fetch bookings error:", err);
//         }
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchBookings();
//   }, [router]);

  useEffect(() => {
  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }
      console.log("Token:", token);
      const response = await axios.get("/api/bookings/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      console.log("API Response:", response);
      const { success, data } = response.data;
      const bookingLength = data.length;
      console.log("Number of bookings fetched:", bookingLength);
      const booking = localStorage.setItem("userBookings", bookingLength);

      

      if (!success) {
        setError("Failed to load bookings");
        setLoading(false);
        return;
      }

      const transformedBookings = data.map((booking) => ({
        id: booking._id,
        shopName: booking.shopId?.shopName || "Unknown Shop",
        shopLocation: booking.shopId?.location?.address || "Unknown Location",
        date: new Date(booking.bookingDate).toLocaleDateString("en-GB"),
        time: booking.bookingTime,
        service: booking.serviceName,
        price: `₹${booking.finalAmount || booking.amount}`,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        rating: booking.rating,
        review: booking.review,
        isReviewed: booking.isReviewed,
        createdAt: booking.createdAt,
        bookingData: booking,
      }));

      setBookings(transformedBookings);
    } catch (err) {
      if (err.response?.status === 401) {
        router.push("/auth/login");
      } else {
        setError("Unable to load bookings. Please try again.");
        console.error("Fetch bookings error:", err);
      }
    } finally {
      setLoading(false);
    }
  };
  fetchBookings();
}, [router]);



  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedBooking(null);
  };

  const handleCancel = async (bookingId) => {
    const reason = prompt("Please enter cancellation reason:");
    if (!reason) return;

    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/api/bookings/${bookingId}/cancel`,
        { cancellationReason: reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setBookings(
          bookings.map((b) =>
            b.id === bookingId ? { ...b, status: "cancelled" } : b
          )
        );
        handleCloseDetails();
        alert("Booking cancelled successfully");
      }
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert("Failed to cancel booking");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReschedule = async (bookingId) => {
    const newDate = prompt("Enter new date (YYYY-MM-DD):");
    if (!newDate) return;

    const newTime = prompt("Enter new time (HH:MM AM/PM):");
    if (!newTime) return;

    const reason = prompt("Enter reschedule reason:");

    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/api/bookings/${bookingId}/reschedule`,
        { newDate, newTime, reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Booking rescheduled successfully");
        window.location.reload();
      }
    } catch (err) {
      console.error("Error rescheduling booking:", err);
      alert("Failed to reschedule booking");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddReview = async (bookingId) => {
    const rating = prompt("Enter rating (1-5):");
    if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
      alert("Please enter a valid rating between 1 and 5");
      return;
    }

    const review = prompt("Enter your review:");
    if (!review) return;

    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/api/bookings/${bookingId}/review`,
        { rating: parseInt(rating), review },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setBookings(
          bookings.map((b) =>
            b.id === bookingId
              ? { ...b, isReviewed: true, rating: parseInt(rating), review }
              : b
          )
        );
        handleCloseDetails();
        alert("Review added successfully");
      }
    } catch (err) {
      console.error("Error adding review:", err);
      alert("Failed to add review");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-400 border border-green-500/50";
      case "completed":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/50";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border border-red-500/50";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/50";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 animate-spin text-teal-400" />
          <p className="text-gray-400">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-teal-400 hover:bg-gray-800/50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              My Bookings
            </h1>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Empty */}
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mb-4">
              <Scissors className="w-8 h-8 text-teal-400" />
            </div>
            <p className="text-gray-400 text-lg">You have no bookings yet.</p>
            <Button
              onClick={() => router.push("/")}
              className="mt-4 bg-teal-500 hover:bg-teal-600"
            >
              Book an Appointment
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-gray-900/50 backdrop-blur-md border border-gray-800 hover:border-teal-500/50 rounded-2xl p-6 sm:p-8 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div className="flex items-start sm:items-center gap-4 flex-1">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center border-2 border-teal-400/30">
                        <Scissors className="w-8 h-8 text-teal-400" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                        {booking.service}
                      </h3>

                      <div className="space-y-2 text-sm text-gray-400">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-teal-400" />
                          <span>{booking.shopName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-teal-400" />
                          <span>{booking.shopLocation}</span>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-teal-400" />
                            <span>{booking.date}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-teal-400" />
                            <span>{booking.time.startTime} - {booking.time.endTime}</span>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-col-reverse items-start sm:items-end gap-3">
                    <div
                      className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold capitalize ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </div>

                    <span className="text-lg sm:text-2xl font-bold text-teal-400">
                      {booking.price}
                    </span>

                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        onClick={() => handleViewDetails(booking)}
                        className="flex-1 sm:flex-none bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 border border-teal-500/50 text-sm px-3 py-2 rounded-lg"
                      >
                        Details
                      </Button>
                      {booking.status !== "cancelled" &&
                        booking.status !== "completed" && (
                          <Button
                            onClick={() => handleReschedule(booking.id)}
                            disabled={actionLoading}
                            className="flex-1 sm:flex-none bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50 text-sm px-3 py-2 rounded-lg disabled:opacity-50"
                          >
                            Reschedule
                          </Button>
                        )}
                      {booking.status !== "cancelled" && (
                        <Button
                          onClick={() => handleCancel(booking.id)}
                          disabled={actionLoading}
                          className="flex-1 sm:flex-none bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 text-sm px-3 py-2 rounded-lg disabled:opacity-50"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showDetails && selectedBooking && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6 animate-fadeIn">
            <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black border border-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
              <button
                className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition"
                onClick={handleCloseDetails}
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-3xl font-bold text-white mb-2">
                Booking Details
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                Confirmation #{selectedBooking.id.slice(-8)}
              </p>

              <div className="w-12 h-1 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full mb-6"></div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Scissors className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-400 text-sm">Service</p>
                    <p className="text-white font-semibold">{selectedBooking.service}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-400 text-sm">Shop</p>
                    <p className="text-white font-semibold">{selectedBooking.shopName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-400 text-sm">Location</p>
                    <p className="text-white font-semibold">{selectedBooking.shopLocation}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-400 text-sm">Date</p>
                    <p className="text-white font-semibold">{selectedBooking.date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-400 text-sm">Time</p>
                    <p className="text-white font-semibold">{selectedBooking.time}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <p className="text-gray-400 text-sm">Total Amount</p>
                  <p className="text-2xl font-bold text-teal-400">{selectedBooking.price}</p>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <p className="text-gray-400 text-sm">Status</p>
                  <p
                    className={`text-sm font-semibold capitalize ${
                      selectedBooking.status === "confirmed"
                        ? "text-green-400"
                        : selectedBooking.status === "completed"
                        ? "text-blue-400"
                        : selectedBooking.status === "cancelled"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {selectedBooking.status}
                  </p>
                </div>

                {selectedBooking.isReviewed && (
                  <div className="pt-4 border-t border-gray-800">
                    <p className="text-gray-400 text-sm">Your Review</p>
                    <p className="text-yellow-400 text-sm mb-1">
                      ⭐ {selectedBooking.rating}/5
                    </p>
                    <p className="text-white text-sm">{selectedBooking.review}</p>
                  </div>
                )}
              </div>

              <div
                className={`p-3 rounded-lg flex items-start gap-2 mb-6 ${
                  selectedBooking.status === "confirmed"
                    ? "bg-green-500/10 border border-green-500/30"
                    : selectedBooking.status === "completed"
                    ? "bg-blue-500/10 border border-blue-500/30"
                    : selectedBooking.status === "cancelled"
                    ? "bg-red-500/10 border border-red-500/30"
                    : "bg-yellow-500/10 border border-yellow-500/30"
                }`}
              >
                <AlertCircle
                  className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    selectedBooking.status === "confirmed"
                      ? "text-green-400"
                      : selectedBooking.status === "completed"
                      ? "text-blue-400"
                      : selectedBooking.status === "cancelled"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                />
                <p
                  className={`text-sm ${
                    selectedBooking.status === "confirmed"
                      ? "text-green-300"
                      : selectedBooking.status === "completed"
                      ? "text-blue-300"
                      : selectedBooking.status === "cancelled"
                      ? "text-red-300"
                      : "text-yellow-300"
                  }`}
                >
                  {selectedBooking.status === "confirmed" &&
                    "Your booking is confirmed! Please arrive 5 minutes early."}
                  {selectedBooking.status === "completed" && "Thank you for using our service!"}
                  {selectedBooking.status === "cancelled" && "This booking has been cancelled."}
                  {selectedBooking.status === "pending" && "Your booking is pending confirmation."}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {selectedBooking.status === "completed" && !selectedBooking.isReviewed && (
                  <Button
                    onClick={() => handleAddReview(selectedBooking.id)}
                    disabled={actionLoading}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
                  >
                    Add Review
                  </Button>
                )}

                {selectedBooking.status !== "cancelled" &&
                  selectedBooking.status !== "completed" && (
                    <>
                      <Button
                        onClick={() => handleReschedule(selectedBooking.id)}
                        disabled={actionLoading}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
                      >
                        Reschedule Booking
                      </Button>
                      <Button
                        onClick={() => handleCancel(selectedBooking.id)}
                        disabled={actionLoading}
                        className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 font-semibold py-2 rounded-lg transition disabled:opacity-50"
                      >
                        Cancel Booking
                      </Button>
                    </>
                  )}

                <Button
                  onClick={handleCloseDetails}
                  variant="outline"
                  className="w-full bg-gray-800/50 hover:bg-gray-800 text-gray-300 font-semibold py-2 rounded-lg transition"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { Calendar, Clock, User, Scissors, X, ArrowLeft, MapPin, AlertCircle } from "lucide-react";
// import { Button } from "@/components/ui/button";

// // Example bookings data
// const bookings = [
//   {
//     id: 1,
//     barber: "Devanshu Sharma",
//     date: "2024-06-15",
//     time: "10:00 AM",
//     service: "Haircut",
//     price: "₹50",
//     status: "Confirmed",
//     location: "Downtown Salon",
//     image: "https://via.placeholder.com/50",
//   },
//   {
//     id: 2,
//     barber: "Vinayak Singh",
//     date: "2024-06-18",
//     time: "2:30 PM",
//     service: "Shave",
//     price: "₹30",
//     status: "Pending",
//     location: "Main Street Barber",
//     image: "https://via.placeholder.com/50",
//   },
// ];

// export default function MyBookingsPage() {
//   const router = useRouter();
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [showDetails, setShowDetails] = useState(false);

//   const handleViewDetails = (booking) => {
//     setSelectedBooking(booking);
//     setShowDetails(true);
//   };

//   const handleCloseDetails = () => {
//     setShowDetails(false);
//     setSelectedBooking(null);
//   };

//   const handleCancel = (id) => {
//     alert(`Booking #${id} cancelled!`);
//     handleCloseDetails();
//   };

//   const handleReschedule = (id) => {
//     alert(`Booking #${id} reschedule requested!`);
//     handleCloseDetails();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white py-12 px-4 sm:px-6 lg:px-8">
//       <div className="w-full max-w-5xl mx-auto">
//         {/* 🔹 Header */}
//         <div className="flex items-center justify-between mb-12">
//           <div className="flex items-center space-x-4">
//             <Button
//               onClick={() => router.push("/")}
//               variant="ghost"
//               size="sm"
//               className="text-gray-400 hover:text-teal-400 hover:bg-gray-800/50"
//             >
//               <ArrowLeft className="w-5 h-5" />
//             </Button>
//             <h1 className="text-4xl sm:text-5xl font-bold text-white">My Bookings</h1>
//           </div>
//         </div>

//         {/* 🔹 Empty State */}
//         {bookings.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-20">
//             <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mb-4">
//               <Scissors className="w-8 h-8 text-teal-400" />
//             </div>
//             <p className="text-gray-400 text-lg">You have no bookings yet.</p>
//             <Button onClick={() => router.push("/services")} className="mt-4 bg-teal-500 hover:bg-teal-600">
//               Book an Appointment
//             </Button>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {/* 🔹 Bookings List */}
//             {bookings.map((booking) => (
//               <div
//                 key={booking.id}
//                 className="bg-gray-900/50 backdrop-blur-md border border-gray-800 hover:border-teal-500/50 rounded-2xl p-6 sm:p-8 transition-all duration-300 shadow-lg hover:shadow-xl"
//               >
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
//                   {/* 🔹 Left: Booking Info */}
//                   <div className="flex items-start sm:items-center gap-4 flex-1">
//                     {/* Avatar */}
//                     <div className="relative">
//                       <img
//                         src={booking.image}
//                         alt={booking.barber}
//                         className="w-16 h-16 rounded-full object-cover border-2 border-teal-400/30"
//                       />
//                       <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
//                         <Scissors className="w-3 h-3 text-white" />
//                       </div>
//                     </div>

//                     {/* Details */}
//                     <div className="flex-1">
//                       <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{booking.service}</h3>
                      
//                       <div className="space-y-2 text-sm text-gray-400">
//                         <div className="flex items-center space-x-2">
//                           <User className="w-4 h-4 text-teal-400" />
//                           <span>{booking.barber}</span>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <MapPin className="w-4 h-4 text-teal-400" />
//                           <span>{booking.location}</span>
//                         </div>
//                         <div className="flex flex-wrap gap-4 mt-2">
//                           <div className="flex items-center space-x-2">
//                             <Calendar className="w-4 h-4 text-teal-400" />
//                             <span>{booking.date}</span>
//                           </div>
//                           <div className="flex items-center space-x-2">
//                             <Clock className="w-4 h-4 text-teal-400" />
//                             <span>{booking.time}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* 🔹 Right: Status & Actions */}
//                   <div className="flex flex-col sm:flex-col-reverse items-start sm:items-end gap-3">
//                     {/* Status Badge */}
//                     <div
//                       className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold ${
//                         booking.status === "Confirmed"
//                           ? "bg-green-500/20 text-green-400 border border-green-500/50"
//                           : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
//                       }`}
//                     >
//                       {booking.status}
//                     </div>

//                     {/* Price */}
//                     <span className="text-lg sm:text-2xl font-bold text-teal-400">{booking.price}</span>

//                     {/* Action Buttons */}
//                     <div className="flex gap-2 w-full sm:w-auto">
//                       <Button
//                         onClick={() => handleViewDetails(booking)}
//                         className="flex-1 sm:flex-none bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 border border-teal-500/50 text-sm px-3 py-2 rounded-lg"
//                       >
//                         Details
//                       </Button>
//                       <Button
//                         onClick={() => handleReschedule(booking.id)}
//                         variant="outline"
//                         className="flex-1 sm:flex-none bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50 text-sm px-3 py-2 rounded-lg"
//                       >
//                         Reschedule
//                       </Button>
//                       <Button
//                         onClick={() => handleCancel(booking.id)}
//                         className="flex-1 sm:flex-none bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 text-sm px-3 py-2 rounded-lg"
//                       >
//                         Cancel
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* 🔹 Booking Details Modal */}
//         {showDetails && selectedBooking && (
//           <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6 animate-fadeIn">
//             <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black border border-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
//               {/* Close Button */}
//               <button
//                 className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition"
//                 onClick={handleCloseDetails}
//               >
//                 <X className="w-5 h-5" />
//               </button>

//               {/* Header */}
//               <h2 className="text-3xl font-bold text-white mb-2">Booking Details</h2>
//               <p className="text-gray-400 text-sm mb-6">Confirmation #{selectedBooking.id}</p>

//               {/* Divider */}
//               <div className="w-12 h-1 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full mb-6"></div>

//               {/* Details */}
//               <div className="space-y-4 mb-8">
//                 {/* Service */}
//                 <div className="flex items-start gap-3">
//                   <Scissors className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
//                   <div>
//                     <p className="text-gray-400 text-sm">Service</p>
//                     <p className="text-white font-semibold">{selectedBooking.service}</p>
//                   </div>
//                 </div>

//                 {/* Barber */}
//                 <div className="flex items-start gap-3">
//                   <User className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
//                   <div>
//                     <p className="text-gray-400 text-sm">Barber</p>
//                     <p className="text-white font-semibold">{selectedBooking.barber}</p>
//                   </div>
//                 </div>

//                 {/* Location */}
//                 <div className="flex items-start gap-3">
//                   <MapPin className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
//                   <div>
//                     <p className="text-gray-400 text-sm">Location</p>
//                     <p className="text-white font-semibold">{selectedBooking.location}</p>
//                   </div>
//                 </div>

//                 {/* Date */}
//                 <div className="flex items-start gap-3">
//                   <Calendar className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
//                   <div>
//                     <p className="text-gray-400 text-sm">Date</p>
//                     <p className="text-white font-semibold">{selectedBooking.date}</p>
//                   </div>
//                 </div>

//                 {/* Time */}
//                 <div className="flex items-start gap-3">
//                   <Clock className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
//                   <div>
//                     <p className="text-gray-400 text-sm">Time</p>
//                     <p className="text-white font-semibold">{selectedBooking.time}</p>
//                   </div>
//                 </div>

//                 {/* Price */}
//                 <div className="pt-4 border-t border-gray-800">
//                   <p className="text-gray-400 text-sm">Total Amount</p>
//                   <p className="text-2xl font-bold text-teal-400">{selectedBooking.price}</p>
//                 </div>
//               </div>

//               {/* Status Alert */}
//               <div
//                 className={`p-3 rounded-lg flex items-start gap-2 mb-6 ${
//                   selectedBooking.status === "Confirmed"
//                     ? "bg-green-500/10 border border-green-500/30"
//                     : "bg-yellow-500/10 border border-yellow-500/30"
//                 }`}
//               >
//                 <AlertCircle
//                   className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
//                     selectedBooking.status === "Confirmed" ? "text-green-400" : "text-yellow-400"
//                   }`}
//                 />
//                 <p
//                   className={`text-sm ${
//                     selectedBooking.status === "Confirmed"
//                       ? "text-green-300"
//                       : "text-yellow-300"
//                   }`}
//                 >
//                   {selectedBooking.status === "Confirmed"
//                     ? "Your booking is confirmed! Please arrive 5 minutes early."
//                     : "Your booking is pending confirmation."}
//                 </p>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex flex-col gap-3">
//                 <Button
//                   onClick={() => handleReschedule(selectedBooking.id)}
//                   className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
//                 >
//                   Reschedule Booking
//                 </Button>
//                 <Button
//                   onClick={() => handleCancel(selectedBooking.id)}
//                   className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 font-semibold py-2 rounded-lg transition"
//                 >
//                   Cancel Booking
//                 </Button>
//                 <Button
//                   onClick={handleCloseDetails}
//                   variant="outline"
//                   className="w-full bg-gray-800/50 hover:bg-gray-800 text-gray-300 font-semibold py-2 rounded-lg transition"
//                 >
//                   Close
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         @keyframes fadeIn {
//           0% {
//             opacity: 0;
//             transform: scale(0.95);
//           }
//           100% {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }

//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-out forwards;
//         }
//       `}</style>
//     </div>
//   );
// }