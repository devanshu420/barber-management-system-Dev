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
    <section className="py-24 px-6 sm:px-8 lg:px-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Our Services
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choose from our range of professional grooming services, each delivered with expertise and attention to detail.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 bg-white flex flex-col"
            >
              <CardHeader className="text-center py-8">
                <div className="mx-auto mb-5 p-4 bg-blue-50 rounded-full w-fit">
                  <service.icon className="h-10 w-10 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-semibold text-gray-900 mb-2">{service.title}</CardTitle>
                <CardDescription className="text-gray-500 text-sm sm:text-base">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="text-center mt-auto pb-8 px-6">
                <div className="mb-6">
                  <span className="text-2xl sm:text-3xl font-bold text-blue-600">{service.price}</span>
                  <span className="text-gray-500 ml-2">({service.duration})</span>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-all duration-300">
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
