import type { RealPlaceResult } from "../types";

interface GeoapifyPlace {
    place_id?: string;

    name?: string;

    formatted?: string;

    lat?: number;

    lon?: number;

    address_line1?: string;

    address_line2?: string;

    categories?: string[];

    website?: string;

    contact?: {
        phone?: string;
    };

    datasource?: {
        raw?: {
            name?: string;
            phone?: string;
            website?: string;
        };
    };
}

function getCategory(
    categories: string[] = [],
): string {
    const normalized =
        categories.map((category) =>
            category.toLowerCase(),
        );

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
                    "catering.food",
                ),
        )
    ) {
        return "restaurant";
    }

    if (
        normalized.some(
            (category) =>
                category.includes(
                    "catering.cafe",
                ) ||
                category.includes(
                    "catering.coffee",
                ),
        )
    ) {
        return "cafe";
    }

    if (
        normalized.some(
            (category) =>
                category.includes(
                    "tourism.sights",
                ) ||
                category.includes(
                    "tourism.attraction",
                )
        )
    ) {
        return "attraction";
    }

    if (
        normalized.some(
            (category) =>
                category.includes("tourism") ||
                category.includes("museum"),
        )
    ) {
        return "museum";
    }

    if (
        normalized.some(
            (category) =>
                category.includes("leisure.park"),
        )
    ) {
        return "park";
    }

    if (
        normalized.some(
            (category) =>
                category.includes("beach"),
        )
    ) {
        return "beach";
    }

    if (
        normalized.some(
            (category) =>
                category.includes(
                    "accommodation",
                ),
        )
    ) {
        return "hotel";
    }

    if (
        normalized.some(
            (category) =>
                category.includes("commercial") ||
                category.includes("shop"),
        )
    ) {
        return "market";
    }

    if (
        normalized.some(
            (category) =>
                category.includes(
                    "religion",
                ),
        )
    ) {
        return "place_of_worship";
    }

    return (
        categories[0] ??
        "place"
    );
}

export function normalizeGeoapifyPlace(
    place: GeoapifyPlace,
): RealPlaceResult | null {
    if (
        typeof place.lat !== "number" ||
        typeof place.lon !== "number"
    ) {
        return null;
    }

    const name =
        place.name?.trim();

    if (!name) {
        return null;
    }

    const address = place.formatted ?? ([place.address_line1, place.address_line2,].filter(Boolean).join(", ") || undefined );

    const phone =
        place.contact?.phone ??
        place.datasource?.raw?.phone;

    const website =
        place.website ??
        place.datasource?.raw?.website;

    return {
        id:
            place.place_id ??
            `geoapify-${place.lat}-${place.lon}`,

        name,

        category:
            getCategory(
                place.categories,
            ),

        address,

        latitude:
            place.lat,

        longitude:
            place.lon,

        phone,

        website,

        openingHours:
            undefined,

        rating:
            undefined,

        reviewCount:
            undefined,

        priceLevel:
            undefined,

        mapUrl:
            `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=18/${place.lat}/${place.lon}`,

        source:
            "Geoapify",

        lastUpdated:
            new Date().toISOString(),
    };
}