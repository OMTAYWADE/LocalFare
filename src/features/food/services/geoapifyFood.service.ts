import { getGeoapifyApiKey } from "@/lib/geoapify/server";
import type { FoodCuisine, FoodDiet, FoodItem, MealType, PriceRange, SpiceLevel } from "../types/food.types";

interface GeoapifyFeature {
    properties?: {
        place_id?: string;

        name?: string;

        formatted?: string;

        address_line1?: string;

        address_line2?: string;

        city?: string;

        state?: string;

        country?: string;

        lat?: number;

        lon?: number;

        distance?: number;

        categories?: string[];

        website?: string;

        contact?: {
            phone?: string;
        };
    };

    geometry?: {
        coordinates?: [
            number,
            number,
        ];
    };
}

interface GeoapifyResponse {
    features?: GeoapifyFeature[];
}

export interface RealFoodSearchOptions {
    latitude: number;

    longitude: number;

    radiusMeters?: number;

    vegetarian?: boolean;

    vegan?: boolean;

    query?: string;
}

function getCuisine(
    categories: string[],
    name: string,
): FoodCuisine[] {
    const text =
        `${categories.join(" ")} ${name}`
            .toLowerCase();

    const result:
        FoodCuisine[] = [];

    if (
        text.includes("maharashtra") ||
        text.includes("marathi") ||
        text.includes("misal") ||
        text.includes("vada")
    ) {
        result.push(
            "maharashtrian",
        );
    }

    if (
        text.includes("south") ||
        text.includes("dosa") ||
        text.includes("idli")
    ) {
        result.push(
            "south-indian",
        );
    }

    if (
        text.includes("north") ||
        text.includes("punjabi") ||
        text.includes("mughlai")
    ) {
        result.push(
            "north-indian",
        );
    }

    if (
        text.includes("chinese")
    ) {
        result.push(
            "chinese",
        );
    }

    if (
        text.includes("dessert") ||
        text.includes("sweet")
    ) {
        result.push(
            "dessert",
        );
    }

    if (
        text.includes("cafe") ||
        text.includes("coffee")
    ) {
        result.push(
            "beverage",
        );
    }

    if (
        text.includes("street") ||
        text.includes("fast_food")
    ) {
        result.push(
            "street-food",
        );
    }

    if (
        text.includes("indian") ||
        text.includes("restaurant")
    ) {
        result.push(
            "indian",
        );
    }

    if (
        result.length === 0
    ) {
        result.push(
            "indian",
        );
    }

    return [
        ...new Set(result),
    ];
}

function getDiet(
    name: string,
): FoodDiet | undefined {
    const value =
        name.toLowerCase();

    if (
        value.includes("vegan")
    ) {
        return "vegan";
    }

    if (
        value.includes("vegetarian")
    ) {
        return "vegetarian";
    }

    /*
     * Do NOT infer non-veg from an
     * ordinary restaurant name.
     */
    return undefined;
}

function getSpiceLevel(
    name: string,
): SpiceLevel {
    const value =
        name.toLowerCase();

    if (
        value.includes("spicy") ||
        value.includes("chilli") ||
        value.includes("chili")
    ) {
        return "hot";
    }

    return "medium";
}

function getMealTypes(
    name: string,
): MealType[] {
    const value =
        name.toLowerCase();

    if (
        value.includes("cafe") ||
        value.includes("bakery")
    ) {
        return [
            "breakfast",
            "snack",
            "lunch",
        ];
    }

    return [
        "breakfast",
        "lunch",
        "snack",
        "dinner",
        "late-night",
    ];
}

// ... (keep GeoapifyFeature, GeoapifyResponse, RealFoodSearchOptions interfaces exactly as before)

// ... (keep getCuisine, getDiet, getSpiceLevel, getMealTypes, buildMapUrl exactly as before)

/**
 * Estimates a price range from Geoapify's category tags.
 *
 * IMPORTANT: This is an inference, not a real menu price. Geoapify
 * does not provide pricing data. Categories like "fast_food" tend
 * to be cheaper than "restaurant" or venues tagged "fine_dining"/
 * "bar", so this gives a rough, honestly-labeled estimate rather
 * than fabricating an exact number.
 */
function getEstimatedPriceRange(categories: string[]): PriceRange {
    const text = categories.join(" ").toLowerCase();

    if (
        text.includes("fine_dining") ||
        text.includes("bar") ||
        text.includes("pub") ||
        text.includes("nightclub")
    ) {
        return "₹₹₹";
    }

    if (text.includes("fast_food") || text.includes("street") || text.includes("bakery")) {
        return "₹";
    }

    // Default: ordinary sit-down restaurant/cafe
    return "₹₹";
}

function buildMapUrl(latitude: number, longitude: number): string {
    return (
        "https://www.openstreetmap.org/" +
        `?mlat=${latitude}` +
        `&mlon=${longitude}` +
        `#map=18/${latitude}/${longitude}`
    );
}

export async function searchRealFood(options: RealFoodSearchOptions): Promise<FoodItem[]> {
    const {
        latitude,
        longitude,
        radiusMeters = 5000,
        vegetarian = false,
        vegan = false,
        query,
    } = options;

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        throw new Error("Valid latitude and longitude are required.");
    }

    const apiKey = getGeoapifyApiKey();
    const params = new URLSearchParams();

    params.set("apiKey", apiKey);
    params.set("categories", ["catering.restaurant", "catering.fast_food", "catering.cafe"].join(","));
    params.set("limit", "20");
    params.set("lang", "en");
    params.set("filter", `circle:${longitude},${latitude},${radiusMeters}`);
    params.set("bias", `proximity:${longitude},${latitude}`);

    if (query?.trim()) {
        params.set("name", query.trim());
    }

    if (vegan) {
        params.set("conditions", "vegan");
    } else if (vegetarian) {
        params.set("conditions", "vegetarian");
    }

    const response = await fetch(`https://api.geoapify.com/v2/places?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Geoapify food search failed (${response.status}): ${text}`);
    }

    const data = (await response.json()) as GeoapifyResponse;

    return (data.features ?? [])
        .map((feature): FoodItem | null => {
            const properties = feature.properties;

            if (!properties) return null;

            const coordinates = feature.geometry?.coordinates;
            const placeLongitude = coordinates?.[0] ?? properties.lon;
            const placeLatitude = coordinates?.[1] ?? properties.lat;

            if (
                typeof placeLatitude !== "number" ||
                typeof placeLongitude !== "number" ||
                !Number.isFinite(placeLatitude) ||
                !Number.isFinite(placeLongitude)
            ) {
                return null;
            }

            const restaurantName = properties.name?.trim();

            if (!restaurantName) return null;

            const categories = properties.categories ?? [];

            const distanceKm =
                typeof properties.distance === "number"
                    ? Math.round((properties.distance / 1000) * 10) / 10
                    : undefined;

            const address =
                properties.formatted ??
                [properties.address_line1, properties.address_line2].filter(Boolean).join(", ");

            const cuisine = getCuisine(categories, restaurantName);

            return {
                id: properties.place_id ?? `geo-food-${placeLatitude}-${placeLongitude}`,
                name: restaurantName,
                description: address || "Food place near you.",
                cuisine,
                diet: getDiet(restaurantName),
                spiceLevel: getSpiceLevel(restaurantName),
                mealTypes: getMealTypes(restaurantName),
                priceRange: getEstimatedPriceRange(categories),
                priceRangeEstimated: true,
                latitude: placeLatitude,
                longitude: placeLongitude,
                distanceKm,
                restaurantId: properties.place_id,
                restaurantName,
                website: properties.website,
                phone: properties.contact?.phone,
                mapUrl: buildMapUrl(placeLatitude, placeLongitude),
                tags: categories,
            };
        })
        .filter((food): food is FoodItem => food !== null);
}