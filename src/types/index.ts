export type PriceStatus =
  | "cheap"
  | "fair"
  | "high"
  | "expensive";

export type FreshnessStatus =
  | "fresh"
  | "recent"
  | "aging"
  | "stale";

export type TravelMode =
  | "metro"
  | "bus"
  | "auto"
  | "bike"
  | "cab"
  | "walk";

export type AvailabilityStatus =
  | "available"
  | "limited"
  | "unavailable";

export type PlaceCategory =
  | "food"
  | "restaurant"
  | "cafe"
  | "attraction"
  | "market"
  | "hotel"
  | "transport"
  | "utility";

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}

export interface Confidence {
  score: number;
  sourceCount: number;
  lastUpdated: string;
  freshness: FreshnessStatus;
}

export interface Location {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
}

export interface Destination {
  id: string;
  name: string;
  address: string;
  location: Location;
  category?: PlaceCategory;
}

export interface TravelOption {
  id: string;
  name: string;
  mode: TravelMode;
  price: PriceRange;
  durationMinutes: number;
  availability: AvailabilityStatus;
  priceStatus: PriceStatus;
  recommended?: boolean;
  recommendationReason?: string;
  confidence: Confidence;
}

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  rating: number;
  reviewCount: number;
  distanceMeters: number;
  price: PriceRange;
  priceStatus: PriceStatus;
  confidence: Confidence;
  imageUrl?: string;
  tags: string[];
}

export interface PriceObservation {
  id: string;
  itemName: string;
  category: "food" | "transport" | "attraction" | "service";
  price: number;
  currency: string;
  location: Location;
  source:
    | "official"
    | "historical"
    | "user"
    | "traveler"
    | "vlog";
  observedAt: string;
  confidence: number;
}

export interface PriceEstimate {
  itemName: string;
  range: PriceRange;
  status: PriceStatus;
  confidence: Confidence;
  observationCount: number;
}