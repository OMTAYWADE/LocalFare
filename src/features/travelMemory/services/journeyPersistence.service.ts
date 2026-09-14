import { prisma } from "@/lib/prisma";
import type {
    DataVisibility,
    ExperienceCategory,
    ExperienceType,
    ExtractedTravelContent,
    JourneyDetail,
    JourneySummary,
    TravelSourcePlatform,
    TravelSourceType,
    TravelTransportMode,
} from "../types/travelMemory.types";

function toInt(value: number | undefined): number | undefined {
    return value === undefined || !Number.isFinite(value)
        ? undefined
        : Math.round(value);
}

function dateOrUndefined(value?: string): Date | undefined {
    if (!value) return undefined;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
}

const PLATFORM_MAP = {
    youtube: "YOUTUBE",
    instagram: "INSTAGRAM",
} as const;

function mapPlatform(value: TravelSourcePlatform) {
    return PLATFORM_MAP[value];
}

const SOURCE_TYPE_MAP = {
    channel: "CHANNEL",
    profile: "PROFILE",
    video: "VIDEO",
    post: "POST",
} as const;

function mapSourceType(value: TravelSourceType) {
    return SOURCE_TYPE_MAP[value];
}

const TRANSPORT_MAP = {
    walk: "WALK",
    bus: "BUS",
    train: "TRAIN",
    metro: "METRO",
    "shared-auto": "SHARED_AUTO",
    "meter-auto": "METER_AUTO",
    taxi: "TAXI",
    "app-taxi": "APP_TAXI",
    ferry: "FERRY",
    flight: "FLIGHT",
    other: "OTHER",
    unknown: "UNKNOWN",
} as const;

function mapTransport(value: TravelTransportMode) {
    return TRANSPORT_MAP[value];
}

const EXPENSE_CATEGORY_MAP = {
    transport: "TRANSPORT",
    food: "FOOD",
    shopping: "SHOPPING",
    hotel: "HOTEL",
    attraction: "ATTRACTION",
    service: "SERVICE",
    other: "OTHER",
} as const;

function mapCategory(value: ExperienceCategory) {
    return EXPENSE_CATEGORY_MAP[value];
}

const EXPERIENCE_TYPE_MAP = {
    positive: "POSITIVE",
    negative: "NEGATIVE",
    neutral: "NEUTRAL",
    warning: "WARNING",
    "possible-overcharge": "POSSIBLE_OVERCHARGE",
    "reported-scam": "REPORTED_SCAM",
} as const;

function mapExperienceType(value: ExperienceType) {
    return EXPERIENCE_TYPE_MAP[value];
}

const VISIBILITY_MAP = {
    private: "PRIVATE",
    "fairtrip-candidate": "FAIRTRIP_CANDIDATE",
    "fairtrip-public": "FAIRTRIP_PUBLIC",
} as const;

function mapVisibility(value: DataVisibility) {
    return VISIBILITY_MAP[value];
}

const FARE_SOURCE_MAP = {
    explicit: "EXPLICIT",
    calculated: "CALCULATED",
    unknown: "UNKNOWN",
} as const;

function mapFareSource(value: "explicit" | "calculated" | "unknown") {
    return FARE_SOURCE_MAP[value];
}

function fromTransport(value: string): TravelTransportMode {
    return value.toLowerCase().replace(/_/g, "-") as TravelTransportMode;
}

function fromCategory(value: string): ExperienceCategory {
    return value.toLowerCase() as ExperienceCategory;
}

function fromExperienceType(value: string): ExperienceType {
    return value.toLowerCase().replace(/_/g, "-") as ExperienceType;
}

function fromVisibility(value: string): DataVisibility {
    return value.toLowerCase().replace(/_/g, "-") as DataVisibility;
}

function summary(trip: {
    id: string;
    name: string;
    status: "ACTIVE" | "COMPLETED" | "ARCHIVED";
    sourceCount: number;
    placeCount: number;
    routeCount: number;
    expenseCount: number;
    totalKnownSpendInr: number;
    startDate: Date | null;
    endDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
}): JourneySummary {
    return {
        id: trip.id,
        name: trip.name,
        status: trip.status,
        sourceCount: trip.sourceCount,
        placeCount: trip.placeCount,
        routeCount: trip.routeCount,
        expenseCount: trip.expenseCount,
        totalKnownSpendInr: trip.totalKnownSpendInr,
        startDate: trip.startDate?.toISOString(),
        endDate: trip.endDate?.toISOString(),
        createdAt: trip.createdAt.toISOString(),
        updatedAt: trip.updatedAt.toISOString(),
    };
}

export async function listJourneys(
    userId: string,
): Promise<JourneySummary[]> {
    const trips = await prisma.trip.findMany({
        where: { userId },
        orderBy: [
            { status: "asc" },
            { updatedAt: "desc" },
        ],
        select: {
            id: true,
            name: true,
            status: true,
            sourceCount: true,
            placeCount: true,
            routeCount: true,
            expenseCount: true,
            totalKnownSpendInr: true,
            startDate: true,
            endDate: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return trips.map(summary);
}

export async function createJourney(
    userId: string,
    name: string,
): Promise<JourneySummary> {
    const cleanName = name.trim();

    if (!cleanName) {
        throw new Error("Journey name is required.");
    }

    const trip = await prisma.trip.create({
        data: {
            userId,
            name: cleanName,
            status: "ACTIVE",
            travelerType: "TOURIST",
        },
        select: {
            id: true,
            name: true,
            status: true,
            sourceCount: true,
            placeCount: true,
            routeCount: true,
            expenseCount: true,
            totalKnownSpendInr: true,
            startDate: true,
            endDate: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return summary(trip);
}

export async function getJourney(
    userId: string,
    tripId: string,
): Promise<JourneyDetail | null> {
    const trip = await prisma.trip.findFirst({
        where: { id: tripId, userId },
        include: {
            sources: { orderBy: { createdAt: "asc" } },
            places: { orderBy: { sequence: "asc" } },
            routes: { orderBy: { sequence: "asc" } },
            expenses: { orderBy: { createdAt: "asc" } },
            experiences: { orderBy: { sequence: "asc" } },
        },
    });

    if (!trip) return null;

    return {
        ...summary(trip),
        sourceName: trip.sourceName ?? undefined,
        destinationName: trip.destinationName ?? undefined,

        sources: trip.sources.map((source) => ({
            id: source.id,
            userId: source.userId,
            tripId: source.tripId,
            platform:
                source.platform === "YOUTUBE"
                    ? "youtube"
                    : "instagram",
            sourceUrl: source.sourceUrl,
            sourceId: source.sourceId ?? undefined,
            sourceType:
                source.sourceType.toLowerCase() as TravelSourceType,
            title: source.title ?? undefined,
            channelName: source.channelName ?? undefined,
            lastProcessedContentId:
                source.contentId ?? undefined,
            lastCheckedAt: source.updatedAt.toISOString(),
            active: true,
            createdAt: source.createdAt.toISOString(),
            updatedAt: source.updatedAt.toISOString(),
            publishedAt: source.publishedAt?.toISOString(),
            thumbnailUrl: source.thumbnailUrl ?? undefined,
            contentId: source.contentId ?? undefined,
            transcriptProvided: source.transcriptProvided,
            processingStatus: source.processingStatus,
        })),

        places: trip.places.map((place) => ({
            id: place.id,
            name: place.name,
            address: place.address ?? undefined,
            city: place.city ?? undefined,
            state: place.state ?? undefined,
            country: place.country ?? undefined,
            latitude: place.latitude ?? undefined,
            longitude: place.longitude ?? undefined,
            sequence: place.sequence,
            confidence: place.confidence,
        })),

        routes: trip.routes.map((route) => ({
            id: route.id,
            sequence: route.sequence,
            fromName: route.fromName,
            toName: route.toName,
            fromCity: route.fromCity ?? undefined,
            toCity: route.toCity ?? undefined,
            transportMode: fromTransport(route.transportMode),
            distanceMeters: route.distanceMeters ?? undefined,
            durationMinutes: route.durationMinutes ?? undefined,
            amountPaidInr: route.amountPaidInr ?? undefined,
            confidence: route.confidence,
        })),

        expenses: trip.expenses.map((expense) => ({
            id: expense.id,
            category: fromCategory(expense.category),
            description: expense.description,
            amountInr: expense.amountInr,
            placeName: expense.placeName ?? undefined,
            confidence: expense.confidence,
        })),

        experiences: trip.experiences.map((experience) => ({
            id: experience.id,
            title: experience.title,
            summary: experience.summary,
            experienceType: fromExperienceType(
                experience.experienceType,
            ),
            category: fromCategory(experience.category),
            placeName: experience.placeName ?? undefined,
            reportedAmountInr:
                experience.reportedAmountInr ?? undefined,
            expectedAmountInr:
                experience.expectedAmountInr ?? undefined,
            confidence: experience.confidence,
            visibility: fromVisibility(
                experience.visibility,
            ),
        })),
    };
}

export async function appendExtractionToJourney(input: {
    userId: string;
    tripId: string;
    source: {
        platform: TravelSourcePlatform;
        sourceUrl: string;
        sourceId?: string;
        sourceType: TravelSourceType;
        title?: string;
        channelName?: string;
        publishedAt?: string;
        thumbnailUrl?: string;
        contentId?: string;
    };
    transcript?: string;
    extraction: ExtractedTravelContent;
}) {
    const {
        userId,
        tripId,
        source,
        transcript,
        extraction,
    } = input;

    return prisma.$transaction(async (tx) => {
        const trip = await tx.trip.findFirst({
            where: { id: tripId, userId },
            select: {
                id: true,
                name: true,
                status: true,
                sourceCount: true,
                placeCount: true,
                routeCount: true,
                expenseCount: true,
                totalKnownSpendInr: true,
                totalTransportSpendInr: true,
                totalOtherSpendInr: true,
                knownDistanceMeters: true,
                knownDurationMinutes: true,
                startDate: true,
                endDate: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!trip) throw new Error("Journey not found.");

        if (trip.status === "ARCHIVED") {
            throw new Error(
                "Archived journeys cannot receive new travel content.",
            );
        }

        const existingSource = await tx.travelSource.findUnique({
            where: {
                tripId_sourceUrl: {
                    tripId,
                    sourceUrl: source.sourceUrl,
                },
            },
            select: { id: true },
        });

        if (existingSource) {
            throw new Error(
                "This source is already part of this journey.",
            );
        }

        const lastPlace = await tx.travelPlace.findFirst({
            where: { tripId },
            orderBy: { sequence: "desc" },
            select: { sequence: true },
        });

        const lastRoute = await tx.travelRoute.findFirst({
            where: { tripId },
            orderBy: { sequence: "desc" },
            select: { sequence: true },
        });

        const lastExpense = await tx.travelExpense.findFirst({
            where: { tripId },
            orderBy: { sequence: "desc" },
            select: { sequence: true },
        });

        const lastExperience = await tx.travelExperience.findFirst({
            where: { tripId },
            orderBy: { sequence: "desc" },
            select: { sequence: true },
        });

        const sourceRecord = await tx.travelSource.create({
            data: {
                userId,
                tripId,
                platform: mapPlatform(source.platform),
                sourceUrl: source.sourceUrl,
                sourceId: source.sourceId,
                sourceType: mapSourceType(source.sourceType),
                title: source.title,
                channelName: source.channelName,
                publishedAt: dateOrUndefined(source.publishedAt),
                thumbnailUrl: source.thumbnailUrl,
                contentId: source.contentId,
                transcriptProvided: Boolean(transcript?.trim()),
                processingStatus: "COMPLETED",
            },
        });

        const placeOffset = lastPlace?.sequence ?? 0;
        const routeOffset = lastRoute?.sequence ?? 0;
        const expenseOffset = lastExpense?.sequence ?? 0;
        const experienceOffset = lastExperience?.sequence ?? 0;

        if (extraction.places.length) {
            await tx.travelPlace.createMany({
                data: extraction.places.map((place, index) => ({
                    userId,
                    tripId,
                    name: place.name,
                    address: place.address,
                    city: place.city,
                    state: place.state,
                    country: place.country,
                    latitude: place.latitude,
                    longitude: place.longitude,
                    sequence: placeOffset + index + 1,
                    confidence: place.confidence,
                })),
            });
        }

        if (extraction.routes.length) {
            await tx.travelRoute.createMany({
                data: extraction.routes.map((route, index) => ({
                    userId,
                    tripId,
                    sequence: routeOffset + index + 1,
                    fromName: route.from.name,
                    toName: route.to.name,
                    fromCity: route.from.city,
                    toCity: route.to.city,
                    transportMode: mapTransport(route.transportMode),
                    distanceMeters: toInt(route.distanceMeters),
                    durationMinutes: toInt(route.durationMinutes),
                    amountPaidInr: toInt(route.amountPaid),
                    fareSource: mapFareSource(route.fareSource),
                    experience: route.experience,
                    evidence: route.evidence,
                    confidence: route.confidence,
                })),
            });
        }

        if (extraction.expenses.length) {
            await tx.travelExpense.createMany({
                data: extraction.expenses.map((expense, index) => ({
                    userId,
                    tripId,
                    sequence: expenseOffset + index + 1,
                    category: mapCategory(expense.category),
                    description: expense.description,
                    amountInr: Math.max(0, Math.round(expense.amount)),
                    placeName: expense.placeName,
                    evidence: expense.evidence ?? source.sourceUrl,
                    confidence: expense.confidence,
                })),
            });
        }

        if (extraction.experiences.length) {
            await tx.travelExperience.createMany({
                data: extraction.experiences.map((experience, index) => ({
                    userId,
                    tripId,
                    sourceId: sourceRecord.id,
                    sequence: experienceOffset + index + 1,
                    title: experience.title,
                    summary: experience.summary,
                    experienceType: mapExperienceType(
                        experience.experienceType,
                    ),
                    category: mapCategory(experience.category),
                    subcategory: experience.subcategory,
                    placeName: experience.place?.name,
                    city: experience.place?.city,
                    reportedAmountInr: toInt(
                        experience.reportedAmount,
                    ),
                    expectedAmountInr: toInt(
                        experience.expectedAmount,
                    ),
                    transportMode: experience.transportMode
                        ? mapTransport(experience.transportMode)
                        : undefined,
                    problem: experience.problem,
                    advice: experience.advice,
                    sourceQuote: experience.sourceQuote,
                    confidence: experience.confidence,
                    // AI can never directly publish a public verdict.
                    visibility: "PRIVATE",
                })),
            });
        }

        const routeDistance = extraction.routes.reduce(
            (sum, route) => sum + (route.distanceMeters ?? 0),
            0,
        );

        const routeDuration = extraction.routes.reduce(
            (sum, route) => sum + (route.durationMinutes ?? 0),
            0,
        );

        const updatedTrip = await tx.trip.update({
            where: { id: tripId },
            data: {
                // Selecting a completed journey means continuing it.
                status: "ACTIVE",
                sourceCount:
                    trip.sourceCount + 1,
                placeCount:
                    trip.placeCount + extraction.places.length,
                routeCount:
                    trip.routeCount + extraction.routes.length,
                expenseCount:
                    trip.expenseCount + extraction.expenses.length,
                totalKnownSpendInr:
                    trip.totalKnownSpendInr +
                    extraction.totals.totalKnownSpend,
                totalTransportSpendInr:
                    trip.totalTransportSpendInr +
                    extraction.totals.transportSpend,
                totalOtherSpendInr:
                    trip.totalOtherSpendInr +
                    extraction.totals.otherSpend,
                knownDistanceMeters:
                    extraction.totals.knownDistanceMeters !== undefined
                        ? (trip.knownDistanceMeters ?? 0) +
                          routeDistance
                        : trip.knownDistanceMeters,
                knownDurationMinutes:
                    extraction.totals.knownDurationMinutes !== undefined
                        ? (trip.knownDurationMinutes ?? 0) +
                          routeDuration
                        : trip.knownDurationMinutes,
                startDate:
                    trip.startDate ??
                    dateOrUndefined(extraction.trip.date) ??
                    new Date(),
                destinationName:
                    extraction.trip.city ??
                    undefined,
                destinationLatitude:
                    extraction.places.at(-1)?.latitude ??
                    undefined,
                destinationLongitude:
                    extraction.places.at(-1)?.longitude ??
                    undefined,
            },
            select: {
                id: true,
                name: true,
                status: true,
                sourceCount: true,
                placeCount: true,
                routeCount: true,
                expenseCount: true,
                totalKnownSpendInr: true,
                startDate: true,
                endDate: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return {
            trip: summary(updatedTrip),
            appended: {
                sourceId: sourceRecord.id,
                places: extraction.places.length,
                routes: extraction.routes.length,
                expenses: extraction.expenses.length,
                experiences: extraction.experiences.length,
            },
        };
    });
}

export async function finishJourney(
    userId: string,
    tripId: string,
): Promise<JourneySummary> {
    const trip = await prisma.trip.findFirst({
        where: { id: tripId, userId },
        select: {
            id: true,
            name: true,
            status: true,
            sourceCount: true,
            placeCount: true,
            routeCount: true,
            expenseCount: true,
            totalKnownSpendInr: true,
            startDate: true,
            endDate: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!trip) throw new Error("Journey not found.");

    const updated = await prisma.trip.update({
        where: { id: tripId },
        data: {
            status: "COMPLETED",
            endDate: new Date(),
        },
        select: {
            id: true,
            name: true,
            status: true,
            sourceCount: true,
            placeCount: true,
            routeCount: true,
            expenseCount: true,
            totalKnownSpendInr: true,
            startDate: true,
            endDate: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return summary(updated);
}
