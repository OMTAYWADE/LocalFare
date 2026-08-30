import type {
    FoodItem,
    MealType,
    SpiceLevel,
} from "../types/food.types";

export interface FoodRecommendationInput {
    food: FoodItem;

    preferredFood?: string;

    budgetInr?: number;

    preferredSpice?: SpiceLevel;

    vegetarian?: boolean;

    preferredCuisine?: string;

    currentMeal?: MealType;

    minimumRating?: number;

    maxDistanceKm?: number;
}

export interface FoodRecommendation {
    food: FoodItem;

    score: number;

    reasons: string[];
}

export function getFoodRecommendations(
    inputs: FoodRecommendationInput[],
): FoodRecommendation[] {
    return inputs
        .map(
            ({
                food,
                preferredFood,
                budgetInr,
                preferredSpice,
                vegetarian,
                preferredCuisine,
                currentMeal,
                minimumRating,
                maxDistanceKm,
            }) => {
                let score = 0;

                const reasons: string[] =
                    [];

                /*
                 * FOOD NAME
                 */
                if (
                    preferredFood?.trim()
                ) {
                    const query =
                        preferredFood
                            .trim()
                            .toLowerCase();

                    const foodName =
                        food.name
                            .toLowerCase();

                    const restaurantName =
                        food.restaurantName
                            ?.toLowerCase() ??
                        "";

                    const tags =
                        food.tags ?? [];

                    const matchesFood =
                        foodName.includes(
                            query,
                        );

                    const matchesRestaurant =
                        restaurantName.includes(
                            query,
                        );

                    const matchesTag =
                        tags.some(
                            (tag) =>
                                tag
                                    .toLowerCase()
                                    .includes(
                                        query,
                                    ),
                        );

                    if (
                        matchesFood ||
                        matchesRestaurant ||
                        matchesTag
                    ) {
                        score += 40;

                        reasons.push(
                            "Matches what you searched for",
                        );
                    }
                }

                /*
                 * DISTANCE
                 */
                if (
                    food.distanceKm !==
                    undefined
                ) {
                    if (
                        food.distanceKm <=
                        1
                    ) {
                        score += 30;

                        reasons.push(
                            "Very close to you",
                        );
                    } else if (
                        food.distanceKm <=
                        3
                    ) {
                        score += 20;

                        reasons.push(
                            "Close to you",
                        );
                    } else if (
                        food.distanceKm <=
                        5
                    ) {
                        score += 10;
                    }

                    if (
                        maxDistanceKm !==
                            undefined &&
                        food.distanceKm <=
                            maxDistanceKm
                    ) {
                        score += 10;

                        reasons.push(
                            "Within your preferred distance",
                        );
                    }
                }

                /*
                 * VEGETARIAN
                 */
                if (vegetarian) {
                    if (
                        food.diet ===
                            "vegetarian" ||
                        food.diet ===
                            "vegan" ||
                        food.isVegan ===
                            true
                    ) {
                        score += 25;

                        reasons.push(
                            "Vegetarian-friendly",
                        );
                    }
                }

                /*
                 * SPICE
                 */
                if (
                    preferredSpice &&
                    food.spiceLevel ===
                        preferredSpice
                ) {
                    score += 15;

                    reasons.push(
                        "Matches your spice preference",
                    );
                }

                /*
                 * CUISINE
                 */
                if (
                    preferredCuisine
                ) {
                    const cuisine =
                        preferredCuisine
                            .trim()
                            .toLowerCase();

                    const matches =
                        food.cuisine.some(
                            (item) =>
                                item
                                    .toLowerCase()
                                    .includes(
                                        cuisine,
                                    ),
                        );

                    if (matches) {
                        score += 15;

                        reasons.push(
                            "Matches your cuisine preference",
                        );
                    }
                }

                /*
                 * MEAL TIME
                 */
                if (currentMeal) {
                    if (
                        food.mealTypes.includes(
                            currentMeal,
                        )
                    ) {
                        score += 15;

                        reasons.push(
                            `Suitable for ${currentMeal}`,
                        );
                    }
                }

                /*
                 * RATING
                 */
                if (
                    food.rating !==
                    undefined
                ) {
                    score += Math.round(
                        food.rating * 4,
                    );

                    if (
                        minimumRating !==
                            undefined &&
                        food.rating >=
                            minimumRating
                    ) {
                        score += 15;

                        reasons.push(
                            "Highly rated",
                        );
                    }
                }

                /*
                 * PRICE
                 *
                 * Only use price if we have
                 * real price information.
                 */
                if (
                    budgetInr !==
                        undefined &&
                    food.priceInr !==
                        undefined
                ) {
                    if (
                        food.priceInr <=
                        budgetInr
                    ) {
                        score += 20;

                        reasons.push(
                            "Fits your budget",
                        );
                    } else {
                        score -= 20;
                    }
                }

                /*
                 * DATA QUALITY
                 */
                if (
                    food.restaurantName
                ) {
                    score += 5;

                    reasons.push(
                        "Real nearby place",
                    );
                }

                return {
                    food,
                    score,
                    reasons:
                        [
                            ...new Set(
                                reasons,
                            ),
                        ],
                };
            },
        )
        .sort(
            (a, b) =>
                b.score - a.score,
        );
}