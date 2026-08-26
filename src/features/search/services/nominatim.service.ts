interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type?: string;
  category?: string;
  osm_type?: string;
  osm_id?: number;
}

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

export async function geocodePlace( query: string,): Promise<NominatimResult | null> {
  const url = new URL( NOMINATIM_URL,);
  url.searchParams.set( "q", query,);
  url.searchParams.set( "format", "jsonv2",);
  url.searchParams.set( "limit", "1",);
  url.searchParams.set( "addressdetails", "1", );

  const response = await fetch( url.toString(),{
      headers: {
        "User-Agent": "LocalFare/0.1 (SIH prototype)",
        Accept: "application/json",
      },

      next: { revalidate: 3600, },
    },
  );

  if (!response.ok) {
    throw new Error( `Nominatim failed: ${response.status}`,);
  }

  const results = (await response.json()) as NominatimResult[];
  return results[0] ?? null;
}