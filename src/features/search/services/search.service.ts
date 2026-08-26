import { understandQuery, } from "./queryUnderstanding.service";
import { geocodePlace, } from "./nominatim.service";
import { findNearbyPlaces, } from "./overpass.service";
import { getRoute, } from "./osrm.service";
import { normalizeOsmPlace, } from "../utils/normalizeOsmPlace";
import { calculateStraightLineDistanceKm, } from "../utils/distance";
import type { RealPlaceResult, SearchIntent, SearchResponse, } from "../types";
import { findPlaceImage } from "./placeImage.service";

export async function searchLocalFare(originalQuery: string, sourceLocation?: { latitude: number; longitude: number; }, intent: SearchIntent = "unknown",): Promise<SearchResponse> {
    const parsed = understandQuery(originalQuery);
    const effectiveIntent = intent !== "unknown" ? intent : parsed.intent;
    const effectiveParsed = { ...parsed, intent: effectiveIntent, };
    const locationQuery = extractLocationQuery(parsed.normalizedQuery,);
    const location = sourceLocation ? {
        lat: String(sourceLocation.latitude),
        lon: String(sourceLocation.longitude),
        display_name: "Selected starting location",
    } : await geocodePlace(locationQuery);

    if (!location) {
        return {
            query: effectiveParsed,
            results: [],
            metadata: { source: "OpenStreetMap", retrievedAt: new Date().toISOString(), resultCount: 0, },
        };
    }

    const latitude = Number(location.lat);
    const longitude = Number(location.lon);
    const searchTerm = getSearchTerm( effectiveParsed,);
    const radiusMeters = effectiveIntent === "destination_recommendation" ? 10000 : 5000;
    const elements = await findNearbyPlaces( latitude, longitude, searchTerm, radiusMeters, );
    const places = elements.map(normalizeOsmPlace).filter((place): place is RealPlaceResult => Boolean(place), );
    const filteredPlaces = effectiveIntent === "destination_recommendation" ? filterDestinationPlaces(places) : places;
    const enriched = await enrichDistances( filteredPlaces,{ latitude, longitude,},);
    const rankedResults = rankResults( enriched, effectiveParsed,);
    const topResults = rankedResults.slice( 0, 6,);
    const resultsWithImages = await Promise.all(
            topResults.map(async (place) => {
                const image = await findPlaceImage( place.name, place.category,);

                return {
                    ...place,
                    imageUrl: image?.imageUrl,
                    imageSource: image?.sourceName,
                    imageSourceUrl: image?.sourceUrl,
                };
            }),
        );

    return {
        query: {
            ...effectiveParsed,
            location: {
                type: "place",
                value: location.display_name,
                latitude,
                longitude,
            },
        },

        results: resultsWithImages,

        searchLocation: {
            latitude,
            longitude,
            displayName: location.display_name,
        },

        metadata: {
            source: "OpenStreetMap + Nominatim + Overpass + OSRM",
            retrievedAt: new Date().toISOString(),
            resultCount: resultsWithImages.length,
        },
    };
}

function extractLocationQuery(query: string,) {
    const nearMatch = query.match(/\bnear\s+(.+)$/i,);

    if (nearMatch?.[1]) {
        return nearMatch[1];
    }

    const fromMatch = query.match(/\bfrom\s+(.+?)\s+to\s+/i,);

    if (fromMatch?.[1]) {
        return fromMatch[1];
    }

    return query;
}

function getSearchTerm(parsed: ReturnType<typeof understandQuery>,) {
    if (parsed.intent === "food_search") {
        const words = parsed.normalizedQuery.replace(/\b(cheap|cheapest|budget|affordable|spicy|hot|near|me|food|eat)\b/g, "",).trim();
        return words || "restaurant";
    }

    if (parsed.intent === "destination_recommendation") {
         return [ "tourist attraction", "landmark", "historic place", "museum", "park", "temple", "beach", "viewpoint", ].join(" ");
    }

    return parsed.normalizedQuery;
}

const NON_DESTINATION_CATEGORIES = new Set([
    "restaurant",
    "cafe",
    "fast_food",
    "bar",
    "pub",
    "hotel",
    "hostel",
    "guest_house",
    "shop",
    "supermarket",
    "convenience",
    "bank",
    "pharmacy",
    "fuel",
    "parking",
    "atm",
    "car_wash",
    "beauty",
    "hairdresser",
    "laundry",
]);

const DESTINATION_CATEGORIES = new Set([
    "attraction",
    "tourism",
    "museum",
    "gallery",
    "monument",
    "memorial",
    "viewpoint",
    "park",
    "garden",
    "beach",
    "zoo",
    "aquarium",
    "theme_park",
    "historic",
    "castle",
    "fort",
    "place_of_worship",
    "cathedral",
    "church",
    "temple",
    "mosque",
    "shrine",
    "heritage",
    "waterfront",
]);

function filterDestinationPlaces(
    places: RealPlaceResult[],
) {
    return places.filter((place) => {
        const category =
            place.category
                ?.toLowerCase()
                .trim();

        if (!category) {
            return false;
        }

        // Never show food/business places
        if (
            NON_DESTINATION_CATEGORIES.has(
                category,
            )
        ) {
            return false;
        }

        // Direct destination category
        if (
            DESTINATION_CATEGORIES.has(
                category,
            )
        ) {
            return true;
        }

        // Fallback for imperfect OSM categories
        return looksLikeDestination(place);
    });
}

function looksLikeDestination(
    place: RealPlaceResult,
) {
    const text = `
        ${place.name}
        ${place.category}
        ${place.address ?? ""}
    `.toLowerCase();

    const destinationKeywords = [
        "gateway",
        "fort",
        "palace",
        "temple",
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
        "mandir",
        "dargah",
        "shrine",
        "promenade",
        "waterfront",
    ];

    return destinationKeywords.some(
        (keyword) =>
            text.includes(keyword),
    );
}

async function enrichDistances(places: RealPlaceResult[], source: { latitude: number; longitude: number; },) {
    const limited = places.sort((a, b) =>
        calculateStraightLineDistanceKm(source.latitude, source.longitude, a.latitude, a.longitude,) -
        calculateStraightLineDistanceKm(source.latitude, source.longitude, b.latitude, b.longitude,),
    ).slice(0, 12);

    const results = await Promise.all(limited.map(async (place) => {
        try {
            const route = await getRoute(source, { latitude: place.latitude, longitude: place.longitude, },);

            return {
                ...place,
                distanceKm: route?.distanceKm ?? calculateStraightLineDistanceKm(source.latitude, source.longitude, place.latitude, place.longitude,),
                durationMinutes: route?.durationMinutes,
            };
        } catch {
            return {
                ...place,
                distanceKm: calculateStraightLineDistanceKm(source.latitude, source.longitude, place.latitude, place.longitude,),
            };
        }
    },
    ),
    );

    return results;
}
function rankResults(results: RealPlaceResult[], parsed: ReturnType<typeof understandQuery>,) {
    return results.map((place) => {
        let score = 0;
        const distance = place.distanceKm ?? 20;

        // Distance
        if (distance <= 2) {
            score += 35;
        } else if (distance <= 5) {
            score += 25;
        } else if (distance <= 10) {
            score += 15;
        } else {
            score += 5;
        }

        // Rating
        if (parsed.preferences.highlyRated) {
            score += place.rating ? Math.min(25, place.rating * 5) : 0;
        }

        // Cheap preference
        if (parsed.pricePreference === "cheap") {
            if (place.priceLevel === "PRICE_LEVEL_INEXPENSIVE" || place.priceLevel === "₹") {
                score += 20;
            }
        }

        // Famous preference
        if (parsed.preferences.famous) {
            // OSM currently doesn't expose the raw tourism
            // tags in RealPlaceResult.
            // Give a small neutral boost for now.
            score += 5;
        }
        // Base relevance
        score += 20;
        return { place, score, };
    })
        .sort((a, b) => b.score - a.score)
        .map(({ place }) => place);
}