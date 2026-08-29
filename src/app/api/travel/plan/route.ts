import { NextRequest } from "next/server";
import { getGeoapifyApiKey } from "@/lib/geoapify/server";

interface GeoapifyGeocodeResult {
    place_id?: string;
    name?: string;
    formatted?: string;
    lat?: number;
    lon?: number;
    city?: string;
    state?: string;
    country?: string;
    country_code?: string;
    postcode?: string;
}

interface GeoapifyGeocodeResponse {
    results?: GeoapifyGeocodeResult[];
}

interface GeoapifyPlaceFeature {
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
        coordinates?: [number, number];
    };
}

interface GeoapifyPlacesResponse {
    features?: GeoapifyPlaceFeature[];
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        const destination =
            searchParams.get("destination")?.trim() ?? "";

        if (!destination) {
            return Response.json(
                {
                    error: "Destination is required.",
                },
                {
                    status: 400,
                },
            );
        }

        const apiKey = getGeoapifyApiKey();

        /*
         * =========================================================
         * 1. GEOCODE DESTINATION
         * =========================================================
         */

        const geocodeUrl = new URL(
            "https://api.geoapify.com/v1/geocode/search",
        );

        geocodeUrl.searchParams.set(
            "text",
            destination,
        );

        geocodeUrl.searchParams.set(
            "apiKey",
            apiKey,
        );

        geocodeUrl.searchParams.set(
            "format",
            "json",
        );

        geocodeUrl.searchParams.set(
            "limit",
            "1",
        );

        geocodeUrl.searchParams.set(
            "lang",
            "en",
        );

        const geocodeResponse = await fetch(
            geocodeUrl.toString(),
            {
                method: "GET",
                cache: "no-store",
            },
        );

        if (!geocodeResponse.ok) {
            const errorText =
                await geocodeResponse.text();

            console.error(
                "[TravelPlan] Geocoding failed:",
                errorText,
            );

            return Response.json(
                {
                    error:
                        "Unable to find the destination.",
                },
                {
                    status: 502,
                },
            );
        }

        const geocodeData =
            (await geocodeResponse.json()) as GeoapifyGeocodeResponse;

        const location =
            geocodeData.results?.[0];

        if (
            !location ||
            typeof location.lat !== "number" ||
            typeof location.lon !== "number"
        ) {
            return Response.json(
                {
                    error:
                        `Could not find "${destination}".`,
                },
                {
                    status: 404,
                },
            );
        }

        const latitude = location.lat;
        const longitude = location.lon;

        /*
         * =========================================================
         * 2. DESTINATION DETAILS
         * =========================================================
         */

        const destinationDetails = {
            id:
                location.place_id ??
                `geoapify-${latitude}-${longitude}`,

            name:
                location.name ??
                destination,

            address:
                location.formatted ??
                destination,

            latitude,

            longitude,

            city:
                location.city,

            state:
                location.state,

            country:
                location.country,

            countryCode:
                location.country_code,

            postcode:
                location.postcode,

            source: "Geoapify",

            lastUpdated:
                new Date().toISOString(),
        };

        /*
         * =========================================================
         * 3. FIND REAL NEARBY PLACES
         * =========================================================
         *
         * 25 km radius.
         */

        const placesUrl = new URL(
            "https://api.geoapify.com/v2/places",
        );

        placesUrl.searchParams.set(
            "apiKey",
            apiKey,
        );

        placesUrl.searchParams.set(
            "categories",
            [
                "tourism.attraction",
                "tourism.sights",
                "entertainment.culture",
                "entertainment.museum",
                "leisure.park",
                "catering.restaurant",
                "catering.cafe",
            ].join(","),
        );

        placesUrl.searchParams.set(
            "filter",
            `circle:${longitude},${latitude},25000`,
        );

        placesUrl.searchParams.set(
            "bias",
            `proximity:${longitude},${latitude}`,
        );

        placesUrl.searchParams.set(
            "limit",
            "20",
        );

        placesUrl.searchParams.set(
            "lang",
            "en",
        );

        console.log(
            "[TravelPlan] Searching places:",
            destination,
        );

        console.log(
            "[TravelPlan] Coordinates:",
            latitude,
            longitude,
        );

        const placesResponse = await fetch(
            placesUrl.toString(),
            {
                method: "GET",
                cache: "no-store",
            },
        );

        if (!placesResponse.ok) {
            const errorText =
                await placesResponse.text();

            console.error(
                "[TravelPlan] Places failed:",
                errorText,
            );

            return Response.json(
                {
                    error:
                        "Destination found, but nearby places could not be loaded.",
                },
                {
                    status: 502,
                },
            );
        }

        const placesData =
            (await placesResponse.json()) as GeoapifyPlacesResponse;

        /*
         * =========================================================
         * 4. NORMALIZE NEARBY PLACES
         * =========================================================
         */

        const nearbyPlaces =
            (placesData.features ?? [])
                .map((feature) => {
                    const properties =
                        feature.properties;

                    if (!properties) {
                        return null;
                    }

                    const coordinates =
                        feature.geometry?.coordinates;

                    const longitudeValue =
                        coordinates?.[0] ??
                        properties.lon;

                    const latitudeValue =
                        coordinates?.[1] ??
                        properties.lat;

                    if (
                        typeof latitudeValue !==
                            "number" ||
                        typeof longitudeValue !==
                            "number"
                    ) {
                        return null;
                    }

                    const name =
                        properties.name?.trim();

                    if (!name) {
                        return null;
                    }

                    return {
                        id:
                            properties.place_id ??
                            `geoapify-${latitudeValue}-${longitudeValue}`,

                        name,

                        category:
                            getCategory(
                                properties.categories,
                            ),

                        address:
                            properties.formatted ??
                            properties.address_line1,

                        latitude:
                            latitudeValue,

                        longitude:
                            longitudeValue,

                        distance:
                            properties.distance,

                        phone:
                            properties.contact?.phone,

                        website:
                            properties.website,

                        categories:
                            properties.categories ??
                            [],

                        source:
                            "Geoapify",

                        mapUrl:
                            `https://www.openstreetmap.org/?mlat=${latitudeValue}&mlon=${longitudeValue}#map=18/${latitudeValue}/${longitudeValue}`,
                    };
                })
                .filter(
                    (
                        place,
                    ): place is NonNullable<typeof place> =>
                        place !== null,
                );

        console.log(
            "[TravelPlan] Geoapify places:",
            nearbyPlaces.length,
        );

        /*
         * =========================================================
         * 5. RETURN REAL DATA
         * =========================================================
         */

        return Response.json({
            destination: destinationDetails,

            expenses: [],

            travelOptions: [],

            foodRecommendations:
                nearbyPlaces
                    .filter(
                        (place) =>
                            place.category ===
                                "restaurant" ||
                            place.category ===
                                "cafe",
                    )
                    .slice(0, 10)
                    .map((place) => ({
                        id: place.id,

                        name: place.name,

                        category:
                            place.category,

                        address:
                            place.address,

                        latitude:
                            place.latitude,

                        longitude:
                            place.longitude,

                        phone:
                            place.phone,

                        website:
                            place.website,

                        estimatedCost:
                            undefined,
                    })),

            nearbyDestinations:
                nearbyPlaces
                    .filter(
                        (place) =>
                            place.category !==
                                "restaurant" &&
                            place.category !==
                                "cafe",
                    )
                    .slice(0, 10)
                    .map((place) => ({
                        id: place.id,

                        name: place.name,

                        category:
                            place.category,

                        address:
                            place.address,

                        latitude:
                            place.latitude,

                        longitude:
                            place.longitude,

                        distance:
                            place.distance,

                        mapUrl:
                            place.mapUrl,

                        source:
                            place.source,
                    })),
        });
    } catch (error) {
        console.error(
            "[TravelPlan] Failed:",
            error,
        );

        return Response.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to load travel plan.",
            },
            {
                status: 500,
            },
        );
    }
}

/*
 * =========================================================
 * CATEGORY
 * =========================================================
 */

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
                ),
        )
    ) {
        return "attraction";
    }

    if (
        normalized.some(
            (category) =>
                category.includes(
                    "museum",
                ),
        )
    ) {
        return "museum";
    }

    if (
        normalized.some(
            (category) =>
                category.includes(
                    "leisure.park",
                ),
        )
    ) {
        return "park";
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
                category.includes(
                    "commercial",
                ) ||
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

    return categories[0] ?? "place";
}