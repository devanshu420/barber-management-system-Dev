"use client";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { CalendarClock, Clock, Star } from "lucide-react"; 
import Link from "next/link";

// Inline Button component
const Button = forwardRef(
  ({ className = "", variant = "default", size = "default", children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-medium transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      default: "bg-teal-500 text-white hover:bg-teal-600",
      outline: "border border-white/30 text-white hover:bg-white/10 transition",
      secondary: "bg-gray-700 text-white hover:bg-gray-600 transition border border-gray-600",
      ghost: "hover:bg-white/10 text-white",
      link: "text-teal-400 underline-offset-4 hover:underline",
    };

    const sizes = {
      sm: "h-9 px-3 text-sm",
      default: "h-10 px-4 text-base",
      lg: "h-11 px-8 text-lg",
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

const ScrollFade = ({ children, className = "" }) => {
  const ref = useRef();
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

const Home = () => {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://plus.unsplash.com/premium_photo-1661420297394-a8a9590e93a8?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      ></div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#1E2025]/60"></div>

      {/* Main Content */}
      <div className="relative z-10">
        <section className="flex flex-col items-center justify-center text-center mt-20 sm:mt-28 px-4">
          
          <ScrollFade className="mb-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              Professional Barber Services
              <span className="text-teal-400 block">At Your Convenience</span>
            </h1>
          </ScrollFade>

          <ScrollFade className="mb-8">
            <p className="text-gray-300 max-w-2xl text-lg">
              Book appointments with top-rated barbers in your area. Experience
              premium grooming services with easy online scheduling and professional care.
            </p>
          </ScrollFade>

          <ScrollFade className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/register" passHref>
              <Button size="lg">
                <CalendarClock className="mr-2 h-5 w-5" />
                Book Appointment
              </Button>
            </Link>
            <Link href="/services" passHref>
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent border-white/40 hover:bg-white/10"
              >
                View Services
              </Button>
            </Link>
          </ScrollFade>

          <ScrollFade className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-gray-200">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-yellow-400 mr-2" />
                <span className="text-3xl font-bold">4.9</span>
              </div>
              <p className="text-gray-400">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-6 w-6 text-blue-400 mr-2" />
                <span className="text-3xl font-bold">15min</span>
              </div>
              <p className="text-gray-400">Average Wait Time</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CalendarClock className="h-6 w-6 text-green-400 mr-2" />
                <span className="text-3xl font-bold">1000+</span>
              </div>
              <p className="text-gray-400">Happy Customers</p>
            </div>
          </ScrollFade>

        </section>
      </div>
    </div>
  );
}

export default Home;






// "use client";
// import { Button } from "@/components/ui/button"
// import { Calendar, Clock, Star } from "lucide-react"
// import Link from "next/link"

// export function HeroSection() {
//   return (
//     <section className="bg-gradient-to-br from-background to-muted py-20 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center">
//           <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
//             Professional Barber Services
//             <span className="text-primary block">At Your Convenience</span>
//           </h1>
//           <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
//             Book appointments with top-rated barbers in your area. Experience premium grooming services with easy online
//             scheduling and professional care.
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
//             <Link href="/auth/register">
//               <Button size="lg" className="text-lg px-8 py-3">
//                 <Calendar className="mr-2 h-5 w-5" />
//                 Book Appointment
//               </Button>
//             </Link>
//             <Link href="/services">
//               <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
//                 View Services
//               </Button>
//             </Link>
//           </div>

//           {/* Stats */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
//             <div className="text-center">
//               <div className="flex items-center justify-center mb-2">
//                 <Star className="h-6 w-6 text-accent mr-2" />
//                 <span className="text-3xl font-bold text-foreground">4.9</span>
//               </div>
//               <p className="text-muted-foreground">Average Rating</p>
//             </div>
//             <div className="text-center">
//               <div className="flex items-center justify-center mb-2">
//                 <Clock className="h-6 w-6 text-accent mr-2" />
//                 <span className="text-3xl font-bold text-foreground">15min</span>
//               </div>
//               <p className="text-muted-foreground">Average Wait Time</p>
//             </div>
//             <div className="text-center">
//               <div className="flex items-center justify-center mb-2">
//                 <Calendar className="h-6 w-6 text-accent mr-2" />
//                 <span className="text-3xl font-bold text-foreground">1000+</span>
//               </div>
//               <p className="text-muted-foreground">Happy Customers</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }