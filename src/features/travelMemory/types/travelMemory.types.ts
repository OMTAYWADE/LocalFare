export type TravelSourcePlatform =
    | "youtube"
    | "instagram";

export type TravelSourceType =
    | "channel"
    | "profile"
    | "video"
    | "post";

export type TravelTransportMode =
    | "walk"
    | "bus"
    | "train"
    | "metro"
    | "shared-auto"
    | "meter-auto"
    | "taxi"
    | "app-taxi"
    | "ferry"
    | "flight"
    | "other"
    | "unknown";

export type ExperienceType =
    | "positive"
    | "negative"
    | "neutral"
    | "warning"
    | "possible-overcharge"
    | "reported-scam";

export type ExperienceCategory =
    | "transport"
    | "food"
    | "shopping"
    | "hotel"
    | "attraction"
    | "service"
    | "other";

export type DataVisibility =
    | "private"
    | "fairtrip-candidate"
    | "fairtrip-public";

/* =========================================================
   SOURCE
========================================================= */

export interface TravelerSource {
    id: string;
    userId: string;
    platform: TravelSourcePlatform;
    sourceUrl: string;
    sourceId?: string;
    sourceType: TravelSourceType;
    title?: string;
    channelName?: string;
    lastProcessedContentId?: string;
    lastCheckedAt?: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

/* =========================================================
   PLACE
========================================================= */

export interface TravelPoint {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    confidence: number;
}

/* =========================================================
   JOURNEY SEGMENT
========================================================= */

export interface TravelRoute {
    id: string;
    sequence: number;
    from: TravelPoint;
    to: TravelPoint;
    transportMode: TravelTransportMode;
    distanceMeters?: number;
    durationMinutes?: number;
    amountPaid?: number;
    currency?: "INR";
    fareSource:
        | "explicit"
        | "calculated"
        | "unknown";
    experience?: string;
    evidence?: string;
    confidence: number;
}

/* =========================================================
   EXPENSE
========================================================= */

export interface TravelExpense {
    id: string;
    sequence?: number;
    category: ExperienceCategory;
    description: string;
    amount: number;
    currency: "INR";
    placeName?: string;
    evidence?: string;
    confidence: number;
}

/* =========================================================
   EXPERIENCE
========================================================= */

export interface TravelerExperience {
    id: string;
    sequence?: number;
    title: string;
    summary: string;
    experienceType: ExperienceType;
    category: ExperienceCategory;
    subcategory?: string;
    place?: TravelPoint;
    reportedAmount?: number;
    expectedAmount?: number;
    transportMode?: TravelTransportMode;
    problem?: string;
    advice: string[];
    sourceQuote?: string;
    confidence: number;
    visibility: DataVisibility;
}

/* =========================================================
   JOURNEY TOTALS
========================================================= */

export interface JourneyTotals {
    placesVisited: number;
    routeCount: number;
    knownDistanceMeters?: number;
    knownDurationMinutes?: number;
    transportSpend: number;
    otherSpend: number;
    totalKnownSpend: number;
    currency: "INR";
    distanceStatus:
        | "calculated"
        | "partially-known"
        | "unknown";
    durationStatus:
        | "calculated"
        | "partially-known"
        | "unknown";
}

/* =========================================================
   TRIP
========================================================= */

export interface TravelTrip {
    title: string;
    city?: string;
    country?: string;
    date?: string;
    summary: string;
}

/* =========================================================
   FINAL EXTRACTION
========================================================= */

export interface ExtractedTravelContent {
    trip: TravelTrip;
    places: TravelPoint[];
    routes: TravelRoute[];
    expenses: TravelExpense[];
    experiences: TravelerExperience[];
    totals: JourneyTotals;
}

/* =========================================================
   AI RAW JOURNEY EXTRACTION
========================================================= */

export interface TravelerJourneyExtraction {
    trip: TravelTrip;
    places: Array<{
        name: string;
        address?: string;
        city?: string;
        state?: string;
        country?: string;
        confidence: number;
        sequence: number;
    }>;
    routes: Array<{
        sequence: number;
        from: string;
        to: string;
        fromCity?: string;
        toCity?: string;
        transportMode: TravelTransportMode;
        distanceMeters?: number;
        durationMinutes?: number;
        amountPaid?: number;
        currency?: "INR";
        experience?: string;
        evidence?: string;
        confidence: number;
    }>;
    expenses: Array<{
        sequence?: number;
        category: ExperienceCategory;
        description: string;
        amount: number;
        currency?: "INR";
        placeName?: string;
        evidence?: string;
        confidence: number;
    }>;
    experiences: Array<{
        sequence?: number;
        title: string;
        summary: string;
        experienceType: ExperienceType;
        category: ExperienceCategory;
        subcategory?: string;
        placeName?: string;
        city?: string;
        reportedAmount?: number;
        expectedAmount?: number;
        transportMode?: TravelTransportMode;
        problem?: string;
        advice: string[];
        sourceQuote?: string;
        confidence: number;
    }>;
}

/* =========================================================
   SOURCE CONTENT
========================================================= */

export interface TravelSourceContent {
    contentId: string;
    title: string;
    description: string;
    sourceUrl: string;
    publishedAt?: string;
    channelTitle?: string;
    thumbnailUrl?: string;
    durationSeconds?: number;
    transcript?: string;
}

/* =========================================================
   JOURNEY API DTOs
========================================================= */

export type TripStatus =
    | "ACTIVE"
    | "COMPLETED"
    | "ARCHIVED";

export interface JourneySummary {
    id: string;
    name: string;
    status: TripStatus;
    sourceCount: number;
    placeCount: number;
    routeCount: number;
    expenseCount: number;
    totalKnownSpendInr: number;
    startDate?: string;
    endDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface JourneyDetail extends JourneySummary {
    sourceName?: string;
    destinationName?: string;
    sources: Array<
        TravelerSource & {
            tripId: string;
            publishedAt?: string;
            thumbnailUrl?: string;
            contentId?: string;
            transcriptProvided: boolean;
            processingStatus:
                | "PENDING"
                | "PROCESSING"
                | "COMPLETED"
                | "FAILED";
        }
    >;
    places: Array<{
        id: string;
        name: string;
        address?: string;
        city?: string;
        state?: string;
        country?: string;
        latitude?: number;
        longitude?: number;
        sequence: number;
        confidence: number;
    }>;
    routes: Array<{
        id: string;
        sequence: number;
        fromName: string;
        toName: string;
        fromCity?: string;
        toCity?: string;
        transportMode: TravelTransportMode;
        distanceMeters?: number;
        durationMinutes?: number;
        amountPaidInr?: number;
        confidence: number;
    }>;
    expenses: Array<{
        id: string;
        category: ExperienceCategory;
        description: string;
        amountInr: number;
        placeName?: string;
        confidence: number;
    }>;
    experiences: Array<{
        id: string;
        title: string;
        summary: string;
        experienceType: ExperienceType;
        category: ExperienceCategory;
        placeName?: string;
        reportedAmountInr?: number;
        expectedAmountInr?: number;
        confidence: number;
        visibility: DataVisibility;
    }>;
}

export interface SaveJourneySourceResponse {
    trip: JourneySummary;
    appended: {
        sourceId: string;
        places: number;
        routes: number;
        expenses: number;
        experiences: number;
    };
}
