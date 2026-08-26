import { NextRequest } from "next/server";

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

export async function GET( request: NextRequest,) {
  const query = request.nextUrl.searchParams.get( "q",);
  if (!query?.trim()) {
    return Response.json( [], );
  }

  try {
    const url = new URL( "https://nominatim.openstreetmap.org/search",);
    url.searchParams.set( "q", query,);
    url.searchParams.set( "format", "jsonv2",);
    url.searchParams.set( "limit", "5",);

    const response = await fetch(url, {
        headers: {
          "User-Agent": "LocalFare/0.1 (SIH prototype)",
        },
        next: { revalidate: 3600,},
      });

    if (!response.ok) {
      throw new Error( "Nominatim request failed.",);
    }

    const data = (await response.json()) as NominatimResult[];
    return Response.json(
      data.map((item) => ({
        latitude: Number(item.lat),
        longitude: Number(item.lon),
        displayName:item.display_name,
      })),
    );
  } catch {
    return Response.json( {error:"Location search failed.", },{ status: 500,},);
  }
}