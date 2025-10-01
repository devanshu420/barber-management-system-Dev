"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Search, CalendarIcon, Clock, DollarSign, AlertCircle } from "lucide-react"

// Mock booking data
const bookings = [
  {
    id: "BK001",
    customer: { name: "John Smith", avatar: "/placeholder.svg" },
    barber: { name: "John Doe", avatar: "/placeholder.svg" },
    service: "Classic Haircut",
    date: "2024-01-15",
    time: "10:00 AM",
    duration: 30,
    price: 25,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2024-01-14T09:30:00Z",
  },
  {
    id: "BK002",
    customer: { name: "Sarah Johnson", avatar: "/placeholder.svg" },
    barber: { name: "Sarah Wilson", avatar: "/placeholder.svg" },
    service: "Premium Package",
    date: "2024-01-15",
    time: "2:00 PM",
    duration: 60,
    price: 50,
    status: "pending",
    paymentStatus: "pending",
    createdAt: "2024-01-14T11:15:00Z",
  },
  {
    id: "BK003",
    customer: { name: "Mike Wilson", avatar: "/placeholder.svg" },
    barber: { name: "Mike Smith", avatar: "/placeholder.svg" },
    service: "Beard Trim & Shave",
    date: "2024-01-15",
    time: "4:30 PM",
    duration: 25,
    price: 20,
    status: "cancelled",
    paymentStatus: "refunded",
    createdAt: "2024-01-13T14:20:00Z",
  },
  {
    id: "BK004",
    customer: { name: "David Brown", avatar: "/placeholder.svg" },
    barber: { name: "Alex Johnson", avatar: "/placeholder.svg" },
    service: "Hair Styling",
    date: "2024-01-16",
    time: "11:00 AM",
    duration: 20,
    price: 15,
    status: "completed",
    paymentStatus: "paid",
    createdAt: "2024-01-12T16:45:00Z",
  },
]

export function BookingManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedDate, setSelectedDate] = useState<Date>()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      case "no-show":
        return <Badge className="bg-red-100 text-red-800">No Show</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "refunded":
        return <Badge className="bg-gray-100 text-gray-800">Refunded</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.barber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Booking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold">{bookings.length}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {bookings.filter((b) => b.status === "pending").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold text-accent">${bookings.reduce((sum, b) => sum + b.price, 0)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Issues</p>
                <p className="text-2xl font-bold text-red-600">
                  {bookings.filter((b) => b.status === "cancelled" || b.status === "no-show").length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by booking ID, customer, or barber..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <div className="w-full lg:w-auto">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>
            Showing {filteredBookings.length} of {bookings.length} bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">{booking.id}</Badge>
                    <div>
                      <p className="font-medium">{booking.service}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(booking.date).toLocaleDateString()} at {booking.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {getStatusBadge(booking.status)}
                    {getPaymentBadge(booking.paymentStatus)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium mb-1">Customer</p>
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={booking.customer.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {booking.customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>{booking.customer.name}</span>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium mb-1">Barber</p>
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={booking.barber.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {booking.barber.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>{booking.barber.name}</span>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium mb-1">Details</p>
                    <p className="text-muted-foreground">
                      ${booking.price} • {booking.duration} min
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t">
                  <p className="text-xs text-muted-foreground">
                    Created: {new Date(booking.createdAt).toLocaleString()}
                  </p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {booking.status === "pending" && (
                      <>
                        <Button variant="outline" size="sm">
                          Cancel
                        </Button>
                        <Button size="sm">Approve</Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
