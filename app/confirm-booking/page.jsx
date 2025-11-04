"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Calendar,
  Clock,
  User,
  Scissors,
  CreditCard,
} from "lucide-react";
import { PaymentForm } from "@/components/payment/payment-form";

export default function ConfirmBookingPage() {
  const router = useRouter();

  // Example dummy booking data (replace with real props or context)
  const bookingData = {
    service: { name: "Haircut & Styling", price: 499, duration: 45 },
    barber: {
      name: "John Doe",
      rating: 4.9,
      image: "/images/barber1.jpg",
    },
    date: new Date().toISOString(),
    time: "3:30 PM",
  };

  const [showPayment, setShowPayment] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleConfirmBooking = () => setShowPayment(true);

  const handlePaymentComplete = (paymentData) => {
    console.log("Payment completed:", paymentData);
    setBookingConfirmed(true);
    setShowPayment(false);
    alert("Booking confirmed and payment processed!");
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (bookingConfirmed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <div className="text-center space-y-6 bg-white p-10 rounded-2xl shadow-md max-w-md w-full">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Booking Confirmed!
          </h2>
          <p className="text-gray-500">
            Your appointment has been successfully booked and paid for.
          </p>
          <Button onClick={() => router.push("/dashboard/customer")}>
            View My Bookings
          </Button>
        </div>
      </div>
    );
  }

  if (showPayment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Complete Payment
          </h2>
          <p className="text-gray-500 mb-6">
            Secure payment to confirm your booking
          </p>
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
          <Button
            variant="outline"
            onClick={() => setShowPayment(false)}
            className="w-full mt-4"
          >
            Back to Booking Details
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Confirm Your Booking</h2>
        <p className="text-gray-500">
          Please review your appointment details before confirming
        </p>

        {/* Appointment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-blue-500" />
              Appointment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {bookingData.service && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Scissors className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">{bookingData.service.name}</p>
                    <p className="text-sm text-gray-500">
                      {bookingData.service.duration} minutes
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="font-bold">
                  ₹{bookingData.service.price}
                </Badge>
              </div>
            )}

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
                  <p className="text-sm text-gray-500">
                    ★ {bookingData.barber.rating} rating
                  </p>
                </div>
              </div>
            )}

            {bookingData.date && bookingData.time && (
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-medium">
                    {formatDate(bookingData.date)}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
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
                <span>₹{bookingData.service?.price || 0}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Booking Fee</span>
                <span>₹0</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{bookingData.service?.price || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Confirm Button */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            className="flex-1 bg-transparent"
            onClick={() => router.back()}
          >
            Back to Edit
          </Button>
          <Button onClick={handleConfirmBooking} className="flex-1">
            Proceed to Payment
          </Button>
        </div>
      </div>
    </div>
  );
}

