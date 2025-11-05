"use client";

import React, { useRef, useState, useEffect } from "react";
import { BadgeCheck } from "lucide-react";

// Scroll fade + slide component
const ScrollFade = ({ children, className = "", delay = 0 }) => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

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

const Qaulity = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black px-6 md:px-16 lg:px-24 pt-10">
    {/* Gradient Card */}
    <ScrollFade delay={100} className="w-full max-w-5xl rounded-2xl mx-auto shadow-2xl overflow-hidden bg-gradient-to-b from-gray-800 to-teal-800 py-16 px-10 flex flex-col items-center">
      <h2 className="text-white font-extrabold text-3xl lg:text-4xl text-center mb-14">
        What makes us different
      </h2>

      {/* Features Row */}
      <div className="flex flex-col md:flex-row justify-between items-stretch gap-12 w-full mb-8">
        {/* Feature 1 */}
        <ScrollFade delay={200} className="text-center flex-1 px-6">
          <div className="flex justify-center">
            <span className="w-14 h-14 flex items-center justify-center border-2 border-teal-400 rounded-full text-teal-400 font-bold mb-5 text-2xl">
              01
            </span>
          </div>
          <h3 className="text-teal-400 font-bold text-lg mb-3">
            Personalized Experience
          </h3>
          <p className="text-teal-200 text-base font-medium opacity-90">
            Every client gets tailored grooming recommendations and barber matches based on their style and preferences.
          </p>
        </ScrollFade>

        {/* Feature 2 */}
        <ScrollFade delay={400} className="text-center flex-1 px-6">
          <div className="flex justify-center">
            <span className="w-14 h-14 flex items-center justify-center border-2 border-teal-400 rounded-full text-teal-400 font-bold mb-5 text-2xl">
              02
            </span>
          </div>
          <h3 className="text-teal-400 font-bold text-lg mb-3">
            Seamless Digital Booking
          </h3>
          <p className="text-teal-200 text-base font-medium opacity-90">
            From choosing your barber to paying online, our system makes the entire process smooth, fast, and stress-free.
          </p>
        </ScrollFade>

        {/* Feature 3 */}
        <ScrollFade delay={600} className="text-center flex-1 px-6">
          <div className="flex justify-center">
            <span className="w-14 h-14 flex items-center justify-center border-2 border-teal-400 rounded-full text-teal-400 font-bold mb-5 text-2xl">
              03
            </span>
          </div>
          <h3 className="text-teal-400 font-bold text-lg mb-3">
            Professional & Verified Barbers
          </h3>
          <p className="text-teal-200 text-base font-medium opacity-90">
           All barbers are skilled, background-checked, and committed to delivering premium grooming services every time.
          </p>
        </ScrollFade>
      </div>

      {/* CTA Button */}
      <ScrollFade delay={800}>
        <button className="bg-teal-400 hover:bg-teal-500 text-black font-semibold text-lg px-8 py-3 rounded-lg shadow-lg mt-8 transition">
          Start free now
        </button>
      </ScrollFade>
    </ScrollFade>

    {/* Bottom Section */}
    <ScrollFade delay={1000} className="mt-16 text-center">
      <div className="text-teal-300 text-2xl lg:text-3xl font-bold mb-20">
        Change is hard.<br />
        We make it easy.
      </div>
    </ScrollFade>
  </div>
);

export default Qaulity;
