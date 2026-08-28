export type SearchIntent =
    | "place_search"
    | "food_search"
    | "destination_recommendation"
    | "transport_price"
    | "trip_cost"
    | "unknown";

export type PricePreference =
    | "cheap"
    | "fair"
    | "any";

export interface SearchLocation {
    type:
    | "current"
    | "destination"
    | "place"
    | "city"
    | "unknown";
    value?: string;
    latitude?: number;
    longitude?: number;
}

export interface SearchPreferences {
    spicy?: boolean;
    vegetarian?: boolean;
    seafood?: boolean;
    famous?: boolean;
    cheap?: boolean;
    highlyRated?: boolean;
}

export interface ParsedSearchQuery {
    originalQuery: string;
    normalizedQuery: string;
    intent: SearchIntent;
    location: SearchLocation;
    destination?: string;
    food?: string;
    source?: string;
    budget?: number;
    availableMinutes?: number;
    pricePreference: PricePreference;
    transport?:
    | "rapido"
    | "uber"
    | "local"
    | "walk";
    preferences: SearchPreferences;
    confidence: number;
}

export interface RealPlaceResult {
    id: string;
    name: string;
    category: string;
    address?: string;
    latitude: number;
    longitude: number;
    phone?: string;
    website?: string;
    openingHours?: string[];
    rating?: number;
    reviewCount?: number;
    mapUrl?: string;
    priceLevel?: string;
    distanceKm?: number;
    durationMinutes?: number;
    source: "Geoapify";
    lastUpdated: string;
    imageUrl?: string;
    imageSource?: string;
    imageSourceUrl?: string;
}

export interface SearchResponse {
    query: ParsedSearchQuery;
    results: RealPlaceResult[];
    searchLocation?: {
        latitude: number;
        longitude: number;
        displayName: string;
    };

    metadata: {
        source: string;
        retrievedAt: string;
        resultCount: number;
    };
}