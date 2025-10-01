import { LiveChat } from "@/components/chat/live-chat"
import { NotificationCenter } from "@/components/notifications/notification-center"

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Messages & Notifications</h1>
          <p className="text-muted-foreground mt-2">Stay connected with your customers and manage notifications</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Active Conversations</h2>
            <LiveChat
              chatId="chat_001"
              currentUserId="barber_001"
              recipientName="John Smith"
              recipientAvatar="/professional-barber-headshot.jpg"
              recipientRole="customer"
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            <NotificationCenter />
          </div>
        </div>
      </div>
    </div>
  )
}
