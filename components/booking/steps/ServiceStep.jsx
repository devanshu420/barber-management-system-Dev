"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Scissors, Clock, IndianRupee } from "lucide-react";

// Mock services data
const mockServices = [
  {
    id: 1,
    name: "Classic Haircut",
    description: "Professional haircut tailored to your style",
    price: 500,
    duration: 30,
    icon: "✂️",
  },
  {
    id: 2,
    name: "Beard Trim & Shave",
    description: "Precision beard trimming and hot towel shave",
    price: 300,
    duration: 25,
    icon: "🪒",
  },
  {
    id: 3,
    name: "Hair Styling",
    description: "Complete styling with premium products",
    price: 400,
    duration: 20,
    icon: "💇",
  },
  {
    id: 4,
    name: "Premium Package",
    description: "Full service including cut, shave, and styling",
    price: 1200,
    duration: 60,
    icon: "👑",
  },
];

export function ServiceSelection({ onSelect }) {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    if (selectedServices.find((s) => s.id === service.id)) {
      // Remove service
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    } else {
      // Add service
      setSelectedServices([...selectedServices, service]);
    }
  };

  const isSelected = (service) =>
    selectedServices.find((s) => s.id === service.id);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-full mb-4">
          <Scissors className="w-8 h-8 text-orange-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Select Services</h3>
        <p className="text-gray-400">Choose one or more services you want</p>
      </div>

      <div className="space-y-4">
        {mockServices.map((service) => (
          <div
            key={service.id}
            onClick={() => toggleService(service)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all select-none ${
              isSelected(service)
                ? "border-teal-500 bg-teal-500/10"
                : "border-gray-700 bg-gray-800/30 hover:border-teal-500/50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <span className="text-3xl">{service.icon}</span>
                <div>
                  <h4 className="text-lg font-bold text-white">{service.name}</h4>
                  <p className="text-gray-400 text-sm">{service.description}</p>
                  <div className="flex items-center space-x-4 mt-3 text-sm">
                    <div className="flex items-center space-x-1 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration} min</span>
                    </div>
                    <div className="flex items-center space-x-1 text-teal-400 font-semibold">
                      <IndianRupee className="w-4 h-4" />
                      <span>₹{service.price}</span>
                    </div>
                  </div>
                </div>
              </div>
              {isSelected(service) && (
                <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 ml-4 mt-1">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={() => selectedServices.length > 0 && onSelect(selectedServices)}
        disabled={selectedServices.length === 0}
        className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 text-black font-semibold rounded-lg"
      >
        Continue to Time Selection
      </Button>
    </div>
  );
}
