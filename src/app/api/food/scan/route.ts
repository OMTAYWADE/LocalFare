import { NextResponse } from "next/server";

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

/* -------------------------------------------------------------------------- */
/* PARSE GEMINI RESPONSE                                                       */
/* -------------------------------------------------------------------------- */

function parseGeminiResponse(data: GeminiResponse): DetectedFood[] {
    const text = data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? "")
        .join("")
        .trim();

    if (!text) {
        return [];
    }

    const cleaned = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

    try {
        const parsed = JSON.parse(cleaned) as unknown;

        if (typeof parsed !== "object" || parsed === null) {
            return [];
        }

        const rawItems = (parsed as { items?: unknown }).items;

        if (!Array.isArray(rawItems)) {
            return [];
        }

        return rawItems
            .map((item): DetectedFood | null => {
                if (typeof item !== "object" || item === null) {
                    return null;
                }

                const value = item as { name?: unknown; confidence?: unknown };

                if (typeof value.name !== "string") {
                    return null;
                }

                const name = value.name.trim();

                if (!name) {
                    return null;
                }

                const confidence =
                    typeof value.confidence === "number"
                        ? Math.min(Math.max(value.confidence, 0), 1)
                        : 0.8;

                return { name, confidence };
            })
            .filter((item): item is DetectedFood => item !== null);
    } catch (error) {
        console.error("[food/scan] Gemini JSON parse failed:", error);
        return [];
    }
}

/* -------------------------------------------------------------------------- */
/* GEMINI VISION                                                               */
/* -------------------------------------------------------------------------- */

async function detectFoodWithGemini(
    file: File,
    mode: "food" | "menu",
): Promise<DetectedFood[]> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured.");
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = file.type || "image/jpeg";

    const prompt =
        mode === "food"
            ? `
You are a food recognition system.

Look carefully at the image and identify the specific food or dish.

Be specific.

For example:
- If the image shows vada pav, answer "Vada Pav".
- Do not answer "food".
- Do not answer "Indian food".
- Do not answer "snack".
- Do not answer "dish".
- Do not identify the restaurant.
- Do not invent a price.

If multiple clearly different dishes are visible, return each one.

Return ONLY valid JSON using this exact structure:

{
  "items": [
    {
      "name": "Vada Pav",
      "confidence": 0.96
    }
  ]
}

Confidence must be a number from 0 to 1.
`
            : `
You are a restaurant menu recognition system.

Read the menu image carefully.

Extract the specific food or dish names visible in the menu.

Do not include prices inside the food name.

Example:
"Vada Pav ........ ₹20"

must become:

"Vada Pav"

Return ONLY valid JSON using this exact structure:

{
  "items": [
    {
      "name": "Vada Pav",
      "confidence": 0.96
    }
  ]
}

Confidence must be a number from 0 to 1.
`;

    const endpoint =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        { inline_data: { mime_type: mimeType, data: base64 } },
                        { text: prompt },
                    ],
                },
            ],
            generationConfig: {
                responseMimeType: "application/json",
            },
        }),
        cache: "no-store",
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("[food/scan] Gemini API error:", errorText);
        throw new Error(`Gemini vision request failed: ${response.status}`);
    }

    const data = (await response.json()) as GeminiResponse;

    return parseGeminiResponse(data);
}

/* -------------------------------------------------------------------------- */
/* POST /api/food/scan                                                         */
/* -------------------------------------------------------------------------- */

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const image = formData.get("image");
        const modeValue = formData.get("mode");

        if (!image || !(image instanceof File)) {
            return NextResponse.json(
                { error: "Image file is required." },
                { status: 400 },
            );
        }

        const mode = modeValue === "menu" ? "menu" : "food";

        if (!image.type.startsWith("image/")) {
            return NextResponse.json(
                { error: "Only image files are supported." },
                { status: 400 },
            );
        }

        if (image.size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { error: "Image must be smaller than 10 MB." },
                { status: 400 },
            );
        }

        console.log(`[food/scan] Starting ${mode} recognition`);

        const detected = await detectFoodWithGemini(image, mode);

        console.log("[food/scan] Gemini detected:", detected);

        if (detected.length === 0) {
            return NextResponse.json({
                items: [],
                confidence: 0,
                source: "gemini",
                message: "No food could be confidently identified.",
            });
        }

        const items = detected.map((food) => food.name);

        const confidence =
            detected.reduce((total, item) => total + item.confidence, 0) /
            detected.length;

        return NextResponse.json({
            items,
            confidence: Number(confidence.toFixed(2)),
            source: "gemini",
        });
    } catch (error) {
        console.error("[food/scan] Failed:", error);

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Food recognition failed.",
                items: [],
                confidence: 0,
                source: "gemini",
            },
            { status: 500 },
        );
    }
}