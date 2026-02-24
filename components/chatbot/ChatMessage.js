export default function ChatMessage({ role, text }) {
  return (
    <div className={`mb-3 flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-lg max-w-xs ${
          role === "user"
            ? "bg-green-600 text-white"
            : "bg-zinc-700 text-gray-200"
        }`}
      >
        {text}
      </div>
    </div>
  );
}