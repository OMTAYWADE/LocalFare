import { NextResponse } from "next/server";

import {
    enrichRecognizedFood,
} from "@/features/food/services/foodEnrichment.service";

import {
    searchFoursquareFood,
} from "@/features/food/services/foursquareFood.service";

import {
    searchRealFood,
} from "@/features/food/services/geoapifyFood.service";

import {
    getFoodRecommendations,
} from "@/features/food/services/foodRecommendation.service";

import type {
    FoodItem,
    MealType,
} from "@/features/food/types/food.types";

/*
 * =========================================================
 * CURRENT MEAL
 * =========================================================
 */

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

/*
 * =========================================================
 * NORMALIZE
 * =========================================================
 */

function normalize(
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

/*
 * =========================================================
 * BUILD GEOAPIFY FALLBACK
 * =========================================================
 */

function buildGeoapifyCandidates(
    foodName: string,
    enrichedFood: FoodItem,
    places: FoodItem[],
): FoodItem[] {
    return places.map(
        (place) => ({
            ...enrichedFood,

            id:
                `geo-food-${place.id}`,

            /*
             * IMPORTANT:
             * Candidate food name is the requested
             * food, not restaurant name.
             */
            name:
                foodName,

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

            mapUrl:
                place.mapUrl,

            openingHours:
                place.openingHours,

            rating:
                place.rating,

            cuisine:
                enrichedFood
                    .cuisine
                    .length > 0
                    ? enrichedFood.cuisine
                    : place.cuisine,

            mealTypes:
                enrichedFood
                    .mealTypes
                    .length > 0
                    ? enrichedFood.mealTypes
                    : place.mealTypes,

            foodMatchConfirmed:
                false,

            foodMatchSource:
                "geoapify",

            placeProvider:
                "geoapify",

            tags: [
                ...(enrichedFood.tags ??
                    []),

                "search",

                "geoapify",
            ],
        }),
    );
}

/*
 * =========================================================
 * MERGE PLACE DATA
 * =========================================================
 */

function mergeCandidates(
    foursquareCandidates: FoodItem[],
    geoapifyCandidates: FoodItem[],
): FoodItem[] {
    const merged =
        new Map<
            string,
            FoodItem
        >();

    /*
     * Foursquare first because its
     * query is actually related to
     * the requested food.
     */
    for (
        const food of
            foursquareCandidates
    ) {
        const key =
            food.restaurantId ??
            normalize(
                food.restaurantName ??
                    food.name,
            );

        merged.set(
            key,
            food,
        );
    }

    /*
     * Geoapify supplements missing
     * places.
     */
    for (
        const food of
            geoapifyCandidates
    ) {
        const key =
            food.restaurantId ??
            normalize(
                food.restaurantName ??
                    food.name,
            );

        const existing =
            merged.get(
                key,
            );

        if (!existing) {
            merged.set(
                key,
                food, G ;
            );

            continue;
        }

        merged.set(
            key,
            {
                ...existing,

                address:
                    existing.description ??
                    food.description,

                website:
                    existing.website ??
                    food.website,

                phone:
                    existing.phone ??
                    food.phone,

                openingHours:
                    existing.openingHours ??
                    food.openingHours,

                mapUrl:
                    existing.mapUrl ??
                    food.mapUrl,

                distanceKm:
                    existing.distanceKm ??
                    food.distanceKm,
            },
        );
    }

    return Array.from(
        merged.values(),
    );
}

/*
 * =========================================================
 * GET /api/food/recommendations
 * =========================================================
 */

export async function GET(
    request: Request,
) {
    try {
        const {
            searchParams,
        } =
            new URL(
                request.url,
            );

        const query =
            searchParams
                .get("q")
                ?.trim() ??
            "";

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

        const vegetarian =
            searchParams.get(
                "vegetarian",
            ) === "true";

        const radius =
            Number(
                searchParams.get(
                    "radius",
                ) ??
                    "10000",
            );

        if (!query) {
            return NextResponse.json(
                {
                    error:
                        "A food search query is required.",
                },
                {
                    status: 400,
                },
            );
        }

        /*
         * Treat 0,0 as missing GPS.
         * Your frontend was previously sending
         * latitude=0&longitude=0.
         */
        const hasLocation =
            Number.isFinite(
                latitude,
            ) &&
            Number.isFinite(
                longitude,
            ) &&
            latitude >= -90 &&
            latitude <= 90 &&
            longitude >= -180 &&
            longitude <= 180 &&
            !(
                latitude ===
                    0 &&
                longitude ===
                    0
            );

        /*
         * Don't silently search the ocean when
         * GPS is unavailable.
         */
        if (!hasLocation) {
            return NextResponse.json({
                query,

                currentMeal:
                    getCurrentMeal(),

                recommendations:
                    [],

                metadata: {
                    source:
                        "Food enrichment",

                    retrievedAt:
                        new Date().toISOString(),

                    nearbyPlaceCount:
                        0,

                    foodMatchCount:
                        0,

                    locationSource:
                        "none",

                    locationRequired:
                        true,

                    message:
                        "Location is required to find nearby food places. Food guidance is still available.",
                },
            });
        }

        const safeRadius =
            Number.isFinite(
                radius,
            )
                ? Math.min(
                      Math.max(
                          radius,
                          500,
                      ),
                      25000,
                  )
                : 10000;

        console.log(
            "[Food Recommendations] Request:",
            {
                query,
                latitude,
                longitude,
                radius:
                    safeRadius,
                currentMeal:
                    getCurrentMeal(),
            },
        );

        /*
         * =====================================================
         * 1. GENERAL FOOD INFORMATION
         * =====================================================
         */

        const enrichedFood =
            await enrichRecognizedFood(
                query,
            );

        /*
         * =====================================================
         * 2. FOOD-SPECIFIC PLACE SEARCH
         * =====================================================
         *
         * Foursquare gets the actual food query.
         *
         * Example:
         *     "samosa"
         *
         * rather than:
         *     restaurant name = "samosa"
         */

        let foursquareResults =
            [];

        try {
            foursquareResults =
                await searchFoursquareFood(
                    query,
                    latitude,
                    longitude,
                    safeRadius,
                );
        } catch (
            foursquareError
        ) {
            console.error(
                "[Food Recommendations] Foursquare failed:",
                foursquareError,
            );

            /*
             * Keep Geoapify fallback alive.
             */
            foursquareResults =
                [];
        }

        /*
         * =====================================================
         * 3. GENERIC NEARBY RESTAURANTS
         * =====================================================
         *
         * IMPORTANT:
         * Do NOT pass query to Geoapify's `name`
         * parameter here.
         *
         * `name` is a place-name filter.
         */

        let nearbyPlaces:
            FoodItem[] = [];

        try {
            nearbyPlaces =
                await searchRealFood({
                    latitude,

                    longitude,

                    radiusMeters:
                        safeRadius,

                    vegetarian,

                    /*
                     * Intentionally omitted.
                     *
                     * Geoapify cannot use its `name`
                     * parameter as a dish search.
                     */
                });
        } catch (
            geoapifyError
        ) {
            console.error(
                "[Food Recommendations] Geoapify failed:",
                geoapifyError,
            );

            nearbyPlaces =
                [];
        }

        /*
         * =====================================================
         *  4. BUILD FOOD CANDIDATES
         * =====================================================
         */

        const foursquareCandidates =
            foursquareResults.map(
                (
                    result,
                ) => ({
                    ...result.food,

                    /*
                     * Preserve the food information
                     * returned by Wikipedia/Wikimedia.
                     */
                    description:
                        enrichedFood.description ??
                        result.food.description,

                    imageUrl:
                        enrichedFood.imageUrl ??
                        result.food.imageUrl,

                    tags: [
                        ...(
                            enrichedFood.tags ??
                            []
                        ),

                        ...(
                            result.food.tags ??
                            []
                        ),
                    ],
                }),
            );

        const geoapifyCandidates =
            buildGeoapifyCandidates(
                query,
                enrichedFood,
                nearbyPlaces,
            );

        /*
         * =====================================================
         * 5. MERGE
         * =====================================================
         */

        const candidates =
            mergeCandidates(
                foursquareCandidates,
                geoapifyCandidates,
            );

        console.log(
            "[Food Recommendations] Foursquare matches:",
            foursquareCandidates.length,
        );

        console.log(
            "[Food Recommendations] Geoapify nearby places:",
            nearbyPlaces.length,
        );

        console.log(
            "[Food Recommendations] Final candidates:",
            candidates.length,
        );

        /*
         * =====================================================
         * 6. RANK
         * =====================================================
         */

        const recommendations =
            getFoodRecommendations(
                candidates.map(
                    (
                        food,
                    ) => ({
                        food,

                        preferredFood:
                            query,

                        vegetarian,

                        currentMeal:
                            getCurrentMeal(),

                        maxDistanceKm:
                            safeRadius /
                            1000,

                        travelerType:
                            "tourist",
                    }),
                ),
            );

        /*
         * =====================================================
         * 7. REMOVE DUPLICATES
         * =====================================================
         */

        const unique =
            new Map<
                string,
                (typeof recommendations)[number]
            >();

        for (
            const recommendation of
                recommendations
        ) {
            const key =
                recommendation.food
                    .restaurantId ??
                normalize(
                    recommendation.food
                        .restaurantName ??
                        recommendation.food
                            .name,
                );

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

        /*
         * =====================================================
         * 8. FINAL RESPONSE
         * =====================================================
         */

        const finalRecommendations =
            Array.from(
                unique.values(),
            ).slice(
                0,
                20,
            );

        return NextResponse.json({
            query,

            currentMeal:
                getCurrentMeal(),

            recommendations:
                finalRecommendations,

            metadata: {
                source:
                    "Foursquare Places + Geoapify Places + Food enrichment",

                retrievedAt:
                    new Date().toISOString(),

                nearbyPlaceCount:
                    nearbyPlaces.length,

                foodMatchCount:
                    foursquareCandidates.length,

                finalCandidateCount:
                    candidates.length,

                locationSource:
                    "gps",

                radiusMeters:
                    safeRadius,
            },
        });
    } catch (
        error
    ) {
        console.error(
            "[Food Recommendations] Search failed:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    error instanceof
                    Error
                        ? error.message
                        : "Unable to search for food.",
            },
            {
                status: 500,
            },
        );
    }
}