"use client";

import React, { useEffect, useState, useRef, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scissors,
  Clock,
  Star,
  CalendarClock,
  Gift,
  Smartphone,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import io from "socket.io-client";
import { useRouter } from "next/navigation";


// ========== BUTTON COMPONENT ==========
const Button = forwardRef(
  ({ className = "", variant = "default", size = "default", children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-semibold transition-all rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer";

    const variants = {
      default:
        "bg-gradient-to-r from-cyan-500 to-teal-500 text-black hover:from-cyan-600 hover:to-teal-600 shadow-lg hover:shadow-cyan-500/60 transform hover:scale-105 hover:shadow-2xl",
      outline:
        "border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-500/10 transition",
      ghost: "hover:bg-white/10 text-white",
    };

    const sizes = {
      sm: "h-9 px-4 text-sm",
      default: "h-10 px-5 text-base",
      lg: "h-13 px-8 text-lg py-3",
      icon: "h-10 w-10",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

// ========== FUTURISTIC CURSOR ==========
function FuturisticCursor() {
  const cursorRef = useRef(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };
    const handleMouseLeave = () => setIsVisible(false);
    
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);


 


  useEffect(() => {
    document.body.style.cursor = "none";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  useEffect(() => {
    const setHover = () => setHovering(true);
    const clearHover = () => setHovering(false);
    const els = document.querySelectorAll(
      "button, a, [role='button'], input, label, textarea"
    );
    els.forEach((el) => {
      el.addEventListener("mouseenter", setHover);
      el.addEventListener("mouseleave", clearHover);
    });
    return () => {
      els.forEach((el) => {
        el.removeEventListener("mouseenter", setHover);
        el.removeEventListener("mouseleave", clearHover);
      });
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-10000 pointer-events-none"
      style={{
        transform: `translate(calc(${cursorPos.x}px - 50%), calc(${cursorPos.y}px - 50%))`,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.2s ease-out",
      }}
    >
      <motion.div
        animate={{
          scale: hovering ? 1.5 : 1,
        }}
        transition={{ duration: 0.2 }}
        className={`w-5 h-5 rounded-full border-2 transition-all duration-150 ${
          hovering
            ? "border-cyan-300 bg-cyan-200/50 shadow-lg shadow-cyan-400/80"
            : "border-cyan-500 bg-cyan-400/30 shadow-lg shadow-cyan-400/50"
        }`}
        style={{
          boxShadow: hovering
            ? "0 0 30px 10px rgba(34,211,238,0.7), 0 0 60px 20px rgba(34,211,238,0.4)"
            : "0 0 20px 6px rgba(34,211,238,0.5), 0 0 40px 12px rgba(34,211,238,0.2)",
        }}
      />
    </div>
  );
}

// ========== HERO SLIDER WITH NAVIGATION ==========
function HeroSlider() {
  const heroImages = ["/hero1.png", "/hero2.png", "/hero3.png", "/hero4.png"];

  const [index, setIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState({});
  const [autoPlay, setAutoPlay] = useState(true);
  const [notifications, setNotifications] = useState([]);
const [showNotifications, setShowNotifications] = useState(false);
const router = useRouter();

// REDIRECT BARBER TO DASHBOARD IF THEY ACCESS USER SITE

useEffect(() => {
    const role = localStorage.getItem("userRole");

    // If BARBER tries to access user website → Redirect to barber dashboard
    if (role === "barber") {
      router.replace("http://localhost:3000/barber-shop");
    }
  }, []);

 // ========= SOCKET.IO FOR USER NOTIFICATIONS ==========

  useEffect(() => {
  const userId = localStorage.getItem("userId");

  if (!userId) return; // user not logged in → no notifications

  const socket = io("http://localhost:5000");

  socket.emit("joinUserRoom", userId);

  socket.on("bookingUpdate", (data) => {
    alert(data.message); // temporary popup
    console.log("New user notification:", data);
  });

  return () => socket.disconnect();
}, []);









  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoPlay, heroImages.length]);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    setAutoPlay(false);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % heroImages.length);
    setAutoPlay(false);
  };

  const onImageError = (i) => {
    setImageErrors((prev) => ({ ...prev, [i]: true }));
  };

  return (
    <div className="relative w-full h-screen max-h-screen overflow-hidden rounded-3xl shadow-2xl group">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {!imageErrors[index] ? (
            <Image
              src={heroImages[index]}
              alt={`Hero Slide ${index + 1}`}
              fill
              priority={index === 0}
              onError={() => onImageError(index)}
              className="object-cover"
              sizes="100vw"
              quality={85}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-linear-to-br from-cyan-900 via-black to-teal-900">
              <div className="text-center">
                <Scissors className="w-16 h-16 mx-auto mb-4 text-cyan-300 opacity-40" />
                <p className="text-cyan-300 font-semibold">Image Not Available</p>
                <small className="text-cyan-400 text-sm block mt-2">
                  Place image at: /hero{index + 1}.jpg
                </small>
              </div>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/60" />
        </motion.div>
      </AnimatePresence>

      {/* Hero Content */}
      {/* <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight text-white drop-shadow-2xl mb-4">
            Welcome to{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 animate-pulse">
              The Barber Studio
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-lg md:text-2xl text-gray-200 drop-shadow-lg max-w-2xl mb-8"
        >
          Redefining grooming with modern style and precision.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/booking">
            <a>
              <Button size="lg" className="shadow-2xl">
                Book Your Style <ArrowRight className="ml-2" />
              </Button>
            </a>
          </Link>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </motion.div>
      </div> */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20">
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3, duration: 1 }}
  >
    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight text-white drop-shadow-2xl mb-4">
      Elevate Your{" "}
      <span className="bg-clip-text text-transparent bg-linear-to-r from-cyan-400 via-teal-300 to-cyan-400 animate-pulse">
        Barber Business
      </span>
    </h1>
  </motion.div>

  <motion.p
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5, duration: 1 }}
    className="text-lg md:text-2xl text-gray-200 drop-shadow-lg max-w-2xl mb-8"
  >
    A modern Barber Management System designed to streamline bookings,
    manage staff, track inventory, and enhance your customer experience — 
    all in one smart platform.
  </motion.p>

  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.7, duration: 0.8 }}
    className="flex flex-col sm:flex-row gap-4"
  >
    <Link href="/booking">
    
        <Button size="lg" className="shadow-2xl">
          Get Started <ArrowRight className="ml-2" />
        </Button>
     
    </Link>
    <Button size="lg" variant="outline">
      Learn More
    </Button>
  </motion.div>
</div>


     
 {/* Navigation Arrows */}
{/* Navigation Arrows */}
<Button
  onClick={handlePrev}
  variant="ghost"
  size="icon"
  className="absolute left-6 top-1/2 transform -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md bg-black/30"
>
  <ChevronLeft className="w-6 h-6" />
</Button>

<Button
  onClick={handleNext}
  variant="ghost"
  size="icon"
  className="absolute right-6 top-1/2 transform -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md bg-black/30"
>
  <ChevronRight className="w-6 h-6" />
</Button>



      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
        {heroImages.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => {
              setIndex(i);
              setAutoPlay(false);
            }}
            className={`transition-all rounded-full ${
              i === index
                ? "bg-cyan-400 w-8 h-2"
                : "bg-gray-500 w-2 h-2 hover:bg-gray-300"
            }`}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>
    </div>
  );
}

// ========== FEATURE CARD COMPONENT ==========
function FeatureCard({ Icon, title, description, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      whileHover={{
        scale: 1.08,
        boxShadow: "0 0 30px rgba(34,211,238,0.5)",
      }}
      className="group relative bg-linear-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-8 overflow-hidden transition-all cursor-default"
    >
      {/* Gradient Background on Hover */}
      <div className="absolute inset-0 bg-linear-to-br from-cyan-500/10 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Icon */}
      <motion.div
        whileHover={{ rotate: 360, scale: 1.15 }}
        transition={{ duration: 0.6 }}
        className="mb-5 w-16 h-16 bg-linear-to-br from-cyan-400 to-teal-400 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/50"
      >
        <Icon className="w-8 h-8 text-white" strokeWidth={1.5} />
      </motion.div>

      {/* Title & Description */}
      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
        {title}
      </h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>

      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-cyan-400 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
    </motion.div>
  );
}

// ========== SHIMMER PLACEHOLDER ==========
const ShimmerPlaceholder = () => (
  <div className="relative h-60 bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 overflow-hidden">
    <div className="absolute inset-0 shimmer-effect" />
  </div>
);

// ========== MAIN HOME PAGE ==========
export default function Home() {
  const [loading, setLoading] = useState(true);
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFeatures([
        {
          icon: Scissors,
          title: "Expert Barbers",
          description: "Professionally trained barbers for every style.",
        },
        {
          icon: CalendarClock,
          title: "Instant Booking",
          description: "Book your seat anytime, no waiting hassle.",
        },
        {
          icon: Star,
          title: "Top Rated",
          description: "4.9 stars with 1000+ happy clients.",
        },
        {
          icon: Clock,
          title: "Quick Service",
          description: "Get styled in just 15 minutes average.",
        },
        {
          icon: Gift,
          title: "Loyalty Rewards",
          description: "Earn points and redeem exciting offers.",
        },
        {
          icon: Smartphone,
          title: "Smart Reminders",
          description: "Never miss your appointment again.",
        },
      ]);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-linear-to-br from-black via-gray-950 to-cyan-950 text-white overflow-x-hidden select-none">
      <FuturisticCursor />

      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Hero Section */}
        <HeroSlider />

        {/* Features Section */}
        <section className="mt-24 sm:mt-32 lg:mt-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16 sm:mb-20"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
              Why Choose{" "}
              <span className="bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-teal-400">
                The Barber Studio
              </span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto drop-shadow-sm">
              Experience premium grooming with cutting-edge technology and expert care.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {loading
              ? [1, 2, 3, 4, 5, 6].map((k) => <ShimmerPlaceholder key={k} />)
              : features.map(({ icon: Icon, title, description }, idx) => (
                  <FeatureCard
                    key={title}
                    Icon={Icon}
                    title={title}
                    description={description}
                    delay={idx * 0.1}
                  />
                ))}
          </div>
        </section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-32 sm:mt-40 lg:mt-48 mb-16 px-6 sm:px-12 py-16 sm:py-24 bg-linear-to-r from-cyan-900/30 to-teal-900/30 backdrop-blur-xl border border-cyan-400/20 rounded-3xl text-center"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
            Experience{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-cyan-400 via-teal-300 to-cyan-400">
              Luxury
            </span>{" "}
            in Every Cut
          </h2>
          <p className="text-gray-300 text-lg sm:text-xl mb-10 max-w-2xl mx-auto drop-shadow-sm">
            Book your next transformation today and join thousands of satisfied clients.
          </p>
          <Link href="/booking">
            <Button size="lg" className="shadow-2xl">
              Get Started <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </motion.section>
      </main>

      {/* Global Styles */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap");

        * {
          font-family: "Poppins", sans-serif;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          cursor: none !important;
          background-color: #0a0a0a;
          overflow-x: hidden;
        }

        .shimmer-effect::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(34, 211, 238, 0.15),
            transparent
          );
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        /* Smooth Scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.5);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #14b8a6);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #00d9ff, #2dd4bf);
        }
      `}</style>
    </div>
  );
}
