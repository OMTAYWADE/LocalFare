import type { FoodItem } from "../types/food.types";
import {
    classifyFood,
} from "./foodClassification.service";

interface WikipediaSummary {
    title?: string;
    extract?: string;
    content_urls?: {
        desktop?: {
            page?: string;
        };
    };
    thumbnail?: {
        source?: string;
    };
}

interface WikimediaSearchResponse {
    query?: {
        search?: Array<{
            title?: string;
        }>;
    };
}

interface WikimediaImageInfoResponse {
    query?: {
        pages?: Record<
            string,
            {
                imageinfo?: Array<{
                    thumburl?: string;
                    url?: string;
                }>;
            }
        >;
    };
}

function normalizeFoodName(
    name: string,
): string {
    return name
        .trim()
        .replace(/\s+/g, " ");
}

/**
 * Wikipedia summary lookup.
 *
 * This is only used for description/reference
 * information and not for dietary assertions.
 */
async function getWikipediaSummary(
    foodName: string,
): Promise<WikipediaSummary | null> {
    try {
        const encoded =
            encodeURIComponent(
                normalizeFoodName(foodName),
            );

        const response =
            await fetch(
                `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`,
                {
                    headers: {
                        Accept:
                            "application/json",
                    },
                    next: {
                        revalidate: 60 * 60 * 24,
                    },
                },
            );

        if (!response.ok) {
            return null;
        }

        return (await response.json()) as WikipediaSummary;
    } catch {
        return null;
    }
}

/**
 * Search Wikimedia Commons for
 * a relevant food image.
 */
async function getWikimediaImage(
    foodName: string,
): Promise<{
    imageUrl?: string;
    sourceUrl?: string;
} | null> {
    try {
        const params =
            new URLSearchParams({
                action: "query",
                generator: "search",
                gsrsearch:
                    `${foodName} food dish`,
                gsrnamespace: "6",
                gsrlimit: "5",
                prop: "imageinfo",
                iiprop: "url",
                iiurlwidth: "1000",
                format: "json",
                origin: "*",
            });

        const searchResponse =
            await fetch(
                `https://commons.wikimedia.org/w/api.php?${params.toString()}`,
                {
                    next: {
                        revalidate:
                            60 * 60 * 24,
                    },
                },
            );

        if (!searchResponse.ok) {
            return null;
        }

        const searchData =
            (await searchResponse.json()) as WikimediaSearchResponse;

        const titles =
            searchData.query?.search
                ?.map(
                    (item) =>
                        item.title,
                )
                .filter(
                    (
                        title,
                    ): title is string =>
                        Boolean(title),
                );

        if (
            !titles ||
            titles.length === 0
        ) {
            return null;
        }

        const imageParams =
            new URLSearchParams({
                action: "query",
                titles: titles[0],
                prop: "imageinfo",
                iiprop: "url",
                iiurlwidth: "1000",
                format: "json",
                origin: "*",
            });

        const imageResponse =
            await fetch(
                `https://commons.wikimedia.org/w/api.php?${imageParams.toString()}`,
                {
                    next: {
                        revalidate:
                            60 * 60 * 24,
                    },
                },
            );

        if (!imageResponse.ok) {
            return null;
        }

        const imageData =
            (await imageResponse.json()) as WikimediaImageInfoResponse;

        const pages =
            imageData.query?.pages;

        if (!pages) {
            return null;
        }

        const firstPage =
            Object.values(
                pages,
            )[0];

        const info =
            firstPage?.imageinfo?.[0];

        if (!info) {
            return null;
        }

        return {
            imageUrl:
                info.thumburl ??
                info.url,
            sourceUrl:
                info.url,
        };
    } catch {
        return null;
    }
}

/**
 * Build an enriched FoodItem from
 * a recognized food name.
 */
export async function enrichRecognizedFood(
    foodName: string,
): Promise<FoodItem> {
    const cleanName =
        normalizeFoodName(foodName);

    const classification =
        classifyFood(cleanName);

    const [
        wikipedia,
        wikimedia,
    ] = await Promise.all([
        getWikipediaSummary(
            cleanName,
        ),
        getWikimediaImage(
            cleanName,
        ),
    ]);

    const result: FoodItem = {
        id: `food-${cleanName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")}`,

        name:
            classification
                ? cleanName
                : wikipedia?.title ??
                    cleanName,

        description:
            wikipedia?.extract,

        cuisine:
            classification?.cuisine ??
            [],

        diet:
            classification?.diet,

        spiceLevel:
            classification?.spiceLevel,

        mealTypes:
            classification?.mealTypes ??
            [],

        ingredients:
            classification?.ingredients,

        tags:
            classification?.tags,

        tasteProfile:
            classification?.tasteProfile,

        texture:
            classification?.texture,

        servingStyle:
            classification?.servingStyle,

        preparationMethod:
            classification?.preparationMethod,

        allergens:
            classification?.allergens,

        origin:
            classification?.origin,

        goodFor:
            classification?.goodFor,

        isVegan:
            classification?.isVegan,

        containsEgg:
            classification?.containsEgg,

        containsOnion:
            classification?.containsOnion,

        containsGarlic:
            classification?.containsGarlic,

        jainSuitable:
            classification?.jainSuitable,

        isPopular:
            classification?.isPopular,

        popularityLevel:
            classification?.popularityLevel,

        popularityScore:
            classification?.popularityScore,

        popularityReason:
            classification?.popularityReason,

        imageUrl:
            wikimedia?.imageUrl ??
            wikipedia?.thumbnail?.source,

        imageSource:
            wikimedia?.imageUrl
                ? "Wikimedia Commons"
                : wikipedia?.thumbnail?.source
                    ? "Wikipedia"
                    : undefined,

        imageSourceUrl:
            wikimedia?.sourceUrl,

        wikipediaUrl:
            wikipedia?.content_urls
                ?.desktop
                ?.page,

        /**
         * Price is supplementary only.
         */
        priceMinInr:
            classification?.priceMinInr,

        priceMaxInr:
            classification?.priceMaxInr,

        priceRange:
            classification?.priceRange,

        priceEstimated:
            classification?.priceMinInr !==
                undefined ||
            classification?.priceMaxInr !==
                undefined,

        priceRangeEstimated:
            classification?.priceMinInr !==
                undefined ||
            classification?.priceMaxInr !==
                undefined,

        priceSource:
            classification?.priceMinInr !==
                undefined
                ? "estimated"
                : undefined,

        informationSources:
            [
                classification
                    ? "FairTrip food knowledge"
                    : null,
                wikipedia
                    ? "Wikipedia"
                    : null,
                wikimedia
                    ? "Wikimedia Commons"
                    : null,
            ].filter(
                (
                    source,
                ): source is string =>
                    Boolean(source),
            ),
    };

    return result;
}