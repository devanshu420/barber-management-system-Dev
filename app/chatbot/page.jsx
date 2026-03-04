"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Scissors, Circle, Send, Loader2 } from "lucide-react";

export default function ChatbotPage() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userText = message;
    setChat((prev) => [...prev, { role: "user", text: userText }]);
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      console.log("TOKEN:", token);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify({
          message: userText, 
        }),
      });

      const data = await res.json();

      setChat((prev) => [
        ...prev,
        { role: "assistant", text: data.reply },
      ]);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

return (
  <div className="min-h-screen w-screen bg-gradient-to-br from-black via-gray-950 to-cyan-950 text-white flex items-center justify-center px-4 py-6">

    {/* Main Chat Container */}
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="
      relative 
      w-full 
      max-w-5xl
      h-[85vh] 
      sm:h-[75vh] 
      md:h-[65vh] 
      lg:h-[55vh] 
      xl:h-[50vh]
      lg:w-[50vw]
      bg-white/5 
      backdrop-blur-2xl 
      rounded-3xl 
      border border-cyan-400/20 
      shadow-[0_0_40px_rgba(0,255,255,0.12)] 
      overflow-hidden 
      flex flex-col"
    >

      {/* Header */}
      <div className="flex items-center px-4 sm:px-6 h-[70px] border-b border-cyan-400/10 bg-black/40 backdrop-blur-xl">
        
        <div className="p-2 bg-cyan-500/20 rounded-xl border border-cyan-400/30 shadow-md shadow-cyan-500/20">
          <Scissors className="w-5 h-5 text-cyan-400" />
        </div>

        <h1 className="ml-3 sm:ml-4 text-base sm:text-lg md:text-xl font-semibold tracking-wide bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
          Barber AI Assistant
        </h1>

        <div className="ml-auto flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
          </span>
          <span className="text-xs text-gray-400 hidden sm:block">Online</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">

        {chat.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`
              max-w-[85%] sm:max-w-[75%] 
              px-4 sm:px-5 py-2.5 sm:py-3 
              text-sm sm:text-[15px] 
              rounded-2xl 
              shadow-md 
              break-words
              ${msg.role === "user"
                ? "bg-gradient-to-r from-cyan-500 to-teal-400 text-black font-medium"
                : "bg-gray-900/70 backdrop-blur-md border border-gray-700/50 text-gray-200"
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}

        {/* Typing Indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-900/70 px-4 py-2.5 rounded-2xl border border-gray-700/50 flex gap-1.5">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-150"></span>
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-300"></span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Section */}
      <div className="px-4 sm:px-6 py-3 border-t border-cyan-400/10 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-3">

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about booking, services, pricing..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="
            flex-1 
            bg-black/50 
            border border-gray-700/50 
            rounded-full 
            px-4 sm:px-6 
            py-2.5 
            text-sm 
            text-white 
            placeholder-gray-500 
            focus:outline-none 
            focus:ring-2 
            focus:ring-cyan-500/40 
            focus:border-cyan-400 
            transition-all duration-300"
          />

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendMessage}
            disabled={!message.trim() || loading}
            className="
            w-10 h-10 sm:w-12 sm:h-12 
            rounded-full 
            bg-gradient-to-r from-cyan-500 to-teal-400 
            text-black 
            flex items-center justify-center 
            shadow-md 
            hover:shadow-cyan-500/50 
            transition-all 
            disabled:opacity-40"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>

        </div>
      </div>

    </motion.div>
  </div>
);
}



















































// "use client";

// import { useState, useRef, useEffect } from "react";

// export default function ChatbotPage() {
//   const [message, setMessage] = useState("");
//   const [chat, setChat] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat]);

//   const sendMessage = async () => {
//   if (!message.trim()) return;

//   const userText = message;
//   setChat((prev) => [...prev, { role: "user", text: userText }]);
//   setLoading(true);
//   setMessage("");

//   try {
//     const token = localStorage.getItem("token");
//     console.log("TOKEN:", token);

//     const res = await fetch("http://localhost:5000/api/ai/chat", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`, 
//       },
//       body: JSON.stringify({
//         message: userText, 
//       }),
//     });

//     const data = await res.json();

//     setChat((prev) => [
//       ...prev,
//       { role: "assistant", text: data.reply },
//     ]);
//   } catch (error) {
//     console.log(error);
//   }

//   setLoading(false);
// };

//   return (
//     <div className="flex flex-col h-screen bg-black text-white">
//       <div className="p-4 border-b border-gray-800">
//         <h1 className="text-xl font-semibold">💈 Barber AI Assistant</h1>
//       </div>

//       <div className="flex-1 overflow-y-auto p-4 space-y-3">
//         {chat.map((msg, index) => (
//           <div
//             key={index}
//             className={`flex ${
//               msg.role === "user" ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`px-4 py-2 rounded-xl max-w-[70%] ${
//                 msg.role === "user"
//                   ? "bg-green-500 text-black"
//                   : "bg-gray-800 text-white"
//               }`}
//             >
//               {msg.text}
//             </div>
//           </div>
//         ))}

//         {loading && (
//           <div className="text-gray-400 text-sm">Typing...</div>
//         )}

//         <div ref={chatEndRef} />
//       </div>

//       <div className="p-4 border-t border-gray-800 flex gap-2">
//         <input
//           className="flex-1 p-2 bg-gray-900 rounded-lg outline-none"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Type message..."
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-green-500 px-4 rounded-lg text-black"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }











// "use client";

// import { useState } from "react";

// export default function ChatbotPage() {
//   const [message, setMessage] = useState("");
//   const [chat, setChat] = useState([]);

//   const sendMessage = async () => {
//     if (!message) return;

//     const userMessage = { role: "user", text: message };
//     setChat((prev) => [...prev, userMessage]);

//     const res = await fetch("http://localhost:5000/api/ai/chat", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         message,
//         userId: "123", // Replace with real logged-in user id
//       }),
//     });

//     const data = await res.json();

//     const aiMessage = { role: "assistant", text: data.reply };
//     setChat((prev) => [...prev, aiMessage]);

//     setMessage("");
//   };

//   return (
//     <div className="min-h-screen bg-black text-white p-5">
//       <h1 className="text-3xl mb-4">Barber AI Assistant</h1>

//       <div className="border p-4 h-100 overflow-y-auto mb-4">
//         {chat.map((msg, index) => (
//           <div
//             key={index}
//             className={`mb-2 ${
//               msg.role === "user" ? "text-right" : "text-left"
//             }`}
//           >
//             <p className="bg-gray-800 inline-block p-2 rounded">
//               {msg.text}
//             </p>
//           </div>
//         ))}
//       </div>

//       <div className="flex gap-2">
//         <input
//           className="flex-1 p-2 text-black"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Ask about booking..."
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-green-500 px-4 rounded"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }