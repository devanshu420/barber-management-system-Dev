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
    { icon: Scissors, label: "Appointments Managed", value: "20,000+" },
    { icon: Clock, label: "Years of Innovation", value: "3+" },
    { icon: Award, label: "Trusted Barber Partners", value: "100+" },
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
            Welcome to <span className="text-teal-400 font-semibold">BarberBook</span> — 
            a smart and modern barber booking management platform founded by{" "}
            <span className="font-semibold text-white">Devanshu Sharma</span>. 
            Our goal is to make barbering simpler, faster, and more connected by 
            combining traditional craftsmanship with modern digital tools.
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
                  <div className="text-2xl font-bold mb-1 text-white">
                    {stat.value}
                  </div>
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
                Founded by <span className="text-white font-semibold">Devanshu Sharma</span>, 
                <span className="text-teal-400 font-semibold"> BarberBook </span> began with a simple 
                idea — to help barbers manage their appointments and customers effortlessly through 
                a clean and efficient digital platform.
              </p>
              <p>
                What started as a concept to connect clients with their favorite barbers quickly 
                evolved into a complete ecosystem designed to handle scheduling, payments, and 
                customer engagement — all in one place.
              </p>
              <p>
                Today, BarberBook continues to grow as a trusted digital partner for barbershops, 
                offering tools that make managing appointments easier and help customers enjoy 
                a smooth, stress-free grooming experience.
              </p>
            </div>
          </div>
          <div className="relative h-96 rounded-lg overflow-hidden shadow-lg border border-gray-700">
            <Image
              src="/modern-barbershop.png"
              alt="BarberBook modern barbershop"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16 px-4 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-teal-400 mb-12">
            What Makes Us Different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6">
              <CardHeader>
                <Scissors className="h-8 w-8 text-teal-400 mb-3" />
                <CardTitle className="text-white">Personalized Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  Every client gets a tailored experience — from selecting their favorite barber 
                  to managing styles and preferences with ease.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6">
              <CardHeader>
                <Users className="h-8 w-8 text-teal-400 mb-3" />
                <CardTitle className="text-white">Seamless Digital Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  Book appointments, get instant confirmations, and make secure payments — 
                  all through one simple, user-friendly platform.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6">
              <CardHeader>
                <Clock className="h-8 w-8 text-teal-400 mb-3" />
                <CardTitle className="text-white">Verified Professionals</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  Every barber on BarberBook is verified and skilled, ensuring customers receive 
                  only the best and most professional service.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gray-800 rounded-lg p-8 max-w-3xl mx-auto mb-16 px-4">
          <h2 className="text-2xl font-bold text-teal-400 mb-4">
            Ready to Experience the Future of Grooming?
          </h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Join thousands of barbers and customers who trust{" "}
            <span className="text-teal-400 font-semibold">BarberBook</span> 
            to simplify their grooming experience. Book your appointment today 
            and see how modern technology meets timeless style.
          </p>
          <Link href="/booking">
            <Button
              size="lg"
              className="px-8 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-black font-semibold rounded-lg"
            >
              Book Your Appointment
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
