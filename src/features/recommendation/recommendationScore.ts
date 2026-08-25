import type { NearbyDestination, } from "@/features/travel/types";
import { RECOMMENDATION_LIMITS, RECOMMENDATION_WEIGHTS, } from "./recommendation.config";

export function calculateBudgetScore(cost: number, remainingBudget: number,): number {
    if (remainingBudget <= 0) {
        return 0;
    }

    if (cost > remainingBudget) {
        const overspend = cost - remainingBudget;
        const overspendRatio = overspend / remainingBudget;

        return Math.max(0, 100 - overspendRatio * 100,);
    }

    const unusedBudget = remainingBudget - cost;
    const unusedRatio = unusedBudget / remainingBudget;

    return 70 + unusedRatio * 30;
}

export function calculateDistanceScore(distanceKm: number,): number {
    if (distanceKm >= RECOMMENDATION_LIMITS.maximumDistanceKm) {
        return 0;
    }

    return Math.max(0, 100 - (distanceKm / RECOMMENDATION_LIMITS.maximumDistanceKm) * 100,);
}

export function calculateRatingScore(rating: number,): number {
    return Math.min(100, (rating / 5) * 100,);
}

export function calculateTimeScore(destination: NearbyDestination, availableMinutes: number,): number {
    const travelMinutes = destination.travelOptions.reduce((best, option) =>
        Math.min(best, option.durationMinutes,),
        Infinity,
    );

    const requiredMinutes = travelMinutes + destination.estimatedVisitMinutes;

    if ( requiredMinutes <= availableMinutes ) {
        return 100;
    }

    const excess = requiredMinutes - availableMinutes;
    const ratio = excess / availableMinutes;
    return Math.max( 0, 100 - ratio * 100,);
}

export function calculatePriceFairnessScore( destination: NearbyDestination,): number {
    switch (destination.priceStatus) {
        case "cheap":
            return 100;

        case "fair":
            return 85;

        case "high":
            return 45;

        case "expensive":
            return 15;

        default:
            return 50;
    }
}

export function calculateFreshnessScore( destination: NearbyDestination,): number {
    switch ( destination.confidence.freshness ) {
        case "fresh":
            return 100;

        case "recent":
            return 85;

        case "aging":
            return 60;

        case "stale":
            return 30;

        default:
            return 50;
    }
}

export function calculateWeightedScore(
    scores: {
        budget: number;
        distance: number;
        rating: number;
        time: number;
        priceFairness: number;
        freshness: number;
    },
): number {
    const weighted =
        scores.budget *
        RECOMMENDATION_WEIGHTS.budget +
        scores.distance *
        RECOMMENDATION_WEIGHTS.distance +
        scores.rating *
        RECOMMENDATION_WEIGHTS.rating +
        scores.time *
        RECOMMENDATION_WEIGHTS.time +
        scores.priceFairness *
        RECOMMENDATION_WEIGHTS.priceFairness +
        scores.freshness *
        RECOMMENDATION_WEIGHTS.freshness;

    return Math.round( weighted / 100, );
}