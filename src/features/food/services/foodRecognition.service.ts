import type {
    FoodRecognitionMode,
    FoodRecognitionResult,
} from "../types/food.types";

export function normalizeFoodNames(
    items: string[],
): string[] {
    return Array.from(
        new Set(
            items
                .filter(
                    (item): item is string =>
                        typeof item === "string",
                )
                .map((item) =>
                    item
                        .trim()
                        .replace(/\s+/g, " "),
                )
                .filter(
                    (item) => item.length >= 2,
                ),
        ),
    );
}

export function normalizeRecognitionResult(
    items: unknown,
    mode: FoodRecognitionMode,
): FoodRecognitionResult {
    const normalized = Array.isArray(items)
        ? items.filter(
              (item): item is string =>
                  typeof item === "string" &&
                  item.trim().length > 0,
          )
        : [];

    return {
        items: normalizeFoodNames(normalized),
        source:
            mode === "menu"
                ? "ocr"
                : "vision",
    };
}