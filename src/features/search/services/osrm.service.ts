interface OsrmResponse {
    code: string;
    routes?: {
        distance: number;
        duration: number;
    }[];
}

export async function getRoute(
    source: {
        latitude: number;
        longitude: number;
    },
    destination: {
        latitude: number;
        longitude: number;
    },) {
    const coordinates = [
        `${source.longitude},${source.latitude}`,
        `${destination.longitude},${destination.latitude}`,
    ].join(";");

    const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}` +
        "?overview=false";

    const response = await fetch(url, {
            headers: {
                "User-Agent": "LocalFare/0.1 (SIH prototype)",
            },

            next: { revalidate: 300,},
        });

    if (!response.ok) {
        throw new Error( `OSRM failed: ${response.status}`, );
    }

    const data = (await response.json()) as OsrmResponse;

    if (data.code !== "Ok" || !data.routes?.[0]) {
        return null;
    }

    return {
        distanceKm: data.routes[0].distance / 1000,
        durationMinutes: Math.ceil(data.routes[0].duration / 60,),
    };
}