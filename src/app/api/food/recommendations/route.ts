import { NextResponse } from "next/server";

import {
    enrichRecognizedFood,
} from "@/features/food/services/foodEnrichment.service";

import {
    searchRealFood,
} from "@/features/food/services/geoapifyFood.service";

import {
    getFoodRecommendations,
    type FoodRecommendation,
} from "@/features/food/services/foodRecommendation.service";

import type {
    FoodItem,
    MealType,
} from "@/features/food/types/food.types";

interface ApiResponse {
    detectedFoods: string[];

    currentMeal: MealType;

    recommendations: FoodRecommendation[];

    metadata: {
        source: string;
        retrievedAt: string;
        nearbyPlaceCount: number;
        budgetInr?: number;
        priceFiltered: boolean;
    };
}

function parseItems(
    value: string | null,
): string[] {
    if (!value) {
        return [];
    }

    return [
        ...new Set(
            value
                .split(",")
                .map((item) =>
                    decodeURIComponent(
                        item,
                    ).trim(),
                )
                .filter(Boolean),
        ),
    ];
}

function getCurrentMeal(): MealType {
    const hour =
        new Date().getHours();

    if (
        hour >= 5 &&
        hour < 11
    ) {
        return "breakfast";
    }

    if (
        hour >= 11 &&
        hour < 16
    ) {
        return "lunch";
    }

    if (
        hour >= 16 &&
        hour < 19
    ) {
        return "snack";
    }

    if (
        hour >= 19 &&
        hour < 23
    ) {
        return "dinner";
    }

    return "late-night";
}

function normalizeFoodName(
    value: string,
): string {
    return value
        .toLowerCase()
        .replace(
            /[^a-z0-9\s]/g,
            " ",
        )
        .replace(
            /\s+/g,
            " ",
        )
        .trim();
}

function foodMatches(
    food: FoodItem,
    requestedItems: string[],
): boolean {
    const foodName =
        normalizeFoodName(
            food.name,
        );

    const foodTags =
        (food.tags ?? []).map(
            normalizeFoodName,
        );

    return requestedItems.some(
        (requested) => {
            const query =
                normalizeFoodName(
                    requested,
                );

            if (!query) {
                return false;
            }

            return (
                foodName === query ||
                foodName.includes(query) ||
                query.includes(foodName) ||
                foodTags.some(
                    (tag) =>
                        tag === query ||
                        tag.includes(query) ||
                        query.includes(tag),
                )
            );
        },
    );
}

function buildCandidateFood(
    enrichedFood: FoodItem,
    place: FoodItem,
): FoodItem {
    return {
        ...enrichedFood,

        /*
         * Keep the detected food as the actual
         * food name.
         */
        name: enrichedFood.name,

        /*
         * Real nearby restaurant.
         */
        restaurantId:
            place.restaurantId,

        restaurantName:
            place.restaurantName ??
            place.name,

        latitude:
            place.latitude,

        longitude:
            place.longitude,

        distanceKm:
            place.distanceKm,

        website:
            place.website,

        phone:
            place.phone,

        openingHours:
            place.openingHours,

        mapUrl:
            place.mapUrl,

        /*
         * IMPORTANT:
         *
         * Price comes from enrichedFood/local food data.
         * Do NOT copy Geoapify's estimated restaurant
         * category price.
         */
        priceInr:
            enrichedFood.priceInr,

        priceRange:
            enrichedFood.priceRange,

        priceEstimated:
            enrichedFood.priceEstimated,

        priceRangeEstimated:
            enrichedFood.priceRangeEstimated,

        tags: [
            ...(enrichedFood.tags ?? []),
            ...(place.tags ?? []),
            "geoapify-nearby",
        ],
    };
}

function filterByBudget(
    foods: FoodItem[],
    budgetInr?: number,
): FoodItem[] {
    if (
        budgetInr === undefined
    ) {
        return foods;
    }

    const knownPrices =
        foods.filter(
            (food) =>
                typeof food.priceInr ===
                    "number" &&
                food.priceInr <=
                    budgetInr,
        );

    /*
     * If we have at least one known price
     * inside the user's budget, only show those.
     */
    if (
        knownPrices.length > 0
    ) {
        return knownPrices;
    }

    /*
     * No known price fits.
     *
     * Keep foods whose price is unknown rather
     * than inventing or misrepresenting a price.
     */
    const unknownPriceFoods =
        foods.filter(
            (food) =>
                food.priceInr ===
                undefined,
        );

    return unknownPriceFoods;
}

export async function GET(
    request: Request,
) {
    try {
        const {
            searchParams,
        } = new URL(
            request.url,
        );

        const items =
            parseItems(
                searchParams.get(
                    "items",
                ),
            );

        const latitude =
            Number(
                searchParams.get(
                    "latitude",
                ),
            );

        const longitude =
            Number(
                searchParams.get(
                    "longitude",
                ),
            );

        const budgetParam =
            searchParams.get(
                "budget",
            );

        const radiusParam =
            searchParams.get(
                "radius",
            );

        const budgetInr =
            budgetParam !== null &&
            budgetParam.trim() !== ""
                ? Number(
                      budgetParam,
                  )
                : undefined;

        const requestedRadius =
            radiusParam !== null
                ? Number(
                      radiusParam,
                  )
                : 25_000;

        const radiusMeters =
            Number.isFinite(
                requestedRadius,
            )
                ? Math.min(
                      Math.max(
                          requestedRadius,
                          500,
                      ),
                      25_000,
                  )
                : 25_000;

        /*
         * ---------------------------------------------------------
         * VALIDATION
         * ---------------------------------------------------------
         */

        if (
            items.length === 0
        ) {
            return NextResponse.json(
                {
                    error:
                        "At least one food item is required.",
                },
                {
                    status: 400,
                },
            );
        }

        if (
            !Number.isFinite(
                latitude,
            ) ||
            !Number.isFinite(
                longitude,
            )
        ) {
            return NextResponse.json(
                {
                    error:
                        "Valid latitude and longitude are required.",
                },
                {
                    status: 400,
                },
            );
        }

        if (
            budgetInr !==
                undefined &&
            (!Number.isFinite(
                budgetInr,
            ) ||
                budgetInr < 0)
        ) {
            return NextResponse.json(
                {
                    error:
                        "Budget must be a valid positive number.",
                },
                {
                    status: 400,
                },
            );
        }

        const currentMeal =
            getCurrentMeal();

        console.log(
            "[Food Recommendations] Request",
            {
                items,
                latitude,
                longitude,
                budgetInr,
                radiusMeters,
                currentMeal,
            },
        );

        /*
         * ---------------------------------------------------------
         * 1. ENRICH THE REQUESTED FOOD
         * ---------------------------------------------------------
         *
         * This gives us:
         *
         * - known food name
         * - description
         * - image
         * - cuisine
         * - known price
         * - meal information
         */

        const enrichedFoods =
            await Promise.all(
                items.map(
                    async (
                        item,
                    ) => {
                        try {
                            return await enrichRecognizedFood(
                                item,
                            );
                        } catch (
                            enrichmentError
                        ) {
                            console.error(
                                "[Food Recommendations] Food enrichment failed:",
                                item,
                                enrichmentError,
                            );

                            return null;
                        }
                    },
                ),
            );

        const validEnrichedFoods =
            enrichedFoods.filter(
                (
                    food,
                ): food is FoodItem =>
                    food !== null,
            );

        if (
            validEnrichedFoods.length ===
            0
        ) {
            return NextResponse.json(
                {
                    detectedFoods:
                        items,

                    currentMeal,

                    recommendations:
                        [],

                    metadata: {
                        source:
                            "Food enrichment + Geoapify",
                        retrievedAt:
                            new Date().toISOString(),
                        nearbyPlaceCount:
                            0,
                        ...(budgetInr !==
                        undefined
                            ? {
                                  budgetInr,
                              }
                            : {}),
                        priceFiltered:
                            false,
                    },
                } satisfies ApiResponse,
            );
        }

        /*
         * ---------------------------------------------------------
         * 2. SEARCH REAL NEARBY FOOD PLACES
         * ---------------------------------------------------------
         *
         * Geoapify supplies the real restaurant/cafe locations.
         *
         * It does NOT become the source of dish price.
         */

        const nearbyPlaces =
            await searchRealFood({
                latitude,
                longitude,

                radiusMeters,

                query:
                    items.join(" "),
            });

        console.log(
            "[Food Recommendations] Nearby places:",
            nearbyPlaces.length,
        );

        /*
         * ---------------------------------------------------------
         * 3. MAKE FOOD + RESTAURANT CANDIDATES
         * ---------------------------------------------------------
         */

        const candidates: FoodItem[] =
            [];

        for (
            const enrichedFood of
                validEnrichedFoods
        ) {
            for (
                const place of nearbyPlaces
            ) {
                /*
                 * The restaurant is nearby;
                 * the food identity comes from the
                 * detected/enriched food.
                 */
                const candidate =
                    buildCandidateFood(
                        enrichedFood,
                        place,
                    );

                candidates.push(
                    candidate,
                );
            }
        }

        /*
         * ---------------------------------------------------------
         * 4. KEEP ONLY REQUESTED FOOD MATCHES
         * ---------------------------------------------------------
         *
         * This prevents unrelated nearby places from being
         * treated as the requested dish.
         */

        const matchingCandidates =
            candidates.filter(
                (food) =>
                    foodMatches(
                        food,
                        items,
                    ),
            );

        /*
         * If the enrichment name cannot match due to
         * spelling differences, keep the enriched candidates.
         */
        const foodCandidates =
            matchingCandidates.length >
            0
                ? matchingCandidates
                : candidates;

        /*
         * ---------------------------------------------------------
         * 5. PRICE FIRST
         * ---------------------------------------------------------
         */

        const budgetFiltered =
            filterByBudget(
                foodCandidates,
                budgetInr,
            );

        console.log(
            "[Food Recommendations] Price candidates:",
            budgetFiltered.length,
        );

        /*
         * ---------------------------------------------------------
         * 6. RECOMMENDATION ENGINE
         * ---------------------------------------------------------
         */

        const recommendationInputs =
            budgetFiltered.map(
                (food) => ({
                    food,

                    preferredFood:
                        items[0],

                    currentMeal,

                    budgetInr,
                }),
            );

        const recommendations =
            getFoodRecommendations(
                recommendationInputs,
            );

        /*
         * ---------------------------------------------------------
         * 7. FINAL SORT
         * ---------------------------------------------------------
         *
         * Explicit order:
         *
         * 1. requested food
         * 2. fits budget
         * 3. known price
         * 4. lower price
         * 5. recommendation score
         * 6. distance
         */

        const sorted =
            [...recommendations].sort(
                (
                    a,
                    b,
                ) => {
                    const aPrice =
                        a.food.priceInr;

                    const bPrice =
                        b.food.priceInr;

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

                    const aKnown =
                        typeof aPrice ===
                        "number";

                    const bKnown =
                        typeof bPrice ===
                        "number";

                    if (
                        aKnown !==
                        bKnown
                    ) {
                        return aKnown
                            ? -1
                            : 1;
                    }

                    if (
                        aKnown &&
                        bKnown &&
                        aPrice !==
                            bPrice
                    ) {
                        return (
                            aPrice -
                            bPrice
                        );
                    }

                    if (
                        a.score !==
                        b.score
                    ) {
                        return (
                            b.score -
                            a.score
                        );
                    }

                    return (
                        (
                            a.food
                                .distanceKm ??
                            Number.POSITIVE_INFINITY
                        ) -
                        (
                            b.food
                                .distanceKm ??
                            Number.POSITIVE_INFINITY
                        )
                    );
                },
            );

        /*
         * ---------------------------------------------------------
         * 8. REMOVE DUPLICATES
         * ---------------------------------------------------------
         */

        const unique =
            new Map<
                string,
                FoodRecommendation
            >();

        for (
            const recommendation of
                sorted
        ) {
            const food =
                recommendation.food;

            const key =
                `${food.name}|${food.restaurantId ?? food.restaurantName ?? food.id}`;

            if (
                !unique.has(
                    key,
                )
            ) {
                unique.set(
                    key,
                    recommendation,
                );
            }
        }

        const finalRecommendations =
            Array.from(
                unique.values(),
            ).slice(
                0,
                20,
            );

        /*
         * ---------------------------------------------------------
         * RESPONSE
         * ---------------------------------------------------------
         */

        return NextResponse.json({
            detectedFoods:
                items,

            currentMeal,

            recommendations:
                finalRecommendations,

            metadata: {
                source:
                    "Food enrichment + Geoapify Places",

                retrievedAt:
                    new Date().toISOString(),

                nearbyPlaceCount:
                    nearbyPlaces.length,

                ...(budgetInr !==
                undefined
                    ? {
                          budgetInr,
                      }
                    : {}),

                priceFiltered:
                    budgetInr !==
                        undefined &&
                    foodCandidates.some(
                        (food) =>
                            typeof food.priceInr ===
                            "number",
                    ),
            },
        } satisfies ApiResponse);
    } catch (error) {
        console.error(
            "[Food Recommendations] Failed:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to generate food recommendations.",
            },
            {
                status: 500,
            },
        );
    }
}