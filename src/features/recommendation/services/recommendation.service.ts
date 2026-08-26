import {
    calculateDestinationCost,
} from "@/features/travel/utils/calculateDestinationCost";

import {
    calculateBudgetScore,
    calculateDistanceScore,
    calculateFreshnessScore,
    calculatePriceFairnessScore,
    calculateRatingScore,
    calculateTimeScore,
    calculateWeightedScore,
} from "../recommendationScore";

import {
    buildRecommendationReasons,
} from "../recommendationReasons";

import type {
    DestinationRecommendation,
    RecommendationInput,
} from "../types";

export function getDestinationRecommendations(
    inputs: RecommendationInput[],
): DestinationRecommendation[] {

    return inputs
        .map(
            ({
                destination,
                remainingBudget,
                availableMinutes = 240,
                preferredTransport = "rapido",
            }) => {

                /*
                 * --------------------------------------------------
                 * 1. FIND AVAILABLE TRANSPORT
                 * --------------------------------------------------
                 */

                const matchingTransport =
                    destination.travelOptions.find(
                        (option) =>
                            option.provider === preferredTransport,
                    );

                const availableTransport =
                    matchingTransport?.provider ??
                    destination.travelOptions[0]?.provider ??
                    "walk";

                /*
                 * --------------------------------------------------
                 * 2. CALCULATE TRAVEL COST
                 * --------------------------------------------------
                 */

                const cost =
                    calculateDestinationCost(
                        destination,
                        availableTransport,
                        "day-trip",
                    );

                /*
                 * --------------------------------------------------
                 * 3. INDIVIDUAL SCORES
                 * --------------------------------------------------
                 */

                const budgetScore =
                    calculateBudgetScore(
                        cost.total,
                        remainingBudget,
                    );

                const distanceScore =
                    calculateDistanceScore(
                        destination.distanceKm,
                    );

                const ratingScore =
                    calculateRatingScore(
                        destination.rating,
                    );

                const timeScore =
                    calculateTimeScore(
                        destination,
                        availableMinutes,
                    );

                const priceFairnessScore =
                    calculatePriceFairnessScore(
                        destination,
                    );

                const freshnessScore =
                    calculateFreshnessScore(
                        destination,
                    );

                /*
                 * --------------------------------------------------
                 * 4. FINAL WEIGHTED SCORE
                 * --------------------------------------------------
                 */

                const score =
                    calculateWeightedScore({
                        budget: budgetScore,
                        distance: distanceScore,
                        rating: ratingScore,
                        time: timeScore,
                        priceFairness: priceFairnessScore,
                        freshness: freshnessScore,
                    });

                /*
                 * --------------------------------------------------
                 * 5. BUDGET FIT
                 * --------------------------------------------------
                 */

                const budgetFit =
                    cost.total <= remainingBudget;

                /*
                 * --------------------------------------------------
                 * 6. FASTEST TRAVEL TIME
                 * --------------------------------------------------
                 */

                const fastestTravel =
                    destination.travelOptions.length > 0
                        ? destination.travelOptions.reduce(
                              (best, option) =>
                                  Math.min(
                                      best,
                                      option.durationMinutes,
                                  ),
                              Infinity,
                          )
                        : 0;

                /*
                 * If there is no transport information,
                 * use only the estimated visit time.
                 */

                const requiredTime =
                    fastestTravel +
                    destination.estimatedVisitMinutes;

                const timeFit =
                    requiredTime <= availableMinutes;

                /*
                 * --------------------------------------------------
                 * 7. RECOMMENDATION LEVEL
                 * --------------------------------------------------
                 */

                let level:
                    DestinationRecommendation["level"];

                if (
                    score >= 80 &&
                    budgetFit &&
                    timeFit
                ) {
                    level = "best";

                } else if (
                    score >= 65 &&
                    budgetFit
                ) {
                    level = "good";

                } else if (
                    score >= 45
                ) {
                    level = "possible";

                } else {
                    level = "not-ideal";
                }

                /*
                 * --------------------------------------------------
                 * 8. LABEL
                 * --------------------------------------------------
                 */

                const matchLabel =
                    level === "best"
                        ? "Best match"
                        : level === "good"
                        ? "Good option"
                        : level === "possible"
                        ? "Possible"
                        : "Not ideal right now";

                /*
                 * --------------------------------------------------
                 * 9. EXPLANATION
                 * --------------------------------------------------
                 */

                const reasons =
                    buildRecommendationReasons(
                        destination,
                        cost.total,
                        remainingBudget,
                        availableMinutes,
                    );

                /*
                 * --------------------------------------------------
                 * 10. RETURN
                 * --------------------------------------------------
                 */

                return {
                    destination,

                    estimatedCost: cost,

                    score,

                    level,

                    reasons,

                    budgetRemainingAfterVisit:
                        remainingBudget - cost.total,

                    budgetFit,

                    timeFit,

                    matchLabel,

                    selectedTransport:
                        availableTransport,
                };
            },
        )
        .sort(
            (a, b) =>
                b.score - a.score,
        );
}