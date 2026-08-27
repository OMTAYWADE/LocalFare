const OPEN_FOOD_FACTS_BASE = "https://world.openfoodfacts.org/api/v2";

interface OpenFoodFactsProduct {
    code?: string;

    product_name?: string;

    product_name_en?: string;

    brands?: string;

    image_front_url?: string;

    image_url?: string;

    ingredients_text?: string;

    allergens?: string;

    categories?: string;

    nutrition_grades?: string;

    nutriscore_grade?: string;

    nutriments?: Record<
        string,
        number | string | undefined
    >;
}

interface OpenFoodFactsResponse {
    status?: number;

    status_verbose?: string;

    product?: OpenFoodFactsProduct;
}


/**
 * Find a packaged food product using
 * its barcode.
 *
 * Best use case:
 *
 * camera/barcode
 *      ↓
 * barcode
 *      ↓
 * Open Food Facts
 */
export async function getFoodProductByBarcode(
    barcode: string,
): Promise<OpenFoodFactsProduct | null> {
    const cleanBarcode =
        barcode.replace(/\D/g, "");

    if (!cleanBarcode) {
        return null;
    }

    try {
        const response = await fetch(
            `${OPEN_FOOD_FACTS_BASE}/product/${encodeURIComponent(
                cleanBarcode,
            )}.json?fields=code,product_name,product_name_en,brands,image_front_url,image_url,ingredients_text,allergens,categories,nutriscore_grade,nutrition_grades,nutriments`,
            {
                headers: {
                    Accept:
                        "application/json",
                },

                cache: "no-store",
            },
        );

        if (!response.ok) {
            throw new Error(
                `Open Food Facts failed: ${response.status}`,
            );
        }

        const data =
            (await response.json()) as OpenFoodFactsResponse;

        if (
            data.status !== 1 ||
            !data.product
        ) {
            return null;
        }

        return data.product;
    } catch (error) {
        console.error(
            "Open Food Facts lookup failed:",
            error,
        );

        return null;
    }
}