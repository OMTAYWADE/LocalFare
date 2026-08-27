import type {
    UserLocation,
    LocationSearchResult,
} from "../types";

export function getCurrentLocation(): Promise<UserLocation> {
    return new Promise((resolve, reject) => {
        if (
            typeof navigator === "undefined" ||
            !navigator.geolocation
        ) {
            reject(
                new Error(
                    "Location is not supported by this browser.",
                ),
            );

            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    displayName: "Current location",
                    accuracy: position.coords.accuracy,
                    source: "gps",
                });
            },

            (error) => {
                let message =
                    "Unable to detect your location.";

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message =
                            "Location permission was denied.";
                        break;

                    case error.POSITION_UNAVAILABLE:
                        message =
                            "Your location is currently unavailable.";
                        break;

                    case error.TIMEOUT:
                        message =
                            "Location request timed out.";
                        break;
                }

                reject(new Error(message));
            },

            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 5 * 60 * 1000,
            },
        );
    });
}


/**
 * Temporary local location search.
 *
 * This is test data for development.
 * Later this function can use Prisma/database
 * or a geocoding service.
 */
export async function searchLocation(
    query: string,
): Promise<LocationSearchResult[]> {
    const normalizedQuery =
        query.trim().toLowerCase();

    if (!normalizedQuery) {
        return [];
    }

    const locations: LocationSearchResult[] = [
        {
            latitude: 18.9402,
            longitude: 72.8356,
            displayName:
                "Chhatrapati Shivaji Maharaj Terminus",
        },

        {
            latitude: 18.922,
            longitude: 72.8347,
            displayName:
                "Gateway of India",
        },

        {
            latitude: 18.9431,
            longitude: 72.8238,
            displayName:
                "Marine Drive",
        },

        {
            latitude: 18.922,
            longitude: 72.8317,
            displayName:
                "Colaba Causeway",
        },

        {
            latitude: 18.9827,
            longitude: 72.8089,
            displayName:
                "Haji Ali",
        },
    ];

    return locations.filter(
        (location) =>
            location.displayName
                .toLowerCase()
                .includes(normalizedQuery),
    );
}