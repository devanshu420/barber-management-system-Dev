"use client";

import { useState, useRef, useEffect } from "react";

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
      const res = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userText,
          userId: "123",
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
    <div className="flex flex-col h-screen bg-black text-white">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-semibold">💈 Barber AI Assistant</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-xl max-w-[70%] ${
                msg.role === "user"
                  ? "bg-green-500 text-black"
                  : "bg-gray-800 text-white"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 text-sm">Typing...</div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t border-gray-800 flex gap-2">
        <input
          className="flex-1 p-2 bg-gray-900 rounded-lg outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 px-4 rounded-lg text-black"
        >
          Send
        </button>
      </div>
    </div>
  );
}











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