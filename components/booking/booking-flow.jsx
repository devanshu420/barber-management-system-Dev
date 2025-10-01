"use client"

import { useState } from "react"
import { ServiceSelection } from "./service-selection"
import { LocationSelection } from "./location-selection"
import { ShopSelection } from "./shop-selection"
import { BarberSelection } from "./barber-selection"
import { TimeSelection } from "./time-selection"
import { BookingConfirmation } from "./booking-confirmation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"

const steps = [
  { id: "service", title: "Select Service", description: "Choose your desired service" },
  { id: "location", title: "Enable Location", description: "Allow location access" },
  { id: "shop", title: "Choose Shop", description: "Select nearby barbershop" },
  { id: "barber", title: "Choose Barber", description: "Pick your preferred barber" },
  { id: "time", title: "Select Time", description: "Choose date and time" },
  { id: "confirmation", title: "Confirm Booking", description: "Review and confirm" },
]

export function BookingFlow() {
  const [currentStep, setCurrentStep] = useState("service")
  const [bookingData, setBookingData] = useState({})

  const handleStepComplete = (step, data) => {
    setBookingData((prev) => ({ ...prev, ...data }))

    const stepIndex = steps.findIndex((s) => s.id === step)
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1].id)
    }
  }

  const getCurrentStepIndex = () => steps.findIndex((s) => s.id === currentStep)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Book Your Appointment</h1>
        <p className="text-muted-foreground">Follow the steps below to schedule your barber appointment</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep
            const isCompleted = getCurrentStepIndex() > index

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                      ${isCompleted ? "bg-accent text-accent-foreground" : isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}
                    `}
                  >
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>{step.title}</p>
                    <p className="text-xs text-muted-foreground hidden sm:block">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${getCurrentStepIndex() > index ? "bg-accent" : "bg-border"}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Booking Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              {currentStep === "service" && (
                <ServiceSelection onSelect={(service) => handleStepComplete("service", { service })} />
              )}

              {currentStep === "location" && (
                <LocationSelection onSelect={(userLocation) => handleStepComplete("location", { userLocation })} />
              )}

              {currentStep === "shop" && (
                <ShopSelection
                  userLocation={bookingData.userLocation}
                  onSelect={(shop) => handleStepComplete("shop", { shop })}
                />
              )}

              {currentStep === "barber" && (
                <BarberSelection
                  serviceId={bookingData.service?.id}
                  locationId={bookingData.shop?.id}
                  onSelect={(barber) => handleStepComplete("barber", { barber })}
                />
              )}

              {currentStep === "time" && (
                <TimeSelection
                  barberId={bookingData.barber?.id}
                  serviceDuration={bookingData.service?.duration}
                  onSelect={(date, time) => handleStepComplete("time", { date, time })}
                />
              )}

              {currentStep === "confirmation" && <BookingConfirmation bookingData={bookingData} />}
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {bookingData.service && (
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{bookingData.service.name}</p>
                    <p className="text-sm text-muted-foreground">{bookingData.service.duration} minutes</p>
                  </div>
                  <Badge variant="secondary">${bookingData.service.price}</Badge>
                </div>
              )}

              {bookingData.shop && (
                <div className="flex items-start space-x-3">
                  <img
                    src={bookingData.shop.image || "/placeholder.svg"}
                    alt={bookingData.shop.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{bookingData.shop.name}</p>
                    <p className="text-sm text-muted-foreground">{bookingData.shop.distance?.toFixed(1)} km away</p>
                  </div>
                </div>
              )}

              {bookingData.barber && (
                <div className="flex items-center space-x-3">
                  <img
                    src={bookingData.barber.image || "/placeholder.svg"}
                    alt={bookingData.barber.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{bookingData.barber.name}</p>
                    <p className="text-sm text-muted-foreground">★ {bookingData.barber.rating}</p>
                  </div>
                </div>
              )}

              {bookingData.date && bookingData.time && (
                <div>
                  <p className="font-medium">Date & Time</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(bookingData.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">{bookingData.time}</p>
                </div>
              )}

              {bookingData.service && (
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center font-medium">
                    <span>Total</span>
                    <span>${bookingData.service.price}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
  