interface WikimediaSearchResponse {
    query?: {
        pages?: Record<string,
            {
                title?: string;
                imageinfo?: {
                    thumburl?: string;
                    url?: string;
                    descriptionurl?: string;
                }[];
            }
        >;
    };
}

export interface PlaceImageResult {
    imageUrl: string;
    sourceUrl?: string;
    sourceName: "Wikimedia Commons";
}

export async function findPlaceImage( placeName: string, category?: string,): Promise<PlaceImageResult | undefined> {
    const searchTerms = [placeName, category ? `${placeName} ${category}` : placeName,];

    for (const searchTerm of searchTerms) {
        try {
            const url = new URL("https://commons.wikimedia.org/w/api.php",);

            url.searchParams.set("action", "query",);
            url.searchParams.set("format", "json",);
            url.searchParams.set("formatversion", "2",);
            url.searchParams.set("generator", "search",);
            url.searchParams.set("gsrsearch", searchTerm,);
            url.searchParams.set("gsrnamespace", "6",);
            url.searchParams.set("gsrlimit", "1",);
            url.searchParams.set("prop", "imageinfo",);
            url.searchParams.set("iiprop", "url",);
            url.searchParams.set("iiurlwidth", "800",);

            const response = await fetch(url.toString(), {
                headers: {
                    "User-Agent": "LocalFare-SIH-Prototype/1.0",
                },
                next: {
                    revalidate: 86400,
                },
            },
            );

            if (!response.ok) {
                continue;
            }

            const data = (await response.json()) as WikimediaSearchResponse;
            const pages = data.query?.pages;

            if (!pages) {
                continue;
            }

            const page = Object.values(pages)[0];
            const imageInfo = page?.imageinfo?.[0];
            const imageUrl = imageInfo?.thumburl ?? imageInfo?.url;

            if (!imageUrl) {
                continue;
            }

            return {
                imageUrl,
                sourceUrl: imageInfo?.descriptionurl,
                sourceName:  "Wikimedia Commons",
            };
        } catch {
            continue;
        }
    }

    return undefined;
}