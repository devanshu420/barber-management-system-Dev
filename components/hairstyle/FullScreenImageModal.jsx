"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, X } from "lucide-react";

export default function FullScreenImageModal({ imageUrl, onClose }) {
  const open = Boolean(imageUrl);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [open, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;

    const link = document.createElement("a");
    link.href = imageUrl;
    link.setAttribute("download", "hairstyle-image");
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-2 backdrop-blur-md sm:px-6"
          onClick={handleBackdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-950/95 shadow-2xl shadow-cyan-900/50"
          >
            <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
            <button
  type="button"
  onClick={handleDownload}
  className="inline-flex items-center gap-2 rounded-full border border-sky-300/80 bg-red-500 px-4 py-2 text-sm font-semibold text-sky-100 shadow-lg shadow-sky-500/30 backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-sky-200 hover:bg-red-600 hover:text-white active:scale-95 focus:outline-none focus:ring-2 focus:ring-sky-300/80"
  title="Download image"
  aria-label="Download image"
>
  <Download className="h-4 w-4" strokeWidth={2.4} />
  <span className="hidden sm:inline">Download</span>
</button>


              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center cursor-pointer justify-center rounded-full border border-gray-700/80 bg-gray-900/80 text-gray-100 transition hover:bg-gray-800"
                title="Close"
              >
                <X className="h-4 w-4 cursor-pointer" />
              </button>
            </div>

            <div className="flex items-center justify-center p-3 sm:p-5">
              <img
                src={imageUrl}
                alt="Fullscreen hairstyle preview"
                className="max-h-[85vh] w-auto max-w-full rounded-2xl object-contain"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
