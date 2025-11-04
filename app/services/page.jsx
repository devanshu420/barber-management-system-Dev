import { Navbar } from "@/components/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scissors, Clock, IndianRupee } from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  const services = [
    {
      name: "Classic Haircut",
      description: "Traditional men's haircut with styling",
      duration: "30 min",
      price: "25",
      icon: Scissors,
    },
    {
      name: "Beard Trim",
      description: "Professional beard shaping and trimming",
      duration: "20 min",
      price: "15",
      icon: Scissors,
    },
    {
      name: "Hair Wash & Style",
      description: "Complete wash, cut, and styling service",
      duration: "45 min",
      price: "35",
      icon: Scissors,
    },
    {
      name: "Deluxe Package",
      description: "Haircut, beard trim, and hot towel treatment",
      duration: "60 min",
      price: "50",
      icon: Scissors,
    },
    {
      name: "Kids Haircut",
      description: "Gentle haircut service for children under 12",
      duration: "25 min",
      price: "20",
      icon: Scissors,
    },
    {
      name: "Senior Haircut",
      description: "Special pricing for seniors 65+",
      duration: "30 min",
      price: "20",
      icon: Scissors,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Our Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional barber services tailored to your style and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <IconComponent className="h-6 w-6 text-primary" />
                    <CardTitle className="text-xl">{service.name}</CardTitle>
                  </div>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {service.duration}
                      </span>
                    </div>
                    <div className="flex items-center space-x-0">
                      <IndianRupee className="h-4 w-4 text-primary" />
                      <span className="text-lg font-semibold text-primary -ml-0.5">
                        {service.price}
                      </span>
                    </div>
                  </div>
                  <Link href="/booking">
                    <Button className="w-full">Book This Service</Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Link href="/booking">
            <Button size="lg" className="px-8">
              Book Your Appointment Now
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
