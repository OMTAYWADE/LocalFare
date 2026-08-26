export interface UserLocation {
  latitude: number;
  longitude: number;
  displayName: string;
  source: "gps" | "search";
}

export interface LocationSearchResult {
  latitude: number;
  longitude: number;
  displayName: string;
}