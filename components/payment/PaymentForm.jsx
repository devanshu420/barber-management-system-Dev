"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Wallet, DollarSign } from "lucide-react"

export function PaymentForm({ amount, onPaymentComplete, bookingDetails }) {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const paymentData = {
      method: paymentMethod,
      amount,
      transactionId: `txn_${Date.now()}`,
      status: "completed",
      timestamp: new Date().toISOString(),
    }

    onPaymentComplete(paymentData)
    setIsProcessing(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Payment Details
        </CardTitle>
        <CardDescription>Complete your booking payment securely</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {bookingDetails && (
          <div className="space-y-2">
            <h4 className="font-medium">Booking Summary</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Service: {bookingDetails.service}</p>
              <p>Barber: {bookingDetails.barber}</p>
              <p>Date: {bookingDetails.date}</p>
              <p>Time: {bookingDetails.time}</p>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Total Amount:</span>
              <span>${amount}</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Label>Payment Method</Label>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                <CreditCard className="h-4 w-4" />
                Credit/Debit Card
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="wallet" id="wallet" />
              <Label htmlFor="wallet" className="flex items-center gap-2 cursor-pointer">
                <Wallet className="h-4 w-4" />
                Wallet Balance ($125.50)
              </Label>
            </div>
          </RadioGroup>
        </div>

        {paymentMethod === "card" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                value={cardDetails.name}
                onChange={(e) => setCardDetails((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={(e) => setCardDetails((prev) => ({ ...prev, number: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails((prev) => ({ ...prev, expiry: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails((prev) => ({ ...prev, cvv: e.target.value }))}
                />
              </div>
            </div>
          </div>
        )}

        <Button onClick={handlePayment} disabled={isProcessing} className="w-full">
          {isProcessing ? "Processing..." : `Pay $${amount}`}
        </Button>
      </CardContent>
    </Card>
  )
}
