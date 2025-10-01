"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Calendar, Clock, User, Scissors, CreditCard } from "lucide-react"
import { PaymentForm } from "@/components/payment/payment-form"

export function BookingConfirmation({ bookingData }) {
  const [showPayment, setShowPayment] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)

  const handleConfirmBooking = () => {
    setShowPayment(true)
  }

  const handlePaymentComplete = (paymentData) => {
    console.log("[v0] Payment completed:", paymentData)
    setBookingConfirmed(true)
    setShowPayment(false)
    alert("Booking confirmed and payment processed! You will receive a confirmation email shortly.")
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (bookingConfirmed) {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h2>
          <p className="text-muted-foreground">Your appointment has been successfully booked and paid for.</p>
        </div>
        <Button asChild>
          <a href="/dashboard/customer">View My Bookings</a>
        </Button>
      </div>
    )
  }

  if (showPayment) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Complete Payment</h2>
          <p className="text-muted-foreground">Secure payment to confirm your booking</p>
        </div>
        <PaymentForm
          amount={bookingData.service?.price || 0}
          onPaymentComplete={handlePaymentComplete}
          bookingDetails={{
            service: bookingData.service?.name || "",
            barber: bookingData.barber?.name || "",
            date: bookingData.date ? formatDate(bookingData.date) : "",
            time: bookingData.time || "",
          }}
        />
        <Button variant="outline" onClick={() => setShowPayment(false)} className="w-full">
          Back to Booking Details
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Confirm Your Booking</h2>
        <p className="text-muted-foreground">Please review your appointment details before confirming</p>
      </div>

      <div className="space-y-6">
        {/* Appointment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-accent" />
              Appointment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Service */}
            {bookingData.service && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Scissors className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{bookingData.service.name}</p>
                    <p className="text-sm text-muted-foreground">{bookingData.service.duration} minutes</p>
                  </div>
                </div>
                <Badge variant="secondary" className="font-bold">
                  ${bookingData.service.price}
                </Badge>
              </div>
            )}

            <Separator />

            {/* Barber */}
            {bookingData.barber && (
              <div className="flex items-center space-x-3">
                <img
                  src={bookingData.barber.image || "/placeholder.svg"}
                  alt={bookingData.barber.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {bookingData.barber.name}
                  </p>
                  <p className="text-sm text-muted-foreground">★ {bookingData.barber.rating} rating</p>
                </div>
              </div>
            )}

            <Separator />

            {/* Date & Time */}
            {bookingData.date && bookingData.time && (
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">{formatDate(bookingData.date)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">{bookingData.time}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Service Fee</span>
                <span>${bookingData.service?.price || 0}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Booking Fee</span>
                <span>$0</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${bookingData.service?.price || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms and Conditions */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-medium text-foreground">Booking Terms:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Cancellations must be made at least 24 hours in advance</li>
                <li>Late arrivals may result in shortened service time</li>
                <li>Payment is due at the time of service</li>
                <li>Gratuity is appreciated but not required</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Confirm Button */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" className="flex-1 bg-transparent">
            Back to Edit
          </Button>
          <Button onClick={handleConfirmBooking} className="flex-1">
            Proceed to Payment
          </Button>
        </div>
      </div>
    </div>
  )
}
