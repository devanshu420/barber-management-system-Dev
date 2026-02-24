import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message);
    setMessage("");
  };

  return (
    <div className="flex gap-2 mt-4">
      <input
        className="flex-1 p-3 rounded-lg bg-zinc-800 text-white outline-none"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask about booking, haircut, timings..."
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        onClick={handleSend}
        className="bg-green-600 px-6 rounded-lg hover:bg-green-700"
      >
        Send
      </button>
    </div>
  );
}