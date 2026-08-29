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
    type?: "Feature";

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
        type?: string;
        coordinates?: [number, number];
    };
}

interface GeoapifyPlacesResponse {
    type?: "FeatureCollection";
    features?: GeoapifyFeature[];
}

/**
 * Search nearby real-world places using Geoapify Places API.
 *
 * NOTE: Geoapify's /v2/places endpoint requires at least one of
 * `filter` or `bias` to be present, so `latitude`/`longitude` are
 * effectively required here — pass them, or use a geocoding/
 * autocomplete endpoint instead if you need location-less search.
 */
export async function searchPlaces(
    query: string,
    latitude?: number,
    longitude?: number,
    radiusMeters = 25000,
): Promise<GeoapifyPlaceResult[]> {
    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
    ) {
        throw new Error(
            "searchPlaces requires a valid latitude and longitude " +
            "(Geoapify's Places API requires a filter or bias parameter).",
        );
    }

    const apiKey = getGeoapifyApiKey();

    const categories = getCategoriesFromQuery(query);

    const params = new URLSearchParams();

    params.set("apiKey", apiKey);
    params.set("categories", categories.join(","));
    params.set("limit", "20");
    params.set("lang", "en");

    /*
     * Geoapify uses:
     *   longitude,latitude
     * NOT:
     *   latitude,longitude
     */
    params.set(
        "filter",
        `circle:${longitude},${latitude},${radiusMeters}`,
    );

    params.set(
        "bias",
        `proximity:${longitude},${latitude}`,
    );

    const url = `https://api.geoapify.com/v2/places?${params.toString()}`;

    const response = await fetch(url, {
        method: "GET",
        cache: "no-store",
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Geoapify Places request failed (${response.status}): ${errorText}`,
        );
    }

    const data = (await response.json()) as GeoapifyPlacesResponse;

    const results = (data.features ?? [])
        .map((feature) => {
            const properties = feature.properties;

            if (!properties) {
                return null;
            }

            /*
             * Coordinates can come from geometry.coordinates
             * ([longitude, latitude]) or from properties.lat/lon.
             */
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

            const name =
                properties.name?.trim() ||
                properties.address_line1?.trim() ||
                properties.formatted?.trim();

            if (!name) {
                return null;
            }

            const result: GeoapifyPlaceResult = {
                placeId: properties.place_id,
                name,
                formatted: properties.formatted,
                addressLine1: properties.address_line1,
                addressLine2: properties.address_line2,
                city: properties.city,
                state: properties.state,
                country: properties.country,
                latitude: placeLatitude,
                longitude: placeLongitude,
                distance: properties.distance,
                categories: properties.categories ?? [],
                website: properties.website,
                phone: properties.contact?.phone,
            };

            return result;
        })
        .filter((place): place is GeoapifyPlaceResult => place !== null);

    return results;
}

/**
 * Convert LocalFare search terms into Geoapify categories.
 *
 * NOTE: Geoapify's /v2/places endpoint filters by category, not
 * free text — it does not natively support name-based search (e.g.
 * "Starbucks"). Queries that don't match a known keyword fall back
 * to a broad default category set, and any name-specific matching
 * (e.g. filtering results whose `name` contains the query) needs to
 * happen as a post-processing step on the returned results.
 */
function getCategoriesFromQuery(query: string): string[] {
    const normalized = query.toLowerCase().trim();

    if (
        normalized.includes("restaurant") ||
        normalized.includes("food") ||
        normalized.includes("eat") ||
        normalized.includes("dinner") ||
        normalized.includes("lunch") ||
        normalized.includes("breakfast")
    ) {
        return ["catering.restaurant", "catering.fast_food", "catering.food_court"];
    }

    if (
        normalized.includes("cafe") ||
        normalized.includes("coffee") ||
        normalized.includes("tea")
    ) {
        return ["catering.cafe"];
    }

    if (normalized.includes("museum")) {
        return ["entertainment.museum", "tourism.attraction"];
    }

    if (normalized.includes("park") || normalized.includes("garden")) {
        return ["leisure.park"];
    }

    if (
        normalized.includes("hotel") ||
        normalized.includes("stay") ||
        normalized.includes("hostel")
    ) {
        return ["accommodation"];
    }

    if (
        normalized.includes("market") ||
        normalized.includes("shopping") ||
        normalized.includes("mall")
    ) {
        return ["commercial", "commercial.shopping_mall"];
    }

    if (
        normalized.includes("temple") ||
        normalized.includes("mosque") ||
        normalized.includes("church") ||
        normalized.includes("mandir")
    ) {
        return ["religion.place_of_worship"];
    }

    if (
        normalized.includes("tourist") ||
        normalized.includes("attraction") ||
        normalized.includes("places") ||
        normalized.includes("visit") ||
        normalized.includes("destination") ||
        normalized.includes("landmark")
    ) {
        return [
            "tourism.attraction",
            "tourism.sights",
            "entertainment.museum",
            "entertainment.culture",
            "leisure.park",
        ];
    }

    return [
        "tourism.attraction",
        "tourism.sights",
        "entertainment.culture",
        "leisure.park",
        "catering.restaurant",
        "catering.cafe",
        "commercial",
    ];
}