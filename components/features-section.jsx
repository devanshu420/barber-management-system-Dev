import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, CreditCard, Users, Clock, Shield } from "lucide-react"

const features = [
  {
    icon: Calendar,
    title: "Easy Booking",
    description: "Schedule appointments 24/7 with our intuitive booking system",
  },
  {
    icon: MapPin,
    title: "Multiple Locations",
    description: "Find and book with barbers at convenient locations near you",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Safe and secure payment processing with multiple payment options",
  },
  {
    icon: Users,
    title: "Expert Barbers",
    description: "Experienced professionals with verified credentials and reviews",
  },
  {
    icon: Clock,
    title: "Flexible Hours",
    description: "Extended hours and weekend availability to fit your schedule",
  },
  {
    icon: Shield,
    title: "Quality Guarantee",
    description: "Satisfaction guaranteed with our quality assurance program",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose BarberBook?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We make it easy to find, book, and enjoy premium barber services with features designed for your
            convenience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
