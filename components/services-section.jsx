"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scissors, Radar as Razor, Sparkles, Crown } from "lucide-react";

const services = [
  {
    icon: Scissors,
    title: "Classic Haircut",
    description: "Professional haircut tailored to your style and preferences",
    price: "₹25",
    duration: "30 min",
  },
  {
    icon: Razor,
    title: "Beard Trim & Shave",
    description: "Precision beard trimming and traditional hot towel shave",
    price: "₹20",
    duration: "25 min",
  },
  {
    icon: Sparkles,
    title: "Hair Styling",
    description: "Complete styling with premium products for special occasions",
    price: "₹15",
    duration: "20 min",
  },
  {
    icon: Crown,
    title: "Premium Package",
    description: "Full service including cut, shave, styling, and grooming",
    price: "₹50",
    duration: "60 min",
  },
];

export function ServicesSection() {
  return (
    <section className="py-24 px-6 sm:px-8 lg:px-16 bg-gradient-to-br from-gray-900 via-gray-950 to-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Our Services
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Choose from our range of professional grooming services, each delivered with expertise and attention to detail.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg hover:shadow-teal-500/50 transition-shadow duration-300 flex flex-col"
            >
              <CardHeader className="text-center py-8">
                <div className="mx-auto mb-5 p-5 bg-teal-700 rounded-full w-fit flex items-center justify-center">
                  <service.icon className="h-10 w-10 text-teal-300" />
                </div>
                <CardTitle className="text-2xl font-semibold text-white mb-2">{service.title}</CardTitle>
                <CardDescription className="text-gray-400 text-sm sm:text-base px-4">
                  {service.description}
                </CardDescription>
              </CardHeader>

              
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
