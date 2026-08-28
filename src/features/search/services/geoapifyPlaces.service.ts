import { getGeoapifyApiKey } from "@/lib/geoapify/server";

export interface GeoapifyPlaceResult {
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

interface GeoapifyFeature {
    type: "Feature";

    properties: {
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
        type: string;

        coordinates?: [
            number,
            number,
        ];
    };
}

interface GeoapifyPlacesResponse {
    type: "FeatureCollection";

    features?: GeoapifyFeature[];
}

/**
 * Search nearby real-world places using Geoapify Places API.
 */
export async function searchPlaces(
    query: string,
    latitude?: number,
    longitude?: number,
    radiusMeters = 5000,
): Promise<GeoapifyPlaceResult[]> {
    const apiKey = getGeoapifyApiKey();

    const params = new URLSearchParams();

    params.set(
        "apiKey",
        apiKey,
    );

    /*
     * Geoapify uses categories for
     * nearby-place discovery.
     */
    params.set(
        "categories",
        getCategoriesFromQuery(query).join(","),
    );

    /*
     * Location filter.
     */
    if (
        latitude !== undefined &&
        longitude !== undefined
    ) {
        params.set(
            "filter",
            `circle:${longitude},${latitude},${radiusMeters}`,
        );

        /*
         * Sort/bias results toward the user.
         */
        params.set(
            "bias",
            `proximity:${longitude},${latitude}`,
        );
    }

    params.set(
        "limit",
        "20",
    );

    params.set(
        "lang",
        "en",
    );

    const response = await fetch(
        `https://api.geoapify.com/v2/places?${params.toString()}`,
        {
            method: "GET",
            cache: "no-store",
        },
    );

    if (!response.ok) {
        const errorText =
            await response.text();

        throw new Error(
            `Geoapify Places request failed (${response.status}): ${errorText}`,
        );
    }

    const data =
        (await response.json()) as GeoapifyPlacesResponse;

    return (
        data.features?.map(
            (feature) => {
                const place =
                    feature.properties;

                return {
                    placeId:
                        place.place_id,

                    name:
                        place.name,

                    formatted:
                        place.formatted,

                    addressLine1:
                        place.address_line1,

                    addressLine2:
                        place.address_line2,

                    city:
                        place.city,

                    state:
                        place.state,

                    country:
                        place.country,

                    latitude:
                        place.lat,

                    longitude:
                        place.lon,

                    distance:
                        place.distance,

                    categories:
                        place.categories ?? [],

                    website:
                        place.website,

                    phone:
                        place.contact?.phone,
                };
            },
        ) ?? []
    );
}

/**
 * Convert LocalFare's natural-language search
 * into Geoapify categories.
 */
function getCategoriesFromQuery(
    query: string,
): string[] {
    const normalized =
        query
            .toLowerCase()
            .trim();

    /*
     * FOOD
     */
    if (
        normalized.includes("restaurant") ||
        normalized.includes("food") ||
        normalized.includes("eat") ||
        normalized.includes("dinner") ||
        normalized.includes("lunch") ||
        normalized.includes("breakfast")
    ) {
        return [
            "catering.restaurant",
            "catering.fast_food",
            "catering.food_court",
        ];
    }

    /*
     * CAFE
     */
    if (
        normalized.includes("cafe") ||
        normalized.includes("coffee") ||
        normalized.includes("tea")
    ) {
        return [
            "catering.cafe",
        ];
    }

    /*
     * TOURIST PLACES
     */
    if (
        normalized.includes("tourist") ||
        normalized.includes("attraction") ||
        normalized.includes("places") ||
        normalized.includes("visit") ||
        normalized.includes("destination") ||
        normalized.includes("landmark")
    ) {
        return [
            "tourism",
            "entertainment",
            "leisure.park",
        ];
    }

    /*
     * MUSEUM
     */
    if (
        normalized.includes("museum")
    ) {
        return [
            "tourism.museum",
        ];
    }

    /*
     * PARK
     */
    if (
        normalized.includes("park") ||
        normalized.includes("garden")
    ) {
        return [
            "leisure.park",
            "leisure.garden",
        ];
    }

    /*
     * HOTEL
     */
    if (
        normalized.includes("hotel") ||
        normalized.includes("stay") ||
        normalized.includes("hostel")
    ) {
        return [
            "accommodation",
        ];
    }

    /*
     * SHOPPING / MARKET
     */
    if (
        normalized.includes("market") ||
        normalized.includes("shopping") ||
        normalized.includes("mall")
    ) {
        return [
            "commercial",
            "commercial.shopping_mall",
        ];
    }

    /*
     * WORSHIP
     */
    if (
        normalized.includes("temple") ||
        normalized.includes("mosque") ||
        normalized.includes("church") ||
        normalized.includes("mandir")
    ) {
        return [
            "religion.place_of_worship",
        ];
    }

    /*
     * DEFAULT
     *
     * Instead of sending arbitrary text to the
     * Places API, use broad categories.
     */
    return [
        "catering",
        "tourism",
        "commercial",
    ];
}