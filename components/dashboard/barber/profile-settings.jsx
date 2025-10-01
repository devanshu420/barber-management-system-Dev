"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { User, Camera, Award, Plus, X } from "lucide-react"

// Mock barber profile data
const initialProfile = {
  name: "John Doe",
  email: "john.doe@barberbook.com",
  phone: "+1 (555) 123-4567",
  bio: "Professional barber with 8+ years of experience specializing in classic cuts and modern styles.",
  location: "Downtown Barbershop",
  experience: "8 years",
  specialties: ["Classic Cuts", "Beard Styling", "Hot Towel Shaves"],
  services: [
    { name: "Classic Haircut", price: 25, duration: 30 },
    { name: "Beard Trim", price: 20, duration: 25 },
    { name: "Premium Package", price: 50, duration: 60 },
  ],
  availability: {
    instantBooking: true,
    advanceBooking: 30, // days
    notifications: {
      email: true,
      sms: true,
      push: true,
    },
  },
}

export function ProfileSettings() {
  const [profile, setProfile] = useState(initialProfile)
  const [newSpecialty, setNewSpecialty] = useState("")

  const handleProfileUpdate = (field: string, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleServiceUpdate = (index: number, field: string, value: any) => {
    const updatedServices = [...profile.services]
    updatedServices[index] = { ...updatedServices[index], [field]: value }
    setProfile((prev) => ({ ...prev, services: updatedServices }))
  }

  const addSpecialty = () => {
    if (newSpecialty.trim()) {
      setProfile((prev) => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()],
      }))
      setNewSpecialty("")
    }
  }

  const removeSpecialty = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Profile Information
          </CardTitle>
          <CardDescription>Update your personal and professional details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src="/professional-barber-headshot.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                <Camera className="w-4 h-4 mr-2" />
                Change Photo
              </Button>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 5MB</p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={profile.name} onChange={(e) => handleProfileUpdate("name", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value={profile.phone} onChange={(e) => handleProfileUpdate("phone", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleProfileUpdate("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                value={profile.experience}
                onChange={(e) => handleProfileUpdate("experience", e.target.value)}
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => handleProfileUpdate("bio", e.target.value)}
              rows={3}
              placeholder="Tell customers about your experience and specialties..."
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Work Location</Label>
            <Input
              id="location"
              value={profile.location}
              onChange={(e) => handleProfileUpdate("location", e.target.value)}
              placeholder="Barbershop name or address"
            />
          </div>
        </CardContent>
      </Card>

      {/* Specialties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Specialties
          </CardTitle>
          <CardDescription>Add your areas of expertise to attract the right customers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {profile.specialties.map((specialty, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {specialty}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeSpecialty(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Add a specialty..."
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addSpecialty()}
            />
            <Button onClick={addSpecialty}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Services & Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Services & Pricing</CardTitle>
          <CardDescription>Manage your service offerings and prices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.services.map((service, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label>Service Name</Label>
                <Input value={service.name} onChange={(e) => handleServiceUpdate(index, "name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Price ($)</Label>
                <Input
                  type="number"
                  value={service.price}
                  onChange={(e) => handleServiceUpdate(index, "price", Number.parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Duration (min)</Label>
                <Input
                  type="number"
                  value={service.duration}
                  onChange={(e) => handleServiceUpdate(index, "duration", Number.parseInt(e.target.value))}
                />
              </div>
            </div>
          ))}

          <Button variant="outline" className="w-full bg-transparent">
            <Plus className="w-4 h-4 mr-2" />
            Add New Service
          </Button>
        </CardContent>
      </Card>

      {/* Availability Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Availability Settings</CardTitle>
          <CardDescription>Configure your booking preferences and notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Instant Booking</Label>
              <p className="text-sm text-muted-foreground">Allow customers to book immediately without approval</p>
            </div>
            <Switch
              checked={profile.availability.instantBooking}
              onCheckedChange={(checked) =>
                handleProfileUpdate("availability", { ...profile.availability, instantBooking: checked })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Advance Booking (days)</Label>
            <Input
              type="number"
              value={profile.availability.advanceBooking}
              onChange={(e) =>
                handleProfileUpdate("availability", {
                  ...profile.availability,
                  advanceBooking: Number.parseInt(e.target.value),
                })
              }
            />
          </div>

          <div className="space-y-4">
            <Label className="text-base">Notification Preferences</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Email Notifications</Label>
                <Switch
                  checked={profile.availability.notifications.email}
                  onCheckedChange={(checked) =>
                    handleProfileUpdate("availability", {
                      ...profile.availability,
                      notifications: { ...profile.availability.notifications, email: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>SMS Notifications</Label>
                <Switch
                  checked={profile.availability.notifications.sms}
                  onCheckedChange={(checked) =>
                    handleProfileUpdate("availability", {
                      ...profile.availability,
                      notifications: { ...profile.availability.notifications, sms: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Push Notifications</Label>
                <Switch
                  checked={profile.availability.notifications.push}
                  onCheckedChange={(checked) =>
                    handleProfileUpdate("availability", {
                      ...profile.availability,
                      notifications: { ...profile.availability.notifications, push: checked },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Changes */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  )
}
