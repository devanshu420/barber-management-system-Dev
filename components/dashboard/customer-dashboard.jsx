

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Clock, User, MapPin, Plus, Star, AlertTriangle } from "lucide-react"
import Link from "next/link"

const initialUpcomingBookings = [
  {
    id: "1",
    service: "Classic Haircut",
    barber: "John Doe",
    date: "2024-01-15",
    time: "2:00 PM",
    location: "Downtown Barbershop",
    price: 25,
    status: "confirmed",
    canReschedule: true,
    canCancel: true,
  },
  {
    id: "2",
    service: "Beard Trim & Shave",
    barber: "Mike Smith",
    date: "2024-01-22",
    time: "10:30 AM",
    location: "Midtown Cuts",
    price: 20,
    status: "confirmed",
    canReschedule: true,
    canCancel: true,
  },
  {
    id: "5",
    service: "Premium Package",
    barber: "Sarah Wilson",
    date: "2024-01-25",
    time: "3:00 PM",
    location: "Elite Barbershop",
    price: 50,
    status: "confirmed",
    canReschedule: true,
    canCancel: false, // Cannot cancel within 24 hours
  },
]

const pastBookings = [
  {
    id: "3",
    service: "Premium Package",
    barber: "Sarah Wilson",
    date: "2024-01-08",
    time: "3:00 PM",
    location: "Downtown",
    price: 50,
    status: "completed",
    rating: 5,
  },
  {
    id: "4",
    service: "Classic Haircut",
    barber: "John Doe",
    date: "2024-01-01",
    time: "11:00 AM",
    location: "Downtown",
    price: 25,
    status: "completed",
    rating: 4,
  },
]

export function CustomerDashboard() {
  const [upcomingBookings, setUpcomingBookings] = useState(initialUpcomingBookings)
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const handleReschedule = (booking) => {
    console.log("[v0] Initiating reschedule for booking:", booking.id)
    setSelectedBooking(booking)
    setIsRescheduleDialogOpen(true)
  }

  const confirmReschedule = async () => {
    if (!selectedBooking) return

    setIsLoading(true)
    console.log("[v0] Processing reschedule for booking:", selectedBooking.id)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Update booking status
    setUpcomingBookings((prev) =>
      prev.map((booking) =>
        booking.id === selectedBooking.id ? { ...booking, status: "rescheduling", canReschedule: false } : booking,
      ),
    )

    setIsLoading(false)
    setIsRescheduleDialogOpen(false)
    setSelectedBooking(null)
    console.log("[v0] Reschedule request submitted successfully")
  }

  const handleCancel = (booking) => {
    console.log("[v0] Initiating cancellation for booking:", booking.id)
    setSelectedBooking(booking)
    setIsCancelDialogOpen(true)
  }

  const confirmCancel = async () => {
    if (!selectedBooking) return

    setIsLoading(true)
    console.log("[v0] Processing cancellation for booking:", selectedBooking.id)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Remove booking from upcoming list
    setUpcomingBookings((prev) => prev.filter((booking) => booking.id !== selectedBooking.id))

    setIsLoading(false)
    setIsCancelDialogOpen(false)
    setSelectedBooking(null)
    console.log("[v0] Booking cancelled successfully")
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
      case "rescheduling":
        return <Badge className="bg-yellow-100 text-yellow-800">Rescheduling</Badge>
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Dashboard</h1>
        <p className="text-muted-foreground">Manage your appointments and booking history</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <Plus className="w-8 h-8 mx-auto text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Book New Appointment</h3>
            <p className="text-sm text-muted-foreground mb-4">Schedule your next barber appointment</p>
            <Link href="/booking">
              <Button className="w-full">Book Now</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <Calendar className="w-8 h-8 mx-auto text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Upcoming Appointments</h3>
            <p className="text-2xl font-bold text-foreground">{upcomingBookings.length}</p>
            <p className="text-sm text-muted-foreground">
              Next: {upcomingBookings[0] ? formatDate(upcomingBookings[0].date) : "None"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <Star className="w-8 h-8 mx-auto text-yellow-400" />
            </div>
            <h3 className="font-semibold mb-2">Total Visits</h3>
            <p className="text-2xl font-bold text-foreground">{pastBookings.length + upcomingBookings.length}</p>
            <p className="text-sm text-muted-foreground">Lifetime bookings</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled barber appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming appointments</p>
                  <Link href="/booking">
                    <Button variant="outline" className="mt-4 bg-transparent">
                      Book Your First Appointment
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{booking.service}</h4>
                          <p className="text-sm text-muted-foreground flex items-center mt-1">
                            <User className="w-4 h-4 mr-1" />
                            {booking.barber}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="secondary">${booking.price}</Badge>
                          {getStatusBadge(booking.status)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(booking.date)}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {booking.time}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {booking.location}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReschedule(booking)}
                          disabled={!booking.canReschedule || booking.status === "rescheduling"}
                        >
                          {booking.status === "rescheduling" ? "Rescheduling..." : "Reschedule"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancel(booking)}
                          disabled={!booking.canCancel}
                        >
                          Cancel
                        </Button>
                        {!booking.canCancel && (
                          <span className="text-xs text-muted-foreground flex items-center">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Cannot cancel within 24h
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Booking History */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Booking History</CardTitle>
              <CardDescription>Your past appointments and reviews</CardDescription>
            </CardHeader>
            <CardContent>
              {pastBookings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No booking history yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastBookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{booking.service}</h4>
                          <p className="text-sm text-muted-foreground flex items-center mt-1">
                            <User className="w-4 h-4 mr-1" />
                            {booking.barber}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">${booking.price}</Badge>
                          {booking.rating && (
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < booking.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(booking.date)}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {booking.time}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm">
                          Book Again
                        </Button>
                        {!booking.rating && (
                          <Button variant="outline" size="sm">
                            Leave Review
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isRescheduleDialogOpen} onOpenChange={setIsRescheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              You're about to reschedule your {selectedBooking?.service} appointment with {selectedBooking?.barber}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium">Current Appointment</p>
              <p className="text-sm text-muted-foreground">
                {selectedBooking && formatDate(selectedBooking.date)} at {selectedBooking?.time}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              A reschedule request will be sent to the barbershop. They will contact you within 24 hours to confirm a
              new time slot.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsRescheduleDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={confirmReschedule} disabled={isLoading}>
                {isLoading ? "Processing..." : "Confirm Reschedule"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your {selectedBooking?.service} appointment?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium">Appointment Details</p>
              <p className="text-sm text-muted-foreground">
                {selectedBooking?.service} with {selectedBooking?.barber}
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedBooking && formatDate(selectedBooking.date)} at {selectedBooking?.time}
              </p>
            </div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Cancellation Policy:</strong> Appointments cancelled more than 24 hours in advance receive a
                full refund. Late cancellations may incur a fee.
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
                Keep Appointment
              </Button>
              <Button variant="destructive" onClick={confirmCancel} disabled={isLoading}>
                {isLoading ? "Cancelling..." : "Cancel Appointment"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
