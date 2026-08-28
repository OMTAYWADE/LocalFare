import { getGeoapifyApiKey } from "@/lib/geoapify/server";
import type { LocationSearchResult, } from "@/features/location/types";

interface GeoapifyGeocodingResponse { results?: GeoapifyGeocodingResult[]; }

interface GeoapifyGeocodingResult {
    place_id?: string;
    name?: string;
    formatted?: string;
    lat?: number;
    lon?: number;
    city?: string;
    state?: string;
    country?: string;
    country_code?: string;
    postcode?: string;
}

export async function searchGeoapifyLocation(query: string,): Promise<LocationSearchResult[]> {

    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
        return [];
    }

    const apiKey = getGeoapifyApiKey();
    const url = new URL("https://api.geoapify.com/v1/geocode/search",);

    url.searchParams.set("text", normalizedQuery,);
    url.searchParams.set("apiKey", apiKey,);
    url.searchParams.set("format", "json",);
    url.searchParams.set("limit", "5",);
    url.searchParams.set("lang", "en",);

    const response = await fetch(url.toString(), {
        method: "GET",
        cache: "no-store",
    },
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Geoapify geocoding failed (${response.status}): ${errorText}`,);
    }

    const data = (await response.json()) as GeoapifyGeocodingResponse;

    return (data.results ?? []).filter((result,): result is GeoapifyGeocodingResult & { lat: number; lon: number; } =>
        typeof result.lat === "number" && typeof result.lon === "number",).map((result,): LocationSearchResult => ({
            latitude: result.lat,
            longitude: result.lon,
            displayName: result.formatted ?? result.name ?? buildDisplayName(result,),
        }),
        );
}


/* =========================================================
   DISPLAY NAME FALLBACK
   ========================================================= */

function buildDisplayName(result: GeoapifyGeocodingResult,): string {

    return [
        result.name,
        result.city,
        result.state,
        result.country,
    ].filter((value,): value is string =>
        Boolean(value),
    ).join(", ");
}