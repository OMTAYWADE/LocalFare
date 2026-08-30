"use client";

import {
    AlertTriangle,
    Loader2,
    MapPin,
    Sparkles,
    Utensils,
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import type {
    FoodRecommendation,
} from "../services/foodRecommendation.service";

import FoodRecommendationCard from "./FoodRecommendationCard";

interface Props {
    items: string[];

    latitude: number;

    longitude: number;

    /**
     * Optional budget in INR.
     *
     * Can come from:
     * - parent component
     * - URL ?budget=100
     */
    budgetInr?: number;
}

interface ApiResponse {
    detectedFoods?: string[];

    currentMeal?: string;

    recommendations: FoodRecommendation[];

    metadata?: {
        source?: string;
        retrievedAt?: string;
        nearbyPlaceCount?: number;
        budgetInr?: number;
        priceFiltered?: boolean;
    };

    error?: string;
}

/**
 * Normalize text for food matching.
 */
function normalizeText(
    value: string,
): string {
    return value
        .trim()
        .toLowerCase()
        .replace(
            /[^a-z0-9\s]/g,
            " ",
        )
        .replace(
            /\s+/g,
            " ",
        );
}

/**
 * Check whether a result represents the
 * food the user requested.
 */
function matchesRequestedFood(
    recommendation: FoodRecommendation,
    requestedItems: string[],
): boolean {
    const food =
        recommendation.food;

    const foodName =
        normalizeText(
            food.name,
        );

    const tags =
        (
            food.tags ?? []
        ).map(
            normalizeText,
        );

    return requestedItems.some(
        (
            item,
        ) => {
            const query =
                normalizeText(
                    item,
                );

            if (!query) {
                return false;
            }

            return (
                foodName ===
                    query ||
                foodName.includes(
                    query,
                ) ||
                query.includes(
                    foodName,
                ) ||
                tags.some(
                    (
                        tag,
                    ) =>
                        tag.includes(
                            query,
                        ) ||
                        query.includes(
                            tag,
                        ),
                )
            );
        },
    );
}

/**
 * Sort recommendations according to FairTrip priority:
 *
 * 1. Food match
 * 2. Budget fit
 * 3. Known price
 * 4. Lower price
 * 5. Recommendation score
 * 6. Distance
 */
function sortRecommendations(
    recommendations: FoodRecommendation[],
    requestedItems: string[],
    budgetInr?: number,
): FoodRecommendation[] {
    return [
        ...recommendations,
    ].sort(
        (
            a,
            b,
        ) => {
            const aFood =
                a.food;

            const bFood =
                b.food;

            const aPrice =
                aFood.priceInr;

            const bPrice =
                bFood.priceInr;

            /*
             * -------------------------------------------------
             * 1. FOOD MATCH
             * -------------------------------------------------
             */

            const aFoodMatch =
                matchesRequestedFood(
                    a,
                    requestedItems,
                );

            const bFoodMatch =
                matchesRequestedFood(
                    b,
                    requestedItems,
                );

            if (
                aFoodMatch !==
                bFoodMatch
            ) {
                return aFoodMatch
                    ? -1
                    : 1;
            }

            /*
             * -------------------------------------------------
             * 2. BUDGET FIT
             * -------------------------------------------------
             */

            if (
                budgetInr !==
                undefined
            ) {
                const aFits =
                    typeof aPrice ===
                        "number" &&
                    aPrice <=
                        budgetInr;

                const bFits =
                    typeof bPrice ===
                        "number" &&
                    bPrice <=
                        budgetInr;

                if (
                    aFits !==
                    bFits
                ) {
                    return aFits
                        ? -1
                        : 1;
                }
            }

            /*
             * -------------------------------------------------
             * 3. KNOWN PRICE
             * -------------------------------------------------
             *
             * A real known price is preferred over
             * an unknown price.
             */

            const aHasPrice =
                typeof aPrice ===
                "number";

            const bHasPrice =
                typeof bPrice ===
                "number";

            if (
                aHasPrice !==
                bHasPrice
            ) {
                return aHasPrice
                    ? -1
                    : 1;
            }

            /*
             * -------------------------------------------------
             * 4. LOWER PRICE
             * -------------------------------------------------
             */

            if (
                aHasPrice &&
                bHasPrice &&
                aPrice !==
                    bPrice
            ) {
                return (
                    aPrice! -
                    bPrice!
                );
            }

            /*
             * -------------------------------------------------
             * 5. RECOMMENDATION SCORE
             * -------------------------------------------------
             */

            if (
                a.score !==
                b.score
            ) {
                return (
                    b.score -
                    a.score
                );
            }

            /*
             * -------------------------------------------------
             * 6. DISTANCE
             * -------------------------------------------------
             */

            const aDistance =
                aFood.distanceKm ??
                Number.POSITIVE_INFINITY;

            const bDistance =
                bFood.distanceKm ??
                Number.POSITIVE_INFINITY;

            return (
                aDistance -
                bDistance
            );
        },
    );
}

export default function FoodRecommendationList({
    items,
    latitude,
    longitude,
    budgetInr: propBudgetInr,
}: Props) {
    const [
        data,
        setData,
    ] =
        useState<ApiResponse | null>(
            null,
        );

    const [
        loading,
        setLoading,
    ] =
        useState(true);

    const [
        error,
        setError,
    ] =
        useState("");

    /*
     * ---------------------------------------------------------
     * BUDGET
     * ---------------------------------------------------------
     *
     * Parent prop has priority.
     * Otherwise read ?budget= from the URL.
     *
     * We intentionally avoid useSearchParams here because
     * the component already receives everything required from
     * its parent.
     */

    const budgetInr =
        propBudgetInr;

    /*
     * ---------------------------------------------------------
     * NORMALIZED ITEMS
     * ---------------------------------------------------------
     */

    const normalizedItems =
        useMemo(
            () =>
                [
                    ...new Set(
                        items
                            .map(
                                normalizeText,
                            )
                            .filter(
                                Boolean,
                            ),
                    ),
                ],
            [items],
        );

    /*
     * ---------------------------------------------------------
     * SORTED RESULTS
     * ---------------------------------------------------------
     */

    const sortedRecommendations =
        useMemo(() => {
            if (!data) {
                return [];
            }

            return sortRecommendations(
                data.recommendations,
                normalizedItems,
                budgetInr,
            );
        }, [
            data,
            normalizedItems,
            budgetInr,
        ]);

    /*
     * ---------------------------------------------------------
     * LOAD RECOMMENDATIONS
     * ---------------------------------------------------------
     */

    useEffect(() => {
        let cancelled =
            false;

        async function loadRecommendations() {
            try {
                setLoading(
                    true,
                );

                setError("");

                setData(
                    null,
                );

                /*
                 * Validate food.
                 */
                if (
                    items.length ===
                    0
                ) {
                    throw new Error(
                        "No food items were provided.",
                    );
                }

                /*
                 * Validate coordinates.
                 */
                if (
                    !Number.isFinite(
                        latitude,
                    ) ||
                    !Number.isFinite(
                        longitude,
                    )
                ) {
                    throw new Error(
                        "Valid latitude and longitude are required.",
                    );
                }

                /*
                 * Validate budget if provided.
                 */
                if (
                    budgetInr !==
                        undefined &&
                    (
                        !Number.isFinite(
                            budgetInr,
                        ) ||
                        budgetInr < 0
                    )
                ) {
                    throw new Error(
                        "Budget must be a valid non-negative number.",
                    );
                }

                /*
                 * Build API request.
                 */
                const params =
                    new URLSearchParams();

                params.set(
                    "items",
                    items.join(","),
                );

                params.set(
                    "latitude",
                    String(
                        latitude,
                    ),
                );

                params.set(
                    "longitude",
                    String(
                        longitude,
                    ),
                );

                /*
                 * 25 km discovery radius.
                 *
                 * Distance will NOT be the first
                 * recommendation factor.
                 */
                params.set(
                    "radius",
                    "25000",
                );

                /*
                 * Send budget to backend.
                 */
                if (
                    budgetInr !==
                        undefined &&
                    Number.isFinite(
                        budgetInr,
                    )
                ) {
                    params.set(
                        "budget",
                        String(
                            budgetInr,
                        ),
                    );
                }

                const apiUrl =
                    `/api/food/recommendations?${params.toString()}`;

                console.log(
                    "[FoodRecommendationList] Request:",
                    apiUrl,
                );

                const response =
                    await fetch(
                        apiUrl,
                        {
                            method:
                                "GET",
                            cache:
                                "no-store",
                        },
                    );

                /*
                 * Read body once.
                 */
                const rawText =
                    await response.text();

                let result:
                    | ApiResponse
                    | {
                          error?: string;
                      };

                try {
                    result =
                        JSON.parse(
                            rawText,
                        );
                } catch {
                    throw new Error(
                        `Recommendation API returned invalid JSON (${response.status}).`,
                    );
                }

                /*
                 * Server error.
                 */
                if (
                    !response.ok
                ) {
                    const serverError =
                        "error" in
                        result
                            ? result.error
                            : undefined;

                    throw new Error(
                        serverError ??
                            `Recommendation API failed with status ${response.status}.`,
                    );
                }

                const recommendationResponse =
                    result as ApiResponse;

                /*
                 * Validate response shape.
                 */
                if (
                    !Array.isArray(
                        recommendationResponse.recommendations,
                    )
                ) {
                    throw new Error(
                        "Recommendation API returned an invalid recommendations array.",
                    );
                }

                if (
                    !cancelled
                ) {
                    setData(
                        recommendationResponse,
                    );
                }
            } catch (
                requestError
            ) {
                console.error(
                    "[FoodRecommendationList] Failed:",
                    requestError,
                );

                if (
                    !cancelled
                ) {
                    setError(
                        requestError instanceof
                            Error
                            ? requestError.message
                            : "Unable to load nearby food recommendations.",
                    );
                }
            } finally {
                if (
                    !cancelled
                ) {
                    setLoading(
                        false,
                    );
                }
            }
        }

        void loadRecommendations();

        return () => {
            cancelled =
                true;
        };
    }, [
        /*
         * Use primitive values here.
         *
         * This prevents unnecessary API requests if
         * a parent creates a new `items` array reference.
         */
        items.join(","),
        latitude,
        longitude,
        budgetInr,
    ]);

    /*
     * ---------------------------------------------------------
     * LOADING
     * ---------------------------------------------------------
     */

    if (
        loading
    ) {
        return (
            <div className="mt-8 flex min-h-[320px] items-center justify-center rounded-[28px] bg-white">
                <div className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#123c35]" />

                    <p className="mt-4 text-sm font-black text-[#123c35]">
                        Finding the best food
                        options...
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#6d7974]">
                        Checking food match,
                        price and nearby
                        places.
                    </p>
                </div>
            </div>
        );
    }

    /*
     * ---------------------------------------------------------
     * ERROR
     * ---------------------------------------------------------
     */

    if (
        error
    ) {
        return (
            <div className="mt-8 rounded-[24px] border border-[#b84f2c]/10 bg-[#f9dfd0] p-5">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#b84f2c]" />

                    <div>
                        <p className="text-sm font-black text-[#b84f2c]">
                            Unable to load food
                            recommendations
                        </p>

                        <p className="mt-2 text-xs leading-5 text-[#8e4a35]">
                            {error}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    /*
     * ---------------------------------------------------------
     * EMPTY
     * ---------------------------------------------------------
     */

    if (
        !data ||
        sortedRecommendations.length ===
            0
    ) {
        return (
            <div className="mt-8 rounded-[28px] border border-[#123c35]/10 bg-white p-8 text-center">
                <Utensils className="mx-auto h-8 w-8 text-[#6d7974]" />

                <h2 className="mt-4 text-lg font-black text-[#123c35]">
                    No matching food places found
                </h2>

                <p className="mt-2 text-xs leading-5 text-[#6d7974]">
                    We couldn't find matching
                    nearby places for this food.
                    Try another food or increase
                    the search radius.
                </p>

                {budgetInr !==
                    undefined && (
                    <p className="mt-3 text-[10px] font-bold text-[#8b9792]">
                        Budget: ₹
                        {budgetInr.toLocaleString(
                            "en-IN",
                        )}
                    </p>
                )}
            </div>
        );
    }

    /*
     * ---------------------------------------------------------
     * RESULTS
     * ---------------------------------------------------------
     */

    return (
        <section className="mt-8">

            {/* ================================================= */}
            {/* HEADER                                            */}
            {/* ================================================= */}

            <div className="mb-6">

                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#ef713d]">
                    <Sparkles className="h-3.5 w-3.5" />

                    Smart recommendations
                </div>

                <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#123c35]">
                    Best matches for you
                </h2>

                <p className="mt-2 max-w-2xl text-xs leading-5 text-[#6d7974]">
                    FairTrip prioritizes the
                    requested food and available
                    price information before using
                    distance to rank nearby places.
                </p>

                {/* FOOD */}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#89938f]">
                        Food:
                    </span>

                    {items.map(
                        (
                            item,
                            index,
                        ) => (
                            <span
                                key={`${item}-${index}`}
                                className="rounded-full bg-[#e8f58d] px-3 py-1.5 text-[10px] font-black text-[#123c35]"
                            >
                                {item}
                            </span>
                        ),
                    )}
                </div>

                {/* CONTEXT */}

                <div className="mt-4 flex flex-wrap gap-2">

                    {budgetInr !==
                        undefined && (
                        <span className="inline-flex items-center rounded-full bg-[#123c35] px-3 py-1.5 text-[10px] font-black text-white">
                            Budget ₹
                            {budgetInr.toLocaleString(
                                "en-IN",
                            )}
                        </span>
                    )}

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f7f3ea] px-3 py-1.5 text-[10px] font-bold text-[#31544d]">
                        <MapPin className="h-3.5 w-3.5" />

                        {data.metadata
                            ?.nearbyPlaceCount ??
                            0}{" "}
                        places checked
                    </span>

                    {data.currentMeal && (
                        <span className="rounded-full bg-[#f7f3ea] px-3 py-1.5 text-[10px] font-bold capitalize text-[#31544d]">
                            Meal:{" "}
                            {
                                data.currentMeal
                            }
                        </span>
                    )}
                </div>
            </div>

            {/* ================================================= */}
            {/* RESULT CARDS                                      */}
            {/* ================================================= */}

            <div className="grid gap-5 md:grid-cols-2">
                {sortedRecommendations.map(
                    (
                        recommendation,
                        index,
                    ) => {
                        const food =
                            recommendation.food;

                        const hasPrice =
                            typeof food.priceInr ===
                            "number";

                        const fitsBudget =
                            budgetInr !==
                                undefined &&
                            hasPrice &&
                            food.priceInr! <=
                                budgetInr;

                        return (
                            <div
                                key={`${food.id}-${food.restaurantId ?? food.restaurantName ?? index}`}
                                className="relative"
                            >
                                {/* BEST MATCH */}

                                {index ===
                                    0 && (
                                    <div className="absolute -top-3 left-5 z-20 rounded-full bg-[#ef713d] px-3 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-white shadow-sm">
                                        Best match
                                    </div>
                                )}

                                {/* BUDGET */}

                                {fitsBudget && (
                                    <div className="absolute right-5 top-4 z-20 rounded-full bg-[#e8f58d] px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.08em] text-[#123c35] shadow-sm">
                                        Within budget
                                    </div>
                                )}

                                <FoodRecommendationCard
                                    recommendation={
                                        recommendation
                                    }
                                />
                            </div>
                        );
                    },
                )}
            </div>

            {/* ================================================= */}
            {/* LOGIC                                             */}
            {/* ================================================= */}

            <div className="mt-6 rounded-[20px] border border-[#123c35]/8 bg-white px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">

                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#89938f]">
                            Recommendation priority
                        </p>

                        <p className="mt-1 text-[10px] leading-4 text-[#6d7974]">
                            Food match → budget →
                            known price → situation →
                            distance
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#89938f]">
                            Search radius
                        </p>

                        <p className="mt-1 text-[10px] font-bold text-[#31544d]">
                            25 km
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}