import { NextRequest } from "next/server";

interface NominatimResult {
    lat: string;
    lon: string;
    display_name: string;
}

export async function GET(
    request: NextRequest,
) {
    const query =
        request.nextUrl.searchParams.get("q");

    if (!query?.trim()) {
        return Response.json([]);
    }

    try {
        const url = new URL(
            "https://nominatim.openstreetmap.org/search",
        );

        url.searchParams.set(
            "q",
            query.trim(),
        );

        url.searchParams.set(
            "format",
            "jsonv2",
        );

        url.searchParams.set(
            "limit",
            "5",
        );

        url.searchParams.set(
            "addressdetails",
            "1",
        );

        url.searchParams.set(
            "countrycodes",
            "in",
        );

        const response = await fetch(
            url.toString(),
            {
                headers: {
                    Accept:
                        "application/json",

                    "User-Agent":
                        "LocalFare/0.1 (SIH prototype)",
                },

                next: {
                    revalidate: 3600,
                },
            },
        );

        if (!response.ok) {
            console.error(
                "Nominatim status:",
                response.status,
            );

            return Response.json(
                {
                    error:
                        "Location provider failed.",
                },
                {
                    status: 502,
                },
            );
        }

        const data =
            (await response.json()) as NominatimResult[];

        const results = data
            .map((item) => ({
                latitude: Number(item.lat),
                longitude: Number(item.lon),
                displayName:
                    item.display_name,
            }))
            .filter(
                (item) =>
                    Number.isFinite(
                        item.latitude,
                    ) &&
                    Number.isFinite(
                        item.longitude,
                    ),
            );

        return Response.json(results);
    } catch (error) {
        console.error(
            "Location search failed:",
            error,
        );

        return Response.json(
            {
                error:
                    "Unable to search location.",
            },
            {
                status: 500,
            },
        );
    }
}