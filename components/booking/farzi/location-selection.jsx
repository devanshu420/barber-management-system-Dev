"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Navigation, Search } from "lucide-react"

export function LocationSelection({ onSelect }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [manualLocation, setManualLocation] = useState("")
  const [showManualInput, setShowManualInput] = useState(false)

  const getCurrentLocation = () => {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const userLocation = { lat: latitude, lng: longitude }
        onSelect(userLocation)
        setLoading(false)
      },
      () => {
        setError("Unable to retrieve your location. Please enter manually.")
        setLoading(false)
        setShowManualInput(true)
      }
    )
  }

  const handleManualLocation = () => {
    if (!manualLocation.trim()) {
      setError("Please enter a valid location")
      return
    }

    setLoading(true)
    setError(null)

    setTimeout(() => {
      const simulatedLocation = {
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: -74.006 + (Math.random() - 0.5) * 0.1,
      }
      onSelect(simulatedLocation)
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Enter Your Location</h2>
        <p className="text-muted-foreground">We need your location to find nearby barbershops</p>
      </div>

      {/* GPS Option */}
      <Card className="text-center py-6">
        <CardContent>
          <MapPin className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">Use Current Location</h3>
          <Button onClick={getCurrentLocation} disabled={loading} className="flex items-center mx-auto">
            <Navigation className="w-4 h-4 mr-2" />
            {loading ? "Getting Location..." : "Use GPS Location"}
          </Button>
        </CardContent>
      </Card>

      {/* Manual Option */}
      <Card className="py-6">
        <CardContent>
          <div className="text-center mb-4">
            <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Enter Location Manually</h3>
          </div>

          <div className="max-w-md mx-auto space-y-4">
            <div>
              <Label htmlFor="location">Your Location</Label>
              <Input
                id="location"
                type="text"
                placeholder="Enter your address, city, or zip code"
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleManualLocation()}
              />
            </div>
            <Button
              onClick={handleManualLocation}
              disabled={loading || !manualLocation.trim()}
              className="w-full flex items-center justify-center"
            >
              <Search className="w-4 h-4 mr-2" />
              {loading ? "Finding Location..." : "Find Barbershops"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-4">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
