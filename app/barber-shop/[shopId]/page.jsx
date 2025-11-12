"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit2, Save, X, Users, Calendar, Check, Trash2 } from "lucide-react";

export default function ShopDetailPage() {
  const params = useParams();
  const shopId = params?.shopId;
  const router = useRouter();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({});
  
  // Bookings state
  const [showBookings, setShowBookings] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [updatingBookingId, setUpdatingBookingId] = useState(null);
  
  // Toast state
  const [toast, setToast] = useState(null);
  
  const cursorRef = useRef(null);
  const glowRef = useRef(null);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Toast notification function
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch shop details
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
        
        let res;
        try {
          res = await axios.get(
            `http://localhost:5000/api/barbers/barber-shop/${shopId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err1) {
          res = await axios.get(
            `http://localhost:5000/api/barbershops/${shopId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }

        if (res.data.success) {
          setShop(res.data.shop);
          setFormData(res.data.shop);
          setError("");
        } else {
          setError(res.data.message || "Failed to fetch shop");
          setShop(null);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch shop details"
        );
        setShop(null);
      } finally {
        setLoading(false);
      }
    }

    fetchShop();
  }, [shopId]);

  // ✅ FIXED: Fetch bookings - Changed to use localhost:3000 instead of 5000
  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // Try localhost:3000 first (Next.js API route)
      const res = await axios.get(
        `http://localhost:5000/api/bookings?shopId=${shopId}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      
      if (res.data.success) {
        console.log("✅ Bookings loaded:", res.data.bookings);
        setBookings(res.data.bookings || []);
      } else {
        console.warn("⚠️ API returned success: false", res.data);
        setBookings([]);
        showToast("No bookings available", "error");
      }
    } catch (err) {
      console.error("❌ Error fetching bookings:", err);
      setBookings([]);
      
      // More specific error messages
      if (err.code === 'ERR_NETWORK') {
        showToast("Network error: Make sure your server is running", "error");
      } else if (err.response?.status === 404) {
        showToast("Bookings API not found. Check if endpoint exists.", "error");
      } else if (err.response?.status === 401) {
        showToast("Unauthorized. Please login again.", "error");
      } else {
        showToast("Failed to load bookings", "error");
      }
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleToggleBookings = () => {
    if (!showBookings) {
      fetchBookings();
    }
    setShowBookings(!showBookings);
  };

  // Handle confirm or cancel booking action with optimistic update and toast
  const handleBookingAction = async (bookingId, newStatus) => {
    try {
      setUpdatingBookingId(bookingId);
      const token = localStorage.getItem("token");

      // Optimistic UI update
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      );

      const res = await axios.patch(
        `http://localhost:3000/api/bookings/${bookingId}`,
        { status: newStatus },
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );

      if (res.data.success) {
        showToast(`✅ Booking ${newStatus}!`, "success");
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      console.error("Error updating booking:", err);
      // Revert optimistic update upon error
      fetchBookings();
      showToast("❌ Error updating booking", "error");
    } finally {
      setUpdatingBookingId(null);
    }
  };

  // Helpers for form handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [name]: value },
    }));
  };

  // Save edited shop info
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/bookings/shop/${shopId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("response" , res);
      
      if (res.data.success) {
        showToast("✅ Shop updated successfully!", "success");
        setShop(res.data.shop);
        setFormData(res.data.shop);
        setEditing(false);
      }
    } catch (err) {
      showToast("❌ Error updating shop", "error");
    } finally {
      setUpdating(false);
    }
  };

  // Status color class helper based on status
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  // ✅ FIXED: Improved cursor animation with better performance
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const cursor = cursorRef.current;
    const glow = glowRef.current;
    if (!cursor || !glow) return;

    let mouseX = 0;
    let mouseY = 0;
    let posX = 0;
    let posY = 0;
    let glowX = 0;
    let glowY = 0;
    let frame = null;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setCursorVisible(true);
    };

    const onMouseLeave = () => {
      setCursorVisible(false);
    };

    const animate = () => {
      posX += (mouseX - posX) * 0.25;
      posY += (mouseY - posY) * 0.25;
      glowX += (mouseX - glowX) * 0.1;
      glowY += (mouseY - glowY) * 0.1;

      if (cursor) {
        cursor.style.left = posX + 'px';
        cursor.style.top = posY + 'px';
      }
      
      if (glow) {
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
      }

      frame = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    frame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#071012] via-[#0b0e13] to-[#030405] text-cyan-300 font-poppins">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading shop details...
        </motion.div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#071012] via-[#0b0e13] to-[#030405] text-gray-400 font-poppins px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-400">⚠️ Error</h1>
          <p className="text-lg">{error || "Shop not found"}</p>
          <p className="text-sm text-gray-500">
            Shop ID: <span className="text-cyan-400">{shopId}</span>
          </p>
          <Button
            onClick={() => router.back()}
            className="mt-4 bg-gradient-to-r from-cyan-500 to-teal-400 text-black font-semibold px-6 py-2 rounded-full"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          className={`fixed top-4 right-4 z-[10000] px-6 py-3 rounded-full font-semibold shadow-lg flex items-center gap-2 ${
            toast.type === "success"
              ? "bg-green-500/20 text-green-300 border border-green-500/30"
              : "bg-red-500/20 text-red-300 border border-red-500/30"
          }`}
        >
          {toast.type === "success" ? (
            <Check className="w-5 h-5" />
          ) : (
            <X className="w-5 h-5" />
          )}
          {toast.message}
        </motion.div>
      )}

      {/* ✅ FIXED: Cursor Glow - Changed positioning */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed z-[9998] w-48 h-48 rounded-full blur-3xl bg-gradient-to-tr from-cyan-400/30 to-teal-500/20 mix-blend-screen"
        style={{
          opacity: cursorVisible ? 0.4 : 0,
          transform: 'translate(-50%, -50%)',
          transition: 'opacity 0.2s ease-out'
        }}
      />

      {/* ✅ FIXED: Cursor Dot - Changed positioning */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed z-[9999] w-4 h-4 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(20,200,180,0.7)]"
        style={{
          opacity: cursorVisible ? 1 : 0,
          transform: 'translate(-50%, -50%)',
          transition: 'opacity 0.2s ease-out'
        }}
      />

      {/* Main Page */}
      <div className="min-h-screen relative cursor-none bg-gradient-to-br from-[#050a0c] via-[#0b0e13] to-[#030405] text-gray-200 px-6 py-12 font-poppins overflow-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-10"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => router.back()}
              className="flex items-center gap-2 text-cyan-400 hover:text-teal-300 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </motion.button>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(0,255,200,0.3)" }}
                onClick={handleToggleBookings}
                className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-400 text-white font-semibold shadow-xl shadow-purple-800/30"
              >
                <Calendar className="w-5 h-5" />
                {showBookings ? "Hide Bookings" : "View Bookings"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(0,255,200,0.3)" }}
                onClick={() => setEditing(!editing)}
                className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 text-black font-semibold shadow-xl shadow-cyan-800/30"
              >
                {editing ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                {editing ? "Cancel Edit" : "Edit Shop"}
              </motion.button>
            </div>
          </motion.div>

          {/* Shop Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-gray-800 bg-gradient-to-br from-[#0b1114]/70 to-[#061011]/50 backdrop-blur-xl shadow-lg shadow-cyan-900/20 p-8 mb-10"
          >
            <CardHeader>
              <CardTitle className="text-3xl font-semibold text-white tracking-wide">
                {shop.shopName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!editing ? (
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{ show: { transition: { staggerChildren: 0.1 } } }}
                  className="space-y-8"
                >
                  <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
                    <h3 className="text-cyan-400 font-semibold mb-2">Description</h3>
                    <p className="text-gray-300">{shop.description || "No description"}</p>
                  </motion.div>

                  <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
                    <h3 className="text-cyan-400 font-semibold mb-2">Location</h3>
                    <div className="space-y-1 text-gray-300">
                      <p>{shop.location?.address || "N/A"}</p>
                      <p>{shop.location?.city || "N/A"}, {shop.location?.state || "N/A"} {shop.location?.zipCode || ""}</p>
                    </div>
                  </motion.div>

                  <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
                    <h3 className="text-cyan-400 font-semibold mb-2">Services</h3>
                    {shop.services?.length ? (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {shop.services.map((s, i) => (
                          <motion.div
                            key={i}
                            whileHover={{
                              scale: 1.05,
                              borderColor: "#22d3ee",
                              boxShadow: "0 0 20px rgba(34,211,238,0.2)",
                            }}
                            className="rounded-xl border border-gray-700 bg-[#0a0f11]/70 p-4 transition-all duration-300 cursor-pointer"
                          >
                            <p className="text-white font-semibold">{s.name}</p>
                            <p className="text-sm text-gray-400">₹{s.price} • {s.duration} mins</p>
                            <p className="text-xs text-gray-500">Category: {s.category}</p>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No services added</p>
                    )}
                  </motion.div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-cyan-400 mb-2">Shop Name</label>
                    <input
                      type="text"
                      name="shopName"
                      value={formData.shopName || ""}
                      onChange={handleInputChange}
                      className="w-full bg-[#0a0f11]/60 border border-gray-700 text-white p-3 rounded-lg focus:border-cyan-400 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-400 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description || ""}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full bg-[#0a0f11]/60 border border-gray-700 text-white p-3 rounded-lg focus:border-cyan-400 outline-none transition"
                    />
                  </div>
                  <div>
                    <h3 className="text-cyan-400 font-semibold mb-3">Location</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {["address", "city", "state", "zipCode"].map((key) => (
                        <input
                          key={key}
                          type="text"
                          name={key}
                          placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                          value={formData.location?.[key] || ""}
                          onChange={handleLocationChange}
                          className="bg-[#0a0f11]/60 border border-gray-700 text-white p-3 rounded-lg focus:border-cyan-400 outline-none transition"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={updating}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-400 text-black font-semibold rounded-full shadow-md shadow-cyan-800/40 hover:scale-105 transition disabled:opacity-50"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      {updating ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="flex-1 rounded-full border border-gray-700 text-gray-300 hover:border-cyan-400 transition"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </motion.div>

          {/* Bookings Section */}
          {showBookings && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-gray-800 bg-gradient-to-br from-[#0b1114]/70 to-[#061011]/50 backdrop-blur-xl shadow-lg shadow-purple-900/20 p-8 mb-10"
            >
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-purple-400" />
                <h2 className="text-white text-2xl font-semibold">Bookings</h2>
              </div>

              {bookingsLoading ? (
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-center text-purple-300"
                >
                  Loading bookings...
                </motion.div>
              ) : bookings.length ? (
                <div className="space-y-4">
                  {bookings.map((booking, i) => (
                    <motion.div
                      key={booking._id || i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="border border-gray-700 rounded-xl bg-[#0a0f11]/70 p-5 transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Booking Info */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-white font-semibold text-lg">
                                {booking.customerName || "Customer"}
                              </p>
                              <p className="text-gray-400 text-sm">
                                📋 {booking.serviceName || "Service"}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {booking.status
                                ? booking.status.charAt(0).toUpperCase() +
                                  booking.status.slice(1)
                                : "Unknown"}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm text-gray-400">
                            <p>
                              📅{" "}
                              {booking.date
                                ? new Date(booking.date).toLocaleDateString()
                                : "Date not set"}
                            </p>
                            <p>🕒 {booking.time || "Time not set"}</p>
                            {booking.price && (
                              <p className="text-cyan-400">💰 ₹{booking.price}</p>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 md:flex-col md:w-auto">
                          {booking.status !== "confirmed" &&
                            booking.status !== "cancelled" && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  handleBookingAction(booking._id, "confirmed")
                                }
                                disabled={updatingBookingId === booking._id}
                                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition disabled:opacity-50 font-medium text-sm"
                              >
                                <Check className="w-4 h-4" />
                                {updatingBookingId === booking._id ? "..." : "Confirm"}
                              </motion.button>
                            )}
                          {booking.status !== "cancelled" && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                handleBookingAction(booking._id, "cancelled")
                              }
                              disabled={updatingBookingId === booking._id}
                              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition disabled:opacity-50 font-medium text-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                              {updatingBookingId === booking._id ? "..." : "Cancel"}
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center">No bookings yet</p>
              )}
            </motion.div>
          )}

          {/* Staff Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-gray-800 bg-gradient-to-br from-[#0b1114]/70 to-[#061011]/50 backdrop-blur-xl shadow-lg shadow-cyan-900/20 p-8"
          >
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-cyan-400" />
              <h2 className="text-white text-2xl font-semibold">Staff Members</h2>
            </div>

            {shop.staff?.length ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {shop.staff.map((member, i) => (
                  <motion.div
                    key={i}
                    whileHover={{
                      scale: 1.05,
                      borderColor: "#22d3ee",
                      boxShadow: "0 0 20px rgba(34,211,238,0.2)",
                    }}
                    className="border border-gray-700 rounded-xl bg-[#0a0f11]/70 p-4 transition-all duration-300 cursor-pointer"
                  >
                    <p className="text-white font-semibold">{member.name}</p>
                    <p className="text-gray-400 text-sm">{member.role}</p>
                    <p className="text-gray-400 text-xs">Phone: {member.phone}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      Specialization: {member.specialization || "N/A"}
                    </p>
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
          
          .font-poppins {
            font-family: "Poppins", sans-serif;
          }

          body, html {
            cursor: none !important;
          }

          @media (hover: none) {
            body, html {
              cursor: auto !important;
            }
          }
        `}</style>
      </div>
    </>
  );
}











// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useParams, useRouter } from "next/navigation";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ArrowLeft, Edit2, Save, X, Users, Calendar } from "lucide-react";

// export default function ShopDetailPage() {
//   const params = useParams();
//   const shopId = params?.shopId; // ✅ Better handling of params
//   const router = useRouter();
//   const [shop, setShop] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(""); // ✅ NEW: Error state for debugging
//   const [editing, setEditing] = useState(false);
//   const [updating, setUpdating] = useState(false);
//   const [formData, setFormData] = useState({});
  
//   // Bookings state
//   const [showBookings, setShowBookings] = useState(false);
//   const [bookings, setBookings] = useState([]);
//   const [bookingsLoading, setBookingsLoading] = useState(false);
  
//   const cursorRef = useRef(null);
//   const glowRef = useRef(null);
//   const [cursorVisible, setCursorVisible] = useState(true);

//   // ✅ FIXED: Fetch shop with better error handling
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
        
//         // ✅ TRY BOTH API ENDPOINTS
//         let res;
//         try {
//           // First try the barber-shop endpoint
//           res = await axios.get(
//             `http://localhost:5000/api/barbers/barber-shop/${shopId}`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//         } catch (err1) {
//           console.log("First endpoint failed, trying alternative...");
//           // If first fails, try the barbershops endpoint
//           res = await axios.get(
//             `http://localhost:5000/api/barbershops/${shopId}`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//         }

//         if (res.data.success) {
//           setShop(res.data.shop);
//           setFormData(res.data.shop);
//           setError("");
//         } else {
//           setError(res.data.message || "Failed to fetch shop");
//           setShop(null);
//         }
//       } catch (err) {
//         console.error("Error fetching shop:", err);
//         setError(
//           err.response?.data?.message ||
//           err.message ||
//           "Failed to fetch shop details"
//         );
//         setShop(null);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchShop();
//   }, [shopId]);

//   // Fetch bookings
//   const fetchBookings = async () => {
//     setBookingsLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(
//         `http://localhost:5000/api/bookings/shop/${shopId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (res.data.success) {
//         console.log("Booking res" , res);
        
//         setBookings(res.data.bookings || []);
//       } else {
//         setBookings([]);
//       }
//     } catch (err) {
//       console.error("Failed to fetch bookings:", err);
//       setBookings([]);
//     } finally {
//       setBookingsLoading(false);
//     }
//   };

//   const handleToggleBookings = () => {
//     if (!showBookings) {
//       fetchBookings();
//     }
//     setShowBookings(!showBookings);
//   };

//   // Animated cursor
//   useEffect(() => {
//     const cursor = cursorRef.current;
//     const glow = glowRef.current;
//     if (!cursor || !glow) return;

//     let mouseX = 0;
//     let mouseY = 0;
//     let posX = 0;
//     let posY = 0;
//     let glowX = 0;
//     let glowY = 0;
//     let frame;

//     const onMouseMove = (e) => {
//       mouseX = e.clientX;
//       mouseY = e.clientY;
//     };

//     const animate = () => {
//       posX += (mouseX - posX) * 0.25;
//       posY += (mouseY - posY) * 0.25;
//       glowX += (mouseX - glowX) * 0.1;
//       glowY += (mouseY - glowY) * 0.1;

//       if (cursorVisible) {
//         cursor.style.opacity = "1";
//         glow.style.opacity = "0.4";
//       } else {
//         cursor.style.opacity = "0";
//         glow.style.opacity = "0";
//       }

//       cursor.style.transform = `translate3d(${posX - 8}px, ${posY - 8}px, 0)`;
//       glow.style.transform = `translate3d(${glowX - 80}px, ${glowY - 80}px, 0)`;

//       frame = requestAnimationFrame(animate);
//     };

//     window.addEventListener("mousemove", onMouseMove);
//     animate();

//     return () => {
//       window.removeEventListener("mousemove", onMouseMove);
//       cancelAnimationFrame(frame);
//     };
//   }, [cursorVisible]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleLocationChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       location: { ...prev.location, [name]: value },
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setUpdating(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.put(
//         `http://localhost:5000/api/barbershops/${shopId}`,
//         formData,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (res.data.success) {
//         alert("Shop updated successfully!");
//         setShop(res.data.shop);
//         setFormData(res.data.shop);
//         setEditing(false);
//       }
//     } catch (err) {
//       console.error("Failed to update shop:", err);
//       alert(err.response?.data?.message || "Error updating shop");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "completed":
//         return "bg-green-500/20 text-green-400 border-green-500/30";
//       case "pending":
//         return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
//       case "cancelled":
//         return "bg-red-500/20 text-red-400 border-red-500/30";
//       default:
//         return "bg-gray-500/20 text-gray-400 border-gray-500/30";
//     }
//   };

//   // Loading screen
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#071012] via-[#0b0e13] to-[#030405] text-cyan-300 font-poppins">
//         <motion.div
//           animate={{ opacity: [0.3, 1, 0.3] }}
//           transition={{ duration: 1.5, repeat: Infinity }}
//         >
//           Loading shop details...
//         </motion.div>
//       </div>
//     );
//   }

//   // ✅ FIXED: Better error handling display
//   if (error || !shop) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#071012] via-[#0b0e13] to-[#030405] text-gray-400 font-poppins px-4">
//         <div className="text-center space-y-4">
//           <h1 className="text-2xl font-bold text-red-400">⚠️ Error</h1>
//           <p className="text-lg">{error || "Shop not found"}</p>
//           <p className="text-sm text-gray-500">
//             Shop ID: <span className="text-cyan-400">{shopId}</span>
//           </p>
//           <Button
//             onClick={() => router.back()}
//             className="mt-4 bg-gradient-to-r from-cyan-500 to-teal-400 text-black font-semibold px-6 py-2 rounded-full"
//           >
//             Go Back
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Cursor Glow */}
//       <div
//         ref={glowRef}
//         className="pointer-events-none fixed z-[9998] w-48 h-48 rounded-full blur-3xl opacity-40 bg-gradient-to-tr from-cyan-400/30 to-teal-500/20 mix-blend-screen transition-opacity duration-200"
//         style={{ opacity: cursorVisible ? 0.4 : 0 }}
//       />

//       {/* Cursor Dot */}
//       <div
//         ref={cursorRef}
//         className="pointer-events-none fixed z-[9999] w-4 h-4 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(20,200,180,0.7)] transition-opacity duration-200"
//         style={{ opacity: cursorVisible ? 1 : 0 }}
//       />

//       {/* Main Page */}
//       <div
//         className="min-h-screen relative cursor-none bg-gradient-to-br from-[#050a0c] via-[#0b0e13] to-[#030405] text-gray-200 px-6 py-12 font-poppins overflow-hidden"
//         onMouseEnter={() => setCursorVisible(true)}
//         onMouseLeave={() => setCursorVisible(false)}
//       >
//         <div className="max-w-5xl mx-auto">
//           {/* Header */}
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="flex justify-between items-center mb-10"
//           >
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               onClick={() => router.back()}
//               className="flex items-center gap-2 text-cyan-400 hover:text-teal-300 transition"
//             >
//               <ArrowLeft className="w-5 h-5" />
//               <span>Back</span>
//             </motion.button>

//             <div className="flex gap-3">
//               <motion.button
//                 whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(0,255,200,0.3)" }}
//                 onClick={handleToggleBookings}
//                 className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-400 text-white font-semibold shadow-xl shadow-purple-800/30"
//               >
//                 <Calendar className="w-5 h-5" />
//                 {showBookings ? "Hide Bookings" : "View Bookings"}
//               </motion.button>

//               <motion.button
//                 whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(0,255,200,0.3)" }}
//                 onClick={() => setEditing(!editing)}
//                 className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 text-black font-semibold shadow-xl shadow-cyan-800/30"
//               >
//                 {editing ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
//                 {editing ? "Cancel Edit" : "Edit Shop"}
//               </motion.button>
//             </div>
//           </motion.div>

//           {/* Shop Info */}
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="rounded-2xl border border-gray-800 bg-gradient-to-br from-[#0b1114]/70 to-[#061011]/50 backdrop-blur-xl shadow-lg shadow-cyan-900/20 p-8 mb-10"
//           >
//             <CardHeader>
//               <CardTitle className="text-3xl font-semibold text-white tracking-wide">
//                 {shop.shopName}
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               {!editing ? (
//                 <motion.div
//                   initial="hidden"
//                   animate="show"
//                   variants={{ show: { transition: { staggerChildren: 0.1 } } }}
//                   className="space-y-8"
//                 >
//                   <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
//                     <h3 className="text-cyan-400 font-semibold mb-2">Description</h3>
//                     <p className="text-gray-300">{shop.description || "No description"}</p>
//                   </motion.div>

//                   <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
//                     <h3 className="text-cyan-400 font-semibold mb-2">Location</h3>
//                     <div className="space-y-1 text-gray-300">
//                       <p>{shop.location?.address || "N/A"}</p>
//                       <p>
//                         {shop.location?.city || "N/A"}, {shop.location?.state || "N/A"}{" "}
//                         {shop.location?.zipCode || ""}
//                       </p>
//                     </div>
//                   </motion.div>

//                   <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
//                     <h3 className="text-cyan-400 font-semibold mb-2">Services</h3>
//                     {shop.services?.length ? (
//                       <div className="grid sm:grid-cols-2 gap-4">
//                         {shop.services.map((s, i) => (
//                           <motion.div
//                             key={i}
//                             whileHover={{
//                               scale: 1.05,
//                               borderColor: "#22d3ee",
//                               boxShadow: "0 0 20px rgba(34,211,238,0.2)",
//                             }}
//                             className="rounded-xl border border-gray-700 bg-[#0a0f11]/70 p-4 transition-all duration-300 cursor-pointer"
//                           >
//                             <p className="text-white font-semibold">{s.name}</p>
//                             <p className="text-sm text-gray-400">
//                               ₹{s.price} • {s.duration} mins
//                             </p>
//                             <p className="text-xs text-gray-500">
//                               Category: {s.category}
//                             </p>
//                           </motion.div>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="text-gray-400">No services added</p>
//                     )}
//                   </motion.div>
//                 </motion.div>
//               ) : (
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   <div>
//                     <label className="block text-cyan-400 mb-2">Shop Name</label>
//                     <input
//                       type="text"
//                       name="shopName"
//                       value={formData.shopName || ""}
//                       onChange={handleInputChange}
//                       className="w-full bg-[#0a0f11]/60 border border-gray-700 text-white p-3 rounded-lg focus:border-cyan-400 outline-none transition"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-cyan-400 mb-2">Description</label>
//                     <textarea
//                       name="description"
//                       value={formData.description || ""}
//                       onChange={handleInputChange}
//                       rows={3}
//                       className="w-full bg-[#0a0f11]/60 border border-gray-700 text-white p-3 rounded-lg focus:border-cyan-400 outline-none transition"
//                     />
//                   </div>
//                   <div>
//                     <h3 className="text-cyan-400 font-semibold mb-3">Location</h3>
//                     <div className="grid sm:grid-cols-2 gap-3">
//                       {["address", "city", "state", "zipCode"].map((key) => (
//                         <input
//                           key={key}
//                           type="text"
//                           name={key}
//                           placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
//                           value={formData.location?.[key] || ""}
//                           onChange={handleLocationChange}
//                           className="bg-[#0a0f11]/60 border border-gray-700 text-white p-3 rounded-lg focus:border-cyan-400 outline-none transition"
//                         />
//                       ))}
//                     </div>
//                   </div>
//                   <div className="flex gap-4 pt-4">
//                     <Button
//                       type="submit"
//                       disabled={updating}
//                       className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-400 text-black font-semibold rounded-full shadow-md shadow-cyan-800/40 hover:scale-105 transition disabled:opacity-50"
//                     >
//                       <Save className="w-5 h-5 mr-2" />
//                       {updating ? "Saving..." : "Save Changes"}
//                     </Button>
//                     <Button
//                       type="button"
//                       onClick={() => setEditing(false)}
//                       className="flex-1 rounded-full border border-gray-700 text-gray-300 hover:border-cyan-400 transition"
//                     >
//                       Cancel
//                     </Button>
//                   </div>
//                 </form>
//               )}
//             </CardContent>
//           </motion.div>

//           {/* Bookings Section */}
//           {showBookings && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="rounded-2xl border border-gray-800 bg-gradient-to-br from-[#0b1114]/70 to-[#061011]/50 backdrop-blur-xl shadow-lg shadow-purple-900/20 p-8 mb-10"
//             >
//               <div className="flex items-center gap-2 mb-6">
//                 <Calendar className="w-5 h-5 text-purple-400" />
//                 <h2 className="text-white text-2xl font-semibold">Bookings</h2>
//               </div>

//               {bookingsLoading ? (
//                 <motion.div
//                   animate={{ opacity: [0.3, 1, 0.3] }}
//                   transition={{ duration: 1.5, repeat: Infinity }}
//                   className="text-center text-purple-300"
//                 >
//                   Loading bookings...
//                 </motion.div>
//               ) : bookings.length ? (
//                 <div className="grid sm:grid-cols-2 gap-4">
//                   {bookings.map((booking, i) => (
//                     <motion.div
//                       key={booking._id || i}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: i * 0.1 }}
//                       whileHover={{
//                         scale: 1.05,
//                         borderColor: "#a855f7",
//                         boxShadow: "0 0 20px rgba(168,85,247,0.2)",
//                       }}
//                       className="border border-gray-700 rounded-xl bg-[#0a0f11]/70 p-5 transition-all duration-300 cursor-pointer"
//                     >
//                       <div className="flex justify-between items-start mb-3">
//                         <div>
//                           <p className="text-white font-semibold">{booking.customerName || "N/A"}</p>
//                           <p className="text-gray-400 text-sm">{booking.serviceName || "Service"}</p>
//                         </div>
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
//                             booking.status
//                           )}`}
//                         >
//                           {booking.status || "Unknown"}
//                         </span>
//                       </div>
//                       <div className="space-y-1 text-sm text-gray-400">
//                         <p>
//                           📅 {booking.date
//                             ? new Date(booking.date).toLocaleDateString()
//                             : "Date not set"}
//                         </p>
//                         <p>🕒 {booking.time || "Time not set"}</p>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-400 text-center">No bookings yet</p>
//               )}
//             </motion.div>
//           )}

//           {/* Staff Section */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="rounded-2xl border border-gray-800 bg-gradient-to-br from-[#0b1114]/70 to-[#061011]/50 backdrop-blur-xl shadow-lg shadow-cyan-900/20 p-8"
//           >
//             <div className="flex items-center gap-2 mb-6">
//               <Users className="w-5 h-5 text-cyan-400" />
//               <h2 className="text-white text-2xl font-semibold">Staff Members</h2>
//             </div>

//             {shop.staff?.length ? (
//               <div className="grid sm:grid-cols-2 gap-4">
//                 {shop.staff.map((member, i) => (
//                   <motion.div
//                     key={i}
//                     whileHover={{
//                       scale: 1.05,
//                       borderColor: "#22d3ee",
//                       boxShadow: "0 0 20px rgba(34,211,238,0.2)",
//                     }}
//                     className="border border-gray-700 rounded-xl bg-[#0a0f11]/70 p-4 transition-all duration-300 cursor-pointer"
//                   >
//                     <p className="text-white font-semibold">{member.name}</p>
//                     <p className="text-gray-400 text-sm">{member.role}</p>
//                     <p className="text-gray-400 text-xs">Phone: {member.phone}</p>
//                     <p className="text-gray-500 text-xs mt-1">
//                       Specialization: {member.specialization || "N/A"}
//                     </p>
//                   </motion.div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-400">No staff added yet</p>
//             )}
//           </motion.div>
//         </div>

//         <style jsx global>{`
//           @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap");
          
//           .font-poppins {
//             font-family: "Poppins", sans-serif;
//           }

//           body, html {
//             cursor: none !important;
//           }

//           @media (hover: none) {
//             body, html {
//               cursor: auto !important;
//             }
//           }
//         `}</style>
//       </div>
//     </>
//   );
// }










