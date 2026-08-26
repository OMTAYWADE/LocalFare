"use client";

import {
    Check,
    Crosshair,
    Loader2,
    MapPin,
} from "lucide-react";

interface LocationPillProps {
    location?: string;
    detecting?: boolean;
    onLocate?: () => void;
}

export default function LocationPill({
    location = "Mumbai, Maharashtra",
    detecting = false,
    onLocate,
}: LocationPillProps) {
    return (
        <div className="flex w-full max-w-[520px] items-center justify-between rounded-[22px] border border-white/10 bg-[#123c35] px-4 py-3 text-white shadow-[0_18px_45px_rgba(18,60,53,0.18)] sm:rounded-full sm:px-5 sm:py-2.5">
            <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e8f58d] text-[#123c35]">
                    <MapPin
                        className="h-4 w-4"
                        strokeWidth={2.5}
                    />
                </span>

                <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/45">
                        Your location
                    </p>

                    <p className="mt-0.5 truncate text-sm font-bold text-white">
                        {location}
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={onLocate}
                disabled={detecting}
                aria-label="Detect current location"
                className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#e8f58d]/60 disabled:cursor-wait disabled:opacity-60"
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