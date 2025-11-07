"use client";

import React, { forwardRef, useEffect, useRef, useState } from "react";
import { CalendarClock, Clock, Star, Scissors, ArrowRight } from "lucide-react";
import Link from "next/link";

// Inline Button component
const Button = forwardRef(
  ({ className = "", variant = "default", size = "default", children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-medium transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      default: "bg-gradient-to-r from-teal-500 to-teal-600 text-black hover:from-teal-600 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:scale-105",
      outline: "border border-teal-500/50 text-teal-300 hover:bg-teal-500/10 transition",
      secondary: "bg-gray-700/50 text-white hover:bg-gray-600 transition border border-gray-600/50",
      ghost: "hover:bg-white/10 text-white",
      link: "text-teal-400 underline-offset-4 hover:underline",
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
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://plus.unsplash.com/premium_photo-1661420297394-a8a9590e93a8?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundAttachment: "fixed",
        }}
      ></div>

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80"></div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-12">
          {/* Logo/Brand */}
          

          {/* Main Headline */}
          <ScrollFade className="mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-center max-w-4xl">
              Professional Barber
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-300 to-teal-400">
                Services At Your Convenience
              </span>
            </h1>
          </ScrollFade>

          {/* Subheading */}
          <ScrollFade className="mb-10">
            <p className="text-gray-300 max-w-3xl text-lg sm:text-xl text-center leading-relaxed">
              Book appointments with top-rated barbers in your area. Experience premium grooming 
              services with easy online scheduling and professional care.
            </p>
          </ScrollFade>

          {/* CTA Buttons */}
          <ScrollFade className="flex flex-col sm:flex-row gap-4 justify-center mb-16 w-full sm:w-auto">
            <Link href="/booking" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                <CalendarClock className="mr-2 h-5 w-5" />
                Book Appointment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/services" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Services
              </Button>
            </Link>
          </ScrollFade>

          {/* Stats Section */}
          <ScrollFade className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto w-full">
            {/* Stat 1: Rating */}
            <div className="flex flex-col items-center text-center p-6 bg-gray-900/40 backdrop-blur-md border border-gray-800/50 rounded-2xl hover:border-teal-500/50 transition">
              <div className="flex items-center justify-center mb-3 space-x-2">
                <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                <span className="text-3xl sm:text-4xl font-bold text-white">4.9</span>
              </div>
              <p className="text-gray-400 text-sm">Average Rating</p>
              <p className="text-gray-500 text-xs mt-1">From 1000+ reviews</p>
            </div>

            {/* Stat 2: Wait Time */}
            <div className="flex flex-col items-center text-center p-6 bg-gray-900/40 backdrop-blur-md border border-gray-800/50 rounded-2xl hover:border-teal-500/50 transition">
              <div className="flex items-center justify-center mb-3 space-x-2">
                <Clock className="h-6 w-6 text-blue-400" />
                <span className="text-3xl sm:text-4xl font-bold text-white">15</span>
                <span className="text-lg text-gray-400">min</span>
              </div>
              <p className="text-gray-400 text-sm">Average Wait Time</p>
              <p className="text-gray-500 text-xs mt-1">Fast & convenient</p>
            </div>

            {/* Stat 3: Customers */}
            <div className="flex flex-col items-center text-center p-6 bg-gray-900/40 backdrop-blur-md border border-gray-800/50 rounded-2xl hover:border-teal-500/50 transition">
              <div className="flex items-center justify-center mb-3 space-x-2">
                <CalendarClock className="h-6 w-6 text-green-400" />
                <span className="text-3xl sm:text-4xl font-bold text-white">1000</span>
                <span className="text-lg text-gray-400">+</span>
              </div>
              <p className="text-gray-400 text-sm">Happy Customers</p>
              <p className="text-gray-500 text-xs mt-1">Trusted by many</p>
            </div>
          </ScrollFade>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-gray-950/50 to-black">
          <div className="max-w-6xl mx-auto">
            <ScrollFade className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Why Choose BarberBook?
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                We make professional barber services accessible and convenient
              </p>
            </ScrollFade>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <ScrollFade className="p-6 bg-gray-900/50 backdrop-blur-md border border-gray-800/50 rounded-2xl hover:border-teal-500/50 transition">
                <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Scissors className="w-6 h-6 text-teal-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Expert Barbers</h3>
                <p className="text-gray-400">
                  Verified and professional barbers with years of experience
                </p>
              </ScrollFade>

              {/* Feature 2 */}
              <ScrollFade className="p-6 bg-gray-900/50 backdrop-blur-md border border-gray-800/50 rounded-2xl hover:border-teal-500/50 transition">
                <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center mb-4">
                  <CalendarClock className="w-6 h-6 text-teal-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Easy Booking</h3>
                <p className="text-gray-400">
                  Simple and fast online appointment scheduling anytime, anywhere
                </p>
              </ScrollFade>

              {/* Feature 3 */}
              <ScrollFade className="p-6 bg-gray-900/50 backdrop-blur-md border border-gray-800/50 rounded-2xl hover:border-teal-500/50 transition">
                <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-teal-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Quality Service</h3>
                <p className="text-gray-400">
                  Premium grooming experience with guaranteed customer satisfaction
                </p>
              </ScrollFade>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
          <ScrollFade className="max-w-4xl mx-auto bg-gradient-to-r from-teal-500/10 via-teal-500/5 to-teal-600/10 border border-teal-500/30 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Book Your Appointment?
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Join thousands of satisfied customers and experience premium barber services
            </p>
            <Link href="/booking">
              <Button size="lg">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </ScrollFade>
        </section>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;

