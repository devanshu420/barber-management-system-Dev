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
          <h1 className="text-4xl sm:text-5xl font-extrabold text-teal-400 mb-3">
            About BarberBook
          </h1>
          <p className="text-sm sm:text-base uppercase tracking-[0.25em] text-teal-300/80 mb-2">
            Built for modern barbers
          </p>

          <p className="text-base sm:text-lg max-w-3xl mx-auto leading-relaxed text-gray-300">
            Welcome to{" "}
            <span className="text-teal-400 font-semibold">BarberBook</span> — a
            smart and modern barber booking management platform founded by
          </p>

          <p className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-teal-500/20 via-cyan-400/20 to-teal-500/20 border border-teal-500/40">
              <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-500 bg-clip-text text-transparent">
                Devanshu Sharma
              </span>
            </span>
          </p>

          <p className="mt-4 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed text-gray-400">
            Our goal is to make barbering simpler, faster, and more connected by
            combining traditional craftsmanship with modern digital tools.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 px-2 sm:px-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card
                key={index}
                className="bg-gray-900/80 border border-gray-800 rounded-2xl shadow-lg hover:shadow-teal-500/40 hover:border-teal-500/60 transition-all duration-300 text-center p-5 sm:p-6"
              >
                <CardContent className="space-y-2">
                  <IconComponent className="h-9 w-9 sm:h-10 sm:w-10 text-teal-400 mx-auto mb-1.5" />
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Story + Image Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center mb-16 px-2 sm:px-4">
          {/* Story */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-teal-400 mb-5">
              Our Story
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-gray-300 text-justify">
              <p>
                <span className="font-semibold text-white text-lg sm:text-xl">
                  Founded by{" "}
                  <span className="text-teal-400">Devanshu Sharma</span>,
                </span>{" "}
                <span className="text-teal-400 font-semibold"> BarberBook </span>
                began with a simple idea — to help barbers manage their
                appointments and customers effortlessly through a clean and
                efficient digital platform.
              </p>
              <p>
                What started as a concept to connect clients with their favorite
                barbers quickly evolved into a complete ecosystem designed to
                handle scheduling, payments, and customer engagement — all in
                one place.
              </p>
              <p>
                Today, BarberBook continues to grow as a trusted digital partner
                for barbershops, offering tools that make managing appointments
                easier and helping customers enjoy a smooth, stress-free
                grooming experience.
              </p>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative w-full">
            <div className="relative w-full rounded-3xl overflow-hidden shadow-[0_22px_70px_rgba(15,23,42,1)] border border-teal-500/40 bg-gradient-to-br from-gray-900 via-slate-900 to-black">
              {/* Aspect-ratio box */}
              <div className="relative w-full pt-[62%] sm:pt-[58%]">
                <Image
                  src="https://ik.imagekit.io/asdf5690/barber-book/shops/Devanshuuuuuuuuuuuu.jpeg"
                  alt="BarberBook modern barbershop"
                  fill
                  className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-500 ease-out hover:scale-[1.05]"
                  style={{ objectPosition: "center 18%" }}
                  sizes="(min-width: 1024px) 40vw, (min-width: 640px) 80vw, 100vw"
                />

                {/* Top subtle gradient edge */}
                <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/40 via-black/5 to-transparent pointer-events-none" />
                {/* Bottom gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              </div>

              {/* Small label on image */}
              <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1">
                <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-semibold bg-black/70 text-teal-300 border border-teal-500/60 backdrop-blur-sm">
                  Crafted for Modern Barbers
                </span>
                <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-medium bg-black/50 text-gray-200/90 border border-white/10 backdrop-blur-sm">
                  Real barbers • Real customers • Real stories
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16 px-2 sm:px-4 max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-teal-400 mb-10 sm:mb-12">
            What Makes Us Different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="bg-gray-900/90 border border-gray-800 rounded-2xl shadow-lg hover:border-teal-500/60 hover:shadow-teal-500/30 transition-all duration-300 p-6">
              <CardHeader className="space-y-2">
                <Scissors className="h-8 w-8 text-teal-400 mb-1" />
                <CardTitle className="text-white">
                  Personalized Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 text-sm sm:text-base">
                  Every client gets a tailored experience — from selecting their
                  favorite barber to managing styles and preferences with ease.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/90 border border-gray-800 rounded-2xl shadow-lg hover:border-teal-500/60 hover:shadow-teal-500/30 transition-all duration-300 p-6">
              <CardHeader className="space-y-2">
                <Users className="h-8 w-8 text-teal-400 mb-1" />
                <CardTitle className="text-white">
                  Seamless Digital Booking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 text-sm sm:text-base">
                  Book appointments, get instant confirmations, and make secure
                  payments — all through one simple, user-friendly platform.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/90 border border-gray-800 rounded-2xl shadow-lg hover:border-teal-500/60 hover:shadow-teal-500/30 transition-all duration-300 p-6">
              <CardHeader className="space-y-2">
                <Clock className="h-8 w-8 text-teal-400 mb-1" />
                <CardTitle className="text-white">
                  Verified Professionals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 text-sm sm:text-base">
                  Every barber on BarberBook is verified and skilled, ensuring
                  customers receive only the best and most professional service.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gray-900/80 border border-gray-800 rounded-2xl p-8 sm:p-10 max-w-3xl mx-auto mb-10 sm:mb-16 px-4 shadow-[0_20px_60px_rgba(15,23,42,0.9)]">
          <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4">
            Ready to Experience the Future of Grooming?
          </h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto text-sm sm:text-base">
            Join thousands of barbers and customers who trust{" "}
            <span className="text-teal-400 font-semibold">BarberBook</span> to
            simplify their grooming experience. Book your appointment today and
            see how modern technology meets timeless style.
          </p>
          <Link href="/booking">
            <Button
              size="lg"
              className="px-8 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-black font-semibold rounded-lg shadow-lg hover:shadow-teal-500/40"
            >
              Book Your Appointment
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
