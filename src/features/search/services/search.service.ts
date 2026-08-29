import { understandQuery } from "./queryUnderstanding.service";
import { geocodePlace } from "./nominatim.service";
import { searchPlaces } from "./geoapifyPlaces.service";
import { findPlaceImage } from "./placeImage.service";
import { normalizeGeoapifyPlace } from "../utils/normalizeGeoapifyPlace";
import { calculateStraightLineDistanceKm } from "../utils/distance";
import type { RealPlaceResult, SearchIntent, SearchResponse, } from "../types";

/* =========================================================
   MAIN SEARCH
   ========================================================= */

export async function searchLocalFare(
    originalQuery: string,
    sourceLocation?: {
        latitude: number;
        longitude: number;
    },
    intent: SearchIntent = "unknown",
): Promise<SearchResponse> {
    /*
     * -----------------------------------------------------
     * 1. UNDERSTAND USER QUERY
     * -----------------------------------------------------
     */

    const parsed =
        understandQuery(originalQuery);

    const effectiveIntent =
        intent !== "unknown"
            ? intent
            : parsed.intent;

    const effectiveParsed = {
        ...parsed,
        intent: effectiveIntent,
    };

    /*
     * -----------------------------------------------------
     * 2. FIND STARTING LOCATION
     * -----------------------------------------------------
     */

    const locationQuery =
        extractLocationQuery(
            parsed.normalizedQuery,
        );

    let latitude: number;
    let longitude: number;
    let displayName: string;

    /*
     * User already selected a location
     */
    if (sourceLocation) {
        latitude =
            sourceLocation.latitude;

        longitude =
            sourceLocation.longitude;

        displayName =
            "Selected starting location";
    } else {
        /*
         * Search the location using geocoding.
         */
        const location =
            await geocodePlace(
                locationQuery,
            );

        if (!location) {
            return {
                query: {
                    ...effectiveParsed,
                    location: {
                        type: "unknown",
                        value: locationQuery,
                    },
                },

                results: [],

                metadata: {
                    source:
                        "Geoapify Places",
                    retrievedAt:
                        new Date().toISOString(),
                    resultCount: 0,
                },
            };
        }

        latitude =
            Number(location.lat);

        longitude =
            Number(location.lon);

        displayName =
            location.display_name;
    }

    /*
     * Make sure coordinates are valid.
     */
    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
    ) {
        return {
            query: effectiveParsed,
            results: [],

            metadata: {
                source:
                    "Geoapify Places",
                retrievedAt:
                    new Date().toISOString(),
                resultCount: 0,
            },
        };
    }

    /*
     * -----------------------------------------------------
     * 3. BUILD SEARCH TERM
     * -----------------------------------------------------
     */

    const searchTerm =
        getSearchTerm(
            effectiveParsed,
        );

    /*
     * -----------------------------------------------------
     * 4. SEARCH REAL PLACES
     * -----------------------------------------------------
     *
     * Geoapify returns real places around the coordinates.
     */

    let geoapifyResults;

    try {
        geoapifyResults =
            await searchPlaces(
                searchTerm,
                latitude,
                longitude,
                getSearchRadius(
                    effectiveIntent,
                ),
            );
    } catch (error) {
        console.error(
            "Geoapify Places search failed:",
            error,
        );

        return {
            query: {
                ...effectiveParsed,

                location: {
                    type: "place",
                    value: displayName,
                    latitude,
                    longitude,
                },
            },

            results: [],

            searchLocation: {
                latitude,
                longitude,
                displayName,
            },

            metadata: {
                source:
                    "Geoapify Places",
                retrievedAt:
                    new Date().toISOString(),
                resultCount: 0,
            },
        };
    }

    /*
     * -----------------------------------------------------
     * 5. NORMALIZE RESULTS
     * -----------------------------------------------------
     */

    let places =
        geoapifyResults
            .map(normalizeGeoapifyPlace)
            .filter(
                (
                    place,
                ): place is RealPlaceResult =>
                    place !== null,
            );

    /*
     * -----------------------------------------------------
     * 6. REMOVE DUPLICATES
     * -----------------------------------------------------
     */

    places =
        removeDuplicatePlaces(
            places,
        );

    /*
     * -----------------------------------------------------
     * 7. DESTINATION FILTER
     * -----------------------------------------------------
     *
     * If the user asks:
     *
     * "places to visit near CSMT"
     *
     * restaurants, hotels, shops etc.
     * should not dominate the result.
     */

    if (
        effectiveIntent ===
        "destination_recommendation"
    ) {
        places =
            filterDestinationPlaces(
                places,
            );
    }

    /*
     * -----------------------------------------------------
     * 8. DISTANCE
     * -----------------------------------------------------
     */

    places =
        enrichDistances(
            places,
            {
                latitude,
                longitude,
            },
        );

    /*
     * -----------------------------------------------------
     * 9. RANK RESULTS
     * -----------------------------------------------------
     */

    const rankedResults =
        rankResults(
            places,
            effectiveParsed,
        );

    /*
     * -----------------------------------------------------
     * 10. LIMIT RESULTS
     * -----------------------------------------------------
     */

    const topResults =
        rankedResults.slice(
            0,
            10,
        );

    /*
     * -----------------------------------------------------
     * 11. ADD IMAGES
     * -----------------------------------------------------
     */

    const resultsWithImages =
        await Promise.all(
            topResults.map(
                async (place) => {
                    try {
                        const image =
                            await findPlaceImage(
                                place.name,
                                place.category,
                            );

                        return {
                            ...place,

                            imageUrl:
                                image?.imageUrl,

                            imageSource:
                                image?.sourceName,

                            imageSourceUrl:
                                image?.sourceUrl,
                        };
                    } catch (error) {
                        console.error(
                            `Image lookup failed for ${place.name}:`,
                            error,
                        );

                        return place;
                    }
                },
            ),
        );

    /*
     * -----------------------------------------------------
     * 12. FINAL RESPONSE
     * -----------------------------------------------------
     */

    return {
        query: {
            ...effectiveParsed,

            location: {
                type: "place",
                value: displayName,
                latitude,
                longitude,
            },
        },

        results:
            resultsWithImages,

        searchLocation: {
            latitude,
            longitude,
            displayName,
        },

        metadata: {
            source:
                "Geoapify Places + Nominatim",
            retrievedAt:
                new Date().toISOString(),
            resultCount:
                resultsWithImages.length,
        },
    };
}


/* =========================================================
   LOCATION QUERY
   ========================================================= */

function extractLocationQuery(
    query: string,
): string {
    const cleaned =
        query
            .trim();

    /*
     * Example:
     *
     * "restaurants near CSMT"
     *
     * -> "CSMT"
     */

    const nearMatch =
        cleaned.match(
            /\bnear\s+(.+)$/i,
        );

    if (nearMatch?.[1]) {
        return nearMatch[1].trim();
    }

    /*
     * Example:
     *
     * "from CSMT to Gateway of India"
     *
     * -> "CSMT"
     */

    const fromMatch =
        cleaned.match(
            /\bfrom\s+(.+?)\s+to\s+/i,
        );

    if (fromMatch?.[1]) {
        return fromMatch[1].trim();
    }

    /*
     * If no "near" or "from" exists,
     * use the whole query.
     */

    return cleaned;
}


/* =========================================================
   SEARCH TERM
   ========================================================= */

function getSearchTerm(
    parsed: ReturnType<
        typeof understandQuery
    >,
): string {
    /*
     * -----------------------------------------------------
     * FOOD
     * -----------------------------------------------------
     */

    if (
        parsed.intent ===
        "food_search"
    ) {
        const cleaned =
            parsed.normalizedQuery
                .replace(
                    /\b(cheap|cheapest|budget|affordable|spicy|hot|near|me|food|eat|restaurant|restaurants|place|places)\b/gi,
                    "",
                )
                .replace(
                    /\s+/g,
                    " ",
                )
                .trim();

        return (
            cleaned ||
            "restaurant"
        );
    }

    /*
     * -----------------------------------------------------
     * DESTINATIONS
     * -----------------------------------------------------
     */

    if (
        parsed.intent ===
        "destination_recommendation"
    ) {
        return "tourist attractions";
    }

    /*
     * -----------------------------------------------------
     * PLACE SEARCH
     * -----------------------------------------------------
     */

    if (
        parsed.intent ===
        "place_search"
    ) {
        return parsed.normalizedQuery;
    }

    /*
     * -----------------------------------------------------
     * DEFAULT
     * -----------------------------------------------------
     */

    return (
        parsed.normalizedQuery ||
        "places"
    );
}


/* =========================================================
   SEARCH RADIUS
   ========================================================= */

function getSearchRadius(
    intent: SearchIntent,
): number {
    switch (intent) {
        case "destination_recommendation":
            return 10000;

        case "food_search":
            return 5000;

        case "place_search":
            return 5000;

        default:
            return 5000;
    }
}


/* =========================================================
   REMOVE DUPLICATES
   ========================================================= */

function removeDuplicatePlaces(
    places: RealPlaceResult[],
): RealPlaceResult[] {
    const seen =
        new Set<string>();

    return places.filter(
        (place) => {
            const key =
                place.id ||
                `${place.name.toLowerCase()}-${place.latitude}-${place.longitude}`;

            if (seen.has(key)) {
                return false;
            }

            seen.add(key);

            return true;
        },
    );
}


/* =========================================================
   DESTINATION CATEGORIES
   ========================================================= */

const NON_DESTINATION_CATEGORIES =
    new Set([
        "restaurant",
        "cafe",
        "fast_food",
        "bar",
        "pub",

        "hotel",
        "hostel",
        "guest_house",

        "shop",
        "market",
        "supermarket",
        "convenience_store",

        "bank",
        "pharmacy",
        "fuel",
        "gas_station",
        "parking",
        "atm",

        "car_wash",
        "beauty_salon",
        "hair_salon",
        "laundry",
    ]);


const DESTINATION_CATEGORIES =
    new Set([
        "attraction",
        "tourist_attraction",

        "museum",
        "art_gallery",

        "monument",
        "memorial",

        "park",
        "garden",

        "beach",
        "lake",
        "waterfall",

        "zoo",
        "aquarium",

        "amusement_park",
        "theme_park",

        "historical_landmark",
        "historic",

        "place_of_worship",

        "church",
        "mosque",
        "temple",

        "viewpoint",

        "heritage",

        "castle",
        "fort",

        "palace",

        "promenade",
        "waterfront",
    ]);


/* =========================================================
   DESTINATION FILTER
   ========================================================= */

function filterDestinationPlaces(
    places: RealPlaceResult[],
): RealPlaceResult[] {
    return places.filter(
        (place) => {
            const category =
                place.category
                    .toLowerCase()
                    .trim();

            /*
             * Never show obvious business/
             * food places as destinations.
             */

            if (
                NON_DESTINATION_CATEGORIES.has(
                    category,
                )
            ) {
                return false;
            }

            /*
             * Known destination.
             */

            if (
                DESTINATION_CATEGORIES.has(
                    category,
                )
            ) {
                return true;
            }

            /*
             * Fallback for categories that
             * Geoapify may return differently.
             */

            return looksLikeDestination(
                place,
            );
        },
    );
}


/* =========================================================
   DESTINATION KEYWORD FALLBACK
   ========================================================= */

function looksLikeDestination(
    place: RealPlaceResult,
): boolean {
    const text =
        [
            place.name,
            place.category,
            place.address ?? "",
        ]
            .join(" ")
            .toLowerCase();

    const keywords = [
        "gateway",
        "fort",
        "palace",
        "temple",
        "mandir",
        "mosque",
        "church",
        "cathedral",
        "museum",
        "monument",
        "memorial",
        "beach",
        "lake",
        "waterfall",
        "viewpoint",
        "garden",
        "park",
        "heritage",
        "historic",
        "mahal",
        "dargah",
        "shrine",
        "promenade",
        "waterfront",
        "landmark",
        "tourist",
        "attraction",
    ];

    return keywords.some(
        (keyword) =>
            text.includes(keyword),
    );
}


/* =========================================================
   DISTANCE
   ========================================================= */

function enrichDistances(
    places: RealPlaceResult[],
    source: {
        latitude: number;
        longitude: number;
    },
): RealPlaceResult[] {
    return places
        .map(
            (place) => {
                const distanceKm =
                    calculateStraightLineDistanceKm(
                        source.latitude,
                        source.longitude,
                        place.latitude,
                        place.longitude,
                    );

                return {
                    ...place,
                    distanceKm,
                };
            },
        )
        .sort(
            (a, b) =>
                (a.distanceKm ??
                    Infinity) -
                (b.distanceKm ??
                    Infinity),
        );
}


/* =========================================================
   RANKING
   ========================================================= */

function rankResults(
    results: RealPlaceResult[],
    parsed: ReturnType<
        typeof understandQuery
    >,
): RealPlaceResult[] {
    return results
        .map(
            (place) => {
                let score = 0;

                const distance =
                    place.distanceKm ??
                    20;

                /*
                 * -----------------------------------------
                 * DISTANCE
                 * -----------------------------------------
                 */

                if (distance <= 1) {
                    score += 40;
                } else if (
                    distance <= 2
                ) {
                    score += 35;
                } else if (
                    distance <= 5
                ) {
                    score += 25;
                } else if (
                    distance <= 10
                ) {
                    score += 15;
                } else {
                    score += 5;
                }

                /*
                 * -----------------------------------------
                 * RATING
                 * -----------------------------------------
                 */

                if (
                    typeof place.rating ===
                    "number"
                ) {
                    if (
                        parsed.preferences
                            .highlyRated
                    ) {
                        score += Math.min(
                            25,
                            place.rating * 5,
                        );
                    } else {
                        score += Math.min(
                            10,
                            place.rating * 2,
                        );
                    }
                }

                /*
                 * -----------------------------------------
                 * FAMOUS
                 * -----------------------------------------
                 *
                 * Geoapify may not always provide
                 * Google-style review counts.
                 *
                 * When available, use them.
                 */

                if (
                    parsed.preferences
                        .famous
                ) {
                    const reviews =
                        place.reviewCount ??
                        0;

                    if (
                        reviews >= 1000
                    ) {
                        score += 15;
                    } else if (
                        reviews >= 500
                    ) {
                        score += 10;
                    } else if (
                        reviews >= 100
                    ) {
                        score += 5;
                    }
                }

                /*
                 * -----------------------------------------
                 * CHEAP
                 * -----------------------------------------
                 *
                 * Geoapify does not guarantee price
                 * level for every place.
                 */

                if (
                    parsed.pricePreference ===
                    "cheap"
                ) {
                    if (
                        place.priceLevel ===
                            "cheap" ||
                        place.priceLevel ===
                            "inexpensive" ||
                        place.priceLevel ===
                            "free"
                    ) {
                        score += 20;
                    }
                }

                /*
                 * -----------------------------------------
                 * BASE RELEVANCE
                 * -----------------------------------------
                 */

                score += 20;

                return {
                    place,
                    score,
                };
            },
        )
        .sort(
            (a, b) =>
                b.score -
                a.score,
        )
        .map(
            ({ place }) =>
                place,
        );
}