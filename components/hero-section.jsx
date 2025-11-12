"use client";

import React, { useEffect, useRef, useState, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarClock, Clock, Star, Scissors, ArrowRight , Gift , Smartphone } from "lucide-react";
import Link from "next/link";

const Button = forwardRef(
  (
    { className = "", variant = "default", size = "default", children, ...props },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center font-medium transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      default:
        "bg-gradient-to-r from-cyan-500 to-teal-500 text-black hover:from-cyan-600 hover:to-teal-600 shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105",
      outline:
        "border border-cyan-400/50 text-cyan-200 hover:bg-cyan-500/10 transition",
      ghost: "hover:bg-white/10 text-white",
      link: "text-cyan-400 underline-offset-4 hover:underline",
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

// Reveal-on-Scroll Animation
const ScrollFade = ({ children, className = "" }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out transform ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
};



// For cursor

function FuturisticCursor() {
  const cursorRef = useRef(null);
  const [hovering, setHovering] = useState(false);

  // Track mouse movement
  useEffect(() => {
    const cursor = cursorRef.current;

    const handleMove = (e) => {
      if (cursor) {
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // Hide default cursor
  useEffect(() => {
    document.body.classList.add("cursor-none");
    return () => document.body.classList.remove("cursor-none");
  }, []);

  // Hover effect on clickable elements
  useEffect(() => {
    const set = () => setHovering(true);
    const unset = () => setHovering(false);
    const elements = document.querySelectorAll(
      "button, a, [tabindex]:not([tabindex='-1']), input, label"
    );

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
            ? "0 0 20px 6px rgba(34,211,238,0.5)"
            : "0 0 12px 3px rgba(34,211,238,0.4)",
        }}
      />
    </div>
  );
}





// Shimmer Place Loader
const ShimmerPlaceholder = () => (
  <div className="relative h-44 bg-gray-900/60 rounded-2xl border border-gray-800/50 overflow-hidden">
    <div className="absolute inset-0 shimmer-effect" />
  </div>
);

// Home/Dashboard Page – Use all features
const Home = () => {
  // Simulate loading
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => {
      setCards([
  {
    icon: Scissors,
    title: "Expert Barbers",
    description: "All barbers professionally verified, handpicked for skill.",
  },
  {
    icon: CalendarClock,
    title: "Easy Booking",
    description: "Book appointments anytime, instantly see slots and save time.",
  },
  {
    icon: Star,
    title: "Top Rated",
    description: "4.9 star average, 1000+ happy customers, 0 hassle.",
  },
  {
    icon: Clock,
    title: "Fast Service",
    description: "Average wait: only 15 mins! Get in and out quickly.",
  },
   {
    icon: Gift, 
    title: "Loyalty Points",
    description:
      "Earn points on every visit and redeem them for free services and discounts.",
  },
  {
    icon: Smartphone,
    title: "Smart Reminders",
    description:
      "Get automated reminders for your upcoming bookings and offers.",
  },
]);

      setLoading(false);
    }, 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-cyan-950 text-white overflow-hidden">
      {/* Custom Futuristic Cursor */}
      <FuturisticCursor />

      {/* Ambient Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl select-none pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl select-none pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-cyan-950/80 select-none pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
       {/* Main Content */}
<div className="relative z-10 max-w-6xl mx-auto min-h-screen flex flex-col justify-center">
  {/* Header */}
  <motion.div
    initial={{ opacity: 0, y: -24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
    className="flex flex-col items-center justify-center text-center px-4 py-10"
  >
    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight drop-shadow-2xl mb-6">
      Universal{" "}
      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400">
        Barber Dashboard
      </span>
    </h1>
    <p className="text-gray-300 max-w-3xl text-xl sm:text-2xl mb-10">
      Schedule, view stats, and manage all your appointments — all in one modern dashboard.
    </p>
    <motion.div
      className="mt-4 flex flex-col sm:flex-row gap-5 justify-center"
      initial={false}
    >
      <Link href="/booking" legacyBehavior>
        <Button size="lg" className="text-lg px-8 py-6">
          <CalendarClock className="mr-2 h-6 w-6" />
          Book Appointment
          <ArrowRight className="ml-2 h-6 w-6" />
        </Button>
      </Link>
      <Link href="/services" legacyBehavior>
        <Button variant="outline" size="lg" className="text-lg px-8 py-6">
          View Services
        </Button>
      </Link>
    </motion.div>
  </motion.div>
</div>


        {/* Cards Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-2 md:px-0">
          {loading
            ? [1, 2, 3].map((k) => <ShimmerPlaceholder key={k} />)
            : cards.map(({ icon: Icon, title, description }, idx) => (
              <motion.div
                key={title}
                className="group p-7 rounded-2xl bg-gray-900/50 border border-gray-800/50 shadow-xl hover:border-cyan-500/60 hover:shadow-cyan-400/20 transition relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: idx * 0.13, ease: "easeOut" }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.23, ease: "easeOut" },
                }}
              >
                {/* Neon Glow Overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-cyan-400 to-teal-500 opacity-10 blur-xl" />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-400 p-3 mb-4 flex items-center justify-center shadow-lg">
                    <Icon className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">{title}</h3>
                  <p className="text-gray-400 text-sm">{description}</p>
                </div>
                {/* Hover border glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: "inset 0 0 24px 3px rgba(34,211,238,0.18)" }}/>
                </div>
              </motion.div>
            ))}
        </section>

        {/* Section Break / CTA */}
        <motion.section
          className="max-w-3xl mx-auto text-center py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Ready to Experience <span className="text-cyan-400">Premium</span> Service?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Join others and feel the difference.
          </p>
          <Link href="/booking" legacyBehavior>
            <Button size="lg">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.section>
      </div>

      {/* Styles for Shimmer Loader & Cursor */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
        * { font-family: "Poppins", sans-serif;}
        body, .cursor-none, .cursor-none * { cursor: none !important; }
        @keyframes shimmer {
          0% {transform: translateX(-100%);}
          100% {transform: translateX(100%);}
        }
        .shimmer-effect::before {
          content: "";
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(90deg,transparent,rgba(34,211,238,0.12),transparent);
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;

// "use client";

// import React, { forwardRef, useEffect, useRef, useState } from "react";
// import { CalendarClock, Clock, Star, Scissors, ArrowRight } from "lucide-react";
// import Link from "next/link";

// // Inline Button component
// const Button = forwardRef(
//   ({ className = "", variant = "default", size = "default", children, ...props }, ref) => {
//     const base =
//       "inline-flex items-center justify-center font-medium transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

//     const variants = {
//       default: "bg-gradient-to-r from-teal-500 to-teal-600 text-black hover:from-teal-600 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:scale-105",
//       outline: "border border-teal-500/50 text-teal-300 hover:bg-teal-500/10 transition",
//       secondary: "bg-gray-700/50 text-white hover:bg-gray-600 transition border border-gray-600/50",
//       ghost: "hover:bg-white/10 text-white",
//       link: "text-teal-400 underline-offset-4 hover:underline",
//     };

//     const sizes = {
//       sm: "h-9 px-3 text-sm",
//       default: "h-10 px-4 text-base",
//       lg: "h-12 px-8 text-lg",
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

// const ScrollFade = ({ children, className = "" }) => {
//   const ref = useRef();
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setVisible(true);
//           observer.unobserve(ref.current);
//         }
//       },
//       { threshold: 0.1 }
//     );

      

//     if (ref.current) observer.observe(ref.current);
//     return () => observer.disconnect();
//   }, []);



//   return (
//     <div
//       ref={ref}
//       className={`${className} transition-all duration-700 ease-out transform ${
//         visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
//       }`}
//     >
//       {children}
//     </div>
//   );
// };

// const Home = () => {
//   return (
//     <div className="relative min-h-screen text-white overflow-hidden">
//       {/* Background Image with Overlay */}
//       <div
//         className="absolute inset-0 bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://plus.unsplash.com/premium_photo-1661420297394-a8a9590e93a8?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
//           backgroundAttachment: "fixed",
//         }}
//       ></div>

//       {/* Dark Gradient Overlay */}
//       <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80"></div>

//       {/* Main Content */}
//       <div className="relative z-10">
//         {/* Hero Section */}
//         <section className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-12">
//           {/* Logo/Brand */}
          

//           {/* Main Headline */}
//           <ScrollFade className="mb-8">
//             <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-center max-w-4xl">
//               Professional Barber
//               <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-300 to-teal-400">
//                 Services At Your Convenience
//               </span>
//             </h1>
//           </ScrollFade>

//           {/* Subheading */}
//           <ScrollFade className="mb-10">
//             <p className="text-gray-300 max-w-3xl text-lg sm:text-xl text-center leading-relaxed">
//               Book appointments with top-rated barbers in your area. Experience premium grooming 
//               services with easy online scheduling and professional care.
//             </p>
//           </ScrollFade>

//           {/* CTA Buttons */}
//           <ScrollFade className="flex flex-col sm:flex-row gap-4 justify-center mb-16 w-full sm:w-auto">
//             <Link href="/booking" className="w-full sm:w-auto">
//               <Button size="lg" className="w-full sm:w-auto">
//                 <CalendarClock className="mr-2 h-5 w-5" />
//                 Book Appointment
//                 <ArrowRight className="ml-2 h-5 w-5" />
//               </Button>
//             </Link>
//             <Link href="/services" className="w-full sm:w-auto">
//               <Button variant="outline" size="lg" className="w-full sm:w-auto">
//                 View Services
//               </Button>
//             </Link>
//           </ScrollFade>

//           {/* Stats Section */}
//           <ScrollFade className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto w-full">
//             {/* Stat 1: Rating */}
//             <div className="flex flex-col items-center text-center p-6 bg-gray-900/40 backdrop-blur-md border border-gray-800/50 rounded-2xl hover:border-teal-500/50 transition">
//               <div className="flex items-center justify-center mb-3 space-x-2">
//                 <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
//                 <span className="text-3xl sm:text-4xl font-bold text-white">4.9</span>
//               </div>
//               <p className="text-gray-400 text-sm">Average Rating</p>
//               <p className="text-gray-500 text-xs mt-1">From 1000+ reviews</p>
//             </div>

//             {/* Stat 2: Wait Time */}
//             <div className="flex flex-col items-center text-center p-6 bg-gray-900/40 backdrop-blur-md border border-gray-800/50 rounded-2xl hover:border-teal-500/50 transition">
//               <div className="flex items-center justify-center mb-3 space-x-2">
//                 <Clock className="h-6 w-6 text-blue-400" />
//                 <span className="text-3xl sm:text-4xl font-bold text-white">15</span>
//                 <span className="text-lg text-gray-400">min</span>
//               </div>
//               <p className="text-gray-400 text-sm">Average Wait Time</p>
//               <p className="text-gray-500 text-xs mt-1">Fast & convenient</p>
//             </div>

//             {/* Stat 3: Customers */}
//             <div className="flex flex-col items-center text-center p-6 bg-gray-900/40 backdrop-blur-md border border-gray-800/50 rounded-2xl hover:border-teal-500/50 transition">
//               <div className="flex items-center justify-center mb-3 space-x-2">
//                 <CalendarClock className="h-6 w-6 text-green-400" />
//                 <span className="text-3xl sm:text-4xl font-bold text-white">1000</span>
//                 <span className="text-lg text-gray-400">+</span>
//               </div>
//               <p className="text-gray-400 text-sm">Happy Customers</p>
//               <p className="text-gray-500 text-xs mt-1">Trusted by many</p>
//             </div>
//           </ScrollFade>
//         </section>

//         {/* Features Section */}
//         <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-gray-950/50 to-black">
//           <div className="max-w-6xl mx-auto">
//             <ScrollFade className="text-center mb-12">
//               <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
//                 Why Choose BarberBook?
//               </h2>
//               <p className="text-gray-400 text-lg max-w-2xl mx-auto">
//                 We make professional barber services accessible and convenient
//               </p>
//             </ScrollFade>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {/* Feature 1 */}
//               <ScrollFade className="p-6 bg-gray-900/50 backdrop-blur-md border border-gray-800/50 rounded-2xl hover:border-teal-500/50 transition">
//                 <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center mb-4">
//                   <Scissors className="w-6 h-6 text-teal-400" />
//                 </div>
//                 <h3 className="text-xl font-bold text-white mb-2">Expert Barbers</h3>
//                 <p className="text-gray-400">
//                   Verified and professional barbers with years of experience
//                 </p>
//               </ScrollFade>

//               {/* Feature 2 */}
//               <ScrollFade className="p-6 bg-gray-900/50 backdrop-blur-md border border-gray-800/50 rounded-2xl hover:border-teal-500/50 transition">
//                 <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center mb-4">
//                   <CalendarClock className="w-6 h-6 text-teal-400" />
//                 </div>
//                 <h3 className="text-xl font-bold text-white mb-2">Easy Booking</h3>
//                 <p className="text-gray-400">
//                   Simple and fast online appointment scheduling anytime, anywhere
//                 </p>
//               </ScrollFade>

//               {/* Feature 3 */}
//               <ScrollFade className="p-6 bg-gray-900/50 backdrop-blur-md border border-gray-800/50 rounded-2xl hover:border-teal-500/50 transition">
//                 <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center mb-4">
//                   <Star className="w-6 h-6 text-teal-400" />
//                 </div>
//                 <h3 className="text-xl font-bold text-white mb-2">Quality Service</h3>
//                 <p className="text-gray-400">
//                   Premium grooming experience with guaranteed customer satisfaction
//                 </p>
//               </ScrollFade>
//             </div>
//           </div>
//         </section>

//         {/* Bottom CTA */}
//         <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
//           <ScrollFade className="max-w-4xl mx-auto bg-gradient-to-r from-teal-500/10 via-teal-500/5 to-teal-600/10 border border-teal-500/30 rounded-2xl p-8 sm:p-12 text-center">
//             <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
//               Ready to Book Your Appointment?
//             </h2>
//             <p className="text-gray-300 text-lg mb-8">
//               Join thousands of satisfied customers and experience premium barber services
//             </p>
//             <Link href="/booking">
//               <Button size="lg">
//                 Get Started Now
//                 <ArrowRight className="ml-2 h-5 w-5" />
//               </Button>
//             </Link>
//           </ScrollFade>
//         </section>
//       </div>

//       <style jsx>{`
//         @keyframes fadeIn {
//           0% {
//             opacity: 0;
//           }
//           100% {
//             opacity: 1;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Home;

