import { searchPlaces } from "@/features/search/services/geoapifyPlaces.service";
import type { FoodItem } from "../types/food.types";

export interface FoodSearchOptions {
    query?: string;
    latitude: number;
    longitude: number;
    radiusMeters?: number;
}

/**
 * Searches real restaurants/cafes near a location using Geoapify.
 *
 * SCOPE:
 * This returns real restaurant/cafe listings — name, location,
 * address, contact info, distance. Geoapify does not provide
 * dish-level data (diet type, spice level, or menu prices), so
 * those fields are intentionally omitted rather than guessed.
 * `mealTypes` defaults to all slots since Geoapify has no concept
 * of meal timing for a restaurant listing.
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
            mealTypes: ["breakfast", "lunch", "snack", "dinner", "late-night"],
            latitude: place.latitude,
            longitude: place.longitude,
            distanceKm:
                typeof place.distance === "number"
                    ? Math.round((place.distance / 1000) * 10) / 10
                    : undefined,
            restaurantName: place.name,
            website: place.website,
            phone: place.phone,
            mapUrl: `https://www.openstreetmap.org/?mlat=${place.latitude}&mlon=${place.longitude}#map=18/${place.latitude}/${place.longitude}`,
            tags: place.categories,
        }));
}