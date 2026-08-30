import { getGeoapifyApiKey } from "@/lib/geoapify/server";

interface GeoapifyDetailsFeature {
    properties?: {
        place_id?: string;
        name?: string;
        opening_hours?: string;
        website?: string;
        contact?: {
            phone?: string;
        };
    };
}

interface GeoapifyDetailsResponse {
    features?: GeoapifyDetailsFeature[];
}

export interface FoodPlaceDetails {
    placeId: string;
    openingHours?: string[];
    website?: string;
    phone?: string;
}

/**
 * Fetches richer per-place details (opening hours, contact info)
 * for a specific restaurant/cafe using its Geoapify place_id.
 *
 * The Places search endpoint (geoapifyFood.service.ts) does not
 * return opening hours, so this is a separate, on-demand lookup
 * for when a user views a specific place rather than a search list.
 */
export async function getFoodPlaceDetails(
    placeId: string,
): Promise<FoodPlaceDetails | null> {
    const cleanedId = placeId.trim();

    if (!cleanedId) {
        return null;
    }

    const apiKey = getGeoapifyApiKey();

    const url = new URL("https://api.geoapify.com/v2/place-details");
    url.searchParams.set("id", cleanedId);
    url.searchParams.set("apiKey", apiKey);

    const response = await fetch(url.toString(), {
        method: "GET",
        cache: "no-store",
    });

    if (!response.ok) {
        console.error(
            "Geoapify place details request failed:",
            response.status,
        );
        return null;
    }

    const data = (await response.json()) as GeoapifyDetailsResponse;
    const properties = data.features?.[0]?.properties;

    if (!properties) {
        return null;
    }

    return {
        placeId: properties.place_id ?? cleanedId,
        openingHours: properties.opening_hours
            ? properties.opening_hours.split(";").map((line) => line.trim())
            : undefined,
        website: properties.website,
        phone: properties.contact?.phone,
    };
}