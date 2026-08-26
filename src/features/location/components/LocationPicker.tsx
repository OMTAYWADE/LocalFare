"use client";

import { LocateFixed, MapPin, Search, } from "lucide-react";
import { useState, } from "react";
import type { UserLocation, LocationSearchResult, } from "../types";
import { searchLocation, } from "../services/location.service";

interface Props {
    value?: UserLocation;
    onChange: (location: UserLocation,) => void;
}

export default function LocationPicker({ value, onChange, }: Props) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<LocationSearchResult[]>([],);
    const [loading, setLoading] = useState(false);
    const [gpsLoading, setGpsLoading] = useState(false);

    async function handleSearch() {
        if (!query.trim()) return;
        setLoading(true);

        try {
            const data = await searchLocation(query,);
            setResults(data);
        } finally {
            setLoading(false);
        }
    }

    function useCurrentLocation() {
        if (!navigator.geolocation) {
            return;
        }

        setGpsLoading(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                onChange({ latitude, longitude, displayName: "Your current location", source: "gps", });
                setGpsLoading(false);
            }, () => { setGpsLoading(false); },
            { enableHighAccuracy: true, timeout: 10000, },
        );
    }

    return (
        <div className="rounded-[26px] border border-[#123c35]/10 bg-white p-4 shadow-[0_18px_50px_rgba(18,60,53,0.06)]">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#ef713d]">
                        Starting point
                    </p>

                    <p className="mt-1 text-sm font-black text-[#123c35]">
                        {value?.displayName ?? "Where are you now?"}
                    </p>
                </div>

                <button type="button" onClick={useCurrentLocation} disabled={gpsLoading}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f58d] text-[#123c35]" aria-label="Use current location" >
                    <LocateFixed className={`h-4 w-4 ${gpsLoading ? "animate-pulse" : ""}`} />
                </button>
            </div>

            <div className="mt-4 flex gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[18px] bg-[#f7f3ea] px-2">
                    <Search className="h-4 w-4 shrink-0 text-[#6d7974]" />

                    <input value={query} onChange={(event) => setQuery(event.target.value,)} onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            handleSearch();
                        }
                    }} placeholder="Search city, landmark or area"
                        className="min-w-0 flex-1 bg-transparent py-3 text-xs font-semibold text-[#123c35] outline-none" />
                </div>

                <button type="button" onClick={handleSearch} disabled={loading}
                    className="rounded-[18px] bg-[#123c35] px-2 text-xs font-black text-white disabled:opacity-50">
                    Search
                </button>
            </div>

            {results.length > 0 && (
                <div className="mt-3 overflow-hidden rounded-[18px] border border-[#123c35]/10">
                    {results.map((result, index) => (
                        <button key={`${result.latitude}-${result.longitude}-${index}`} type="button"
                            onClick={() => {
                                onChange({ ...result, source: "search", });
                                setResults([]);
                                setQuery("");
                            }} className="flex w-full items-start gap-3 border-b border-[#123c35]/8 px-4 py-3 text-left last:border-0 hover:bg-[#f7f3ea]">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#ef713d]" />

                            <span className="text-xs font-semibold leading-5 text-[#123c35]">
                                {result.displayName}
                            </span>
                        </button>
                    ),
                    )}
                </div>
            )}
        </div>
    );
}