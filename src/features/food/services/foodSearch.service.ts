import { foodItems, } from "../data/food-categories";
import type { FoodItem, } from "../types/food.types";

export interface FoodSearchOptions {
    query?: string;
    maxPriceInr?: number;
    mealType?: FoodItem["mealTypes"][number];
    vegetarian?: boolean;
    spiceLevel?: FoodItem["spiceLevel"];
}

export function searchFood({ query, maxPriceInr, mealType, vegetarian, spiceLevel, }: FoodSearchOptions = {}): FoodItem[] {
    const normalizedQuery = query?.trim().toLowerCase() || "";

    return foodItems.filter((food) => {

        //  Search name, cuisine,description and tags.
        const matchesQuery = !normalizedQuery || food.name.toLowerCase().includes(normalizedQuery,) ||
            food.description?.toLowerCase().includes(normalizedQuery,) ||
            food.cuisine.some((cuisine) => cuisine.includes(normalizedQuery,),) ||
            food.tags?.some((tag) => tag.includes(normalizedQuery,),);

        if (!matchesQuery) {
            return false;
        }

        if (maxPriceInr !== undefined && food.priceInr > maxPriceInr) {
            return false;
        }

        if (mealType && !food.mealTypes.includes(mealType,)) {
            return false;
        }

        if (vegetarian && food.diet !== "vegetarian") {
            return false;
        }

        if (spiceLevel && food.spiceLevel !== spiceLevel) {
            return false;
        }

        return true;
    },
    );
}