"use client";

import React, { useEffect, useState, useRef, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Smartphone,
  Wallet,
  Banknote,
  Clock,
  MapPin,
  Star,
  Check,
  X,
  Zap,
  Tag,
  Calendar
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
      secondary: "bg-gray-800/60 border border-cyan-400/20 text-white hover:bg-gray-700/60 transition",
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
      className="fixed top-0 left-0 z-[10000] pointer-events-none"
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

// ========== PAYMENT METHOD CARD ==========
function PaymentMethodCard({ Icon, label, isSelected, onSelect }) {
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={`relative p-4 rounded-2xl border-2 transition-all group ${
        isSelected
          ? "border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/30"
          : "border-gray-700 bg-gray-900/40 hover:border-cyan-400/50 hover:bg-gray-800/50"
      }`}
    >
      <div className="flex flex-col items-center gap-2">
        <div
          className={`p-3 rounded-xl transition-all ${
            isSelected
              ? "bg-gradient-to-br from-cyan-400 to-teal-400 text-black"
              : "bg-gray-800 text-gray-400 group-hover:bg-gray-700"
          }`}
        >
          <Icon className="w-6 h-6" strokeWidth={1.5} />
        </div>
        <span className={`text-sm font-semibold ${isSelected ? "text-cyan-300" : "text-gray-400"}`}>
          {label}
        </span>
      </div>
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center"
        >
          <Check className="w-3 h-3 text-black" strokeWidth={3} />
        </motion.div>
      )}
    </motion.button>
  );
}

// ========== SUCCESS MODAL ==========
function SuccessModal({ isOpen, barberName, date, time, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border border-cyan-400/30 rounded-3xl p-8 max-w-md text-center shadow-2xl"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
              className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Check className="w-10 h-10 text-black" strokeWidth={2} />
            </motion.div>

            <h2 className="text-3xl font-bold text-white mb-2">Booking Confirmed! 🎉</h2>
            <p className="text-gray-400 mb-6">Your appointment is scheduled</p>

            <div className="bg-gray-800/50 border border-cyan-400/20 rounded-2xl p-4 mb-6 space-y-3">
              <div className="flex items-center justify-between text-left">
                <span className="text-gray-400 text-sm">Barber</span>
                <span className="text-white font-semibold">{barberName}</span>
              </div>
              <div className="flex items-center justify-between text-left">
                <span className="text-gray-400 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Date
                </span>
                <span className="text-white font-semibold">{date}</span>
              </div>
              <div className="flex items-center justify-between text-left">
                <span className="text-gray-400 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Time
                </span>
                <span className="text-white font-semibold">{time}</span>
              </div>
            </div>

            <Button size="lg" className="w-full" onClick={onClose}>
              Close
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ========== MAIN PAYMENT PAGE ==========
export default function PaymentPage() {
  const [selectedPayment, setSelectedPayment] = useState("upi");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock data
  const barber = {
    name: "Devanshu Sharma",
    salon: "The Barber Studio",
    rating: 4.9,
    reviews: 1250,
    image: "/barber.jpg",
  };

  const booking = {
    service: "Premium Haircut & Styling",
    date: "Dec 15, 2024",
    time: "2:30 PM",
    basePrice: 500,
    tax: 90,
  };

  const paymentMethods = [
    { id: "upi", label: "UPI", icon: Zap },
    { id: "card", label: "Card", icon: CreditCard },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "cash", label: "Cash", icon: Banknote },
  ];

  const applyPromo = () => {
    if (promoCode.toUpperCase() === "SAVE20") {
      setDiscount(Math.floor(booking.basePrice * 0.2));
    } else {
      setDiscount(0);
    }
  };

  const totalAmount = booking.basePrice + booking.tax - discount;

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setShowSuccess(true);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-950 to-cyan-950 text-white overflow-x-hidden select-none">
      <FuturisticCursor />

      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <Link href="/" legacyBehavior>
            <a className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold mb-4 inline-flex items-center gap-2">
              ← Back to Home
            </a>
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">Payment Checkout</h1>
          <p className="text-gray-400">Complete your booking for The Barber Studio</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Booking & Barber Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Barber Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-cyan-400/20 rounded-3xl p-6 overflow-hidden"
            >
              <div className="flex gap-6 items-start">
                <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center flex-shrink-0">
                  <div className="w-22 h-22 bg-gray-900 rounded-xl flex items-center justify-center">
                    <span className="text-4xl">💈</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white">{barber.name}</h3>
                  <p className="text-gray-400 mb-3">{barber.salon}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-cyan-400 text-cyan-400"
                          strokeWidth={0}
                        />
                      ))}
                    </div>
                    <span className="text-cyan-300 font-semibold">{barber.rating}</span>
                    <span className="text-gray-500 text-sm">({barber.reviews})</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Booking Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-cyan-400/20 rounded-3xl p-6 space-y-4"
            >
              <h2 className="text-xl font-bold text-white mb-4">Booking Summary</h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  <span className="text-gray-400">Service</span>
                  <span className="text-white font-semibold">{booking.service}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  <span className="text-gray-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Location
                  </span>
                  <span className="text-white font-semibold">{barber.salon}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                    <p className="text-gray-500 text-sm mb-1">Date</p>
                    <p className="text-white font-semibold">{booking.date}</p>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                    <p className="text-gray-500 text-sm mb-1">Time</p>
                    <p className="text-white font-semibold">{booking.time}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment Methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-cyan-400/20 rounded-3xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">Payment Method</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {paymentMethods.map((method) => (
                  <PaymentMethodCard
                    key={method.id}
                    Icon={method.icon}
                    label={method.label}
                    isSelected={selectedPayment === method.id}
                    onSelect={() => setSelectedPayment(method.id)}
                  />
                ))}
              </div>
            </motion.div>

            {/* Promo Code */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-cyan-400/20 rounded-3xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-4">Apply Promo Code</h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-800/60 border border-gray-700 text-white rounded-xl placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
                />
                <Button onClick={applyPromo} variant="secondary">
                  Apply
                </Button>
              </div>
              <p className="text-gray-500 text-xs mt-2">💡 Try: SAVE20</p>
            </motion.div>
          </div>

          {/* Right Column - Price Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-8 bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-cyan-400/20 rounded-3xl p-8 space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-400">
                  <span>Service Price</span>
                  <span>₹{booking.basePrice}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax</span>
                  <span>₹{booking.tax}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400 font-semibold">
                    <span className="flex items-center gap-2">
                      <Tag className="w-4 h-4" /> Discount
                    </span>
                    <span>-₹{discount}</span>
                  </div>
                )}
              </div>

              <div className="h-px bg-gradient-to-r from-cyan-400/20 to-teal-400/20" />

              {/* Total */}
              <div className="bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-400/40 rounded-2xl p-4">
                <p className="text-gray-400 text-sm mb-1">Total Payable</p>
                <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
                  ₹{totalAmount}
                </p>
              </div>

              {/* Payment Button */}
              <Button
                size="lg"
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full relative overflow-hidden group"
              >
                <AnimatePresence mode="wait">
                  {isProcessing ? (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                      />
                      Processing...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="pay"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Proceed to Payment
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>

              <p className="text-gray-500 text-xs text-center">
                🔒 Secure payment powered by Razorpay
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        barberName={barber.name}
        date={booking.date}
        time={booking.time}
        onClose={() => setShowSuccess(false)}
      />

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
      `}</style>
    </div>
  );
}