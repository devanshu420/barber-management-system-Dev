"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, UserCheck, UserX, Mail, Phone } from "lucide-react"

// Mock user data
const customers = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    joinDate: "2024-01-10",
    totalBookings: 12,
    status: "active",
    lastBooking: "2024-01-14",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1 (555) 987-6543",
    joinDate: "2024-01-08",
    totalBookings: 8,
    status: "active",
    lastBooking: "2024-01-13",
  },
  {
    id: "3",
    name: "Mike Wilson",
    email: "mike.wilson@email.com",
    phone: "+1 (555) 456-7890",
    joinDate: "2024-01-05",
    totalBookings: 3,
    status: "inactive",
    lastBooking: "2024-01-06",
  },
]

const barbers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@barberbook.com",
    phone: "+1 (555) 111-2222",
    joinDate: "2023-12-01",
    totalBookings: 156,
    rating: 4.9,
    status: "active",
    specialties: ["Classic Cuts", "Beard Styling"],
    verified: true,
  },
  {
    id: "2",
    name: "Sarah Wilson",
    email: "sarah.wilson@barberbook.com",
    phone: "+1 (555) 333-4444",
    joinDate: "2023-11-15",
    totalBookings: 203,
    rating: 4.8,
    status: "active",
    specialties: ["Creative Cuts", "Color Styling"],
    verified: true,
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@email.com",
    phone: "+1 (555) 555-6666",
    joinDate: "2024-01-12",
    totalBookings: 0,
    rating: 0,
    status: "pending",
    specialties: ["Modern Styles", "Fades"],
    verified: false,
  },
]

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const handleApproveBarber = (barberId: string) => {
    console.log("[v0] Approving barber:", barberId)
    // TODO: Implement barber approval logic
  }

  const handleRejectBarber = (barberId: string) => {
    console.log("[v0] Rejecting barber:", barberId)
    // TODO: Implement barber rejection logic
  }

  const handleSuspendUser = (userId: string, userType: string) => {
    console.log("[v0] Suspending user:", userId, userType)
    // TODO: Implement user suspension logic
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search users by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="customers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="customers">Customers ({customers.length})</TabsTrigger>
          <TabsTrigger value="barbers">Barbers ({barbers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Customer Management</CardTitle>
              <CardDescription>Manage customer accounts and activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>
                          {customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {customer.email}
                          </span>
                          <span className="flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {customer.phone}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Joined: {new Date(customer.joinDate).toLocaleDateString()} •{customer.totalBookings} bookings
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {getStatusBadge(customer.status)}
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="barbers">
          <Card>
            <CardHeader>
              <CardTitle>Barber Management</CardTitle>
              <CardDescription>Manage barber accounts, approvals, and verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {barbers.map((barber) => (
                  <div key={barber.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>
                          {barber.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{barber.name}</p>
                          {barber.verified && (
                            <Badge variant="outline" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {barber.email}
                          </span>
                          <span className="flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {barber.phone}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                          <span>Joined: {new Date(barber.joinDate).toLocaleDateString()}</span>
                          <span>{barber.totalBookings} bookings</span>
                          {barber.rating > 0 && <span>★ {barber.rating} rating</span>}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {barber.specialties.map((specialty) => (
                            <Badge key={specialty} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {getStatusBadge(barber.status)}
                      {barber.status === "pending" && (
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleRejectBarber(barber.id)}>
                            <UserX className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                          <Button size="sm" onClick={() => handleApproveBarber(barber.id)}>
                            <UserCheck className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      )}
                      {barber.status === "active" && (
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
