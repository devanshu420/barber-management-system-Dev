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
import { MapPin, Phone, Mail, Clock } from "lucide-react";
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
    {
      name: "Rajwada, Indore",
      address: "12 Market Square, Rajwada Chowk, Indore, MP 452002",
      phone: "+91 86040 05690",
      email: "rajwada@barberbook.com",
      hours: {
        weekdays: "9:00 AM - 8:00 PM",
        saturday: "8:00 AM - 6:00 PM",
        sunday: "Closed",
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-300">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-teal-400 mb-4">
            Contact BarberBook
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-gray-400 leading-relaxed">
            Have a question or need help with booking? We’re here for you — reach out to our team at any time.  
            <br />
            <span className="text-teal-400 font-semibold">
              Founded by Devanshu Sharma
            </span>
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6">
            <CardHeader>
              <CardTitle className="text-white">Send Us a Message</CardTitle>
              <CardDescription className="text-gray-400 mt-1">
                Have a question or special request? We’d love to hear from you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-gray-300">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Devanshu"
                      className="bg-gray-700 border-gray-600 focus:border-teal-500 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-gray-300">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Sharma"
                      className="bg-gray-700 border-gray-600 focus:border-teal-500 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="devanshu@gmail.com"
                    className="bg-gray-700 border-gray-600 focus:border-teal-500 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-300">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 8604005690"
                    className="bg-gray-700 border-gray-600 focus:border-teal-500 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="location" className="text-gray-300">
                    Preferred Location
                  </Label>
                  <select
                    id="location"
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-700 rounded-md text-white focus:border-teal-500"
                  >
                    <option value="" disabled selected>
                      Select a location
                    </option>
                    <option value="vijaynagar">Vijay Nagar, Indore</option>
                    <option value="palasia">Palasia, Indore</option>
                    <option value="rajwada">Rajwada, Indore</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="message" className="text-gray-300">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us how we can help you..."
                    rows={4}
                    className="bg-gray-700 border border-gray-600 focus:border-teal-500 text-white resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-black font-semibold rounded-lg"
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Location Information */}
          <div className="space-y-8 px-2 lg:px-0">
            <h2 className="text-2xl font-bold text-teal-400 mb-6">
              Our Indore Locations
            </h2>

            {locations.map((location, index) => (
              <Card
                key={index}
                className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6"
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <MapPin className="h-5 w-5 text-teal-400" />
                    <span>{location.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                    <span className="text-gray-400 text-sm">
                      {location.address}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400 text-sm">
                      {location.phone}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400 text-sm">
                      {location.email}
                    </span>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="h-4 w-4 text-gray-400 mt-1" />
                    <div className="text-gray-400 text-sm space-y-0.5">
                      <div>
                        <span className="font-semibold">Mon-Fri:</span>{" "}
                        {location.hours.weekdays}
                      </div>
                      <div>
                        <span className="font-semibold">Saturday:</span>{" "}
                        {location.hours.saturday}
                      </div>
                      <div>
                        <span className="font-semibold">Sunday:</span>{" "}
                        {location.hours.sunday}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Contact Section */}
        <div className="mt-16 text-center bg-gray-800 rounded-lg p-8 max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-teal-400 mb-4">
            Need Immediate Assistance?
          </h2>
          <p className="text-gray-400 mb-6">
            For urgent booking requests or quick help, call us directly or book online with{" "}
            <span className="text-teal-400 font-semibold">BarberBook</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              size="lg"
              className="flex items-center justify-center space-x-2"
            >
              <Phone className="h-4 w-4" />
              <span>Call +91 86040 05690</span>
            </Button>
            <Link href="/booking" passHref>
              <Button
                size="lg"
                className="px-8 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-black font-semibold rounded-lg"
              >
                Book Online Now
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
