import { getGoogleApiKey } from "./server";

export interface GooglePlace {
    id?: string;
    displayName?: {
        text?: string;
        languageCode?: string;
    };
    formattedAddress?: string;
    shortFormattedAddress?: string;
    location?: {
        latitude?: number;
        longitude?: number;
    };
    rating?: number;
    userRatingCount?: number;
    priceLevel?: string;
    types?: string[];
    primaryType?: string;
    primaryTypeDisplayName?: {
        text?: string;
        languageCode?: string;
    };
    nationalPhoneNumber?: string;
    internationalPhoneNumber?: string;
    websiteUri?: string;
    googleMapsUri?: string;
    businessStatus?: string;
}

export interface GooglePlacesResponse {
    places?: GooglePlace[];
}

export async function searchNearbyGooglePlaces({
    latitude,
    longitude,
    radius = 2000,
    includedTypes = ["restaurant"],
}: {
    latitude: number;
    longitude: number;
    radius?: number;
    includedTypes?: string[];
}): Promise<GooglePlace[]> {
    const apiKey =
        getGoogleApiKey();

    const response = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key":  apiKey,
                "X-Goog-FieldMask": [
                        "places.id",
                        "places.displayName",
                        "places.formattedAddress",
                        "places.location",
                        "places.rating",
                        "places.userRatingCount",
                        "places.priceLevel",
                        "places.types",
                        "places.googleMapsUri",].join(","),
            },

            body: JSON.stringify({
                includedTypes,
                maxResultCount: 20,
                locationRestriction: {
                    circle: {
                        center: { latitude, longitude,},
                        radius,
                    },
                },

                rankPreference: "POPULARITY",
            }),

            cache: "no-store",
        },
    );

    if (!response.ok) {
        const message = await response.text();
        throw new Error( `Google Places API failed: ${response.status} ${message}`,);
    }

    const data = (await response.json()) as GooglePlacesResponse;
    return data.places ?? [];
}