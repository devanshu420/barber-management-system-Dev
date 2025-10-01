import { PaymentForm } from "@/components/payment/payment-form"
import { WalletManagement } from "@/components/payment/wallet-management"
import { TransactionHistory } from "@/components/payment/transaction-history"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PaymentPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Payment & Wallet</h1>
          <p className="text-muted-foreground mt-2">Manage your payments, wallet, and transaction history</p>
        </div>

        <Tabs defaultValue="wallet" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="payment">Make Payment</TabsTrigger>
            <TabsTrigger value="history">Transaction History</TabsTrigger>
          </TabsList>

          <TabsContent value="wallet">
            <WalletManagement />
          </TabsContent>

          <TabsContent value="payment">
            <PaymentForm
              amount={45}
              onPaymentComplete={(data) => console.log("Payment completed:", data)}
              bookingDetails={{
                service: "Premium Haircut",
                barber: "Mike Johnson",
                date: "January 20, 2024",
                time: "2:00 PM",
              }}
            />
          </TabsContent>

          <TabsContent value="history">
            <TransactionHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
