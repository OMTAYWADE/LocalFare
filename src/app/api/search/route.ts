import { NextRequest } from "next/server";
import { searchLocalFare, } from "@/features/search/services/search.service";
import { SearchIntent } from "@/features/search/types";

const SEARCH_INTENTS: SearchIntent[] = [
    "place_search",
    "food_search",
    "destination_recommendation",
    "transport_price",
    "trip_cost",
    "unknown",
];

function parseSearchIntent(value: string | null): SearchIntent{
    if (value && SEARCH_INTENTS.includes(value as SearchIntent)) {
        return value as SearchIntent;
    }
    return "unknown";
}

export async function GET( request: NextRequest,) {
    try {
        const query = request.nextUrl.searchParams.get( "q", );
        const latitudeParam = request.nextUrl.searchParams.get( "latitude", );
        const longitudeParam = request.nextUrl.searchParams.get("longitude",);
        const intent = parseSearchIntent(request.nextUrl.searchParams.get("intent"));

        if (!query?.trim()) {
            return Response.json({ error: "Search query is required.", },{ status: 400, },);
        }

        const latitude = latitudeParam !== null ? Number(latitudeParam) : undefined;
        const longitude = longitudeParam !== null ? Number(longitudeParam) : undefined;
        const hasCoordinates = latitude !== undefined && longitude !== undefined && Number.isFinite(latitude) && Number.isFinite(longitude);
        const result = await searchLocalFare( query.trim(), hasCoordinates ? { latitude, longitude, } : undefined, intent);

        return Response.json(result);
    } catch (error) {
        console.error("LocalFare search failed:", error,);
        return Response.json(
            { error: "Unable to search right now.", }, { status: 500, },
        );
    }
} 