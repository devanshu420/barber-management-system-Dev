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

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export default function ShopDetailClient() {
  const params = useParams();
  const shopId = params?.shopId;
  const router = useRouter();

  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
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
      } finally {
        setLoading(false);
      }
    }

    fetchShop();
  }, [shopId]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      imageFile: file,
    }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

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
          `Network error: ensure backend is running on ${process.env.NEXT_PUBLIC_API_URL}`,
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

  const handleBookingAction = async (bookingId, newStatus) => {
    if (!bookingId) return;

    try {
      setUpdatingBookingId(bookingId);
      const token = localStorage.getItem("token");

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: newStatus } : b
        )
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
            ? "Booking confirmed!"
            : newStatus === "cancelled"
            ? "Booking cancelled!"
            : newStatus === "completed"
            ? "Booking completed!"
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

  const updateServiceField = (index, field, value) => {
    const updated = [...(formData.services || [])];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      services: updated,
    }));
  };

  const updateStaffField = (index, field, value) => {
    const updated = [...(formData.staff || [])];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      staff: updated,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const token = localStorage.getItem("token");
      const form = new FormData();

      form.append("shopName", formData.shopName || "");
      form.append("description", formData.description || "");
      form.append(
        "location",
        JSON.stringify({
          ...formData.location,
          coordinates: shop?.location?.coordinates || [],
        })
      );
      form.append("services", JSON.stringify(formData.services || []));
      form.append("staff", JSON.stringify(formData.staff || []));

      if (formData.imageFile) {
        form.append("image", formData.imageFile);
      }

      const res = await axios.put(`${API_BASE}/barbers/shops/${shopId}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.success) {
        showToast("Shop updated successfully!", "success");
        setShop(res.data.data);
        setFormData(res.data.data);
        setEditing(false);
        setImagePreview(null);
      } else {
        throw new Error(res.data?.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
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
        return "bg-indigo-500/15 text-indigo-300 border border-indigo-500/40";
      case "confirmed":
        return "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40";
      case "cancelled":
        return "bg-red-500/15 text-red-300 border border-red-500/40";
      case "pending":
        return "bg-yellow-500/15 text-yellow-300 border border-yellow-300/40";
      default:
        return "bg-slate-700/40 text-slate-200 border border-slate-600/60";
    }
  };

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#020617] via-[#050816] to-black px-4 text-cyan-300">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-center text-sm tracking-wide sm:text-base"
        >
          Loading shop details...
        </motion.div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#020617] via-black to-[#020617] px-4 text-gray-300">
        <div className="relative w-full max-w-md rounded-2xl border border-red-500/30 bg-red-500/5 p-5 shadow-xl backdrop-blur-xl sm:p-6">
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/10 via-transparent to-cyan-500/10" />
          <div className="relative space-y-3 text-center">
            <h1 className="text-xl font-semibold text-red-400 sm:text-2xl">
              Error
            </h1>
            <p className="text-sm sm:text-base">{error || "Shop not found"}</p>
            <p className="break-all text-[11px] text-gray-500 sm:text-xs">
              Shop ID: <span className="text-cyan-400">{shopId}</span>
            </p>
            <Button
              onClick={() => router.back()}
              className="mt-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 px-6 py-2 font-semibold text-black shadow-lg shadow-cyan-500/30"
            >
              Go back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        style={{
          transform: `translate(calc(${cursorPos.x}px - 50%), calc(${cursorPos.y}px - 50%))`,
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.2s ease-out",
        }}
      >
        <div
          className={`h-5 w-5 rounded-full border-2 transition-all duration-150 ${
            hovering
              ? "border-cyan-300 bg-cyan-200/40 shadow-[0_0_18px_rgba(34,211,238,0.8)]"
              : "border-cyan-500 bg-cyan-400/30 shadow-[0_0_12px_rgba(56,189,248,0.7)]"
          }`}
        />
      </div>

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed right-3 top-4 z-[9998] max-w-[calc(100vw-24px)] rounded-2xl px-4 py-2.5 text-xs font-medium shadow-xl backdrop-blur-md sm:right-5 sm:top-5 sm:max-w-md sm:text-sm ${
            toast.type === "success" || toast.type === "info"
              ? "border border-emerald-500/40 bg-emerald-500/15 text-emerald-200"
              : "border border-red-500/40 bg-red-500/15 text-red-200"
          }`}
        >
          <span>{toast.message}</span>
        </motion.div>
      )}

      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#020617] via-[#050816] to-black px-3 py-6 font-[system-ui] text-slate-100 sm:px-5 sm:py-8 lg:px-10 lg:py-10">
        <div className="pointer-events-none fixed -right-32 -top-40 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none fixed -bottom-40 -left-32 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative mx-auto w-full max-w-6xl space-y-6 sm:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between"
          >
            <button
              onClick={() => router.back()}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-cyan-300 backdrop-blur-sm transition hover:text-teal-300 sm:text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to shops</span>
            </button>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                onClick={handleToggleBookings}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-xs text-white shadow-lg shadow-fuchsia-500/40 sm:w-auto sm:text-sm"
              >
                <Calendar className="h-4 w-4" />
                {showBookings ? "Hide bookings" : "View bookings"}
              </Button>

              <Button
                onClick={() => setEditing((s) => !s)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 px-4 py-2 text-xs text-black shadow-lg shadow-cyan-500/40 sm:w-auto sm:text-sm"
              >
                {editing ? (
                  <>
                    <X className="h-4 w-4" />
                    Cancel edit
                  </>
                ) : (
                  <>
                    <Edit2 className="h-4 w-4" />
                    Edit shop
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 px-4 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.85)] backdrop-blur-xl sm:px-5 sm:py-4 lg:flex-row lg:items-center lg:justify-between"
          >
            <div className="min-w-0">
              <h1 className="break-words text-lg font-semibold sm:text-2xl">
                {shop.shopName}
              </h1>
              <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                Manage details and bookings for this barbershop.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 sm:gap-4 sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4 text-cyan-300" />
                {shop.staff?.length || 0} staff
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-emerald-300" />
                {shop.services?.length || 0} services
              </span>
            </div>
          </motion.div>

          <div className="space-y-6 sm:space-y-8">
            {!showBookings && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="rounded-2xl border border-slate-800/80 bg-slate-900/70 shadow-[0_16px_40px_rgba(15,23,42,0.8)] backdrop-blur-xl">
                  <CardHeader className="border-b border-slate-800/80 pb-4">
                    <CardTitle className="text-base text-slate-100 sm:text-lg">
                      Shop details
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6 pt-5 sm:space-y-7">
                    {!editing ? (
                      <>
                        <div className="mt-2 space-y-3 sm:mt-4">
                          <h3 className="text-xs uppercase tracking-[0.18em] text-slate-500">
                            Shop image
                          </h3>

                          <div className="flex justify-center">
                            <div className="w-full max-w-3xl">
                              <img
                                src={shop?.image?.url || "/placeholder.jpg"}
                                alt="shop"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.jpg";
                                }}
                                className="h-auto max-h-[220px] w-full rounded-xl border border-slate-800 object-cover object-top sm:max-h-72"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="mb-1.5 text-xs uppercase tracking-[0.18em] text-slate-500">
                            Description
                          </h3>
                          <p className="text-sm leading-relaxed text-slate-200">
                            {shop.description || "No description provided."}
                          </p>
                        </div>

                        <div>
                          <h3 className="mb-1.5 text-xs uppercase tracking-[0.18em] text-slate-500">
                            Location
                          </h3>
                          <div className="space-y-1 text-sm text-slate-200">
                            <p>{shop.location?.address || "N/A"}</p>
                            <p className="text-slate-400">
                              {shop.location?.city || "N/A"},{" "}
                              {shop.location?.state || "N/A"}{" "}
                              {shop.location?.zipCode || ""}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h3 className="mb-1.5 text-xs uppercase tracking-[0.18em] text-slate-500">
                            Services
                          </h3>

                          {shop.services?.length ? (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              {shop.services.map((s, i) => (
                                <motion.div
                                  key={i}
                                  whileHover={{ y: -2, scale: 1.01 }}
                                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm"
                                >
                                  <p className="font-medium text-slate-100">
                                    {s.name}
                                  </p>
                                  <p className="mt-0.5 text-slate-400">
                                    ₹{s.price} • {s.duration} mins
                                  </p>
                                  <p className="mt-1 text-[11px] text-slate-500">
                                    Category: {s.category || "N/A"}
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
                          <label className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-slate-500">
                            Shop name
                          </label>
                          <input
                            type="text"
                            name="shopName"
                            value={formData.shopName || ""}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-slate-500">
                            Description
                          </label>
                          <textarea
                            name="description"
                            value={formData.description || ""}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full resize-none rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                          />
                        </div>

                        <div>
                          <h3 className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                            Location
                          </h3>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {["address", "city", "state", "zipCode"].map((key) => (
                              <input
                                key={key}
                                type="text"
                                name={key}
                                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                                value={formData.location?.[key] || ""}
                                onChange={handleLocationChange}
                                className="w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                              />
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="block text-xs uppercase tracking-[0.18em] text-slate-500">
                            Edit shop image
                          </label>

                          <div className="flex justify-center">
                            <div className="w-full max-w-3xl">
                              <img
                                src={
                                  imagePreview
                                    ? imagePreview
                                    : shop?.image?.url
                                    ? shop.image.url
                                    : "/placeholder.jpg"
                                }
                                alt="preview"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.jpg";
                                }}
                                className="h-52 w-full rounded-xl border border-slate-800 object-cover object-top sm:h-56"
                              />
                            </div>
                          </div>

                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:bg-cyan-400"
                          />
                        </div>

                        <div>
                          <h3 className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                            Services
                          </h3>

                          <div className="space-y-3">
                            {(formData.services || []).map((service, index) => (
                              <div
                                key={index}
                                className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                              >
                                <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                                  <input
                                    type="text"
                                    placeholder="Service name"
                                    value={service.name || ""}
                                    onChange={(e) =>
                                      updateServiceField(index, "name", e.target.value)
                                    }
                                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none"
                                  />

                                  <input
                                    type="number"
                                    placeholder="Price (₹)"
                                    value={service.price || ""}
                                    onChange={(e) =>
                                      updateServiceField(index, "price", e.target.value)
                                    }
                                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none"
                                  />

                                  <input
                                    type="number"
                                    placeholder="Duration (mins)"
                                    value={service.duration || ""}
                                    onChange={(e) =>
                                      updateServiceField(index, "duration", e.target.value)
                                    }
                                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none"
                                  />
                                </div>

                                <div className="flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = (formData.services || []).filter(
                                        (_, i) => i !== index
                                      );
                                      setFormData((prev) => ({
                                        ...prev,
                                        services: updated,
                                      }));
                                    }}
                                    className="text-xs text-red-400 transition hover:text-red-300"
                                  >
                                    Delete Service
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                services: [
                                  ...(prev.services || []),
                                  { name: "", price: "", duration: "", category: "" },
                                ],
                              }))
                            }
                            className="mt-3 text-sm text-cyan-400 transition hover:text-cyan-300"
                          >
                            + Add Service
                          </button>
                        </div>

                        <div>
                          <h3 className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                            Staff
                          </h3>

                          <div className="space-y-3">
                            {(formData.staff || []).map((member, index) => (
                              <div
                                key={index}
                                className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                              >
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                  <input
                                    type="text"
                                    placeholder="Name"
                                    value={member.name || ""}
                                    onChange={(e) =>
                                      updateStaffField(index, "name", e.target.value)
                                    }
                                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none"
                                  />

                                  <input
                                    type="text"
                                    placeholder="Phone"
                                    value={member.phone || ""}
                                    onChange={(e) =>
                                      updateStaffField(index, "phone", e.target.value)
                                    }
                                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none"
                                  />
                                </div>

                                <div className="flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = (formData.staff || []).filter(
                                        (_, i) => i !== index
                                      );
                                      setFormData((prev) => ({
                                        ...prev,
                                        staff: updated,
                                      }));
                                    }}
                                    className="text-xs text-red-400 transition hover:text-red-300"
                                  >
                                    Remove Staff
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                staff: [...(prev.staff || []), { name: "", phone: "" }],
                              }))
                            }
                            className="mt-3 text-sm text-cyan-400 transition hover:text-cyan-300"
                          >
                            + Add Staff
                          </button>
                        </div>

                        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                          <Button
                            type="submit"
                            disabled={updating}
                            className="flex-1 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 text-sm font-semibold text-black disabled:opacity-50"
                          >
                            <Save className="mr-2 h-4 w-4" />
                            {updating ? "Saving..." : "Save changes"}
                          </Button>

                          <Button
                            type="button"
                            onClick={() => {
                              setEditing(false);
                              setImagePreview(null);
                              setFormData(shop);
                            }}
                            className="flex-1 rounded-full border border-slate-600 bg-slate-800 text-sm text-white transition hover:bg-slate-700"
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

            {showBookings && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.8)] backdrop-blur-xl sm:p-6"
              >
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <Calendar className="h-4 w-4 text-violet-300" />
                  <h2 className="text-base font-semibold sm:text-lg">Bookings</h2>
                  <span className="ml-0 text-xs text-cyan-300 sm:ml-auto">
                    Total: {bookings.length}
                  </span>
                </div>

                {bookingsLoading ? (
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="py-4 text-center text-sm text-violet-200"
                  >
                    Loading bookings...
                  </motion.div>
                ) : bookings.length ? (
                  <div className="space-y-4">
                    {bookings.map((booking, i) => {
                      const bookingNumberLabel = booking.bookingNumber || "N/A";

                      return (
                        <motion.div
                          key={booking._id || i}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="rounded-xl border border-gray-700 bg-black/40 p-4 text-sm transition hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(20,220,200,0.15)]"
                        >
                          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="space-y-1">
                              <p className="text-sm font-semibold text-white">
                                Booking #{bookingNumberLabel}
                              </p>
                              <p className="text-[13px] text-slate-300">
                                Service:{" "}
                                <span className="text-slate-100">
                                  {booking.serviceName || "Service not specified"}
                                </span>
                              </p>
                              <p className="text-[13px] text-slate-300">
                                Customer:{" "}
                                <span className="text-slate-100">
                                  {booking.userId?.name || "Customer"}
                                </span>
                              </p>
                            </div>

                            <span
                              className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {booking.status
                                ? booking.status.charAt(0).toUpperCase() +
                                  booking.status.slice(1)
                                : "Unknown"}
                            </span>
                          </div>

                          <div className="mb-3 space-y-1.5 text-sm text-gray-400">
                            <p>
                              Date:{" "}
                              {booking.bookingDate
                                ? new Date(booking.bookingDate).toLocaleDateString()
                                : "Date not set"}
                            </p>
                            <p>
                              Time: {booking.bookingTime?.startTime || "N/A"} –{" "}
                              {booking.bookingTime?.endTime || "N/A"}
                            </p>
                            {booking.amount && <p>Amount: ₹{booking.amount}</p>}
                          </div>

                          <div className="mt-2 flex flex-wrap gap-2">
                            {booking.status !== "confirmed" &&
                              booking.status !== "cancelled" &&
                              booking.status !== "completed" && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() =>
                                    handleBookingAction(booking._id, "confirmed")
                                  }
                                  disabled={updatingBookingId === booking._id}
                                  className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 px-3 py-1.5 text-xs font-semibold text-black shadow-md shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  {updatingBookingId === booking._id ? "..." : "Confirm"}
                                </motion.button>
                              )}

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                handleBookingAction(booking._id, "cancelled")
                              }
                              disabled={
                                updatingBookingId === booking._id ||
                                booking.status === "confirmed" ||
                                booking.status === "completed"
                              }
                              className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold shadow-md ${
                                booking.status === "confirmed" ||
                                booking.status === "completed"
                                  ? "cursor-not-allowed bg-slate-700 text-slate-300"
                                  : "bg-gradient-to-r from-rose-500 to-red-400 text-white shadow-red-500/30"
                              }`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              {updatingBookingId === booking._id ? "..." : "Cancel"}
                            </motion.button>

                            {booking.status === "confirmed" && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  handleBookingAction(booking._id, "completed")
                                }
                                disabled={updatingBookingId === booking._id}
                                className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-400 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/30"
                              >
                                <CheckCircle className="h-3.5 w-3.5" />
                                {updatingBookingId === booking._id ? "..." : "Complete"}
                              </motion.button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="py-6 text-center text-sm text-gray-400">
                    No bookings yet for this shop.
                  </p>
                )}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.7)] backdrop-blur-xl sm:p-6"
            >
              <div className="mb-4 flex items-center gap-2">
                <Users className="h-4 w-4 text-cyan-300" />
                <h2 className="text-base font-semibold sm:text-lg">
                  Staff members
                </h2>
              </div>

              {shop.staff?.length ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {shop.staff.map((member, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -2, scale: 1.01 }}
                      className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm"
                    >
                      <p className="font-medium text-slate-100">{member.name}</p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {member.role || "Staff"}
                      </p>
                      <p className="text-xs text-slate-400">
                        Phone: {member.phone || "N/A"}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
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
            cursor: auto !important;
            overflow-x: hidden;
          }

          * {
            cursor: auto !important;
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