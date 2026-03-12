"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";


// Scroll Fade Component
const ScrollFade = ({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);
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

const Quality = () => {
  const features = [
    {
      number: "01",
      title: "Personalized Experience",
      description: "Every client gets tailored grooming recommendations and barber matches based on their style and preferences.",
    },
    {
      number: "02",
      title: "Seamless Digital Booking",
      description: "From choosing your barber to paying online, our system makes the entire process smooth, fast, and stress-free.",
    },
    {
      number: "03",
      title: "Professional & Verified Barbers",
      description: "All barbers are skilled, background-checked, and committed to delivering premium grooming services every time.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-cyan-950 text-white overflow-hidden flex flex-col items-center justify-center px-6 md:px-16 lg:px-24 py-20">
      {/* Custom Cursor */}
  

      {/* Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-cyan-950/80 pointer-events-none" />

      <div className="w-full max-w-5xl mx-auto relative z-10">
        {/* Main Card */}
        <ScrollFade delay={100} className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl p-12 md:p-16 shadow-2xl overflow-hidden relative bg-gray-900/60 border border-gray-800/50"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-teal-500/5 to-cyan-500/10 blur-2xl" />

            <div className="relative z-10">
              <h2 className="text-white font-bold text-3xl lg:text-4xl text-center mb-16">
                What makes us different
              </h2>

              {/* Features Row */}
              <div className="flex flex-col md:flex-row justify-between items-stretch gap-12 mb-12">
                {features.map((feature, idx) => (
                  <ScrollFade key={idx} delay={200 + idx * 200} className="flex-1">
                    <motion.div
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="text-center h-full p-6 rounded-xl bg-gray-900/40 border border-gray-800/50 hover:border-cyan-500/40 hover:bg-gray-900/60 transition-all duration-300 group"
                    >
                      <div className="flex justify-center mb-6">
                        <span className="w-16 h-16 flex items-center justify-center border-2 border-cyan-400 rounded-full text-cyan-400 font-bold text-2xl bg-cyan-400/10">
                          {feature.number}
                        </span>
                      </div>
                      <h3 className="text-cyan-300 font-bold text-lg mb-4 group-hover:text-cyan-200 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 text-base font-medium leading-relaxed">
                        {feature.description}
                      </p>
                    </motion.div>
                  </ScrollFade>
                ))}
              </div>

              {/* CTA Button */}
              <ScrollFade delay={800} className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-black font-bold text-lg px-10 py-4 rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
                >
                  Start Free Now
                </motion.button>
              </ScrollFade>
            </div>
          </motion.div>
        </ScrollFade>

        {/* Bottom Tagline */}
        <ScrollFade delay={1000} className="mt-20 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 text-3xl lg:text-4xl font-bold"
          >
            Change is hard. <br />
            We make it easy.
          </motion.div>
        </ScrollFade>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
        * { font-family: "Poppins", sans-serif; }
        body, .cursor-none, .cursor-none * { cursor: auto !important; }
      `}</style>
    </div>
  );
};

export default Quality;
