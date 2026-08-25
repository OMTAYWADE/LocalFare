import { calculateDestinationCost,} from "@/features/travel/utils/calculateDestinationCost";
import { calculateBudgetScore, calculateDistanceScore, calculateFreshnessScore, calculatePriceFairnessScore, calculateRatingScore, calculateTimeScore, calculateWeightedScore,} from "./recommendationScore";
import { buildRecommendationReasons,} from "./recommendationReasons";
import type { DestinationRecommendation, RecommendationInput,} from "./types";

export function getDestinationRecommendations( inputs: RecommendationInput[],): DestinationRecommendation[] {
    return inputs.map(({ destination, remainingBudget, availableMinutes = 240, preferredTransport = "rapido",}) => {
                const availableTransport = destination.travelOptions.some((option) =>
                    option.provider === preferredTransport,) ? preferredTransport : destination.travelOptions[0]?.provider ?? "walk";

                const cost = calculateDestinationCost(destination, availableTransport, "day-trip",);
                const budgetScore = calculateBudgetScore(cost.total, remainingBudget,);
                const distanceScore = calculateDistanceScore(destination.distanceKm,);
                const ratingScore = calculateRatingScore(destination.rating,);
                const timeScore = calculateTimeScore(destination, availableMinutes,);
                const priceFairnessScore = calculatePriceFairnessScore(destination,);
                const freshnessScore = calculateFreshnessScore(destination,);
                const score = calculateWeightedScore({
                    budget: budgetScore,
                    distance: distanceScore,
                    rating: ratingScore,
                    time: timeScore,
                    priceFairness: priceFairnessScore,
                    freshness: freshnessScore,
                });

                const budgetFit = cost.total <= remainingBudget;
                const fastestTravel = destination.travelOptions.reduce((best, option) =>
                    Math.min(best, option.durationMinutes,),
                    Infinity,
                );

                const requiredTime = fastestTravel + destination.estimatedVisitMinutes;
                const timeFit = requiredTime <= availableMinutes;
                let level: DestinationRecommendation["level"];

                if (score >= 80 && budgetFit && timeFit) {
                    level = "best";
                } else if (score >= 65 && budgetFit) {
                    level = "good";
                } else if (score >= 45) {
                    level = "possible";
                } else {
                    level = "not-ideal";
                }

                const matchLabel = level === "best" ? "Best match" : level === "good" ? "Good option" : level === "possible" ? "Possible" : "Not ideal right now";
                const reasons = buildRecommendationReasons(
                    destination,
                    cost.total,
                    remainingBudget,
                    availableMinutes,
                );

                return {
                    destination,
                    estimatedCost: cost,
                    score,
                    level,
                    reasons,
                    budgetRemainingAfterVisit: remainingBudget - cost.total,
                    budgetFit,
                    timeFit,
                    matchLabel,
                    selectedTransport: availableTransport,
                };
            },
        ).sort((a, b) =>  b.score - a.score,
        );
}