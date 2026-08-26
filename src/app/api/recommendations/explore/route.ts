import { NextRequest,} from "next/server";
import { getExploreRecommendations,} from "@/features/recommendation/services/exploreRecommendation.service";
import type { TravelerType, } from "@/features/profile/types";

const VALID_TRAVELER_TYPES: TravelerType[] = [ "tourist", "citizen",];

function parseIds( value: string | null,): string[] {
    if (!value) {
        return [];
    }

    try {
        const parsed = JSON.parse(value);

        if ( Array.isArray(parsed)) {
            return parsed.filter(( item,): item is string => typeof item === "string",);
        }

        return [];

    } catch {
        //   Also support comma-separated IDs.
        return value.split(",").map((item) => item.trim(),).filter(Boolean);
    }
}

export async function GET( request: NextRequest,) {

    try {
        const searchParams = request.nextUrl.searchParams;
        const latitude = Number( searchParams.get( "latitude",), );
        const longitude = Number( searchParams.get( "longitude",),);
        const travelerTypeParam = searchParams.get( "travelerType",);

        if ( !Number.isFinite( latitude,) ||!Number.isFinite( longitude,)) {
            return Response.json({ error: "Valid latitude and longitude are required.",},{ status: 400,},);
        }

        if (!travelerTypeParam ||!VALID_TRAVELER_TYPES.includes( travelerTypeParam as TravelerType,)) {
            return Response.json({ error: "Valid travelerType is required: tourist or citizen.",},{ status: 400, },);
        }

        const travelerType = travelerTypeParam as TravelerType;
        const visitedPlaceIds = parseIds( searchParams.get( "visitedPlaceIds", ), );
        const savedPlaceIds = parseIds( searchParams.get( "savedPlaceIds", ),);
        const plannedPlaceIds = parseIds(searchParams.get( "plannedPlaceIds",),);
        const limitParam = searchParams.get( "limit",);
        const limit = limitParam ? Number(limitParam) : undefined;
        const result = await getExploreRecommendations({
                    latitude,
                    longitude,
                    travelerType,
                    visitedPlaceIds,
                    savedPlaceIds,
                    plannedPlaceIds,
                    intent: "discover",
                    limit: Number.isFinite( limit, ) ? limit : undefined,
                },
            );

        return Response.json( result,);

    } catch (error) {
        console.error( "Explore recommendation failed:", error,);
        return Response.json({ error: "Unable to generate recommendations right now.",},{ status: 500, },);
    }
}