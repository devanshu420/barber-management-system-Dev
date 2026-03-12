"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
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
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { io } from "socket.io-client";

axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_API_URL}`;

let socket;

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [cancelReason, setCancelReason] = useState("");
  const [cancelError, setCancelError] = useState("");

  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleStart, setRescheduleStart] = useState("");
  const [rescheduleEnd, setRescheduleEnd] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [rescheduleError, setRescheduleError] = useState("");

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewError, setReviewError] = useState("");

  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
          router.push("/auth/login");
          return;
        }

        const response = await axios.get("/api/bookings/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const { success, data } = response.data;

        if (!success) {
          setError("Failed to load bookings");
          setLoading(false);
          return;
        }

        const bookingLength = data.length;
        localStorage.setItem("userBookings", bookingLength.toString());

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

        if (!socket) {
          socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
            transports: ["websocket"],
          });

          socket.on("connect", () => {
            socket.emit("joinUserRoom", userId);
            console.log("🔌 MyBookings socket connected, joined:", userId);
          });

          socket.on("bookingUpdate", (payload) => {
            console.log("🔔 bookingUpdate (bookings page):", payload);
            const {
              bookingId,
              type,
              newDate,
              newTime,
              rating,
              review,
              message,
            } = payload;

            setBookings((prev) =>
              prev.map((b) => {
                if (b.id !== bookingId) return b;

                if (type === "cancelled") {
                  return { ...b, status: "cancelled" };
                }
                if (type === "rescheduled") {
                  return {
                    ...b,
                    date: new Date(newDate).toLocaleDateString("en-GB"),
                    time: newTime,
                  };
                }
                if (type === "review") {
                  return { ...b, isReviewed: true, rating, review };
                }
                return b;
              }),
            );
            window.dispatchEvent(
              new CustomEvent("bb-booking-update", { detail: payload }),
            );
            if (message) showToast(message, "info");
          });
        }
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

    return () => {
      if (socket) {
        socket.disconnect();
        socket = undefined;
      }
    };
  }, [router]);

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking.bookingData);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedBooking(null);
  };

  const openCancelModal = (booking) => {
    setSelectedBooking(booking.bookingData || booking);
    setCancelReason("");
    setCancelError("");
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    if (actionLoading) return;
    setShowCancelModal(false);
    setCancelReason("");
    setCancelError("");
  };

  const submitCancel = async () => {
    if (!cancelReason.trim()) {
      setCancelError("Cancellation reason is required");
      return;
    }
    setCancelError("");
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/api/bookings/${selectedBooking._id || selectedBooking.id}/cancel`,
        { cancellationReason: cancelReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        const bookingId = selectedBooking._id || selectedBooking.id;
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId ? { ...b, status: "cancelled" } : b,
          ),
        );
        showToast("Booking cancelled successfully", "success");
        closeCancelModal();
        setShowDetails(false);
      } else {
        setCancelError(response.data.message || "Failed to cancel booking");
      }
    } catch (err) {
      console.error("Cancel error:", err);
      setCancelError("Failed to cancel booking");
    } finally {
      setActionLoading(false);
    }
  };

  const openRescheduleModal = (booking) => {
    setSelectedBooking(booking.bookingData || booking);
    setRescheduleDate("");
    setRescheduleStart("");
    setRescheduleEnd("");
    setRescheduleReason("");
    setRescheduleError("");
    setShowRescheduleModal(true);
  };

  const closeRescheduleModal = () => {
    if (actionLoading) return;
    setShowRescheduleModal(false);
    setRescheduleDate("");
    setRescheduleStart("");
    setRescheduleEnd("");
    setRescheduleReason("");
    setRescheduleError("");
  };

  const submitReschedule = async () => {
    if (!rescheduleDate) {
      setRescheduleError("Please select a date");
      return;
    }
    if (!rescheduleStart || !rescheduleEnd) {
      setRescheduleError("Please select both start and end time");
      return;
    }

    setRescheduleError("");
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `/api/bookings/${selectedBooking._id || selectedBooking.id}/reschedule`,
        {
          newDate: rescheduleDate,
          newTime: {
            startTime: rescheduleStart,
            endTime: rescheduleEnd,
          },
          reason: rescheduleReason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        const updated = response.data.data;
        const bookingId = updated._id;

        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId
              ? {
                  ...b,
                  date: new Date(updated.bookingDate).toLocaleDateString(
                    "en-GB",
                  ),
                  time: updated.bookingTime,
                }
              : b,
          ),
        );

        showToast("Booking rescheduled successfully", "success");
        closeRescheduleModal();
        setShowDetails(false);
      } else {
        setRescheduleError(
          response.data.message || "Failed to reschedule booking",
        );
      }
    } catch (err) {
      console.error("Reschedule error:", err);
      setRescheduleError("Failed to reschedule booking");
    } finally {
      setActionLoading(false);
    }
  };

  const openReviewModal = (booking) => {
    setSelectedBooking(booking.bookingData || booking);
    setReviewRating(5);
    setReviewText("");
    setReviewError("");
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    if (actionLoading) return;
    setShowReviewModal(false);
    setReviewRating(5);
    setReviewText("");
    setReviewError("");
  };

  const submitReview = async () => {
    if (!reviewRating || reviewRating < 1 || reviewRating > 5) {
      setReviewError("Rating must be between 1 and 5");
      return;
    }
    if (!reviewText.trim()) {
      setReviewError("Please write a short review");
      return;
    }

    setReviewError("");
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/api/bookings/${selectedBooking._id || selectedBooking.id}/review`,
        {
          rating: reviewRating,
          review: reviewText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        const bookingId = selectedBooking._id || selectedBooking.id;
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId
              ? {
                  ...b,
                  isReviewed: true,
                  rating: reviewRating,
                  review: reviewText,
                }
              : b,
          ),
        );

        showToast("Review added successfully", "success");
        closeReviewModal();
        setShowDetails(false);
      } else {
        setReviewError(response.data.message || "Failed to add review");
      }
    } catch (err) {
      console.error("Review error:", err);
      setReviewError("Failed to add review");
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

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        if (showCancelModal) closeCancelModal();
        if (showRescheduleModal) closeRescheduleModal();
        if (showReviewModal) closeReviewModal();
        if (showDetails) handleCloseDetails();
      }
    },
    [showCancelModal, showRescheduleModal, showReviewModal, showDetails],
  );

  useEffect(() => {
    if (
      showCancelModal ||
      showRescheduleModal ||
      showReviewModal ||
      showDetails
    ) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    showCancelModal,
    showRescheduleModal,
    showReviewModal,
    showDetails,
    handleKeyDown,
  ]);

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
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
              toast.type === "success"
                ? "bg-emerald-500/90 text-white"
                : toast.type === "info"
                  ? "bg-blue-500/90 text-white"
                  : "bg-red-500/90 text-white"
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl mx-auto">
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

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

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
                            <span>
                              {booking.time.startTime} - {booking.time.endTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-col-reverse items-start sm:items-end gap-3">
                    <div
                      className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold capitalize ${getStatusColor(
                        booking.status,
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

                      {(booking.status === "pending" ||
                        booking.status === "confirmed") && (
                        <Button
                          onClick={() => openRescheduleModal(booking)}
                          disabled={actionLoading}
                          className="flex-1 sm:flex-none bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50 text-sm px-3 py-2 rounded-lg disabled:opacity-50"
                        >
                          Reschedule
                        </Button>
                      )}

                      {booking.status === "pending" && (
                        <Button
                          onClick={() => openCancelModal(booking)}
                          disabled={actionLoading}
                          className="flex-1 sm:flex-none bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 text-sm px-3 py-2 rounded-lg disabled:opacity-50"
                        >
                          Cancel
                        </Button>
                      )}

                      {booking.status === "completed" &&
                        !booking.isReviewed && (
                          <Button
                            onClick={() => openReviewModal(booking)}
                            disabled={actionLoading}
                            className="flex-1 sm:flex-none bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/50 text-sm px-3 py-2 rounded-lg disabled:opacity-50"
                          >
                            Add Review
                          </Button>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Details modal */}
        {showDetails && selectedBooking && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-40 px-4 py-6 animate-fadeIn"
            onClick={handleCloseDetails}
          >
            <div
              className="bg-gradient-to-br from-gray-900 via-gray-950 to-black border border-gray-800 rounded-2xl shadow-2xl p-10 max-w-3xl w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
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
                Confirmation #{selectedBooking._id?.toString().slice(-8)}
              </p>

              <div className="w-16 h-1 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full mb-8"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <Scissors className="w-6 h-6 text-teal-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Services</p>

                      <div className="text-white font-semibold space-y-1">
                        {selectedBooking?.services?.length > 0 ? (
                          selectedBooking.services.map((service, index) => (
                            <p key={index}>
                              {service.name}{" "}
                              <span className="text-gray-400">
                                - ₹{service.price}
                              </span>
                            </p>
                          ))
                        ) : (
                          <p className="text-gray-400">No services</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-teal-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Shop</p>
                      <p className="text-white font-semibold">
                        {selectedBooking.shopId?.shopName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-teal-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Location</p>
                      <p className="text-white font-semibold">
                        {selectedBooking.shopId?.location?.address}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-teal-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Date</p>
                      <p className="text-white font-semibold">
                        {new Date(
                          selectedBooking.bookingDate,
                        ).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-teal-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Time</p>
                      <p className="text-white font-semibold">
                        {selectedBooking.bookingTime.startTime} –{" "}
                        {selectedBooking.bookingTime.endTime}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-800 pt-4">
                    <p className="text-gray-400 text-sm">Total Amount</p>
                    <p className="text-3xl font-bold text-teal-400">
                      ₹{selectedBooking.finalAmount || selectedBooking.amount}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`mt-8 p-4 rounded-lg flex items-start gap-3 ${
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
                  className={`w-6 h-6 flex-shrink-0 ${
                    selectedBooking.status === "confirmed"
                      ? "text-green-400"
                      : selectedBooking.status === "completed"
                        ? "text-blue-400"
                        : selectedBooking.status === "cancelled"
                          ? "text-red-400"
                          : "text-yellow-400"
                  }`}
                />
                <p className="text-sm text-gray-300">
                  {selectedBooking.status === "confirmed" &&
                    "Your booking is confirmed! Please arrive 5 minutes early."}
                  {selectedBooking.status === "completed" &&
                    "Thank you for using our service!"}
                  {selectedBooking.status === "cancelled" &&
                    "This booking has been cancelled."}
                  {selectedBooking.status === "pending" &&
                    "Your booking is pending confirmation."}
                </p>
              </div>

              <div className="flex flex-wrap md:flex-nowrap gap-3 mt-6">
                {selectedBooking.status === "completed" &&
                  !selectedBooking.isReviewed && (
                    <Button
                      onClick={() => openReviewModal(selectedBooking)}
                      className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
                    >
                      Add Review
                    </Button>
                  )}

                {(selectedBooking.status === "pending" ||
                  selectedBooking.status === "confirmed") && (
                  <Button
                    onClick={() => openRescheduleModal(selectedBooking)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Reschedule
                  </Button>
                )}

                {selectedBooking.status === "pending" && (
                  <Button
                    onClick={() => openCancelModal(selectedBooking)}
                    className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50"
                  >
                    Cancel
                  </Button>
                )}

                <Button
                  onClick={handleCloseDetails}
                  variant="outline"
                  className="flex-1 bg-gray-800/50 hover:bg-gray-700"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel modal */}
        {showCancelModal && selectedBooking && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={closeCancelModal}
          >
            <div
              className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl w-full max-w-lg p-6 animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Cancel Booking
                </h2>
                <button
                  className="text-gray-400 hover:text-white"
                  onClick={closeCancelModal}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-gray-400 mb-4">
                Please provide a reason for cancelling this booking.
              </p>

              <label className="block text-sm text-gray-300 mb-1">
                Cancellation Reason <span className="text-red-400">*</span>
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 px-3 py-2 focus:outline-none focus:border-red-500"
                placeholder="E.g., Not available at this time..."
              />

              {cancelError && (
                <p className="text-xs text-red-400 mt-2">{cancelError}</p>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeCancelModal}
                  className="bg-gray-800/60 hover:bg-gray-700 text-gray-200"
                  disabled={actionLoading}
                >
                  Close
                </Button>
                <Button
                  type="button"
                  onClick={submitCancel}
                  disabled={actionLoading}
                  className="bg-red-500 hover:bg-red-600 text-white disabled:opacity-60"
                >
                  {actionLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      Cancelling...
                    </span>
                  ) : (
                    "Confirm Cancel"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Reschedule modal */}
        {showRescheduleModal && selectedBooking && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={closeRescheduleModal}
          >
            <div
              className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl w-full max-w-xl p-6 animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Reschedule Booking
                </h2>
                <button
                  className="text-gray-400 hover:text-white"
                  onClick={closeRescheduleModal}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    New Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Start Time <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="time"
                      value={rescheduleStart}
                      onChange={(e) => setRescheduleStart(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 px-3 py-2 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      End Time <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="time"
                      value={rescheduleEnd}
                      onChange={(e) => setRescheduleEnd(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 px-3 py-2 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Reason (optional)
                  </label>
                  <textarea
                    value={rescheduleReason}
                    onChange={(e) => setRescheduleReason(e.target.value)}
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 px-3 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="E.g., Schedule conflict..."
                  />
                </div>

                {rescheduleError && (
                  <p className="text-xs text-red-400">{rescheduleError}</p>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeRescheduleModal}
                  className="bg-gray-800/60 hover:bg-gray-700 text-gray-200"
                  disabled={actionLoading}
                >
                  Close
                </Button>
                <Button
                  type="button"
                  onClick={submitReschedule}
                  disabled={actionLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-60"
                >
                  {actionLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      Rescheduling...
                    </span>
                  ) : (
                    "Confirm Reschedule"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Review modal */}
        {showReviewModal && selectedBooking && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={closeReviewModal}
          >
            <div
              className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl w-full max-w-lg p-6 animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Add Review</h2>
                <button
                  className="text-gray-400 hover:text-white"
                  onClick={closeReviewModal}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-300 mb-1">Rating</p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= reviewRating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-600"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Write your review <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 px-3 py-2 focus:outline-none focus:border-purple-500"
                    placeholder="Share your experience..."
                  />
                </div>

                {reviewError && (
                  <p className="text-xs text-red-400">{reviewError}</p>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeReviewModal}
                  className="bg-gray-800/60 hover:bg-gray-700 text-gray-200"
                  disabled={actionLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={submitReview}
                  disabled={actionLoading}
                  className="bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-60"
                >
                  {actionLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit Review"
                  )}
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
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

// "use client";

// import { useRouter } from "next/navigation";
// import { useState, useEffect, useCallback } from "react";
// import {
//   Calendar,
//   Clock,
//   User,
//   Scissors,
//   X,
//   ArrowLeft,
//   MapPin,
//   AlertCircle,
//   Loader,
//   Star,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import axios from "axios";
// import { io } from "socket.io-client";

// axios.defaults.baseURL = "http://localhost:5000";

// let socket;

// export default function MyBookingsPage() {
//   const router = useRouter();
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [showDetails, setShowDetails] = useState(false);
//   const [actionLoading, setActionLoading] = useState(false);

//   // Modal state
//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [showRescheduleModal, setShowRescheduleModal] = useState(false);
//   const [showReviewModal, setShowReviewModal] = useState(false);

//   // Cancel modal state
//   const [cancelReason, setCancelReason] = useState("");
//   const [cancelError, setCancelError] = useState("");

//   // Reschedule modal state
//   const [rescheduleDate, setRescheduleDate] = useState("");
//   const [rescheduleStart, setRescheduleStart] = useState("");
//   const [rescheduleEnd, setRescheduleEnd] = useState("");
//   const [rescheduleReason, setRescheduleReason] = useState("");
//   const [rescheduleError, setRescheduleError] = useState("");

//   // Review modal state
//   const [reviewRating, setReviewRating] = useState(5);
//   const [reviewText, setReviewText] = useState("");
//   const [reviewError, setReviewError] = useState("");

//   // Simple toast
//   const [toast, setToast] = useState(null);

//   const showToast = (message, type = "success") => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   // Fetch bookings
//   useEffect(() => {
//     const fetchBookings = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const token = localStorage.getItem("token");
//         const userId = localStorage.getItem("userId");

//         if (!token || !userId) {
//           router.push("/auth/login");
//           return;
//         }

//         const response = await axios.get("/api/bookings/user", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           withCredentials: true,
//         });

//         const { success, data } = response.data;

//         if (!success) {
//           setError("Failed to load bookings");
//           setLoading(false);
//           return;
//         }

//         const bookingLength = data.length;
//         localStorage.setItem("userBookings", bookingLength.toString());

//         const transformedBookings = data.map((booking) => ({
//           id: booking._id,
//           shopName: booking.shopId?.shopName || "Unknown Shop",
//           shopLocation:
//             booking.shopId?.location?.address || "Unknown Location",
//           date: new Date(booking.bookingDate).toLocaleDateString("en-GB"),
//           time: booking.bookingTime,
//           service: booking.serviceName,
//           price: `₹${booking.finalAmount || booking.amount}`,
//           status: booking.status,
//           paymentStatus: booking.paymentStatus,
//           rating: booking.rating,
//           review: booking.review,
//           isReviewed: booking.isReviewed,
//           createdAt: booking.createdAt,
//           bookingData: booking,
//         }));

//         setBookings(transformedBookings);

//         // Socket connect + join user room
//         if (!socket) {
//           socket = io("http://localhost:5000", {
//             transports: ["websocket"],
//           });

//           socket.on("connect", () => {
//             // join room by userId
//             socket.emit("join", { userId });
//           });

//           // Real-time listeners
//           socket.on("bookingCancelled", (payload) => {
//             const { bookingId, message } = payload;
//             setBookings((prev) =>
//               prev.map((b) =>
//                 b.id === bookingId ? { ...b, status: "cancelled" } : b
//               )
//             );
//             showToast(message || "Booking cancelled", "info");
//           });

//           socket.on("bookingRescheduled", (payload) => {
//             const { bookingId, newDate, newTime, message } = payload;
//             setBookings((prev) =>
//               prev.map((b) =>
//                 b.id === bookingId
//                   ? {
//                       ...b,
//                       date: new Date(newDate).toLocaleDateString("en-GB"),
//                       time: newTime,
//                     }
//                   : b
//               )
//             );
//             showToast(message || "Booking rescheduled", "info");
//           });

//           socket.on("bookingUpdate", (payload) => {
//             const { bookingId, status, message } = payload;
//             setBookings((prev) =>
//               prev.map((b) =>
//                 b.id === bookingId ? { ...b, status: status || b.status } : b
//               )
//             );
//             if (message) showToast(message, "info");
//           });

//           socket.on("reviewAdded", (payload) => {
//             const { bookingId, rating, review, message } = payload;
//             setBookings((prev) =>
//               prev.map((b) =>
//                 b.id === bookingId
//                   ? { ...b, isReviewed: true, rating, review }
//                   : b
//               )
//             );
//             showToast(message || "Review added", "info");
//           });
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
//     };
//     fetchBookings();

//     return () => {
//       if (socket) {
//         socket.disconnect();
//         socket = undefined;
//       }
//     };
//   }, [router]);

//   const handleViewDetails = (booking) => {
//     setSelectedBooking(booking.bookingData);
//     setShowDetails(true);
//   };

//   const handleCloseDetails = () => {
//     setShowDetails(false);
//     setSelectedBooking(null);
//   };

//   // ===== Cancel Booking Modal Handlers =====
//   const openCancelModal = (booking) => {
//     setSelectedBooking(booking.bookingData || booking);
//     setCancelReason("");
//     setCancelError("");
//     setShowCancelModal(true);
//   };

//   const closeCancelModal = () => {
//     if (actionLoading) return;
//     setShowCancelModal(false);
//     setCancelReason("");
//     setCancelError("");
//   };

//   const submitCancel = async () => {
//     if (!cancelReason.trim()) {
//       setCancelError("Cancellation reason is required");
//       return;
//     }
//     setCancelError("");
//     setActionLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.put(
//         `/api/bookings/${selectedBooking._id || selectedBooking.id}/cancel`,
//         { cancellationReason: cancelReason },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data.success) {
//         const bookingId = selectedBooking._id || selectedBooking.id;
//         setBookings((prev) =>
//           prev.map((b) =>
//             b.id === bookingId ? { ...b, status: "cancelled" } : b
//           )
//         );
//         showToast("Booking cancelled successfully", "success");
//         closeCancelModal();
//         setShowDetails(false);
//       } else {
//         setCancelError(response.data.message || "Failed to cancel booking");
//       }
//     } catch (err) {
//       console.error("Cancel error:", err);
//       setCancelError("Failed to cancel booking");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // ===== Reschedule Booking Modal Handlers =====
//   const openRescheduleModal = (booking) => {
//     setSelectedBooking(booking.bookingData || booking);
//     setRescheduleDate("");
//     setRescheduleStart("");
//     setRescheduleEnd("");
//     setRescheduleReason("");
//     setRescheduleError("");
//     setShowRescheduleModal(true);
//   };

//   const closeRescheduleModal = () => {
//     if (actionLoading) return;
//     setShowRescheduleModal(false);
//     setRescheduleDate("");
//     setRescheduleStart("");
//     setRescheduleEnd("");
//     setRescheduleReason("");
//     setRescheduleError("");
//   };

//   const submitReschedule = async () => {
//     if (!rescheduleDate) {
//       setRescheduleError("Please select a date");
//       return;
//     }
//     if (!rescheduleStart || !rescheduleEnd) {
//       setRescheduleError("Please select both start and end time");
//       return;
//     }

//     setRescheduleError("");
//     setActionLoading(true);
//     try {
//       const token = localStorage.getItem("token");

//       const response = await axios.put(
//         `/api/bookings/${selectedBooking._id || selectedBooking.id}/reschedule`,
//         {
//           newDate: rescheduleDate,
//           newTime: {
//             startTime: rescheduleStart,
//             endTime: rescheduleEnd,
//           },
//           reason: rescheduleReason,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data.success) {
//         const updated = response.data.data;
//         const bookingId = updated._id;

//         setBookings((prev) =>
//           prev.map((b) =>
//             b.id === bookingId
//               ? {
//                   ...b,
//                   date: new Date(updated.bookingDate).toLocaleDateString(
//                     "en-GB"
//                   ),
//                   time: updated.bookingTime,
//                 }
//               : b
//           )
//         );

//         showToast("Booking rescheduled successfully", "success");
//         closeRescheduleModal();
//         setShowDetails(false);
//       } else {
//         setRescheduleError(
//           response.data.message || "Failed to reschedule booking"
//         );
//       }
//     } catch (err) {
//       console.error("Reschedule error:", err);
//       setRescheduleError("Failed to reschedule booking");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // ===== Review Modal Handlers =====
//   const openReviewModal = (booking) => {
//     setSelectedBooking(booking.bookingData || booking);
//     setReviewRating(5);
//     setReviewText("");
//     setReviewError("");
//     setShowReviewModal(true);
//   };

//   const closeReviewModal = () => {
//     if (actionLoading) return;
//     setShowReviewModal(false);
//     setReviewRating(5);
//     setReviewText("");
//     setReviewError("");
//   };

//   const submitReview = async () => {
//     if (!reviewRating || reviewRating < 1 || reviewRating > 5) {
//       setReviewError("Rating must be between 1 and 5");
//       return;
//     }
//     if (!reviewText.trim()) {
//       setReviewError("Please write a short review");
//       return;
//     }

//     setReviewError("");
//     setActionLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.put(
//         `/api/bookings/${selectedBooking._id || selectedBooking.id}/review`,
//         {
//           rating: reviewRating,
//           review: reviewText,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data.success) {
//         const bookingId = selectedBooking._id || selectedBooking.id;
//         setBookings((prev) =>
//           prev.map((b) =>
//             b.id === bookingId
//               ? {
//                   ...b,
//                   isReviewed: true,
//                   rating: reviewRating,
//                   review: reviewText,
//                 }
//               : b
//           )
//         );

//         showToast("Review added successfully", "success");
//         closeReviewModal();
//         setShowDetails(false);
//       } else {
//         setReviewError(response.data.message || "Failed to add review");
//       }
//     } catch (err) {
//       console.error("Review error:", err);
//       setReviewError("Failed to add review");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "confirmed":
//         return "bg-green-500/20 text-green-400 border border-green-500/50";
//       case "completed":
//         return "bg-blue-500/20 text-blue-400 border border-blue-500/50";
//       case "cancelled":
//         return "bg-red-500/20 text-red-400 border border-red-500/50";
//       case "pending":
//         return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50";
//       default:
//         return "bg-gray-500/20 text-gray-400 border border-gray-500/50";
//     }
//   };

//   const handleKeyDown = useCallback(
//     (e) => {
//       if (e.key === "Escape") {
//         if (showCancelModal) closeCancelModal();
//         if (showRescheduleModal) closeRescheduleModal();
//         if (showReviewModal) closeReviewModal();
//         if (showDetails) handleCloseDetails();
//       }
//     },
//     [
//       showCancelModal,
//       showRescheduleModal,
//       showReviewModal,
//       showDetails,
//       closeCancelModal,
//       closeRescheduleModal,
//       closeReviewModal,
//     ]
//   );

//   useEffect(() => {
//     if (
//       showCancelModal ||
//       showRescheduleModal ||
//       showReviewModal ||
//       showDetails
//     ) {
//       window.addEventListener("keydown", handleKeyDown);
//     } else {
//       window.removeEventListener("keydown", handleKeyDown);
//     }

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [
//     showCancelModal,
//     showRescheduleModal,
//     showReviewModal,
//     showDetails,
//     handleKeyDown,
//   ]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <Loader className="w-8 h-8 animate-spin text-teal-400" />
//           <p className="text-gray-400">Loading your bookings...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white py-12 px-4 sm:px-6 lg:px-8">
//       {/* Toast */}
//       {toast && (
//         <div className="fixed top-4 right-4 z-50">
//           <div
//             className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
//               toast.type === "success"
//                 ? "bg-emerald-500/90 text-white"
//                 : toast.type === "info"
//                 ? "bg-blue-500/90 text-white"
//                 : "bg-red-500/90 text-white"
//             }`}
//           >
//             <AlertCircle className="w-4 h-4" />
//             <span className="text-sm">{toast.message}</span>
//           </div>
//         </div>
//       )}

//       <div className="w-full max-w-5xl mx-auto">
//         {/* Header */}
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
//             <h1 className="text-4xl sm:text-5xl font-bold text-white">
//               My Bookings
//             </h1>
//           </div>
//         </div>

//         {/* Error */}
//         {error && (
//           <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
//             <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
//             <p className="text-red-300 text-sm">{error}</p>
//           </div>
//         )}

//         {/* Empty */}
//         {bookings.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-20">
//             <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mb-4">
//               <Scissors className="w-8 h-8 text-teal-400" />
//             </div>
//             <p className="text-gray-400 text-lg">You have no bookings yet.</p>
//             <Button
//               onClick={() => router.push("/")}
//               className="mt-4 bg-teal-500 hover:bg-teal-600"
//             >
//               Book an Appointment
//             </Button>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {bookings.map((booking) => (
//               <div
//                 key={booking.id}
//                 className="bg-gray-900/50 backdrop-blur-md border border-gray-800 hover:border-teal-500/50 rounded-2xl p-6 sm:p-8 transition-all duration-300 shadow-lg hover:shadow-xl"
//               >
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
//                   <div className="flex items-start sm:items-center gap-4 flex-1">
//                     <div className="relative">
//                       <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center border-2 border-teal-400/30">
//                         <Scissors className="w-8 h-8 text-teal-400" />
//                       </div>
//                     </div>

//                     <div className="flex-1">
//                       <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
//                         {booking.service}
//                       </h3>

//                       <div className="space-y-2 text-sm text-gray-400">
//                         <div className="flex items-center space-x-2">
//                           <MapPin className="w-4 h-4 text-teal-400" />
//                           <span>{booking.shopName}</span>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <User className="w-4 h-4 text-teal-400" />
//                           <span>{booking.shopLocation}</span>
//                         </div>
//                         <div className="flex flex-wrap gap-4 mt-2">
//                           <div className="flex items-center space-x-2">
//                             <Calendar className="w-4 h-4 text-teal-400" />
//                             <span>{booking.date}</span>
//                           </div>
//                           <div className="flex items-center space-x-2">
//                             <Clock className="w-4 h-4 text-teal-400" />
//                             <span>
//                               {booking.time.startTime} -{" "}
//                               {booking.time.endTime}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex flex-col sm:flex-col-reverse items-start sm:items-end gap-3">
//                     <div
//                       className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold capitalize ${getStatusColor(
//                         booking.status
//                       )}`}
//                     >
//                       {booking.status}
//                     </div>

//                     <span className="text-lg sm:text-2xl font-bold text-teal-400">
//                       {booking.price}
//                     </span>

//                     <div className="flex gap-2 w-full sm:w-auto">
//                       <Button
//                         onClick={() => handleViewDetails(booking)}
//                         className="flex-1 sm:flex-none bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 border border-teal-500/50 text-sm px-3 py-2 rounded-lg"
//                       >
//                         Details
//                       </Button>

//                       {(booking.status === "pending" ||
//                         booking.status === "confirmed") && (
//                         <Button
//                           onClick={() => openRescheduleModal(booking)}
//                           disabled={actionLoading}
//                           className="flex-1 sm:flex-none bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50 text-sm px-3 py-2 rounded-lg disabled:opacity-50"
//                         >
//                           Reschedule
//                         </Button>
//                       )}

//                       {booking.status === "pending" && (
//                         <Button
//                           onClick={() => openCancelModal(booking)}
//                           disabled={actionLoading}
//                           className="flex-1 sm:flex-none bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 text-sm px-3 py-2 rounded-lg disabled:opacity-50"
//                         >
//                           Cancel
//                         </Button>
//                       )}

//                       {booking.status === "completed" &&
//                         !booking.isReviewed && (
//                           <Button
//                             onClick={() => openReviewModal(booking)}
//                             disabled={actionLoading}
//                             className="flex-1 sm:flex-none bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/50 text-sm px-3 py-2 rounded-lg disabled:opacity-50"
//                           >
//                             Add Review
//                           </Button>
//                         )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Details Modal (existing) */}
//         {showDetails && selectedBooking && (
//           <div
//             className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-40 px-4 py-6 animate-fadeIn"
//             onClick={handleCloseDetails}
//           >
//             <div
//               className="bg-gradient-to-br from-gray-900 via-gray-950 to-black border border-gray-800 rounded-2xl shadow-2xl p-10 max-w-3xl w-full relative"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <button
//                 className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition"
//                 onClick={handleCloseDetails}
//               >
//                 <X className="w-5 h-5" />
//               </button>

//               <h2 className="text-3xl font-bold text-white mb-2">
//                 Booking Details
//               </h2>
//               <p className="text-gray-400 text-sm mb-6">
//                 Confirmation #
//                 {selectedBooking._id?.toString().slice(-8)}
//               </p>

//               <div className="w-16 h-1 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full mb-8"></div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <div className="space-y-5">
//                   <div className="flex items-center gap-3">
//                     <Scissors className="w-6 h-6 text-teal-400" />
//                     <div>
//                       <p className="text-gray-400 text-sm">Service</p>
//                       <p className="text-white font-semibold">
//                         {selectedBooking.serviceName}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <MapPin className="w-6 h-6 text-teal-400" />
//                     <div>
//                       <p className="text-gray-400 text-sm">Shop</p>
//                       <p className="text-white font-semibold">
//                         {selectedBooking.shopId?.shopName}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <MapPin className="w-6 h-6 text-teal-400" />
//                     <div>
//                       <p className="text-gray-400 text-sm">Location</p>
//                       <p className="text-white font-semibold">
//                         {selectedBooking.shopId?.location?.address}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-5">
//                   <div className="flex items-center gap-3">
//                     <Calendar className="w-6 h-6 text-teal-400" />
//                     <div>
//                       <p className="text-gray-400 text-sm">Date</p>
//                       <p className="text-white font-semibold">
//                         {new Date(
//                           selectedBooking.bookingDate
//                         ).toLocaleDateString("en-GB")}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <Clock className="w-6 h-6 text-teal-400" />
//                     <div>
//                       <p className="text-gray-400 text-sm">Time</p>
//                       <p className="text-white font-semibold">
//                         {selectedBooking.bookingTime.startTime} –{" "}
//                         {selectedBooking.bookingTime.endTime}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="border-t border-gray-800 pt-4">
//                     <p className="text-gray-400 text-sm">Total Amount</p>
//                     <p className="text-3xl font-bold text-teal-400">
//                       ₹
//                       {selectedBooking.finalAmount ||
//                         selectedBooking.amount}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div
//                 className={`mt-8 p-4 rounded-lg flex items-start gap-3 ${
//                   selectedBooking.status === "confirmed"
//                     ? "bg-green-500/10 border border-green-500/30"
//                     : selectedBooking.status === "completed"
//                     ? "bg-blue-500/10 border border-blue-500/30"
//                     : selectedBooking.status === "cancelled"
//                     ? "bg-red-500/10 border border-red-500/30"
//                     : "bg-yellow-500/10 border border-yellow-500/30"
//                 }`}
//               >
//                 <AlertCircle
//                   className={`w-6 h-6 flex-shrink-0 ${
//                     selectedBooking.status === "confirmed"
//                       ? "text-green-400"
//                       : selectedBooking.status === "completed"
//                       ? "text-blue-400"
//                       : selectedBooking.status === "cancelled"
//                       ? "text-red-400"
//                       : "text-yellow-400"
//                   }`}
//                 />
//                 <p className="text-sm text-gray-300">
//                   {selectedBooking.status === "confirmed" &&
//                     "Your booking is confirmed! Please arrive 5 minutes early."}
//                   {selectedBooking.status === "completed" &&
//                     "Thank you for using our service!"}
//                   {selectedBooking.status === "cancelled" &&
//                     "This booking has been cancelled."}
//                   {selectedBooking.status === "pending" &&
//                     "Your booking is pending confirmation."}
//                 </p>
//               </div>

//               <div className="flex flex-wrap md:flex-nowrap gap-3 mt-6">
//                 {selectedBooking.status === "completed" &&
//                   !selectedBooking.isReviewed && (
//                     <Button
//                       onClick={() => openReviewModal(selectedBooking)}
//                       className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
//                     >
//                       Add Review
//                     </Button>
//                   )}

//                 {(selectedBooking.status === "pending" ||
//                   selectedBooking.status === "confirmed") && (
//                   <Button
//                     onClick={() => openRescheduleModal(selectedBooking)}
//                     className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
//                   >
//                     Reschedule
//                   </Button>
//                 )}

//                 {selectedBooking.status === "pending" && (
//                   <Button
//                     onClick={() => openCancelModal(selectedBooking)}
//                     className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50"
//                   >
//                     Cancel
//                   </Button>
//                 )}

//                 <Button
//                   onClick={handleCloseDetails}
//                   variant="outline"
//                   className="flex-1 bg-gray-800/50 hover:bg-gray-700"
//                 >
//                   Close
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Cancel Modal */}
//         {showCancelModal && selectedBooking && (
//           <div
//             className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4"
//             onClick={closeCancelModal}
//           >
//             <div
//               className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl w-full max-w-lg p-6 animate-fadeIn"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-xl font-semibold text-white">
//                   Cancel Booking
//                 </h2>
//                 <button
//                   className="text-gray-400 hover:text-white"
//                   onClick={closeCancelModal}
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               <p className="text-sm text-gray-400 mb-4">
//                 Please provide a reason for cancelling this booking.
//               </p>

//               <label className="block text-sm text-gray-300 mb-1">
//                 Cancellation Reason <span className="text-red-400">*</span>
//               </label>
//               <textarea
//                 value={cancelReason}
//                 onChange={(e) => setCancelReason(e.target.value)}
//                 rows={4}
//                 className="w-full bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 px-3 py-2 focus:outline-none focus:border-red-500"
//                 placeholder="E.g., Not available at this time..."
//               />

//               {cancelError && (
//                 <p className="text-xs text-red-400 mt-2">{cancelError}</p>
//               )}

//               <div className="flex justify-end gap-3 mt-6">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={closeCancelModal}
//                   className="bg-gray-800/60 hover:bg-gray-700 text-gray-200"
//                   disabled={actionLoading}
//                 >
//                   Close
//                 </Button>
//                 <Button
//                   type="button"
//                   onClick={submitCancel}
//                   disabled={actionLoading}
//                   className="bg-red-500 hover:bg-red-600 text-white disabled:opacity-60"
//                 >
//                   {actionLoading ? (
//                     <span className="flex items-center gap-2">
//                       <Loader className="w-4 h-4 animate-spin" />
//                       Cancelling...
//                     </span>
//                   ) : (
//                     "Confirm Cancel"
//                   )}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Reschedule Modal */}
//         {showRescheduleModal && selectedBooking && (
//           <div
//             className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4"
//             onClick={closeRescheduleModal}
//           >
//             <div
//               className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl w-full max-w-xl p-6 animate-fadeIn"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-xl font-semibold text-white">
//                   Reschedule Booking
//                 </h2>
//                 <button
//                   className="text-gray-400 hover:text-white"
//                   onClick={closeRescheduleModal}
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm text-gray-300 mb-1">
//                     New Date <span className="text-red-400">*</span>
//                   </label>
//                   <input
//                     type="date"
//                     value={rescheduleDate}
//                     onChange={(e) => setRescheduleDate(e.target.value)}
//                     className="w-full bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 px-3 py-2 focus:outline-none focus:border-blue-500"
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm text-gray-300 mb-1">
//                       Start Time <span className="text-red-400">*</span>
//                     </label>
//                     <input
//                       type="time"
//                       value={rescheduleStart}
//                       onChange={(e) => setRescheduleStart(e.target.value)}
//                       className="w-full bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 px-3 py-2 focus:outline-none focus:border-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm text-gray-300 mb-1">
//                       End Time <span className="text-red-400">*</span>
//                     </label>
//                     <input
//                       type="time"
//                       value={rescheduleEnd}
//                       onChange={(e) => setRescheduleEnd(e.target.value)}
//                       className="w-full bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 px-3 py-2 focus:outline-none focus:border-blue-500"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-300 mb-1">
//                     Reason (optional)
//                   </label>
//                   <textarea
//                     value={rescheduleReason}
//                     onChange={(e) => setRescheduleReason(e.target.value)}
//                     rows={3}
//                     className="w-full bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 px-3 py-2 focus:outline-none focus:border-blue-500"
//                     placeholder="E.g., Schedule conflict..."
//                   />
//                 </div>

//                 {rescheduleError && (
//                   <p className="text-xs text-red-400">{rescheduleError}</p>
//                 )}
//               </div>

//               <div className="flex justify-end gap-3 mt-6">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={closeRescheduleModal}
//                   className="bg-gray-800/60 hover:bg-gray-700 text-gray-200"
//                   disabled={actionLoading}
//                 >
//                   Close
//                 </Button>
//                 <Button
//                   type="button"
//                   onClick={submitReschedule}
//                   disabled={actionLoading}
//                   className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-60"
//                 >
//                   {actionLoading ? (
//                     <span className="flex items-center gap-2">
//                       <Loader className="w-4 h-4 animate-spin" />
//                       Rescheduling...
//                     </span>
//                   ) : (
//                     "Confirm Reschedule"
//                   )}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Review Modal */}
//         {showReviewModal && selectedBooking && (
//           <div
//             className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4"
//             onClick={closeReviewModal}
//           >
//             <div
//               className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl w-full max-w-lg p-6 animate-fadeIn"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-xl font-semibold text-white">
//                   Add Review
//                 </h2>
//                 <button
//                   className="text-gray-400 hover:text-white"
//                   onClick={closeReviewModal}
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <p className="text-sm text-gray-300 mb-1">Rating</p>
//                   <div className="flex items-center gap-1">
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <button
//                         key={star}
//                         type="button"
//                         onClick={() => setReviewRating(star)}
//                         className="p-1"
//                       >
//                         <Star
//                           className={`w-6 h-6 ${
//                             star <= reviewRating
//                               ? "text-yellow-400 fill-yellow-400"
//                               : "text-gray-600"
//                           }`}
//                         />
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-300 mb-1">
//                     Write your review{" "}
//                     <span className="text-red-400">*</span>
//                   </label>
//                   <textarea
//                     value={reviewText}
//                     onChange={(e) => setReviewText(e.target.value)}
//                     rows={4}
//                     className="w-full bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 px-3 py-2 focus:outline-none focus:border-purple-500"
//                     placeholder="Share your experience..."
//                   />
//                 </div>

//                 {reviewError && (
//                   <p className="text-xs text-red-400">{reviewError}</p>
//                 )}
//               </div>

//               <div className="flex justify-end gap-3 mt-6">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={closeReviewModal}
//                   className="bg-gray-800/60 hover:bg-gray-700 text-gray-200"
//                   disabled={actionLoading}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   type="button"
//                   onClick={submitReview}
//                   disabled={actionLoading}
//                   className="bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-60"
//                 >
//                   {actionLoading ? (
//                     <span className="flex items-center gap-2">
//                       <Loader className="w-4 h-4 animate-spin" />
//                       Submitting...
//                     </span>
//                   ) : (
//                     "Submit Review"
//                   )}
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
//           animation: fadeIn 0.2s ease-out forwards;
//         }
//       `}</style>
//     </div>
//   );
// }
