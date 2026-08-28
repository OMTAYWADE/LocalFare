import type { NearbyDestination, DestinationCostBreakdown, TransportChoice,} from "@/features/travel/types";
import type { TravelerType,} from "@/features/profile/types";
import type { RealPlaceResult,} from "@/features/search/types";

/* =========================================================
   EXISTING TRIP RECOMMENDATION TYPES
   ========================================================= */

export interface RecommendationInput {
    destination: NearbyDestination;
    remainingBudget: number;
    availableMinutes?: number;
    preferredTransport?: TransportChoice;
    selectedFoodPreferences?: string[];
}

export type RecommendationLevel =
    | "best"
    | "good"
    | "possible"
    | "not-ideal";

export interface RecommendationReason {
    type:
        | "budget"
        | "distance"
        | "rating"
        | "time"
        | "price"
        | "freshness"
        | "preference";

    text: string;
}

export interface DestinationRecommendation {
    destination: NearbyDestination;
    estimatedCost: DestinationCostBreakdown;
    score: number;
    level: RecommendationLevel;
    reasons: RecommendationReason[];
    budgetRemainingAfterVisit: number;
    budgetFit: boolean;
    timeFit: boolean;
    matchLabel: string;
    selectedTransport: TransportChoice;
}

/* =========================================================
   EXPLORE RECOMMENDATION TYPES
   ========================================================= */

export type RecommendationIntent =
    | "nearby"
    | "discover"
    | "weekend"
    | "popular"
    | "new";

export type ExploreRecommendationType =
    | "nearby"
    | "day_trip"
    | "weekend_trip"
    | "long_trip";

export interface ExploreRecommendationInput {
    latitude: number;
    longitude: number;
    travelerType: TravelerType;
    visitedPlaceIds: string[];
    savedPlaceIds?: string[];
    plannedPlaceIds?: string[];
    intent?: RecommendationIntent;
    limit?: number;
}

export interface ExploreRecommendation extends RealPlaceResult {
    distanceKm: number;
    recommendationScore: number;
    recommendationReason: string;
    recommendationType: ExploreRecommendationType;
    isNew: boolean;
}

export interface ExploreRecommendationResponse {
    results: ExploreRecommendation[];
    travelerType: TravelerType;
    metadata: {
        radiusKm: number;
        resultCount: number;
        generatedAt: string;
    };
}