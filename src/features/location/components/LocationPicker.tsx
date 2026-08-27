"use client";

import {
    LocateFixed,
    MapPin,
    Search,
} from "lucide-react";

import { useState } from "react";

import type {
    UserLocation,
    LocationSearchResult,
} from "../types";

import {
    searchLocation,
} from "../services/location.service";

interface Props {
    value?: UserLocation;
    onChange: (location: UserLocation) => void;
}

export default function LocationPicker({
    value,
    onChange,
}: Props) {
    const [query, setQuery] = useState("");
    const [results, setResults] =
        useState<LocationSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [gpsLoading, setGpsLoading] = useState(false);

    async function handleSearch() {
        const searchQuery = query.trim();

        if (!searchQuery) {
            setResults([]);
            return;
        }

        setLoading(true);

        try {
            const data =
                await searchLocation(searchQuery);

            setResults(data);
        } catch (error) {
            console.error(
                "Location search failed:",
                error,
            );

            setResults([]);
        } finally {
            setLoading(false);
        }
    }

    function useCurrentLocation() {
        if (
            typeof navigator === "undefined" ||
            !navigator.geolocation
        ) {
            return;
        }

        setGpsLoading(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;

                onChange({
                    latitude,
                    longitude,
                    displayName:
                        "Your current location",
                    accuracy:
                        position.coords.accuracy,
                    source: "gps",
                });

                setGpsLoading(false);
            },

            (error) => {
                console.error(
                    "Unable to get current location:",
                    error,
                );

                setGpsLoading(false);
            },

            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 5 * 60 * 1000,
            },
        );
    }

    function selectLocation(
        result: LocationSearchResult,
    ) {
        const selectedLocation: UserLocation = {
            latitude: result.latitude,
            longitude: result.longitude,
            displayName: result.displayName,

            /*
             * Search results do not have GPS accuracy.
             * Zero means accuracy is unknown.
             */
            accuracy: 0,

            source: "search",
        };

        onChange(selectedLocation);

        setResults([]);
        setQuery("");
    }

    return (
        <div className="rounded-[26px] border border-[#123c35]/10 bg-white p-4 shadow-[0_18px_50px_rgba(18,60,53,0.06)]">

            {/* HEADER */}
            <div className="flex items-center justify-between gap-4">

                <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#ef713d]">
                        Starting point
                    </p>

                    <p className="mt-1 truncate text-sm font-black text-[#123c35]">
                        {value?.displayName ??
                            "Where are you now?"}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={useCurrentLocation}
                    disabled={gpsLoading}
                    aria-label="Use current location"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8f58d] text-[#123c35] transition hover:bg-[#cbe95b] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <LocateFixed
                        className={`h-4 w-4 ${
                            gpsLoading
                                ? "animate-pulse"
                                : ""
                        }`}
                    />
                </button>
            </div>

            {/* SEARCH */}
            <div className="mt-4 flex gap-2">

                <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[18px] bg-[#f7f3ea] px-3">

                    <Search className="h-4 w-4 shrink-0 text-[#6d7974]" />

                    <input
                        value={query}
                        onChange={(event) =>
                            setQuery(event.target.value)
                        }
                        onKeyDown={(event) => {
                            if (
                                event.key ===
                                "Enter"
                            ) {
                                event.preventDefault();
                                handleSearch();
                            }
                        }}
                        placeholder="Search city, landmark or area"
                        className="min-w-0 flex-1 bg-transparent py-3 text-xs font-semibold text-[#123c35] outline-none placeholder:text-[#6d7974]"
                    />
                </div>

                <button
                    type="button"
                    onClick={handleSearch}
                    disabled={
                        loading ||
                        !query.trim()
                    }
                    className="shrink-0 rounded-[18px] bg-[#123c35] px-4 text-xs font-black text-white transition hover:bg-[#0d312b] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading
                        ? "..."
                        : "Search"}
                </button>
            </div>

            {/* SEARCH RESULTS */}
            {results.length > 0 && (
                <div className="mt-3 overflow-hidden rounded-[18px] border border-[#123c35]/10 bg-white">

                    {results.map(
                        (result, index) => (
                            <button
                                key={`${result.latitude}-${result.longitude}-${index}`}
                                type="button"
                                onClick={() =>
                                    selectLocation(
                                        result,
                                    )
                                }
                                className="flex w-full items-start gap-3 border-b border-[#123c35]/8 px-4 py-3 text-left transition last:border-0 hover:bg-[#f7f3ea]"
                            >
                                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f9dfd0]">
                                    <MapPin className="h-3.5 w-3.5 text-[#ef713d]" />
                                </span>

                                <span className="min-w-0">
                                    <span className="block text-xs font-bold leading-5 text-[#123c35]">
                                        {
                                            result.displayName
                                        }
                                    </span>

                                    <span className="mt-0.5 block text-[10px] text-[#6d7974]">
                                        {
                                            result.latitude
                                        }
                                        {" · "}
                                        {
                                            result.longitude
                                        }
                                    </span>
                                </span>
                            </button>
                        ),
                    )}
                </div>
            )}

            {/* NO RESULTS */}
            {!loading &&
                query.trim() &&
                results.length === 0 && (
                    <div className="mt-3 rounded-[18px] bg-[#f7f3ea] px-4 py-3">
                        <p className="text-xs font-bold text-[#123c35]">
                            No location found
                        </p>

                        <p className="mt-1 text-[10px] text-[#6d7974]">
                            Try CSMT, Gateway of
                            India, Marine Drive or
                            Colaba.
                        </p>
                    </div>
                )}
        </div>
    );
}