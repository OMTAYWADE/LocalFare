"use client";

import { Crosshair, Loader2, MapPin } from "lucide-react";

interface LocationPillProps {
  location?: string;
  detecting?: boolean;
  onLocate?: () => void;
}

export default function LocationPill({
  location = "Location not detected",
  detecting = false,
  onLocate,
}: LocationPillProps) {
  return (
    <div className="flex w-full max-w-[470px] items-center gap-3 rounded-[20px] border border-[#123c35]/10 bg-white/80 p-3 shadow-[0_14px_40px_rgba(18,60,53,0.08)] backdrop-blur-xl transition-shadow duration-300 hover:shadow-[0_18px_48px_rgba(18,60,53,0.12)] sm:rounded-full sm:px-4 sm:py-2.5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8f58d] text-[#123c35]">
        <MapPin className="h-4 w-4" strokeWidth={2.5} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-[8px] font-black uppercase tracking-[0.18em] text-[#6d7974]">
          Starting from
        </p>
        <p className="mt-0.5 truncate text-sm font-black text-[#123c35] transition-opacity duration-200">
          {location}
        </p>
      </div>

      <button
        type="button"
        onClick={onLocate}
        disabled={detecting}
        aria-label="Detect current location"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#123c35] text-[#e8f58d] transition-all duration-300 hover:scale-105 hover:bg-[#0d312b] focus:outline-none focus:ring-2 focus:ring-[#123c35]/30 active:scale-95 disabled:cursor-wait disabled:opacity-60"
      >
        {detecting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Crosshair className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}