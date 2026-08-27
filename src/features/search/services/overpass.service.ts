// export interface OverpassElement {
//     type: "node" | "way" | "relation";
//     id: number;
//     lat?: number;
//     lon?: number;
//     center?: {
//         lat: number;
//         lon: number;
//     };
//     tags?: Record<string, string>;
// }

// interface OverpassResponse {
//     elements?: OverpassElement[];
//     remark?: string;
// }

// /* -------------------------------------------------------------------------- */
// /* CONFIGURATION                                                             */
// /* -------------------------------------------------------------------------- */

// const OVERPASS_ENDPOINTS = [
//     "https://overpass-api.de/api/interpreter",
//     "https://overpass.kumi.systems/api/interpreter",
//     "https://overpass.private.coffee/api/interpreter",
// ];

// const MAX_RESULTS = 8;

// const DEFAULT_RADIUS = 2000;

// const MIN_RADIUS = 500;

// const MAX_RADIUS = 5000;

// const REQUEST_TIMEOUT_MS = 20000;

// /* -------------------------------------------------------------------------- */
// /* SEARCH CATEGORIES                                                         */
// /* -------------------------------------------------------------------------- */

// /*
//  * IMPORTANT
//  *
//  * These are intentionally searched ONE AT A TIME.
//  *
//  * We start with the most useful tourist categories.
//  */

// const TOURIST_CATEGORIES = [
//     {
//         key: "attraction",
//         filter: '[tourism="attraction"]',
//     },
//     {
//         key: "museum",
//         filter: '[tourism="museum"]',
//     },
//     {
//         key: "viewpoint",
//         filter: '[tourism="viewpoint"]',
//     },
//     {
//         key: "gallery",
//         filter: '[tourism="gallery"]',
//     },
//     {
//         key: "monument",
//         filter: '[historic="monument"]',
//     },
//     {
//         key: "memorial",
//         filter: '[historic="memorial"]',
//     },
//     {
//         key: "fort",
//         filter: '[historic="fort"]',
//     },
//     {
//         key: "castle",
//         filter: '[historic="castle"]',
//     },
//     {
//         key: "park",
//         filter: '[leisure="park"]',
//     },
//     {
//         key: "garden",
//         filter: '[leisure="garden"]',
//     },
//     {
//         key: "beach",
//         filter: '[natural="beach"]',
//     },
//     {
//         key: "worship",
//         filter: '[amenity="place_of_worship"]',
//     },
// ];

// const FOOD_CATEGORIES = [
//     {
//         key: "restaurant",
//         filter: '[amenity="restaurant"]',
//     },
//     {
//         key: "cafe",
//         filter: '[amenity="cafe"]',
//     },
//     {
//         key: "fast_food",
//         filter: '[amenity="fast_food"]',
//     },
// ];

// /* -------------------------------------------------------------------------- */
// /* HELPERS                                                                   */
// /* -------------------------------------------------------------------------- */

// function normalizeRadius(radius: number): number {
//     if (!Number.isFinite(radius)) {
//         return DEFAULT_RADIUS;
//     }

//     return Math.min(
//         Math.max(
//             Math.round(radius),
//             MIN_RADIUS,
//         ),
//         MAX_RADIUS,
//     );
// }

// function isValidCoordinates(
//     latitude: number,
//     longitude: number,
// ): boolean {
//     return (
//         Number.isFinite(latitude) &&
//         Number.isFinite(longitude) &&
//         latitude >= -90 &&
//         latitude <= 90 &&
//         longitude >= -180 &&
//         longitude <= 180
//     );
// }

// function getElementCoordinates(
//     element: OverpassElement,
// ): {
//     lat: number;
//     lon: number;
// } | null {
//     if (
//         typeof element.lat === "number" &&
//         typeof element.lon === "number"
//     ) {
//         return {
//             lat: element.lat,
//             lon: element.lon,
//         };
//     }

//     if (
//         element.center &&
//         typeof element.center.lat === "number" &&
//         typeof element.center.lon === "number"
//     ) {
//         return {
//             lat: element.center.lat,
//             lon: element.center.lon,
//         };
//     }

//     return null;
// }

// function getElementName(
//     element: OverpassElement,
// ): string | null {
//     const tags = element.tags;

//     if (!tags) {
//         return null;
//     }

//     return (
//         tags["name:en"] ??
//         tags.name ??
//         tags["official_name"] ??
//         null
//     );
// }

// function hasUsefulPlaceData(
//     element: OverpassElement,
// ): boolean {
//     return (
//         Boolean(getElementName(element)) &&
//         Boolean(getElementCoordinates(element))
//     );
// }

// /* -------------------------------------------------------------------------- */
// /* QUERY BUILDERS                                                            */
// /* -------------------------------------------------------------------------- */

// /*
//  * We deliberately query only NODES first.
//  *
//  * This is much smaller than:
//  *
//  * node + way + relation
//  *
//  * and is enough for many nearby attractions.
//  */

// function buildNodeQuery(
//     latitude: number,
//     longitude: number,
//     radius: number,
//     filter: string,
// ): string {
//     return `
// [out:json][timeout:12];

// node(
//     around:${radius},
//     ${latitude},
//     ${longitude}
// )
// ${filter}
// [name];

// out body;
// `;
// }

// /*
//  * If nodes don't give us anything, we can try ways.
//  */

// function buildWayQuery(
//     latitude: number,
//     longitude: number,
//     radius: number,
//     filter: string,
// ): string {
//     return `
// [out:json][timeout:12];

// way(
//     around:${radius},
//     ${latitude},
//     ${longitude}
// )
// ${filter}
// [name];

// out center tags;
// `;
// }

// /* -------------------------------------------------------------------------- */
// /* REQUEST                                                                    */
// /* -------------------------------------------------------------------------- */

// async function fetchOverpass(
//     endpoint: string,
//     query: string,
// ): Promise<OverpassElement[]> {
//     const controller = new AbortController();

//     const timeout = setTimeout(
//         () => controller.abort(),
//         REQUEST_TIMEOUT_MS,
//     );

//     try {
//         console.log(
//             "[Overpass] Request:",
//             endpoint,
//         );

//         const response = await fetch(
//             endpoint,
//             {
//                 method: "POST",

//                 headers: {
//                     "Content-Type":
//                         "application/x-www-form-urlencoded",

//                     Accept:
//                         "application/json",

//                     "User-Agent":
//                         "FairTrip/1.0",
//                 },

//                 body:
//                     `data=${encodeURIComponent(query)}`,

//                 cache: "no-store",

//                 signal: controller.signal,
//             },
//         );

//         console.log(
//             "[Overpass] Status:",
//             response.status,
//         );

//         if (!response.ok) {
//             const text =
//                 await response.text().catch(
//                     () => "",
//                 );

//             throw new Error(
//                 `HTTP ${response.status}: ${text.slice(
//                     0,
//                     250,
//                 )}`,
//             );
//         }

//         const data =
//             (await response.json()) as OverpassResponse;

//         if (
//             !data ||
//             !Array.isArray(data.elements)
//         ) {
//             throw new Error(
//                 "Invalid Overpass response.",
//             );
//         }

//         if (data.remark) {
//             console.warn(
//                 "[Overpass] Remark:",
//                 data.remark,
//             );
//         }

//         console.log(
//             "[Overpass] Elements:",
//             data.elements.length,
//         );

//         return data.elements;
//     } finally {
//         clearTimeout(timeout);
//     }
// }

// /* -------------------------------------------------------------------------- */
// /* ENDPOINT FALLBACK                                                          */
// /* -------------------------------------------------------------------------- */

// async function requestWithFallback(
//     query: string,
// ): Promise<OverpassElement[]> {
//     let lastError: unknown = null;

//     for (
//         const endpoint of OVERPASS_ENDPOINTS
//     ) {
//         try {
//             const result =
//                 await fetchOverpass(
//                     endpoint,
//                     query,
//                 );

//             return result;
//         } catch (error) {
//             lastError = error;

//             console.warn(
//                 "[Overpass] Endpoint failed:",
//                 endpoint,
//             );

//             console.warn(
//                 "[Overpass] Error:",
//                 error,
//             );
//         }
//     }

//     throw (
//         lastError ??
//         new Error(
//             "All Overpass endpoints failed.",
//         )
//     );
// }

// /* -------------------------------------------------------------------------- */
// /* ONE CATEGORY                                                               */
// /* -------------------------------------------------------------------------- */

// async function queryOneCategory(
//     latitude: number,
//     longitude: number,
//     radius: number,
//     category: {
//         key: string;
//         filter: string;
//     },
// ): Promise<OverpassElement[]> {
//     console.log(
//         `[Places] Searching category: ${category.key}`,
//     );

//     /*
//      * STEP 1
//      *
//      * Search nodes only.
//      */

//     const nodeQuery =
//         buildNodeQuery(
//             latitude,
//             longitude,
//             radius,
//             category.filter,
//         );

//     try {
//         const nodes =
//             await requestWithFallback(
//                 nodeQuery,
//             );

//         const usefulNodes =
//             nodes.filter(
//                 hasUsefulPlaceData,
//             );

//         if (usefulNodes.length > 0) {
//             console.log(
//                 `[Places] ${category.key}: ${usefulNodes.length} node results`,
//             );

//             return usefulNodes;
//         }
//     } catch (error) {
//         console.warn(
//             `[Places] Node search failed for ${category.key}:`,
//             error,
//         );
//     }

//     /*
//      * STEP 2
//      *
//      * Only if node search found nothing,
//      * try ways.
//      */

//     console.log(
//         `[Places] No nodes for ${category.key}, trying ways`,
//     );

//     const wayQuery =
//         buildWayQuery(
//             latitude,
//             longitude,
//             radius,
//             category.filter,
//         );

//     try {
//         const ways =
//             await requestWithFallback(
//                 wayQuery,
//             );

//         const usefulWays =
//             ways.filter(
//                 hasUsefulPlaceData,
//             );

//         console.log(
//             `[Places] ${category.key}: ${usefulWays.length} way results`,
//         );

//         return usefulWays;
//     } catch (error) {
//         console.warn(
//             `[Places] Way search failed for ${category.key}:`,
//             error,
//         );

//         return [];
//     }
// }

// /* -------------------------------------------------------------------------- */
// /* SEARCH TYPE                                                                */
// /* -------------------------------------------------------------------------- */

// function getCategories(
//     searchTerm?: string,
// ) {
//     const term =
//         searchTerm
//             ?.trim()
//             .toLowerCase() ?? "";

//     /*
//      * Food
//      */

//     if (
//         term.includes("food") ||
//         term.includes("restaurant") ||
//         term.includes("cafe") ||
//         term.includes("coffee") ||
//         term.includes("eat")
//     ) {
//         return FOOD_CATEGORIES;
//     }

//     /*
//      * Tourist search
//      *
//      * Default is tourist categories.
//      */

//     return TOURIST_CATEGORIES;
// }

// /* -------------------------------------------------------------------------- */
// /* MAIN SEARCH                                                                */
// /* -------------------------------------------------------------------------- */

// export async function findNearbyPlaces(
//     latitude: number,
//     longitude: number,
//     searchTerm?: string,
//     radius = DEFAULT_RADIUS,
// ): Promise<OverpassElement[]> {
//     if (
//         !isValidCoordinates(
//             latitude,
//             longitude,
//         )
//     ) {
//         throw new Error(
//             "Invalid latitude or longitude.",
//         );
//     }

//     const safeRadius =
//         normalizeRadius(radius);

//     const categories =
//         getCategories(searchTerm);

//     console.log(
//         "====================================",
//     );

//     console.log(
//         "[Places] Search started",
//     );

//     console.log(
//         "[Places] Coordinates:",
//         latitude,
//         longitude,
//     );

//     console.log(
//         "[Places] Radius:",
//         safeRadius,
//         "meters",
//     );

//     console.log(
//         "[Places] Search term:",
//         searchTerm ?? "tourist",
//     );

//     console.log(
//         "[Places] Categories:",
//         categories.length,
//     );

//     console.log(
//         "====================================",
//     );

//     const places: OverpassElement[] = [];

//     const seen =
//         new Set<string>();

//     /*
//      * IMPORTANT:
//      *
//      * Sequential search.
//      *
//      * We DO NOT Promise.all().
//      */

//     for (
//         const category of categories
//     ) {
//         if (
//             places.length >= MAX_RESULTS
//         ) {
//             break;
//         }

//         const results =
//             await queryOneCategory(
//                 latitude,
//                 longitude,
//                 safeRadius,
//                 category,
//             );

//         for (
//             const place of results
//         ) {
//             if (
//                 places.length >=
//                 MAX_RESULTS
//             ) {
//                 break;
//             }

//             if (
//                 !hasUsefulPlaceData(
//                     place,
//                 )
//             ) {
//                 continue;
//             }

//             const uniqueId =
//                 `${place.type}-${place.id}`;

//             if (
//                 seen.has(uniqueId)
//             ) {
//                 continue;
//             }

//             seen.add(uniqueId);

//             places.push(place);

//             console.log(
//                 "[Places] Added:",
//                 getElementName(place),
//             );
//         }

//         console.log(
//             `[Places] Current total: ${places.length}/${MAX_RESULTS}`,
//         );
//     }

//     console.log(
//         "====================================",
//     );

//     console.log(
//         "[Places] Final results:",
//         places.length,
//     );

//     console.log(
//         "====================================",
//     );

//     return places;
// }
// src/features/search/services/overpass.service.ts

export interface OverpassElement {
    type: "node";
    id: number;

    lat: number;
    lon: number;

    tags: {
        name: string;
        tourism?: string;
        historic?: string;
        leisure?: string;
        amenity?: string;
        description?: string;
    };
}

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type FakePlaceCategory =
    | "attraction"
    | "museum"
    | "viewpoint"
    | "monument"
    | "park"
    | "garden"
    | "beach"
    | "restaurant"
    | "cafe";

/* -------------------------------------------------------------------------- */
/* CONFIGURATION                                                              */
/* -------------------------------------------------------------------------- */

const DEFAULT_RADIUS = 2000;

const MAX_RESULTS = 8;

/* -------------------------------------------------------------------------- */
/* PLACE TEMPLATES                                                            */
/* -------------------------------------------------------------------------- */

const TOURIST_PLACES: Array<{
    name: string;
    category: FakePlaceCategory;
    description: string;
}> = [
    {
        name: "Heritage Discovery Point",
        category: "attraction",
        description:
            "A popular place to explore the local character and history.",
    },
    {
        name: "City History Museum",
        category: "museum",
        description:
            "A museum featuring local history, culture and heritage.",
    },
    {
        name: "Panoramic Viewpoint",
        category: "viewpoint",
        description:
            "A scenic viewpoint with a good opportunity for photographs.",
    },
    {
        name: "Historic Monument",
        category: "monument",
        description:
            "A historic landmark worth exploring during your journey.",
    },
    {
        name: "Green City Park",
        category: "park",
        description:
            "A relaxing green space suitable for a short break.",
    },
    {
        name: "Heritage Garden",
        category: "garden",
        description:
            "A peaceful garden near the surrounding attractions.",
    },
    {
        name: "Local Beach Walk",
        category: "beach",
        description:
            "A nearby place to relax, walk and enjoy the surroundings.",
    },
    {
        name: "Cultural Attraction",
        category: "attraction",
        description:
            "A local attraction recommended for first-time visitors.",
    },
];

const FOOD_PLACES: Array<{
    name: string;
    category: FakePlaceCategory;
    description: string;
}> = [
    {
        name: "Local Breakfast Cafe",
        category: "cafe",
        description:
            "A casual cafe suitable for breakfast and quick meals.",
    },
    {
        name: "Street Food Corner",
        category: "restaurant",
        description:
            "A local food spot with affordable regional options.",
    },
    {
        name: "Heritage Cafe",
        category: "cafe",
        description:
            "A relaxed cafe suitable for snacks and coffee.",
    },
    {
        name: "Local Thali Kitchen",
        category: "restaurant",
        description:
            "An affordable restaurant serving Indian-style meals.",
    },
    {
        name: "Quick Bites",
        category: "restaurant",
        description:
            "A convenient place for a quick and budget-friendly meal.",
    },
    {
        name: "City Coffee House",
        category: "cafe",
        description:
            "A casual cafe for coffee, snacks and short breaks.",
    },
    {
        name: "Family Restaurant",
        category: "restaurant",
        description:
            "A comfortable restaurant with a variety of local meals.",
    },
    {
        name: "Local Food Stop",
        category: "restaurant",
        description:
            "A nearby food stop suitable for travelers.",
    },
];

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Generate a deterministic pseudo-random number.
 *
 * We use latitude/longitude so the same location
 * produces stable results instead of changing
 * randomly on every render.
 */
function seededValue(seed: number): number {
    const value = Math.sin(seed) * 10000;

    return value - Math.floor(value);
}

/**
 * Convert meters to approximate latitude/longitude offsets.
 */
function offsetCoordinates(
    latitude: number,
    longitude: number,
    distanceMeters: number,
    angleDegrees: number,
) {
    const angle =
        (angleDegrees * Math.PI) / 180;

    const metersPerLatitude = 111_320;

    const metersPerLongitude =
        111_320 *
        Math.cos(
            (latitude * Math.PI) / 180,
        );

    const latitudeOffset =
        (Math.cos(angle) * distanceMeters) /
        metersPerLatitude;

    const longitudeOffset =
        (Math.sin(angle) * distanceMeters) /
        Math.max(
            metersPerLongitude,
            1,
        );

    return {
        lat:
            latitude +
            latitudeOffset,

        lon:
            longitude +
            longitudeOffset,
    };
}

function normalizeRadius(
    radius: number,
): number {
    if (
        !Number.isFinite(radius) ||
        radius <= 0
    ) {
        return DEFAULT_RADIUS;
    }

    return Math.min(
        Math.max(
            radius,
            500,
        ),
        5000,
    );
}

/**
 * Determine whether the search is for food.
 */
function isFoodSearch(
    searchTerm?: string,
): boolean {
    const term =
        searchTerm
            ?.trim()
            .toLowerCase() ?? "";

    if (!term) {
        return false;
    }

    return [
        "food",
        "restaurant",
        "cafe",
        "coffee",
        "eat",
        "eating",
        "breakfast",
        "lunch",
        "dinner",
        "snack",
    ].some(
        (keyword) =>
            term.includes(keyword),
    );
}

/**
 * Make the names slightly more location-aware.
 */
function getPlaceName(
    templateName: string,
    index: number,
    latitude: number,
    longitude: number,
): string {
    /*
     * CSMT / South Mumbai area.
     *
     * We don't hard-code coordinates for the
     * generated places. The actual coordinates
     * still come from the user's location.
     */
    const isSouthMumbai =
        latitude >= 18.85 &&
        latitude <= 19.00 &&
        longitude >= 72.80 &&
        longitude <= 72.90;

    if (isSouthMumbai) {
        const southMumbaiNames = [
            "Fort Heritage Discovery",
            "South Mumbai Culture Point",
            "Fort Local Landmark",
            "Colaba Heritage Stop",
            "Mumbai History Corner",
            "Fort City Viewpoint",
            "Heritage Quarter Garden",
            "South Mumbai Discovery",
        ];

        return (
            southMumbaiNames[index] ??
            templateName
        );
    }

    return `${templateName} ${index + 1}`;
}

/* -------------------------------------------------------------------------- */
/* MAIN FAKE SEARCH                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Temporary replacement for Overpass.
 *
 * IMPORTANT:
 *
 * This function has the same job as the real Overpass
 * service:
 *
 * user coordinates
 *      ↓
 * nearby places
 *      ↓
 * recommendation service
 *      ↓
 * UI cards
 *
 * No external API is called.
 */
export async function findNearbyPlaces(
    latitude: number,
    longitude: number,
    searchTerm?: string,
    radius = DEFAULT_RADIUS,
): Promise<OverpassElement[]> {
    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
    ) {
        throw new Error(
            "Invalid location coordinates.",
        );
    }

    const safeRadius =
        normalizeRadius(radius);

    const food =
        isFoodSearch(searchTerm);

    const templates =
        food
            ? FOOD_PLACES
            : TOURIST_PLACES;

    console.log(
        "====================================",
    );

    console.log(
        "[Places] TEMPORARY DATA MODE",
    );

    console.log(
        "[Places] Latitude:",
        latitude,
    );

    console.log(
        "[Places] Longitude:",
        longitude,
    );

    console.log(
        "[Places] Radius:",
        safeRadius,
        "meters",
    );

    console.log(
        "[Places] Type:",
        food
            ? "food"
            : "tourist",
    );

    console.log(
        "[Places] Search:",
        searchTerm ?? "nearby",
    );

    console.log(
        "====================================",
    );

    const places: OverpassElement[] =
        templates
            .slice(0, MAX_RESULTS)
            .map(
                (
                    template,
                    index,
                ) => {
                    /*
                     * Generate a different but
                     * deterministic distance for
                     * every place.
                     */

                    const seed =
                        Math.abs(
                            latitude *
                                1000 +
                                longitude *
                                    100 +
                                index *
                                    7919,
                        );

                    /*
                     * Distance between roughly
                     * 350m and the requested radius.
                     */

                    const randomDistance =
                        350 +
                        seededValue(
                            seed,
                        ) *
                            Math.max(
                                safeRadius -
                                    350,
                                100,
                            );

                    /*
                     * Spread places around the
                     * user's location.
                     */

                    const angle =
                        seededValue(
                            seed + 100,
                        ) *
                        360;

                    const coordinates =
                        offsetCoordinates(
                            latitude,
                            longitude,
                            randomDistance,
                            angle,
                        );

                    const name =
                        getPlaceName(
                            template.name,
                            index,
                            latitude,
                            longitude,
                        );

                    return {
                        type: "node",

                        /*
                         * Stable fake ID.
                         */
                        id:
                            900_000_000 +
                            index,

                        lat:
                            coordinates.lat,

                        lon:
                            coordinates.lon,

                        tags: {
                            name,

                            description:
                                template.description,

                            ...(template.category ===
                                "attraction" && {
                                tourism:
                                    "attraction",
                            }),

                            ...(template.category ===
                                "museum" && {
                                tourism:
                                    "museum",
                            }),

                            ...(template.category ===
                                "viewpoint" && {
                                tourism:
                                    "viewpoint",
                            }),

                            ...(template.category ===
                                "monument" && {
                                historic:
                                    "monument",
                            }),

                            ...(template.category ===
                                "park" && {
                                leisure:
                                    "park",
                            }),

                            ...(template.category ===
                                "garden" && {
                                leisure:
                                    "garden",
                            }),

                            ...(template.category ===
                                "beach" && {
                                natural:
                                    "beach",
                            }),

                            ...(template.category ===
                                "restaurant" && {
                                amenity:
                                    "restaurant",
                            }),

                            ...(template.category ===
                                "cafe" && {
                                amenity:
                                    "cafe",
                            }),
                        },
                    };
                },
            );

    /*
     * Small artificial delay.
     *
     * This makes the UI behave more like a
     * real API request and lets you test
     * loading states.
     */
    await new Promise(
        (resolve) =>
            setTimeout(
                resolve,
                250,
            ),
    );

    console.log(
        "[Places] Generated:",
        places.length,
    );

    places.forEach(
        (place) => {
            console.log(
                "[Places] →",
                place.tags.name,
                place.lat,
                place.lon,
            );
        },
    );

    console.log(
        "====================================",
    );

    return places;
}

/* -------------------------------------------------------------------------- */
/* OPTIONAL CATEGORY SEARCH                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Explicit tourist search.
 */
export async function findNearbyTouristPlaces(
    latitude: number,
    longitude: number,
    radius = DEFAULT_RADIUS,
): Promise<OverpassElement[]> {
    return findNearbyPlaces(
        latitude,
        longitude,
        "tourist",
        radius,
    );
}

/**
 * Explicit food search.
 */
export async function findNearbyFoodPlaces(
    latitude: number,
    longitude: number,
    radius = DEFAULT_RADIUS,
): Promise<OverpassElement[]> {
    return findNearbyPlaces(
        latitude,
        longitude,
        "food",
        radius,
    );
}