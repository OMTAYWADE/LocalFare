"use client";

import {
    Compass,
    IndianRupee,
    MapPin,
    Navigation,
    SlidersHorizontal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
    useCallback,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import LocationPicker from "@/features/location/components/LocationPicker";
import LocationMapClient from "@/features/location/components/LocationMapClient";

import type { UserLocation } from "@/features/location/types";
import type { ExploreRecommendation } from "@/features/recommendation/types";

import ExploreHeader from "./ExploreHeader";
import ExploreRecommendations from "./ExploreRecommendations";

import TravelerTypeSelector from "@/features/profile/components/TravelerTypeSelector";
import TravelerTypeSwitcher from "@/features/profile/components/TravelerTypeSwitcher";

import {
    getTravelerProfile,
    saveTravelerType,
} from "@/features/profile/services/travelerProfile.service";

import type { TravelerType } from "@/features/profile/types";

type ExploreMode =
    | "nearby"
    | "food"
    | "attractions"
    | "budget";

const EXPLORE_MODES: {
    value: ExploreMode;
    label: string;
    description: string;
}[] = [
    {
        value: "nearby",
        label: "Everything nearby",
        description: "Places, attractions and experiences",
    },
    {
        value: "food",
        label: "Food nearby",
        description: "Local food and places to eat",
    },
    {
        value: "attractions",
        label: "Things to explore",
        description: "Attractions and interesting places",
    },
    {
        value: "budget",
        label: "Best value",
        description: "Places that fit your budget",
    },
];

export default function ExploreContent() {
    const router = useRouter();

    const [location, setLocation] =
        useState<UserLocation>();

    const [places, setPlaces] =
        useState<ExploreRecommendation[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [filter, setFilter] =
        useState<"all" | "distance" | "time">("all");

    const [travelerType, setTravelerType] =
        useState<TravelerType>();

    const [
        showTravelerSelector,
        setShowTravelerSelector,
    ] = useState(true);

    const [exploreMode, setExploreMode] =
        useState<ExploreMode>("nearby");

    const [budget, setBudget] =
        useState(1000);

    /* =========================================================
       LOAD RECOMMENDATIONS
       ========================================================= */

    const loadRecommendations = useCallback(
    async (
        selectedLocation: UserLocation,
        selectedTravelerType: TravelerType,
    ) => {
        setLoading(true);
        setError("");

        try {
            const profile = getTravelerProfile();

            const params = new URLSearchParams();

            params.set(
                "latitude",
                String(selectedLocation.latitude),
            );

            params.set(
                "longitude",
                String(selectedLocation.longitude),
            );

            params.set(
                "travelerType",
                selectedTravelerType,
            );

            params.set(
                "visitedPlaceIds",
                JSON.stringify(
                    profile?.visitedPlaceIds ?? [],
                ),
            );

            params.set(
                "savedPlaceIds",
                JSON.stringify(
                    profile?.savedPlaceIds ?? [],
                ),
            );

            params.set(
                "plannedPlaceIds",
                JSON.stringify(
                    profile?.plannedPlaceIds ?? [],
                ),
            );

            params.set(
                "exploreMode",
                exploreMode,
            );

            params.set(
                "budget",
                String(budget),
            );

            const response = await fetch(
                `/api/recommendations/explore?${params.toString()}`,
            );

            if (!response.ok) {
                throw new Error(
                    `Recommendation request failed: ${response.status}`,
                );
            }

            const data = await response.json();

            setPlaces(
                Array.isArray(data.results)
                    ? data.results
                    : [],
            );
        } catch (error) {
            console.error(
                "Explore recommendations failed:",
                error,
            );

            setPlaces([]);

            setError(
                "We couldn't find recommendations right now.",
            );
        } finally {
            setLoading(false);
        }
    },
    [exploreMode, budget],
);

    /* =========================================================
       LOAD TRAVELER PROFILE
       ========================================================= */

    useEffect(() => {
        const profile =
            getTravelerProfile();

        if (profile) {
            queueMicrotask(() => {
                setTravelerType(
                    profile.travelerType,
                );

                setShowTravelerSelector(false);
            });

            return;
        }

        queueMicrotask(() => {
            setShowTravelerSelector(true);
        });
    }, []);

    /* =========================================================
       LOCATION CHANGE
       ========================================================= */

    const handleLocationChange =
        useCallback(
            (newLocation: UserLocation) => {
                setLocation(newLocation);

                if (!travelerType) {
                    return;
                }

                void loadRecommendations(
                    newLocation,
                    travelerType,
                );
            },
            [
                travelerType,
                loadRecommendations,
            ],
        );

    /* =========================================================
       TRAVELER CHANGE
       ========================================================= */

    const handleTravelerTypeChange =
        useCallback(
            (type: TravelerType) => {
                const profile =
                    saveTravelerType(type);

                setTravelerType(
                    profile.travelerType,
                );

                setShowTravelerSelector(false);

                if (location) {
                    void loadRecommendations(
                        location,
                        type,
                    );
                }
            },
            [
                location,
                loadRecommendations,
            ],
        );

    /* =========================================================
       PREFERENCE CHANGE
       ========================================================= */

    const handleExploreModeChange =
        useCallback(
            (mode: ExploreMode) => {
                setExploreMode(mode);
            },
            [],
        );

    const handleBudgetChange =
        useCallback(
            (amount: number) => {
                setBudget(amount);
            },
            [],
        );

    /* =========================================================
       RELOAD WHEN PREFERENCES CHANGE
       ========================================================= */

    

    /* =========================================================
       PLAN
       ========================================================= */

    const handlePlan =
        useCallback(
            (place: ExploreRecommendation) => {
                const params =
                    new URLSearchParams();

                params.set(
                    "destination",
                    place.name,
                );

                if (location) {
                    params.set(
                        "sourceLatitude",
                        String(
                            location.latitude,
                        ),
                    );

                    params.set(
                        "sourceLongitude",
                        String(
                            location.longitude,
                        ),
                    );
                }

                router.push(
                    `/travel/plan?${params.toString()}`,
                );
            },
            [location, router],
        );

    /* =========================================================
       UI
       ========================================================= */

    return (
        <main
            className="
                relative
                min-h-screen
                overflow-hidden
                bg-[#f7f3ea]
            "
        >
            {/* BACKGROUND */}

            <div
                className="
                    pointer-events-none
                    absolute
                    inset-x-0
                    top-0
                    h-[460px]
                    overflow-hidden
                "
            >
                <div
                    className="
                        absolute
                        -left-24
                        top-10
                        h-80
                        w-80
                        rounded-full
                        bg-[#cce8d5]/70
                        blur-3xl
                    "
                />

                <div
                    className="
                        absolute
                        -right-20
                        top-0
                        h-96
                        w-96
                        rounded-full
                        bg-[#e8f58d]/50
                        blur-3xl
                    "
                />

                <div
                    className="
                        absolute
                        left-1/2
                        top-52
                        h-64
                        w-64
                        -translate-x-1/2
                        rounded-full
                        bg-[#ccecf3]/40
                        blur-3xl
                    "
                />
            </div>

            <div
                className="
                    relative
                    mx-auto
                    w-full
                    max-w-[1280px]
                    px-4
                    py-5
                    sm:px-6
                    sm:py-8
                    lg:px-8
                    lg:py-10
                "
            >
                <ExploreHeader />

                {/* =================================================
                    TRAVELER
                ================================================= */}

                <section className="mt-6">
                    {showTravelerSelector ? (
                        <TravelerTypeSelector
                            value={travelerType}
                            onChange={
                                handleTravelerTypeChange
                            }
                        />
                    ) : (
                        <div
                            className="
                                flex
                                flex-col
                                gap-3
                                sm:flex-row
                                sm:items-center
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
                                    Explore mode
                                </p>

                                <h2
                                    className="
                                        mt-1
                                        text-2xl
                                        font-black
                                        tracking-[-0.05em]
                                        text-[#123c35]
                                    "
                                >
                                    Discover places
                                    for you
                                </h2>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        leading-5
                                        text-[#667872]
                                    "
                                >
                                    Recommendations adapt
                                    to your travel profile,
                                    preferences and budget.
                                </p>
                            </div>

                            {travelerType && (
                                <TravelerTypeSwitcher
                                    value={
                                        travelerType
                                    }
                                    onChange={
                                        handleTravelerTypeChange
                                    }
                                />
                            )}
                        </div>
                    )}
                </section>

                {/* =================================================
                    FILTERS
                ================================================= */}

                <section className="mt-6">
                    <div
                        className="
                            rounded-[28px]
                            border
                            border-[#123c35]/10
                            bg-white
                            p-4
                            shadow-[0_18px_55px_rgba(18,60,53,0.06)]
                            sm:p-5
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#e8f58d]
                                    text-[#123c35]
                                "
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                            </div>

                            <div>
                                <p
                                    className="
                                        text-[9px]
                                        font-black
                                        uppercase
                                        tracking-[0.16em]
                                        text-[#ef713d]
                                    "
                                >
                                    Personalize
                                </p>

                                <h3
                                    className="
                                        text-base
                                        font-black
                                        text-[#123c35]
                                    "
                                >
                                    What do you want
                                    to discover?
                                </h3>
                            </div>
                        </div>

                        {/* MODES */}

                        <div
                            className="
                                mt-4
                                grid
                                grid-cols-1
                                gap-2
                                sm:grid-cols-2
                                lg:grid-cols-4
                            "
                        >
                            {EXPLORE_MODES.map(
                                (mode) => {
                                    const active =
                                        exploreMode ===
                                        mode.value;

                                    return (
                                        <button
                                            key={
                                                mode.value
                                            }
                                            type="button"
                                            onClick={() =>
                                                handleExploreModeChange(
                                                    mode.value,
                                                )
                                            }
                                            className={[
                                                "rounded-[18px]",
                                                "border",
                                                "p-4",
                                                "text-left",
                                                "transition-all",
                                                "duration-200",
                                                "hover:-translate-y-0.5",
                                                active
                                                    ? "border-[#123c35] bg-[#123c35] text-white shadow-md"
                                                    : "border-[#123c35]/10 bg-[#fbfaf5] text-[#123c35] hover:bg-[#e8f58d]/60",
                                            ].join(" ")}
                                        >
                                            <p className="text-xs font-black">
                                                {mode.label}
                                            </p>

                                            <p
                                                className={[
                                                    "mt-1 text-[10px] leading-4",
                                                    active
                                                        ? "text-white/60"
                                                        : "text-[#6d7974]",
                                                ].join(" ")}
                                            >
                                                {
                                                    mode.description
                                                }
                                            </p>
                                        </button>
                                    );
                                },
                            )}
                        </div>

                        {/* BUDGET */}

                        <div
                            className="
                                mt-4
                                rounded-[20px]
                                bg-[#f7f3ea]
                                p-4
                            "
                        >
                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-3
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-[#f9dfd0]
                                            text-[#ef713d]
                                        "
                                    >
                                        <IndianRupee className="h-4 w-4" />
                                    </div>

                                    <div>
                                        <p
                                            className="
                                                text-[9px]
                                                font-black
                                                uppercase
                                                tracking-[0.15em]
                                                text-[#6d7974]
                                            "
                                        >
                                            Your budget
                                        </p>

                                        <p
                                            className="
                                                text-sm
                                                font-black
                                                text-[#123c35]
                                            "
                                        >
                                            Up to ₹
                                            {budget.toLocaleString(
                                                "en-IN",
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        gap-2
                                    "
                                >
                                    {[500, 1000, 2000, 5000].map(
                                        (amount) => (
                                            <button
                                                key={
                                                    amount
                                                }
                                                type="button"
                                                onClick={() =>
                                                    handleBudgetChange(
                                                        amount,
                                                    )
                                                }
                                                className={[
                                                    "rounded-full",
                                                    "px-3",
                                                    "py-2",
                                                    "text-[10px]",
                                                    "font-black",
                                                    "transition",
                                                    budget ===
                                                    amount
                                                        ? "bg-[#123c35] text-white"
                                                        : "bg-white text-[#123c35] hover:bg-[#e8f58d]",
                                                ].join(" ")}
                                            >
                                                ₹
                                                {amount >=
                                                1000
                                                    ? `${amount / 1000}k`
                                                    : amount}
                                            </button>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =================================================
                    LOCATION
                ================================================= */}

                <section className="mt-7 sm:mt-9">
                    <div className="mb-4">
                        <p
                            className="
                                text-[9px]
                                font-black
                                uppercase
                                tracking-[0.18em]
                                text-[#ef713d]
                            "
                        >
                            Your starting point
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
                            Where are you now?
                        </h2>

                        <p
                            className="
                                mt-1.5
                                max-w-xl
                                text-xs
                                leading-5
                                text-[#667872]
                                sm:text-sm
                            "
                        >
                            We'll use your location
                            to discover nearby places.
                        </p>
                    </div>

                    <div
                        className="
                            overflow-hidden
                            rounded-[30px]
                            bg-[#06483f]
                            shadow-[0_24px_70px_rgba(6,72,63,0.16)]
                        "
                    >
                        <div
                            className="
                                grid
                                lg:grid-cols-[390px_minmax(0,1fr)]
                            "
                        >
                            {/* LOCATION PANEL */}

                            <div className="relative p-5 sm:p-6 lg:p-7">
                                <div
                                    className="
                                        absolute
                                        -right-20
                                        -top-20
                                        h-48
                                        w-48
                                        rounded-full
                                        bg-[#cbe95b]/10
                                    "
                                />

                                <div className="relative">
                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            text-white/50
                                        "
                                    >
                                        <MapPin className="h-4 w-4" />

                                        <span
                                            className="
                                                text-[9px]
                                                font-black
                                                uppercase
                                                tracking-[0.16em]
                                            "
                                        >
                                            Current location
                                        </span>
                                    </div>

                                    <h3
                                        className="
                                            mt-3
                                            text-2xl
                                            font-black
                                            tracking-[-0.05em]
                                            text-white
                                        "
                                    >
                                        {location
                                            ? "You're here."
                                            : "Where are you now?"}
                                    </h3>

                                    <p
                                        className="
                                            mt-2
                                            text-xs
                                            leading-5
                                            text-white/60
                                        "
                                    >
                                        {location
                                            ? "Location ready. Let's find places worth discovering."
                                            : "Allow your location or search for another starting point."}
                                    </p>

                                    <div
                                        className="
                                            mt-5
                                            rounded-[20px]
                                            bg-white
                                            p-1
                                        "
                                    >
                                        <LocationPicker
                                            value={
                                                location
                                            }
                                            onChange={
                                                handleLocationChange
                                            }
                                        />
                                    </div>

                                    <div
                                        className="
                                            mt-6
                                            grid
                                            grid-cols-3
                                            border-t
                                            border-white/10
                                            pt-5
                                        "
                                    >
                                        <ExploreStat
                                            icon={
                                                <Compass className="h-4 w-4" />
                                            }
                                            title="Discover"
                                            subtitle="nearby"
                                        />

                                        <ExploreStat
                                            icon={
                                                <Navigation className="h-4 w-4" />
                                            }
                                            title="Real"
                                            subtitle="locations"
                                        />

                                        <ExploreStat
                                            icon={
                                                <IndianRupee className="h-4 w-4" />
                                            }
                                            title="Fair"
                                            subtitle="budget"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* MAP */}

                            <div
                                className="
                                    relative
                                    h-[290px]
                                    bg-[#d7e6df]
                                    sm:h-[360px]
                                    lg:h-[400px]
                                "
                            >
                                <LocationMapClient
                                    location={location}
                                    destinations={places}
                                />

                                <div
                                    className="
                                        pointer-events-none
                                        absolute
                                        left-4
                                        top-4
                                        rounded-full
                                        bg-white/90
                                        px-3
                                        py-2
                                        text-[9px]
                                        font-black
                                        text-[#123c35]
                                        shadow-sm
                                        backdrop-blur
                                    "
                                >
                                    Recommended destinations
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =================================================
                    RESULTS
                ================================================= */}

                <ExploreRecommendations
                    places={places}
                    loading={loading}
                    error={error}
                    hasLocation={Boolean(
                        location,
                    )}
                    filter={filter}
                    setFilter={setFilter}
                    onPlan={handlePlan}
                />
            </div>
        </main>
    );
}

/* ============================================================
   STAT
   ============================================================ */

function ExploreStat({
    icon,
    title,
    subtitle,
}: {
    icon: ReactNode;
    title: string;
    subtitle: string;
}) {
    return (
        <div
            className="
                flex
                min-w-0
                items-center
                gap-2
            "
        >
            <div
                className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-white/10
                    text-[#e8f58d]
                "
            >
                {icon}
            </div>

            <div className="min-w-0">
                <p className="text-xs font-black text-white">
                    {title}
                </p>

                <p className="truncate text-[9px] text-white/45">
                    {subtitle}
                </p>
            </div>
        </div>
    );
}