import { NextRequest, NextResponse } from "next/server";

interface GoogleResult {
    formatted_address?: string;

    geometry?: {
        location?: {
            lat?: number;
            lng?: number;
        };
    };

    name?: string;
}

interface GoogleResponse {
    status: string;
    results?: GoogleResult[];
    error_message?: string;
}

export async function GET(
    request: NextRequest,
) {
    try {
        const query =
            request.nextUrl.searchParams.get("q");

        if (!query?.trim()) {
            return NextResponse.json([]);
        }

        const apiKey =
            process.env.GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                {
                    error:
                        "GOOGLE_MAPS_API_KEY is missing.",
                },
                {
                    status: 500,
                },
            );
        }

        const url = new URL(
            "https://maps.googleapis.com/maps/api/geocode/json",
        );

        url.searchParams.set(
            "address",
            query.trim(),
        );

        url.searchParams.set(
            "key",
            apiKey,
        );

        url.searchParams.set(
            "language",
            "en",
        );

        const response = await fetch(
            url.toString(),
            {
                method: "GET",
                cache: "no-store",
            },
        );

        if (!response.ok) {
            throw new Error(
                `Google API returned ${response.status}`,
            );
        }

        const data =
            (await response.json()) as GoogleResponse;

        if (data.status !== "OK") {
            throw new Error(
                data.error_message ||
                    `Google API status: ${data.status}`,
            );
        }

        const locations =
            (data.results ?? [])
                .filter(
                    (result) =>
                        typeof result
                            .geometry
                            ?.location?.lat ===
                            "number" &&
                        typeof result
                            .geometry
                            ?.location?.lng ===
                            "number",
                )
                .slice(0, 5)
                .map((result) => ({
                    latitude:
                        result.geometry!.location!
                            .lat!,

                    longitude:
                        result.geometry!.location!
                            .lng!,

                    displayName:
                        result.formatted_address ||
                        result.name ||
                        "Unknown location",
                }));

        return NextResponse.json(
            locations,
        );
    } catch (error) {
        console.error(
            "Google location search error:",
            error,
        );

        return NextResponse.json(
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