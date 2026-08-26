"use client";

import { Compass, Navigation, } from "lucide-react";
import { useRouter, } from "next/navigation";
import { useCallback, useEffect, useState, } from "react";
import LocationPicker from "@/features/location/components/LocationPicker";
import LocationMapClient from "@/features/location/components/LocationMapClient";
import type { UserLocation, } from "@/features/location/types";
import type { ExploreRecommendation, } from "@/features/recommendation/types";
import ExploreHeader from "./ExploreHeader";
import ExploreRecommendations from "./ExploreRecommendations";
import TravelerTypeSelector from "@/features/profile/components/TravelerTypeSelector";
import TravelerTypeSwitcher from "@/features/profile/components/TravelerTypeSwitcher";
import { getTravelerProfile, saveTravelerType, } from "@/features/profile/services/travelerProfile.service";
import type { TravelerType, } from "@/features/profile/types";

export default function ExploreContent() {
    const router = useRouter();
    const [location, setLocation,] = useState<UserLocation>();
    const [places, setPlaces,] = useState<ExploreRecommendation[]>([]);
    const [loading, setLoading,] = useState(false);
    const [error, setError,] = useState("");
    const [filter, setFilter,] = useState<"all" | "distance" | "time">("all");
    const [travelerType, setTravelerType] = useState<TravelerType>();
    const [showTravelerSelector, setShowTravelerSelector] = useState(true);
    /* =====================================================
       LOAD RECOMMENDATIONS
       ===================================================== */

    const loadRecommendations = useCallback(async (selectedLocation: UserLocation, selectedTravelerType: TravelerType,) => {
        setLoading(true);
        setError("");

        try {
            const profile = getTravelerProfile();
            const params = new URLSearchParams();
            params.set("latitude", String(selectedLocation.latitude,),);
            params.set("longitude", String(selectedLocation.longitude,),);
            params.set("travelerType", selectedTravelerType,);
            params.set("visitedPlaceIds", JSON.stringify(profile?.visitedPlaceIds ?? [],),);
            params.set("savedPlaceIds", JSON.stringify(profile?.savedPlaceIds ?? [],),);
            params.set("plannedPlaceIds", JSON.stringify(profile?.plannedPlaceIds ?? [],),);
            const response = await fetch(`/api/recommendations/explore?${params.toString()}`,);

            if (!response.ok) {
                throw new Error("Unable to load recommendations.",);
            }

            const data = await response.json();
            setPlaces(Array.isArray(data.results,) ? data.results : [],);

        } catch (error) {
            console.error("Explore recommendations failed:", error,);
            setPlaces([]);
            setError("We couldn't find recommendations right now.",);
        } finally {
            setLoading(false);
        }
    }, [],
    );

    useEffect(() => {
        const profile = getTravelerProfile();
        const updateProfileState = () => {
            if (profile) {
                setTravelerType(profile.travelerType);
                setShowTravelerSelector(false);
            } else {
                setShowTravelerSelector(true);
            }
        };
        queueMicrotask(updateProfileState);
    }, []);

    /* =====================================================
       LOCATION CHANGE
       ===================================================== */

    const handleLocationChange = useCallback((newLocation: UserLocation,) => {
        setLocation(newLocation,);

        if (!travelerType) {
            return;
        }

        void loadRecommendations(newLocation, travelerType,);
    }, [travelerType, loadRecommendations,],
    );

    /* =====================================================
       PLAN TRIP
       ===================================================== */

    const handlePlan = useCallback((place: ExploreRecommendation,) => {
        const params = new URLSearchParams();
        params.set("destination", place.name,);

        if (location) {
            params.set("sourceLatitude", String(location.latitude,),);
            params.set("sourceLongitude", String(location.longitude,),);
        }

        router.push(`/travel/plan?${params.toString()}`,);
    },
        [location, router,],
    );

    /* =====================================================
       TRAVELER TYPE CHANGE
       ===================================================== */

    const handleTravelerTypeChange = useCallback(
        (type: TravelerType) => {
            const profile = saveTravelerType(type);

            setTravelerType(profile.travelerType);
            setShowTravelerSelector(false);

            if (location) {
                void loadRecommendations(location, type,);
            }
        },
        [location, loadRecommendations],
    );

    /* =====================================================
       UI
       ===================================================== */

    return (
        <div className="relative overflow-hidden bg-[#f7f3ea]">

            {/* BACKGROUND */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden">
                <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-[#cce8d5]/70 blur-3xl" />
                <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#dff0a5]/60 blur-3xl" />
            </div>

            <div className="relative mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                <ExploreHeader />

                {/* =================================================
                    TRAVELER TYPE
                   ================================================= */}

                <section className="mt-6">
                    {showTravelerSelector ? (
                        <TravelerTypeSelector value={travelerType} onChange={handleTravelerTypeChange} />) : (

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#ef713d]">
                                    Explore mode
                                </p>

                                <h2 className="mt-1 text-2xl font-black tracking-[-0.05em] text-[#123c35]">
                                    Discover places for yo  u
                                </h2>

                                <p className="mt-1 text-xs text-[#667872]">
                                    Recommendations change based on your travel profile and places you have already visited.
                                </p>

                            </div>

                            {travelerType && (
                                <TravelerTypeSwitcher value={travelerType} onChange={handleTravelerTypeChange} />
                            )}
                        </div>
                    )}

                </section>

                {/* =================================================
                    STARTING POINT
                   ================================================= */}
                <section className="mt-7 sm:mt-9">
                    <div className="mb-4 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#ef713d]">
                                Your starting point
                            </p>
                            <h2 className="mt-1 text-2xl font-black tracking-[-0.05em] text-[#123c35] sm:text-3xl">
                                Where are you now?
                            </h2>
                            <p className="mt-1.5 max-w-xl text-xs leading-5 text-[#667872] sm:text-sm">
                                We'll use your location to find destinations that make sense for your travel profile.
                            </p>
                        </div>

                        {location && (
                            <div className="hidden items-center gap-2 rounded-full bg-[#e8f58d] px-3.5 py-2 sm:flex">
                                <Navigation className="h-3.5 w-3.5 text-[#123c35]" />
                                <span className="text-[9px] font-black text-[#123c35]">
                                    Location ready
                                </span>
                            </div>
                        )}
                    </div>

                    {/* LOCATION */}
                    <div className="overflow-hidden rounded-[30px] bg-[#06483f] shadow-[0_24px_70px_rgba(6,72,63,0.16)]">
                        <div className="grid lg:grid-cols-[390px_minmax(0,1fr)]">

                            {/* LOCATION PANEL */}
                            <div className="relative overflow-hidden p-5 sm:p-6 lg:p-7">
                                <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#cbe95b]/10" />
                                <div className="absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-[#ef713d]/10" />
                                <div className="relative">
                                    <h3 className="text-2xl font-black tracking-[-0.05em] text-white">
                                        {location ? "You're here." : "Where are you now?"}

                                    </h3>

                                    <p className="mt-2 text-xs leading-5 text-white/60">
                                        {location ? "Your location is ready. We'll find places worth discovering." : "Allow your location or search for another starting point."}

                                    </p>

                                    <div className="mt-5 rounded-[20px] bg-white p-1">
                                        <LocationPicker value={location} onChange={handleLocationChange} />

                                    </div>

                                    <div className="mt-6 grid grid-cols-3 border-t border-white/10 pt-5">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#a1ffce66] text-[#dff18c]">

                                                <Compass className="h-4 w-4" />
                                            </div>

                                            <div>
                                                <p className="text-xs font-black text-white">
                                                    Discover
                                                </p>

                                                <p className="text-[9px] text-white/45">
                                                    new places
                                                </p>
                                            </div>

                                        </div>

                                        <div className="flex items-center gap-2 border-l border-white/10 pl-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#a1ffce66] text-[#ff914f]">
                                                <Navigation className="h-4 w-4" />
                                            </div>

                                            <div>
                                                <p className="text-xs font-black text-white">
                                                    Real
                                                </p>
                                                <p className="text-[9px] text-white/45">
                                                    travel data
                                                </p>
                                            </div>

                                        </div>

                                        <div className="flex items-center gap-2 border-l border-white/10 pl-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#a1ffce66] text-[#ffd166]">
                                                ₹
                                            </div>

                                            <div>

                                                <p className="text-xs font-black text-white">
                                                    Fair
                                                </p>

                                                <p className="text-[9px] text-white/45">
                                                    cost planning
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                            {/* MAP */}
                            <div className="relative h-[290px] bg-[#d7e6df] sm:h-[360px] lg:h-[400px]">
                                <LocationMapClient location={location} destinations={places} />

                                <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-2 text-[9px] font-black text-[#123c35] shadow-sm backdrop-blur">
                                    Recommended destinations
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =================================================
                    RECOMMENDATIONS
                   ================================================= */}
                <ExploreRecommendations places={places} loading={loading} error={error} hasLocation={Boolean(location,)} filter={filter} setFilter={setFilter} onPlan={handlePlan} />

            </div>
        </div>
    );
}