"use client";

import Head from "next/head";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Building2, Star, Bell } from "lucide-react";
import { io } from "socket.io-client";

export default function BarberDashboardPage() {
  const router = useRouter();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔔 Notification states
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const cursorRef = useRef(null);
  const glowRef = useRef(null);

  const barberId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  // =============================
  // 🔥 Fetch all shops of barber
  // =============================
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
          `https://barber-book-devanshu.onrender.com/api/barbers/barbershops/${barberId}`,
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

  // 🔥 SOCKET.IO REAL-TIME NOTIFICATIONS
  useEffect(() => {
    if (!barberId) return;

    const socket = io("https://barber-book-devanshu.onrender.com", {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("joinBarberRoom", barberId);
    });

    socket.on("newBooking", (data) => {
      console.log("📩 New booking received:", data);

      setNotifications((prev) => [
        {
          message: `New booking at ${data.shopName} for ${data.service}`,
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    });

    return () => socket.disconnect();
  }, [barberId]);

  // =============================
  // Cursor Glow UI
  // =============================
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

  return (
    <>
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

      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#071012] via-[#0b0e13] to-[#030405] px-4 sm:px-6 lg:px-8 py-12">
        {/* Glow Cursor */}
        <div
          ref={glowRef}
          className="pointer-events-none fixed z-20 w-40 h-40 rounded-full blur-3xl opacity-40 bg-gradient-to-tr from-cyan-400/40 to-teal-500/20 mix-blend-screen"
        />
        <div
          ref={cursorRef}
          className="pointer-events-none fixed z-30 w-4 h-4 rounded-full bg-teal-400 shadow-[0_0_12px_rgba(20,200,180,0.6)]"
        />

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                My Shops
              </h1>
              <p className="mt-2 text-sm text-gray-400 max-w-xl">
                Manage your barber shops — edit details, view services &
                ratings.
              </p>
            </div>

            {/* 🔔 Notification Icon */}
            <div className="relative flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="relative cursor-pointer"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-7 h-7 text-cyan-400" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </motion.div>

              {/* 🔔 Notification Dropdown */}
              {showNotifications && (
                <div className="absolute top-10 right-0 bg-gray-900 border border-gray-700 rounded-lg shadow-lg w-72 z-50">
                  <div className="p-3 border-b border-gray-700 text-gray-300 font-semibold">
                    Notifications
                  </div>

                  <div className="max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-3 text-sm text-gray-400 text-center">
                        No new notifications
                      </div>
                    ) : (
                      notifications.map((n, i) => (
                        <div
                          key={i}
                          className="p-3 border-b border-gray-800 text-gray-300 text-sm"
                        >
                          {n.message}
                          <div className="text-xs text-gray-500 mt-1">
                            {n.time}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              <Link href="/barber-shop-registration">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 text-black font-semibold shadow-lg"
                >
                  <Plus className="w-4 h-4" /> Add Shop
                </motion.button>
              </Link>
            </div>
          </div>

          {/* Shop Cards */}
          {loading ? (
            <div className="text-gray-400 text-center py-16">
              Loading shops...
            </div>
          ) : shops.length === 0 ? (
            <div className="text-center text-gray-400 py-16">
              <p className="mb-4">No shops registered yet.</p>
              <Link href="/barber-shop-registration">
                <Button className="px-6 py-3 bg-transparent border border-gray-700 text-gray-200 hover:border-cyan-400 hover:scale-105 transition-transform">
                  Add your first shop
                </Button>
              </Link>
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {shops.map((shop) => (
                <motion.div
                  key={shop._id}
                  variants={cardVariant}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Link href={`/barber-shop/${shop._id}`}>
                    <Card className="overflow-hidden border border-gray-700 rounded-2xl bg-gradient-to-br from-[#0b1114]/60 to-[#061011]/40 backdrop-blur-md shadow-lg hover:shadow-[0_20px_60px_rgba(20,220,200,0.08)]">
                      {/* Shop image */}
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
                        <div className="flex items-center gap-4">
                          <Building2 className="w-10 h-10 text-cyan-300" />
                          <div>
                            <CardTitle className="text-white text-lg font-semibold truncate max-w-xs">
                              {shop.shopName}
                            </CardTitle>
                            <p className="text-xs text-gray-400">
                              {shop.location?.city || "Unknown city"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-yellow-400">
                          <Star className="w-4 h-4 mr-1" />
                          <span className="text-sm text-white font-medium">
                            {(shop.ratings?.average || 0).toFixed(1)}
                          </span>
                        </div>
                      </CardHeader>

                      <CardContent className="p-4 pt-0 text-gray-300">
                        <p className="mb-3 text-sm line-clamp-3">
                          {shop.description || "No description available"}
                        </p>
                        <p className="text-xs text-gray-400">
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

        <style jsx global>{`
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          body,
          .__next {
            cursor: none;
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
