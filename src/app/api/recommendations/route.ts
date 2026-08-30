import {
    NextResponse,
} from "next/server";

import {
    enrichRecognizedFood,
} from "@/features/food/services/foodEnrichment.service";

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

function getCurrentMeal(): MealType {
    const hour =
        new Date().getHours();

    if (hour >= 5 && hour < 11) {
        return "breakfast";
    }

    if (hour >= 11 && hour < 16) {
        return "lunch";
    }

    if (hour >= 16 && hour < 19) {
        return "snack";
    }

    if (hour >= 19 && hour < 23) {
        return "dinner";
    }

    return "late-night";
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
            searchParams
                .get("items")
                ?.split(",")
                .map((item) =>
                    decodeURIComponent(
                        item,
                    ).trim(),
                )
                .filter(Boolean) ?? [];

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
                ) ?? "5000",
            );

        if (
            items.length === 0
        ) {
            return NextResponse.json(
                {
                    error:
                        "At least one recognized food item is required.",
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

        /*
         * 1. Enrich recognized food.
         *
         * Example:
         *
         * "Vada Pav"
         *
         * ->
         *
         * image
         * description
         * cuisine
         * diet
         */
        const enrichedFoods =
            await Promise.all(
                items
                    .slice(0, 5)
                    .map(
                        (item) =>
                            enrichRecognizedFood(
                                item,
                            ),
                    ),
            );

        /*
         * 2. Search real nearby restaurants.
         *
         * Do NOT use the food name as a
         * guaranteed restaurant menu match.
         */
        const nearbyPlaces =
            await searchRealFood({
                latitude,
                longitude,
                radiusMeters:
                    Number.isFinite(
                        radius,
                    )
                        ? Math.min(
                              Math.max(
                                  radius,
                                  500,
                              ),
                              10000,
                          )
                        : 5000,
                vegetarian,
            });

        /*
         * 3. Build recommendation candidates.
         *
         * Every candidate represents:
         *
         * recognized food
         * +
         * real nearby place
         */
        const candidates: FoodItem[] =
            [];

        for (const recognizedFood of enrichedFoods) {
    for (const place of nearbyPlaces) {
        candidates.push({
            ...recognizedFood,
            name: recognizedFood.name,
            restaurantId: place.restaurantId,
            restaurantName: place.restaurantName,
            latitude: place.latitude,
            longitude: place.longitude,
            distanceKm: place.distanceKm,
            website: place.website,
            phone: place.phone,
            mapUrl: place.mapUrl,
            priceRange: place.priceRange,
            priceRangeEstimated: place.priceRangeEstimated,
            tags: [...(recognizedFood.tags ?? []), "nearby", "geoapify"],
            cuisine: recognizedFood.cuisine.length > 0 ? recognizedFood.cuisine : place.cuisine,
            mealTypes: recognizedFood.mealTypes.length > 0 ? recognizedFood.mealTypes : place.mealTypes,
        });
    }
}

        /*
         * 4. Rank.
         */
        const recommendations =
            getFoodRecommendations(
                candidates.map(
                    (food) => ({
                        food,

                        preferredFood:
                            food.name,

                        vegetarian,

                        currentMeal:
                            getCurrentMeal(),

                        maxDistanceKm:
                            radius /
                            1000,
                    }),
                ),
            );

        /*
         * 5. Remove duplicate
         * restaurant + food pairs.
         */
        const unique =
            new Map<
                string,
                (typeof recommendations)[number]
            >();

        for (
            const recommendation of recommendations
        ) {
            const key =
                `${recommendation.food.name}|${recommendation.food.restaurantId}`;

            if (
                !unique.has(key)
            ) {
                unique.set(
                    key,
                    recommendation,
                );
            }
        }

        return NextResponse.json({
            detectedFoods:
                enrichedFoods,

            currentMeal:
                getCurrentMeal(),

            recommendations:
                Array.from(
                    unique.values(),
                ).slice(0, 20),

            metadata: {
                source:
                    "Food enrichment + Geoapify Places",

                retrievedAt:
                    new Date().toISOString(),

                nearbyPlaceCount:
                    nearbyPlaces.length,
            },
        });
    } catch (error) {
        console.error(
            "Food recommendation API failed:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Unable to generate food recommendations.",
            },
            {
                status: 500,
            },
        );
    }
}