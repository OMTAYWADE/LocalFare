import { NextResponse } from "next/server";
import { enrichRecognizedFood } from "@/features/food/services/foodEnrichment.service";
import { searchRealFood } from "@/features/food/services/geoapifyFood.service";
import { getFoodRecommendations } from "@/features/food/services/foodRecommendation.service";
import type { FoodItem, MealType } from "@/features/food/types/food.types";

function getCurrentMeal(): MealType {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 11) return "breakfast";
    if (hour >= 11 && hour < 16) return "lunch";
    if (hour >= 16 && hour < 19) return "snack";
    if (hour >= 19 && hour < 23) return "dinner";
    return "late-night";
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const query = searchParams.get("q")?.trim() ?? "";
        const latitude = Number(searchParams.get("latitude"));
        const longitude = Number(searchParams.get("longitude"));
        const vegetarian = searchParams.get("vegetarian") === "true";
        const radius = Number(searchParams.get("radius") ?? "5000");

        if (!query) {
            return NextResponse.json(
                { error: "A search query is required." },
                { status: 400 },
            );
        }

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
            return NextResponse.json(
                { error: "Valid latitude and longitude are required." },
                { status: 400 },
            );
        }

        const safeRadius = Number.isFinite(radius)
            ? Math.min(Math.max(radius, 500), 10000)
            : 5000;

        /*
         * 1. Enrich the searched food name — description + real
         *    image, same as the scan flow (Wikipedia + Wikimedia).
         */
        const enrichedFood = await enrichRecognizedFood(query);

        /*
         * 2. Search real nearby restaurants.
         */
        const nearbyPlaces = await searchRealFood({
            latitude,
            longitude,
            radiusMeters: safeRadius,
            vegetarian,
        });

        /*
         * 3. Build candidates: searched food + each real nearby place.
         */
        const candidates: FoodItem[] = nearbyPlaces.map((place) => ({
            ...enrichedFood,
            name: enrichedFood.name,
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
            tags: [...(enrichedFood.tags ?? []), "search", "geoapify"],
            cuisine: enrichedFood.cuisine.length > 0 ? enrichedFood.cuisine : place.cuisine,
            mealTypes: enrichedFood.mealTypes.length > 0 ? enrichedFood.mealTypes : place.mealTypes,
        }));

        /*
         * 4. Rank.
         */
        const recommendations = getFoodRecommendations(
            candidates.map((food) => ({
                food,
                preferredFood: query,
                vegetarian,
                currentMeal: getCurrentMeal(),
                maxDistanceKm: safeRadius / 1000,
            })),
        );

        /*
         * 5. Remove duplicate restaurant matches.
         */
        const unique = new Map<string, (typeof recommendations)[number]>();

        for (const recommendation of recommendations) {
            const key = `${recommendation.food.name}|${recommendation.food.restaurantId}`;
            if (!unique.has(key)) {
                unique.set(key, recommendation);
            }
        }

        return NextResponse.json({
            query,
            currentMeal: getCurrentMeal(),
            recommendations: Array.from(unique.values()).slice(0, 20),
            metadata: {
                source: "Food enrichment + Geoapify Places",
                retrievedAt: new Date().toISOString(),
                nearbyPlaceCount: nearbyPlaces.length,
            },
        });
    } catch (error) {
        console.error("Food search API failed:", error);

        return NextResponse.json(
            { error: "Unable to search for food." },
            { status: 500 },
        );
    }
}