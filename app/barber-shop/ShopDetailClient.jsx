"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Edit2,
  Save,
  X,
  Users,
  Calendar,
  Check,
  Trash2,
  CheckCircle,
} from "lucide-react";



export default function ShopDetailClient() {
  const params = useParams();
  const shopId = params?.shopId;
  const router = useRouter();

  // Shop state
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({});

  // Bookings state
  const [showBookings, setShowBookings] = useState(false); // when true, hide shop details UI
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [updatingBookingId, setUpdatingBookingId] = useState(null);

  // Toast state
  const [toast, setToast] = useState(null);

  // Cursor state (kept from your original)
  const cursorRef = useRef(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  // ============================================
  // Helpers
  // ============================================
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const API_BASE = "http://localhost:5000/api";

  // ============================================
  // Fetch shop details
  // ============================================
//   useEffect(() => {
//     async function fetchShop() {
//       if (!shopId) {
//         setError("No shop ID provided");
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       setError("");
//       try {
//         const token = localStorage.getItem("token");
//         let res;
//         try {
//   const token = localStorage.getItem("token");

//   const res = await axios.get(
//     `${API_BASE}/barbers/shops/${shopId}`,
//     { headers: token ? { Authorization: `Bearer ${token}` } : {} }
//   );

//   if (res.data?.success) {
//     const shopFromRes = res.data.data || res.data.shop;
//     setShop(shopFromRes);
//     setFormData(shopFromRes);
//   } else {
//     setError(res.data?.message || "Failed to fetch shop");
//   }

// } catch (err) {
//   console.error("fetchShop error:", err);
//   setError(err?.response?.data?.message || "Failed to fetch shop details");
// }


//         if (res?.data?.success) {
//           // some endpoints return res.data.shop or res.data.data - normalize
//           const shopFromRes = res.data.shop || res.data.data || res.data;
//           setShop(shopFromRes);
//           setFormData(shopFromRes || {});
//           setError("");
//         } else {
//           setError(res?.data?.message || "Failed to fetch shop");
//           setShop(null);
//         }
//       } catch (err) {
//         console.error("fetchShop error:", err);
//         setError(
//           err?.response?.data?.message || err.message || "Failed to fetch shop details"
//         );
//         setShop(null);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchShop();
//   }, [shopId]);

useEffect(() => {
  async function fetchShop() {
    if (!shopId) {
      setError("No shop ID provided");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API_BASE}/barbers/shops/${shopId}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      if (res.data?.success) {
        const shopFromRes = res.data.data;
        setShop(shopFromRes);
        setFormData(shopFromRes);
      } else {
        setError(res.data?.message || "Failed to fetch shop");
      }

    } catch (err) {
      console.error("fetchShop error:", err);
      setError(
        err?.response?.data?.message ||
        err.message ||
        "Failed to fetch shop"
      );
    }

    setLoading(false);
  }

  fetchShop();
}, [shopId]);


  // ============================================
  // Fetch bookings for this shop
  // ============================================
  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/bookings/shop/${shopId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.data?.success) {
        setBookings(res.data.data || []);
      } else {
        setBookings([]);
        showToast(res.data?.message || "No bookings available", "info");
      }
    } catch (err) {
      console.error("fetchBookings error:", err);
      setBookings([]);
      if (err.code === "ERR_NETWORK") {
        showToast("Network error: ensure backend is running on http://localhost:5000", "error");
      } else if (err.response?.status === 404) {
        showToast("Bookings API not found. Check backend routes.", "error");
      } else {
        showToast(err.response?.data?.message || "Failed to load bookings", "error");
      }
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleToggleBookings = () => {
    // toggle and fetch when opening
    if (!showBookings) {
      fetchBookings();
    }
    setShowBookings((s) => !s);
  };

  // ============================================
  // Update booking status (confirm / cancel / complete)
  // Uses PUT /api/bookings/:id/status
  // ============================================
  const handleBookingAction = async (bookingId, newStatus) => {
    if (!bookingId) return;
    try {
      setUpdatingBookingId(bookingId);
      const token = localStorage.getItem("token");

      // optimistic update
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
      );

      const res = await axios.put(
        `${API_BASE}/bookings/${bookingId}/status`,
        { status: newStatus },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (res.data?.success) {
        showToast(
          newStatus === "confirmed"
            ? "✅ Booking confirmed!"
            : newStatus === "cancelled"
            ? "❌ Booking cancelled!"
            : newStatus === "completed"
            ? "🎉 Booking completed!"
            : "Status updated",
          "success"
        );
        // refresh list to get canonical data
        fetchBookings();
      } else {
        throw new Error(res.data?.message || "Update failed");
      }
    } catch (err) {
      console.error("handleBookingAction error:", err);
      showToast(err?.response?.data?.message || "Failed to update booking", "error");
      // revert by refetching
      fetchBookings();
    } finally {
      setUpdatingBookingId(null);
    }
  };

  // ============================================
  // Form handlers (shop edit)
  // ============================================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, location: { ...prev.location, [name]: value } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`${API_BASE}/barber/shops/${shopId}`, formData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.data?.success) {
        showToast("✅ Shop updated successfully!", "success");
        const updatedShop = res.data.shop || res.data.data || res.data;
        setShop(updatedShop);
        setFormData(updatedShop);
        setEditing(false);
      } else {
        throw new Error(res.data?.message || "Update failed");
      }
    } catch (err) {
      console.error("handleSubmit error:", err);
      showToast(err?.response?.data?.message || "Error updating shop", "error");
    } finally {
      setUpdating(false);
    }
  };

  // ============================================
  // UI Helpers
  // ============================================
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Small cursor UX (kept in)
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  useEffect(() => {
    // hide default cursor
    const original = document.body.style.cursor;
    document.body.style.cursor = "none";
    return () => {
      document.body.style.cursor = original || "auto";
    };
  }, []);

  useEffect(() => {
    const handleMouseEnter = () => setHovering(true);
    const handleMouseLeave = () => setHovering(false);
    const elements = document.querySelectorAll(
      "button, a, [tabindex]:not([tabindex='-1']), input, textarea, label"
    );
    elements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });
    return () => {
      elements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  // Loading / Error screens
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#071012] via-[#0b0e13] to-[#030405] text-cyan-300 font-poppins">
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}>
          Loading shop details...
        </motion.div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-[#071012] via-[#0b0e13] to-[#030405] text-gray-400 font-poppins px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-400">⚠️ Error</h1>
          <p className="text-lg">{error || "Shop not found"}</p>
          <p className="text-sm text-gray-500">
            Shop ID: <span className="text-cyan-400">{shopId}</span>
          </p>
          <Button onClick={() => router.back()} className="mt-4 bg-linear-to-r from-cyan-500 to-teal-400 text-black font-semibold px-6 py-2 rounded-full">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // ============================================
  // Main render
  // ============================================
  return (
    <>
      {/* Cursor element */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-10000 pointer-events-none"
        style={{
          transform: `translate(calc(${cursorPos.x}px - 50%), calc(${cursorPos.y}px - 50%))`,
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.2s ease-out",
        }}
      >
        <div
          className={`w-5 h-5 rounded-full border-2 transition-all duration-150 ${
            hovering ? "border-cyan-300 bg-cyan-200/40 shadow-lg" : "border-cyan-500 bg-cyan-400/30 shadow-lg"
          }`}
        />
      </div>

      {/* Toast */}
      {toast && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className={`fixed top-4 right-4 z-9999 px-6 py-3 rounded-full font-semibold shadow-lg flex items-center gap-2 ${toast.type === "success" ? "bg-green-500/20 text-green-300 border border-green-500/30" : "bg-red-500/20 text-red-300 border border-red-500/30"}`}>
          <span className="whitespace-nowrap">{toast.message}</span>
        </motion.div>
      )}

      <div className="min-h-screen relative bg-linear-to-br from-[#050a0c] via-[#0b0e13] to-[#030405] text-gray-200 px-6 py-12 font-poppins overflow-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-10">
            <motion.button whileHover={{ scale: 1.1 }} onClick={() => router.back()} className="flex items-center gap-2 text-cyan-400 hover:text-teal-300 transition">
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </motion.button>

            <div className="flex gap-3">
              <motion.button whileHover={{ scale: 1.05 }} onClick={handleToggleBookings} className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-400 text-white font-semibold shadow-xl">
                <Calendar className="w-5 h-5" />
                {showBookings ? "Hide Bookings" : "View Bookings"}
              </motion.button>

              <motion.button whileHover={{ scale: 1.05 }} onClick={() => setEditing((s) => !s)} className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 text-black font-semibold shadow-xl">
                {editing ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                {editing ? "Cancel Edit" : "Edit Shop"}
              </motion.button>
            </div>
          </motion.div>

          {/* Shop Info - HIDDEN when showBookings === true */}
          {!showBookings && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="rounded-2xl border border-gray-800 bg-gradient-to-br from-[#0b1114]/70 to-[#061011]/50 backdrop-blur-xl shadow-lg p-8 mb-10">
              <CardHeader>
                <CardTitle className="text-3xl font-semibold text-white tracking-wide">{shop.shopName}</CardTitle>
              </CardHeader>

              <CardContent>
                {!editing ? (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-cyan-400 font-semibold mb-2">Description</h3>
                      <p className="text-gray-300">{shop.description || "No description"}</p>
                    </div>

                    <div>
                      <h3 className="text-cyan-400 font-semibold mb-2">Location</h3>
                      <div className="space-y-1 text-gray-300">
                        <p>{shop.location?.address || "N/A"}</p>
                        <p>
                          {shop.location?.city || "N/A"}, {shop.location?.state || "N/A"} {shop.location?.zipCode || ""}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-cyan-400 font-semibold mb-2">Services</h3>
                      {shop.services?.length ? (
                        <div className="grid sm:grid-cols-2 gap-4">
                          {shop.services.map((s, i) => (
                            <div key={i} className="rounded-xl border border-gray-700 bg-[#0a0f11]/70 p-4 transition-all duration-300">
                              <p className="text-white font-semibold">{s.name}</p>
                              <p className="text-sm text-gray-400">₹{s.price} • {s.duration} mins</p>
                              <p className="text-xs text-gray-500">Category: {s.category}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400">No services added</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-cyan-400 mb-2">Shop Name</label>
                      <input type="text" name="shopName" value={formData.shopName || ""} onChange={handleInputChange} className="w-full bg-[#0a0f11]/60 border border-gray-700 text-white p-3 rounded-lg focus:border-cyan-400 outline-none transition" />
                    </div>

                    <div>
                      <label className="block text-cyan-400 mb-2">Description</label>
                      <textarea name="description" value={formData.description || ""} onChange={handleInputChange} rows={3} className="w-full bg-[#0a0f11]/60 border border-gray-700 text-white p-3 rounded-lg focus:border-cyan-400 outline-none transition" />
                    </div>

                    <div>
                      <h3 className="text-cyan-400 font-semibold mb-3">Location</h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {["address", "city", "state", "zipCode"].map((key) => (
                          <input key={key} type="text" name={key} placeholder={key.charAt(0).toUpperCase() + key.slice(1)} value={formData.location?.[key] || ""} onChange={handleLocationChange} className="bg-[#0a0f11]/60 border border-gray-700 text-white p-3 rounded-lg focus:border-cyan-400 outline-none transition" />
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button type="submit" disabled={updating} className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-400 text-black font-semibold rounded-full shadow-md hover:scale-105 transition disabled:opacity-50">
                        <Save className="w-5 h-5 mr-2" />
                        {updating ? "Saving..." : "Save Changes"}
                      </Button>

                      <Button type="button" onClick={() => setEditing(false)} className="flex-1 rounded-full border border-gray-700 text-gray-300 hover:border-cyan-400 transition">
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </motion.div>
          )}

          {/* Bookings Section */}
          {showBookings && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="rounded-2xl border border-gray-800 bg-gradient-to-br from-[#0b1114]/70 to-[#061011]/50 backdrop-blur-xl shadow-lg p-8 mb-10">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-purple-400" />
                <h2 className="text-white text-2xl font-semibold">Bookings</h2>
                <span className="ml-auto text-cyan-400 font-semibold text-lg">Total: {bookings.length}</span>
              </div>

              {bookingsLoading ? (
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-center text-purple-300">Loading bookings...</motion.div>
              ) : bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking, i) => (
                    <motion.div key={booking._id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="border border-gray-700 rounded-xl bg-[#0a0f11]/70 p-5 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Booking Info */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="text-white font-semibold text-lg">{booking.serviceName || "Service Not Specified"}</p>
                              <p className="text-gray-400 text-sm">👤 {booking.userId?.name || "Customer"}</p>
                              <p className="text-sm text-cyan-400 font-semibold">Service: {booking.serviceName || "—"}</p>
                            </div>

                            <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full whitespace-nowrap ${getStatusColor(booking.status)}`}>
                              {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : "Unknown"}
                            </span>
                          </div>

                          <div className="space-y-1 text-sm text-gray-400">
                            <p>📅 {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : "Date not set"}</p>
                            <p>🕒 {booking.bookingTime?.startTime || "N/A"} - {booking.bookingTime?.endTime || "N/A"}</p>
                            {booking.amount && <p className="text-cyan-400 font-semibold">💰 ₹{booking.amount}</p>}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 md:flex-col md:w-auto">
                          {/* Confirm - show only if not confirmed/cancelled/completed */}
                          {booking.status !== "confirmed" && booking.status !== "cancelled" && booking.status !== "completed" && (
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleBookingAction(booking._id, "confirmed")} disabled={updatingBookingId === booking._id} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition disabled:opacity-50 font-medium text-sm">
                              <Check className="w-4 h-4" />
                              {updatingBookingId === booking._id ? "..." : "Confirm"}
                            </motion.button>
                          )}

                          {/* Cancel - disabled if already confirmed or completed (frontend guard) */}
                          <motion.button whileHover={{ scale: booking.status === "confirmed" || booking.status === "completed" ? 1 : 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleBookingAction(booking._id, "cancelled")} disabled={updatingBookingId === booking._id || booking.status === "confirmed" || booking.status === "completed"} className={`flex items-center gap-1 px-4 py-2 rounded-lg ${booking.status === "confirmed" || booking.status === "completed" ? "bg-gray-700 text-gray-300 cursor-not-allowed" : "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"} transition disabled:opacity-50 font-medium text-sm`}>
                            <Trash2 className="w-4 h-4" />
                            {updatingBookingId === booking._id ? "..." : "Cancel"}
                          </motion.button>

                          {/* Complete - only available if confirmed */}
                          {booking.status === "confirmed" && (
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleBookingAction(booking._id, "completed")} disabled={updatingBookingId === booking._id} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition disabled:opacity-50 font-medium text-sm">
                              <CheckCircle className="w-4 h-4" />
                              {updatingBookingId === booking._id ? "..." : "Complete"}
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No bookings yet</p>
              )}
            </motion.div>
          )}

          {/* Staff Section (kept as before) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-gray-800 bg-gradient-to-br from-[#0b1114]/70 to-[#061011]/50 backdrop-blur-xl shadow-lg p-8">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-cyan-400" />
              <h2 className="text-white text-2xl font-semibold">Staff Members</h2>
            </div>

            {shop.staff?.length ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {shop.staff.map((member, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.05 }} className="border border-gray-700 rounded-xl bg-[#0a0f11]/70 p-4">
                    <p className="text-white font-semibold">{member.name}</p>
                    <p className="text-gray-400 text-sm">{member.role}</p>
                    <p className="text-gray-400 text-xs">Phone: {member.phone}</p>
                    <p className="text-gray-500 text-xs mt-1">Specialization: {member.specialization || "N/A"}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No staff added yet</p>
            )}
          </motion.div>
        </div>

        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap");
          .font-poppins { font-family: "Poppins", sans-serif; }
          html, body { cursor: none !important; overflow-x: hidden; }
          * { cursor: none !important; }
          @media (hover: none) {
            html, body, * { cursor: auto !important; }
          }
        `}</style>
      </div>
    </>
  );
}
