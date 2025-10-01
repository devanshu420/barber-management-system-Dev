"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users, Star } from "lucide-react"

// Mock barbershop data with coordinates and waitlist info
const barbershops = [
  {
    id: "downtown-cuts",
    name: "Downtown Cuts",
    address: "123 Main St, Downtown",
    coordinates: { lat: 40.7128, lng: -74.006 },
    waitlist: 2,
    rating: 4.8,
    image: "/professional-barber-headshot.jpg",
    barbers: ["john-doe", "sarah-wilson"],
    services: ["haircut", "beard-trim", "shave"],
  },
  {
    id: "midtown-barbers",
    name: "Midtown Barbers",
    address: "456 5th Ave, Midtown",
    coordinates: { lat: 40.7589, lng: -73.9851 },
    waitlist: 1,
    rating: 4.9,
    image: "/young-barber-professional-photo.jpg",
    barbers: ["mike-smith"],
    services: ["haircut", "beard-trim"],
  },
  {
    id: "uptown-style",
    name: "Uptown Style",
    address: "789 Broadway, Uptown",
    coordinates: { lat: 40.7831, lng: -73.9712 },
    waitlist: 4,
    rating: 4.7,
    image: "/experienced-barber-portrait.jpg",
    barbers: ["alex-johnson"],
    services: ["haircut", "shave", "styling"],
  },
  {
    id: "east-side-cuts",
    name: "East Side Cuts",
    address: "321 East St, East Side",
    coordinates: { lat: 40.7282, lng: -73.9942 },
    waitlist: 0,
    rating: 4.6,
    image: "/female-barber-professional-photo.jpg",
    barbers: ["david-brown"],
    services: ["haircut", "beard-trim", "shave"],
  },
  {
    id: "west-village-barber",
    name: "West Village Barber",
    address: "654 West St, West Village",
    coordinates: { lat: 40.7359, lng: -74.0036 },
    waitlist: 3,
    rating: 4.8,
    image: "/professional-barber-headshot.jpg",
    barbers: ["emma-davis"],
    services: ["haircut", "styling"],
  },
  {
    id: "brooklyn-cuts",
    name: "Brooklyn Cuts",
    address: "987 Brooklyn Ave, Brooklyn",
    coordinates: { lat: 40.6782, lng: -73.9442 },
    waitlist: 1,
    rating: 4.7,
    image: "/young-barber-professional-photo.jpg",
    barbers: ["james-wilson"],
    services: ["haircut", "beard-trim", "shave"],
  },
  {
    id: "queens-barber-shop",
    name: "Queens Barber Shop",
    address: "555 Queens Blvd, Queens",
    coordinates: { lat: 40.7282, lng: -73.7949 },
    waitlist: 2,
    rating: 4.5,
    image: "/experienced-barber-portrait.jpg",
    barbers: ["robert-garcia"],
    services: ["haircut", "shave"],
  },
  {
    id: "bronx-style-cuts",
    name: "Bronx Style Cuts",
    address: "777 Bronx St, Bronx",
    coordinates: { lat: 40.8448, lng: -73.8648 },
    waitlist: 0,
    rating: 4.6,
    image: "/female-barber-professional-photo.jpg",
    barbers: ["maria-rodriguez"],
    services: ["haircut", "beard-trim", "styling"],
  },
  {
    id: "staten-island-barbers",
    name: "Staten Island Barbers",
    address: "333 Staten Ave, Staten Island",
    coordinates: { lat: 40.5795, lng: -74.1502 },
    waitlist: 3,
    rating: 4.4,
    image: "/professional-barber-headshot.jpg",
    barbers: ["anthony-martinez"],
    services: ["haircut", "shave"],
  },
  {
    id: "harlem-cuts",
    name: "Harlem Cuts",
    address: "888 Harlem St, Harlem",
    coordinates: { lat: 40.8176, lng: -73.9482 },
    waitlist: 1,
    rating: 4.8,
    image: "/young-barber-professional-photo.jpg",
    barbers: ["marcus-johnson"],
    services: ["haircut", "beard-trim", "shave", "styling"],
  },
]

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function ShopSelection({ userLocation, onSelect }) {
  const [nearbyShops, setNearbyShops] = useState([])

  useEffect(() => {
    if (userLocation) {
      // Calculate distances and filter shops within 5km
      const shopsWithDistance = barbershops.map((shop) => ({
        ...shop,
        distance: calculateDistance(userLocation.lat, userLocation.lng, shop.coordinates.lat, shop.coordinates.lng),
      }))

      // Filter shops within 5km and sort by waitlist (low to high), then by distance
      let filteredShops = shopsWithDistance
        .filter((shop) => shop.distance <= 5)
        .sort((a, b) => {
          if (a.waitlist !== b.waitlist) {
            return a.waitlist - b.waitlist // Sort by waitlist first
          }
          return a.distance - b.distance // Then by distance
        })

      if (filteredShops.length === 0) {
        // If no shops within 5km, show closest shops anyway
        filteredShops = shopsWithDistance.sort((a, b) => a.distance - b.distance).slice(0, 5)
      }

      // Limit to 10 shops maximum
      setNearbyShops(filteredShops.slice(0, 10))
    }
  }, [userLocation])

  const getWaitlistColor = (waitlist) => {
    if (waitlist === 0) return "bg-green-100 text-green-800"
    if (waitlist <= 2) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getWaitlistText = (waitlist) => {
    if (waitlist === 0) return "No wait"
    if (waitlist === 1) return "1 person waiting"
    return `${waitlist} people waiting`
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Choose Barbershop</h2>
        <p className="text-muted-foreground">Select from nearby barbershops with the shortest wait times</p>
      </div>

      {nearbyShops.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-muted-foreground">Loading nearby barbershops...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <MapPin className="w-4 h-4 mr-2" />
            Showing {nearbyShops.length} barbershops • Sorted by wait time
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nearbyShops.map((shop) => (
              <Card key={shop.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <img
                        src={shop.image || "/placeholder.svg"}
                        alt={shop.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <CardTitle className="text-lg">{shop.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{shop.address}</p>

                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center text-sm">
                            <MapPin className="w-4 h-4 mr-1 text-muted-foreground" />
                            {shop.distance.toFixed(1)} km away
                          </div>
                          <div className="flex items-center text-sm">
                            <Star className="w-4 h-4 mr-1 text-yellow-500" />
                            {shop.rating}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Badge className={getWaitlistColor(shop.waitlist)}>
                      <Users className="w-3 h-3 mr-1" />
                      {getWaitlistText(shop.waitlist)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {shop.barbers.length} barber{shop.barbers.length > 1 ? "s" : ""} available
                    </div>
                    <Button onClick={() => onSelect(shop)}>Select Shop</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
