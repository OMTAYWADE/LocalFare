export interface OverpassElement {
    type: "node" | "way" | "relation";

    id: number;

    lat?: number;
    lon?: number;

    center?: {
        lat: number;
        lon: number;
    };

    tags?: Record<string, string>;
}

interface OverpassResponse {
    elements: OverpassElement[];
}

/*
|--------------------------------------------------------------------------
| Overpass endpoints
|--------------------------------------------------------------------------
*/

const OVERPASS_ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
];

/*
|--------------------------------------------------------------------------
| Configuration
|--------------------------------------------------------------------------
*/

const REQUEST_TIMEOUT_MS = 7000;

const MAX_RESULTS = 8;

const MIN_RADIUS_METERS = 500;

const MAX_RADIUS_METERS = 3000;

/*
|--------------------------------------------------------------------------
| Categories
|--------------------------------------------------------------------------
|
| IMPORTANT:
| We DO NOT send these all together.
|
| Each category is requested separately.
|
*/

const SEARCH_CATEGORIES = [
    {
        key: "attraction",
        tag: '[tourism="attraction"]',
    },

    {
        key: "museum",
        tag: '[tourism="museum"]',
    },

    {
        key: "viewpoint",
        tag: '[tourism="viewpoint"]',
    },

    {
        key: "gallery",
        tag: '[tourism="gallery"]',
    },

    {
        key: "monument",
        tag: '[historic="monument"]',
    },

    {
        key: "memorial",
        tag: '[historic="memorial"]',
    },

    {
        key: "castle",
        tag: '[historic="castle"]',
    },

    {
        key: "fort",
        tag: '[historic="fort"]',
    },

    {
        key: "park",
        tag: '[leisure="park"]',
    },

    {
        key: "garden",
        tag: '[leisure="garden"]',
    },

    {
        key: "beach",
        tag: '[natural="beach"]',
    },

    {
        key: "place_of_worship",
        tag: '[amenity="place_of_worship"]',
    },
];

/*
|--------------------------------------------------------------------------
| Radius
|--------------------------------------------------------------------------
*/

function normalizeRadius(radius: number): number {
    if (!Number.isFinite(radius)) {
        return MIN_RADIUS_METERS;
    }

    return Math.min(
        Math.max(
            Math.round(radius),
            MIN_RADIUS_METERS,
        ),
        MAX_RADIUS_METERS,
    );
}

/*
|--------------------------------------------------------------------------
| Build ONE category query
|--------------------------------------------------------------------------
|
| Example:
|
| tourism=attraction
|
| We search node and way.
|
| We intentionally DO NOT search relation.
|
*/

function buildCategoryQuery(
    latitude: number,
    longitude: number,
    radius: number,
    tag: string,
): string {
    return `
[out:json][timeout:5];

(
    node(
        around:${radius},
        ${latitude},
        ${longitude}
    )${tag}[name];

    way(
        around:${radius},
        ${latitude},
        ${longitude}
    )${tag}[name];
);

out center tags;
`;
}

/*
|--------------------------------------------------------------------------
| Request one Overpass endpoint
|--------------------------------------------------------------------------
*/

async function requestEndpoint(
    endpoint: string,
    query: string,
): Promise<OverpassElement[]> {
    const url =
        `${endpoint}?data=${encodeURIComponent(query)}`;

    console.log("[Overpass] GET request:", endpoint);

    const response = await fetch(
        url,
        {
            method: "GET",

            headers: {
                Accept: "application/json",
                "User-Agent":
                    "FairTrip/1.0 (SIH prototype)",
            },

            cache: "no-store",

            signal:
                AbortSignal.timeout(15000),
        },
    );

    console.log(
        "[Overpass] HTTP status:",
        response.status,
    );

    if (!response.ok) {
        const text =
            await response
                .text()
                .catch(() => "");

        throw new Error(
            `Overpass ${response.status}: ${text.slice(
                0,
                300,
            )}`,
        );
    }

    const data =
        (await response.json()) as OverpassResponse;

    if (
        !data ||
        !Array.isArray(data.elements)
    ) {
        throw new Error(
            "Invalid Overpass response.",
        );
    }

    console.log(
        "[Overpass] Elements received:",
        data.elements.length,
    );

    return data.elements;
}

/*
|--------------------------------------------------------------------------
| Query ONE category
|--------------------------------------------------------------------------
|
| Endpoint fallback happens only for this category.
|
*/

async function queryCategory(
    latitude: number,
    longitude: number,
    radius: number,
    category: {
        key: string;
        tag: string;
    },
): Promise<OverpassElement[]> {
    const query =
        buildCategoryQuery(
            latitude,
            longitude,
            radius,
            category.tag,
        );

    console.log(
        `[Overpass] Querying only: ${category.key}`,
    );

    for (
        const endpoint of OVERPASS_ENDPOINTS
    ) {
        try {
            console.log(
                `[Overpass] ${category.key} -> ${endpoint}`,
            );

            const results =
                await requestEndpoint(
                    endpoint,
                    query,
                );

            console.log(
                `[Overpass] ${category.key}: ${results.length} places`,
            );

            return results;
        } catch (error) {
            console.warn(
                `[Overpass] ${category.key} failed on ${endpoint}`,
                error,
            );
        }
    }

    console.warn(
        `[Overpass] Skipping category: ${category.key}`,
    );

    return [];
}

/*
|--------------------------------------------------------------------------
| Get name
|--------------------------------------------------------------------------
*/

function hasName(
    element: OverpassElement,
): boolean {
    return Boolean(
        element.tags?.name ||
        element.tags?.["name:en"],
    );
}

/*
|--------------------------------------------------------------------------
| Get coordinates
|--------------------------------------------------------------------------
*/

function hasCoordinates(
    element: OverpassElement,
): boolean {
    if (
        typeof element.lat === "number" &&
        typeof element.lon === "number"
    ) {
        return true;
    }

    if (
        element.center &&
        typeof element.center.lat === "number" &&
        typeof element.center.lon === "number"
    ) {
        return true;
    }

    return false;
}

/*
|--------------------------------------------------------------------------
| Main function
|--------------------------------------------------------------------------
*/

export async function findNearbyPlaces(
    latitude: number,
    longitude: number,
    searchTerm?: string,
    radius = 5000,
): Promise<OverpassElement[]> {
    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
    ) {
        throw new Error(
            "Invalid coordinates.",
        );
    }

    const safeRadius =
        normalizeRadius(radius);

    const term =
        searchTerm
            ?.trim()
            .toLowerCase() ?? "";

    console.log(
        "[Overpass] Searching:",
        term,
    );

    console.log(
        "[Overpass] Coordinates:",
        latitude,
        longitude,
    );

    console.log(
        "[Overpass] Radius:",
        safeRadius,
        "meters",
    );

    /*
    |--------------------------------------------------------------------------
    | Decide which categories we actually need
    |--------------------------------------------------------------------------
    */

    let categories =
        SEARCH_CATEGORIES;

    /*
    | Tourist search
    |
    | Do destination categories only.
    */

    if (
        term.includes("tourist") ||
        term.includes("attraction") ||
        term.includes("destination") ||
        term.includes("visit") ||
        term.includes("famous")
    ) {
        categories =
            SEARCH_CATEGORIES.filter(
                (category) =>
                    [
                        "attraction",
                        "museum",
                        "viewpoint",
                        "gallery",
                        "monument",
                        "memorial",
                        "castle",
                        "fort",
                        "park",
                        "garden",
                        "beach",
                        "place_of_worship",
                    ].includes(
                        category.key,
                    ),
            );
    }

    /*
    |--------------------------------------------------------------------------
    | Food search
    |--------------------------------------------------------------------------
    */

    if (
        term.includes("food") ||
        term.includes("restaurant") ||
        term.includes("cafe") ||
        term.includes("coffee") ||
        term.includes("eat")
    ) {
        categories = [
            {
                key: "restaurant",
                tag: '[amenity="restaurant"]',
            },
            {
                key: "cafe",
                tag: '[amenity="cafe"]',
            },
            {
                key: "fast_food",
                tag: '[amenity="fast_food"]',
            },
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Collect results ONE CATEGORY AT A TIME
    |--------------------------------------------------------------------------
    */

    const allPlaces: OverpassElement[] = [];

    const seen =
        new Set<string>();

    for (
        const category of categories
    ) {
        /*
        | Stop when we already have enough.
        */

        if (
            allPlaces.length >=
            MAX_RESULTS
        ) {
            break;
        }

        console.log(
            `[Places] Trying category: ${category.key}`,
        );

        const results =
            await queryCategory(
                latitude,
                longitude,
                safeRadius,
                category,
            );

        /*
        |--------------------------------------------------------------------------
        | Add unique places
        |--------------------------------------------------------------------------
        */

        for (
            const place of results
        ) {
            if (
                !hasName(place)
            ) {
                continue;
            }

            if (
                !hasCoordinates(place)
            ) {
                continue;
            }

            const id =
                `${place.type}-${place.id}`;

            if (
                seen.has(id)
            ) {
                continue;
            }

            seen.add(id);

            allPlaces.push(place);

            console.log(
                `[Places] Added: ${
                    place.tags?.name ??
                    place.tags?.["name:en"]
                }`,
            );

            /*
            | Stop immediately after 8.
            */

            if (
                allPlaces.length >=
                MAX_RESULTS
            ) {
                break;
            }
        }

        console.log(
            `[Places] Total: ${allPlaces.length}/${MAX_RESULTS}`,
        );
    }

    console.log(
        `[Places] Final places: ${allPlaces.length}`,
    );

    return allPlaces;
}