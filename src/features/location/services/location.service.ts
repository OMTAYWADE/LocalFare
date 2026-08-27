import type { UserLocation } from "../types/location.types";

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
                    accuracy: position.coords.accuracy,
                    name: "Current location",
                });
            },

            (error) => {
                let message = "Unable to detect your location.";

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message = "Location permission was denied.";
                        break;

                    case error.POSITION_UNAVAILABLE:
                        message = "Your location is currently unavailable.";
                        break;

                    case error.TIMEOUT:
                        message = "Location request timed out.";
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