export type FoodRecognitionMode =
    | "food"
    | "menu";

export interface FoodRecognitionResult {
    items: string[];
    confidence?: number;
    source:
    | "vision"
    | "ocr"
    | "database"
    | "fallback";
}


/**
 * Normalizes recognition output so
 * the rest of FairTrip always receives
 * clean food names.
 */
export function normalizeFoodNames(items: string[],): string[] {
    return Array.from(
        new Set(items.map((item) =>
            item.trim().replace(/\s+/g, " "),
        ).filter((item) => item.length >= 2,),
        ),
    );
}


/**
 * Converts the result from your
 * /api/food/scan route into a
 * predictable FairTrip structure.
 */
export function normalizeRecognitionResult(items: unknown, mode: FoodRecognitionMode,): FoodRecognitionResult {
    const normalized = Array.isArray(items) ? items.filter((item,): item is string =>
        typeof item === "string" && item.trim().length > 0,) : [];

    return {
        items: normalizeFoodNames(normalized,),
        source: mode === "menu" ? "ocr" : "vision",
    };
}