"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, X } from "lucide-react";

export default function GalleryModal({
  open,
  onClose,
  loading,
  items,
  onImageClick,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-800/80 bg-slate-950/95 p-4 shadow-2xl shadow-cyan-900/60"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-100 sm:text-lg">
                  Generated Hairstyles
                </h2>
                <p className="text-xs text-gray-500">
                  Browse your previously generated hairstyle images.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center cursor-pointer justify-center rounded-full border border-gray-700/80 bg-gray-900/80 text-gray-400 transition hover:border-gray-500 hover:bg-gray-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {loading ? (
              <div className="flex h-52 items-center justify-center gap-2 text-sm text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin text-cyan-300" />
                Loading photos...
              </div>
            ) : items.length === 0 ? (
              <div className="flex h-52 items-center justify-center text-sm text-gray-500">
                No photos found yet. Generate your first hairstyle.
              </div>
            ) : (
              <div className="grid max-h-[70vh] grid-cols-1 gap-4 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onImageClick?.(item.imageUrl)}
                    className="group overflow-hidden rounded-2xl border border-gray-800/80 bg-gray-950/80 text-left shadow-lg transition hover:border-cyan-500/40 hover:shadow-cyan-500/10"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-black">
                      <img
                        src={item.imageUrl}
                        alt={item.prompt}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="border-t border-gray-800/80 p-3">
                      <p className="line-clamp-2 text-sm text-gray-200">
                        {item.prompt}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}