import { getGoogleApiKey,} from "@/lib/google/client";

export interface GooglePlaceResult {
  id?: string;
  displayName?: { text?: string;};
  formattedAddress?: string;
  location?: {
    latitude?: number;
    longitude?: number;
  };
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  googleMapsUri?: string;
  primaryType?: string;
  businessStatus?: string;
}

export async function searchPlaces( textQuery: string,) {
  const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
          "Content-Type":"application/json",
          "X-Goog-Api-Key": getGoogleApiKey(),
          "X-Goog-FieldMask": [
              "places.id",
              "places.displayName",
              "places.formattedAddress",
              "places.location",
              "places.rating",
              "places.userRatingCount",
              "places.priceLevel",
              "places.googleMapsUri",
              "places.primaryType",
              "places.businessStatus",
            ].join(","),
        },

        body: JSON.stringify({
          textQuery,
          languageCode: "en",
          regionCode: "IN",
          pageSize: 10,
        }),
      },
    );

  if (!response.ok) {
    throw new Error( `Google Places request failed: ${response.status}`, );
  }

  const data =(await response.json()) as {
      places?: GooglePlaceResult[];
    };

  return data.places ?? [];
}