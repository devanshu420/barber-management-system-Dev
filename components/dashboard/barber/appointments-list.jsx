"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Clock, Phone, MessageSquare, Check, X } from "lucide-react"

const initialAppointments = [
  {
    id: "1",
    customer: {
      name: "John Smith",
      phone: "+1 (555) 123-4567",
      avatar: "/placeholder.svg?key=customer1",
    },
    service: "Classic Haircut",
    date: "2024-01-15",
    time: "10:00 AM",
    duration: 30,
    price: 25,
    status: "confirmed",
    notes: "Regular customer, prefers short sides",
  },
  {
    id: "2",
    customer: {
      name: "Mike Johnson",
      phone: "+1 (555) 987-6543",
      avatar: "/placeholder.svg?key=customer2",
    },
    service: "Beard Trim & Shave",
    date: "2024-01-15",
    time: "11:30 AM",
    duration: 25,
    price: 20,
    status: "pending",
    notes: "First time customer",
  },
  {
    id: "3",
    customer: {
      name: "David Wilson",
      phone: "+1 (555) 456-7890",
      avatar: "/placeholder.svg?key=customer3",
    },
    service: "Premium Package",
    date: "2024-01-15",
    time: "2:00 PM",
    duration: 60,
    price: 50,
    status: "confirmed",
    notes: "Wedding preparation",
  },
  {
    id: "4",
    customer: {
      name: "Robert Brown",
      phone: "+1 (555) 321-0987",
      avatar: "/placeholder.svg?key=customer4",
    },
    service: "Hair Styling",
    date: "2024-01-15",
    time: "4:30 PM",
    duration: 20,
    price: 15,
    status: "rescheduling",
    notes: "Customer requested reschedule",
  },
]

export function AppointmentsList({ showAll = false }) {
  const [appointments, setAppointments] = useState(initialAppointments)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const displayAppointments = showAll ? appointments : appointments.slice(0, 3)

  const handleConfirmAppointment = (appointment) => {
    console.log("[v0] Initiating confirmation for appointment:", appointment.id)
    setSelectedAppointment(appointment)
    setIsConfirmDialogOpen(true)
  }

  const confirmAppointment = async () => {
    if (!selectedAppointment) return

    setIsLoading(true)
    console.log("[v0] Confirming appointment:", selectedAppointment.id)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update appointment status
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === selectedAppointment.id ? { ...apt, status: "confirmed" } : apt)),
    )

    setIsLoading(false)
    setIsConfirmDialogOpen(false)
    setSelectedAppointment(null)
    console.log("[v0] Appointment confirmed successfully")
  }

  const handleCancelAppointment = (appointment) => {
    console.log("[v0] Initiating cancellation for appointment:", appointment.id)
    setSelectedAppointment(appointment)
    setIsCancelDialogOpen(true)
  }

  const cancelAppointment = async () => {
    if (!selectedAppointment) return

    setIsLoading(true)
    console.log("[v0] Cancelling appointment:", selectedAppointment.id)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update appointment status
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === selectedAppointment.id ? { ...apt, status: "cancelled" } : apt)),
    )

    setIsLoading(false)
    setIsCancelDialogOpen(false)
    setSelectedAppointment(null)
    console.log("[v0] Appointment cancelled successfully")
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-accent text-accent-foreground"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-destructive text-destructive-foreground"
      case "rescheduling":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Today's Appointments</span>
            <Badge variant="secondary">{appointments.length} total</Badge>
          </CardTitle>
          <CardDescription>
            {showAll ? "All scheduled appointments" : "Your upcoming appointments for today"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayAppointments.map((appointment) => (
              <div key={appointment.id} className="border rounded-lg p-4 space-y-3">
                {/* Customer Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={appointment.customer.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {appointment.customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{appointment.customer.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {appointment.customer.phone}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                </div>

                {/* Service Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">{appointment.service}</p>
                    <p className="text-muted-foreground">
                      ${appointment.price} • {appointment.duration} min
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="flex items-center justify-end">
                      <Clock className="w-4 h-4 mr-1" />
                      {appointment.time}
                    </p>
                    <p className="text-muted-foreground">{new Date(appointment.date).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Notes */}
                {appointment.notes && (
                  <div className="bg-muted/50 rounded p-2">
                    <p className="text-sm text-muted-foreground">
                      <strong>Notes:</strong> {appointment.notes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </Button>
                  </div>

                  {appointment.status === "pending" && (
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleCancelAppointment(appointment)}>
                        <X className="w-4 h-4 mr-1" />
                        Decline
                      </Button>
                      <Button size="sm" onClick={() => handleConfirmAppointment(appointment)}>
                        <Check className="w-4 h-4 mr-1" />
                        Confirm
                      </Button>
                    </div>
                  )}

                  {appointment.status === "rescheduling" && (
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Contact Customer
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {!showAll && appointments.length > 3 && (
              <Button variant="outline" className="w-full bg-transparent">
                View All Appointments ({appointments.length - 3} more)
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Appointment</DialogTitle>
            <DialogDescription>Confirm the appointment with {selectedAppointment?.customer.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium">{selectedAppointment?.service}</p>
              <p className="text-sm text-muted-foreground">
                {selectedAppointment?.time} • ${selectedAppointment?.price} • {selectedAppointment?.duration} min
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={confirmAppointment} disabled={isLoading}>
                {isLoading ? "Confirming..." : "Confirm Appointment"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline Appointment</DialogTitle>
            <DialogDescription>
              Decline the appointment request from {selectedAppointment?.customer.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium">{selectedAppointment?.service}</p>
              <p className="text-sm text-muted-foreground">
                {selectedAppointment?.time} • ${selectedAppointment?.price}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              The customer will be notified and can book a different time slot.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
                Keep Appointment
              </Button>
              <Button variant="destructive" onClick={cancelAppointment} disabled={isLoading}>
                {isLoading ? "Declining..." : "Decline Appointment"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
