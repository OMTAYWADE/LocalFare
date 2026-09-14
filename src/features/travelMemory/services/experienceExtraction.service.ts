import type {
    DataVisibility,
    ExperienceCategory,
    ExperienceType,
    ExtractedTravelContent,
    JourneyTotals,
    TravelPoint,
    TravelerJourneyExtraction,
    TravelTransportMode,
} from "../types/travelMemory.types";
import type { YouTubeContent } from "./youtube.service";

interface GeminiResponse {
    candidates?: Array<{
        content?: {
            parts?: Array<{ text?: string }>;
        };
    }>;
    error?: { message?: string };
}

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string | undefined {
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function numberValue(value: unknown): number | undefined {
    if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
    if (typeof value !== "string" || !value.trim()) return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
}

function integerValue(value: unknown): number | undefined {
    const valueNumber = numberValue(value);
    return valueNumber === undefined ? undefined : Math.round(valueNumber);
}

function confidenceValue(value: unknown): number {
    return Math.min(Math.max(numberValue(value) ?? 0.5, 0), 1);
}

function enumValue<T extends string>(
    value: unknown,
    allowed: readonly T[],
    fallback: T,
): T {
    const normalized = stringValue(value)?.toLowerCase();
    return normalized && allowed.includes(normalized as T)
        ? (normalized as T)
        : fallback;
}

const EXPERIENCE_TYPES = [
    "positive",
    "negative",
    "neutral",
    "warning",
    "possible-overcharge",
    "reported-scam",
] as const satisfies readonly ExperienceType[];

const CATEGORIES = [
    "transport",
    "food",
    "shopping",
    "hotel",
    "attraction",
    "service",
    "other",
] as const satisfies readonly ExperienceCategory[];

const TRANSPORT_MODES = [
    "walk",
    "bus",
    "train",
    "metro",
    "shared-auto",
    "meter-auto",
    "taxi",
    "app-taxi",
    "ferry",
    "flight",
    "other",
    "unknown",
] as const satisfies readonly TravelTransportMode[];

function parseGeminiJson(text: string): unknown {
    const cleaned = text
        .trim()
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

    try {
        return JSON.parse(cleaned) as unknown;
    } catch {
        const start = cleaned.indexOf("{");
        const end = cleaned.lastIndexOf("}");
        if (start === -1 || end <= start) {
            throw new Error("Gemini did not return valid travel JSON.");
        }
        return JSON.parse(cleaned.slice(start, end + 1)) as unknown;
    }
}

function getGeminiText(data: GeminiResponse): string {
    return (
        data.candidates?.[0]?.content?.parts
            ?.map((part) => part.text ?? "")
            .join("")
            .trim() ?? ""
    );
}

function normalizeRawExtraction(value: unknown): TravelerJourneyExtraction {
    if (!isObject(value)) throw new Error("Invalid travel extraction result.");

    const tripValue = isObject(value.trip) ? value.trip : {};
    const rawPlaces = Array.isArray(value.places) ? value.places : [];
    const rawRoutes = Array.isArray(value.routes) ? value.routes : [];
    const rawExpenses = Array.isArray(value.expenses) ? value.expenses : [];
    const rawExperiences = Array.isArray(value.experiences) ? value.experiences : [];

    return {
        trip: {
            title: stringValue(tripValue.title) ?? "Travel experience",
            city: stringValue(tripValue.city),
            country: stringValue(tripValue.country),
            date: stringValue(tripValue.date),
            summary: stringValue(tripValue.summary) ?? "",
        },

        places: rawPlaces.flatMap((item, index) => {
            if (!isObject(item)) return [];
            const name = stringValue(item.name);
            if (!name) return [];

            return [{
                name,
                address: stringValue(item.address),
                city: stringValue(item.city),
                state: stringValue(item.state),
                country: stringValue(item.country),
                confidence: confidenceValue(item.confidence),
                sequence: integerValue(item.sequence) ?? index + 1,
            }];
        }),

        routes: rawRoutes.flatMap((item, index) => {
            if (!isObject(item)) return [];

            const from = stringValue(item.from);
            const to = stringValue(item.to);
            if (!from || !to) return [];

            return [{
                sequence: integerValue(item.sequence) ?? index + 1,
                from,
                to,
                fromCity: stringValue(item.fromCity),
                toCity: stringValue(item.toCity),
                transportMode: enumValue(item.transportMode, TRANSPORT_MODES, "unknown"),
                distanceMeters: numberValue(item.distanceMeters),
                durationMinutes: numberValue(item.durationMinutes),
                amountPaid: numberValue(item.amountPaid),
                currency: stringValue(item.currency)?.toUpperCase() === "INR" ? "INR" : undefined,
                experience: stringValue(item.experience),
                evidence: stringValue(item.evidence),
                confidence: confidenceValue(item.confidence),
            }];
        }),

        expenses: rawExpenses.flatMap((item, index) => {
            if (!isObject(item)) return [];

            const description = stringValue(item.description);
            const amount = numberValue(item.amount);
            if (!description || amount === undefined) return [];

            return [{
                sequence: integerValue(item.sequence) ?? index + 1,
                category: enumValue(item.category, CATEGORIES, "other"),
                description,
                amount: Math.max(0, amount),
                currency: stringValue(item.currency)?.toUpperCase() === "INR" ? "INR" : undefined,
                placeName: stringValue(item.placeName),
                evidence: stringValue(item.evidence),
                confidence: confidenceValue(item.confidence),
            }];
        }),

        experiences: rawExperiences.flatMap((item, index) => {
            if (!isObject(item)) return [];

            const title = stringValue(item.title);
            const summary = stringValue(item.summary);
            if (!title || !summary) return [];

            const advice = Array.isArray(item.advice)
                ? item.advice.filter(
                      (entry): entry is string =>
                          typeof entry === "string" && entry.trim().length > 0,
                  )
                : [];

            const rawMode = stringValue(item.transportMode);

            return [{
                sequence: integerValue(item.sequence) ?? index + 1,
                title,
                summary,
                experienceType: enumValue(item.experienceType, EXPERIENCE_TYPES, "neutral"),
                category: enumValue(item.category, CATEGORIES, "other"),
                subcategory: stringValue(item.subcategory),
                placeName: stringValue(item.placeName),
                city: stringValue(item.city),
                reportedAmount: numberValue(item.reportedAmount),
                expectedAmount: numberValue(item.expectedAmount),
                transportMode: rawMode
                    ? enumValue(rawMode, TRANSPORT_MODES, "unknown")
                    : undefined,
                problem: stringValue(item.problem),
                advice,
                sourceQuote: stringValue(item.sourceQuote),
                confidence: confidenceValue(item.confidence),
            }];
        }),
    };
}

function point(
    name: string,
    city: string | undefined,
    confidence: number,
): TravelPoint {
    return { name, city, confidence };
}

function calculateTotals(
    places: TravelPoint[],
    routes: ExtractedTravelContent["routes"],
    expenses: ExtractedTravelContent["expenses"],
): JourneyTotals {
    const distances = routes
        .map((route) => route.distanceMeters)
        .filter((value): value is number => value !== undefined);

    const durations = routes
        .map((route) => route.durationMinutes)
        .filter((value): value is number => value !== undefined);

    const routeTransportSpend = routes.reduce(
        (sum, route) => sum + (route.amountPaid ?? 0),
        0,
    );

    const transportExpenseSpend = expenses
        .filter((expense) => expense.category === "transport")
        .reduce((sum, expense) => sum + expense.amount, 0);

    const otherSpend = expenses
        .filter((expense) => expense.category !== "transport")
        .reduce((sum, expense) => sum + expense.amount, 0);

    const transportSpend = routeTransportSpend + transportExpenseSpend;

    return {
        placesVisited: places.length,
        routeCount: routes.length,
        knownDistanceMeters:
            distances.length > 0
                ? distances.reduce((sum, value) => sum + value, 0)
                : undefined,
        knownDurationMinutes:
            durations.length > 0
                ? durations.reduce((sum, value) => sum + value, 0)
                : undefined,
        transportSpend: Math.round(transportSpend),
        otherSpend: Math.round(otherSpend),
        totalKnownSpend: Math.round(transportSpend + otherSpend),
        currency: "INR",
        distanceStatus:
            routes.length === 0
                ? "unknown"
                : distances.length === routes.length
                  ? "calculated"
                  : "partially-known",
        durationStatus:
            routes.length === 0
                ? "unknown"
                : durations.length === routes.length
                  ? "calculated"
                  : "partially-known",
    };
}

function normalizeResult(
    raw: TravelerJourneyExtraction,
): ExtractedTravelContent {
    const places = raw.places
        .slice()
        .sort((a, b) => a.sequence - b.sequence)
        .map((item) => ({
            name: item.name,
            address: item.address,
            city: item.city,
            state: item.state,
            country: item.country,
            confidence: item.confidence,
        }));

    const routes = raw.routes
        .slice()
        .sort((a, b) => a.sequence - b.sequence)
        .map((route, index) => ({
            id: `route-${index + 1}`,
            sequence: route.sequence,
            from: point(route.from, route.fromCity, route.confidence),
            to: point(route.to, route.toCity, route.confidence),
            transportMode: route.transportMode,
            distanceMeters: route.distanceMeters,
            durationMinutes: route.durationMinutes,
            amountPaid: route.amountPaid,
            currency: route.currency,
            fareSource: route.amountPaid !== undefined ? "explicit" as const : "unknown" as const,
            experience: route.experience,
            evidence: route.evidence,
            confidence: route.confidence,
        }));

    const expenses = raw.expenses
        .slice()
        .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0))
        .map((expense, index) => ({
            id: `expense-${index + 1}`,
            sequence: expense.sequence,
            category: expense.category,
            description: expense.description,
            amount: Math.round(expense.amount),
            currency: "INR" as const,
            placeName: expense.placeName,
            evidence: expense.evidence,
            confidence: expense.confidence,
        }));

    const experiences = raw.experiences
        .slice()
        .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0))
        .map((experience, index) => ({
            id: `experience-${index + 1}`,
            sequence: experience.sequence,
            title: experience.title,
            summary: experience.summary,
            experienceType: experience.experienceType,
            category: experience.category,
            subcategory: experience.subcategory,
            place: experience.placeName
                ? point(experience.placeName, experience.city, experience.confidence)
                : undefined,
            reportedAmount: experience.reportedAmount,
            expectedAmount: experience.expectedAmount,
            transportMode: experience.transportMode,
            problem: experience.problem,
            advice: experience.advice,
            sourceQuote: experience.sourceQuote,
            confidence: experience.confidence,
            visibility: "private" as const,
        }));

    return {
        trip: raw.trip,
        places,
        routes,
        expenses,
        experiences,
        totals: calculateTotals(places, routes, expenses),
    };
}

export async function extractTravelExperience(
    content: YouTubeContent,
    transcript?: string,
): Promise<ExtractedTravelContent> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

    const sourceText = [
        `VIDEO TITLE:\n${content.title}`,
        `VIDEO DESCRIPTION:\n${content.description || "Not available"}`,
        transcript?.trim()
            ? `TRANSCRIPT:\n${transcript.trim()}`
            : "TRANSCRIPT: Not available. Do not infer spoken events.",
    ].join("\n\n");

    const prompt = `
You are FairTrip's private travel-memory extraction engine.

Extract only information explicitly supported by the supplied travel content.

Rules:
- Never invent a place, fare, route, amount, distance, duration, or event.
- Unknown values must be null.
- Do not turn opinions into facts.
- A single traveler report is not a verified public warning.
- Use "possible-overcharge" when a traveler reports paying more than expected without enough evidence to call it a scam.
- Use "reported-scam" only when the traveler explicitly describes deceptive or fraudulent behavior.
- Keep experiences private. Public FairTrip warnings require a separate evidence/review process.
- Use INR only when the content explicitly states an Indian rupee amount.
- Return JSON only.

JSON shape:
{
  "trip": {
    "title": "string",
    "city": "string|null",
    "country": "string|null",
    "date": "string|null",
    "summary": "string"
  },
  "places": [
    {
      "name": "string",
      "address": "string|null",
      "city": "string|null",
      "state": "string|null",
      "country": "string|null",
      "confidence": 0.0,
      "sequence": 1
    }
  ],
  "routes": [
    {
      "sequence": 1,
      "from": "string",
      "to": "string",
      "fromCity": "string|null",
      "toCity": "string|null",
      "transportMode": "walk|bus|train|metro|shared-auto|meter-auto|taxi|app-taxi|ferry|flight|other|unknown",
      "distanceMeters": 0,
      "durationMinutes": 0,
      "amountPaid": 0,
      "currency": "INR|null",
      "experience": "string|null",
      "evidence": "string|null",
      "confidence": 0.0
    }
  ],
  "expenses": [
    {
      "sequence": 1,
      "category": "transport|food|shopping|hotel|attraction|service|other",
      "description": "string",
      "amount": 0,
      "currency": "INR|null",
      "placeName": "string|null",
      "evidence": "string|null",
      "confidence": 0.0
    }
  ],
  "experiences": [
    {
      "sequence": 1,
      "title": "string",
      "summary": "string",
      "experienceType": "positive|negative|neutral|warning|possible-overcharge|reported-scam",
      "category": "transport|food|shopping|hotel|attraction|service|other",
      "subcategory": "string|null",
      "placeName": "string|null",
      "city": "string|null",
      "reportedAmount": 0,
      "expectedAmount": 0,
      "transportMode": "walk|bus|train|metro|shared-auto|meter-auto|taxi|app-taxi|ferry|flight|other|unknown|null",
      "problem": "string|null",
      "advice": ["string"],
      "sourceQuote": "string|null",
      "confidence": 0.0
    }
  ]
}

CONTENT:
${sourceText}`;

    const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey,
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: prompt }],
                    },
                ],
                generationConfig: {
                    responseMimeType: "application/json",
                },
            }),
            cache: "no-store",
        },
    );

    const data = (await response.json()) as GeminiResponse;

    if (!response.ok) {
        throw new Error(
            data.error?.message ?? "Gemini travel extraction failed.",
        );
    }

    const text = getGeminiText(data);
    if (!text) throw new Error("Gemini returned no travel extraction.");

    return normalizeResult(
        normalizeRawExtraction(parseGeminiJson(text)),
    );
}
