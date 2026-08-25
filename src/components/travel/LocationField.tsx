"use client";

import { Crosshair, MapPin, } from "lucide-react";

interface LocationFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    onCurrentLocation?: () => void;
}

export default function LocationField({ label, value, onChange, onCurrentLocation, }: LocationFieldProps) {
    return (
        <div className="space-y-2">
            <label className="block text-[11px] font-black uppercase tracking-[0.16em] text-[#6d7974]">
                {label}
            </label>

            <div className="relative">
                <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#123c35]" />

                <input value={value} onChange={(event) => onChange(event.target.value)}
                    className=" h-14 w-full rounded-[18px] border border-[#123c35]/10 bg-white pl-12 pr-12 text-sm font-semibold text-[#123c35] outline-none transition placeholder:text-[#6d7974] focus:border-[#123c35]/30 focus:ring-4 focus:ring-[#123c35]/5"
                    placeholder="Enter starting location"
                />

                <button type="button" onClick={onCurrentLocation} aria-label="Use current location"
                    className=" absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-[#123c35] transition hover:bg-[#e8f58d]">
                    <Crosshair className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}