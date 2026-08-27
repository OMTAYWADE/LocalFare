"use client";

import {
    Check,
    Crosshair,
    Loader2,
    MapPin,
} from "lucide-react";

interface FoodLocationCardProps {
    location: string;
    loading?: boolean;
    error?: string | null;
    onLocate: () => void;
}

export default function FoodLocationCard({
    location,
    loading = false,
    error,
    onLocate,
}: FoodLocationCardProps) {
    return (
        <div className="rounded-[22px] border border-[#123c35]/10 bg-white p-4">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8f58d] text-[#123c35]">
                    <MapPin className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#6d7974]">
                        Discover nearby
                    </p>

                    <p className="mt-0.5 truncate text-sm font-black text-[#123c35]">
                        {location}
                    </p>

                    {error && (
                        <p className="mt-1 text-[10px] font-semibold text-[#ef713d]">
                            {error}
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={onLocate}
                    disabled={loading}
                    aria-label="Detect current location"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#123c35] text-[#cbe95b] transition hover:bg-[#0d312b] disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Crosshair className="h-4 w-4" />
                    )}
                </button>
            </div>

            {!error && location !== "Location not detected" && (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#fbfaf5] px-3 py-2">
                    <Check className="h-3.5 w-3.5 text-[#31544d]" />

                    <span className="text-[10px] font-bold text-[#31544d]">
                        Used to find nearby food
                    </span>
                </div>
            )}
        </div>
    );
}