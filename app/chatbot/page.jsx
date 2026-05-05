"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Scissors, Send } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChatbotPage() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const chatEndRef = useRef(null);
  const router = useRouter();

  // 🔐 AUTH CHECK
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/auth/login");
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  // 📜 AUTO SCROLL
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // 💬 SEND MESSAGE
  const sendMessage = async () => {
    if (!message.trim()) return;

    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    const userText = message;

    setChat((prev) => [...prev, { role: "user", text: userText }]);
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ai/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: userText }),
        }
      );

      // 🔐 Unauthorized
      if (res.status === 401 || res.status === 403) {
        router.replace("/auth/login");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Something went wrong");
      }

      setChat((prev) => [
        ...prev,
        { role: "assistant", text: data.reply || "No response" },
      ]);
    } catch (error) {
      console.error(error);

      setChat((prev) => [
        ...prev,
        { role: "assistant", text: "⚠️ Error: Failed to get response" },
      ]);
    }

    setLoading(false);
  };

  // ⏳ LOADING SCREEN (AUTH CHECK)
  if (checkingAuth) {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-black">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-black via-gray-950 to-cyan-950 text-white flex items-center justify-center px-4 py-6">
      
      {/* MAIN CONTAINER */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl h-[80vh] bg-white/5 backdrop-blur-2xl rounded-3xl border border-cyan-400/20 flex flex-col overflow-hidden"
      >
        
        {/* HEADER */}
        <div className="flex items-center px-6 h-[70px] border-b border-cyan-400/10 bg-black/40">
          <div className="p-2 bg-cyan-500/20 rounded-xl">
            <Scissors className="w-5 h-5 text-cyan-400" />
          </div>

          <h1 className="ml-4 text-lg font-semibold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Barber AI Assistant
          </h1>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {chat.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[70%] ${
                  msg.role === "user"
                    ? "bg-cyan-500 text-black"
                    : "bg-gray-800 text-gray-200"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* LOADING */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 px-4 py-2 rounded-2xl">
                Typing...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* INPUT */}
        <div className="px-6 py-3 border-t border-cyan-400/10 bg-black/40">
          <div className="flex gap-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask something..."
              className="flex-1 bg-black/50 border border-gray-700 rounded-full px-4 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-500"
            />

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={sendMessage}
              disabled={!message.trim() || loading}
              className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center text-black disabled:opacity-40"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
