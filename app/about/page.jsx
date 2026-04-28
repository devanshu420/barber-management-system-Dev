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

      <main className="mx-auto flex w-full max-w-7xl flex-col px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pt-12">
        {/* Hero Section */}
        <section className="mb-12 text-center sm:mb-16">
          <h1 className="mb-3 text-3xl font-extrabold text-teal-400 sm:text-5xl">
            About BarberBook
          </h1>
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-teal-300/80 sm:text-sm">
            Built for modern barbers
          </p>

          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-gray-300 sm:text-lg">
            Welcome to{" "}
            <span className="font-semibold text-teal-400">BarberBook</span> — a
            smart and modern barber booking management platform founded by
          </p>

          <p className="mt-3 text-xl font-extrabold tracking-tight text-white sm:text-3xl">
            <span className="inline-block rounded-full border border-teal-500/40 bg-gradient-to-r from-teal-500/20 via-cyan-400/20 to-teal-500/20 px-3 py-1">
              <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-500 bg-clip-text text-transparent">
                Devanshu Sharma
              </span>
            </span>
          </p>

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-gray-400 sm:text-lg">
            Our goal is to make barbering simpler, faster, and more connected by
            combining traditional craftsmanship with modern digital tools.
          </p>
        </section>

        {/* Stats Section */}
        <section className="mb-14 px-1 sm:px-2">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card
                  key={index}
                  className="p-3 text-center text-xs shadow-lg transition-all duration-300 hover:border-teal-500/60 hover:shadow-teal-500/40 sm:p-5 sm:text-sm md:text-base bg-gray-900/80 border border-gray-800 rounded-2xl"
                >
                  <CardContent className="space-y-1.5 sm:space-y-2">
                    <IconComponent className="mx-auto mb-1.5 h-7 w-7 text-teal-400 sm:h-10 sm:w-10" />
                    <div className="text-lg font-bold text-white sm:text-2xl">
                      {stat.value}
                    </div>
                    <div className="text-[10px] text-gray-400 sm:text-sm">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Story + Image Section */}
        <section className="mb-14 grid grid-cols-1 items-center gap-10 px-1 sm:px-2 lg:grid-cols-2 lg:gap-14">
          {/* Story */}
          <div>
            <h2 className="mb-4 text-2xl font-bold text-teal-400 sm:mb-5 sm:text-4xl">
              Our Story
            </h2>
            <div className="space-y-3 text-justify text-xs text-gray-300 sm:space-y-4 sm:text-base">
              <p>
                <span className="text-base font-semibold text-white sm:text-xl">
                  Founded by{" "}
                  <span className="text-teal-400">Devanshu Sharma</span>,
                </span>{" "}
                <span className="font-semibold text-teal-400">
                  {" "}
                  BarberBook{" "}
                </span>
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
            <div className="relative w-full rounded-3xl border border-teal-500/40 bg-gradient-to-br from-gray-900 via-slate-900 to-black shadow-[0_22px_70px_rgba(15,23,42,1)]">
              {/* Aspect-ratio box */}
              <div className="relative w-full pt-[70%] xs:pt-[62%] sm:pt-[58%]">
                <Image
                  src="https://ik.imagekit.io/asdf5690/barber-book/shops/Devanshuuuuuuuuuuuu.jpeg"
                  alt="BarberBook modern barbershop"
                  fill
                  className="absolute inset-0 h-full w-full transform object-cover transition-transform duration-500 ease-out hover:scale-[1.05]"
                  style={{ objectPosition: "center 18%" }}
                  sizes="(min-width: 1024px) 40vw, (min-width: 640px) 80vw, 100vw"
                />

                {/* Top subtle gradient edge */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/40 via-black/5 to-transparent" />
                {/* Bottom gradient overlay */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              {/* Small label on image */}
              <div className="absolute bottom-3 left-3 z-10 flex flex-col gap-1 sm:bottom-4 sm:left-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-gray-200 sm:bg-transparent sm:px-3 sm:text-sm">
                  <span>Devanshu Sharma</span>
                </div>

                <span className="inline-flex items-center rounded-full border border-white/10 bg-black/60 px-2 py-0.5 text-[9px] font-medium text-gray-200/90 sm:px-2.5 sm:text-[10px]">
                  Real barbers • Real customers • Real stories
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-14 max-w-6xl px-1 sm:px-2 lg:mx-auto">
          <h2 className="mb-8 text-center text-2xl font-bold text-teal-400 sm:mb-10 sm:text-4xl">
            What Makes Us Different
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:gap-8 md:grid-cols-3">
            <Card className="rounded-2xl border border-gray-800 bg-gray-900/90 p-5 shadow-lg transition-all duration-300 hover:border-teal-500/60 hover:shadow-teal-500/30 sm:p-6">
              <CardHeader className="space-y-1.5 sm:space-y-2">
                <Scissors className="mb-1 h-7 w-7 text-teal-400 sm:h-8 sm:w-8" />
                <CardTitle className="text-base text-white sm:text-lg">
                  Personalized Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs text-gray-400 sm:text-base">
                  Every client gets a tailored experience — from selecting their
                  favorite barber to managing styles and preferences with ease.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-gray-800 bg-gray-900/90 p-5 shadow-lg transition-all duration-300 hover:border-teal-500/60 hover:shadow-teal-500/30 sm:p-6">
              <CardHeader className="space-y-1.5 sm:space-y-2">
                <Users className="mb-1 h-7 w-7 text-teal-400 sm:h-8 sm:w-8" />
                <CardTitle className="text-base text-white sm:text-lg">
                  Seamless Digital Booking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs text-gray-400 sm:text-base">
                  Book appointments, get instant confirmations, and make secure
                  payments — all through one simple, user-friendly platform.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-gray-800 bg-gray-900/90 p-5 shadow-lg transition-all duration-300 hover:border-teal-500/60 hover:shadow-teal-500/30 sm:p-6">
              <CardHeader className="space-y-1.5 sm:space-y-2">
                <Clock className="mb-1 h-7 w-7 text-teal-400 sm:h-8 sm:w-8" />
                <CardTitle className="text-base text-white sm:text-lg">
                  Verified Professionals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs text-gray-400 sm:text-base">
                  Every barber on BarberBook is verified and skilled, ensuring
                  customers receive only the best and most professional service.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mx-auto mb-10 w-full max-w-3xl px-1 sm:mb-16 sm:px-2">
          <div className="rounded-2xl border border-gray-800 bg-gray-900/80 px-4 py-7 text-center shadow-[0_20px_60px_rgba(15,23,42,0.9)] sm:px-8 sm:py-10">
            <h2 className="mb-3 text-xl font-bold text-teal-400 sm:mb-4 sm:text-3xl">
              Ready to Experience the Future of Grooming?
            </h2>
            <p className="mx-auto mb-6 max-w-xl text-xs text-gray-400 sm:text-base">
              Join thousands of barbers and customers who trust{" "}
              <span className="font-semibold text-teal-400">BarberBook</span> to
              simplify their grooming experience. Book your appointment today
              and see how modern technology meets timeless style.
            </p>
            <Link href="/booking">
              <Button
                size="lg"
                className="rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 px-6 font-semibold text-black shadow-lg hover:from-teal-600 hover:to-teal-700 hover:shadow-teal-500/40 sm:px-8"
              >
                Book Your Appointment
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}