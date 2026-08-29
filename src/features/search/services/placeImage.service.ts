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
}

export interface PlaceImageResult {
    imageUrl: string;
    sourceUrl?: string;
    sourceName: "Wikimedia Commons" | "Placeholder";
}

const EXCLUDED_MIME_TYPES = new Set([
    "image/svg+xml",
    "application/pdf",
]);

// Category -> generic fallback image, so a card is never fully blank.
const FALLBACK_IMAGES: Record<string, string> = {
    default:
        "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800&q=60",
    restaurant:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=60",
    museum:
        "https://images.unsplash.com/photo-1503089414-6a8c94b1e73a?w=800&q=60",
    park:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=60",
    attraction:
        "https://images.unsplash.com/photo-1470004914212-05527e49370b?w=800&q=60",
};

function getFallbackImage(category?: string): PlaceImageResult {
    const key = category?.toLowerCase() ?? "default";
    const imageUrl = FALLBACK_IMAGES[key] ?? FALLBACK_IMAGES.default;

    return {
        imageUrl,
        sourceName: "Placeholder",
    };
}

export async function findPlaceImage(
    placeName: string,
    category?: string,
): Promise<PlaceImageResult> {
    const cleanedName = placeName.trim();

    // Strip trailing generic words that hurt search relevance
    // (e.g. "Fort" the park vs "Fort" the neighborhood).
    const searchTerms = [
        category ? `${cleanedName} ${category.trim()}` : null,
        cleanedName,
    ].filter((term): term is string => Boolean(term));

    for (const searchTerm of searchTerms) {
        try {
            const url = new URL(
                "https://commons.wikimedia.org/w/api.php",
            );

            url.searchParams.set("action", "query");
            url.searchParams.set("format", "json");
            url.searchParams.set("formatversion", "2");
            url.searchParams.set("generator", "search");
            url.searchParams.set("gsrsearch", `${searchTerm} filetype:bitmap`);
            url.searchParams.set("gsrnamespace", "6");
            url.searchParams.set("gsrlimit", "5");
            url.searchParams.set("prop", "imageinfo");
            url.searchParams.set("iiprop", "url|mime");
            url.searchParams.set("iiurlwidth", "800");

            const response = await fetch(url.toString(), {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "User-Agent": "LocalFare-SIH-Prototype/1.0",
                },
                next: { revalidate: 86400 },
            });

            if (!response.ok) {
                console.error(
                    "Wikimedia request failed:",
                    response.status,
                    await response.text(),
                );
                continue;
            }

            const data = (await response.json()) as WikimediaSearchResponse;
            const pages = data.query?.pages ?? [];

            for (const page of pages) {
                const imageInfo = page.imageinfo?.[0];
                const imageUrl = imageInfo?.thumburl ?? imageInfo?.url;

                if (!imageUrl) continue;
                if (imageInfo?.mime && EXCLUDED_MIME_TYPES.has(imageInfo.mime)) {
                    continue;
                }

                return {
                    imageUrl,
                    sourceUrl: imageInfo?.descriptionurl,
                    sourceName: "Wikimedia Commons",
                };
            }
        } catch (error) {
            console.error("Wikimedia image search failed:", error);
            continue;
        }
    }

    // No usable Commons image found for any search term — return a
    // real fallback instead of undefined so the caller always has
    // something to render.
    return getFallbackImage(category);
}