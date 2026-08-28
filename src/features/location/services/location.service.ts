import type {
    UserLocation,
    LocationSearchResult,
} from "../types";

import {
    searchGeoapifyLocation,
} from "@/features/search/services/geoapifyGeocoding.service";


/* =========================================================
   CURRENT GPS LOCATION
   ========================================================= */

export function getCurrentLocation(): Promise<UserLocation> {

    return new Promise(
        (
            resolve,
            reject,
        ) => {

            if (
                typeof navigator ===
                    "undefined" ||
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

                        latitude:
                            position.coords
                                .latitude,

                        longitude:
                            position.coords
                                .longitude,

                        displayName:
                            "Current location",

                        accuracy:
                            position.coords
                                .accuracy,

                        source:
                            "gps",
                    });
                },

                (error) => {

                    let message =
                        "Unable to detect your location.";

                    switch (
                        error.code
                    ) {

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

                    reject(
                        new Error(message),
                    );
                },

                {
                    enableHighAccuracy:
                        false,

                    timeout:
                        10000,

                    maximumAge:
                        5 * 60 * 1000,
                },
            );
        },
    );
}


/* =========================================================
   SEARCH LOCATION
   ========================================================= */

export async function searchLocation(
    query: string,
): Promise<LocationSearchResult[]> {

    return searchGeoapifyLocation(
        query,
    );
}