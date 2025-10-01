"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Scissors, Radar as RazorIcon, Sparkles, Crown, Clock } from "lucide-react"

const services = [
  {
    id: "haircut",
    name: "Classic Haircut",
    description: "Professional haircut tailored to your style and preferences. Includes consultation and styling.",
    price: 25,
    duration: 30,
    icon: Scissors,
    popular: true,
  },
  {
    id: "beard-trim",
    name: "Beard Trim & Shave",
    description: "Precision beard trimming and traditional hot towel shave for the perfect finish.",
    price: 20,
    duration: 25,
    icon: RazorIcon,
    popular: false,
  },
  {
    id: "styling",
    name: "Hair Styling",
    description: "Complete styling with premium products for special occasions and events.",
    price: 15,
    duration: 20,
    icon: Sparkles,
    popular: false,
  },
  {
    id: "premium",
    name: "Premium Package",
    description: "Full service including cut, shave, styling, and grooming. The complete experience.",
    price: 50,
    duration: 60,
    icon: Crown,
    popular: true,
  },
]

export function ServiceSelection({ onSelect }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Choose Your Service</h2>
        <p className="text-muted-foreground">Select the service that best fits your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <Card
            key={service.id}
            className="relative hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => onSelect(service)}
          >
            {service.popular && (
              <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground">
                Popular
              </Badge>
            )}

            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {service.duration} min
                      </Badge>
                      <Badge variant="secondary" className="text-xs font-bold">
                        ${service.price}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <CardDescription className="text-sm leading-relaxed">{service.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <Button 
              onClick={() => onSelect(service)}
              className="w-full group-hover:bg-primary/90 transition-colors">
                Select Service
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
