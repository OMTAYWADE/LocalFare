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


/* =========================================================
   CONFIGURATION
   ========================================================= */

const TOURIST_RADIUS_KM = 20;

const CITIZEN_RADIUS_KM = 25;

const TOURIST_LIMIT = 8;

const CITIZEN_LIMIT = 10;


/* =========================================================
   MAIN
   ========================================================= */

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


    /* =====================================================
       EXCLUDED PLACES
       ===================================================== */

    const excludedIds = new Set([
        ...visitedPlaceIds,
        ...plannedPlaceIds,
    ]);


    /* =====================================================
       SEARCH QUERY
       ===================================================== */

    const searchQuery =
        travelerType === "tourist"
            ? getTouristSearchTerm(intent)
            : getCitizenSearchTerm(intent);


    const radiusKm =
        travelerType === "tourist"
            ? TOURIST_RADIUS_KM
            : CITIZEN_RADIUS_KM;


    console.log(
        "[Explore] Searching Geoapify places",
    );

    console.log(
        "[Explore] Coordinates:",
        latitude,
        longitude,
    );

    console.log(
        "[Explore] Search:",
        searchQuery,
    );

    console.log(
        "[Explore] Traveler:",
        travelerType,
    );


    try {

        /* =================================================
           1. GEOAPIFY PLACES
           ================================================= */

        const geoapifyPlaces =
            await searchPlaces(
                searchQuery,
                latitude,
                longitude,
                radiusKm * 1000,
            );


        console.log(
            "[Explore] Geoapify returned:",
            geoapifyPlaces.length,
        );


        /* =================================================
           2. NORMALIZE
           ================================================= */

        const places: RealPlaceResult[] =
            geoapifyPlaces
                .map(normalizeGeoapifyPlace)
                .filter(
                    (
                        place,
                    ): place is RealPlaceResult =>
                        place !== null,
                );


        console.log(
            "[Explore] Normalized:",
            places.length,
        );


        /* =================================================
           3. REMOVE VISITED / PLANNED
           ================================================= */

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


        /* =================================================
           4. DESTINATION FILTER
           ================================================= */

        const destinationPlaces =
            freshPlaces.filter(
                isDestination,
            );


        /*
         * If Geoapify does not give enough
         * destination categories, use all
         * returned places instead.
         */

        const usablePlaces =
            destinationPlaces.length > 0
                ? destinationPlaces
                : freshPlaces;


        /* =================================================
           5. BUILD RECOMMENDATIONS
           ================================================= */

        const recommendations =
            usablePlaces
                .map(
                    (place) =>
                        buildRecommendation(
                            place,
                            {
                                latitude,
                                longitude,
                            },
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


        console.log(
            "[Explore] Recommendations:",
            recommendations.length,
        );


        /* =================================================
           6. RESPONSE
           ================================================= */

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

    } catch (error) {

        console.error(
            "[Explore] Geoapify recommendation search failed:",
            error,
        );

        throw error;
    }
}


/* =========================================================
   SEARCH TERMS
   ========================================================= */

function getTouristSearchTerm(
    intent: string,
): string {

    switch (intent) {

        case "popular":
            return "popular tourist attractions";

        case "nearby":
            return "tourist attractions";

        case "weekend":
            return "tourist attractions landmarks";

        case "new":
            return "interesting places to visit";

        case "discover":
        default:
            return "tourist attractions landmarks";
    }
}


function getCitizenSearchTerm(
    intent: string,
): string {

    switch (intent) {

        case "popular":
            return "popular places to visit";

        case "nearby":
            return "interesting places";

        case "weekend":
            return "places to visit weekend";

        case "new":
            return "new places to explore";

        case "discover":
        default:
            return "interesting places to visit";
    }
}


/* =========================================================
   DESTINATION FILTER
   ========================================================= */

function isDestination(
    place: RealPlaceResult,
): boolean {

    const category =
        place.category
            .toLowerCase()
            .trim();


    const destinationCategories =
        new Set([
            "attraction",
            "tourism",
            "museum",
            "park",
            "beach",
            "place_of_worship",
            "monument",
            "memorial",
            "gallery",
            "art_gallery",
            "zoo",
            "aquarium",
            "amusement_park",
            "historical_landmark",
            "landmark",
            "tourist_attraction",
            "fort",
            "castle",
            "palace",
            "historic",
            "heritage",
            "viewpoint",
            "garden",
            "waterfall",
        ]);


    if (
        destinationCategories.has(
            category,
        )
    ) {
        return true;
    }


    /*
     * Geoapify categories can vary.
     * Therefore also inspect the actual
     * place text.
     */

    const text = `
        ${place.name}
        ${place.category}
        ${place.address ?? ""}
    `.toLowerCase();


    const keywords = [
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
   RECOMMENDATION BUILDER
   ========================================================= */

function buildRecommendation(
    place: RealPlaceResult,

    source: {
        latitude: number;
        longitude: number;
    },

    travelerType: TravelerType,

    savedPlaceIds: string[],
): ExploreRecommendation {

    /* =====================================================
       DISTANCE
       ===================================================== */

    const distanceKm =
        calculateStraightLineDistanceKm(
            source.latitude,
            source.longitude,
            place.latitude,
            place.longitude,
        );


    /* =====================================================
       SAVED
       ===================================================== */

    const isSaved =
        savedPlaceIds.includes(
            place.id,
        );


    /* =====================================================
       SCORE
       ===================================================== */

    const recommendationScore =
        calculateExploreScore({
            place,
            distanceKm,
            travelerType,
            isSaved,
        });


    /* =====================================================
       TYPE
       ===================================================== */

    const recommendationType =
        getRecommendationType(
            distanceKm,
            travelerType,
        );


    /* =====================================================
       REASON
       ===================================================== */

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

        recommendationScore,

        recommendationReason,

        recommendationType,

        isNew: true,
    };
}


/* =========================================================
   SCORING
   ========================================================= */

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


    /* =====================================================
       RATING
       ===================================================== */

    if (
        typeof place.rating === "number"
    ) {

        score += Math.min(
            25,
            place.rating * 5,
        );
    }


    /* =====================================================
       REVIEW COUNT
       ===================================================== */

    const reviews =
        place.reviewCount ?? 0;


    if (reviews >= 1000) {

        score += 20;

    } else if (reviews >= 500) {

        score += 15;

    } else if (reviews >= 100) {

        score += 10;
    }


    /* =====================================================
       DISTANCE
       ===================================================== */

    if (
        travelerType === "tourist"
    ) {

        if (distanceKm <= 5) {

            score += 30;

        } else if (distanceKm <= 10) {

            score += 25;

        } else if (distanceKm <= 20) {

            score += 15;

        } else {

            score += 5;
        }

    } else {

        if (distanceKm <= 3) {

            score += 30;

        } else if (distanceKm <= 10) {

            score += 25;

        } else if (distanceKm <= 20) {

            score += 15;

        } else {

            score += 5;
        }
    }


    /* =====================================================
       DESTINATION RELEVANCE
       ===================================================== */

    if (
        isDestination(place)
    ) {

        score += 20;
    }


    /* =====================================================
       SAVED PREFERENCE
       ===================================================== */

    if (isSaved) {

        score += 5;
    }


    return Math.min(
        100,
        Math.round(score),
    );
}


/* =========================================================
   RECOMMENDATION TYPE
   ========================================================= */

function getRecommendationType(
    distanceKm: number,
    travelerType: TravelerType,
): ExploreRecommendationType {

    if (distanceKm <= 20) {

        return "nearby";
    }


    if (distanceKm <= 80) {

        return "day_trip";
    }


    if (
        travelerType === "tourist"
    ) {

        return "weekend_trip";
    }


    return "long_trip";
}


/* =========================================================
   REASON
   ========================================================= */

function buildRecommendationReason(
    place: RealPlaceResult,

    distanceKm: number,

    travelerType: TravelerType,

    recommendationType: ExploreRecommendationType,
): string {

    const distanceText =
        `${Math.round(distanceKm)} km away`;


    if (
        travelerType === "tourist"
    ) {

        if (
            recommendationType ===
            "nearby"
        ) {

            return (
                `${place.name} is a notable ` +
                `place to explore nearby ` +
                `(${distanceText}).`
            );
        }


        if (
            recommendationType ===
            "day_trip"
        ) {

            return (
                `${place.name} could be a ` +
                `worthwhile day trip from ` +
                `your location ` +
                `(${distanceText}).`
            );
        }


        return (
            `${place.name} could be suitable ` +
            `for a longer trip ` +
            `(${distanceText}).`
        );
    }


    if (
        recommendationType ===
        "nearby"
    ) {

        return (
            `${place.name} is a nearby ` +
            `place you can discover ` +
            `(${distanceText}).`
        );
    }


    if (
        recommendationType ===
        "day_trip"
    ) {

        return (
            `${place.name} is outside your ` +
            `immediate area and could make ` +
            `a good day trip ` +
            `(${distanceText}).`
        );
    }


    return (
        `${place.name} is a longer-distance ` +
        `destination that could suit a ` +
        `weekend trip ` +
        `(${distanceText}).`
    );
}