import {
    NextRequest,
} from "next/server";

import {
    searchLocation,
} from "@/features/location/services/location.service";


export async function GET(
    request: NextRequest,
) {

    try {

        const query =
            request.nextUrl.searchParams.get(
                "q",
            );

        if (!query?.trim()) {

            return Response.json(
                [],
            );
        }

        const results =
            await searchLocation(
                query,
            );

        return Response.json(
            results,
        );

    } catch (error) {

        console.error(
            "Location search failed:",
            error,
        );

        return Response.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Location search failed.",
            },
            {
                status: 500,
            },
        );
    }
}