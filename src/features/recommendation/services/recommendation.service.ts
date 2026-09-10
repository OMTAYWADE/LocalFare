import type {
    NearbyDestination,
    DestinationCostBreakdown,
    DestinationTravelOption,
    TransportChoice,
} from "@/features/travel/types";

import type {
    RecommendationInput,
    DestinationRecommendation,
    RecommendationLevel,
    RecommendationReason,
} from "@/features/recommendation/types";

const DEFAULT_TRANSPORT: TransportChoice =
    "rapido";

/*
 * This service is used by the trip-planning flow.
 *
 * `nearbyOnly` is optional so existing callers do not
 * break. For the Explore/local-discovery screen, pass
 * nearbyOnly: true and use maxDistanceKm when needed.
 */

export function getDestinationRecommendations(
    inputs: RecommendationInput[],
): DestinationRecommendation[] {
    const recommendations =
        inputs
            .map(
                buildDestinationRecommendation,
            )
            .sort(
                (a, b) =>
                    b.score - a.score,
            );

    /*
     * Keep the output small. The UI should show
     * a short list of strong options rather than
     * dumping every provider result.
     */
    return recommendations.slice(
        0,
        6,
    );
}

function buildDestinationRecommendation(
    input: RecommendationInput,
): DestinationRecommendation {
    const {
        destination,
        remainingBudget,
        availableMinutes,
        preferredTransport,
    } = input;

    const distanceKm =
        getDistanceKm(destination);

    const requestedTransport =
        preferredTransport ??
        DEFAULT_TRANSPORT;

    const bestTravelOption =
        getBestTravelOption(
            destination.travelOptions,
            requestedTransport,
        );

    const selectedTransport =
        bestTravelOption?.provider ??
        requestedTransport;

    const estimatedCost =
        calculateDestinationCost(
            destination,
            bestTravelOption,
        );

    const budgetFit =
        estimatedCost.total <=
        remainingBudget;

    const travelMinutes =
        calculateTravelMinutes(
            distanceKm,
            bestTravelOption,
        );

    const visitMinutes =
        getVisitMinutes(destination);

    const totalTimeRequired =
        travelMinutes +
        visitMinutes;

    const timeFit =
        availableMinutes ===
            undefined ||
        totalTimeRequired <=
            availableMinutes;

    const score =
        calculateScore({
            destination,
            distanceKm,
            estimatedCost,
            remainingBudget,
            availableMinutes,
            totalTimeRequired,
            budgetFit,
            timeFit,
        });

    const level =
        getRecommendationLevel(score);

    const reasons =
        buildReasons({
            destination,
            distanceKm,
            estimatedCost,
            remainingBudget,
            availableMinutes,
            totalTimeRequired,
            budgetFit,
            timeFit,
        });

    return {
        destination,
        estimatedCost,
        score,
        level,
        reasons,
        budgetRemainingAfterVisit:
            remainingBudget -
            estimatedCost.total,
        budgetFit,
        timeFit,
        matchLabel:
            getMatchLabel(level),
        selectedTransport,
    };
}

function getDistanceKm(
    destination: NearbyDestination,
): number {
    const value =
        destination.distanceKm;

    return typeof value === "number" &&
        Number.isFinite(value) &&
        value >= 0
        ? value
        : 0;
}

function getBestTravelOption(
    options:
        | DestinationTravelOption[]
        | undefined,
    preferredTransport: TransportChoice,
): DestinationTravelOption | undefined {
    if (!options?.length) {
        return undefined;
    }

    const preferred =
        options.find(
            (option) =>
                option.provider ===
                preferredTransport,
        );

    if (preferred) {
        return preferred;
    }

    return [...options].sort(
        (a, b) =>
            a.minPrice -
            b.minPrice,
    )[0];
}

function calculateDestinationCost(
    destination: NearbyDestination,
    travelOption?:
        | DestinationTravelOption,
): DestinationCostBreakdown {
    const travel =
        getTravelCost(
            travelOption,
        );

    const entry =
        getEntryCost(destination);

    const food =
        getFoodCost(destination);

    const localTransport =
        getLocalTransportCost(
            destination,
        );

    const other =
        getOtherCost(destination);

    const stay =
        getStayCost(destination);

    return {
        travel,
        entry,
        food,
        localTransport,
        other,
        stay,
        total:
            travel +
            entry +
            food +
            localTransport +
            other +
            stay,
    };
}

function getTravelCost(
    option?:
        | DestinationTravelOption,
): number {
    if (!option) {
        return 0;
    }

    return validNonNegative(
        option.minPrice,
    );
}

function getEntryCost(
    destination: NearbyDestination,
): number {
    return validNonNegative(
        destination.entryFee,
    );
}

function getFoodCost(
    destination: NearbyDestination,
): number {
    return validNonNegative(
        destination.foodBudgetMin,
    );
}

function getLocalTransportCost(
    destination: NearbyDestination,
): number {
    return validNonNegative(
        destination.localTransportBudget,
    );
}

function getOtherCost(
    destination: NearbyDestination,
): number {
    return validNonNegative(
        destination.otherBudget,
    );
}

function getStayCost(
    destination: NearbyDestination,
): number {
    if (!destination.stayAvailable) {
        return 0;
    }

    return validNonNegative(
        destination.stayMinPrice,
    );
}

function validNonNegative(
    value: unknown,
): number {
    return typeof value ===
        "number" &&
        Number.isFinite(value) &&
        value >= 0
        ? value
        : 0;
}

function calculateTravelMinutes(
    distanceKm: number,
    option?:
        | DestinationTravelOption,
): number {
    if (distanceKm <= 0) {
        return 0;
    }

    if (
        option &&
        typeof option.durationMinutes ===
            "number" &&
        Number.isFinite(
            option.durationMinutes,
        ) &&
        option.durationMinutes >= 0
    ) {
        return Math.ceil(
            option.durationMinutes * 2,
        );
    }

    const speed =
        getTransportSpeed(
            option?.provider ??
                DEFAULT_TRANSPORT,
        );

    return Math.ceil(
        ((distanceKm / speed) *
            60) *
            2,
    );
}

function getTransportSpeed(
    transport: TransportChoice,
): number {
    switch (transport) {
        case "rapido":
            return 25;
        case "uber":
            return 22;
        case "local":
            return 18;
        case "walk":
            return 5;
        default:
            return 20;
    }
}

function getVisitMinutes(
    destination: NearbyDestination,
): number {
    const value =
        destination.estimatedVisitMinutes;

    if (
        typeof value ===
            "number" &&
        Number.isFinite(value) &&
        value > 0
    ) {
        return value;
    }

    return 90;
}

interface ScoreInput {
    destination: NearbyDestination;
    distanceKm: number;
    estimatedCost: DestinationCostBreakdown;
    remainingBudget: number;
    availableMinutes?: number;
    totalTimeRequired: number;
    budgetFit: boolean;
    timeFit: boolean;
}

function calculateScore({
    destination,
    distanceKm,
    estimatedCost,
    remainingBudget,
    availableMinutes,
    totalTimeRequired,
    budgetFit,
    timeFit,
}: ScoreInput): number {
    let score = 0;

    /*
     * Keep trip suitability balanced:
     * distance + budget + time are stronger signals than
     * generic metadata. Rating and review confidence add
     * quality without dominating the calculation.
     */

    if (budgetFit) {
        score += 25;

        if (remainingBudget > 0) {
            const usage =
                estimatedCost.total /
                remainingBudget;

            if (usage <= 0.25) {
                score += 10;
            } else if (usage <= 0.5) {
                score += 7;
            } else if (usage <= 0.75) {
                score += 4;
            }
        }
    } else {
        score -= 25;
    }

    if (distanceKm <= 2) {
        score += 30;
    } else if (distanceKm <= 5) {
        score += 25;
    } else if (distanceKm <= 10) {
        score += 18;
    } else if (distanceKm <= 20) {
        score += 10;
    } else {
        score += 2;
    }

    if (timeFit) {
        score += 20;

        if (
            availableMinutes !==
                undefined &&
            availableMinutes > 0
        ) {
            const usage =
                totalTimeRequired /
                availableMinutes;

            if (usage <= 0.5) {
                score += 8;
            } else if (usage <= 0.75) {
                score += 5;
            } else if (usage <= 0.9) {
                score += 2;
            }
        }
    } else {
        score -= 20;
    }

    const rating =
        getRating(destination);

    if (rating !== undefined) {
        if (rating >= 4.7) {
            score += 15;
        } else if (rating >= 4.5) {
            score += 12;
        } else if (rating >= 4.0) {
            score += 8;
        } else if (rating >= 3.5) {
            score += 4;
        }
    }

    const reviewCount =
        getReviewCount(destination);

    if (reviewCount !== undefined) {
        if (reviewCount >= 1000) {
            score += 10;
        } else if (reviewCount >= 500) {
            score += 8;
        } else if (reviewCount >= 100) {
            score += 5;
        } else if (reviewCount >= 25) {
            score += 2;
        }
    }

    if (isGoodDestination(destination)) {
        score += 7;
    }

    return Math.max(
        0,
        Math.min(
            100,
            Math.round(score),
        ),
    );
}

function getRating(
    destination: NearbyDestination,
): number | undefined {
    return validOptional(
        destination.rating,
    );
}

function getReviewCount(
    destination: NearbyDestination,
): number | undefined {
    return validOptional(
        destination.reviewCount,
    );
}

function validOptional(
    value: unknown,
): number | undefined {
    return typeof value ===
        "number" &&
        Number.isFinite(value) &&
        value >= 0
        ? value
        : undefined;
}

function isGoodDestination(
    destination: NearbyDestination,
): boolean {
    const text = [
        destination.name ?? "",
        destination.category ?? "",
        destination.description ?? "",
        ...(destination.highlights ?? []),
    ]
        .join(" ")
        .toLowerCase();

    const keywords = [
        "attraction",
        "tourist",
        "landmark",
        "museum",
        "park",
        "beach",
        "fort",
        "palace",
        "temple",
        "church",
        "mosque",
        "monument",
        "heritage",
        "historic",
        "garden",
        "waterfront",
        "viewpoint",
        "zoo",
        "aquarium",
        "market",
    ];

    return keywords.some(
        (keyword) =>
            text.includes(keyword),
    );
}

function getRecommendationLevel(
    score: number,
): RecommendationLevel {
    if (score >= 80) {
        return "best";
    }

    if (score >= 60) {
        return "good";
    }

    if (score >= 40) {
        return "possible";
    }

    return "not-ideal";
}

function getMatchLabel(
    level: RecommendationLevel,
): string {
    switch (level) {
        case "best":
            return "Best match";
        case "good":
            return "Good match";
        case "possible":
            return "Possible";
        case "not-ideal":
            return "Not ideal";
        default:
            return "Recommended";
    }
}

function buildReasons({
    destination,
    distanceKm,
    estimatedCost,
    remainingBudget,
    availableMinutes,
    totalTimeRequired,
    budgetFit,
    timeFit,
}: ScoreInput): RecommendationReason[] {
    const reasons: RecommendationReason[] =
        [];

    if (budgetFit) {
        const remaining =
            Math.max(
                0,
                remainingBudget -
                    estimatedCost.total,
            );

        reasons.push({
            type: "budget",
            text:
                `Fits your budget with about ₹${Math.round(
                    remaining,
                )} remaining.`,
        });
    } else {
        const over =
            estimatedCost.total -
            remainingBudget;

        reasons.push({
            type: "budget",
            text:
                `Estimated cost is about ₹${Math.round(
                    over,
                )} above your remaining budget.`,
        });
    }

    reasons.push({
        type: "distance",
        text:
            distanceKm <= 2
                ? "Very close to your starting point."
                : `${formatDistance(
                      distanceKm,
                  )} from your starting point.`,
    });

    const rating =
        getRating(destination);

    if (rating !== undefined) {
        reasons.push({
            type: "rating",
            text:
                `Rated ${rating.toFixed(
                    1,
                )}/5 by visitors.`,
        });
    }

    if (
        availableMinutes !==
        undefined
    ) {
        reasons.push({
            type: "time",
            text: timeFit
                ? `Fits within your available time of ${Math.round(
                      availableMinutes,
                  )} minutes.`
                : `May require around ${Math.round(
                      totalTimeRequired,
                  )} minutes.`,
        });
    }

    if (estimatedCost.total > 0) {
        reasons.push({
            type: "price",
            text:
                `Estimated total trip cost is around ₹${Math.round(
                    estimatedCost.total,
                )}.`,
        });
    }

    if (isGoodDestination(destination)) {
        reasons.push({
            type: "preference",
            text:
                "Matches a common local discovery category.",
        });
    }

    return reasons;
}

function formatDistance(
    distanceKm: number,
): string {
    if (distanceKm < 1) {
        return `${Math.round(
            distanceKm * 1000,
        )} m`;
    }

    return `${distanceKm.toFixed(
        1,
    )} km`;
}
