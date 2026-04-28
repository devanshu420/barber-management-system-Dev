import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  CreditCard,
  Users,
  Clock,
  Shield,
} from "lucide-react";

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
    description:
      "Safe and secure payment processing with multiple payment options",
  },
  {
    icon: Users,
    title: "Expert Barbers",
    description:
      "Experienced professionals with verified credentials and reviews",
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
];

export function FeaturesSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose BarberBook?
          </h2>
          <p className="text-base sm:text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            We make it easy to find, book, and enjoy premium barber services
            with features designed for your convenience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader className="text-center sm:text-left">
                <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-primary/10 rounded-full w-fit mx-auto sm:mx-0">
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <CardTitle className="text-lg sm:text-xl">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center sm:text-left">
                <p className="text-sm sm:text-base text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
