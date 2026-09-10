import type {
    FoodItem,
} from "../types/food.types";

export type TravelerType =
    | "tourist"
    | "citizen";

export interface FoodRecommendationInput {
    food: FoodItem;

    budgetInr?: number;

    preferredSpice?: FoodItem["spiceLevel"];

    vegetarian?: boolean;

    preferredCuisine?: string;

    currentMeal?: FoodItem["mealTypes"][number];

    minimumRating?: number;

    preferredFood?: string;

    maxDistanceKm?: number;

    travelerType?:
    | TravelerType;
}

export interface FoodRecommendation {
    food: FoodItem;

    score: number;

    reasons: string[];
}

function matchesFood(
    food: FoodItem,
    preferredFood?: string,
): boolean {
    if (
        !preferredFood
    ) {
        return false;
    }

    const query =
        preferredFood
            .trim()
            .toLowerCase();

    if (!query) {
        return false;
    }

    const name =
        food.name
            .trim()
            .toLowerCase();

    const tags =
        (
            food.tags ?? []
        ).map(
            (tag) =>
                tag
                    .trim()
                    .toLowerCase(),
        );

    return (
        name === query ||
        name.includes(query) ||
        query.includes(name) ||
        tags.some(
            (tag) =>
                tag.includes(query) ||
                query.includes(tag),
        )
    );
}

export function getFoodRecommendations(
    inputs: FoodRecommendationInput[],
): FoodRecommendation[] {
    return inputs
        .map(
            ({
                food,
                budgetInr,
                preferredSpice,
                vegetarian,
                preferredCuisine,
                currentMeal,
                minimumRating,
                preferredFood,
                maxDistanceKm,
                travelerType = "tourist",
            }) => {
                let score = 0;

                const reasons: string[] =
                    [];

                /*
                 * ==============================================
                 * 1. FOOD MATCH
                 * ==============================================
                 */

                if (
                    matchesFood(
                        food,
                        preferredFood,
                    )
                ) {
                    score += 35;

                    reasons.push(
                        "Matches the food you want",
                    );
                }

                /*
                 * ==============================================
                 * 2. BUDGET
                 * ==============================================
                 */

                if (
                    budgetInr !== undefined &&
                    typeof food.priceMinInr ===
                    "number" &&
                    typeof food.priceMaxInr ===
                    "number"
                ) {
                    if (
                        food.priceMinInr <=
                        budgetInr
                    ) {
                        score += 30;

                        reasons.push(
                            "Has an option within your budget",
                        );
                    } else {
                        score -= 40;
                    }
                }

                /*
                 * ==============================================
                 * 3. VEGETARIAN
                 * ==============================================
                 */

                if (
                    vegetarian
                ) {
                    if (
                        food.diet ===
                        "vegetarian" ||
                        food.diet ===
                        "vegan" ||
                        food.isVegan ===
                        true
                    ) {
                        score += 15;

                        reasons.push(
                            "Vegetarian-friendly",
                        );
                    } else if (
                        food.diet !==
                        undefined
                    ) {
                        score -= 35;
                    }
                }

                /*
                 * ==============================================
                 * 4. MEAL TIME
                 * ==============================================
                 */

                if (
                    currentMeal &&
                    food.mealTypes
                        ?.includes(
                            currentMeal,
                        )
                ) {
                    score += 12;

                    reasons.push(
                        `Good for ${currentMeal}`,
                    );
                }

                /*
                 * ==============================================
                 * 5. CUISINE
                 * ==============================================
                 */

                if (
                    preferredCuisine
                ) {
                    const cuisine =
                        preferredCuisine
                            .trim()
                            .toLowerCase();

                    if (
                        food.cuisine?.some(
                            (
                                item,
                            ) =>
                                item
                                    .toLowerCase()
                                    .includes(
                                        cuisine,
                                    ),
                        )
                    ) {
                        score += 10;

                        reasons.push(
                            "Matches your cuisine preference",
                        );
                    }
                }

                /*
                 * ==============================================
                 * 6. SPICE
                 * ==============================================
                 */

                if (
                    preferredSpice &&
                    food.spiceLevel ===
                    preferredSpice
                ) {
                    score += 8;

                    reasons.push(
                        "Matches your spice preference",
                    );
                }

                /*
                 * ==============================================
                 * 7. RATING
                 * ==============================================
                 */

                if (
                    food.rating !==
                    undefined
                ) {
                    score += Math.round(
                        food.rating *
                        2,
                    );

                    if (
                        minimumRating !==
                        undefined &&
                        food.rating >=
                        minimumRating
                    ) {
                        score += 8;

                        reasons.push(
                            "Highly rated",
                        );
                    }
                }

                /*
                 * ==============================================
                 * 8. CITIZEN / LOCAL BEHAVIOR
                 * ==============================================
                 *
                 * Citizens care more about:
                 *
                 * - famous local food
                 * - authentic places
                 * - willingness to travel farther
                 */

                if (
                    travelerType ===
                    "citizen"
                ) {
                    const tags =
                        (
                            food.tags ??
                            []
                        ).map(
                            (tag) =>
                                tag
                                    .toLowerCase(),
                        );

                    if (
                        tags.some(
                            (tag) =>
                                tag.includes(
                                    "famous",
                                ) ||
                                tag.includes(
                                    "popular",
                                )
                        )
                    ) {
                        score += 18;

                        reasons.push(
                            "Popular local choice",
                        );
                    }

                    if (
                        tags.some(
                            (tag) =>
                                tag.includes(
                                    "local",
                                ) ||
                                tag.includes(
                                    "specialty",
                                )
                        )
                    ) {
                        score += 18;

                        reasons.push(
                            "Known local specialty",
                        );
                    }

                    /*
                     * Citizens can travel farther,
                     * so distance is a smaller penalty.
                     */
                    if (
                        food.distanceKm !==
                        undefined
                    ) {
                        if (
                            food.distanceKm <=
                            3
                        ) {
                            score += 5;
                        } else if (
                            food.distanceKm <=
                            10
                        ) {
                            score += 3;
                        }
                    }
                }

                /*
                 * ==============================================
                 * 9. TOURIST BEHAVIOR
                 * ==============================================
                 *
                 * Tourists care more about:
                 *
                 * - nearby food
                 * - easy access
                 * - tourist-area convenience
                 */

                if (
                    travelerType ===
                    "tourist"
                ) {
                    if (
                        food.distanceKm !==
                        undefined
                    ) {
                        if (
                            food.distanceKm <=
                            1
                        ) {
                            score += 15;

                            reasons.push(
                                "Very close to your location",
                            );
                        } else if (
                            food.distanceKm <=
                            3
                        ) {
                            score += 10;

                            reasons.push(
                                "Close to your location",
                            );
                        } else if (
                            food.distanceKm <=
                            5
                        ) {
                            score += 5;
                        }
                    }
                }

                /*
                 * ==============================================
                 * 10. DISTANCE LIMIT
                 * ==============================================
                 */

                if (
                    maxDistanceKm !==
                    undefined &&
                    food.distanceKm !==
                    undefined &&
                    food.distanceKm >
                    maxDistanceKm
                ) {
                    score -= 25;
                }

                return {
                    food,
                    score,
                    reasons,
                };
            },
        )
        .sort(
            (a, b) =>
                b.score -
                a.score,
        );
}