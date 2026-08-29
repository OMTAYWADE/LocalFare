import type { RealPlaceResult } from "../types";

export interface GeoapifyPlaceInput {
    placeId?: string;
    name?: string;
    formatted?: string;

    addressLine1?: string;
    addressLine2?: string;

    city?: string;
    state?: string;
    country?: string;

    latitude?: number;
    longitude?: number;

    distance?: number;

    categories?: string[];

    website?: string;
    phone?: string;
}

/**
 * Convert a Geoapify place returned by
 * geoapifyPlaces.service.ts into LocalFare's
 * RealPlaceResult format.
 */
export function normalizeGeoapifyPlace(
    place: GeoapifyPlaceInput,
): RealPlaceResult | null {

    /*
     * IMPORTANT:
     *
     * geoapifyPlaces.service.ts already converts:
     *
     * lat -> latitude
     * lon -> longitude
     * place_id -> placeId
     *
     * Therefore we MUST use latitude/longitude here.
     */

    if (
        typeof place.latitude !== "number" ||
        typeof place.longitude !== "number"
    ) {
        return null;
    }

    if (
        !Number.isFinite(place.latitude) ||
        !Number.isFinite(place.longitude)
    ) {
        return null;
    }

    const name =
        place.name?.trim() ||
        place.addressLine1?.trim() ||
        place.formatted?.trim();

    if (!name) {
        return null;
    }

    const category = getCategory(
        place.categories ?? [],
    );

    const address =
        place.formatted?.trim() ||
        [
            place.addressLine1,
            place.addressLine2,
            place.city,
            place.state,
            place.country,
        ]
            .filter(
                (value): value is string =>
                    Boolean(value?.trim()),
            )
            .join(", ");

    return {
        id:
            place.placeId ??
            `geoapify-${place.latitude}-${place.longitude}`,

        name,

        category,

        address:
            address || undefined,

        latitude:
            place.latitude,

        longitude:
            place.longitude,

        phone:
            place.phone,

        website:
            place.website,

        openingHours:
            undefined,

        rating:
            undefined,

        reviewCount:
            undefined,

        priceLevel:
            undefined,

        mapUrl:
            `https://www.openstreetmap.org/?mlat=${place.latitude}&mlon=${place.longitude}#map=18/${place.latitude}/${place.longitude}`,

        source:
            "Geoapify",

        lastUpdated:
            new Date().toISOString(),
    };
}

/**
 * Convert Geoapify categories into
 * LocalFare categories.
 */
function getCategory(
    categories: string[] = [],
): string {

    const normalized =
        categories.map(
            (category) =>
                category.toLowerCase(),
        );

    /*
     * RESTAURANT
     */
    if (
        normalized.some(
            (category) =>
                category.includes(
                    "catering.restaurant",
                ) ||
                category.includes(
                    "catering.fast_food",
                ) ||
                category.includes(
                    "catering.food_court",
                ) ||
                category.includes(
                    "catering.food",
                ),
        )
    ) {
        return "restaurant";
    }

    /*
     * CAFE
     */
    if (
        normalized.some(
            (category) =>
                category.includes(
                    "catering.cafe",
                ) ||
                category.includes(
                    "catering.coffee",
                )
        )
    ) {
        return "cafe";
    }

    /*
     * MUSEUM
     */
    if (
        normalized.some(
            (category) =>
                category.includes(
                    "museum",
                ) ||
                category.includes(
                    "entertainment.museum",
                )
        )
    ) {
        return "museum";
    }

    /*
     * TOURIST ATTRACTION
     */
    if (
        normalized.some(
            (category) =>
                category.includes(
                    "tourism.attraction",
                ) ||
                category.includes(
                    "tourism.sights",
                ) ||
                category.includes(
                    "tourism",
                )
        )
    ) {
        return "attraction";
    }

    /*
     * PARK
     */
    if (
        normalized.some(
            (category) =>
                category.includes(
                    "leisure.park",
                ) ||
                category.includes(
                    "leisure.garden",
                )
        )
    ) {
        return "park";
    }

    /*
     * BEACH
     */
    if (
        normalized.some(
            (category) =>
                category.includes("beach"),
        )
    ) {
        return "beach";
    }

    /*
     * HOTEL
     */
    if (
        normalized.some(
            (category) =>
                category.includes(
                    "accommodation",
                )
        )
    ) {
        return "hotel";
    }

    /*
     * SHOP / MARKET
     */
    if (
        normalized.some(
            (category) =>
                category.includes(
                    "commercial",
                ) ||
                category.includes("shop"),
        )
    ) {
        return "market";
    }

    /*
     * RELIGIOUS PLACE
     */
    if (
        normalized.some(
            (category) =>
                category.includes(
                    "religion",
                ) ||
                category.includes(
                    "place_of_worship",
                )
        )
    ) {
        return "place_of_worship";
    }

    /*
     * Fallback
     */
    return (
        categories[0] ??
        "place"
    );
}