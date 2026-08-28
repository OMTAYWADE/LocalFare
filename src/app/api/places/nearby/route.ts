import {
    NextRequest,
    NextResponse,
} from "next/server";

import {
    searchNearbyGooglePlaces,
} from "@/lib/google/places";

export async function GET(
    request: NextRequest,
) {
    try {
        const params =
            request.nextUrl.searchParams;

        const latitude =
            Number(params.get("lat"));

        const longitude =
            Number(params.get("lng"));

        const radius =
            Number(
                params.get("radius") ?? "2000",
            );

        const type =
            params.get("type") ??
            "restaurant";

        if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)
        ) {
            return NextResponse.json(
                {
                    error:
                        "Invalid latitude or longitude.",
                },
                {
                    status: 400,
                },
            );
        }

        const places =
            await searchNearbyGooglePlaces({
                latitude,
                longitude,
                radius,
                includedTypes: [
                    type,
                ],
            });

        return NextResponse.json({
            places,
        });
    } catch (error) {
        console.error(
            "[Places API]",
            error,
        );

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to load places.",
            },
            {
                status: 500,
            },
        );
    }
}