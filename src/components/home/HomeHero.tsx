"use client";

import { Crosshair, MapPin,} from "lucide-react";

interface LocationPillProps {
  location?: string;
  onLocate?: () => void;
}

export default function LocationPill({ location = "Mumbai, Maharashtra", onLocate,}: LocationPillProps) {
  return (
    <div
      className=" relative flex h-[58px] w-full max-w-[500px] items-center justify-between rounded-full bg-[#123c35] px-5 text-white shadow-[0_18px_45px_rgba(18,60,53,0.2)] ">
      <div className="flex items-center gap-3">
        <span className=" flex h-8 w-8 items-center justify-center rounded-full bg-[#cbe95b] text-[#123c35]">
          <MapPin className="h-4 w-4 fill-current" />
        </span>

        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/50">
            Your location
          </p>

          <p className="text-sm font-bold">
            {location}
          </p>
        </div>
      </div>

      <button type="button" onClick={onLocate} aria-label="Detect current location"
        className=" flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/10">
        <Crosshair className="h-5 w-5" />
      </button>
    </div>
  );
}