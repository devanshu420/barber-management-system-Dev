"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scissors, Radar as Razor, Sparkles, Crown, Clock } from "lucide-react";
import { motion } from "framer-motion";

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
  return (
    <section className="py-24 px-6 sm:px-8 lg:px-16 bg-gradient-to-b from-black via-gray-950 to-gray-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300 mb-4 tracking-tight">
            Our Services
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Choose from our range of professional grooming services, each delivered with expertise and attention to detail.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {services.map((service, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="group bg-gradient-to-b from-gray-800/70 to-gray-900 border border-gray-700 rounded-3xl shadow-xl hover:border-teal-500 transition-all duration-300 overflow-hidden">
                <CardHeader className="text-center py-10">
                  <div className="mx-auto mb-6 p-5 bg-gradient-to-br from-teal-700 to-teal-500 rounded-full w-fit flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <service.icon className="h-10 w-10 text-teal-200" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white mb-2 tracking-tight">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-sm sm:text-base px-6">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col items-center justify-between py-6 space-y-4">
                
                   
                 
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background Glow Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-900/10 via-transparent to-cyan-900/10 blur-3xl pointer-events-none" />
    </section>
  );
}
