"use client";

import { Navbar } from "@/components/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock, Scissors } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const locations = [
    {
      name: "Vijay Nagar, Indore",
      address: "Shop 23, Sapphire Heights, Vijay Nagar, Indore, MP 452010",
      phone: "+91 86040 05690",
      email: "vijaynagar@barberbook.com",
      hours: {
        weekdays: "9:00 AM - 8:00 PM",
        saturday: "8:00 AM - 6:00 PM",
        sunday: "10:00 AM - 5:00 PM",
      },
    },
    {
      name: "Palasia, Indore",
      address: "21 MG Road, Near C21 Mall, Palasia, Indore, MP 452001",
      phone: "+91 86040 05690",
      email: "palasia@barberbook.com",
      hours: {
        weekdays: "9:00 AM - 8:00 PM",
        saturday: "8:00 AM - 6:00 PM",
        sunday: "10:00 AM - 5:00 PM",
      },
    },

  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#050816] to-black text-gray-100">
      {/* subtle background blobs */}
      <div className="pointer-events-none fixed -top-32 -left-16 w-72 h-72 bg-teal-500/20 blur-3xl rounded-full" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-80 h-80 bg-emerald-500/10 blur-3xl rounded-full" />

      <Navbar />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-300 mb-2">
            <Scissors className="w-3.5 h-3.5" />
            <span>BarberBook Support</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-teal-400 tracking-tight">
            Contact BarberBook
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-gray-400 leading-relaxed">
            Questions about bookings, barbershop onboarding or support? Our team
            in Indore is ready to help you keep every fade and appointment on time.
            <br />
            <span className="text-teal-400 font-semibold">
              Built with care by Devanshu Sharma
            </span>
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <Card className="bg-slate-900/70 border border-slate-800/80 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.9)] backdrop-blur-xl">
            <CardHeader className="pb-4 border-b border-slate-800/80">
              <CardTitle className="text-white text-xl">
                Send us a message
              </CardTitle>
              <CardDescription className="text-gray-400 mt-1 text-sm">
                Share your query, feedback or partnership idea. We usually reply
                within a few hours during working days.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-gray-300 text-xs">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Devanshu"
                      className="mt-1 bg-slate-900 border-slate-700 focus:border-teal-500/80 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-gray-300 text-xs">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Sharma"
                      className="mt-1 bg-slate-900 border-slate-700 focus:border-teal-500/80 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-300 text-xs">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="mt-1 bg-slate-900 border-slate-700 focus:border-teal-500/80 text-white placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-300 text-xs">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 8604005690"
                    className="mt-1 bg-slate-900 border-slate-700 focus:border-teal-500/80 text-white placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <Label htmlFor="location" className="text-gray-300 text-xs">
                    Preferred Location
                  </Label>
                  <select
                    id="location"
                    className="mt-1 w-full px-3 py-2.5 border border-slate-700 bg-slate-900 rounded-md text-sm text-white focus:border-teal-500/80 outline-none"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select a barbershop location
                    </option>
                    <option value="vijaynagar">Vijay Nagar, Indore</option>
                    <option value="palasia">Palasia, Indore</option>
                    <option value="rajwada">Rajwada, Indore</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="message" className="text-gray-300 text-xs">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us how we can help you with your barbershop or booking..."
                    rows={4}
                    className="mt-1 bg-slate-900 border border-slate-700 focus:border-teal-500/80 text-white resize-none placeholder:text-slate-500"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-black font-semibold rounded-lg shadow-lg shadow-teal-500/30"
                >
                  Send message
                </Button>

                <p className="text-xs text-slate-500 text-center pt-1">
                  By submitting, you agree to be contacted about BarberBook
                  appointments and barbershop tools.
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Location Information */}
          <div className="space-y-6 px-1 lg:px-0">
            <div>
              <h2 className="text-2xl font-bold text-teal-400 mb-2">
                Our Indore barbershop network
              </h2>
              <p className="text-sm text-gray-400 max-w-lg">
                Visit any of our partnered barbershops in Indore or use BarberBook
                to manage bookings across all your favorite chairs from one place.
              </p>
            </div>

            <div className="space-y-5">
              {locations.map((location, index) => (
                <Card
                  key={index}
                  className="bg-slate-900/70 border border-slate-800/80 rounded-2xl shadow-[0_16px_40px_rgba(15,23,42,0.8)]"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-white text-base">
                      <MapPin className="h-5 w-5 text-teal-400" />
                      <span>{location.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <span className="text-gray-400">
                        {location.address}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-400">
                        {location.phone}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-400">
                        {location.email}
                      </span>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Clock className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div className="text-gray-400 space-y-0.5">
                        <div>
                          <span className="font-semibold text-slate-200">
                            Mon–Fri:
                          </span>{" "}
                          {location.hours.weekdays}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-200">
                            Saturday:
                          </span>{" "}
                          {location.hours.saturday}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-200">
                            Sunday:
                          </span>{" "}
                          {location.hours.sunday}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Contact Section */}
        <div className="mt-10 text-center bg-slate-900/80 border border-slate-800/80 rounded-2xl p-8 max-w-4xl mx-auto shadow-[0_18px_45px_rgba(15,23,42,0.85)]">
          <h2 className="text-2xl font-bold text-teal-400 mb-3">
            Need an urgent cut or quick help?
          </h2>
          <p className="text-gray-400 mb-6 text-sm sm:text-base">
            For last‑minute bookings or barbershop support, call us directly or
            reserve your slot online in a few taps with{" "}
            <span className="text-teal-400 font-semibold">BarberBook</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              size="lg"
              className="flex items-center justify-center space-x-2 border-teal-500/60 text-teal-300 hover:bg-teal-500/10"
            >
              <Phone className="h-4 w-4" />
              <span>Call +91 86040 05690</span>
            </Button>

            <Link href="/booking">
              <Button
                size="lg"
                className="px-8 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-black font-semibold rounded-lg shadow-lg shadow-teal-500/30"
              >
                Book online now
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
