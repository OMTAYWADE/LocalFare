import type { FoodItem } from "../types/food.types";

export interface FoodRecommendationInput {
    food: FoodItem;
    budgetInr?: number;
    preferredSpice?: FoodItem["spiceLevel"];
    vegetarian?: boolean;
    preferredCuisine?: string;
    currentMeal?: FoodItem["mealTypes"][number];
    minimumRating?: number;
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
                budgetInr,
                preferredSpice,
                vegetarian,
                preferredCuisine,
                currentMeal,
                minimumRating,
            }) => {
                let score = 0;

                const reasons: string[] = [];

                // ------------------------------------------------
                // BUDGET
                // ------------------------------------------------

                if (budgetInr !== undefined) {
                    if (food.priceInr <= budgetInr) {
                        score += 30;

                        reasons.push(
                            "Fits your budget",
                        );

                        const savings =
                            budgetInr -
                            food.priceInr;

                        if (savings >= 100) {
                            score += 5;

                            reasons.push(
                                `₹${savings} left in your budget`,
                            );
                        }
                    } else {
                        score -= 35;
                    }
                }

                // ------------------------------------------------
                // MEAL TIME
                // ------------------------------------------------

                if (currentMeal) {
                    if (
                        food.mealTypes.includes(
                            currentMeal,
                        )
                    ) {
                        score += 25;

                        reasons.push(
                            `Good for ${currentMeal}`,
                        );
                    } else {
                        score -= 10;
                    }
                }

                // ------------------------------------------------
                // VEGETARIAN
                // ------------------------------------------------

                if (vegetarian) {
                    if (
                        food.diet ===
                        "vegetarian"
                    ) {
                        score += 20;

                        reasons.push(
                            "Vegetarian choice",
                        );
                    } else if (
                        food.diet ===
                        "vegan"
                    ) {
                        score += 20;

                        reasons.push(
                            "Vegan choice",
                        );
                    } else {
                        score -= 40;
                    }
                }

                // ------------------------------------------------
                // SPICE
                // ------------------------------------------------

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

                // ------------------------------------------------
                // CUISINE
                // ------------------------------------------------

                if (
                    preferredCuisine &&
                    food.cuisine.includes(
                        preferredCuisine as FoodItem[
                            "cuisine"
                        ][number],
                    )
                ) {
                    score += 15;

                    reasons.push(
                        "Matches your cuisine preference",
                    );
                }

                // ------------------------------------------------
                // RATING
                // ------------------------------------------------

                if (
                    minimumRating !== undefined &&
                    food.rating !== undefined
                ) {
                    if (
                        food.rating >=
                        minimumRating
                    ) {
                        score += 10;

                        reasons.push(
                            "Highly rated",
                        );
                    }
                }

                // ------------------------------------------------
                // GENERAL QUALITY
                // ------------------------------------------------

                if (
                    food.rating !== undefined
                ) {
                    score += Math.round(
                        food.rating * 2,
                    );
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
                b.score - a.score,
        );
}