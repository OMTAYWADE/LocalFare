"use client";

import {
    Clock3,
    MapPin,
    Sparkles,
} from "lucide-react";

import type { ExploreRecommendation } from "@/features/recommendation/types";

import ExploreRecommendationCard from "./ExploreRecommendationCard";

interface ExploreRecommendationsProps {
    places: ExploreRecommendation[];

    loading: boolean;

    error: string;

    hasLocation: boolean;

    filter:
        | "all"
        | "distance"
        | "time";

    setFilter: (
        filter:
            | "all"
            | "distance"
            | "time",
    ) => void;

    onPlan: (
        place: ExploreRecommendation,
    ) => void;
}

export default function ExploreRecommendations({
    places,
    loading,
    error,
    hasLocation,
    filter,
    setFilter,
    onPlan,
}: ExploreRecommendationsProps) {
    /*
     * ------------------------------------------------------------
     * SORT RESULTS
     * ------------------------------------------------------------
     *
     * Important:
     * Do not mutate the original `places` prop.
     */

    const sortedPlaces = [...places].sort(
        (first, second) => {
            if (filter === "distance") {
                return (
                    (first.distanceKm ?? Infinity) -
                    (second.distanceKm ?? Infinity)
                );
            }

            if (filter === "time") {
                return (
                    (first.durationMinutes ?? Infinity) -
                    (second.durationMinutes ?? Infinity)
                );
            }

            return (
                second.recommendationScore -
                first.recommendationScore
            );
        },
    );

    return (
        <section className="mt-10 sm:mt-12">
            {/* =====================================================
                HEADER
            ====================================================== */}

            <div
                className="
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-end
                    sm:justify-between
                "
            >
                <div>
                    <p
                        className="
                            text-[9px]
                            font-black
                            uppercase
                            tracking-[0.18em]
                            text-[#ef713d]
                        "
                    >
                        Around you
                    </p>

                    <h2
                        className="
                            mt-1
                            text-2xl
                            font-black
                            tracking-[-0.05em]
                            text-[#123c35]
                            sm:text-3xl
                        "
                    >
                        Places worth discovering
                    </h2>

                    <p
                        className="
                            mt-1.5
                            max-w-2xl
                            text-xs
                            leading-5
                            text-[#667872]
                            sm:text-sm
                        "
                    >
                        Discover places based on your location,
                        travel preferences and places you have
                        already visited.
                    </p>
                </div>

                {/* =================================================
                    FILTERS
                ================================================== */}

                <div
                    className="
                        flex
                        w-full
                        gap-2
                        overflow-x-auto
                        pb-1
                        sm:w-auto
                    "
                >
                    <FilterButton
                        active={filter === "all"}
                        onClick={() =>
                            setFilter("all")
                        }
                        label="Best match"
                    />

                    <FilterButton
                        active={filter === "distance"}
                        onClick={() =>
                            setFilter("distance")
                        }
                        label="Nearest"
                    />

                    <FilterButton
                        active={filter === "time"}
                        onClick={() =>
                            setFilter("time")
                        }
                        label="Fastest"
                    />
                </div>
            </div>

            {/* =====================================================
                ACTIVE FILTER INFORMATION
            ====================================================== */}

            {!loading &&
                hasLocation &&
                sortedPlaces.length > 0 && (
                    <div
                        className="
                            mt-5
                            flex
                            items-center
                            gap-2
                            text-[10px]
                            font-bold
                            text-[#71817b]
                        "
                    >
                        {filter === "all" && (
                            <>
                                <Sparkles
                                    className="
                                        h-3.5
                                        w-3.5
                                        text-[#ef713d]
                                    "
                                />

                                Best matches for you
                            </>
                        )}

                        {filter === "distance" && (
                            <>
                                <MapPin
                                    className="
                                        h-3.5
                                        w-3.5
                                        text-[#5c9b72]
                                    "
                                />

                                Showing nearest places first
                            </>
                        )}

                        {filter === "time" && (
                            <>
                                <Clock3
                                    className="
                                        h-3.5
                                        w-3.5
                                        text-[#ef713d]
                                    "
                                />

                                Showing fastest places first
                            </>
                        )}
                    </div>
                )}

            {/* =====================================================
                ERROR
            ====================================================== */}

            {error && (
                <div
                    role="alert"
                    className="
                        mt-5
                        rounded-[18px]
                        border
                        border-[#ef713d]/20
                        bg-[#fff5ef]
                        px-4
                        py-3
                        text-xs
                        font-semibold
                        leading-5
                        text-[#a84f2c]
                    "
                >
                    {error}
                </div>
            )}

            {/* =====================================================
                NO LOCATION
            ====================================================== */}

            {!hasLocation && !loading && (
                <div
                    className="
                        mt-6
                        rounded-[26px]
                        border
                        border-[#123c35]/10
                        bg-white
                        p-8
                        text-center
                        shadow-[0_10px_30px_rgba(18,60,53,0.04)]
                    "
                >
                    <div
                        className="
                            mx-auto
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-full
                            bg-[#fff0e8]
                        "
                    >
                        <MapPin
                            className="
                                h-6
                                w-6
                                text-[#ef713d]
                            "
                        />
                    </div>

                    <h3
                        className="
                            mt-4
                            text-lg
                            font-black
                            tracking-[-0.03em]
                            text-[#123c35]
                        "
                    >
                        Set your starting point
                    </h3>

                    <p
                        className="
                            mx-auto
                            mt-1.5
                            max-w-md
                            text-xs
                            leading-5
                            text-[#667872]
                        "
                    >
                        Allow your location or choose a
                        starting point above to discover
                        personalized destinations.
                    </p>
                </div>
            )}

            {/* =====================================================
                LOADING
            ====================================================== */}

            {loading && (
                <LoadingGrid />
            )}

            {/* =====================================================
                RESULTS
            ====================================================== */}

            {!loading &&
                hasLocation &&
                sortedPlaces.length > 0 && (
                    <div
                        className="
                            mt-6
                            grid
                            gap-5
                            sm:grid-cols-2
                            lg:grid-cols-3
                        "
                    >
                        {sortedPlaces.map(
                            (place) => (
                                <ExploreRecommendationCard
                                    key={place.id}
                                    place={place}
                                    onPlan={() =>
                                        onPlan(place)
                                    }
                                />
                            ),
                        )}
                    </div>
                )}

            {/* =====================================================
                EMPTY
            ====================================================== */}

            {!loading &&
                hasLocation &&
                sortedPlaces.length === 0 &&
                !error && (
                    <EmptyState />
                )}
        </section>
    );
}

/* ================================================================
   FILTER BUTTON
================================================================ */

function FilterButton({
    active,
    onClick,
    label,
}: {
    active: boolean;
    onClick: () => void;
    label: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`
                shrink-0
                rounded-full
                px-4
                py-2.5
                text-[10px]
                font-black
                transition-all
                duration-200
                focus:outline-none
                focus:ring-2
                focus:ring-[#123c35]
                focus:ring-offset-2
                ${
                    active
                        ? "bg-[#123c35] text-white shadow-[0_6px_15px_rgba(18,60,53,0.15)]"
                        : "border border-[#123c35]/10 bg-white text-[#31544d] hover:border-[#123c35]/20 hover:bg-[#f7f3ea]"
                }
            `}
        >
            {label}
        </button>
    );
}

/* ================================================================
   LOADING GRID
================================================================ */

function LoadingGrid() {
    return (
        <div
            className="
                mt-6
                grid
                gap-5
                sm:grid-cols-2
                lg:grid-cols-3
            "
        >
            {Array.from({
                length: 6,
            }).map((_, index) => (
                <div
                    key={index}
                    className="
                        overflow-hidden
                        rounded-[26px]
                        border
                        border-[#123c35]/5
                        bg-white
                    "
                >
                    {/* Image */}

                    <div
                        className="
                            h-[190px]
                            animate-pulse
                            bg-[#e9e5da]
                        "
                    />

                    {/* Content */}

                    <div className="space-y-3 p-5">
                        <div
                            className="
                                h-5
                                w-3/4
                                animate-pulse
                                rounded-lg
                                bg-[#e9e5da]
                            "
                        />

                        <div
                            className="
                                h-3
                                w-full
                                animate-pulse
                                rounded
                                bg-[#eeeae0]
                            "
                        />

                        <div
                            className="
                                h-3
                                w-2/3
                                animate-pulse
                                rounded
                                bg-[#eeeae0]
                            "
                        />

                        <div className="flex gap-2 pt-2">
                            <div
                                className="
                                    h-7
                                    w-20
                                    animate-pulse
                                    rounded-full
                                    bg-[#e9e5da]
                                "
                            />

                            <div
                                className="
                                    h-7
                                    w-20
                                    animate-pulse
                                    rounded-full
                                    bg-[#e9e5da]
                                "
                            />
                        </div>

                        <div
                            className="
                                h-20
                                animate-pulse
                                rounded-[16px]
                                bg-[#eeeae0]
                            "
                        />

                        <div
                            className="
                                h-11
                                animate-pulse
                                rounded-full
                                bg-[#e9e5da]
                            "
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ================================================================
   EMPTY STATE
================================================================ */

function EmptyState() {
    return (
        <div
            className="
                mt-6
                rounded-[26px]
                border
                border-[#123c35]/10
                bg-white
                p-8
                text-center
                shadow-[0_10px_30px_rgba(18,60,53,0.04)]
            "
        >
            <div
                className="
                    mx-auto
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    bg-[#f7f3ea]
                "
            >
                <Sparkles
                    className="
                        h-6
                        w-6
                        text-[#ef713d]
                    "
                />
            </div>

            <h3
                className="
                    mt-4
                    text-lg
                    font-black
                    tracking-[-0.03em]
                    text-[#123c35]
                "
            >
                Looking for something new
            </h3>

            <p
                className="
                    mx-auto
                    mt-1.5
                    max-w-md
                    text-xs
                    leading-5
                    text-[#667872]
                "
            >
                We couldn't find a suitable new
                destination from this location yet.
                Try another starting point or check
                again later.
            </p>
        </div>
    );
}