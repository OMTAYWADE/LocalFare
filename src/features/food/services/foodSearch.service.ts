import { searchPlaces } from "@/features/search/services/geoapifyPlaces.service";
import type { FoodItem } from "../types/food.types";

export interface FoodSearchOptions {
    query?: string;
    latitude: number;
    longitude: number;
    radiusMeters?: number;
    maxPriceInr?: number; // kept for API compatibility; cannot be enforced (see note)
    mealType?: FoodItem["mealTypes"][number]; // cannot be enforced (see note)
    vegetarian?: boolean; // cannot be enforced (see note)
    spiceLevel?: FoodItem["spiceLevel"]; // cannot be enforced (see note)
}

/**
 * Searches real restaurants/cafes near a location using Geoapify.
 *
 * IMPORTANT LIMITATION:
 * Geoapify Places does not return dish-level data — no diet type,
 * spice level, or price. Those fields are placeholders below, not
 * real values, until a dish-level data source is layered on top.
 */
export async function searchFood({
    query,
    latitude,
    longitude,
    radiusMeters = 5000,
}: FoodSearchOptions): Promise<FoodItem[]> {
    const places = await searchPlaces(
        query || "restaurant",
        latitude,
        longitude,
        radiusMeters,
    );

    return places
        .filter((place) => place.name)
        .map((place, index): FoodItem => ({
            id: place.placeId ?? `${place.name}-${index}`,
            name: place.name ?? "Unknown restaurant",
            description: place.formatted,
            cuisine: [],
            diet: "non-vegetarian", // unknown from source; see limitation note
            spiceLevel: "medium", // unknown from source; see limitation note
            mealTypes: ["breakfast", "lunch", "snack", "dinner", "late-night"],
            priceInr: 0, // unknown from source; see limitation note
            rating: undefined,
            imageUrl: undefined,
            latitude: place.latitude,
            longitude: place.longitude,
            restaurantName: place.name,
            tags: place.categories,
        }));
}