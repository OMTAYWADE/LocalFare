import "server-only";

import type {
    FoodItem,
} from "../types/food.types";

import {
    classifyFood,
} from "./foodClassification.service";

import {
    enrichRecognizedFood,
} from "./foodEnrichment.service";

import {
    searchUSDAFood,
} from "./usdaFood.service";

function mergeStringArrays(
    ...arrays: Array<
        string[] | undefined
    >
): string[] | undefined {
    const values =
        Array.from(
            new Set(
                arrays.flatMap(
                    (array) =>
                        array ?? [],
                ),
            ),
        );

    return values.length > 0
        ? values
        : undefined;
}

export async function getFoodIntelligence(
    foodName: string,
): Promise<FoodItem> {
    const classification =
        classifyFood(foodName);

    /*
     * Wikipedia + Wikimedia
     */
    const enriched =
        await enrichRecognizedFood(
            foodName,
        );

    /*
     * USDA is supplementary.
     *
     * It does NOT control whether food is
     * spicy, vegan, Jain etc.
     */
    let nutrition =
        enriched.nutrition;

    try {
        const usda =
            await searchUSDAFood(
                foodName,
            );

        if (usda?.nutrition) {
            nutrition =
                usda.nutrition;
        }
    } catch (error) {
        console.warn(
            `[FoodIntelligence] USDA lookup failed for "${foodName}"`,
            error,
        );
    }

    const sources =
        new Set(
            enriched.informationSources ??
                [],
        );

    if (classification) {
        sources.add(
            "FairTrip Food Knowledge",
        );
    }

    if (nutrition) {
        sources.add(
            "USDA FoodData Central",
        );
    }

    return {
        ...enriched,

        /*
         * Classification takes priority
         * over generic API guesses.
         */
        cuisine:
            classification?.cuisine ??
            enriched.cuisine ??
            [],

        diet:
            classification?.diet ??
            enriched.diet,

        spiceLevel:
            classification?.spiceLevel ??
            enriched.spiceLevel,

        mealTypes:
            classification?.mealTypes ??
            enriched.mealTypes ??
            [],

        ingredients:
            mergeStringArrays(
                classification?.ingredients,
                enriched.ingredients,
            ),

        tags:
            mergeStringArrays(
                classification?.tags,
                enriched.tags,
            ),

        tasteProfile:
            classification?.tasteProfile ??
            enriched.tasteProfile,

        texture:
            classification?.texture ??
            enriched.texture,

        servingStyle:
            classification?.servingStyle ??
            enriched.servingStyle,

        preparationMethod:
            classification?.preparationMethod ??
            enriched.preparationMethod,

        allergens:
            mergeStringArrays(
                classification?.allergens,
                enriched.allergens,
            ),

        origin:
            classification?.origin ??
            enriched.origin,

        goodFor:
            classification?.goodFor ??
            enriched.goodFor,

        isVegan:
            classification?.isVegan ??
            enriched.isVegan,

        containsEgg:
            classification?.containsEgg ??
            enriched.containsEgg,

        containsOnion:
            classification?.containsOnion ??
            enriched.containsOnion,

        containsGarlic:
            classification?.containsGarlic ??
            enriched.containsGarlic,

        jainSuitable:
            classification?.jainSuitable ??
            enriched.jainSuitable,

        isPopular:
            classification?.isPopular ??
            enriched.isPopular,

        popularityLevel:
            classification?.popularityLevel ??
            enriched.popularityLevel,

        popularityScore:
            classification?.popularityScore ??
            enriched.popularityScore,

        popularityReason:
            classification?.popularityReason ??
            enriched.popularityReason,

        nutrition,

        /*
         * Price is deliberately secondary.
         */
        priceMinInr:
            classification?.priceMinInr ??
            enriched.priceMinInr,

        priceMaxInr:
            classification?.priceMaxInr ??
            enriched.priceMaxInr,

        priceRange:
            classification?.priceRange ??
            enriched.priceRange,

        priceEstimated:
            classification?.priceMinInr !==
                undefined ||
            classification?.priceMaxInr !==
                undefined
                ? true
                : enriched.priceEstimated,

        priceRangeEstimated:
            classification?.priceMinInr !==
                undefined ||
            classification?.priceMaxInr !==
                undefined
                ? true
                : enriched.priceRangeEstimated,

        priceSource:
            classification?.priceMinInr !==
                undefined ||
            classification?.priceMaxInr !==
                undefined
                ? "estimated"
                : enriched.priceSource,

        informationSources:
            Array.from(sources),
    };
}

export async function getFoodIntelligenceBatch(
    foodNames: string[],
): Promise<FoodItem[]> {
    const uniqueNames =
        Array.from(
            new Set(
                foodNames
                    .map(
                        (name) =>
                            name.trim(),
                    )
                    .filter(Boolean),
            ),
        );

    return Promise.all(
        uniqueNames.map(
            (name) =>
                getFoodIntelligence(
                    name,
                ),
        ),
    );
}