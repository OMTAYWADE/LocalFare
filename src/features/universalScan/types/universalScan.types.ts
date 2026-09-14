export type ScanInputType =
    | "image"
    | "text";

export type ScanEntityType =
    | "food"
    | "clothing"
    | "product"
    | "electronics"
    | "household"
    | "handicraft"
    | "cosmetic"
    | "tool"
    | "vehicle-part"
    | "brand"
    | "place"
    | "business"
    | "other"
    | "unknown";

export type ScanEntityKind =
    | "local"
    | "regional"
    | "branded"
    | "unknown";

export type UniversalPriceStatus =
    | "verified"
    | "location-estimate"
    | "variable"
    | "unavailable";

export interface UniversalScanRequest {
    inputType: ScanInputType;

    text?: string;

    image?: File;

    latitude?: number;

    longitude?: number;
}

export interface UniversalRecognition {
    name: string;

    type: ScanEntityType;

    kind: ScanEntityKind;

    brand?: string;

    model?: string;

    confidence: number;

    attributes: Record<string, string>;

    detectedText?: string[];
}

export interface UniversalPrice {
    status: UniversalPriceStatus;

    currency: "INR";

    exact?: number;

    min?: number;

    max?: number;

    locationName?: string;

    sourceName?: string;

    sourceUrl?: string;

    message?: string;
}

export interface UniversalLocation {
    name?: string;

    address?: string;

    city?: string;

    state?: string;

    country?: string;

    latitude: number;

    longitude: number;
}

export interface UniversalScanResponse {
    recognition: UniversalRecognition;

    price?: UniversalPrice;

    location?: UniversalLocation;

    message?: string;
}