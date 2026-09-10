import { NextResponse } from "next/server";

import {
    getFoodIntelligenceBatch,
} from "@/features/food/services/foodIntelligence.service";

export const runtime = "nodejs";

interface GeminiPart {
    text?: string;
}

interface GeminiCandidate {
    content?: {
        parts?: GeminiPart[];
    };
}

interface GeminiResponse {
    candidates?: GeminiCandidate[];
}

interface DetectedFood {
    name: string;
    confidence: number;
}

/* =========================================================
 * NORMALIZE FOOD NAME
 * ========================================================= */

function normalizeFoodName(
    value: string,
): string {
    return value
        .trim()
        .toLowerCase()
        .replace(
            /[^a-z0-9\s]/g,
            " ",
        )
        .replace(
            /\s+/g,
            " ",
        )
        .trim();
}

/* =========================================================
 * PARSE GEMINI RESPONSE
 * ========================================================= */

function parseGeminiResponse(
    data: GeminiResponse,
): DetectedFood[] {
    const text =
        data.candidates?.[0]
            ?.content?.parts
            ?.map(
                (part) =>
                    part.text ?? "",
            )
            .join("")
            .trim();

    if (!text) {
        return [];
    }

    const cleaned =
        text
            .replace(
                /^```json\s*/i,
                "",
            )
            .replace(
                /^```\s*/i,
                "",
            )
            .replace(
                /\s*```$/i,
                "",
            )
            .trim();

    try {
        const parsed =
            JSON.parse(
                cleaned,
            ) as unknown;

        if (
            typeof parsed !==
                "object" ||
            parsed === null
        ) {
            return [];
        }

        const items =
            (
                parsed as {
                    items?: unknown;
                }
            ).items;

        if (
            !Array.isArray(items)
        ) {
            return [];
        }

        return items
            .map(
                (
                    item,
                ): DetectedFood | null => {
                    if (
                        typeof item !==
                            "object" ||
                        item === null
                    ) {
                        return null;
                    }

                    const value =
                        item as {
                            name?: unknown;
                            confidence?: unknown;
                        };

                    if (
                        typeof value.name !==
                        "string"
                    ) {
                        return null;
                    }

                    const name =
                        value.name.trim();

                    if (!name) {
                        return null;
                    }

                    const confidence =
                        typeof value.confidence ===
                        "number"
                            ? Math.min(
                                  Math.max(
                                      value.confidence,
                                      0,
                                  ),
                                  1,
                              )
                            : 0.8;

                    return {
                        name,
                        confidence,
                    };
                },
            )
            .filter(
                (
                    item,
                ): item is DetectedFood =>
                    item !== null,
            );
    } catch {
        return [];
    }
}

/* =========================================================
 * GEMINI VISION
 *
 * This stays inside the API route because your
 * existing foodRecognition.service.ts is not exporting
 * a recognizeFoodImage() function.
 * ========================================================= */

async function detectFoodWithGemini(
    file: File,
    mode: "food" | "menu",
): Promise<DetectedFood[]> {
    const apiKey =
        process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error(
            "GEMINI_API_KEY is not configured.",
        );
    }

    const arrayBuffer =
        await file.arrayBuffer();

    const base64 =
        Buffer.from(
            arrayBuffer,
        ).toString("base64");

    const mimeType =
        file.type ||
        "image/jpeg";

    const prompt =
        mode === "food"
            ? `
You are a food recognition system.

Look carefully at the uploaded image.

Identify the actual food or dish shown.

Be specific.

For example:
- If the image shows vada pav, return "Vada Pav".
- Do not return "food".
- Do not return "Indian food".
- Do not return "snack".
- Do not identify the restaurant.
- Do not invent price information.

If multiple clearly different dishes are visible,
return each one.

Return ONLY valid JSON.

Required format:

{
  "items": [
    {
      "name": "Vada Pav",
      "confidence": 0.96
    }
  ]
}

Confidence must be between 0 and 1.
`
            : `
You are a restaurant menu recognition system.

Read the uploaded menu image carefully.

Extract the actual dish names visible.

Do not include menu prices in the food name.

Example:

"Vada Pav ........ ₹20"

must become:

"Vada Pav"

Return multiple dishes when visible.

Return ONLY valid JSON.

Required format:

{
  "items": [
    {
      "name": "Vada Pav",
      "confidence": 0.96
    }
  ]
}

Confidence must be between 0 and 1.
`;

    const endpoint =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";

    const response =
        await fetch(
            endpoint,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    "x-goog-api-key":
                        apiKey,
                },

                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    inline_data:
                                        {
                                            mime_type:
                                                mimeType,
                                            data:
                                                base64,
                                        },
                                },

                                {
                                    text: prompt,
                                },
                            ],
                        },
                    ],

                    generationConfig: {
                        temperature: 0.1,

                        responseMimeType:
                            "application/json",
                    },
                }),

                cache: "no-store",
            },
        );

    if (!response.ok) {
        const errorText =
            await response.text();

        console.error(
            "[food/scan] Gemini API error:",
            errorText,
        );

        throw new Error(
            `Gemini vision request failed: ${response.status}`,
        );
    }

    const data =
        (await response.json()) as GeminiResponse;

    return parseGeminiResponse(
        data,
    );
}

/* =========================================================
 * CREATE STABLE ID
 * ========================================================= */

function createFoodId(
    name: string,
): string {
    return `scan-${normalizeFoodName(
        name,
    ).replace(
        /\s+/g,
        "-",
    )}`;
}

/* =========================================================
 * POST /api/food/scan
 * ========================================================= */

export async function POST(
    request: Request,
) {
    try {
        /* -------------------------------------------------
         * 1. READ FORM DATA
         * ------------------------------------------------- */

        const formData =
            await request.formData();

        /*
         * IMPORTANT:
         *
         * Your current FoodScanner.tsx sends:
         *
         * formData.append("image", file)
         *
         * so we read "image".
         */
        const image =
            formData.get("image");

        const modeValue =
            formData.get("mode");

        if (
            !(image instanceof File)
        ) {
            return NextResponse.json(
                {
                    error:
                        "Image file is required.",
                },
                {
                    status: 400,
                },
            );
        }

        const mode =
            modeValue === "menu"
                ? "menu"
                : "food";

        /* -------------------------------------------------
         * 2. VALIDATE FILE
         * ------------------------------------------------- */

        if (
            !image.type.startsWith(
                "image/",
            )
        ) {
            return NextResponse.json(
                {
                    error:
                        "Only image files are supported.",
                },
                {
                    status: 400,
                },
            );
        }

        if (
            image.size >
            10 * 1024 * 1024
        ) {
            return NextResponse.json(
                {
                    error:
                        "Image must be smaller than 10 MB.",
                },
                {
                    status: 400,
                },
            );
        }

        console.log(
            `[food/scan] Starting ${mode} recognition`,
        );

        /* -------------------------------------------------
         * 3. GEMINI RECOGNITION
         * ------------------------------------------------- */

        const detected =
            await detectFoodWithGemini(
                image,
                mode,
            );

        console.log(
            "[food/scan] Gemini detected:",
            detected,
        );

        if (
            detected.length === 0
        ) {
            return NextResponse.json(
                {
                    items: [],
                    foods: [],
                    detectedFoods: [],
                    confidence: 0,

                    source:
                        "gemini",

                    message:
                        "No recognizable food was found in the image.",
                },
                {
                    status: 422,
                },
            );
        }

        /* -------------------------------------------------
         * 4. REMOVE DUPLICATES
         * ------------------------------------------------- */

        const uniqueDetected =
            Array.from(
                new Map(
                    detected.map(
                        (
                            food,
                        ) => [
                            normalizeFoodName(
                                food.name,
                            ),
                            food,
                        ],
                    ),
                ).values(),
            );

        /* -------------------------------------------------
         * 5. FOOD NAMES
         * ------------------------------------------------- */

        const detectedFoodNames =
            uniqueDetected.map(
                (food) =>
                    food.name,
            );

        /* -------------------------------------------------
         * 6. COMPLETE FOOD INTELLIGENCE
         *
         * This is where:
         *
         * Gemini result
         *       ↓
         * Food classification
         *       ↓
         * Wikipedia/Wikimedia
         *       ↓
         * USDA nutrition
         *       ↓
         * FairTrip knowledge
         *
         * becomes one complete FoodItem.
         * ------------------------------------------------- */

        const intelligence =
            await getFoodIntelligenceBatch(
                detectedFoodNames,
            );

        /* -------------------------------------------------
         * 7. MERGE RECOGNITION CONFIDENCE
         * ------------------------------------------------- */

        const foods =
            intelligence.map(
                (
                    food,
                ) => {
                    const detectedFood =
                        uniqueDetected.find(
                            (
                                detectedItem,
                            ) =>
                                normalizeFoodName(
                                    detectedItem.name,
                                ) ===
                                normalizeFoodName(
                                    food.name,
                                ),
                        );

                    return {
                        ...food,

                        id:
                            createFoodId(
                                food.name,
                            ),

                        confidence:
                            detectedFood
                                ?.confidence ??
                            0,

                        tags:
                            Array.from(
                                new Set([
                                    ...(food.tags ??
                                        []),

                                    "scanned-food",
                                ]),
                            ),
                    };
                },
            );

        /* -------------------------------------------------
         * 8. SAFETY FALLBACK
         *
         * Never lose a detected food just
         * because enrichment failed.
         * ------------------------------------------------- */

        const returnedNames =
            new Set(
                foods.map(
                    (
                        food,
                    ) =>
                        normalizeFoodName(
                            food.name,
                        ),
                ),
            );

        for (
            const detectedFood of uniqueDetected
        ) {
            const normalizedName =
                normalizeFoodName(
                    detectedFood.name,
                );

            if (
                returnedNames.has(
                    normalizedName,
                )
            ) {
                continue;
            }

            foods.push({
                id:
                    createFoodId(
                        detectedFood.name,
                    ),

                name:
                    detectedFood.name,

                cuisine: [],

                mealTypes: [],

                confidence:
                    detectedFood.confidence,

                tags: [
                    "scanned-food",
                    "intelligence-unavailable",
                ],
            });
        }

        /* -------------------------------------------------
         * 9. OVERALL CONFIDENCE
         * ------------------------------------------------- */

        const totalConfidence =
            uniqueDetected.reduce(
                (
                    total,
                    food,
                ) =>
                    total +
                    food.confidence,
                0,
            );

        const averageConfidence =
            uniqueDetected.length
                ? totalConfidence /
                  uniqueDetected.length
                : 0;

        /* -------------------------------------------------
         * 10. LOG
         * ------------------------------------------------- */

        console.log(
            "[food/scan] Complete food intelligence:",
            JSON.stringify(
                foods,
                null,
                2,
            ),
        );

        /* -------------------------------------------------
         * 11. RESPONSE
         * ------------------------------------------------- */

        return NextResponse.json({
            items:
                detectedFoodNames,

            foods,

            detectedFoods:
                detectedFoodNames,

            confidence:
                Number(
                    averageConfidence.toFixed(
                        2,
                    ),
                ),

            source:
                "gemini+fairtrip-food-intelligence",

            message:
                "Food recognized and enriched successfully.",

            metadata: {
                source:
                    "Gemini Vision + FairTrip Food Intelligence",

                retrievedAt:
                    new Date().toISOString(),

                foodCount:
                    foods.length,

                detectedFoodCount:
                    uniqueDetected.length,
            },
        });
    } catch (error) {
        console.error(
            "[food/scan] Failed:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to analyze the food image.",

                items: [],

                foods: [],

                detectedFoods: [],

                confidence: 0,

                source:
                    "gemini+fairtrip-food-intelligence",
            },
            {
                status: 500,
            },
        );
    }
}