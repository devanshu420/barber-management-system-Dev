"use client";

import Head from "next/head";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Building2, Star, Bell, Search, LogOut } from "lucide-react";
// import { io } from "socket.io-client";

export default function BarberDashboardPage() {
  const router = useRouter();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showSearchModal, setShowSearchModal] = useState(false);
  const [bookingNumber, setBookingNumber] = useState("");
  const [bookingResult, setBookingResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const cursorRef = useRef(null);
  const glowRef = useRef(null);

  const barberId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  // fetch shops
  useEffect(() => {
    if (!barberId) {
      router.push("/auth/barber-login");
      return;
    }

    let mounted = true;

    async function fetchShops() {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/barbers/barbershops/${barberId}`
        );

        if (mounted) setShops(data.success ? data.data : []);
      } catch (error) {
        console.error("Failed to fetch shops:", error);
        setShops([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchShops();
    return () => {
      mounted = false;
    };
  }, [barberId, router]);

  // socket notifications
  // useEffect(() => {
  //   if (!barberId) return;

  //   const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
  //     transports: ["websocket"],
  //     withCredentials: true,
  //   });

  //   socket.on("connect", () => {
  //     socket.emit("joinBarberRoom", barberId);
  //   });

  //   socket.on("newBooking", (data) => {
  //     setNotifications((prev) => [
  //       {
  //         message: `New booking at ${data.shopName} for ${data.service}`,
  //         time: new Date().toLocaleTimeString(),
  //       },
  //       ...prev,
  //     ]);
  //   });

  //   return () => socket.disconnect();
  // }, [barberId]);

  // cursor glow
  useEffect(() => {
    const cursor = cursorRef.current;
    const glow = glowRef.current;
    if (!cursor || !glow) return;

    let mouseX = 0,
      mouseY = 0,
      posX = 0,
      posY = 0;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      posX += (mouseX - posX) * 0.15;
      posY += (mouseY - posY) * 0.15;
      cursor.style.transform = `translate3d(${posX - 8}px, ${posY - 8}px, 0)`;
      glow.style.transform = `translate3d(${posX - 60}px, ${posY - 60}px, 0)`;
      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    animate();
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  };

  // search booking
  const searchBooking = async () => {
    if (!bookingNumber) {
      setSearchError("Please enter booking number");
      return;
    }

    try {
      setSearchLoading(true);
      setSearchError("");

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/search/${bookingNumber}`
      );

      setBookingResult(res.data.data);
    } catch (err) {
      setBookingResult(null);
      setSearchError(err?.response?.data?.message || "Booking not found");
    } finally {
      setSearchLoading(false);
    }
  };

  const updateBookingStatus = async (status) => {
    if (!bookingResult) return;

    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingResult._id}/status`,
        { status },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (res.data?.success) {
        setBookingResult(res.data.data);

        showToast(
          status === "confirmed"
            ? "✅ Booking confirmed!"
            : status === "cancelled"
            ? "❌ Booking cancelled!"
            : status === "completed"
            ? "🎉 Booking completed!"
            : "Booking updated"
        );
      }
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Failed to update booking",
        "error"
      );
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.clear();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.clear();
      router.push("/auth/login");
    }
  };

  return (
    <>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed top-5 right-5 z-[9998] px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium shadow-xl flex items-center gap-2 backdrop-blur-md ${
            toast.type === "success"
              ? "bg-emerald-500/15 text-emerald-200 border border-emerald-500/40"
              : "bg-red-500/15 text-red-200 border border-red-500/40"
          }`}
        >
          {toast.message}
        </motion.div>
      )}

      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#071012] via-[#0b0e13] to-[#030405] px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Glow Cursor */}
        <div
          ref={glowRef}
          className="pointer-events-none fixed z-20 w-32 sm:w-40 h-32 sm:h-40 rounded-full blur-3xl opacity-40 bg-gradient-to-tr from-cyan-400/40 to-teal-500/20 mix-blend-screen"
        />
        <div
          ref={cursorRef}
          className="pointer-events-none fixed z-30 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-teal-400 shadow-[0_0_12px_rgba(20,200,180,0.6)]"
        />

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 relative">
            <div className="w-full sm:w-auto">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                My Shops
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-gray-400 max-w-xl">
                Manage your barber shops — edit details, view services & ratings.
              </p>
            </div>

            {/* Right controls */}
            <div className="relative flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 justify-end w-full sm:w-auto">
              {/* Notifications */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="relative cursor-pointer order-1"
                onClick={() => setShowNotifications((v) => !v)}
              >
                <Bell className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </motion.div>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute top-9 sm:top-10 right-0 bg-gray-900 border border-gray-700 rounded-lg shadow-lg w-64 sm:w-72 z-50">
                  <div className="p-3 border-b border-gray-700 text-gray-300 font-semibold text-xs sm:text-sm">
                    Notifications
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-3 text-xs sm:text-sm text-gray-400 text-center">
                        No new notifications
                      </div>
                    ) : (
                      notifications.map((n, i) => (
                        <div
                          key={i}
                          className="p-3 border-b border-gray-800 text-gray-300 text-xs sm:text-sm"
                        >
                          {n.message}
                          <div className="text-[10px] sm:text-xs text-gray-500 mt-1">
                            {n.time}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Search Booking */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowSearchModal(true)}
                className="order-3 sm:order-2 flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-900 border border-slate-700 text-[11px] sm:text-sm text-white hover:border-cyan-400"
              >
                <Search className="w-4 h-4 text-cyan-400" />
                <span className="hidden xs:inline">Search Booking</span>
                <span className="xs:hidden">Search</span>
              </motion.button>

              {/* Add Shop */}
              <Link href="/barber-shop-registration" className="order-2 sm:order-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 text-black text-xs sm:text-sm font-semibold shadow-lg"
                >
                  <Plus className="w-4 h-4" /> Add Shop
                </motion.button>
              </Link>

              {/* Logout */}
              <Button
                onClick={handleLogout}
                className="order-4 bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/50 text-xs sm:text-sm cursor-pointer transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_15px_rgba(255,80,80,0.5)]"
              >
                <LogOut className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden">Logout</span>
              </Button>
            </div>
          </div>

          {/* Shop Cards */}
          {loading ? (
            <div className="text-gray-400 text-center py-12 sm:py-16 text-sm sm:text-base">
              Loading shops...
            </div>
          ) : shops.length === 0 ? (
            <div className="text-center text-gray-400 py-12 sm:py-16">
              <p className="mb-4 text-sm sm:text-base">
                No shops registered yet.
              </p>
              <Link href="/barber-shop-registration">
                <Button className="px-4 sm:px-6 py-2 sm:py-3 bg-transparent border border-gray-700 text-gray-200 text-xs sm:text-sm hover:border-cyan-400 hover:scale-105 transition-transform">
                  Add your first shop
                </Button>
              </Link>
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {shops.map((shop) => (
                <motion.div
                  key={shop._id}
                  variants={cardVariant}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Link href={`/barber-shop/${shop._id}`} className="block h-full">
                    <Card className="h-full overflow-hidden border border-gray-700 rounded-2xl bg-gradient-to-br from-[#0b1114]/60 to-[#061011]/40 backdrop-blur-md shadow-lg hover:shadow-[0_20px_60px_rgba(20,220,200,0.08)] transition-shadow">
                      {/* image */}
                      <div className="relative w-full rounded-xl overflow-hidden border border-gray-800 bg-gray-900/70">
                        <div className="relative w-full pt-[60%]">
                          <img
                            src={
                              shop.image?.url ||
                              "https://via.placeholder.com/600x300?text=Barbershop"
                            }
                            alt={shop.shopName}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://via.placeholder.com/600x300?text=Barbershop";
                            }}
                          />
                        </div>
                      </div>

                      <CardHeader className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-300" />
                          <div>
                            <CardTitle className="text-white text-sm sm:text-lg font-semibold truncate max-w-[160px] sm:max-w-xs">
                              {shop.shopName}
                            </CardTitle>
                            <p className="text-[11px] sm:text-xs text-gray-400">
                              {shop.location?.city || "Unknown city"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2 text-yellow-400">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" />
                          <span className="text-xs sm:text-sm text-white font-medium">
                            {(shop.ratings?.average || 0).toFixed(1)}
                          </span>
                        </div>
                      </CardHeader>

                      <CardContent className="p-4 pt-0 text-gray-300">
                        <p className="mb-3 text-xs sm:text-sm line-clamp-3">
                          {shop.description || "No description available"}
                        </p>
                        <p className="text-[11px] sm:text-xs text-gray-400">
                          <strong>Address:</strong> {shop.location?.address}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Search Booking Modal */}
        {showSearchModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-3">
            <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-4 sm:p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base sm:text-lg text-white font-semibold">
                  Search Booking
                </h2>

                <button
                  onClick={() => {
                    setShowSearchModal(false);
                    setBookingResult(null);
                    setBookingNumber("");
                  }}
                  className="text-gray-400 hover:text-white text-sm sm:text-base"
                >
                  ✕
                </button>
              </div>

              {/* Input */}
              <div className="mb-4 w-full">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Enter Booking Number (BK0001)"
                    value={bookingNumber}
                    onChange={(e) => setBookingNumber(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-black border border-gray-700 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
                  />

                  <button
                    onClick={searchBooking}
                    disabled={searchLoading}
                    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-cyan-500 text-black rounded-lg text-xs sm:text-sm min-w-[100px] sm:min-w-[110px]"
                  >
                    {searchLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Searching
                      </>
                    ) : (
                      "Search"
                    )}
                  </button>
                </div>

                {searchError && (
                  <div className="mt-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2">
                    <p className="text-xs sm:text-sm text-red-400 font-medium">
                      ❌ {searchError}
                    </p>
                  </div>
                )}
              </div>

              {/* Booking Result */}
              {bookingResult && (
                <div className="bg-black/40 border border-gray-700 rounded-lg p-4">
                  <p className="text-white font-semibold mb-2 text-sm sm:text-base">
                    Booking {bookingResult.bookingNumber}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-400">
                    Customer: {bookingResult.userId?.name}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-400">
                    Date:{" "}
                    {new Date(
                      bookingResult.bookingDate
                    ).toLocaleDateString()}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-400">
                    Time: {bookingResult.bookingTime?.startTime}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-400 mb-3">
                    Status:
                    <span className="ml-1 text-cyan-400">
                      {bookingResult.status}
                    </span>
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    {bookingResult.status !== "confirmed" &&
                      bookingResult.status !== "cancelled" &&
                      bookingResult.status !== "completed" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateBookingStatus("confirmed")}
                          className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-black text-xs sm:text-sm font-semibold shadow-lg hover:shadow-[0_0_18px_rgba(20,220,200,0.6)] transition-all duration-300 cursor-pointer"
                        >
                          Confirm
                        </motion.button>
                      )}

                    {bookingResult.status !== "cancelled" &&
                      bookingResult.status !== "completed" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateBookingStatus("cancelled")}
                          className="flex-1 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-400 text-white text-xs sm:text-sm font-semibold shadow-lg hover:shadow-[0_0_18px_rgba(255,80,80,0.6)] transition-all duration-300 cursor-pointer"
                        >
                          Reject
                        </motion.button>
                      )}

                    {bookingResult.status === "confirmed" && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateBookingStatus("completed")}
                        className="flex-1 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-400 text-white text-xs sm:text-sm font-semibold shadow-lg hover:shadow-[0_0_18px_rgba(80,140,255,0.6)] transition-all duration-300 cursor-pointer"
                      >
                        Complete
                      </motion.button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <style jsx global>{`
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          body,
          .__next {
            cursor: auto;
          }
          @media (hover: none) {
            body,
            .__next {
              cursor: auto;
            }
          }
        `}</style>
      </div>
    </>
  );
}
