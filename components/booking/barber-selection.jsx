"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Award, Users } from "lucide-react"

const barbers = [
  {
    id: "john-doe",
    name: "Shanu Kushwah ",
    rating: 4.9,
    reviews: 127,
    experience: "8 years",
    specialties: ["Classic Cuts", "Beard Styling"],
    image: "/professional-barber-headshot.jpg",
    locationIds: ["downtown-cuts"], // Map to barbershop locations
    available: true,
  },
  {
    id: "mike-smith",
    name: "Vikash Kushwah",
    rating: 4.8,
    reviews: 89,
    experience: "5 years",
    specialties: ["Modern Styles", "Fades"],
    image: "/young-barber-professional-photo.jpg",
    locationIds: ["midtown-barbers"],
    available: true,
  },
  {
    id: "alex-johnson",
    name: "Alex Johnson",
    rating: 4.7,
    reviews: 156,
    experience: "12 years",
    specialties: ["Traditional Shaves", "Mustache Grooming"],
    image: "/experienced-barber-portrait.jpg",
    locationIds: ["uptown-style"],
    available: false,
  },
  {
    id: "sarah-wilson",
    name: "Sarah Wilson",
    rating: 4.9,
    reviews: 203,
    experience: "6 years",
    specialties: ["Creative Cuts", "Color Styling"],
    image: "/female-barber-professional-headshot.jpg",
    locationIds: ["downtown-cuts"],
    available: true,
  },
  {
    id: "david-brown",
    name: "David Brown",
    rating: 4.6,
    reviews: 78,
    experience: "4 years",
    specialties: ["Fade Cuts", "Styling"],
    image: "/professional-barber-headshot.jpg",
    locationIds: ["east-side-cuts"],
    available: true,
  },
  {
    id: "emma-davis",
    name: "Emma Davis",
    rating: 4.8,
    reviews: 134,
    experience: "7 years",
    specialties: ["Precision Cuts", "Beard Care"],
    image: "/female-barber-professional-photo.jpg",
    locationIds: ["west-village-barber"],
    available: true,
  },
]

export function BarberSelection({ serviceId, locationId, onSelect }) {
  const availableBarbers = locationId ? barbers.filter((barber) => barber.locationIds.includes(locationId)) : barbers

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Choose Your Barber</h2>
        <p className="text-muted-foreground">
          {locationId
            ? "Select from barbers available at your chosen location"
            : "Select from our experienced professionals"}
        </p>
      </div>

      {availableBarbers.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No barbers available at this location.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableBarbers.map((barber) => (
            <Card
              key={barber.id}
              className={`hover:shadow-md transition-shadow ${barber.available ? "cursor-pointer" : "opacity-60"}`}
            >
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <img
                    src={barber.image || "/placeholder.svg"}
                    alt={barber.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{barber.name}</CardTitle>
                      {!barber.available && <Badge variant="secondary">Unavailable</Badge>}
                    </div>

                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium ml-1">{barber.rating}</span>
                        <span className="text-sm text-muted-foreground ml-1">({barber.reviews} reviews)</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Award className="w-4 h-4 mr-1" />
                        {barber.experience}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Specialties:</p>
                  <div className="flex flex-wrap gap-1">
                    {barber.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full"
                  disabled={!barber.available}
                  onClick={() => barber.available && onSelect(barber)}
                >
                  {barber.available ? "Select Barber" : "Not Available"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
