import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function ContactPage() {
  const locations = [
    {
      name: "Vijay Nagar",
      address: "123 Main Street, 452015",
      phone: "(555) 123-4567",
      email: "vijaynagr@barberbook.com",
      hours: {
        weekdays: "9:00 AM - 8:00 PM",
        saturday: "8:00 AM - 6:00 PM",
        sunday: "10:00 AM - 5:00 PM",
      },
    },
    {
      name: "Uptown Location",
      address: "456 Broadway Avenue, Uptown, NY 10002",
      phone: "(555) 234-5678",
      email: "uptown@barberbook.com",
      hours: {
        weekdays: "9:00 AM - 8:00 PM",
        saturday: "8:00 AM - 6:00 PM",
        sunday: "10:00 AM - 5:00 PM",
      },
    },
    {
      name: "Main Street Location",
      address: "789 Oak Street, Midtown, NY 10003",
      phone: "(555) 345-6789",
      email: "mainst@barberbook.com",
      hours: {
        weekdays: "9:00 AM - 8:00 PM",
        saturday: "8:00 AM - 6:00 PM",
        sunday: "Closed",
      },
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get in touch with us for appointments, questions, or just to say hello
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>Have a question or special request? We'd love to hear from you.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="(555) 123-4567" />
                </div>

                <div>
                  <Label htmlFor="location">Preferred Location</Label>
                  <select id="location" className="w-full px-3 py-2 border border-input bg-background rounded-md">
                    <option value="">Select a location</option>
                    <option value="downtown">Downtown Location</option>
                    <option value="uptown">Uptown Location</option>
                    <option value="mainst">Main Street Location</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Tell us how we can help you..." rows={4} />
                </div>

                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Location Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Our Locations</h2>

            {locations.map((location, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>{location.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <span className="text-sm text-muted-foreground">{location.address}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{location.phone}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{location.email}</span>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="text-sm text-muted-foreground">
                      <div>Mon-Fri: {location.hours.weekdays}</div>
                      <div>Saturday: {location.hours.saturday}</div>
                      <div>Sunday: {location.hours.sunday}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Contact Section */}
        <div className="mt-16 text-center bg-muted rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Need Immediate Assistance?</h2>
          <p className="text-muted-foreground mb-6">
            For urgent booking requests or questions, call us directly or book online
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg">
              <Phone className="h-4 w-4 mr-2" />
              Call (555) 123-4567
            </Button>
            <Button size="lg">Book Online Now</Button>
          </div>
        </div>
      </main>
    </div>
  )
}
