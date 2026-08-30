"use client";

import {
    AlertTriangle,
    Loader2,
    MapPin,
    Search,
    Sparkles,
    Utensils,
} from "lucide-react";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useRouter,
    useSearchParams,
} from "next/navigation";

import FoodRecommendationCard from "@/features/food/components/FoodRecommendationCard";

import type {
    FoodRecommendation,
} from "@/features/food/services/foodRecommendation.service";

interface ApiResponse {
    query: string;

    currentMeal: string;

    recommendations: FoodRecommendation[];

    metadata: {
        source: string;
        retrievedAt: string;
        nearbyPlaceCount: number;
    };
}

interface Location {
    latitude: number;
    longitude: number;
}

export default function FoodSearchContent() {
    const searchParams =
        useSearchParams();

    const router =
        useRouter();

    const initialQuery =
        searchParams
            .get("q")
            ?.trim() ?? "";

    const [
        query,
        setQuery,
    ] = useState(initialQuery);

    const [
        location,
        setLocation,
    ] = useState<Location | null>(
        null,
    );

    const [
        locationError,
        setLocationError,
    ] = useState("");

    const [
        data,
        setData,
    ] = useState<ApiResponse | null>(
        null,
    );

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    /*
     * Prevent the same query from being
     * automatically searched repeatedly.
     */
    const searchedQueryRef =
        useRef("");

    /*
     * ---------------------------------------------------------
     * SEARCH USING LOCATION
     * ---------------------------------------------------------
     */
    const searchNearbyFood = useCallback(
        (
            searchQuery: string,
            userLocation: Location,
        ) => {
            const params =
                new URLSearchParams();

            params.set(
                "q",
                searchQuery,
            );

            params.set(
                "latitude",
                String(
                    userLocation.latitude,
                ),
            );

            params.set(
                "longitude",
                String(
                    userLocation.longitude,
                ),
            );

            setLoading(true);

            setError("");

            setLocationError("");

            fetch(
                `/api/food/search?${params.toString()}`,
                {
                    method: "GET",
                    cache: "no-store",
                },
            )
                .then(
                    async (
                        response,
                    ) => {
                        const body =
                            (await response.json()) as
                            | ApiResponse
                            | {
                                error?: string;
                            };

                        if (
                            !response.ok
                        ) {
                            throw new Error(
                                "error" in body &&
                                    body.error
                                    ? body.error
                                    : "Food search failed.",
                            );
                        }

                        return body as ApiResponse;
                    },
                )
                .then(
                    (
                        result,
                    ) => {
                        setData(
                            result,
                        );
                    },
                )
                .catch(
                    (
                        searchError,
                    ) => {
                        console.error(
                            "Food search failed:",
                            searchError,
                        );

                        setError(
                            searchError instanceof
                                Error
                                ? searchError.message
                                : "Unable to search for food right now.",
                        );

                        setData(
                            null,
                        );
                    },
                )
                .finally(() => {
                    setLoading(false);
                });
        },
        [],
    );

    /*
     * ---------------------------------------------------------
     * REQUEST BROWSER LOCATION
     * ---------------------------------------------------------
     *
     * Important:
     * State is changed from the geolocation callback,
     * which is an external browser callback rather than
     * synchronously inside the effect body.
     */
    const requestLocationAndSearch =
        useCallback(
            (
                searchQuery: string,
            ) => {
                if (
                    !searchQuery.trim()
                ) {
                    return;
                }

                if (
                    typeof navigator ===
                    "undefined"
                ) {
                    return;
                }

                if (
                    !navigator.geolocation
                ) {
                    setLocationError(
                        "Location is not supported by this browser.",
                    );

                    return;
                }

                /*
                 * Clear previous UI state.
                 */
                setError("");

                setLocationError("");

                /*
                 * Browser geolocation callback.
                 */
                navigator.geolocation.getCurrentPosition(
                    (
                        position,
                    ) => {
                        const userLocation =
                        {
                            latitude:
                                position.coords
                                    .latitude,

                            longitude:
                                position.coords
                                    .longitude,
                        };

                        setLocation(
                            userLocation,
                        );

                        searchNearbyFood(
                            searchQuery,
                            userLocation,
                        );
                    },
                    (
                        geoError,
                    ) => {
                        console.error(
                            "Geolocation error:",
                            geoError,
                        );

                        setLocation(
                            null,
                        );

                        switch (
                        geoError.code
                        ) {
                            case 1:
                                setLocationError(
                                    "Location permission was denied. Allow location access to find nearby food.",
                                );
                                break;

                            case 2:
                                setLocationError(
                                    "Your location could not be determined.",
                                );
                                break;

                            case 3:
                                setLocationError(
                                    "Location request timed out. Please try again.",
                                );
                                break;

                            default:
                                setLocationError(
                                    "Unable to access your location.",
                                );
                        }
                    },
                    {
                        enableHighAccuracy:
                            false,

                        timeout:
                            10000,

                        maximumAge:
                            300000,
                    },
                );
            },
            [
                searchNearbyFood,
            ],
        );

    /*
     * ---------------------------------------------------------
     * INITIAL QUERY
     * ---------------------------------------------------------
     *
     * When /food/search?q=biryani opens,
     * automatically request location.
     */
    useEffect(() => {
        if (!initialQuery) {
            return;
        }

        if (
            searchedQueryRef.current ===
            initialQuery
        ) {
            return;
        }

        searchedQueryRef.current =
            initialQuery;

        setQuery(
            initialQuery,
        );

        requestLocationAndSearch(
            initialQuery,
        );
    }, [
        initialQuery,
        requestLocationAndSearch,
    ]);

    /*
     * ---------------------------------------------------------
     * SEARCH SUBMIT
     * ---------------------------------------------------------
     */
    function handleSubmit() {
        const trimmed =
            query.trim();

        if (!trimmed) {
            return;
        }

        /*
         * Reset the ref so a new query
         * will automatically run.
         */
        searchedQueryRef.current =
            "";

        const params =
            new URLSearchParams();

        params.set(
            "q",
            trimmed,
        );

        router.push(
            `/food/search?${params.toString()}`,
        );
    }

    /*
     * ---------------------------------------------------------
     * UI
     * ---------------------------------------------------------
     */

    return (
        <div>
            {/* ================================================= */}
            {/* SEARCH BAR                                       */}
            {/* ================================================= */}

            <div className="mb-6 flex min-h-[58px] items-center gap-2 rounded-full bg-white p-1.5 shadow-[0_15px_45px_rgba(0,0,0,0.06)]">
                <Search className="ml-3 h-5 w-5 shrink-0 text-[#ef713d]" />

                <input
                    type="text"
                    value={query}
                    onChange={(
                        event,
                    ) =>
                        setQuery(
                            event.target
                                .value,
                        )
                    }
                    onKeyDown={(
                        event,
                    ) => {
                        if (
                            event.key ===
                            "Enter"
                        ) {
                            handleSubmit();
                        }
                    }}
                    placeholder="Search biryani, dosa, chai..."
                    className="min-w-0 flex-1 bg-transparent px-2 text-sm font-semibold text-[#123c35] outline-none placeholder:text-[#6d7974]/60"
                />

                <button
                    type="button"
                    onClick={
                        handleSubmit
                    }
                    disabled={loading}
                    className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-[#ef713d] px-5 text-xs font-black text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#df6332] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Search className="h-4 w-4" />
                    )}

                    Search
                </button>
            </div>

            {/* ================================================= */}
            {/* DESCRIPTION                                      */}
            {/* ================================================= */}

            <div className="mb-6 text-[10px] font-semibold text-[#6d7974]">
                Search food by name, cuisine,
                preference or what you want to
                eat nearby.
            </div>

            {/* ================================================= */}
            {/* EMPTY SEARCH                                      */}
            {/* ================================================= */}

            {!initialQuery && (
                <div className="rounded-[28px] border border-dashed border-[#123c35]/15 bg-white p-8 text-center">
                    <Utensils className="mx-auto h-8 w-8 text-[#6d7974]" />

                    <h2 className="mt-4 text-lg font-black text-[#123c35]">
                        Search for a dish
                    </h2>

                    <p className="mt-2 text-xs leading-5 text-[#6d7974]">
                        Try something like
                        "biryani",
                        "dosa", "chai"
                        or "street
                        food".
                    </p>
                </div>
            )}

            {/* ================================================= */}
            {/* LOCATION ERROR                                    */}
            {/* ================================================= */}

            {initialQuery &&
                locationError &&
                !location && (
                    <div className="rounded-[24px] bg-[#f9dfd0] p-5 text-sm font-bold text-[#b84f2c]">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />

                            <span>
                                {
                                    locationError
                                }
                            </span>
                        </div>
                    </div>
                )}

            {/* ================================================= */}
            {/* LOCATION READY                                    */}
            {/* ================================================= */}

            {location &&
                !loading && (
                    <div className="mb-5 flex items-center gap-2 rounded-[18px] bg-[#e8f58d]/50 px-4 py-3 text-[10px] font-bold text-[#31544d]">
                        <MapPin className="h-3.5 w-3.5 text-[#123c35]" />

                        Searching real food
                        places around your
                        location.
                    </div>
                )}

            {/* ================================================= */}
            {/* LOADING                                          */}
            {/* ================================================= */}

            {initialQuery &&
                loading && (
                    <div className="flex min-h-[300px] items-center justify-center rounded-[28px] bg-white">
                        <div className="text-center">
                            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#123c35]" />

                            <p className="mt-4 text-sm font-black text-[#123c35]">
                                Searching real
                                food places...
                            </p>

                            <p className="mt-1 text-xs text-[#6d7974]">
                                Checking nearby
                                restaurants and
                                cafes.
                            </p>
                        </div>
                    </div>
                )}

            {/* ================================================= */}
            {/* SEARCH ERROR                                      */}
            {/* ================================================= */}

            {error && (
                <div className="mb-5 rounded-[24px] bg-[#f9dfd0] p-5 text-sm font-bold text-[#b84f2c]">
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />

                        <span>
                            {error}
                        </span>
                    </div>
                </div>
            )}

            {/* ================================================= */}
            {/* RESULTS                                           */}
            {/* ================================================= */}

            {data &&
                !loading && (
                    <>
                        {data.recommendations
                            .length === 0 ? (
                            <div className="rounded-[28px] border border-[#123c35]/10 bg-white p-8 text-center">
                                <Utensils className="mx-auto h-8 w-8 text-[#6d7974]" />

                                <h2 className="mt-4 text-lg font-black text-[#123c35]">
                                    No nearby
                                    matches found
                                </h2>

                                <p className="mt-2 text-xs leading-5 text-[#6d7974]">
                                    Try another
                                    food name
                                    or increase
                                    the search
                                    radius.
                                </p>
                            </div>
                        ) : (
                            <section>
                                {/* HEADER */}
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#ef713d]">
                                        <Sparkles className="h-3.5 w-3.5" />

                                        Real nearby
                                        matches
                                    </div>

                                    <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#123c35]">
                                        Food near you
                                    </h2>

                                    <p className="mt-2 text-xs leading-5 text-[#6d7974]">
                                        Results for
                                        <span className="ml-1 font-black text-[#123c35]">
                                            { data.query} 
                                        </span>
                                    </p>
                                </div>

                                {/* METADATA */}
                                <div className="mb-5 flex flex-wrap items-center gap-3 text-xs font-semibold text-[#6d7974]">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2">
                                        <MapPin className="h-3.5 w-3.5" />

                                        {
                                            data
                                                .metadata
                                                .nearbyPlaceCount
                                        }{" "}
                                        places
                                        checked
                                    </span>

                                    <span className="rounded-full bg-[#e8f58d]/60 px-3 py-2">
                                        Meal:{" "}
                                        <strong>
                                            {
                                                data.currentMeal
                                            }
                                        </strong>
                                    </span>
                                </div>

                                {/* CARDS */}
                                <div className="grid gap-5 md:grid-cols-2">
                                    {data.recommendations.map(
                                        (
                                            recommendation,
                                        ) => (
                                            <FoodRecommendationCard
                                                key={`${recommendation.food.id}-${recommendation.food.restaurantId ?? recommendation.food.restaurantName ?? "place"}`}
                                                recommendation={
                                                    recommendation
                                                }
                                            />
                                        ),
                                    )}
                                </div>
                            </section>
                        )}
                    </>
                )}
        </div>
    );
}