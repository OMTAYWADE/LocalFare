import type {
    ExtractedTravelContent,
    JourneyTotals,
    TravelExpense,
    TravelPoint,
    TravelRoute,
    TravelerExperience,
    TravelerJourneyExtraction,
} from "../types/travelMemory.types";


function createId(
    prefix: string,
    index: number,
): string {
    return `${prefix}-${Date.now()}-${index}`;
}


function uniquePlaces(
    places: TravelerJourneyExtraction["places"],
): TravelPoint[] {
    const seen = new Set<string>();

    const result: TravelPoint[] = [];

    for (const place of [...places].sort(
        (a, b) => a.sequence - b.sequence,
    )) {
        const key =
            `${place.name.toLowerCase()}|${place.city?.toLowerCase() ?? ""}`;

        if (seen.has(key)) {
            continue;
        }

        seen.add(key);

        result.push({
            name: place.name,
            address: place.address,
            city: place.city,
            state: place.state,
            country: place.country,
            confidence: place.confidence,
        });
    }

    return result;
}


function calculateTotals(
    places: TravelPoint[],
    routes: TravelRoute[],
    expenses: TravelExpense[],
): JourneyTotals {
    const distanceValues = routes
        .map((route) => route.distanceMeters)
        .filter(
            (value): value is number =>
                typeof value === "number" &&
                Number.isFinite(value),
        );

    const durationValues = routes
        .map((route) => route.durationMinutes)
        .filter(
            (value): value is number =>
                typeof value === "number" &&
                Number.isFinite(value),
        );

    const transportSpend = routes.reduce(
        (total, route) =>
            total +
            (route.amountPaid ?? 0),
        0,
    );

    const otherSpend = expenses.reduce(
        (total, expense) =>
            total + expense.amount,
        0,
    );

    const totalKnownSpend =
        transportSpend + otherSpend;

    const knownDistance =
        distanceValues.length > 0
            ? distanceValues.reduce(
                  (total, value) =>
                      total + value,
                  0,
              )
            : undefined;

    const knownDuration =
        durationValues.length > 0
            ? durationValues.reduce(
                  (total, value) =>
                      total + value,
                  0,
              )
            : undefined;

    let distanceStatus:
        | "calculated"
        | "partially-known"
        | "unknown";

    if (
        routes.length > 0 &&
        distanceValues.length === routes.length
    ) {
        distanceStatus = "calculated";
    } else if (
        distanceValues.length > 0
    ) {
        distanceStatus = "partially-known";
    } else {
        distanceStatus = "unknown";
    }

    let durationStatus:
        | "calculated"
        | "partially-known"
        | "unknown";

    if (
        routes.length > 0 &&
        durationValues.length === routes.length
    ) {
        durationStatus = "calculated";
    } else if (
        durationValues.length > 0
    ) {
        durationStatus = "partially-known";
    } else {
        durationStatus = "unknown";
    }

    return {
        placesVisited: places.length,

        routeCount: routes.length,

        knownDistanceMeters:
            knownDistance,

        knownDurationMinutes:
            knownDuration,

        transportSpend,

        otherSpend,

        totalKnownSpend,

        currency: "INR",

        distanceStatus,

        durationStatus,
    };
}


export function buildTravelMemory(
    extraction: TravelerJourneyExtraction,
): ExtractedTravelContent {
    const places =
        uniquePlaces(extraction.places);

    const routes: TravelRoute[] =
        extraction.routes
            .sort(
                (a, b) =>
                    a.sequence - b.sequence,
            )
            .map((route, index) => ({
                id: createId(
                    "route",
                    index,
                ),

                sequence:
                    route.sequence,

                from: {
                    name: route.from,

                    city:
                        route.fromCity,

                    confidence:
                        route.confidence,
                },

                to: {
                    name: route.to,

                    city:
                        route.toCity,

                    confidence:
                        route.confidence,
                },

                transportMode:
                    route.transportMode,

                distanceMeters:
                    route.distanceMeters,

                durationMinutes:
                    route.durationMinutes,

                amountPaid:
                    route.amountPaid,

                currency:
                    route.amountPaid !== undefined
                        ? ("INR" as const)
                        : undefined,

                fareSource:
                    route.amountPaid !== undefined
                        ? "explicit"
                        : "unknown",

                experience:
                    route.experience,

                evidence:
                    route.evidence,

                confidence:
                    route.confidence,
            }));


    const expenses: TravelExpense[] =
        extraction.expenses.map(
            (expense, index) => ({
                id: createId(
                    "expense",
                    index,
                ),

                sequence:
                    expense.sequence,

                category:
                    expense.category,

                description:
                    expense.description,

                amount:
                    expense.amount,

                currency: "INR",

                placeName:
                    expense.placeName,

                evidence:
                    expense.evidence,

                confidence:
                    expense.confidence,
            }),
        );


    const experiences:
        TravelerExperience[] =
        extraction.experiences.map(
            (experience, index) => {
                const matchingPlace =
                    places.find(
                        (place) =>
                            place.name
                                .toLowerCase() ===
                            experience.placeName
                                ?.toLowerCase(),
                    );

                return {
                    id: createId(
                        "experience",
                        index,
                    ),

                    sequence:
                        experience.sequence,

                    title:
                        experience.title,

                    summary:
                        experience.summary,

                    experienceType:
                        experience.experienceType,

                    category:
                        experience.category,

                    subcategory:
                        experience.subcategory,

                    place:
                        matchingPlace,

                    reportedAmount:
                        experience.reportedAmount,

                    expectedAmount:
                        experience.expectedAmount,

                    transportMode:
                        experience.transportMode,

                    problem:
                        experience.problem,

                    advice:
                        experience.advice,

                    sourceQuote:
                        experience.sourceQuote,

                    confidence:
                        experience.confidence,

                    visibility:
                        "private",
                };
            },
        );


    const totals =
        calculateTotals(
            places,
            routes,
            expenses,
        );


    return {
        trip:
            extraction.trip,

        places,

        routes,

        expenses,

        experiences,

        totals,
    };
}