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

const API_BASE = "http://localhost:5000/api";

export default function ShopDetailClient() {
  const params = useParams();
  const shopId = params?.shopId;
  const router = useRouter();

  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({});

  const [showBookings, setShowBookings] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [updatingBookingId, setUpdatingBookingId] = useState(null);

  const [toast, setToast] = useState(null);

  const cursorRef = useRef(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // FETCH SHOP
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
        const res = await axios.get(`${API_BASE}/barbers/shops/${shopId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

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
          err?.response?.data?.message || err.message || "Failed to fetch shop"
        );
      }

      setLoading(false);
    }

    fetchShop();
  }, [shopId]);

  // FETCH BOOKINGS
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
        showToast(
          "Network error: ensure backend is running on http://localhost:5000",
          "error"
        );
      } else if (err.response?.status === 404) {
        showToast("Bookings API not found. Check backend routes.", "error");
      } else {
        showToast(
          err.response?.data?.message || "Failed to load bookings",
          "error"
        );
      }
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleToggleBookings = () => {
    if (!showBookings) fetchBookings();
    setShowBookings((s) => !s);
  };

  // BOOKING ACTION
  const handleBookingAction = async (bookingId, newStatus) => {
    if (!bookingId) return;
    try {
      setUpdatingBookingId(bookingId);
      const token = localStorage.getItem("token");

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
        fetchBookings();
      } else {
        throw new Error(res.data?.message || "Update failed");
      }
    } catch (err) {
      console.error("handleBookingAction error:", err);
      showToast(
        err?.response?.data?.message || "Failed to update booking",
        "error"
      );
      fetchBookings();
    } finally {
      setUpdatingBookingId(null);
    }
  };

  // EDIT HANDLERS
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_BASE}/barber/shops/${shopId}`,
        formData,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

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
      showToast(
        err?.response?.data?.message || "Error updating shop",
        "error"
      );
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30";
      case "confirmed":
        return "bg-sky-500/10 text-sky-300 border border-sky-500/30";
      case "cancelled":
        return "bg-red-500/10 text-red-300 border border-red-500/30";
      case "pending":
        return "bg-amber-500/10 text-amber-300 border border-amber-500/30";
      default:
        return "bg-slate-700/40 text-slate-200 border border-slate-600/60";
    }
  };

  // CURSOR
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

  // LOADING / ERROR
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#050816] to-black text-cyan-300">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-sm sm:text-base tracking-wide"
        >
          Loading shop details...
        </motion.div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#020617] via-black to-[#020617] text-gray-300 px-4">
        <div className="relative max-w-md w-full rounded-2xl border border-red-500/30 bg-red-500/5 backdrop-blur-xl p-6 shadow-xl">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
          <div className="relative space-y-3 text-center">
            <h1 className="text-2xl font-semibold text-red-400">Error</h1>
            <p className="text-base">{error || "Shop not found"}</p>
            <p className="text-xs text-gray-500">
              Shop ID: <span className="text-cyan-400">{shopId}</span>
            </p>
            <Button
              onClick={() => router.back()}
              className="mt-2 bg-gradient-to-r from-cyan-500 to-teal-400 text-black font-semibold px-6 py-2 rounded-full shadow-lg shadow-cyan-500/30"
            >
              Go back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // MAIN UI
  return (
    <>
      {/* custom cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          transform: `translate(calc(${cursorPos.x}px - 50%), calc(${cursorPos.y}px - 50%))`,
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.2s ease-out",
        }}
      >
        <div
          className={`w-5 h-5 rounded-full border-2 transition-all duration-150 ${
            hovering
              ? "border-cyan-300 bg-cyan-200/40 shadow-[0_0_18px_rgba(34,211,238,0.8)]"
              : "border-cyan-500 bg-cyan-400/30 shadow-[0_0_12px_rgba(56,189,248,0.7)]"
          }`}
        />
      </div>

      {/* toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed top-5 right-5 z-[9998] px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium shadow-xl flex items-center gap-2 backdrop-blur-md ${
            toast.type === "success"
              ? "bg-emerald-500/15 text-emerald-200 border border-emerald-500/40"
              : "bg-red-500/15 text-red-200 border border-red-500/40"
          }`}
        >
          <span>{toast.message}</span>
        </motion.div>
      )}

      <div className="min-h-screen relative bg-gradient-to-br from-[#020617] via-[#050816] to-black text-slate-100 px-4 sm:px-6 lg:px-10 py-10 font-[system-ui] overflow-hidden">
        {/* subtle gradient blobs */}
        <div className="pointer-events-none fixed -top-40 -right-32 w-80 h-80 bg-cyan-500/20 blur-3xl rounded-full" />
        <div className="pointer-events-none fixed -bottom-40 -left-32 w-80 h-80 bg-purple-500/20 blur-3xl rounded-full" />

        <div className="max-w-5xl mx-auto space-y-8 relative">
          {/* header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between gap-4"
          >
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-cyan-300 hover:text-teal-300 text-sm bg-white/5 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-full"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to shops</span>
            </button>

            <div className="flex gap-3">
              <Button
                onClick={handleToggleBookings}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs sm:text-sm px-4 py-2 shadow-lg shadow-fuchsia-500/40"
              >
                <Calendar className="w-4 h-4" />
                {showBookings ? "Hide bookings" : "View bookings"}
              </Button>
              <Button
                onClick={() => setEditing((s) => !s)}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 text-black text-xs sm:text-sm px-4 py-2 shadow-lg shadow-cyan-500/40"
              >
                {editing ? (
                  <>
                    <X className="w-4 h-4" />
                    Cancel edit
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4" />
                    Edit shop
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* hero bar */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-[0_18px_45px_rgba(15,23,42,0.85)]"
          >
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold">
                {shop.shopName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Manage details & bookings for this barbershop.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-300">
              <span className="inline-flex items-center gap-1">
                <Users className="w-4 h-4 text-cyan-300" />
                {shop.staff?.length || 0} staff
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-4 h-4 text-emerald-300" />
                {shop.services?.length || 0} services
              </span>
            </div>
          </motion.div>

          {/* main sections */}
          <div className="space-y-8">
            {/* shop block */}
            {!showBookings && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-slate-800/80 bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-[0_16px_40px_rgba(15,23,42,0.8)]">
                  <CardHeader className="pb-4 border-b border-slate-800/80">
                    <CardTitle className="text-base sm:text-lg text-slate-100">
                      Shop details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-5 space-y-7">
                    {!editing ? (
                      <>
                        <div>
                          <h3 className="text-xs uppercase tracking-[0.18em] text-slate-500 mb-1.5">
                            Description
                          </h3>
                          <p className="text-sm text-slate-200 leading-relaxed">
                            {shop.description || "No description provided."}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-xs uppercase tracking-[0.18em] text-slate-500 mb-1.5">
                            Location
                          </h3>
                          <div className="space-y-0.5 text-sm text-slate-200">
                            <p>{shop.location?.address || "N/A"}</p>
                            <p className="text-slate-400">
                              {shop.location?.city || "N/A"},{" "}
                              {shop.location?.state || "N/A"}{" "}
                              {shop.location?.zipCode || ""}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-xs uppercase tracking-[0.18em] text-slate-500 mb-1.5">
                            Services
                          </h3>
                          {shop.services?.length ? (
                            <div className="grid sm:grid-cols-2 gap-4">
                              {shop.services.map((s, i) => (
                                <motion.div
                                  key={i}
                                  whileHover={{ y: -2, scale: 1.01 }}
                                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm"
                                >
                                  <p className="font-medium text-slate-100">
                                    {s.name}
                                  </p>
                                  <p className="text-slate-400 mt-0.5">
                                    ₹{s.price} • {s.duration} mins
                                  </p>
                                  <p className="text-[11px] text-slate-500 mt-1">
                                    Category: {s.category}
                                  </p>
                                </motion.div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-slate-400">
                              No services added yet.
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <label className="block text-xs uppercase tracking-[0.18em] text-slate-500 mb-1.5">
                            Shop name
                          </label>
                          <input
                            type="text"
                            name="shopName"
                            value={formData.shopName || ""}
                            onChange={handleInputChange}
                            className="w-full bg-slate-950/70 border border-slate-800 text-sm text-slate-100 px-3 py-2.5 rounded-lg focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase tracking-[0.18em] text-slate-500 mb-1.5">
                            Description
                          </label>
                          <textarea
                            name="description"
                            value={formData.description || ""}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full bg-slate-950/70 border border-slate-800 text-sm text-slate-100 px-3 py-2.5 rounded-lg focus:outline-none focus:border-cyan-400 resize-none"
                          />
                        </div>

                        <div>
                          <h3 className="text-xs uppercase tracking-[0.18em] text-slate-500 mb-2">
                            Location
                          </h3>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {["address", "city", "state", "zipCode"].map(
                              (key) => (
                                <input
                                  key={key}
                                  type="text"
                                  name={key}
                                  placeholder={
                                    key.charAt(0).toUpperCase() + key.slice(1)
                                  }
                                  value={formData.location?.[key] || ""}
                                  onChange={handleLocationChange}
                                  className="bg-slate-950/70 border border-slate-800 text-sm text-slate-100 px-3 py-2.5 rounded-lg focus:outline-none focus:border-cyan-400"
                                />
                              )
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          <Button
                            type="submit"
                            disabled={updating}
                            className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-400 text-black text-sm font-semibold rounded-full disabled:opacity-50"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {updating ? "Saving..." : "Save changes"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setEditing(false)}
                            className="flex-1 border-slate-700 text-slate-200 text-sm rounded-full"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* bookings */}
            {showBookings && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-slate-800/80 bg-slate-900/70 backdrop-blur-xl rounded-2xl p-6 shadow-[0_16px_40px_rgba(15,23,42,0.8)]"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-violet-300" />
                  <h2 className="text-base sm:text-lg font-semibold">
                    Bookings
                  </h2>
                  <span className="ml-auto text-xs text-cyan-300">
                    Total: {bookings.length}
                  </span>
                </div>

                {bookingsLoading ? (
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-center text-sm text-violet-200 py-4"
                  >
                    Loading bookings...
                  </motion.div>
                ) : bookings.length ? (
                  <div className="space-y-4">
                    {bookings.map((booking, i) => (
                      <motion.div
                        key={booking._id || i}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="border border-slate-800 rounded-xl bg-slate-950/70 p-4 text-sm"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex justify-between items-start gap-3 mb-2">
                              <div>
                                <p className="font-medium text-slate-100">
                                  {booking.serviceName ||
                                    "Service not specified"}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {booking.userId?.name || "Customer"}
                                </p>
                              </div>
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  booking.status
                                )}`}
                              >
                                {booking.status
                                  ? booking.status.charAt(0).toUpperCase() +
                                    booking.status.slice(1)
                                  : "Unknown"}
                              </span>
                            </div>

                            <div className="space-y-0.5 text-slate-300">
                              <p>
                                📅{" "}
                                {booking.bookingDate
                                  ? new Date(
                                      booking.bookingDate
                                    ).toLocaleDateString()
                                  : "Date not set"}
                              </p>
                              <p>
                                🕒 {booking.bookingTime?.startTime || "N/A"} –{" "}
                                {booking.bookingTime?.endTime || "N/A"}
                              </p>
                              {booking.amount && (
                                <p className="text-cyan-300 font-semibold">
                                  ₹{booking.amount}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2 md:flex-col md:w-40">
                            {booking.status !== "confirmed" &&
                              booking.status !== "cancelled" &&
                              booking.status !== "completed" && (
                                <Button
                                  onClick={() =>
                                    handleBookingAction(
                                      booking._id,
                                      "confirmed"
                                    )
                                  }
                                  disabled={updatingBookingId === booking._id}
                                  className="flex-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-200 border border-emerald-500/40 text-xs"
                                >
                                  <Check className="w-3.5 h-3.5 mr-1" />
                                  {updatingBookingId === booking._id
                                    ? "..."
                                    : "Confirm"}
                                </Button>
                              )}

                            <Button
                              onClick={() =>
                                handleBookingAction(booking._id, "cancelled")
                              }
                              disabled={
                                updatingBookingId === booking._id ||
                                booking.status === "confirmed" ||
                                booking.status === "completed"
                              }
                              className={`flex-1 text-xs ${
                                booking.status === "confirmed" ||
                                booking.status === "completed"
                                  ? "bg-slate-700 text-slate-300 cursor-not-allowed"
                                  : "bg-red-500/15 hover:bg-red-500/25 text-red-200 border border-red-500/40"
                              }`}
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1" />
                              {updatingBookingId === booking._id
                                ? "..."
                                : "Cancel"}
                            </Button>

                            {booking.status === "confirmed" && (
                              <Button
                                onClick={() =>
                                  handleBookingAction(
                                    booking._id,
                                    "completed"
                                  )
                                }
                                disabled={updatingBookingId === booking._id}
                                className="flex-1 bg-sky-500/15 hover:bg-sky-500/25 text-sky-200 border border-sky-500/40 text-xs"
                              >
                                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                {updatingBookingId === booking._id
                                  ? "..."
                                  : "Complete"}
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-sm text-slate-400 py-6">
                    No bookings yet.
                  </p>
                )}
              </motion.div>
            )}

            {/* staff */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-slate-800/80 bg-slate-900/70 backdrop-blur-xl rounded-2xl p-6 shadow-[0_16px_40px_rgba(15,23,42,0.7)]"
            >
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-cyan-300" />
                <h2 className="text-base sm:text-lg font-semibold">
                  Staff members
                </h2>
              </div>
              {shop.staff?.length ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {shop.staff.map((member, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -2, scale: 1.01 }}
                      className="border border-slate-800 rounded-xl bg-slate-950/70 p-4 text-sm"
                    >
                      <p className="font-medium text-slate-100">
                        {member.name}
                      </p>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {member.role}
                      </p>
                      <p className="text-slate-400 text-xs">
                        Phone: {member.phone}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Specialization: {member.specialization || "N/A"}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">No staff added yet.</p>
              )}
            </motion.div>
          </div>
        </div>

        <style jsx global>{`
          html,
          body {
            cursor: none !important;
            overflow-x: hidden;
          }
          * {
            cursor: none !important;
          }
          @media (hover: none) {
            html,
            body,
            * {
              cursor: auto !important;
            }
          }
        `}</style>
      </div>
    </>
  );
}
