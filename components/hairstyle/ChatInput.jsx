"use client";

import { motion } from "framer-motion";
import { ImagePlus, SendHorizonal, X, Sparkles } from "lucide-react";

export default function ChatInput({
  prompt,
  setPrompt,
  file,
  setFile,
  onSubmit,
  loading,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) onSubmit();
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-xl sm:p-2.5">
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2">
          <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-400/20 sm:flex">
            <Sparkles className="h-3.5 w-3.5" />
          </div>

          <div className="flex-1">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              disabled={loading}
              placeholder='Describe your look, e.g. "curly fade with taper and sharp beard line"'
              className="min-h-[60px] max-h-28 w-full resize-none overflow-y-auto rounded-2xl border border-white/10 bg-black/30 px-2.5 py-2 text-xs sm:text-sm text-white placeholder:text-gray-500 focus:border-cyan-400/70 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-60"
            />

            <div className="mt-1 flex flex-wrap items-center gap-1 text-[9px] sm:gap-1.5 sm:text-[10px] text-gray-400">
              <span className="rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 sm:px-2">
                Enter = send
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 sm:px-2">
                Shift + Enter = new line
              </span>
            </div>
          </div>

          <label className="group flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-black/30 text-gray-400 transition hover:border-cyan-400/70 hover:bg-cyan-500/10 hover:text-cyan-200">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
            />
            <ImagePlus className="h-4 w-4 sm:h-4.5 sm:w-4.5 transition group-hover:scale-110" />
          </label>
        </div>

        <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-black/20 px-2 py-2 sm:px-2.5 sm:py-2.5">
          <div className="min-w-0 flex-1">
            {file ? (
              <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] text-gray-200">
                <span className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-500/10 px-1.5 py-0.5 text-emerald-200">
                  Image attached
                </span>
                <span className="truncate text-gray-400 max-w-[120px] sm:max-w-none">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="inline-flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-white"
                >
                  <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </button>
              </div>
            ) : (
              <p className="text-[10px] text-gray-500">
                Upload a clear front-facing portrait for better results.
              </p>
            )}
          </div>

          <motion.button
            type="button"
            disabled={loading}
            whileTap={{ scale: loading ? 1 : 0.97 }}
            onClick={onSubmit}
            className="inline-flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-300 px-3 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:from-cyan-300 hover:to-teal-200 disabled:cursor-not-allowed disabled:opacity-70 sm:gap-1.5 sm:px-4 sm:py-2.5 sm:text-sm"
          >
            {loading ? (
              <span>Generating...</span>
            ) : (
              <>
                <span>Generate</span>
                <SendHorizonal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { motion } from "framer-motion";
// import { ImagePlus, SendHorizonal } from "lucide-react";

// export default function ChatInput({
//   prompt,
//   setPrompt,
//   file,
//   setFile,
//   onSubmit,
//   loading,
// }) {
//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       if (!loading) onSubmit();
//     }
//   };

//   const handleFileChange = (e) => {
//     const selected = e.target.files?.[0] || null;
//     setFile(selected);
//   };

//   return (
//     <div className="flex flex-col gap-3 rounded-2xl border border-gray-800/70 bg-slate-950/60 p-3 sm:p-4">
//       <div className="flex gap-3">
//         <textarea
//           value={prompt}
//           onChange={(e) => setPrompt(e.target.value)}
//           onKeyDown={handleKeyDown}
//           rows={3}
//           disabled={loading}
//           placeholder='Describe a hairstyle, e.g. "curly fade with taper"'
//           className="min-h-[72px] flex-1 resize-none rounded-2xl border border-gray-800/80 bg-black/40 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-600 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/60 disabled:opacity-60"
//         />

//         <label className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl border border-gray-800/80 bg-slate-950/80 text-gray-400 transition hover:border-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-200">
//           <input
//             type="file"
//             className="hidden"
//             accept="image/*"
//             onChange={handleFileChange}
//             disabled={loading}
//           />
//           <ImagePlus className="h-5 w-5" />
//         </label>
//       </div>

//       <div className="flex items-center justify-between text-xs text-gray-500">
//         <span>
//           {file
//             ? `Selected: ${file.name.slice(0, 28)}${file.name.length > 28 ? "..." : ""}`
//             : "Upload a clear, front-facing portrait image."}
//         </span>

//         <motion.button
//           type="button"
//           disabled={loading}
//           whileTap={{ scale: loading ? 1 : 0.97 }}
//           onClick={onSubmit}
//           className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:from-cyan-400 hover:to-teal-300 disabled:cursor-not-allowed disabled:opacity-70"
//         >
//           {loading ? (
//             <span>Generating...</span>
//           ) : (
//             <>
//               <span>Generate</span>
//               <SendHorizonal className="h-4 w-4" />
//             </>
//           )}
//         </motion.button>
//       </div>
//     </div>
//   );
// }
