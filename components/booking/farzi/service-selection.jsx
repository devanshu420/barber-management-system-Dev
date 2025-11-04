"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Scissors, Clock, DollarSign, Sparkles, Crown, Zap } from "lucide-react";

// Mock services data with enhanced details
const services = [
  {
    id: 1,
    name: "Classic Haircut",
    description: "Professional haircut tailored to your style and preferences. Includes consultation and styling.",
    price: 500,
    duration: 30,
    icon: Scissors,
    popular: true,
  },
  {
    id: 2,
    name: "Beard Trim & Shave",
    description: "Precision beard trimming and traditional hot towel shave for the perfect finish.",
    price: 300,
    duration: 25,
    icon: Zap,
    popular: false,
  },
  {
    id: 3,
    name: "Hair Styling",
    description: "Complete styling with premium products for special occasions and events.",
    price: 400,
    duration: 20,
    icon: Sparkles,
    popular: false,
  },
  {
    id: 4,
    name: "Premium Package",
    description: "Full service including cut, shave, styling, and grooming. The complete experience.",
    price: 1200,
    duration: 60,
    icon: Crown,
    popular: true,
  },
];

export function ServiceSelection({ onSelect }) {
  const [selectedService, setSelectedService] = useState(null);

  const handleSelectService = (service) => {
    setSelectedService(service);
    onSelect(service);
  };

  return (
    <div className="space-y-6">
      {/* 🔹 Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-full mb-4">
          <Scissors className="w-8 h-8 text-orange-400" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Select Your Service
        </h3>
        <p className="text-gray-400 text-sm sm:text-base">
          Choose the service that best fits your needs
        </p>
      </div>

      {/* 🔹 Services Grid (Horizontal) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {services.map((service) => {
          const IconComponent = service.icon;

          return (
            <div
              key={service.id}
              onClick={() => handleSelectService(service)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 flex flex-col relative ${
                selectedService?.id === service.id
                  ? "border-teal-500 bg-teal-500/10 shadow-lg shadow-teal-500/20"
                  : "border-gray-700 bg-gray-800/30 hover:border-teal-500/50 hover:bg-gray-800/50"
              }`}
            >
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute top-2 right-2 bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-xs font-semibold border border-red-500/30">
                  Popular
                </div>
              )}

              {/* Icon */}
              <div className="flex items-start mb-3">
                <div className="p-2.5 bg-orange-500/20 rounded-lg">
                  <IconComponent className="w-5 h-5 text-orange-400" />
                </div>
                {selectedService?.id === service.id && (
                  <div className="ml-auto w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                )}
              </div>

              {/* Service Name */}
              <h4 className="text-base font-bold text-white mb-2 line-clamp-2">
                {service.name}
              </h4>

              {/* Description */}
              <p className="text-gray-400 text-xs mb-3 flex-1 line-clamp-2">
                {service.description}
              </p>

              {/* Stats Row */}
              <div className="flex items-center justify-between mb-3 text-xs">
                <div className="flex items-center space-x-1 text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{service.duration}m</span>
                </div>
                <div className="flex items-center space-x-0.5 text-teal-400 font-semibold">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>₹{service.price}</span>
                </div>
              </div>

              {/* Select Button */}
              <Button
                onClick={() => handleSelectService(service)}
                className={`w-full py-2 text-xs rounded-lg font-semibold transition-all ${
                  selectedService?.id === service.id
                    ? "bg-teal-500 hover:bg-teal-600 text-black"
                    : "bg-gray-700 hover:bg-teal-500 text-white hover:text-black"
                }`}
              >
                {selectedService?.id === service.id ? "Selected ✓" : "Select"}
              </Button>
            </div>
          );
        })}
      </div>

      {/* 🔹 Continue Button */}
      {selectedService && (
        <Button
          onClick={() => onSelect(selectedService)}
          className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-black font-semibold rounded-lg transition transform hover:scale-105"
        >
          Continue to Time Selection
        </Button>
      )}
    </div>
  );
}