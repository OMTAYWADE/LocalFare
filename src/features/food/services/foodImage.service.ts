interface WikimediaSearchResponse {
    query?: {
        pages?: WikimediaPage[];
    };
}

interface WikimediaPage {
    pageid?: number;
    title?: string;
    imageinfo?: WikimediaImageInfo[];
}

interface WikimediaImageInfo {
    url?: string;
    thumburl?: string;
    descriptionurl?: string;
    mime?: string;
    width?: number;
    height?: number;
}

const EXCLUDED_MIME_TYPES = new Set([
    "image/svg+xml",
    "application/pdf",
]);

function normalize(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function getTokens(value: string): string[] {
    return normalize(value)
        .split(" ")
        .filter(
            (token) =>
                token.length >= 3,
        );
}

function scoreImage(
    foodName: string,
    page: WikimediaPage,
): number {
    const title =
        normalize(page.title ?? "");

    const tokens =
        getTokens(foodName);

    if (!title || tokens.length === 0) {
        return 0;
    }

    let score = 0;

    for (const token of tokens) {
        if (title.includes(token)) {
            score += 10;
        }
    }

    /*
     * Strong bonus when the actual food
     * name appears as a phrase.
     */
    if (
        title.includes(
            normalize(foodName),
        )
    ) {
        score += 30;
    }

    /*
     * Prefer actual food photographs.
     */
    if (
        title.includes("food") ||
        title.includes("dish") ||
        title.includes("meal")
    ) {
        score += 3;
    }

    return score;
}

export async function findFoodImage(
    foodName: string,
): Promise<string | undefined> {
    const cleanedName =
        foodName.trim();

    if (!cleanedName) {
        return undefined;
    }

    const searchTerms = [
        `"${cleanedName}" food`,
        `${cleanedName} dish`,
        cleanedName,
    ];

    let bestImage:
        | {
              imageUrl: string;
              score: number;
          }
        | undefined;

    for (const searchTerm of searchTerms) {
        try {
            const url = new URL(
                "https://commons.wikimedia.org/w/api.php",
            );

            url.searchParams.set(
                "action",
                "query",
            );

            url.searchParams.set(
                "format",
                "json",
            );

            url.searchParams.set(
                "formatversion",
                "2",
            );

            url.searchParams.set(
                "generator",
                "search",
            );

            url.searchParams.set(
                "gsrsearch",
                searchTerm,
            );

            url.searchParams.set(
                "gsrnamespace",
                "6",
            );

            url.searchParams.set(
                "gsrlimit",
                "10",
            );

            url.searchParams.set(
                "prop",
                "imageinfo",
            );

            url.searchParams.set(
                "iiprop",
                "url|mime|size",
            );

            url.searchParams.set(
                "iiurlwidth",
                "1000",
            );

            const response =
                await fetch(
                    url.toString(),
                    {
                        headers: {
                            Accept:
                                "application/json",
                            "User-Agent":
                                "FairTrip/1.0",
                        },

                        next: {
                            revalidate:
                                86400,
                        },
                    },
                );

            if (!response.ok) {
                console.error(
                    "Wikimedia request failed:",
                    response.status,
                );

                continue;
            }

            const data =
                (await response.json()) as WikimediaSearchResponse;

            const pages =
                data.query?.pages ?? [];

            for (const page of pages) {
                const imageInfo =
                    page.imageinfo?.[0];

                if (!imageInfo) {
                    continue;
                }

                if (
                    imageInfo.mime &&
                    EXCLUDED_MIME_TYPES.has(
                        imageInfo.mime,
                    )
                ) {
                    continue;
                }

                const imageUrl =
                    imageInfo.thumburl ??
                    imageInfo.url;

                if (!imageUrl) {
                    continue;
                }

                /*
                 * Ignore tiny images.
                 */
                if (
                    imageInfo.width &&
                    imageInfo.height
                ) {
                    if (
                        imageInfo.width < 300 ||
                        imageInfo.height < 300
                    ) {
                        continue;
                    }
                }

                const score =
                    scoreImage(
                        cleanedName,
                        page,
                    );

                if (
                    !bestImage ||
                    score >
                        bestImage.score
                ) {
                    bestImage = {
                        imageUrl,
                        score,
                    };
                }
            }

            /*
             * If we have a strong exact match,
             * don't waste time with weaker searches.
             */
            if (
                bestImage &&
                bestImage.score >= 30
            ) {
                break;
            }
        } catch (error) {
            console.error(
                "Food image search failed:",
                error,
            );
        }
    }

    return bestImage?.imageUrl;
}