"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users, Star } from "lucide-react"

// Mock data (your barbershops)
const barbershops = [
  {
    id: "downtown-cuts",
    name: "Unicorn Cut",
    address: "Vijay Nagar Indore",
    coordinates: { lat: 40.7128, lng: -74.006 },
    waitlist: 2,
    rating: 4.8,
    image: "/professional-barber-headshot.jpg",
    barbers: ["john-doe", "sarah-wilson"],
    services: ["haircut", "beard-trim", "shave"],
  },
  {
    id: "midtown-barbers",
    name: "Indore Barbers",
    address: "LIG Square , Indore",
    coordinates: { lat: 40.7589, lng: -73.9851 },
    waitlist: 1,
    rating: 4.9,
    image: "/young-barber-professional-photo.jpg",
    barbers: ["mike-smith"],
    services: ["haircut", "beard-trim"],
  },
  // ...other shops
]

// Distance calculation
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function ShopSelection({ userLocation, onSelect }) {
  const [nearbyShops, setNearbyShops] = useState([])

  useEffect(() => {
    if (!userLocation) return

    const shopsWithDistance = barbershops.map((shop) => ({
      ...shop,
      distance: calculateDistance(userLocation.lat, userLocation.lng, shop.coordinates.lat, shop.coordinates.lng),
    }))

    let filtered = shopsWithDistance
      .filter((s) => s.distance <= 5)
      .sort((a, b) => (a.waitlist !== b.waitlist ? a.waitlist - b.waitlist : a.distance - b.distance))

    if (filtered.length === 0) filtered = shopsWithDistance.sort((a, b) => a.distance - b.distance).slice(0, 5)

    setNearbyShops(filtered.slice(0, 10))
  }, [userLocation])

  const getWaitlistColor = (waitlist) =>
    waitlist === 0
      ? "bg-green-700 text-green-100"
      : waitlist <= 2
      ? "bg-yellow-600 text-yellow-100"
      : "bg-red-700 text-red-100"

  const getWaitlistText = (waitlist) =>
    waitlist === 0 ? "No wait" : waitlist === 1 ? "1 person waiting" : `${waitlist} people waiting`

  return (
    <div className="px-4 py-6 max-w-5xl mx-auto dark:bg-gray-900 dark:text-white min-h-screen">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold">Choose Barbershop</h2>
        <p className="text-gray-400 mt-2">Select from nearby barbershops with the shortest wait times</p>
      </div>

      {nearbyShops.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400">Loading nearby barbershops...</p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {nearbyShops.map((shop) => (
            <Card
              key={shop.id}
              className="max-w-sm w-full hover:shadow-xl transition-shadow duration-300 rounded-2xl cursor-pointer overflow-hidden dark:bg-gray-800"
            >
              <img src={shop.image} alt={shop.name} className="w-full h-40 object-cover" />
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold">{shop.name}</CardTitle>
                    <p className="text-sm text-gray-400 mt-1">{shop.address}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {shop.distance.toFixed(1)} km
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-400" />
                        {shop.rating}
                      </div>
                    </div>
                  </div>
                  <Badge className={`${getWaitlistColor(shop.waitlist)} text-xs flex items-center`}>
                    <Users className="w-3 h-3 mr-1" />
                    {getWaitlistText(shop.waitlist)}
                  </Badge>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-400 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {shop.barbers.length} barber{shop.barbers.length > 1 ? "s" : ""} available
                  </div>
                  <Button
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl"
                    onClick={() => onSelect(shop)}
                  >
                    Select
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
