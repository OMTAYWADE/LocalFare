import type { TravelerType } from "@/features/profile/types";

import type { RealPlaceResult } from "@/features/search/types";

import { findNearbyPlaces } from "@/features/search/services/overpass.service";

import { normalizeOsmPlace } from "@/features/search/utils/normalizeOsmPlace";

import { calculateStraightLineDistanceKm } from "@/features/search/utils/distance";

import type {
    ExploreRecommendation,
    ExploreRecommendationInput,
    ExploreRecommendationResponse,
    ExploreRecommendationType,
} from "../types";

/*
|--------------------------------------------------------------------------
| CONFIGURATION
|--------------------------------------------------------------------------
|
| Keep the first real-data test small.
|
| Tourist:
|   2 km
|
| Citizen:
|   2 km initially
|
| Once real data works, we can progressively increase
| citizen search radius.
|
*/

const TOURIST_RADIUS_KM = 2;

const CITIZEN_SEARCH_RADII_KM = [2];

const TOURIST_LIMIT = 8;

const CITIZEN_LIMIT = 10;


/*
|--------------------------------------------------------------------------
| MAIN FUNCTION
|--------------------------------------------------------------------------
*/

export async function getExploreRecommendations(
    input: ExploreRecommendationInput,
): Promise<ExploreRecommendationResponse> {

    const {
        latitude,
        longitude,
        travelerType,
        visitedPlaceIds = [],
        savedPlaceIds = [],
        plannedPlaceIds = [],
        intent = "discover",
        limit,
    } = input;

    const resultLimit =
        limit ??
        (
            travelerType === "tourist"
                ? TOURIST_LIMIT
                : CITIZEN_LIMIT
        );

    /*
    |--------------------------------------------------------------------------
    | EXCLUDED PLACES
    |--------------------------------------------------------------------------
    |
    | Places already visited or planned should not
    | appear again.
    |
    */

    const excludedIds = new Set([
        ...visitedPlaceIds,
        ...plannedPlaceIds,
    ]);


    /*
    |--------------------------------------------------------------------------
    | TOURIST
    |--------------------------------------------------------------------------
    */

    if (travelerType === "tourist") {

        console.log(
            "[Explore] Tourist search started",
        );

        console.log(
            "[Explore] Coordinates:",
            latitude,
            longitude,
        );

        console.log(
            "[Explore] Radius:",
            TOURIST_RADIUS_KM,
            "km",
        );

        try {

            const elements =
                await findNearbyPlaces(
                    latitude,
                    longitude,
                    getTouristSearchTerm(intent),
                    TOURIST_RADIUS_KM * 1000,
                );

            console.log(
                "[Explore] Overpass returned:",
                elements.length,
            );

            const places =
                elements
                    .map(normalizeOsmPlace)
                    .filter(
                        (
                            place,
                        ): place is RealPlaceResult =>
                            Boolean(place),
                    );

            console.log(
                "[Explore] Normalized places:",
                places.length,
            );

            const freshPlaces =
                places.filter(
                    (place) =>
                        !excludedIds.has(
                            place.id,
                        ),
                );

            console.log(
                "[Explore] Fresh places:",
                freshPlaces.length,
            );

            return buildResponse(
                freshPlaces,
                {
                    latitude,
                    longitude,
                },
                travelerType,
                savedPlaceIds,
                resultLimit,
                TOURIST_RADIUS_KM,
            );

        } catch (error) {

            console.error(
                "[Explore] Tourist search failed:",
                error,
            );

            /*
             * Re-throw the error.
             *
             * During development we WANT the API route
             * to tell us that real data failed.
             *
             * We should not silently return fake data.
             */
            throw error;
        }
    }


    /*
    |--------------------------------------------------------------------------
    | CITIZEN / LOCAL
    |--------------------------------------------------------------------------
    |
    | For now we intentionally search only 2 km.
    |
    | After the real-data request works, we can change:
    |
    | [2]
    |
    | to:
    |
    | [2, 5, 10]
    |
    | and later:
    |
    | [2, 5, 10, 25, 50]
    |
    */

    const allPlaces: RealPlaceResult[] = [];

    let usedRadius = 2;

    for (
        const radiusKm
        of CITIZEN_SEARCH_RADII_KM
    ) {

        usedRadius = radiusKm;

        console.log(
            `[Explore] Citizen search: ${radiusKm} km`,
        );

        try {

            const elements =
                await findNearbyPlaces(
                    latitude,
                    longitude,
                    getCitizenSearchTerm(intent),
                    radiusKm * 1000,
                );

            console.log(
                `[Explore] ${radiusKm} km returned ${elements.length} elements`,
            );

            const places =
                elements
                    .map(normalizeOsmPlace)
                    .filter(
                        (
                            place,
                        ): place is RealPlaceResult =>
                            Boolean(place),
                    );

            const freshPlaces =
                places.filter(
                    (place) =>
                        !excludedIds.has(
                            place.id,
                        ),
                );

            /*
            |--------------------------------------------------------------------------
            | Remove duplicates
            |--------------------------------------------------------------------------
            */

            const existingIds =
                new Set(
                    allPlaces.map(
                        (place) =>
                            place.id,
                    ),
                );

            for (
                const place
                of freshPlaces
            ) {

                if (
                    !existingIds.has(
                        place.id,
                    )
                ) {

                    allPlaces.push(place);

                    existingIds.add(
                        place.id,
                    );
                }
            }

            /*
            |--------------------------------------------------------------------------
            | Stop when enough places exist
            |--------------------------------------------------------------------------
            */

            if (
                allPlaces.length >=
                resultLimit * 2
            ) {
                break;
            }

        } catch (error) {

            console.warn(
                `[Explore] Citizen search failed at ${radiusKm} km:`,
                error,
            );

            /*
             * Try the next radius if one exists.
             */
            continue;
        }
    }


    console.log(
        "[Explore] Citizen places:",
        allPlaces.length,
    );

    return buildResponse(
        allPlaces,
        {
            latitude,
            longitude,
        },
        travelerType,
        savedPlaceIds,
        resultLimit,
        usedRadius,
    );
}


/*
|--------------------------------------------------------------------------
| BUILD RESPONSE
|--------------------------------------------------------------------------
*/

function buildResponse(
    places: RealPlaceResult[],
    source: {
        latitude: number;
        longitude: number;
    },
    travelerType: TravelerType,
    savedPlaceIds: string[],
    resultLimit: number,
    radiusKm: number,
): ExploreRecommendationResponse {

    /*
    |--------------------------------------------------------------------------
    | Build recommendations
    |--------------------------------------------------------------------------
    */

    const recommendations =
        places
            .map(
                (place) =>
                    buildRecommendation(
                        place,
                        source,
                        travelerType,
                        savedPlaceIds,
                    ),
            )
            .sort(
                (first, second) =>
                    second.recommendationScore -
                    first.recommendationScore,
            )
            .slice(
                0,
                resultLimit,
            );

    return {
        results: recommendations,

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


/*
|--------------------------------------------------------------------------
| SEARCH TERMS
|--------------------------------------------------------------------------
*/

/**
 * Tourist recommendations should return
 * destination-like places.
 *
 * NOT restaurants.
 * NOT cafes.
 */
function getTouristSearchTerm(
    intent: string,
): string {

    switch (intent) {

        case "popular":
            return "tourist attraction";

        case "nearby":
            return "tourist attraction";

        case "new":
            return "tourist attraction";

        case "weekend":
            return "tourist attraction";

        case "discover":
        default:
            return "tourist attraction";
    }
}


/**
 * Citizen recommendations should also return
 * destinations.
 *
 * The radius decides whether the destination
 * is nearby or farther away.
 */
function getCitizenSearchTerm(
    intent: string,
): string {

    switch (intent) {

        case "weekend":
            return "tourist attraction";

        case "popular":
            return "tourist attraction";

        case "nearby":
            return "tourist attraction";

        case "new":
            return "tourist attraction";

        case "discover":
        default:
            return "tourist attraction";
    }
}


/*
|--------------------------------------------------------------------------
| RECOMMENDATION BUILDER
|--------------------------------------------------------------------------
*/

function buildRecommendation(
    place: RealPlaceResult,
    source: {
        latitude: number;
        longitude: number;
    },
    travelerType: TravelerType,
    savedPlaceIds: string[],
): ExploreRecommendation {

    /*
    |--------------------------------------------------------------------------
    | Distance
    |--------------------------------------------------------------------------
    */

    const distanceKm =
        calculateStraightLineDistanceKm(
            source.latitude,
            source.longitude,
            place.latitude,
            place.longitude,
        );


    /*
    |--------------------------------------------------------------------------
    | Saved state
    |--------------------------------------------------------------------------
    */

    const isSaved =
        savedPlaceIds.includes(
            place.id,
        );


    /*
    |--------------------------------------------------------------------------
    | Score
    |--------------------------------------------------------------------------
    */

    const score =
        calculateExploreScore({
            place,
            distanceKm,
            travelerType,
            isSaved,
        });


    /*
    |--------------------------------------------------------------------------
    | Recommendation type
    |--------------------------------------------------------------------------
    */

    const recommendationType =
        getRecommendationType(
            distanceKm,
            travelerType,
        );


    /*
    |--------------------------------------------------------------------------
    | Reason
    |--------------------------------------------------------------------------
    */

    const recommendationReason =
        buildRecommendationReason(
            place,
            distanceKm,
            travelerType,
            recommendationType,
        );


    return {
        ...place,

        distanceKm,

        recommendationScore:
            score,

        recommendationReason,

        recommendationType,

        isNew: true,
    };
}


/*
|--------------------------------------------------------------------------
| SCORING
|--------------------------------------------------------------------------
*/

function calculateExploreScore({
    place,
    distanceKm,
    travelerType,
    isSaved,
}: {
    place: RealPlaceResult;
    distanceKm: number;
    travelerType: TravelerType;
    isSaved: boolean;
}): number {

    let score = 0;


    /*
    |--------------------------------------------------------------------------
    | Rating
    |--------------------------------------------------------------------------
    */

    if (
        typeof place.rating === "number"
    ) {

        score += Math.min(
            25,
            place.rating * 5,
        );
    }


    /*
    |--------------------------------------------------------------------------
    | TOURIST
    |--------------------------------------------------------------------------
    |
    | Tourists should prioritize:
    |
    | 1. Famous places
    | 2. Attractions
    | 3. Nearby locations
    | 4. Rating
    |
    */

    if (
        travelerType === "tourist"
    ) {

        if (
            distanceKm <= 5
        ) {

            score += 35;

        } else if (
            distanceKm <= 10
        ) {

            score += 30;

        } else if (
            distanceKm <= 20
        ) {

            score += 22;

        } else {

            score += 12;
        }


        if (
            isFamousTouristCategory(
                place.category,
            )
        ) {

            score += 30;
        }
    }


    /*
    |--------------------------------------------------------------------------
    | CITIZEN / LOCAL
    |--------------------------------------------------------------------------
    |
    | Citizens should discover places
    | outside their immediate surroundings.
    |
    */

    if (
        travelerType === "citizen"
    ) {

        if (
            distanceKm >= 40 &&
            distanceKm <= 80
        ) {

            score += 40;

        } else if (
            distanceKm >= 20
        ) {

            score += 30;

        } else {

            score += 15;
        }


        if (
            isFamousTouristCategory(
                place.category,
            )
        ) {

            score += 30;
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Saved preference
    |--------------------------------------------------------------------------
    */

    if (isSaved) {
        score += 5;
    }


    return Math.min(
        100,
        Math.round(score),
    );
}


/*
|--------------------------------------------------------------------------
| CATEGORY RELEVANCE
|--------------------------------------------------------------------------
*/

function isFamousTouristCategory(
    category: string,
): boolean {

    const normalized =
        category.toLowerCase();

    const keywords = [
        "attraction",
        "tourism",
        "museum",
        "temple",
        "monument",
        "fort",
        "castle",
        "beach",
        "waterfall",
        "viewpoint",
        "heritage",
        "memorial",
        "park",
        "palace",
        "shrine",
        "landmark",
        "historic",
        "place_of_worship",
    ];

    return keywords.some(
        (keyword) =>
            normalized.includes(
                keyword,
            ),
    );
}


/*
|--------------------------------------------------------------------------
| RECOMMENDATION TYPE
|--------------------------------------------------------------------------
*/

function getRecommendationType(
    distanceKm: number,
    travelerType: TravelerType,
): ExploreRecommendationType {

    /*
    |--------------------------------------------------------------------------
    | TOURIST
    |--------------------------------------------------------------------------
    */

    if (
        travelerType === "tourist"
    ) {

        if (
            distanceKm <= 25
        ) {

            return "nearby";
        }

        if (
            distanceKm <= 80
        ) {

            return "day_trip";
        }

        return "weekend_trip";
    }


    /*
    |--------------------------------------------------------------------------
    | CITIZEN
    |--------------------------------------------------------------------------
    */

    if (
        distanceKm < 20
    ) {

        return "nearby";
    }

    if (
        distanceKm <= 80
    ) {

        return "day_trip";
    }

    return "long_trip";
}


/*
|--------------------------------------------------------------------------
| REASON
|--------------------------------------------------------------------------
*/

function buildRecommendationReason(
    place: RealPlaceResult,
    distanceKm: number,
    travelerType: TravelerType,
    recommendationType: ExploreRecommendationType,
): string {

    const distanceText =
        `${Math.round(distanceKm)} km away`;


    /*
    |--------------------------------------------------------------------------
    | TOURIST
    |--------------------------------------------------------------------------
    */

    if (
        travelerType === "tourist"
    ) {

        if (
            recommendationType === "nearby"
        ) {

            return `${place.name} is a notable place to explore nearby (${distanceText}).`;
        }

        if (
            recommendationType === "day_trip"
        ) {

            return `${place.name} is a worthwhile day-trip destination from your location (${distanceText}).`;
        }

        return `${place.name} is a notable destination for a longer trip (${distanceText}).`;
    }


    /*
    |--------------------------------------------------------------------------
    | CITIZEN
    |--------------------------------------------------------------------------
    */

    if (
        recommendationType === "nearby"
    ) {

        return `${place.name} is a new place to discover without travelling too far (${distanceText}).`;
    }

    if (
        recommendationType === "day_trip"
    ) {

        return `${place.name} is a new destination worth discovering outside your usual area (${distanceText}).`;
    }

    return `${place.name} is a longer-distance destination that could be suitable for a weekend trip (${distanceText}).`;
}