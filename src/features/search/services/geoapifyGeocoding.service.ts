import type { RealPlaceResult } from "../types";
import type { GeoapifyPlaceResult } from "../services/geoapifyPlaces.service";
import { getGeoapifyApiKey } from "@/lib/geoapify/server";
import type { LocationSearchResult } from "@/features/location/types";

interface GeoapifyGeocodeFeature {
    properties?: {
        place_id?: string;
        formatted?: string;
        name?: string;
        city?: string;
        state?: string;
        country?: string;
        lat?: number;
        lon?: number;
    };
    geometry?: {
        coordinates?: [number, number];
    };
}

interface GeoapifyGeocodeResponse {
    features?: GeoapifyGeocodeFeature[];
}

/**
 * Searches for a location by free-text query using Geoapify's
 * Geocoding Autocomplete API. Used for "starting location" /
 * "destination" text inputs, distinct from Places (which needs
 * coordinates already).
 */
export async function searchGeoapifyLocation(
    query: string,
): Promise<LocationSearchResult[]> {
    const trimmed = query.trim();

    if (!trimmed) {
        return [];
    }

    const apiKey = getGeoapifyApiKey();

    const url = new URL(
        "https://api.geoapify.com/v1/geocode/autocomplete",
    );

    url.searchParams.set("text", trimmed);
    url.searchParams.set("apiKey", apiKey);
    url.searchParams.set("limit", "5");
    url.searchParams.set("format", "geojson");

    const response = await fetch(url.toString(), {
        method: "GET",
        cache: "no-store",
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Geoapify geocoding request failed (${response.status}): ${errorText}`,
        );
    }

    const data = (await response.json()) as GeoapifyGeocodeResponse;

    const results = (data.features ?? [])
        .map((feature): LocationSearchResult | null => {
            const properties = feature.properties;
            const coordinates = feature.geometry?.coordinates;

            const longitude = coordinates?.[0] ?? properties?.lon;
            const latitude = coordinates?.[1] ?? properties?.lat;

            if (
                typeof latitude !== "number" ||
                typeof longitude !== "number" ||
                !Number.isFinite(latitude) ||
                !Number.isFinite(longitude)
            ) {
                return null;
            }

            const name =
                properties?.name?.trim() ||
                properties?.formatted?.trim() ||
                properties?.city?.trim();

            const address = properties?.formatted?.trim();

            if (!name && !address) {
                return null;
            }

            return {
                placeId:
                    properties?.place_id ??
                    `geoapify-geocode-${latitude}-${longitude}`,
                displayName: name ?? address ?? "Unknown location",
                address: address ?? name ?? "",
                latitude: latitude,
                longitude: longitude
            };
        })
        .filter(
            (result): result is LocationSearchResult => result !== null,
        );

    return results;
}

function getCategory(categories: string[] = []): string {
    const normalized = categories.map((category) => category.toLowerCase());

    if (
        normalized.some(
            (category) =>
                category.includes("catering.restaurant") ||
                category.includes("catering.fast_food") ||
                category.includes("catering.food"),
        )
    ) {
        return "restaurant";
    }

    if (
        normalized.some(
            (category) =>
                category.includes("catering.cafe") ||
                category.includes("catering.coffee"),
        )
    ) {
        return "cafe";
    }

    if (
        normalized.some(
            (category) =>
                category.includes("tourism.sights") ||
                category.includes("tourism.attraction"),
        )
    ) {
        return "attraction";
    }

    if (
        normalized.some(
            (category) => category.includes("tourism") || category.includes("museum"),
        )
    ) {
        return "museum";
    }

    if (normalized.some((category) => category.includes("leisure.park"))) {
        return "park";
    }

    if (normalized.some((category) => category.includes("beach"))) {
        return "beach";
    }

    if (normalized.some((category) => category.includes("accommodation"))) {
        return "hotel";
    }

    if (
        normalized.some(
            (category) => category.includes("commercial") || category.includes("shop"),
        )
    ) {
        return "market";
    }

    if (normalized.some((category) => category.includes("religion"))) {
        return "place_of_worship";
    }

    return categories[0] ?? "place";
}

export function normalizeGeoapifyPlace(
    place: GeoapifyPlaceResult,
): RealPlaceResult | null {
    if (
        typeof place.latitude !== "number" ||
        typeof place.longitude !== "number" ||
        !Number.isFinite(place.latitude) ||
        !Number.isFinite(place.longitude)
    ) {
        return null;
    }

    const name = place.name?.trim();

    if (!name) {
        return null;
    }

    const address =
        place.formatted ??
        ([place.addressLine1, place.addressLine2].filter(Boolean).join(", ") ||
            undefined);

    return {
        id: place.placeId ?? `geoapify-${place.latitude}-${place.longitude}`,
        name,
        category: getCategory(place.categories),
        address,
        latitude: place.latitude,
        longitude: place.longitude,
        phone: place.phone,
        website: place.website,
        openingHours: undefined,
        rating: undefined,
        reviewCount: undefined,
        priceLevel: undefined,
        mapUrl: `https://www.openstreetmap.org/?mlat=${place.latitude}&mlon=${place.longitude}#map=18/${place.latitude}/${place.longitude}`,
        source: "Geoapify",
        lastUpdated: new Date().toISOString(),
    };
}