"use client";

import Head from "next/head";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Building2, Star } from "lucide-react";

export default function BarberDashboardPage() {
  const router = useRouter();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const cursorRef = useRef(null);
  const glowRef = useRef(null);

  // Get barberId safely from localStorage (client-side only)
  const barberId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  // Redirect if not logged in
  useEffect(() => {
    if (!barberId) {
      router.push("/auth/barber-login");
      return;
    }

    let mounted = true;

    async function fetchShops() {
      setLoading(true);
      try {
        const { data } = await axios.get(`http://localhost:5000/api/barbers/barbershops?barberId=${barberId}`);
        if (mounted) {
          setShops(data.success ? data.shops : []);
        }
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

  // Floating cursor + glow animation
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

  // Motion variants
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div
        className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#071012] via-[#0b0e13] to-[#030405] px-4 sm:px-6 lg:px-8 py-12 font-sans"
        style={{ fontFamily: "Poppins, ui-sans-serif, system-ui" }}
      >
        {/* Floating glow */}
        <div
          ref={glowRef}
          className="pointer-events-none fixed z-20 w-40 h-40 rounded-full blur-3xl opacity-40 bg-gradient-to-tr from-cyan-400/40 to-teal-500/20 mix-blend-screen"
        />
        {/* Custom cursor */}
        <div
          ref={cursorRef}
          className="pointer-events-none fixed z-30 w-4 h-4 rounded-full bg-teal-400 shadow-[0_0_12px_rgba(20,200,180,0.6)]"
        />

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">My Shops</h1>
              <p className="mt-2 text-sm text-gray-400 max-w-xl">
                Manage your barber shops — edit details, view services, and check ratings. Clean, premium dark UI with subtle motion.
              </p>
            </div>

            <Link href="/barber-shop-registration">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative inline-flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 text-black font-semibold shadow-2xl shadow-cyan-800/30 transform-gpu"
              >
                <motion.span
                  animate={{ rotate: [0, 6, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="flex items-center"
                >
                  <Plus className="w-5 h-5" />
                </motion.span>
                <span>Add New Shop</span>
                <span className="absolute inset-0 rounded-full opacity-0 hover:opacity-30 pointer-events-none transition-opacity duration-500 bg-gradient-to-r from-white/10 via-white/30 to-white/10 mix-blend-screen" />
              </motion.button>
            </Link>
          </div>

          {/* Main Section */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-44 rounded-xl bg-gradient-to-br from-gray-800/60 to-gray-900/40 border border-gray-700 backdrop-blur-sm p-4 overflow-hidden relative"
                >
                  <div className="absolute inset-0 -z-10 shimmer" />
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-md bg-gray-700 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse" />
                      <div className="h-3 bg-gray-700 rounded w-1/2 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
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
                    <Card className="overflow-hidden border border-gray-700 rounded-2xl bg-gradient-to-br from-[#0b1114]/60 to-[#061011]/40 backdrop-blur-md shadow-lg transition-transform transform hover:shadow-[0_20px_60px_rgba(20,220,200,0.08)] cursor-pointer">
                      <CardHeader className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                          <motion.div
                            whileHover={{ scale: 1.12 }}
                            className="p-2 rounded-lg bg-gradient-to-tr from-cyan-600/10 to-teal-400/6 border border-gray-700"
                          >
                            <Building2 className="w-10 h-10 text-cyan-300 drop-shadow-[0_4px_12px_rgba(50,230,200,0.06)]" />
                          </motion.div>

                          <div>
                            <CardTitle className="text-white text-lg font-semibold truncate max-w-xs">
                              {shop.shopName}
                            </CardTitle>
                            <p className="text-xs text-gray-400">{shop.location?.city || "Unknown city"}</p>
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
                          {shop.description || "No description provided."}
                        </p>
                        <p className="text-xs text-gray-400 mb-2">
                          <strong className="text-gray-200">Address:</strong>{" "}
                          {shop.location?.address || "N/A"}
                        </p>
                        <p className="text-xs text-gray-400 mb-4">
                          <strong className="text-gray-200">Services:</strong>{" "}
                          {shop.services?.map((s) => s.name).join(", ") || "—"}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-300">
                            {shop.ratings?.count || 0} reviews
                          </div>
                          <motion.div whileHover={{ scale: 1.03 }}>
                            <button className="px-3 py-1 rounded-full border border-gray-700 text-sm text-gray-200 hover:border-cyan-400 hover:shadow-[0_8px_24px_rgba(20,220,200,0.06)] transition">
                              View
                            </button>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Global styles */}
        <style jsx global>{`
          @keyframes shimmer {
            0% {
              background-position: -500px 0;
            }
            100% {
              background-position: 500px 0;
            }
          }
          .shimmer {
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.02) 0%,
              rgba(255, 255, 255, 0.04) 50%,
              rgba(255, 255, 255, 0.02) 100%
            );
            background-size: 1000px 100%;
            animation: shimmer 1.6s infinite linear;
          }
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


// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Plus, Building2 } from "lucide-react";

// export default function BarberDashboardPage() {
//   const router = useRouter();
//   const [shops, setShops] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Safely get barberId only on client side
//   const barberId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

//   useEffect(() => {
//     if (!barberId) {
//       router.push("/auth/barber-login");
//       return;
//     }

//     async function fetchShops() {
//       setLoading(true);
//       try {
//         const response = await axios.get(`http://localhost:5000/api/barbers/barbershops?barberId=${barberId}`);
//         if (response.data.success) {
//           setShops(response.data.shops);
//         } else {
//           setShops([]);
//         }
//       } catch (error) {
//         console.error("Failed to fetch shops:", error);
//         setShops([]);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchShops();
//   }, [barberId, router]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black px-4 sm:px-6 lg:px-8 py-12">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-12 flex justify-between items-center">
//           <h1 className="text-4xl font-bold text-white">My Shops</h1>
//           <Link href="/barber-shop-registration" passHref>
//             <Button className="flex items-center space-x-2">
//               <Plus className="w-5 h-5" />
//               <span>Add New Shop</span>
//             </Button>
//           </Link>
//         </div>

//         {loading ? (
//           <div className="text-center text-gray-400">Loading your shops...</div>
//         ) : shops.length === 0 ? (
//           <div className="text-center text-gray-400">
//             No shops registered yet. <br />
//             Click &quot;Add New Shop&quot; to get started.
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {shops.map((shop) => (
//               <Link
//                 key={shop._id}
//                 href={`/barber-shop/${shop._id}`}
//                 passHref
//                 legacyBehavior // Optional if using older Next.js, remove if using Link with <a>
//               >
//                 <a>
//                   <Card className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg hover:shadow-teal-500/50 transition-shadow cursor-pointer">
//                     <CardHeader className="flex items-center space-x-4">
//                       <Building2 className="w-10 h-10 text-teal-400" />
//                       <CardTitle className="text-white font-semibold truncate">{shop.shopName}</CardTitle>
//                     </CardHeader>
//                     <CardContent className="text-gray-300">
//                       <p className="mb-2">{shop.description || "No description provided."}</p>
//                       <p>
//                         <strong>Location:</strong> {shop.location?.address}, {shop.location?.city}
//                       </p>
//                       <p>
//                         <strong>Services:</strong> {shop.services?.map((s) => s.name).join(", ")}
//                       </p>
//                       <p>
//                         <strong>Rating:</strong> {shop.ratings?.average?.toFixed(1) || "0"} ({shop.ratings?.count || 0} reviews)
//                       </p>
//                     </CardContent>
//                   </Card>
//                 </a>
//               </Link>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Plus, Building2 } from "lucide-react";

// export default function BarberDashboardPage() {
//   const router = useRouter();
//   const [shops, setShops] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const barberId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

//   useEffect(() => {
//     if (!barberId) {
//       router.push("/auth/barber-login");
//       return;
//     }

//     async function fetchShops() {
//       setLoading(true);
//       try {
//         console.log("Fetching shops for barberId:", barberId);
//         const response = await axios.get(`http://localhost:5000/api/barbers/barbershops?barberId=${barberId}`);
//         // console.log("Response data:", response.data);

//         if (response.data.success) {
//           setShops(response.data.shops);
//           // console.log("Shops set in state:", response.data.shops);
//         } else {
//           setShops([]);
//         }
//       } catch (error) {
//         console.error("Failed to fetch shops:", error);
//         setShops([]);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchShops();
//   }, [barberId, router]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black px-4 sm:px-6 lg:px-8 py-12">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-12 flex justify-between items-center">
//           <h1 className="text-4xl font-bold text-white">My Shops</h1>
//           <Link href="/barber-shop-registration" passHref>
//             <Button className="flex items-center space-x-2">
//               <Plus className="w-5 h-5" />
//               <span>Add New Shop</span>
//             </Button>
//           </Link>
//         </div>

//         {loading ? (
//           <div className="text-center text-gray-400">Loading your shops...</div>
//         ) : shops.length === 0 ? (
//           <div className="text-center text-gray-400">
//             No shops registered yet. <br />
//             Click &quot;Add New Shop&quot; to get started.
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {shops.map((shop) => (
//               <Card
//                 key={shop._id}
//                 className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg hover:shadow-teal-500/50 transition-shadow"
//               >
//                 <CardHeader className="flex items-center space-x-4">
//                   <Building2 className="w-10 h-10 text-teal-400" />
//                   <CardTitle className="text-white font-semibold truncate">{shop.shopName}</CardTitle>
//                 </CardHeader>
//                 <CardContent className="text-gray-300">
//                   <p className="mb-2">{shop.description || "No description provided."}</p>
//                   <p>
//                     <strong>Location:</strong> {shop.location?.address}, {shop.location?.city}
//                   </p>
//                   <p>
//                     <strong>Services:</strong> {shop.services?.map((s) => s.name).join(", ")}
//                   </p>
//                   <p>
//                     <strong>Rating:</strong> {shop.ratings?.average?.toFixed(1) || "0"} ({shop.ratings?.count || 0} reviews)
//                   </p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

