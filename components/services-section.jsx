
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scissors, Radar as Razor, Sparkles, Crown } from "lucide-react";

const services = [
  {
    icon: Scissors,
    title: "Classic Haircut",
    description: "Professional haircut tailored to your style and preferences",
    price: "$25",
    duration: "30 min",
  },
  {
    icon: Razor,
    title: "Beard Trim & Shave",
    description: "Precision beard trimming and traditional hot towel shave",
    price: "$20",
    duration: "25 min",
  },
  {
    icon: Sparkles,
    title: "Hair Styling",
    description: "Complete styling with premium products for special occasions",
    price: "$15",
    duration: "20 min",
  },
  {
    icon: Crown,
    title: "Premium Package",
    description: "Full service including cut, shave, styling, and grooming",
    price: "$50",
    duration: "60 min",
  },
];

export function ServicesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from our range of professional grooming services, each delivered with expertise and attention to
            detail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                  <service.icon className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription className="text-sm">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <span className="text-2xl font-bold text-blue-600">{service.price}</span>
                  <span className="text-gray-500 ml-2">({service.duration})</span>
                </div>
                <Button className="w-full">Book Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
