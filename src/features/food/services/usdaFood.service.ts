import "server-only";

import type {
    FoodNutrition,
} from "../types/food.types";

const USDA_BASE_URL =
    "https://api.nal.usda.gov/fdc/v1";

interface UsdaSearchResponse {
    foods?: UsdaFood[];
}

interface UsdaFood {
    fdcId: number;

    description?: string;

    foodNutrients?: UsdaNutrient[];
}

interface UsdaNutrient {
    nutrientId?: number;

    nutrientName?: string;

    value?: number;

    unitName?: string;
}

export interface USDAFoodResult {
    fdcId: number;

    description?: string;

    nutrition?: FoodNutrition;
}

function getNutritionValue(
    nutrients:
        | UsdaNutrient[]
        | undefined,
    nutrientId: number,
): number | undefined {
    const nutrient =
        nutrients?.find(
            (item) =>
                item.nutrientId ===
                nutrientId,
        );

    if (
        typeof nutrient?.value !==
        "number"
    ) {
        return undefined;
    }

    return Math.round(
        nutrient.value * 100,
    ) / 100;
}

function mapNutrition(
    nutrients:
        | UsdaNutrient[]
        | undefined,
): FoodNutrition | undefined {
    if (!nutrients) {
        return undefined;
    }

    const nutrition: FoodNutrition = {
        calories:
            getNutritionValue(
                nutrients,
                1008,
            ),

        proteinGrams:
            getNutritionValue(
                nutrients,
                1003,
            ),

        fatGrams:
            getNutritionValue(
                nutrients,
                1004,
            ),

        carbohydratesGrams:
            getNutritionValue(
                nutrients,
                1005,
            ),

        fiberGrams:
            getNutritionValue(
                nutrients,
                1079,
            ),

        sugarGrams:
            getNutritionValue(
                nutrients,
                2000,
            ),

        sodiumMg:
            getNutritionValue(
                nutrients,
                1093,
            ),
    };

    const hasValue =
        Object.values(
            nutrition,
        ).some(
            (value) =>
                typeof value ===
                "number",
        );

    return hasValue
        ? nutrition
        : undefined;
}

export async function searchUSDAFood(
    foodName: string,
): Promise<USDAFoodResult | null> {
    const apiKey =
        process.env
            .USDA_FDC_API_KEY;

    if (!apiKey) {
        return null;
    }

    const params =
        new URLSearchParams({
            api_key: apiKey,
            query: foodName,
            pageSize: "5",
        });

    try {
        const response =
            await fetch(
                `${USDA_BASE_URL}/foods/search?${params.toString()}`,
                {
                    headers: {
                        Accept:
                            "application/json",
                    },
                    next: {
                        revalidate:
                            60 * 60 * 24,
                    },
                },
            );

        if (!response.ok) {
            return null;
        }

        const data =
            (await response.json()) as UsdaSearchResponse;

        const food =
            data.foods?.[0];

        if (!food) {
            return null;
        }

        return {
            fdcId:
                food.fdcId,

            description:
                food.description,

            nutrition:
                mapNutrition(
                    food.foodNutrients,
                ),
        };
    } catch {
        return null;
    }
}