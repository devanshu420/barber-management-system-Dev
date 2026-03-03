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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Hero / Heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 mb-4">
            <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center">
              <Scissors className="w-3.5 h-3.5 text-teal-300" />
            </div>
            <span className="text-xs sm:text-sm text-teal-300 font-medium">
              Curated barber services for you
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 tracking-tight">
            Choose your next{" "}
            <span className="text-teal-400">fresh look</span>
          </h1>
          <p className="text-sm sm:text-lg text-gray-300 max-w-2xl mx-auto">
            From classic cuts to deluxe packages, find the perfect service
            that matches your style and schedule.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-12 auto-rows-fr">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card
                key={index}
                className="group relative bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-950/80 border border-gray-800/80 rounded-2xl shadow-[0_18px_45px_rgba(0,0,0,0.65)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/60 hover:shadow-[0_25px_60px_rgba(20,184,166,0.35)]"
              >
                {/* subtle top gradient line */}
                <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-teal-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <CardHeader className="relative pt-5 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-teal-500/15 border border-teal-500/40 shadow-[0_0_18px_rgba(20,184,166,0.4)] group-hover:scale-105 group-hover:shadow-[0_0_26px_rgba(20,184,166,0.6)] transition-all duration-300">
                      <IconComponent className="h-5 w-5 text-teal-300" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl text-white font-semibold">
                      {service.name}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-gray-400 mt-3 text-sm">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-5 pt-0 mt-auto">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="group-hover:text-teal-300 transition-colors">
                      Approx. 30–45 mins
                    </span>
                    <span className="inline-flex items-center gap-1 text-teal-400/90 font-medium">
                      View slots
                      <span className="text-teal-300 group-hover:translate-x-0.5 transition-transform">
                        →
                      </span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/booking">
            <Button
              size="lg"
              className="relative px-8 sm:px-10 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-500 to-emerald-500 text-black font-semibold shadow-[0_18px_40px_rgba(20,184,166,0.6)] hover:from-teal-400 hover:via-teal-500 hover:to-emerald-400 hover:shadow-[0_22px_55px_rgba(20,184,166,0.75)] transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              Book your appointment now
            </Button>
          </Link>
          <p className="mt-3 text-xs sm:text-sm text-gray-400">
            No upfront payment required. Manage and reschedule bookings anytime.
          </p>
        </div>
      </main>
    </div>
  );
}
