import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Scissors, Users, Clock, Award } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  const stats = [
    { icon: Users, label: "Happy Customers", value: "5,000+" },
    { icon: Scissors, label: "Haircuts Completed", value: "15,000+" },
    { icon: Clock, label: "Years in Business", value: "10+" },
    { icon: Award, label: "Awards Won", value: "25+" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-6">About BarberBook</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're more than just a barbershop - we're a community dedicated to helping you look and feel your best.
            Since 2014, we've been providing exceptional grooming services with a modern approach to traditional
            barbering.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <IconComponent className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Founded in 2014 by master barber Anthony Williams, BarberBook started as a single chair operation with a
                simple mission: to bring back the art of traditional barbering while embracing modern convenience.
              </p>
              <p>
                What began as a neighborhood barbershop has grown into a trusted network of skilled professionals, each
                committed to delivering exceptional service and building lasting relationships with our clients.
              </p>
              <p>
                Today, we combine time-honored techniques with cutting-edge booking technology, making it easier than
                ever to maintain your perfect look.
              </p>
            </div>
          </div>
          <div className="relative h-96 rounded-lg overflow-hidden">
            <Image
              src="/modern-barbershop.png"
              alt="BarberBook barbershop interior"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Scissors className="h-8 w-8 text-primary mb-3" />
                <CardTitle>Craftsmanship</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Every cut is a work of art. We take pride in our attention to detail and commitment to excellence in
                  every service we provide.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-3" />
                <CardTitle>Community</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We believe in building relationships that last. Our barbershop is a place where neighbors become
                  friends and conversations flow freely.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-primary mb-3" />
                <CardTitle>Convenience</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your time is valuable. Our online booking system and efficient service ensure you get the perfect cut
                  without the wait.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-muted rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Experience the Difference?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us with their grooming needs. Book your appointment today
            and discover why we're the preferred choice for modern gentlemen.
          </p>
          <Link href="/booking">
            <Button size="lg" className="px-8">
              Book Your Appointment
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
