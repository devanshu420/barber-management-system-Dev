import { LiveStatusUpdates } from "@/components/real-time/live-status-updates"
import { NotificationCenter } from "@/components/Otp/opt-registration"

export default function LiveStatusPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Live Status Dashboard</h1>
          <p className="text-muted-foreground mt-2">Monitor real-time appointment status and updates</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LiveStatusUpdates />
          </div>

          <div>
            <NotificationCenter />
          </div>
        </div>
      </div>
    </div>
  )
}
