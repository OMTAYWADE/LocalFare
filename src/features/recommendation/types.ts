import type { NearbyDestination, DestinationCostBreakdown, TransportChoice, } from "@/features/travel/types";

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