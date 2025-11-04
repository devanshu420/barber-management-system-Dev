import { Navbar } from "@/components/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scissors } from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  const services = [
    {
      name: "Classic Haircut",
      description: "Traditional men's haircut with styling",
      icon: Scissors,
    },
    {
      name: "Beard Trim",
      description: "Professional beard shaping and trimming",
      icon: Scissors,
    },
    {
      name: "Hair Wash & Style",
      description: "Complete wash, cut, and styling service",
      icon: Scissors,
    },
    {
      name: "Deluxe Package",
      description: "Haircut, beard trim, and hot towel treatment",
      icon: Scissors,
    },
    {
      name: "Kids Haircut",
      description: "Gentle haircut service for children under 12",
      icon: Scissors,
    },
    {
      name: "Senior Haircut",
      description: "Special pricing for seniors 65+",
      icon: Scissors,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
            Our Services
          </h1>
          <p className="text-xl text-teal-300 max-w-2xl mx-auto">
            Professional barber services tailored to your style and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12 auto-rows-fr">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card
                key={index}
                className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg hover:shadow-teal-500/50 transition-shadow duration-300 flex flex-col"
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-teal-700 rounded-md">
                      <IconComponent className="h-6 w-6 text-teal-300" />
                    </div>
                    <CardTitle className="text-xl text-white font-semibold">
                      {service.name}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-gray-400 mt-1">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto" />
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Link href="/booking" passHref>
            <Button
              size="lg"
              className="px-8 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-black font-semibold rounded-lg transition"
            >
              Book Your Appointment Now
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
