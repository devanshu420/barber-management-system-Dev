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
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Choose Your Service</h2>
        <p className="text-gray-500 text-sm sm:text-base">Select the service that best fits your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <Card
            key={service.id}
            className="relative rounded-2xl shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden border border-gray-100 group bg-white"
          >
            {service.popular && (
              <Badge className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 text-xs rounded-full shadow-md">
              Popular
              </Badge>
            )}

            <CardHeader className="pb-2">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-50 rounded-xl">
                  <service.icon className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900">{service.name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {service.duration} min
                    </Badge>
                    <Badge variant="secondary" className="text-xs font-bold">
                      ₹{service.price}
                    </Badge>
                  </div>
                </div>
              </div>
              <CardDescription className="text-gray-500 text-sm mt-2">{service.description}</CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
              <Button
                onClick={() => onSelect(service)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
              >
                Select Service
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
