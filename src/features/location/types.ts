export interface UserLocation {
  latitude: number;
  longitude: number;
  displayName: string;
  accuracy: number;
  source: "gps" | "search";
}

export interface LocationSearchResult {
  latitude: number;
  longitude: number;
  displayName: string;
}