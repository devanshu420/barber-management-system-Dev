import { Navbar } from "@/components/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scissors, Users, Clock, Award } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  const stats = [
    { icon: Users, label: "Happy Customers", value: "5,000+" },
    { icon: Scissors, label: "Haircuts Completed", value: "15,000+" },
    { icon: Clock, label: "Years in Business", value: "10+" },
    { icon: Award, label: "Awards Won", value: "25+" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-300">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-teal-400 mb-6">
            About BarberBook
          </h1>
          <p className="text-lg max-w-3xl mx-auto leading-relaxed">
            We're more than just a barbershop - we're a community dedicated to
            helping you look and feel your best. Since 2014, we've been
            providing exceptional grooming services with a modern approach to
            traditional barbering.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 px-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card
                key={index}
                className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg hover:shadow-teal-500/50 transition-shadow duration-300 text-center p-6"
              >
                <CardContent>
                  <IconComponent className="h-10 w-10 text-teal-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold mb-1 text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 px-4">
          <div>
            <h2 className="text-3xl font-bold text-teal-400 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-400 text-justify">
              <p>
                Founded in 2014 by master barber Anthony Williams, BarberBook started as a single chair operation with a simple mission: to bring back the art of traditional barbering while embracing modern convenience.
              </p>
              <p>
                What began as a neighborhood barbershop has grown into a trusted network of skilled professionals, each committed to delivering exceptional service and building lasting relationships with our clients.
              </p>
              <p>
                Today, we combine time-honored techniques with cutting-edge booking technology, making it easier than ever to maintain your perfect look.
              </p>
            </div>
          </div>
          <div className="relative h-96 rounded-lg overflow-hidden shadow-lg border border-gray-700">
            <Image
              src="/modern-barbershop.png"
              alt="BarberBook barbershop interior"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16 px-4 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-teal-400 mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6">
              <CardHeader>
                <Scissors className="h-8 w-8 text-teal-400 mb-3" />
                <CardTitle className="text-white">Craftsmanship</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  Every cut is a work of art. We take pride in our attention to detail and commitment to excellence in every service we provide.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6">
              <CardHeader>
                <Users className="h-8 w-8 text-teal-400 mb-3" />
                <CardTitle className="text-white">Community</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  We believe in building relationships that last. Our barbershop is a place where neighbors become friends and conversations flow freely.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6">
              <CardHeader>
                <Clock className="h-8 w-8 text-teal-400 mb-3" />
                <CardTitle className="text-white">Convenience</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  Your time is valuable. Our online booking system and efficient service ensure you get the perfect cut without the wait.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gray-800 rounded-lg p-8 max-w-3xl mx-auto mb-16 px-4">
          <h2 className="text-2xl font-bold text-teal-400 mb-4">Ready to Experience the Difference?</h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Join thousands of satisfied customers who trust us with their grooming needs. Book your appointment today and discover why we're the preferred choice for modern gentlemen.
          </p>
          <Link href="/booking">
            <Button size="lg" className="px-8 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-black font-semibold rounded-lg">
              Book Your Appointment
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
