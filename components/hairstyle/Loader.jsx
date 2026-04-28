"use client";

import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="rounded-2xl border border-gray-800/80 bg-slate-950/80 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10">
          <Loader2 className="h-4 w-4 animate-spin text-cyan-300" />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-200">
            Generating hairstyle...
          </p>
          <p className="text-xs text-gray-500">
            Creating your AI hairstyle preview.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="h-3 w-32 animate-pulse rounded-full bg-gray-800" />
        <div className="h-52 w-full animate-pulse rounded-2xl bg-gradient-to-r from-gray-900 via-cyan-950/40 to-gray-900" />
      </div>
    </div>
  );
}