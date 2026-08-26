import type {LocationSearchResult,} from "../types";

export async function searchLocation( query: string,): Promise<LocationSearchResult[]> {
  const response = await fetch( `/api/location?q=${encodeURIComponent(query)}`,);

  if (!response.ok) {
    throw new Error( "Unable to search location.",);
  }

  return response.json();
}