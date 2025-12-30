"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors, Radar as Razor, Sparkles, Crown, Plus } from "lucide-react";

// Custom Futuristic Cursor


// Shimmer Loader
const ShimmerPlaceholder = () => (
  <div className="relative h-48 bg-gray-900/60 rounded-2xl border border-gray-800/50 overflow-hidden">
    <div className="absolute inset-0 shimmer-effect" />
  </div>
);

const services = [
  {
    icon: Scissors,
    title: "Classic Haircut",
    description: "Professional haircut tailored to your style and preferences.",
  },
  {
    icon: Razor,
    title: "Beard Trim & Shave",
    description: "Precision beard trimming and traditional hot towel shave.",
  },
  {
    icon: Sparkles,
    title: "Hair Styling",
    description: "Complete styling with premium products for special occasions.",
  },
  {
    icon: Crown,
    title: "Premium Package",
    description: "Full service including cut, shave, styling, and grooming.",
  },
];

export function ServicesSection() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-cyan-950 text-white overflow-hidden py-24 px-6 sm:px-8 lg:px-16">
      {/* Custom Cursor */}
      

      {/* Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-cyan-950/80 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 mb-4">
            Our Services
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Choose from our range of professional grooming services, each delivered with expertise and attention to detail.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading
            ? [1, 2, 3, 4].map((k) => <ShimmerPlaceholder key={k} />)
            : services.map((service, idx) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: idx * 0.13,
                      ease: "easeOut",
                    }}
                    whileHover={{
                      y: -8,
                      transition: { duration: 0.23, ease: "easeOut" },
                    }}
                    className="group p-8 rounded-2xl bg-gray-900/50 border border-gray-800/50 shadow-xl hover:border-cyan-500/60 hover:shadow-cyan-400/20 transition relative overflow-hidden"
                  >
                    {/* Neon Glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-cyan-400 to-teal-500 opacity-10 blur-xl" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-400 p-3 mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-full h-full text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* Hover Border Glow */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          boxShadow:
                            "inset 0 0 24px 3px rgba(34,211,238,0.18)",
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })}
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
        * { font-family: "Poppins", sans-serif; }
        body, .cursor-none, .cursor-none * { cursor: none !important; }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .shimmer-effect::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.12), transparent);
          animation: shimmer 2s infinite;
        }
      `}</style>
    </section>
  );
}
