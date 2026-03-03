"use client";

import React, { useEffect, useRef, useState, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarClock,
  Clock,
  Star,
  Scissors,
  ArrowRight,
  Gift,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// 🎨 Reusable Button
const Button = forwardRef(
  (
    { className = "", variant = "default", size = "default", children, ...props },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center font-medium transition-all rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      default:
        "bg-gradient-to-r from-cyan-500 to-teal-500 text-black hover:from-cyan-600 hover:to-teal-600 shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105",
      outline:
        "border border-cyan-400/50 text-cyan-200 hover:bg-cyan-500/10 transition",
      ghost: "hover:bg-white/10 text-white",
    };

    const sizes = {
      sm: "h-9 px-3 text-sm",
      default: "h-10 px-4 text-base",
      lg: "h-12 px-8 text-lg",
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

// 💫 Custom Cursor
function FuturisticCursor() {
  const cursorRef = useRef(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const handleMove = (e) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useEffect(() => {
    document.body.classList.add("cursor-none");
    return () => document.body.classList.remove("cursor-none");
  }, []);

  useEffect(() => {
    const set = () => setHovering(true);
    const unset = () => setHovering(false);
    const elements = document.querySelectorAll("button, a, input, label");
    elements.forEach((el) => {
      el.addEventListener("mouseenter", set);
      el.addEventListener("mouseleave", unset);
    });
    return () =>
      elements.forEach((el) => {
        el.removeEventListener("mouseenter", set);
        el.removeEventListener("mouseleave", unset);
      });
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[10000] pointer-events-none mix-blend-screen transition-transform duration-75"
    >
      <div
        className={`w-4 h-4 rounded-full border-2 ${
          hovering
            ? "border-cyan-300 bg-cyan-200/25"
            : "border-cyan-500 bg-cyan-400/20"
        } transition-all duration-150`}
        style={{
          boxShadow: hovering
            ? "0 0 20px 6px rgba(34, 211, 238, 0.5)"
            : "0 0 12px 3px rgba(34, 211, 238, 0.4)",
        }}
      />
    </div>
  );
}


const HeroSlider = () => {
  // put your images in: public/images/hero1.jpg, hero2.jpg, hero3.jpg, hero4.jpg
  const images = [
    "/images/hero1.jpg",
    "/images/hero2.jpg",
    "/images/hero3.jpg",
    "/images/hero4.jpg",
  ];
  const [index, setIndex] = useState(0);
  // track failures per image index so one broken file doesn't block the whole slider
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((prev) => (prev + 1) % images.length),
      4000
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[80vh] overflow-hidden rounded-3xl mt-6">
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {!imageErrors[index] ? (
            <div className="absolute inset-0 w-full h-full group">
              <Image
                src={images[index]}
                alt={`Hero ${index + 1}`}
                fill
                sizes="100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  console.error("Hero image failed to load:", images[index], e);
                  setImageErrors((prev) => ({ ...prev, [index]: true }));
                }}
                priority={index === 0}
              />
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black flex flex-col items-center justify-center">
              <span className="text-gray-400 mb-2">Image not available</span>
              <small className="text-xs text-gray-500">
                Expected: public{images[index]} — verify file exists and restart dev server
              </small>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Overlay Text */}
      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-3">
          Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400">
            The Barber Studio
          </span>
        </h1>
        <p className="text-gray-300 max-w-2xl mb-8 text-lg">
          Redefining grooming with modern style and precision.
        </p>
        <Link href="/booking">
          <Button size="lg">
            Book Your Style <ArrowRight className="ml-2" />
          </Button>
        </Link> 
      </div>
    </div>
  );
};

// 🌟 Shimmer Placeholder
const ShimmerPlaceholder = () => (
  <div className="relative h-44 bg-gray-900/60 rounded-2xl border border-gray-800/50 overflow-hidden">
    <div className="absolute inset-0 shimmer-effect" />
  </div>
);

// 🏠 Home Page
export default function Home() {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => {
      setCards([
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
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-cyan-950 text-white overflow-hidden">
      <FuturisticCursor />

      {/* Ambient Background */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <HeroSlider />

        {/* Feature Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {loading
            ? [1, 2, 3].map((k) => <ShimmerPlaceholder key={k} />)
            : cards.map(({ icon: Icon, title, description }, idx) => (
                <motion.div
                  key={title}
                  className="group p-7 rounded-2xl bg-gray-900/50 border border-gray-800/50 shadow-xl hover:border-cyan-500/60 hover:shadow-cyan-400/20 transition relative overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: idx * 0.13 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-400 p-3 mb-4 flex items-center justify-center shadow-lg">
                    <Icon className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-300 transition-colors">
                    {title}
                  </h3>
                  <p className="text-gray-400 text-sm">{description}</p>
                </motion.div>
              ))}
        </section>

        {/* CTA */}
        <motion.section
          className="max-w-3xl mx-auto text-center py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Experience <span className="text-cyan-400">Luxury</span> in Every Cut
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Book your next transformation today.
          </p>
          <Link href="/booking">
            <Button size="lg">
              Get Started <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </motion.section>
      </div>

      {/* Styles */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap");
        * {
          font-family: "Poppins", sans-serif;
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .shimmer-effect::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(34, 211, 238, 0.12),
            transparent
          );
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}


