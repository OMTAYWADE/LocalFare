interface NominatimResult {
    lat: string;
    lon: string;
    display_name: string;
}

export interface GeocodedLocation {
    lat: string;
    lon: string;
    display_name: string;
}

export async function geocodePlace(
    query: string,
): Promise<GeocodedLocation | null> {
    const cleanQuery =
        query.trim();

    if (!cleanQuery) {
        return null;
    }

    const url =
        new URL(
            "https://nominatim.openstreetmap.org/search",
        );

    url.searchParams.set(
        "q",
        cleanQuery,
    );

    url.searchParams.set(
        "format",
        "jsonv2",
    );

    url.searchParams.set(
        "limit",
        "1",
    );

    url.searchParams.set(
        "addressdetails",
        "1",
    );

    try {
        const response =
            await fetch(
                url.toString(),
                {
                    method: "GET",

                    headers: {
                        Accept:
                            "application/json",

                        "User-Agent":
                            "LocalFare/0.1 (travel recommendation prototype)",
                    },

                    next: {
                        revalidate: 3600,
                    },
                },
            );

        if (!response.ok) {
            console.error(
                "Nominatim request failed:",
                response.status,
            );

            return null;
        }

        const data =
            (await response.json()) as NominatimResult[];

        if (
            !Array.isArray(data) ||
            data.length === 0
        ) {
            return null;
        }

        const first =
            data[0];

        if (
            !first?.lat ||
            !first?.lon ||
            !first?.display_name
        ) {
            return null;
        }

        return {
            lat: first.lat,
            lon: first.lon,
            display_name:
                first.display_name,
        };
    } catch (error) {
        console.error(
            "Nominatim geocoding failed:",
            error,
        );

        return null;
    }
}