export type LocalTransportMode =
    | "meter-auto"
    | "shared-auto"
    | "meter-taxi"
    | "app-taxi"
    | "bus"
    | "walk";

export type FareConfidence =
    | "verified"
    | "estimate"
    | "unavailable";

export type FareSourceType =
    | "official-tariff"
    | "route-estimate"
    | "local-guidance";

export interface LocalTransportRequest {
    mode: LocalTransportMode;
    city?: string;
    distanceKm?: number;
    isNight?: boolean;
}

export interface FareResult {
    confidence: FareConfidence;
    sourceType: FareSourceType;

    currency: "INR";

    fare?: number;
    minFare?: number;
    maxFare?: number;

    distanceKm?: number;

    title: string;
    message: string;

    sourceName?: string;
    sourceUrl?: string;

    updatedAt?: string;
}

export interface LocalTransportOption {
    mode: LocalTransportMode;
    title: string;
    description: string;
    recommended?: boolean;
    badge?: string;
}