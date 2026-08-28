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

import { searchLocation } from "../services/location.service";

interface Props {
    value?: UserLocation;
    onChange: (location: UserLocation) => void;
}

export default function LocationPicker({
    value,
    onChange,
}: Props) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<
        LocationSearchResult[]
    >([]);

    const [loading, setLoading] = useState(false);
    const [gpsLoading, setGpsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState("");

    async function handleSearch() {
        const searchQuery = query.trim();

        if (!searchQuery) {
            setResults([]);
            setHasSearched(false);
            setError("");
            return;
        }

        setLoading(true);
        setHasSearched(true);
        setError("");

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

            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to search location.",
            );
        } finally {
            setLoading(false);
        }
    }

    function useCurrentLocation() {
        if (
            typeof navigator === "undefined" ||
            !navigator.geolocation
        ) {
            setError(
                "Geolocation is not supported by this browser.",
            );
            return;
        }

        setGpsLoading(true);
        setError("");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                onChange({
                    latitude:
                        position.coords.latitude,

                    longitude:
                        position.coords.longitude,

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

                let message =
                    "Unable to detect your location.";

                if (
                    error.code ===
                    error.PERMISSION_DENIED
                ) {
                    message =
                        "Location permission was denied.";
                }

                if (
                    error.code ===
                    error.POSITION_UNAVAILABLE
                ) {
                    message =
                        "Your location is currently unavailable.";
                }

                if (
                    error.code ===
                    error.TIMEOUT
                ) {
                    message =
                        "Location request timed out.";
                }

                setError(message);
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
        onChange({
            latitude: result.latitude,
            longitude: result.longitude,
            displayName: result.displayName,
            accuracy: 0,
            source: "search",
        });

        setResults([]);
        setQuery("");
        setHasSearched(false);
        setError("");
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
                        onChange={(event) => {
                            setQuery(
                                event.target.value,
                            );

                            setHasSearched(false);
                            setError("");
                        }}
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
                        ? "Searching..."
                        : "Search"}
                </button>
            </div>

            {/* LOADING */}
            {loading && (
                <div className="mt-3 rounded-[18px] bg-[#f7f3ea] px-4 py-3">
                    <p className="text-xs font-bold text-[#123c35]">
                        Searching Google Maps...
                    </p>

                    <p className="mt-1 text-[10px] text-[#6d7974]">
                        Finding matching locations.
                    </p>
                </div>
            )}

            {/* ERROR */}
            {!loading && error && (
                <div className="mt-3 rounded-[18px] border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-xs font-bold text-red-700">
                        Location search failed
                    </p>

                    <p className="mt-1 text-[10px] text-red-600">
                        {error}
                    </p>
                </div>
            )}

            {/* RESULTS */}
            {!loading &&
                !error &&
                results.length > 0 && (
                    <div className="mt-3 overflow-hidden rounded-[18px] border border-[#123c35]/10 bg-white">
                        {results.map(
                            (
                                result,
                                index,
                            ) => (
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
                                            {result.latitude.toFixed(
                                                5,
                                            )}
                                            {" · "}
                                            {result.longitude.toFixed(
                                                5,
                                            )}
                                        </span>
                                    </span>
                                </button>
                            ),
                        )}
                    </div>
                )}

            {/* NO RESULTS */}
            {!loading &&
                !error &&
                hasSearched &&
                results.length === 0 && (
                    <div className="mt-3 rounded-[18px] bg-[#f7f3ea] px-4 py-3">
                        <p className="text-xs font-bold text-[#123c35]">
                            No location found
                        </p>

                        <p className="mt-1 text-[10px] text-[#6d7974]">
                            Try CSMT, Gateway of India,
                            Marine Drive or Colaba.
                        </p>
                    </div>
                )}
        </div>
    );
}