import type { NearbyDestination, } from "@/features/travel/types";
import type { RecommendationReason, } from "./types";

export function buildRecommendationReasons(
    destination: NearbyDestination,
    totalCost: number,
    remainingBudget: number,
    availableMinutes: number,
): RecommendationReason[] {
    const reasons: RecommendationReason[] = [];
    const budgetFit = totalCost <= remainingBudget;

    if (budgetFit) {
        reasons.push({ type: "budget", text: `Fits within your ₹${remainingBudget.toLocaleString("en-IN",)} remaining budget.`, });
    } else {
        reasons.push({
            type: "budget",
            text: `Estimated cost is ₹${(totalCost - remainingBudget).toLocaleString("en-IN",)} above your remaining budget.`,
        });
    }

    if (destination.distanceKm <= 5) {
        reasons.push({
            type: "distance",
            text: `${destination.distanceKm} km from your current destination.`,
        });
    } else if (destination.distanceKm <= 10) {
        reasons.push({
            type: "distance",
            text: `Within ${destination.distanceKm} km of your current destination.`,
        });
    }

    if (destination.rating >= 4.7) {
        reasons.push({
            type: "rating",
            text: `Highly rated at ${destination.rating}/5.`,
        });
    } else if (destination.rating >= 4.3) {
        reasons.push({
            type: "rating",
            text: `Well rated at ${destination.rating}/5.`,
        });
    }

    const fastestTravel = destination.travelOptions.reduce((best, option) =>
        Math.min(best, option.durationMinutes,),
        Infinity,
    );
    const requiredTime = fastestTravel + destination.estimatedVisitMinutes;

    if (requiredTime <= availableMinutes) {
        reasons.push({
            type: "time",
            text: "Fits comfortably into your available time.",
        });
    } else {
        reasons.push({
            type: "time",
            text: `May take about ${requiredTime} minutes including travel and visit.`,
        });
    }

    if ( destination.priceStatus === "cheap" ) {
        reasons.push({
            type: "price",
            text: "Current price signals are in a low range.",
        });
    }

    if ( destination.priceStatus === "fair") {
        reasons.push({
            type: "price",
            text: "Current prices appear within a fair local range.",
        });
    }

    if ( destination.confidence.freshness === "fresh" || destination.confidence.freshness === "recent") {
        reasons.push({
            type: "freshness",
            text: `Data was updated ${destination.confidence.lastUpdated}.`,
        });
    }

    return reasons.slice(0, 4);
}