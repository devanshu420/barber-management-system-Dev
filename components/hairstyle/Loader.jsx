"use client";

import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="rounded-2xl border border-gray-800/80 bg-slate-950/80 p-3 sm:p-4">
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10">
          <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin text-cyan-300" />
        </div>

        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-200">
            Generating hairstyle...
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500">
            Creating your AI hairstyle preview.
          </p>
        </div>
      </div>

      <div className="mt-3 sm:mt-4 space-y-2.5 sm:space-y-3">
        <div className="h-2.5 w-24 sm:h-3 sm:w-32 animate-pulse rounded-full bg-gray-800" />
        <div className="h-40 w-full sm:h-52 animate-pulse rounded-2xl bg-gradient-to-r from-gray-900 via-cyan-950/40 to-gray-900" />
      </div>
    </div>
  );
}
