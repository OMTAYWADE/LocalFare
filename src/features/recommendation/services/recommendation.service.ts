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

/*
|--------------------------------------------------------------------------
| Configuration
|--------------------------------------------------------------------------
*/

const DEFAULT_TRANSPORT: TransportChoice = "rapido";

/*
|--------------------------------------------------------------------------
| Main recommendation function
|--------------------------------------------------------------------------
*/

export function getDestinationRecommendations(
    inputs: RecommendationInput[],
): DestinationRecommendation[] {
    return inputs
        .map((input) =>
            buildDestinationRecommendation(input),
        )
        .sort((a, b) => b.score - a.score);
}

/*
|--------------------------------------------------------------------------
| Build recommendation
|--------------------------------------------------------------------------
*/

function buildDestinationRecommendation(
    input: RecommendationInput,
): DestinationRecommendation {
    const {
        destination,
        remainingBudget,
        availableMinutes,
        preferredTransport,
    } = input;

    /*
    |--------------------------------------------------------------------------
    | Distance
    |--------------------------------------------------------------------------
    */

    const distanceKm =
        getDistanceKm(destination);

    /*
    |--------------------------------------------------------------------------
    | Transport
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Cost
    |--------------------------------------------------------------------------
    */

    const estimatedCost =
        calculateDestinationCost(
            destination,
            bestTravelOption,
        );

    /*
    |--------------------------------------------------------------------------
    | Budget
    |--------------------------------------------------------------------------
    */

    const budgetFit =
        estimatedCost.total <=
        remainingBudget;

    /*
    |--------------------------------------------------------------------------
    | Time
    |--------------------------------------------------------------------------
    */

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
        availableMinutes === undefined ||
        totalTimeRequired <=
            availableMinutes;

    /*
    |--------------------------------------------------------------------------
    | Score
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Recommendation level
    |--------------------------------------------------------------------------
    */

    const level =
        getRecommendationLevel(score);

    /*
    |--------------------------------------------------------------------------
    | Reasons
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Remaining budget
    |--------------------------------------------------------------------------
    */

    const budgetRemainingAfterVisit =
        remainingBudget -
        estimatedCost.total;

    return {
        destination,
        estimatedCost,
        score,
        level,
        reasons,
        budgetRemainingAfterVisit,
        budgetFit,
        timeFit,
        matchLabel:
            getMatchLabel(level),
        selectedTransport,
    };
}

/*
|--------------------------------------------------------------------------
| Distance
|--------------------------------------------------------------------------
*/

function getDistanceKm(
    destination: NearbyDestination,
): number {
    const distance =
        destination.distanceKm;

    if (
        typeof distance === "number" &&
        Number.isFinite(distance) &&
        distance >= 0
    ) {
        return distance;
    }

    return 0;
}

/*
|--------------------------------------------------------------------------
| Best transport option
|--------------------------------------------------------------------------
|
| Priority:
|
| 1. User's preferred transport
| 2. Cheapest available transport
|
|--------------------------------------------------------------------------
*/

function getBestTravelOption(
    options: DestinationTravelOption[],
    preferredTransport: TransportChoice,
): DestinationTravelOption | undefined {
    if (options.length === 0) {
        return undefined;
    }

    /*
    |--------------------------------------------------------------------------
    | Try preferred transport first
    |--------------------------------------------------------------------------
    */

    const preferred =
        options.find(
            (option) =>
                option.provider ===
                preferredTransport,
        );

    if (preferred) {
        return preferred;
    }

    /*
    |--------------------------------------------------------------------------
    | Otherwise choose cheapest option
    |--------------------------------------------------------------------------
    */

    return [...options].sort(
        (a, b) =>
            a.minPrice -
            b.minPrice,
    )[0];
}

/*
|--------------------------------------------------------------------------
| Destination cost
|--------------------------------------------------------------------------
*/

function calculateDestinationCost(
    destination: NearbyDestination,
    travelOption?: DestinationTravelOption,
): DestinationCostBreakdown {
    /*
    |--------------------------------------------------------------------------
    | Travel
    |--------------------------------------------------------------------------
    */

    const travel =
        getTravelCost(travelOption);

    /*
    |--------------------------------------------------------------------------
    | Entry
    |--------------------------------------------------------------------------
    */

    const entry =
        getEntryCost(destination);

    /*
    |--------------------------------------------------------------------------
    | Food
    |--------------------------------------------------------------------------
    |
    | Use minimum food budget for recommendation.
    |
    */

    const food =
        getFoodCost(destination);

    /*
    |--------------------------------------------------------------------------
    | Local transport
    |--------------------------------------------------------------------------
    */

    const localTransport =
        getLocalTransportCost(
            destination,
        );

    /*
    |--------------------------------------------------------------------------
    | Other
    |--------------------------------------------------------------------------
    */

    const other =
        getOtherCost(destination);

    /*
    |--------------------------------------------------------------------------
    | Stay
    |--------------------------------------------------------------------------
    |
    | For a normal visit, stay is zero.
    | Stay price is only considered when stay is available.
    |
    */

    const stay =
        getStayCost(destination);

    /*
    |--------------------------------------------------------------------------
    | Total
    |--------------------------------------------------------------------------
    */

    const total =
        travel +
        entry +
        food +
        localTransport +
        other +
        stay;

    return {
        travel,
        entry,
        food,
        localTransport,
        other,
        stay,
        total,
    };
}

/*
|--------------------------------------------------------------------------
| Travel cost
|--------------------------------------------------------------------------
*/

function getTravelCost(
    travelOption?: DestinationTravelOption,
): number {
    if (!travelOption) {
        return 0;
    }

    const price =
        travelOption.minPrice;

    if (
        typeof price !== "number" ||
        !Number.isFinite(price) ||
        price < 0
    ) {
        return 0;
    }

    return price;
}

/*
|--------------------------------------------------------------------------
| Entry cost
|--------------------------------------------------------------------------
*/

function getEntryCost(
    destination: NearbyDestination,
): number {
    const value =
        destination.entryFee;

    if (
        typeof value === "number" &&
        Number.isFinite(value) &&
        value >= 0
    ) {
        return value;
    }

    return 0;
}

/*
|--------------------------------------------------------------------------
| Food cost
|--------------------------------------------------------------------------
*/

function getFoodCost(
    destination: NearbyDestination,
): number {
    const value =
        destination.foodBudgetMin;

    if (
        typeof value === "number" &&
        Number.isFinite(value) &&
        value >= 0
    ) {
        return value;
    }

    return 0;
}

/*
|--------------------------------------------------------------------------
| Local transport cost
|--------------------------------------------------------------------------
*/

function getLocalTransportCost(
    destination: NearbyDestination,
): number {
    const value =
        destination.localTransportBudget;

    if (
        typeof value === "number" &&
        Number.isFinite(value) &&
        value >= 0
    ) {
        return value;
    }

    return 0;
}

/*
|--------------------------------------------------------------------------
| Other cost
|--------------------------------------------------------------------------
*/

function getOtherCost(
    destination: NearbyDestination,
): number {
    const value =
        destination.otherBudget;

    if (
        typeof value === "number" &&
        Number.isFinite(value) &&
        value >= 0
    ) {
        return value;
    }

    return 0;
}

/*
|--------------------------------------------------------------------------
| Stay cost
|--------------------------------------------------------------------------
*/

function getStayCost(
    destination: NearbyDestination,
): number {
    if (!destination.stayAvailable) {
        return 0;
    }

    const value =
        destination.stayMinPrice;

    if (
        typeof value === "number" &&
        Number.isFinite(value) &&
        value >= 0
    ) {
        return value;
    }

    return 0;
}

/*
|--------------------------------------------------------------------------
| Travel time
|--------------------------------------------------------------------------
*/

function calculateTravelMinutes(
    distanceKm: number,
    travelOption?: DestinationTravelOption,
): number {
    if (distanceKm <= 0) {
        return 0;
    }

    /*
    |--------------------------------------------------------------------------
    | If the real transport service supplied duration,
    | use it instead of calculating an artificial duration.
    |--------------------------------------------------------------------------
    */

    if (
        travelOption &&
        typeof travelOption.durationMinutes ===
            "number" &&
        Number.isFinite(
            travelOption.durationMinutes,
        ) &&
        travelOption.durationMinutes >= 0
    ) {
        /*
        | Destination travel option represents one-way
        | travel time, so calculate round trip.
        */

        return Math.ceil(
            travelOption.durationMinutes * 2,
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Fallback speeds
    |--------------------------------------------------------------------------
    */

    const speed =
        getTransportSpeed(
            travelOption?.provider ??
                DEFAULT_TRANSPORT,
        );

    const oneWayMinutes =
        (distanceKm / speed) * 60;

    return Math.ceil(
        oneWayMinutes * 2,
    );
}

/*
|--------------------------------------------------------------------------
| Transport speed fallback
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Visit duration
|--------------------------------------------------------------------------
*/

function getVisitMinutes(
    destination: NearbyDestination,
): number {
    const value =
        destination.estimatedVisitMinutes;

    if (
        typeof value === "number" &&
        Number.isFinite(value) &&
        value > 0
    ) {
        return value;
    }

    /*
    |--------------------------------------------------------------------------
    | Safe fallback
    |--------------------------------------------------------------------------
    */

    return 90;
}

/*
|--------------------------------------------------------------------------
| Score input
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Calculate score
|--------------------------------------------------------------------------
*/

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
    |--------------------------------------------------------------------------
    | Budget
    |--------------------------------------------------------------------------
    */

    if (budgetFit) {
        score += 30;

        if (remainingBudget > 0) {
            const usage =
                estimatedCost.total /
                remainingBudget;

            if (usage <= 0.25) {
                score += 10;
            } else if (usage <= 0.5) {
                score += 6;
            } else if (usage <= 0.75) {
                score += 3;
            }
        }
    } else {
        score -= 30;
    }

    /*
    |--------------------------------------------------------------------------
    | Distance
    |--------------------------------------------------------------------------
    */

    if (distanceKm <= 2) {
        score += 25;
    } else if (distanceKm <= 5) {
        score += 20;
    } else if (distanceKm <= 10) {
        score += 14;
    } else if (distanceKm <= 20) {
        score += 8;
    } else {
        score += 2;
    }

    /*
    |--------------------------------------------------------------------------
    | Time
    |--------------------------------------------------------------------------
    */

    if (timeFit) {
        score += 20;

        if (
            availableMinutes !==
                undefined &&
            availableMinutes > 0
        ) {
            const timeUsage =
                totalTimeRequired /
                availableMinutes;

            if (timeUsage <= 0.5) {
                score += 8;
            } else if (timeUsage <= 0.75) {
                score += 5;
            } else if (timeUsage <= 0.9) {
                score += 2;
            }
        }
    } else {
        score -= 25;
    }

    /*
    |--------------------------------------------------------------------------
    | Rating
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Review count
    |--------------------------------------------------------------------------
    */

    const reviewCount =
        getReviewCount(destination);

    if (reviewCount !== undefined) {
        if (reviewCount >= 1000) {
            score += 10;
        } else if (reviewCount >= 500) {
            score += 7;
        } else if (reviewCount >= 100) {
            score += 4;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Destination relevance
    |--------------------------------------------------------------------------
    */

    if (
        isGoodDestination(
            destination,
        )
    ) {
        score += 10;
    }


    /*
    |--------------------------------------------------------------------------
    | Clamp score
    |--------------------------------------------------------------------------
    */

    return Math.max(
        0,
        Math.min(
            100,
            Math.round(score),
        ),
    );
}

/*
|--------------------------------------------------------------------------
| Rating
|--------------------------------------------------------------------------
*/

function getRating(
    destination: NearbyDestination,
): number | undefined {
    const value =
        destination.rating;

    if (
        typeof value === "number" &&
        Number.isFinite(value) &&
        value >= 0
    ) {
        return value;
    }

    return undefined;
}

/*
|--------------------------------------------------------------------------
| Review count
|--------------------------------------------------------------------------
*/

function getReviewCount(
    destination: NearbyDestination,
): number | undefined {
    const value =
        destination.reviewCount;

    if (
        typeof value === "number" &&
        Number.isFinite(value) &&
        value >= 0
    ) {
        return value;
    }

    return undefined;
}

/*
|--------------------------------------------------------------------------
| Destination relevance
|--------------------------------------------------------------------------
*/

function isGoodDestination(
    destination: NearbyDestination,
): boolean {
    const text = `
        ${destination.name}
        ${destination.category}
        ${destination.description}
        ${destination.highlights.join(" ")}
    `.toLowerCase();

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

/*
|--------------------------------------------------------------------------
| Recommendation level
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Match label
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Recommendation reasons
|--------------------------------------------------------------------------
*/

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

    /*
    |--------------------------------------------------------------------------
    | Budget
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Distance
    |--------------------------------------------------------------------------
    */

    reasons.push({
        type: "distance",
        text:
            distanceKm <= 2
                ? "Very close to your starting point."
                : `${formatDistance(
                      distanceKm,
                  )} from your starting point.`,
    });

    /*
    |--------------------------------------------------------------------------
    | Rating
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Time
    |--------------------------------------------------------------------------
    */

    if (
        availableMinutes !== undefined
    ) {
        if (timeFit) {
            reasons.push({
                type: "time",
                text:
                    `Fits within your available time of ${Math.round(
                        availableMinutes,
                    )} minutes.`,
            });
        } else {
            reasons.push({
                type: "time",
                text:
                    `May require around ${Math.round(
                        totalTimeRequired,
                    )} minutes.`,
            });
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Price
    |--------------------------------------------------------------------------
    */

    if (estimatedCost.total > 0) {
        reasons.push({
            type: "price",
            text:
                `Estimated trip cost is around ₹${Math.round(
                    estimatedCost.total,
                )}.`,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Preference / relevance
    |--------------------------------------------------------------------------
    */

    if (
        isGoodDestination(
            destination,
        )
    ) {
        reasons.push({
            type: "preference",
            text:
                "Matches common tourist and discovery interests.",
        });
    }

    return reasons;
}

/*
|--------------------------------------------------------------------------
| Distance formatting
|--------------------------------------------------------------------------
*/

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