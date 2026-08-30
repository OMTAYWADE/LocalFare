import type { FoodItem } from "../types/food.types";

import {
    findFoodImage,
} from "./foodImage.service";

interface WikipediaResponse {
    extract?: string;

    thumbnail?: {
        source?: string;
    };
}

async function getWikipediaFoodInfo(
    foodName: string,
): Promise<{
    description?: string;
    imageUrl?: string;
}> {
    try {
        const url =
            "https://en.wikipedia.org/api/rest_v1/page/summary/" +
            encodeURIComponent(foodName);

        const response =
            await fetch(
                url,
                {
                    headers: {
                        Accept:
                            "application/json",
                    },

                    next: {
                        revalidate: 86400,
                    },
                },
            );

        if (!response.ok) {
            return {};
        }

        const data =
            (await response.json()) as WikipediaResponse;

        return {
            description:
                data.extract,

            imageUrl:
                data.thumbnail?.source,
        };
    } catch (error) {
        console.error(
            "Wikipedia lookup failed:",
            error,
        );

        return {};
    }
}

export async function enrichRecognizedFood(
    foodName: string,
): Promise<FoodItem> {
    const name =
        foodName.trim();

    if (!name) {
        throw new Error(
            "Food name is required.",
        );
    }

    const [
        wikipedia,
        wikimediaImage,
    ] = await Promise.all([
        getWikipediaFoodInfo(name),

        findFoodImage(name),
    ]);

    return {
        id:
            `recognized-${name
                .toLowerCase()
                .replace(
                    /[^a-z0-9]+/g,
                    "-",
                )
                .replace(
                    /^-|-$/g,
                    "",
                )}`,

        name,

        description:
            wikipedia.description,

        cuisine: [],

        /*
         * Don't guess.
         */
        diet:
            undefined,

        spiceLevel:
            undefined,

        mealTypes: [],

        priceInr:
            undefined,

        rating:
            undefined,

        imageUrl:
            wikimediaImage ??
            wikipedia.imageUrl,

        tags: [
            "recognized-food",
        ],
    };
}