import { getGoogleApiKey,} from "./server";
import type { GooglePlace, GooglePlacesResponse,} from "./places";

const GOOGLE_PLACES_URL ="https://places.googleapis.com/v1/places:searchText";

const FIELD_MASK = [
    "places.id",
    "places.displayName",
    "places.formattedAddress",
    "places.location",
    "places.rating",
    "places.userRatingCount",
    "places.priceLevel",
    "places.types",
    "places.googleMapsUri",
].join(",");

export interface GooglePlaceSearchInput {
    query: string;
    latitude?: number;
    longitude?: number;
    radiusMeters?: number;
    maxResults?: number;
}

export async function searchGooglePlaces( input: GooglePlaceSearchInput,): Promise<GooglePlace[]> {
    const apiKey = getGoogleApiKey();
    const { query, latitude, longitude,
        radiusMeters = 5000,
        maxResults = 10,
    } = input;

    if (!query.trim()) {
        return [];
    }

    const body: Record<string, unknown> = {
        textQuery: query.trim(),
        pageSize: Math.min( Math.max(maxResults, 1), 20,),
        languageCode: "en",
        regionCode: "IN",
    };

    if ( typeof latitude === "number" && typeof longitude === "number") {
        body.locationBias = {
            circle: {
                center: { latitude, longitude,},
                radius: Math.min( Math.max(radiusMeters, 100), 50000,),
            },
        };
    }

    const response = await fetch(GOOGLE_PLACES_URL,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": apiKey,
                "X-Goog-FieldMask": FIELD_MASK,
            },

            body: JSON.stringify(body),
            cache: "no-store",
        },
    );

    if (!response.ok) {
        const errorText = await response.text().catch(() => "",);
        throw new Error( `Google Places API failed (${response.status}): ${errorText.slice( 0, 500,)}`,);
    }

    const data = (await response.json()) as GooglePlacesResponse;
    return Array.isArray(data.places) ? data.places : [];
}