import type { TravelerType } from "@/features/profile/types";

import type {
    RealPlaceResult,
} from "@/features/search/types";

import {
    searchPlaces,
} from "@/features/search/services/geoapifyPlaces.service";

import {
    normalizeGeoapifyPlace,
} from "@/features/search/utils/normalizeGeoapifyPlace";

import {
    calculateStraightLineDistanceKm,
} from "@/features/search/utils/distance";

import type {
    ExploreRecommendation,
    ExploreRecommendationInput,
    ExploreRecommendationResponse,
    ExploreRecommendationType,
} from "../types";

/*
 * Explore rule:
 *
 * This screen is NOT a general "anything nearby" search.
 * It should surface a small number of high-value, well-known
 * places that are genuinely close to the user.
 *
 * Distance is a hard constraint.
 * Quality + popularity + landmark/heritage relevance decide
 * which nearby places survive.
 */

const TOURIST_RADIUS_KM = 8;
const CITIZEN_RADIUS_KM = 10;

const TOURIST_LIMIT = 6;
const CITIZEN_LIMIT = 6;

const MIN_RATING = 4.0;
const MIN_REVIEW_COUNT_FOR_UNRATED = 100;

/*
 * Multiple discovery queries are used because a single generic
 * "tourist attractions" query can return ordinary parks,
 * unnamed forts, small museums, etc.
 *
 * Results are merged and de-duplicated before ranking.
 */
const DISCOVERY_QUERIES = [
    "famous landmarks iconic tourist attractions",
    "heritage monuments historical landmarks",
    "top tourist attractions famous places",
];

/*
 * Strong name/category signals for places people commonly
 * recognize as destination-level landmarks.
 *
 * These are ranking signals only. A place must still be
 * returned by the real provider and pass the local-radius
 * filter before it can be shown.
 */
const ICONIC_TERMS = [
    "gateway of india",
    "gateway",
    "mahalaxmi",
    "mahalakshmi",
    "chhatrapati shivaji maharaj terminus",
    "victoria terminus",
    "cst",
    "elephanta",
    "ajanta",
    "ellora",
    "siddhivinayak",
    "haji ali",
    "kanheri",
    "bibi ka maqbara",
    "shaniwar wada",
    "aga khan palace",
    "lal mahal",
    "shaniwarwada",
    "palace",
    "fort",
    "monument",
    "memorial",
    "landmark",
    "heritage",
    "historic",
    "temple",
    "cathedral",
    "mosque",
    "church",
];

const HERITAGE_TERMS = [
    "unesco",
    "heritage",
    "historic",
    "historical",
    "monument",
    "fort",
    "palace",
    "old",
    "ancient",
    "terminus",
];

const GENERIC_ONLY_NAMES = new Set([
    "fort",
    "garden",
    "park",
    "museum",
    "temple",
    "church",
    "mosque",
    "palace",
    "market",
    "monument",
    "attraction",
    "tourist attraction",
]);

export async function getExploreRecommendations(
    input: ExploreRecommendationInput,
): Promise<ExploreRecommendationResponse> {
    const {
        latitude,
        longitude,
        travelerType,
        visitedPlaceIds = [],
        plannedPlaceIds = [],
        savedPlaceIds = [],
        limit,
    } = input;

    const radiusKm =
        travelerType === "tourist"
            ? TOURIST_RADIUS_KM
            : CITIZEN_RADIUS_KM;

    const resultLimit = Math.min(
        limit ??
            (travelerType === "tourist"
                ? TOURIST_LIMIT
                : CITIZEN_LIMIT),
        6,
    );

    const excludedIds = new Set([
        ...visitedPlaceIds,
        ...plannedPlaceIds,
    ]);

    /*
     * Search several real categories/intent terms and merge them.
     * This gives the ranking engine a better candidate pool for
     * iconic places than relying on one provider query.
     */
    const queryResults = await Promise.all(
        DISCOVERY_QUERIES.map(
            (query) =>
                searchPlaces(
                    query,
                    latitude,
                    longitude,
                    radiusKm * 1000,
                ),
        ),
    );

    const rawPlaces = queryResults.flat();

    const normalizedPlaces =
        rawPlaces
            .map(normalizeGeoapifyPlace)
            .filter(
                (
                    place,
                ): place is RealPlaceResult =>
                    place !== null,
            );

    /*
     * De-duplicate before ranking.
     */
    const uniquePlaces =
        Array.from(
            new Map(
                normalizedPlaces.map(
                    (place) => [
                        place.id,
                        place,
                    ],
                ),
            ).values(),
        );

    /*
     * HARD LOCAL FILTER
     *
     * A famous place outside the user's local area must NOT
     * appear on this Explore screen.
     */
    const nearbyLandmarks =
        uniquePlaces.filter((place) => {
            if (excludedIds.has(place.id)) {
                return false;
            }

            const distanceKm =
                calculateStraightLineDistanceKm(
                    latitude,
                    longitude,
                    place.latitude,
                    place.longitude,
                );

            if (
                !Number.isFinite(
                    distanceKm,
                ) ||
                distanceKm > radiusKm
            ) {
                return false;
            }

            if (!isDestination(place)) {
                return false;
            }

            if (
                typeof place.rating ===
                    "number" &&
                place.rating < MIN_RATING
            ) {
                return false;
            }

            /*
             * Places without rating/review evidence are allowed only
             * when their name strongly signals a landmark/heritage
             * destination. Otherwise they are usually too generic
             * for a "top places" result.
             */
            if (
                place.rating ===
                    undefined &&
                (place.reviewCount ??
                    0) <
                    MIN_REVIEW_COUNT_FOR_UNRATED &&
                !isStrongLandmark(place)
            ) {
                return false;
            }

            /*
             * Reject provider results whose only useful information
             * is a generic category such as "Fort" or "Park".
             */
            if (
                isGenericOnlyName(place) &&
                !isStrongLandmark(place)
            ) {
                return false;
            }

            return true;
        });

    const recommendations =
        nearbyLandmarks
            .map((place) =>
                buildRecommendation(
                    place,
                    latitude,
                    longitude,
                    travelerType,
                    savedPlaceIds,
                ),
            )
            .sort(compareRecommendations)
            .slice(0, resultLimit);

    return {
        results:
            recommendations,
        travelerType,
        metadata: {
            radiusKm,
            resultCount:
                recommendations.length,
            generatedAt:
                new Date().toISOString(),
        },
    };
}

function buildRecommendation(
    place: RealPlaceResult,
    latitude: number,
    longitude: number,
    travelerType: TravelerType,
    savedPlaceIds: string[],
): ExploreRecommendation {
    const distanceKm =
        calculateStraightLineDistanceKm(
            latitude,
            longitude,
            place.latitude,
            place.longitude,
        );

    const isSaved =
        savedPlaceIds.includes(
            place.id,
        );

    const recommendationScore =
        calculateExploreScore(
            place,
            distanceKm,
            travelerType,
            isSaved,
        );

    return {
        ...place,
        distanceKm,
        recommendationScore,
        recommendationReason:
            buildRecommendationReason(
                place,
                distanceKm,
                recommendationScore,
            ),
        recommendationType:
            "nearby" as ExploreRecommendationType,
        isNew: true,
    };
}

function calculateExploreScore(
    place: RealPlaceResult,
    distanceKm: number,
    travelerType: TravelerType,
    isSaved: boolean,
): number {
    const radiusKm =
        travelerType === "tourist"
            ? TOURIST_RADIUS_KM
            : CITIZEN_RADIUS_KM;

    let score = 0;

    /*
     * DISTANCE — 30
     *
     * Still important, but a truly iconic place gets enough
     * quality weight to beat an ordinary place that happens
     * to be 200 metres closer.
     */
    score += Math.max(
        0,
        Math.round(
            30 *
                (1 -
                    distanceKm /
                        radiusKm),
        ),
    );

    /*
     * RATING — 25
     */
    if (
        typeof place.rating ===
        "number"
    ) {
        score += Math.round(
            Math.min(
                25,
                Math.max(
                    0,
                    ((place.rating -
                        3.5) /
                        1.5) *
                        25,
                ),
            ),
        );
    }

    /*
     * REVIEW CONFIDENCE — 20
     */
    const reviews =
        place.reviewCount ?? 0;

    if (reviews >= 5000) {
        score += 20;
    } else if (reviews >= 2000) {
        score += 18;
    } else if (reviews >= 1000) {
        score += 16;
    } else if (reviews >= 500) {
        score += 13;
    } else if (reviews >= 100) {
        score += 9;
    } else if (reviews >= 25) {
        score += 4;
    }

    /*
     * ICONIC LANDMARK SIGNAL — 20
     */
    if (isStrongLandmark(place)) {
        score += 20;
    } else if (isHeritagePlace(place)) {
        score += 14;
    } else if (isDestination(place)) {
        score += 7;
    }

    /*
     * SAVED — small bonus only
     */
    if (isSaved) {
        score += 2;
    }

    return Math.max(
        0,
        Math.min(
            100,
            Math.round(score),
        ),
    );
}

function compareRecommendations(
    first: ExploreRecommendation,
    second: ExploreRecommendation,
): number {
    if (
        second.recommendationScore !==
        first.recommendationScore
    ) {
        return (
            second.recommendationScore -
            first.recommendationScore
        );
    }

    if (
        second.distanceKm !==
        first.distanceKm
    ) {
        return (
            first.distanceKm -
            second.distanceKm
        );
    }

    return (
        (second.rating ?? 0) -
        (first.rating ?? 0)
    );
}

function isDestination(
    place: RealPlaceResult,
): boolean {
    const text = getPlaceText(
        place,
    );

    const destinationTerms = [
        ...ICONIC_TERMS,
        ...HERITAGE_TERMS,
        "attraction",
        "tourist",
        "museum",
        "gallery",
        "park",
        "garden",
        "beach",
        "lake",
        "waterfall",
        "viewpoint",
        "zoo",
        "aquarium",
        "market",
        "promenade",
        "waterfront",
        "shrine",
        "dargah",
    ];

    return destinationTerms.some(
        (term) =>
            text.includes(term),
    );
}

function isStrongLandmark(
    place: RealPlaceResult,
): boolean {
    const text =
        getPlaceText(place);

    return ICONIC_TERMS.some(
        (term) =>
            text.includes(term),
    );
}

function isHeritagePlace(
    place: RealPlaceResult,
): boolean {
    const text =
        getPlaceText(place);

    return HERITAGE_TERMS.some(
        (term) =>
            text.includes(term),
    );
}

function isGenericOnlyName(
    place: RealPlaceResult,
): boolean {
    const name =
        place.name
            .trim()
            .toLowerCase();

    return GENERIC_ONLY_NAMES.has(
        name,
    );
}

function getPlaceText(
    place: RealPlaceResult,
): string {
    return [
        place.name,
        place.category,
        place.address ?? "",
    ]
        .join(" ")
        .toLowerCase();
}

function buildRecommendationReason(
    place: RealPlaceResult,
    distanceKm: number,
    score: number,
): string {
    const distanceText =
        distanceKm < 1
            ? `${Math.round(
                  distanceKm *
                      1000,
              )} m away`
            : `${distanceKm.toFixed(
                  1,
              )} km away`;

    const ratingText =
        typeof place.rating ===
        "number"
            ? ` · ${place.rating.toFixed(
                  1,
              )}/5`
            : "";

    if (
        isStrongLandmark(
            place,
        )
    ) {
        return `Top local landmark · ${distanceText}${ratingText}`;
    }

    if (
        isHeritagePlace(place)
    ) {
        return `Heritage / historic place · ${distanceText}${ratingText}`;
    }

    if (score >= 75) {
        return `Highly rated nearby destination · ${distanceText}${ratingText}`;
    }

    return `Nearby destination · ${distanceText}${ratingText}`;
}
