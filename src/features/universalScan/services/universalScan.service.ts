import type {
    UniversalLocation,
    UniversalPrice,
    UniversalRecognition,
    UniversalScanRequest,
    UniversalScanResponse,
} from "../types/universalScan.types";

interface RawRecognition {
    name?: unknown;
    type?: unknown;
    kind?: unknown;
    brand?: unknown;
    model?: unknown;
    confidence?: unknown;
    attributes?: unknown;
    detectedText?: unknown;
}

interface GeminiResponse {
    output_text?: unknown;
    steps?: unknown;
}

interface ReverseGeocodeResponse {
    display_name?: unknown;
    address?: unknown;
}

function isObject(
    value: unknown,
): value is Record<string, unknown> {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
    );
}

function stringValue(
    value: unknown,
): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }

    const trimmed = value.trim();

    return trimmed.length > 0
        ? trimmed
        : undefined;
}

function confidenceValue(
    value: unknown,
): number {
    const number =
        typeof value === "number"
            ? value
            : Number(value);

    if (!Number.isFinite(number)) {
        return 0;
    }

    return Math.min(
        Math.max(number, 0),
        1,
    );
}

function normalizeType(
    value: unknown,
): UniversalRecognition["type"] {
    switch (
        stringValue(value)?.toLowerCase()
    ) {
        case "food":
            return "food";

        case "clothing":
            return "clothing";

        case "product":
            return "product";

        case "electronics":
            return "electronics";

        case "household":
            return "household";

        case "handicraft":
            return "handicraft";

        case "cosmetic":
            return "cosmetic";

        case "tool":
            return "tool";

        case "vehicle-part":
            return "vehicle-part";

        case "brand":
            return "brand";

        case "place":
            return "place";

        case "business":
            return "business";

        case "unknown":
            return "unknown";

        default:
            return "other";
    }
}

function normalizeKind(
    value: unknown,
): UniversalRecognition["kind"] {
    switch (
        stringValue(value)?.toLowerCase()
    ) {
        case "local":
            return "local";

        case "regional":
            return "regional";

        case "branded":
            return "branded";

        default:
            return "unknown";
    }
}

function normalizeAttributes(
    value: unknown,
): Record<string, string> {
    if (!isObject(value)) {
        return {};
    }

    const result: Record<string, string> = {};

    for (const [key, raw] of Object.entries(value)) {
        if (
            typeof raw === "string" &&
            raw.trim()
        ) {
            result[key] = raw.trim();
        } else if (
            typeof raw === "number" &&
            Number.isFinite(raw)
        ) {
            result[key] = String(raw);
        } else if (
            typeof raw === "boolean"
        ) {
            result[key] = String(raw);
        }
    }

    return result;
}

function normalizeDetectedText(
    value: unknown,
): string[] | undefined {
    if (!Array.isArray(value)) {
        return undefined;
    }

    const values = value
        .filter(
            (item): item is string =>
                typeof item === "string",
        )
        .map((item) => item.trim())
        .filter(Boolean);

    return values.length > 0
        ? values
        : undefined;
}

function normalizeRecognition(
    value: unknown,
): UniversalRecognition {
    const raw: RawRecognition =
        isObject(value)
            ? value
            : {};

    return {
        name:
            stringValue(raw.name) ??
            "Unknown item",

        type:
            normalizeType(raw.type),

        kind:
            normalizeKind(raw.kind),

        brand:
            stringValue(raw.brand),

        model:
            stringValue(raw.model),

        confidence:
            confidenceValue(
                raw.confidence,
            ),

        attributes:
            normalizeAttributes(
                raw.attributes,
            ),

        detectedText:
            normalizeDetectedText(
                raw.detectedText,
            ),
    };
}

function extractOutputText(
    data: GeminiResponse,
): string {
    if (
        typeof data.output_text ===
            "string" &&
        data.output_text.trim()
    ) {
        return data.output_text.trim();
    }

    if (!Array.isArray(data.steps)) {
        return "";
    }

    for (const step of data.steps) {
        if (!isObject(step)) {
            continue;
        }

        if (
            step.type !==
            "model_output"
        ) {
            continue;
        }

        if (!Array.isArray(step.content)) {
            continue;
        }

        for (const item of step.content) {
            if (!isObject(item)) {
                continue;
            }

            if (
                item.type === "text" &&
                typeof item.text === "string"
            ) {
                return item.text.trim();
            }
        }
    }

    return "";
}

/*
 * Gemini can sometimes wrap JSON in
 * markdown fences or additional text.
 *
 * Extract the actual JSON object before parsing it.
 */
function parseRecognitionJson(
    outputText: string,
): unknown {
    const cleaned = outputText
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

    try {
        const parsed = JSON.parse(cleaned);

        if (typeof parsed === "string") {
            try {
                return JSON.parse(parsed);
            } catch {
                return parsed;
            }
        }

        return parsed;
    } catch {
        // Continue below.
    }

    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (
        start === -1 ||
        end <= start
    ) {
        throw new Error(
            "Gemini did not return a JSON object.",
        );
    }

    const jsonCandidate =
        cleaned.slice(
            start,
            end + 1,
        );

    return JSON.parse(jsonCandidate);
}

/**
 * Sleep helper used for exponential backoff.
 */
function sleep(
    milliseconds: number,
): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(
            resolve,
            milliseconds,
        );
    });
}

/**
 * Calls Gemini with automatic retry.
 *
 * Retries only temporary server/rate-limit
 * errors such as 503 and 429.
 */
async function fetchGeminiWithRetry(
    url: string,
    options: RequestInit,
    maxRetries = 3,
): Promise<Response> {
    let lastResponse: Response | undefined;

    for (
        let attempt = 0;
        attempt <= maxRetries;
        attempt++
    ) {
        try {
            const response =
                await fetch(
                    url,
                    options,
                );

            lastResponse = response;

            // Success
            if (response.ok) {
                return response;
            }

            // Only retry temporary errors.
            const shouldRetry =
                response.status === 429 ||
                response.status === 500 ||
                response.status === 502 ||
                response.status === 503 ||
                response.status === 504;

            if (
                !shouldRetry ||
                attempt === maxRetries
            ) {
                return response;
            }

            /*
             * Exponential backoff:
             *
             * attempt 0 -> 1 second
             * attempt 1 -> 2 seconds
             * attempt 2 -> 4 seconds
             */
            const delay =
                1000 *
                Math.pow(
                    2,
                    attempt,
                );

            console.warn(
                `[UniversalScan] Gemini returned ${response.status}. ` +
                `Retrying in ${delay}ms ` +
                `(attempt ${attempt + 1}/${maxRetries})...`,
            );

            await sleep(delay);
        } catch (error) {
            /*
             * Network errors can also be temporary.
             */
            if (attempt === maxRetries) {
                throw error;
            }

            const delay =
                1000 *
                Math.pow(
                    2,
                    attempt,
                );

            console.warn(
                `[UniversalScan] Gemini network error. ` +
                `Retrying in ${delay}ms...`,
            );

            await sleep(delay);
        }
    }

    if (lastResponse) {
        return lastResponse;
    }

    throw new Error(
        "Unable to connect to Gemini.",
    );
}

async function callGemini(
    input: UniversalScanRequest,
): Promise<UniversalRecognition> {
    const apiKey =
        process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error(
            "GEMINI_API_KEY is not configured.",
        );
    }

    const model =
        process.env.GEMINI_MODEL ??
        "gemini-3.6-flash";

    const instruction = `
You are FairTrip's Universal Recognition Engine.

Identify the PRIMARY thing supplied by the user.

Supported types:

food
clothing
product
electronics
household
handicraft
cosmetic
tool
vehicle-part
brand
place
business
other
unknown

Supported kinds:

local
regional
branded
unknown

Rules:

1. Identify only what the evidence supports.

2. Never invent a brand.

3. Never invent a model.

4. Never invent a price.

5. Never invent specifications.

6. Never invent material.

7. Never invent origin.

8. If brand is not clearly visible or explicitly
   provided, return null.

9. If model is not clearly visible or explicitly
   provided, return null.

10. If local, regional or branded cannot be
    confidently determined, return unknown.

11. Confidence must be between 0 and 1.

12. Attributes must contain only useful,
    defensible properties.

13. detectedText must contain only text that
    is actually visible or explicitly provided.

14. Return exactly ONE primary recognition.

15. Do not identify unrelated background objects.

Return JSON only.

Expected format:

{
    "name": "string",
    "type": "food | clothing | product | electronics | household | handicraft | cosmetic | tool | vehicle-part | brand | place | business | other | unknown",
    "kind": "local | regional | branded | unknown",
    "brand": "string or null",
    "model": "string or null",
    "confidence": 0,
    "attributes": {},
    "detectedText": []
}
`;

    const inputParts: Array<
        Record<string, unknown>
    > = [
        {
            type: "text",
            text: instruction,
        },
    ];

    /*
     * TEXT INPUT
     */
    if (
        input.inputType === "text"
    ) {
        const text =
            input.text?.trim();

        if (!text) {
            throw new Error(
                "Text input is required.",
            );
        }

        inputParts.push({
            type: "text",
            text:
                `User description:\n${text}`,
        });
    }

    /*
     * IMAGE INPUT
     */
    if (
        input.inputType === "image"
    ) {
        if (!input.image) {
            throw new Error(
                "Image input is required.",
            );
        }

        if (
            !input.image.type.startsWith(
                "image/",
            )
        ) {
            throw new Error(
                "Only image files are supported.",
            );
        }

        const bytes =
            await input.image.arrayBuffer();

        inputParts.push({
            type: "image",

            data:
                Buffer
                    .from(bytes)
                    .toString("base64"),

            mime_type:
                input.image.type,
        });
    }

    /*
     * GEMINI REQUEST
     */
    const response =
        await fetchGeminiWithRetry(
            "https://generativelanguage.googleapis.com/v1beta/interactions",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    "x-goog-api-key":
                        apiKey,
                },

                body: JSON.stringify({
                    model,

                    input: inputParts,
                }),

                cache: "no-store",
            },
            3,
        );

    /*
     * Gemini still failed after retries.
     */
    if (!response.ok) {
        const errorText =
            await response.text();

        let message =
            `Gemini recognition failed (${response.status}).`;

        /*
         * Give a cleaner message for temporary
         * availability problems.
         */
        if (
            response.status === 503
        ) {
            message =
                "Gemini is temporarily unavailable due to high demand. Please try again in a few moments.";
        } else if (
            response.status === 429
        ) {
            message =
                "Gemini request limit reached. Please try again shortly.";
        } else if (
            response.status === 401 ||
            response.status === 403
        ) {
            message =
                "Gemini API authentication failed. Check GEMINI_API_KEY.";
        }

        console.error(
            "[UniversalScan] Gemini API error:",
            {
                status:
                    response.status,
                body:
                    errorText,
                model,
            },
        );

        throw new Error(
            `${message} ${errorText}`,
        );
    }

    /*
     * Parse Gemini response.
     */
    const data =
        (await response.json()) as GeminiResponse;

    const outputText =
        extractOutputText(data);

    if (!outputText) {
        throw new Error(
            "Gemini returned no recognition.",
        );
    }

    try {
        return normalizeRecognition(
            parseRecognitionJson(
                outputText,
            ),
        );
    } catch (parseError) {
        console.error(
            "[UniversalScan] Gemini raw output:",
            outputText,
        );

        throw new Error(
            parseError instanceof Error
                ? `Gemini returned invalid recognition JSON: ${parseError.message}`
                : "Gemini returned invalid recognition JSON.",
        );
    }
}

async function getLocation(
    latitude?: number,
    longitude?: number,
): Promise<
    UniversalLocation | undefined
> {
    if (
        typeof latitude !== "number" ||
        typeof longitude !== "number"
    ) {
        return undefined;
    }

    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
    ) {
        return undefined;
    }

    if (
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
    ) {
        return undefined;
    }

    const url =
        new URL(
            "https://nominatim.openstreetmap.org/reverse",
        );

    url.searchParams.set(
        "format",
        "jsonv2",
    );

    url.searchParams.set(
        "lat",
        String(latitude),
    );

    url.searchParams.set(
        "lon",
        String(longitude),
    );

    url.searchParams.set(
        "zoom",
        "18",
    );

    url.searchParams.set(
        "addressdetails",
        "1",
    );

    const response =
        await fetch(
            url.toString(),
            {
                headers: {
                    Accept:
                        "application/json",

                    "User-Agent":
                        "FairTrip/1.0",
                },

                cache: "no-store",
            },
        );

    if (!response.ok) {
        return undefined;
    }

    const data =
        (await response.json()) as
            ReverseGeocodeResponse;

    const address =
        isObject(data.address)
            ? data.address
            : {};

    const city =
        stringValue(address.city) ??
        stringValue(address.town) ??
        stringValue(address.village);

    return {
        name:
            stringValue(
                address.neighbourhood,
            ) ??
            stringValue(
                address.suburb,
            ) ??
            city,

        address:
            stringValue(
                data.display_name,
            ),

        city,

        state:
            stringValue(
                address.state,
            ),

        country:
            stringValue(
                address.country,
            ),

        latitude,

        longitude,
    };
}

function createPrice(
    recognition: UniversalRecognition,
    location?: UniversalLocation,
): UniversalPrice {
    if (
        recognition.confidence < 0.55 ||
        recognition.type === "unknown"
    ) {
        return {
            status: "unavailable",

            currency: "INR",

            locationName:
                location?.city ??
                location?.state,

            message:
                "The item was not identified confidently enough to provide a useful price range.",
        };
    }

    return {
        status: "variable",

        currency: "INR",

        locationName:
            location?.city ??
            location?.state ??
            "India",

        message:
            "Price varies by exact model, condition, seller, quality and local market.",
    };
}

export async function recognizeUniversal(
    input: UniversalScanRequest,
): Promise<UniversalScanResponse> {
    const recognition =
        await callGemini(input);

    const location =
        await getLocation(
            input.latitude,
            input.longitude,
        );

    const price =
        createPrice(
            recognition,
            location,
        );

    return {
        recognition,

        price,

        location,

        message: location
            ? `Recognized ${recognition.name} near ${
                  location.city ??
                  location.name ??
                  "your location"
              }.`
            : `Recognized ${recognition.name}.`,
    };
}