"use client";

import {
    AlertTriangle,
    Loader2,
    MapPin,
    MessageCircle,
    Sparkles,
    Utensils,
} from "lucide-react";

import gsap from "gsap";

import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import type {
    FoodRecommendation,
} from "../services/foodRecommendation.service";

import FoodRecommendationCard from "./FoodRecommendationCard";

interface Props {
    items: string[];

    latitude?: number;

    longitude?: number;

    budgetInr?: number;

    locationQuery?: string;
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

        locationSource?:
        | "gps"
        | "user"
        | "none";

        searchLocationName?: string;

        foodMatchCount?: number;

        finalCandidateCount?: number;

        radiusMeters?: number;
    };

    error?: string;
}

/* =========================================================
 * TEXT HELPERS
 * ========================================================= */

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

/* =========================================================
 * FOOD MATCH
 * ========================================================= */

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

    const tags = (
        food.tags ?? []
    ).map(
        normalizeText,
    );

    return requestedItems.some(
        (item) => {
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
                    (tag) =>
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

/* =========================================================
 * SORT
 *
 * FOOD QUALITY FIRST.
 *
 * Price remains only a supporting factor.
 *
 * 1. Exact food match
 * 2. Confirmed food match
 * 3. Food popularity
 * 4. Rating
 * 5. Recommendation score
 * 6. Budget fit
 * 7. Distance
 * ========================================================= */

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

            /* -------------------------------------------------
             * 1. REQUESTED FOOD MATCH
             * ------------------------------------------------- */

            const aRequested =
                matchesRequestedFood(
                    a,
                    requestedItems,
                );

            const bRequested =
                matchesRequestedFood(
                    b,
                    requestedItems,
                );

            if (
                aRequested !==
                bRequested
            ) {
                return aRequested
                    ? -1
                    : 1;
            }

            /* -------------------------------------------------
             * 2. CONFIRMED FOOD MATCH
             * ------------------------------------------------- */

            if (
                aFood.foodMatchConfirmed !==
                bFood.foodMatchConfirmed
            ) {
                return aFood
                    .foodMatchConfirmed
                    ? -1
                    : 1;
            }

            /* -------------------------------------------------
             * 3. FOOD POPULARITY
             * ------------------------------------------------- */

            const aPopularity =
                aFood.popularityScore ??
                -1;

            const bPopularity =
                bFood.popularityScore ??
                -1;

            if (
                aPopularity !==
                bPopularity
            ) {
                return (
                    bPopularity -
                    aPopularity
                );
            }

            /* -------------------------------------------------
             * 4. RATING
             * ------------------------------------------------- */

            const aRating =
                aFood.rating ??
                -1;

            const bRating =
                bFood.rating ??
                -1;

            if (
                aRating !==
                bRating
            ) {
                return (
                    bRating -
                    aRating
                );
            }

            /* -------------------------------------------------
             * 5. FAIRTRIP SCORE
             * ------------------------------------------------- */

            if (
                a.score !==
                b.score
            ) {
                return (
                    b.score -
                    a.score
                );
            }

            /* -------------------------------------------------
             * 6. BUDGET FIT
             *
             * Only used as tie-breaking.
             * ------------------------------------------------- */

            if (
                budgetInr !==
                undefined
            ) {
                const aMin =
                    typeof aFood.priceMinInr ===
                        "number"
                        ? aFood.priceMinInr
                        : undefined;

                const bMin =
                    typeof bFood.priceMinInr ===
                        "number"
                        ? bFood.priceMinInr
                        : undefined;

                const aFits =
                    aMin !==
                    undefined &&
                    aMin <=
                    budgetInr;

                const bFits =
                    bMin !==
                    undefined &&
                    bMin <=
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

            /* -------------------------------------------------
             * 7. DISTANCE
             * ------------------------------------------------- */

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

/* =========================================================
 * LOCATION BANNER
 * ========================================================= */

function LocationStatusBanner({
    hasGpsLocation,
    hasUserLocation,
    locationQuery,
    bannerRef,
}: {
    hasGpsLocation: boolean;

    hasUserLocation: boolean;

    locationQuery?: string;

    bannerRef: React.RefObject<
        HTMLDivElement | null
    >;
}) {
    if (hasGpsLocation) {
        return (
            <div
                ref={bannerRef}
                className="overflow-hidden rounded-[28px] border border-[#123c35]/10 bg-[#123c35] shadow-[0_16px_45px_rgba(18,60,53,0.14)]"
            >
                <div className="flex items-start gap-4 p-5 sm:p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e8f58d]">
                        <MapPin className="h-5 w-5 text-[#123c35]" />
                    </div>

                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#cbe95b]">
                            Location ready
                        </p>

                        <h2 className="mt-1 text-xl font-black tracking-[-0.025em] text-white">
                            Finding food around you
                        </h2>

                        <p className="mt-2 text-xs leading-5 text-white/65">
                            Real place results
                            are being
                            prioritized using
                            your approximate
                            location.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (hasUserLocation) {
        return (
            <div
                ref={bannerRef}
                className="overflow-hidden rounded-[28px] border border-[#123c35]/10 bg-[#123c35] shadow-[0_16px_45px_rgba(18,60,53,0.14)]"
            >
                <div className="flex items-start gap-4 p-5 sm:p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e8f58d]">
                        <MapPin className="h-5 w-5 text-[#123c35]" />
                    </div>

                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#cbe95b]">
                            Location selected
                        </p>

                        <h2 className="mt-1 text-xl font-black tracking-[-0.025em] text-white">
                            Searching around
                        </h2>

                        <p className="mt-1 text-base font-black text-[#e8f58d]">
                            {
                                locationQuery
                            }
                        </p>

                        <p className="mt-2 text-xs leading-5 text-white/65">
                            FairTrip is using
                            this area to
                            find real food
                            places.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={bannerRef}
            className="overflow-hidden rounded-[28px] border border-[#123c35]/10 bg-[#123c35] shadow-[0_16px_45px_rgba(18,60,53,0.14)]"
        >
            <div className="flex items-start gap-4 p-5 sm:p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ef713d]">
                    <MapPin className="h-5 w-5 text-white" />
                </div>

                <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#cbe95b]">
                        Location needed
                        for nearby
                        results
                    </p>

                    <h2 className="mt-1 text-xl font-black tracking-[-0.025em] text-white">
                        Location was
                        unavailable
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-white/90">
                        We can still guide
                        you about the
                        food. To find real
                        places nearby,
                        enter an area,
                        market, railway
                        station or landmark.
                    </p>

                    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-[9px] font-black text-white/75">
                        <MapPin className="h-3.5 w-3.5 text-[#cbe95b]" />
                        Area or landmark
                        search available
                    </div>
                </div>
            </div>
        </div>
    );
}

/* =========================================================
 * FOOD OVERVIEW
 * ========================================================= */

function FoodDetail({
    label,
    value,
}: {
    label: string;
    value?: string;
}) {
    if (!value) {
        return null;
    }

    return (
        <div className="rounded-[18px] border border-[#123c35]/8 bg-[#fcfbf8] px-4 py-3">
            <p className="text-[8px] font-black uppercase tracking-[0.16em] text-[#8a9590]">
                {label}
            </p>
            <p className="mt-1.5 text-sm font-bold leading-5 text-[#173f38]">
                {value}
            </p>
        </div>
    );
}

function FoodOverview({
    food,
}: {
    food: FoodRecommendation["food"];
}) {
    const priceText =
        typeof food.priceMinInr === "number" &&
        typeof food.priceMaxInr === "number"
            ? `₹${food.priceMinInr.toLocaleString("en-IN")} – ₹${food.priceMaxInr.toLocaleString("en-IN")}`
            : food.priceRange;

    const category = food.cuisine?.length
        ? food.cuisine.join(" • ")
        : undefined;

    const taste = food.tasteProfile?.length
        ? food.tasteProfile.join(" • ")
        : undefined;

    const texture = food.texture?.length
        ? food.texture.join(" • ")
        : undefined;

    const meals = food.mealTypes?.length
        ? food.mealTypes.join(" • ")
        : undefined;

    const ingredients = food.ingredients?.length
        ? food.ingredients.join(" • ")
        : undefined;

    const goodFor = food.goodFor?.length
        ? food.goodFor.join(" • ")
        : undefined;

    const allergens = food.allergens?.length
        ? food.allergens.join(" • ")
        : undefined;

    const dietaryFlags = [
        food.isVegan ? "Vegan" : null,
        food.containsEgg === false ? "Egg-free" : null,
        food.jainSuitable ? "Jain suitable" : null,
        food.containsOnion === false ? "Onion-free" : null,
        food.containsGarlic === false ? "Garlic-free" : null,
    ].filter((value): value is string => Boolean(value));

    const nutritionItems = [
        typeof food.nutrition?.calories === "number"
            ? { label: "Calories", value: `${Math.round(food.nutrition.calories)} kcal` }
            : null,
        typeof food.nutrition?.proteinGrams === "number"
            ? { label: "Protein", value: `${food.nutrition.proteinGrams.toFixed(1)} g` }
            : null,
        typeof food.nutrition?.carbohydratesGrams === "number"
            ? { label: "Carbs", value: `${food.nutrition.carbohydratesGrams.toFixed(1)} g` }
            : null,
        typeof food.nutrition?.fatGrams === "number"
            ? { label: "Fat", value: `${food.nutrition.fatGrams.toFixed(1)} g` }
            : null,
    ].filter(
        (item): item is { label: string; value: string } => item !== null,
    );

    const quickFacts = [
        category ? { label: "Category", value: category } : null,
        food.diet ? { label: "Diet", value: food.diet } : null,
        food.spiceLevel ? { label: "Spice", value: food.spiceLevel } : null,
        meals ? { label: "Best time", value: meals } : null,
    ].filter(
        (item): item is { label: string; value: string } => item !== null,
    );

    const moreDetails = [
        food.origin ? { label: "Origin", value: food.origin } : null,
        ingredients ? { label: "Ingredients", value: ingredients } : null,
        texture ? { label: "Texture", value: texture } : null,
        food.preparationMethod
            ? { label: "Preparation", value: food.preparationMethod }
            : null,
        food.servingStyle
            ? { label: "Serving style", value: food.servingStyle }
            : null,
        taste ? { label: "Taste", value: taste } : null,
        goodFor ? { label: "Good for", value: goodFor } : null,
        allergens ? { label: "Allergens", value: allergens } : null,
        priceText
            ? {
                  label: "Typical price",
                  value: `${priceText}${food.priceEstimated ? " · estimated" : ""}`,
              }
            : null,
        food.popularityLevel
            ? {
                  label: "Popularity",
                  value: food.popularityReason
                      ? `${food.popularityLevel} · ${food.popularityReason}`
                      : food.popularityLevel,
              }
            : null,
    ].filter(
        (item): item is { label: string; value: string } => item !== null,
    );

    return (
        <section
            className="
                mt-5 overflow-hidden rounded-[30px]
                border border-[#123c35]/10 bg-white
                shadow-[0_18px_50px_rgba(18,60,53,0.07)]
            "
        >
            <div className="grid lg:grid-cols-[minmax(280px,38%)_1fr]">
                {/* ONE IMAGE */}
                <div className="relative min-h-[420px] bg-[#123c35]">
                    {food.imageUrl ? (
                        <img
                            src={food.imageUrl}
                            alt={food.name}
                            loading="eager"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Utensils className="h-16 w-16 text-white/20" />
                        </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent p-6">
                        <span className="inline-flex rounded-full bg-[#e8f58d] px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.14em] text-[#123c35]">
                            Food guide
                        </span>
                    </div>
                </div>

                {/* INFORMATION */}
                <div className="p-6 sm:p-8 lg:p-9">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#ef713d]">
                                Food overview
                            </p>
                            <h2 className="mt-2 text-[34px] font-black leading-none tracking-[-0.045em] text-[#123c35]">
                                {food.name}
                            </h2>
                        </div>

                        {typeof food.confidence === "number" && (
                            <div className="rounded-[16px] bg-[#e8f58d] px-3.5 py-2.5 text-right">
                                <p className="text-[8px] font-black uppercase tracking-[0.12em] text-[#61722c]">
                                    Recognized
                                </p>
                                <p className="mt-0.5 text-sm font-black text-[#123c35]">
                                    {Math.round(food.confidence * 100)}%
                                </p>
                            </div>
                        )}
                    </div>

                    {food.description && (
                        <p className="mt-4 max-w-2xl text-[14px] leading-6 text-[#6b7772]">
                            {food.description}
                        </p>
                    )}

                    {quickFacts.length > 0 && (
                        <div className="mt-6 grid gap-2 sm:grid-cols-2">
                            {quickFacts.map((fact) => (
                                <FoodDetail
                                    key={fact.label}
                                    label={fact.label}
                                    value={fact.value}
                                />
                            ))}
                        </div>
                    )}

                    {moreDetails.length > 0 && (
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            {moreDetails.map((detail) => (
                                <FoodDetail
                                    key={detail.label}
                                    label={detail.label}
                                    value={detail.value}
                                />
                            ))}
                        </div>
                    )}

                    {dietaryFlags.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                            {dietaryFlags.map((flag) => (
                                <span
                                    key={flag}
                                    className="rounded-full bg-[#edf5d1] px-3 py-1.5 text-[9px] font-black text-[#35520d]"
                                >
                                    {flag}
                                </span>
                            ))}
                        </div>
                    )}

                    {nutritionItems.length > 0 && (
                        <div className="mt-6 rounded-[20px] border border-[#123c35]/8 bg-[#f7f3ea] p-4">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#ef713d]">
                                    Nutrition
                                </p>
                                <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#89938f]">
                                    Per serving · when available
                                </span>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                                {nutritionItems.map((item) => (
                                    <div key={item.label} className="rounded-[14px] bg-white p-3">
                                        <p className="text-[8px] font-black uppercase tracking-[0.1em] text-[#89938f]">
                                            {item.label}
                                        </p>
                                        <p className="mt-1 text-sm font-black text-[#123c35]">
                                            {item.value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {food.wikipediaUrl && (
                        <a
                            href={food.wikipediaUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-6 inline-flex items-center text-xs font-black text-[#ef713d] hover:underline"
                        >
                            Explore more about {food.name} →
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}

/* =========================================================
 * MAIN
 * ========================================================= */

export default function FoodRecommendationList({
    items,
    latitude,
    longitude,
    budgetInr,
    locationQuery,
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

    /* =========================================================
     * GSAP REFS
     * ========================================================= */

    const pageRef =
        useRef<HTMLDivElement>(null);

    const bannerRef =
        useRef<HTMLDivElement>(null);

    const headerRef =
        useRef<HTMLDivElement>(null);

    const localTipRef =
        useRef<HTMLDivElement>(null);

    /* =========================================================
     * LOCATION
     * ========================================================= */

    const hasGpsLocation =
        typeof latitude ===
        "number" &&
        typeof longitude ===
        "number" &&
        Number.isFinite(
            latitude,
        ) &&
        Number.isFinite(
            longitude,
        ) &&
        latitude !== 0 &&
        longitude !== 0;

    const hasUserLocation =
        Boolean(
            locationQuery?.trim(),
        );

    /* =========================================================
     * ITEMS
     * ========================================================= */

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

    /* =========================================================
     * SORTED RESULTS
     * ========================================================= */

    const sortedRecommendations =
        useMemo(
            () => {
                if (!data) {
                    return [];
                }

                return sortRecommendations(
                    data.recommendations,
                    normalizedItems,
                    budgetInr,
                );
            },
            [
                data,
                normalizedItems,
                budgetInr,
            ],
        );

    const featuredFood =
        sortedRecommendations[0]?.food;

    /* =========================================================
     * LOAD
     * ========================================================= */

    useEffect(() => {
        let cancelled =
            false;

        async function loadRecommendations() {
            try {
                setLoading(true);
                setError("");
                setData(null);

                if (
                    items.length ===
                    0
                ) {
                    throw new Error(
                        "No food items were provided.",
                    );
                }

                const params =
                    new URLSearchParams();

                const foodQuery =
                    items
                        .map((item) => item.trim())
                        .filter(Boolean)
                        .join(", ");

                if (!foodQuery) {
                    throw new Error(
                        "No food items were provided.",
                    );
                }

                params.set(
                    "q",
                    foodQuery,
                );

                if (
                    hasGpsLocation
                ) {
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
                }

                if (
                    hasUserLocation
                ) {
                    params.set(
                        "locationQuery",
                        locationQuery!.trim(),
                    );
                }

                /*
                 * Keep the broader discovery
                 * radius for citizen/local exploration.
                 */
                params.set(
                    "radius",
                    "25000",
                );

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

                const rawText =
                    await response.text();

                let parsed:
                    | ApiResponse
                    | {
                        error?: string;
                    };

                try {
                    parsed =
                        JSON.parse(
                            rawText,
                        );
                } catch {
                    throw new Error(
                        `Recommendation API returned invalid JSON (${response.status}).`,
                    );
                }

                if (
                    !response.ok
                ) {
                    throw new Error(
                        "error" in
                            parsed
                            ? parsed.error ??
                            `Recommendation API failed with status ${response.status}.`
                            : `Recommendation API failed with status ${response.status}.`,
                    );
                }

                if (
                    !Array.isArray(
                        (
                            parsed as ApiResponse
                        )
                            .recommendations,
                    )
                ) {
                    throw new Error(
                        "Recommendation API returned invalid recommendations.",
                    );
                }

                if (
                    !cancelled
                ) {
                    setData(
                        parsed as ApiResponse,
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
                            : "Unable to load food recommendations.",
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
        items.join(","),
        latitude,
        longitude,
        budgetInr,
        locationQuery,
        hasGpsLocation,
        hasUserLocation,
    ]);

    /* =========================================================
     * PAGE ANIMATION
     * ========================================================= */

    useEffect(() => {
        if (
            loading ||
            !data ||
            !pageRef.current
        ) {
            return;
        }

        const ctx =
            gsap.context(
                () => {
                    const elements = [
                        bannerRef.current,
                        headerRef.current,
                        localTipRef.current,
                    ].filter(
                        (
                            element,
                        ): element is HTMLDivElement =>
                            Boolean(
                                element,
                            ),
                    );

                    gsap.fromTo(
                        elements,
                        {
                            opacity: 0,
                            y: 20,
                        },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.55,
                            stagger: 0.08,
                            ease:
                                "power3.out",
                        },
                    );
                },
                pageRef,
            );

        return () => {
            ctx.revert();
        };
    }, [
        loading,
        data,
    ]);

    /* =========================================================
     * LOADING
     * ========================================================= */

    if (loading) {
        return (
            <div className="mt-8 flex min-h-[360px] items-center justify-center rounded-[30px] bg-white">
                <div className="px-6 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f58d]">
                        <Loader2 className="h-7 w-7 animate-spin text-[#123c35]" />
                    </div>

                    <p className="mt-5 text-base font-black text-[#123c35]">
                        Understanding food
                        and finding places...
                    </p>

                    <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#6d7974]">
                        Checking food match,
                        food characteristics,
                        popularity, ratings,
                        real places and
                        distance.
                    </p>
                </div>
            </div>
        );
    }

    /* =========================================================
     * ERROR
     * ========================================================= */

    if (error) {
        return (
            <div className="mt-8 rounded-[28px] border border-[#b84f2c]/10 bg-[#f9dfd0] p-5 shadow-[0_12px_30px_rgba(184,79,44,0.07)]">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#b84f2c]" />

                    <div>
                        <p className="text-sm font-black text-[#b84f2c]">
                            Couldn&apos;t load
                            food places
                        </p>

                        <p className="mt-2 text-xs leading-5 text-[#8e4a35]">
                            {error}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    /* =========================================================
     * EMPTY
     * ========================================================= */

    if (
        !data ||
        sortedRecommendations.length ===
        0
    ) {
        return (
            <div
                ref={pageRef}
                className="mt-8"
            >
                <LocationStatusBanner
                    hasGpsLocation={
                        hasGpsLocation
                    }
                    hasUserLocation={
                        hasUserLocation
                    }
                    locationQuery={
                        locationQuery
                    }
                    bannerRef={
                        bannerRef
                    }
                />

                <div className="mt-5 overflow-hidden rounded-[28px] border border-[#123c35]/10 bg-[#123c35] p-5 shadow-[0_14px_40px_rgba(18,60,53,0.10)]">
                    <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ef713d]">
                            <Utensils className="h-5 w-5 text-white" />
                        </div>

                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#cbe95b]">
                                FairTrip food
                                guide
                            </p>

                            <h2 className="mt-1 text-xl font-black text-white">
                                No confirmed
                                place found yet
                            </h2>

                            <p className="mt-2 text-xs leading-5 text-white/65">
                                Small local
                                stalls and
                                temporary
                                vendors may not
                                appear in map
                                data.
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 rounded-[18px] bg-white/10 p-4">
                        <div className="flex items-start gap-3">
                            <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#ef713d]" />

                            <div>
                                <p className="text-xs font-black text-white">
                                    Ask a local
                                </p>

                                <p className="mt-1 text-[10px] leading-5 text-white/60">
                                    Ask a shopkeeper,
                                    auto driver,
                                    hotel staff
                                    member or
                                    nearby
                                    resident where
                                    locals eat this
                                    food.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /* =========================================================
     * RESULTS
     * ========================================================= */

    return (
        <div
            ref={pageRef}
            className="mt-8"
        >
            <LocationStatusBanner
                hasGpsLocation={
                    hasGpsLocation
                }
                hasUserLocation={
                    hasUserLocation
                }
                locationQuery={
                    locationQuery
                }
                bannerRef={
                    bannerRef
                }
            />
            

            {/* =================================================
                FOOD OVERVIEW
            ================================================= */}

            {featuredFood && (
                <FoodOverview food={featuredFood} />
            )}

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                ref={headerRef}
                className="mb-6 mt-8"
            >
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.16em] text-[#ef713d]">
                    <Sparkles className="h-3.5 w-3.5" />

                    {data.metadata?.nearbyPlaceCount ?? sortedRecommendations.length} nearby places
                </div>

                <h2 className="mt-2 text-3xl font-black tracking-[-0.045em] text-[#123c35]">
                    Where to find {featuredFood?.name ?? "this food"}
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6d7974]">
                    Places close to you where this food may be available.
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#f7f3ea] px-3 py-1.5 text-[9px] font-black text-[#31544d]">
                        {data.metadata?.nearbyPlaceCount ?? sortedRecommendations.length} places found
                    </span>
                    {data.currentMeal && (
                        <span className="rounded-full bg-[#f7f3ea] px-3 py-1.5 text-[9px] font-black capitalize text-[#31544d]">
                            {data.currentMeal}
                        </span>
                    )}
                </div>
            </div>

            {/* =================================================
                CARDS
            ================================================= */}

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {sortedRecommendations.map(
                    (
                        recommendation,
                        index,
                    ) => (
                        <div
                            key={`${recommendation.food.id}-${recommendation.food.restaurantId ?? recommendation.food.restaurantName ?? index}`}
                        >
                            <FoodRecommendationCard
                                recommendation={recommendation}
                                index={index}
                            />
                        </div>
                    ),
                )}
            </div>

            {/* =================================================
                LOCAL TIP
            ================================================= */}

            <div
                ref={localTipRef}
                className="mt-7 rounded-[24px] border border-[#123c35]/10 bg-[#123c35] p-5 shadow-[0_12px_35px_rgba(18,60,53,0.08)]"
            >
                <div className="flex items-start gap-3">
                    <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#ef713d]" />

                    <div>
                        <p className="text-xs font-black text-white">
                            Ask a local
                        </p>

                        <p className="mt-1 text-[10px] leading-5 text-white/60">
                            Maps can miss
                            small stalls,
                            temporary vendors
                            and hyper-local
                            favorites. A
                            nearby resident or
                            shopkeeper can still
                            point you toward
                            the place locals
                            prefer.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}