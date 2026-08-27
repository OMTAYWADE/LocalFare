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

export type AvailabilityStatus =
    | "available"
    | "limited"
    | "unavailable";

export type TravelMode =
    | "metro"
    | "bus"
    | "auto"
    | "bike"
    | "cab"
    | "walk";

export type PlaceCategory =
    | "food"
    | "restaurant"
    | "cafe"
    | "attraction"
    | "market"
    | "hotel"
    | "transport"
    | "utility";

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface Location extends Coordinates {
    name?: string;
    address?: string;
}

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

    location: Location;

    distanceMeters: number;

    price: PriceRange;

    priceStatus: PriceStatus;

    confidence: Confidence;

    imageUrl?: string;

    tags: string[];

    travelOptions?: TravelOption[];
}