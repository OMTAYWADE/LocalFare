import "server-only";

import type {
    FoodItem,
    FoodCuisine
} from "../types/food.types";

interface FoursquareCategory {
    id?: string;

    name?: string;
}

interface FoursquareLocation {
    address?: string;

    locality?: string;

    region?: string;

    country?: string;

    postcode?: string;

    formatted_address?: string;
}

interface FoursquareHours {
    display?: string;

    open_now?: boolean;

    regular?: Array<{
        close?: string;

        day?: number;

        open?: string;
    }>;
}

interface FoursquarePlace {
    fsq_place_id?: string;

    name?: string;

    distance?: number;

    rating?: number;

    price?: number | string;

    popularity?:
        | number
        | string;

    location?: FoursquareLocation;

    geocodes?: {
        main?: {
            latitude?: number;
            longitude?: number;
        };
    };

    categories?: FoursquareCategory[];

    website?: string;

    tel?: string;

    description?: string;

    hours?: FoursquareHours;
}

interface FoursquareSearchResponse {
    results?: FoursquarePlace[];
}

/*
 * =========================================================
 * PUBLIC RESULT
 * =========================================================
 */

export interface FoursquareFoodResult {
    food: FoodItem;

    fsqPlaceId: string;

    raw: FoursquarePlace;
}

/*
 * =========================================================
 * ENV
 * =========================================================
 */

function getApiKey(): string {
    const apiKey =
        process.env.FOURSQUARE_API_KEY;

    if (!apiKey) {
        throw new Error(
            "FOURSQUARE_API_KEY is not configured.",
        );
    }

    return apiKey;
}

/*
 * =========================================================
 * PRICE LEVEL
 * =========================================================
 */

function normalizePriceLevel(
    value:
        | number
        | string
        | undefined,
):
    | 1
    | 2
    | 3
    | 4
    | undefined {
    if (
        typeof value ===
        "number"
    ) {
        if (
            value >= 1 &&
            value <= 4
        ) {
            return Math.round(
                value,
            ) as
                | 1
                | 2
                | 3
                | 4;
        }

        return undefined;
    }

    if (
        typeof value !==
        "string"
    ) {
        return undefined;
    }

    const text =
        value
            .trim()
            .toLowerCase();

    if (
        text.includes(
            "very expensive",
        )
    ) {
        return 4;
    }

    if (
        text.includes(
            "expensive",
        )
    ) {
        return 3;
    }

    if (
        text.includes(
            "moderate",
        )
    ) {
        return 2;
    }

    if (
        text.includes(
            "cheap",
        ) ||
        text.includes(
            "inexpensive",
        )
    ) {
        return 1;
    }

    return undefined;
}

function getPriceLabel(
    level:
        | 1
        | 2
        | 3
        | 4
        | undefined,
):
    | "cheap"
    | "moderate"
    | "expensive"
    | "very-expensive"
    | undefined {
    switch (level) {
        case 1:
            return "cheap";

        case 2:
            return "moderate";

        case 3:
            return "expensive";

        case 4:
            return "very-expensive";

        default:
            return undefined;
    }
}

/*
 * =========================================================
 * POPULARITY
 * =========================================================
 */

function normalizePopularity(
    value:
        | number
        | string
        | undefined,
): number | undefined {
    if (
        typeof value ===
        "number"
    ) {
        if (
            !Number.isFinite(
                value,
            )
        ) {
            return undefined;
        }

        /*
         * Foursquare popularity can be represented
         * as a 0..1 score.
         */
        if (
            value >= 0 &&
            value <= 1
        ) {
            return value;
        }

        return undefined;
    }

    if (
        typeof value !==
        "string"
    ) {
        return undefined;
    }

    const parsed =
        Number(
            value.trim(),
        );

    if (
        Number.isFinite(
            parsed,
        ) &&
        parsed >= 0 &&
        parsed <= 1
    ) {
        return parsed;
    }

    return undefined;
}

function getPopularityLevel(
    score:
        | number
        | undefined,
):
    | "low"
    | "medium"
    | "high"
    | undefined {
    if (
        score ===
        undefined
    ) {
        return undefined;
    }

    if (
        score >= 0.7
    ) {
        return "high";
    }

    if (
        score >= 0.4
    ) {
        return "medium";
    }

    return "low";
}

/*
 * =========================================================
 * CATEGORY
 * =========================================================
 */

function getCuisine(
    categories: FoursquareCategory[],
): FoodCuisine[] {
    const text =
        categories
            .map(
                (category) =>
                    category.name ??
                    "",
            )
            .join(" ")
            .toLowerCase();

    const cuisines: FoodCuisine[] =
        [];

    if (
        text.includes(
            "indian",
        )
    ) {
        cuisines.push(
            "indian",
        );
    }

    if (
        text.includes(
            "maharash",
        )
    ) {
        cuisines.push(
            "maharashtrian",
        );
    }

    if (
        text.includes(
            "south indian",
        )
    ) {
        cuisines.push(
            "south-indian",
        );
    }

    if (
        text.includes(
            "north indian",
        )
    ) {
        cuisines.push(
            "north-indian",
        );
    }

    if (
        text.includes(
            "chinese",
        )
    ) {
        cuisines.push(
            "chinese",
        );
    }

    return [
        ...new Set(
            cuisines,
        ),
    ];
}

/*
 * =========================================================
 * OPENING HOURS
 * =========================================================
 */

function getOpeningHours(
    hours:
        | FoursquareHours
        | undefined,
): string[] | undefined {
    if (!hours) {
        return undefined;
    }

    if (
        hours.display
    ) {
        return [
            hours.display,
        ];
    }

    if (
        !hours.regular ||
        hours.regular.length ===
            0
    ) {
        return undefined;
    }

    const result =
        hours.regular
            .map(
                (
                    item,
                ) => {
                    if (
                        !item.day ||
                        !item.open ||
                        !item.close
                    ) {
                        return null;
                    }

                    return `Day ${item.day}: ${item.open}–${item.close}`;
                },
            )
            .filter(
                (
                    item,
                ): item is string =>
                    item !==
                    null,
            );

    return result.length >
        0
        ? result
        : undefined;
}

/*
 * =========================================================
 * MAP PLACE
 * =========================================================
 */

function mapPlace(
    place: FoursquarePlace,
    foodName: string,
): FoursquareFoodResult | null {
    const fsqPlaceId =
        place.fsq_place_id?.trim();

    const name =
        place.name?.trim();

    if (
        !fsqPlaceId ||
        !name
    ) {
        return null;
    }

    const latitude =
        place.geocodes?.main
            ?.latitude;

    const longitude =
        place.geocodes?.main
            ?.longitude;

    if (
        typeof latitude !==
            "number" ||
        typeof longitude !==
            "number" ||
        !Number.isFinite(
            latitude,
        ) ||
        !Number.isFinite(
            longitude,
        )
    ) {
        return null;
    }

    const categories =
        place.categories ??
        [];

    const distanceKm =
        typeof place.distance ===
            "number" &&
        Number.isFinite(
            place.distance,
        )
            ? Math.round(
                  (place.distance /
                      1000) *
                      10,
              ) / 10
            : undefined;

    const rating =
        typeof place.rating ===
            "number" &&
        Number.isFinite(
            place.rating,
        )
            ? place.rating
            : undefined;

    const popularityScore =
        normalizePopularity(
            place.popularity,
        );

    const popularityLevel =
        getPopularityLevel(
            popularityScore,
        );

    const venuePriceLevel =
        normalizePriceLevel(
            place.price,
        );

    return {
        fsqPlaceId,

        food: {
            id: `fsq-${fsqPlaceId}`,

            /*
             * The candidate represents the requested food,
             * not the restaurant itself.
             */
            name: foodName,

            description:
                place.description ??
                place.location
                    ?.formatted_address ??
                `${name} near your location.`,

            cuisine:
                getCuisine(
                    categories,
                ),

            mealTypes: [],

            latitude,

            longitude,

            distanceKm,

            restaurantId:
                fsqPlaceId,

            restaurantName:
                name,

            website:
                place.website,

            phone:
                place.tel,

            rating,

            openingHours:
                getOpeningHours(
                    place.hours,
                ),

            venuePriceLevel,

            venuePriceLabel:
                getPriceLabel(
                    venuePriceLevel,
                ),

            popularityScore,

            popularityLevel,

            isPopular:
                popularityScore !==
                    undefined
                    ? popularityScore >=
                      0.7
                    : undefined,

            foodMatchConfirmed:
                true,

            foodMatchSource:
                "foursquare",

            placeProvider:
                "foursquare",

            tags: [
                "foursquare",
                "food-query-match",
                ...categories
                    .map(
                        (
                            category,
                        ) =>
                            category.name ??
                            "",
                    )
                    .filter(
                        Boolean,
                    ),
            ],
        },

        raw: place,
    };
}

/*
 * =========================================================
 * SEARCH
 * =========================================================
 */

export async function searchFoursquareFood(
    foodName: string,
    latitude: number,
    longitude: number,
    radiusMeters = 10000,
): Promise<
    FoursquareFoodResult[]
> {
    const cleanedFood =
        foodName.trim();

    if (!cleanedFood) {
        return [];
    }

    if (
        !Number.isFinite(
            latitude,
        ) ||
        !Number.isFinite(
            longitude,
        )
    ) {
        throw new Error(
            "Valid latitude and longitude are required.",
        );
    }

    const apiKey =
        getApiKey();

    const safeRadius =
        Math.min(
            Math.max(
                radiusMeters,
                500,
            ),
            100000,
        );

    const url =
        new URL(
            "https://places-api.foursquare.com/places/search",
        );

    /*
     * Food query.
     *
     * Unlike Geoapify's `name` parameter,
     * Foursquare's `query` searches the
     * place's content as well.
     */
    url.searchParams.set(
        "query",
        cleanedFood,
    );

    url.searchParams.set(
        "ll",
        `${latitude},${longitude}`,
    );

    url.searchParams.set(
        "radius",
        String(
            safeRadius,
        ),
    );

    url.searchParams.set(
        "sort",
        "RELEVANCE",
    );

    url.searchParams.set(
        "limit",
        "20",
    );

    url.searchParams.set(
        "fields",
        [
            "fsq_place_id",
            "name",
            "distance",
            "rating",
            "price",
            "popularity",
            "location",
            "geocodes",
            "categories",
            "website",
            "tel",
            "description",
            "hours",
        ].join(","),
    );

    const response =
        await fetch(
            url.toString(),
            {
                method:
                    "GET",

                headers: {
                    Accept:
                        "application/json",

                    Authorization:
                        `Bearer ${apiKey}`,

                    "X-Places-Api-Version":
                        "2025-06-17",
                },

                cache:
                    "no-store",
            },
        );

    if (
        !response.ok
    ) {
        const errorText =
            await response.text();

        console.error(
            "[Foursquare] Food search failed:",
            response.status,
            errorText,
        );

        throw new Error(
            `Foursquare food search failed: ${response.status}`,
        );
    }

    const data =
        (await response.json()) as FoursquareSearchResponse;

    return (
        data.results ??
        []
    )
        .map(
            (
                place,
            ) =>
                mapPlace(
                    place,
                    cleanedFood,
                ),
        )
        .filter(
            (
                result,
            ): result is FoursquareFoodResult =>
                result !== null,
        );
}