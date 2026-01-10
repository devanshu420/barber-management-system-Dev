"use client"
import React, { useState } from "react";
import Link from "next/link";

const Payment = () => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit");

  const handlePayment = (e) => {
    e.preventDefault();
    // Yaha payment integration code add karo
    alert(`Payment of ₹${amount} via ${paymentMethod} successful!`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Make Payment</h1>

        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="credit">Credit Card</option>
              <option value="debit">Debit Card</option>
              <option value="upi">UPI</option>
              <option value="netbanking">Net Banking</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition"
          >
            Pay Now
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-500 hover:underline">
            Cancel & Go Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Payment;

// "use client"; // Must be the first line

// import React, { useEffect, useState, useRef, forwardRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useRouter, useSearchParams } from "next/navigation";
// import {
//   CreditCard,
//   Wallet,
//   Banknote,
//   Clock,
//   MapPin,
//   Star,
//   Check,
//   X,
//   Zap,
//   Tag,
//   Calendar,
//   Lock,
//   AlertCircle,
// } from "lucide-react";
// import axios from "axios";
// import Link from "next/link";
// // ================== BUTTON COMPONENT ==================
// const Button = forwardRef(
//   ({ className = "", variant = "default", size = "default", children, ...props }, ref) => {
//     const base =
//       "inline-flex items-center justify-center font-semibold transition-all rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer";

//     const variants = {
//       default:
//         "bg-gradient-to-r from-cyan-500 to-teal-500 text-black hover:from-cyan-600 hover:to-teal-600 shadow-lg hover:shadow-cyan-500/60 transform hover:scale-105 hover:shadow-2xl",
//       outline: "border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-500/10 transition",
//       ghost: "hover:bg-white/10 text-white",
//       secondary: "bg-gray-800/60 border border-cyan-400/20 text-white hover:bg-gray-700/60 transition",
//     };

//     const sizes = {
//       sm: "h-9 px-4 text-sm",
//       default: "h-10 px-5 text-base",
//       lg: "h-13 px-8 text-lg py-3",
//       icon: "h-10 w-10",
//     };

//     return (
//       <button
//         ref={ref}
//         className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
//         {...props}
//       >
//         {children}
//       </button>
//     );
//   }
// );
// Button.displayName = "Button";

// // ================== FUTURISTIC CURSOR ==================
// function FuturisticCursor() {
//   const cursorRef = useRef(null);
//   const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
//   const [isVisible, setIsVisible] = useState(false);
//   const [hovering, setHovering] = useState(false);

//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       setCursorPos({ x: e.clientX, y: e.clientY });
//       setIsVisible(true);
//     };
//     const handleMouseLeave = () => setIsVisible(false);

//     window.addEventListener("mousemove", handleMouseMove);
//     document.addEventListener("mouseleave", handleMouseLeave);

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseleave", handleMouseLeave);
//     };
//   }, []);

//   useEffect(() => {
//     document.body.style.cursor = "none";
//     return () => {
//       document.body.style.cursor = "auto";
//     };
//   }, []);

//   useEffect(() => {
//     const setHover = () => setHovering(true);
//     const clearHover = () => setHovering(false);
//     const els = document.querySelectorAll(
//       "button, a, [role='button'], input, label, textarea"
//     );
//     els.forEach((el) => {
//       el.addEventListener("mouseenter", setHover);
//       el.addEventListener("mouseleave", clearHover);
//     });
//     return () => {
//       els.forEach((el) => {
//         el.removeEventListener("mouseenter", setHover);
//         el.removeEventListener("mouseleave", clearHover);
//       });
//     };
//   }, []);

//   return (
//     <div
//       ref={cursorRef}
//       className="fixed top-0 left-0 z-[10000] pointer-events-none"
//       style={{
//         transform: `translate(calc(${cursorPos.x}px - 50%), calc(${cursorPos.y}px - 50%))`,
//         opacity: isVisible ? 1 : 0,
//         transition: "opacity 0.2s ease-out",
//       }}
//     >
//       <motion.div
//         animate={{ scale: hovering ? 1.5 : 1 }}
//         transition={{ duration: 0.2 }}
//         className={`w-5 h-5 rounded-full border-2 transition-all duration-150 ${
//           hovering
//             ? "border-cyan-300 bg-cyan-200/50 shadow-lg shadow-cyan-400/80"
//             : "border-cyan-500 bg-cyan-400/30 shadow-lg shadow-cyan-400/50"
//         }`}
//         style={{
//           boxShadow: hovering
//             ? "0 0 30px 10px rgba(34,211,238,0.7), 0 0 60px 20px rgba(34,211,238,0.4)"
//             : "0 0 20px 6px rgba(34,211,238,0.5), 0 0 40px 12px rgba(34,211,238,0.2)",
//         }}
//       />
//     </div>
//   );
// }

// // ================== PAYMENT METHOD CARD ==================
// function PaymentMethodCard({ id, Icon, label, description, isSelected, onSelect, isAvailable = true }) {
//   return (
//     <motion.button
//       onClick={() => isAvailable && onSelect(id)}
//       whileHover={isAvailable ? { scale: 1.05 } : {}}
//       whileTap={isAvailable ? { scale: 0.98 } : {}}
//       disabled={!isAvailable}
//       className={`relative p-5 rounded-2xl border-2 transition-all group ${
//         !isAvailable
//           ? "opacity-50 cursor-not-allowed border-gray-700 bg-gray-900/40"
//           : isSelected
//           ? "border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/30"
//           : "border-gray-700 bg-gray-900/40 hover:border-cyan-400/50 hover:bg-gray-800/50"
//       }`}
//     >
//       <div className="flex flex-col items-center gap-2">
//         <div
//           className={`p-3 rounded-xl transition-all ${
//             isSelected
//               ? "bg-gradient-to-br from-cyan-400 to-teal-400 text-black"
//               : "bg-gray-800 text-gray-400 group-hover:bg-gray-700"
//           }`}
//         >
//           <Icon className="w-6 h-6" strokeWidth={1.5} />
//         </div>
//         <span className={`text-sm font-semibold ${isSelected ? "text-cyan-300" : "text-gray-400"}`}>
//           {label}
//         </span>
//         <p className="text-xs text-gray-500">{description}</p>
//       </div>
//       {isSelected && (
//         <motion.div
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           className="absolute top-2 right-2 w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center"
//         >
//           <Check className="w-3 h-3 text-black" strokeWidth={3} />
//         </motion.div>
//       )}
//       {!isAvailable && (
//         <div className="absolute inset-0 flex items-center justify-center">
//           <p className="text-xs text-red-400 font-semibold">Coming Soon</p>
//         </div>
//       )}
//     </motion.button>
//   );
// }

// // ================== SUCCESS MODAL ==================
// function SuccessModal({ isOpen, barberName, date, time, amount, onClose }) {
//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
//           onClick={onClose}
//         >
//           <motion.div
//             initial={{ scale: 0.8, y: 20 }}
//             animate={{ scale: 1, y: 0 }}
//             exit={{ scale: 0.8, y: 20 }}
//             onClick={(e) => e.stopPropagation()}
//             className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border border-cyan-400/30 rounded-3xl p-8 max-w-md text-center shadow-2xl"
//           >
//             <motion.div
//               animate={{ scale: [1, 1.1, 1] }}
//               transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
//               className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-6"
//             >
//               <Check className="w-10 h-10 text-black" strokeWidth={2} />
//             </motion.div>
//             <h2 className="text-3xl font-bold text-white mb-2">Booking Confirmed! 🎉</h2>
//             <p className="text-gray-400 mb-6">Your appointment is scheduled</p>
//             <div className="bg-gray-800/50 border border-cyan-400/20 rounded-2xl p-4 mb-6 space-y-3">
//               <div className="flex items-center justify-between text-left">
//                 <span className="text-gray-400 text-sm">Barber</span>
//                 <span className="text-white font-semibold">{barberName}</span>
//               </div>
//               <div className="flex items-center justify-between text-left">
//                 <span className="text-gray-400 text-sm flex items-center gap-2">
//                   <Calendar className="w-4 h-4" /> Date
//                 </span>
//                 <span className="text-white font-semibold">{date}</span>
//               </div>
//               <div className="flex items-center justify-between text-left">
//                 <span className="text-gray-400 text-sm flex items-center gap-2">
//                   <Clock className="w-4 h-4" /> Time
//                 </span>
//                 <span className="text-white font-semibold">{time}</span>
//               </div>
//               <div className="h-px bg-gray-700" />
//               <div className="flex items-center justify-between text-left">
//                 <span className="text-gray-400 text-sm">Amount Paid</span>
//                 <span className="text-cyan-400 font-semibold">₹{amount}</span>
//               </div>
//             </div>
//             <Button size="lg" className="w-full" onClick={onClose}>
//               Close
//             </Button>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }

// // ================== ERROR ALERT ==================
// function ErrorAlert({ message, onClose }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className="fixed top-4 right-4 bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3 z-[10000] max-w-md"
//     >
//       <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
//       <p className="text-red-300 text-sm">{message}</p>
//       <button onClick={onClose} className="ml-auto text-red-400 hover:text-red-300">
//         <X className="w-4 h-4" />
//       </button>
//     </motion.div>
//   );
// }

// // ================== MAIN PAYMENT PAGE ==================
// export default function PaymentPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [selectedPayment, setSelectedPayment] = useState("upi");
//   const [promoCode, setPromoCode] = useState("");
//   const [discount, setDiscount] = useState(0);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [error, setError] = useState("");
//   const [bookingData, setBookingData] = useState(null);

//   // Load booking data client-side
//   useEffect(() => {
//     if (!searchParams) return;

//     const data = searchParams.get("booking");
//     if (data) {
//       try {
//         setBookingData(JSON.parse(decodeURIComponent(data)));
//       } catch (e) {
//         console.error("Error parsing booking data", e);
//       }
//     } else {
//       // fallback mock data
//       setBookingData({
//         barberName: "Devanshu Sharma",
//         salonName: "The Barber Studio",
//         rating: 4.9,
//         reviews: 1250,
//         service: "Premium Haircut & Styling",
//         date: "Dec 15, 2024",
//         time: "2:30 PM",
//         basePrice: 500,
//         tax: 90,
//       });
//     }
//   }, [searchParams]);

//   const paymentMethods = [
//     { id: "upi", label: "UPI", icon: Zap, description: "Google Pay, PhonePe", available: true },
//     { id: "card", label: "Card", icon: CreditCard, description: "Debit / Credit Card", available: false },
//     { id: "wallet", label: "Wallet", icon: Wallet, description: "Paytm, Amazon Pay", available: false },
//     { id: "cash", label: "Cash", icon: Banknote, description: "Pay at location", available: false },
//   ];

//   const applyPromo = () => {
//     if (!bookingData) return;

//     if (promoCode === "SAVE20") setDiscount(Math.floor(bookingData.basePrice * 0.2));
//     else if (promoCode === "SAVE50") setDiscount(Math.floor(bookingData.basePrice * 0.5));
//     else {
//       setDiscount(0);
//       setError("Invalid promo code");
//       setTimeout(() => setError(""), 3000);
//     }
//   };

//   if (!bookingData) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-cyan-950 flex items-center justify-center">
//         <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
//           <Zap className="w-12 h-12 text-cyan-400" />
//         </motion.div>
//       </div>
//     );
//   }

//   const totalAmount = bookingData.basePrice + bookingData.tax - discount;

//   // ================== HANDLE PAYMENT ==================
//   const handleUPIPayment = async () => {
//     setIsProcessing(true);
//     try {
//       const orderResponse = await axios.post("http://localhost:5000/api/payments/create-order", {
//         amount: totalAmount * 100,
//         currency: "INR",
//         receipt: `booking_${Date.now()}`,
//       });

//       if (!orderResponse.data.success) throw new Error("Failed to create order");

//       const orderId = orderResponse.data.orderId;

//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       document.head.appendChild(script);

//       script.onload = () => {
//         const options = {
//           key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//           amount: totalAmount * 100,
//           currency: "INR",
//           order_id: orderId,
//           name: bookingData.salonName,
//           description: bookingData.service,
//           prefill: { name: "Customer Name", email: "customer@example.com", contact: "9999999999" },
//           theme: { color: "#06b6d4" },
//           handler: async (response) => {
//             try {
//               const verifyResponse = await axios.post(
//                 "http://localhost:5000/api/payments/verify-payment",
//                 {
//                   orderId,
//                   paymentId: response.razorpay_payment_id,
//                   signature: response.razorpay_signature,
//                   bookingData,
//                 }
//               );
//               if (verifyResponse.data.success) setShowSuccess(true);
//               else setError("Payment verification failed");
//             } catch (err) {
//               console.error(err);
//               setError("Payment verification failed");
//             }
//             setIsProcessing(false);
//           },
//           modal: { ondismiss: () => { setIsProcessing(false); setError("Payment cancelled"); } },
//         };
//         const rzp = new window.Razorpay(options);
//         rzp.open();
//       };
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Payment failed");
//       setIsProcessing(false);
//     }
//   };

//   const handlePayment = async () => {
//     if (selectedPayment === "upi") await handleUPIPayment();
//     else if (selectedPayment === "cash") {
//       setIsProcessing(true);
//       await new Promise((resolve) => setTimeout(resolve, 1500));
//       setIsProcessing(false);
//       setShowSuccess(true);
//     } else setError("This payment method is not yet available");
//   };

//   return (
//     <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-950 to-cyan-950 text-white overflow-x-hidden select-none">
//       <FuturisticCursor />

//       {/* Error Alert */}
//       <AnimatePresence>{error && <ErrorAlert message={error} onClose={() => setError("")} />}</AnimatePresence>

//       <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
//         {/* Header */}
//         <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
//           <button
//             onClick={() => router.back()}
//             className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold mb-4 inline-flex items-center gap-2"
//           >
//             ← Back
//           </button>
//           <h1 className="text-4xl sm:text-5xl font-bold mb-2">Payment Checkout</h1>
//           <p className="text-gray-400">Complete your booking at {bookingData.salonName}</p>
//         </motion.div>

//         {/* Remaining UI - left and right columns */}
//         {/* ... rest of your UI code remains same as original ... */}
//       </main>

//       <SuccessModal
//         isOpen={showSuccess}
//         barberName={bookingData.barberName}
//         date={bookingData.date}
//         time={bookingData.time}
//         amount={totalAmount}
//         onClose={() => setShowSuccess(false)}
//       />
//     </div>
//   );
// }
