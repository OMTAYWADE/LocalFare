export type FoodDiet =
    | "vegetarian"
    | "non-vegetarian"
    | "vegan"
    | "egg";

export type SpiceLevel =
    | "none"
    | "mild"
    | "medium"
    | "hot"
    | "very-hot";

export type MealType =
    | "breakfast"
    | "lunch"
    | "snack"
    | "dinner"
    | "late-night";

export type FoodCuisine =
    | "indian"
    | "maharashtrian"
    | "south-indian"
    | "north-indian"
    | "street-food"
    | "chinese"
    | "continental"
    | "dessert"
    | "beverage";

export type PriceRange =
    | "₹"
    | "₹₹"
    | "₹₹₹";

export type FoodPriceSource =
    | "restaurant-menu"
    | "verified-source"
    | "user-submitted"
    | "database"
    | "estimated";

export type FoodMatchSource =
    | "foursquare"
    | "geoapify"
    | "unknown";

export interface FoodNutrition {
    calories?: number;
    proteinGrams?: number;
    carbohydratesGrams?: number;
    fatGrams?: number;
    fiberGrams?: number;
    sugarGrams?: number;
    sodiumMg?: number;
}

export interface FoodItem {
    /* =========================================================
     * BASIC FOOD
     * ========================================================= */

    id: string;

    name: string;

    description?: string;

    /* =========================================================
     * FOOD CLASSIFICATION
     * ========================================================= */

    cuisine: FoodCuisine[];

    diet?: FoodDiet;

    spiceLevel?: SpiceLevel;

    mealTypes: MealType[];

    /* =========================================================
     * FOOD DETAILS
     * ========================================================= */

    ingredients?: string[];

    tags?: string[];

    tasteProfile?: string[];

    texture?: string[];

    servingStyle?: string;

    preparationMethod?: string;

    allergens?: string[];

    origin?: string;

    goodFor?: string[];

    /* =========================================================
     * DIETARY INFORMATION
     * ========================================================= */

    isVegan?: boolean;

    containsEgg?: boolean;

    containsOnion?: boolean;

    containsGarlic?: boolean;

    jainSuitable?: boolean;

    /* =========================================================
     * FOOD POPULARITY
     * ========================================================= */

    isPopular?: boolean;

    popularityLevel?:
        | "low"
        | "medium"
        | "high";

    popularityScore?: number;

    popularityReason?: string;

    /* =========================================================
     * RATING
     *
     * This is required by your current
     * FoodRecommendationCard.
     * ========================================================= */

    rating?: number;

    /* =========================================================
     * IMAGE
     * ========================================================= */

    imageUrl?: string;

    imageSource?: string;

    imageSourceUrl?: string;

    wikipediaUrl?: string;

    /* =========================================================
     * NUTRITION
     * ========================================================= */

    nutrition?: FoodNutrition;

    /* =========================================================
     * FOOD PRICE
     * ========================================================= */

    priceInr?: number;

    priceMinInr?: number;

    priceMaxInr?: number;

    priceRange?: PriceRange;

    priceEstimated?: boolean;

    priceRangeEstimated?: boolean;

    priceSource?: FoodPriceSource;

    priceSampleCount?: number;

    priceVerifiedAt?: string;

    /* =========================================================
     * LOCATION
     * ========================================================= */

    latitude?: number;

    longitude?: number;

    distanceKm?: number;

    /* =========================================================
     * RESTAURANT / PLACE
     * ========================================================= */

    restaurantId?: string;

    restaurantName?: string;

    openingHours?: string[];

    website?: string;

    phone?: string;

    mapUrl?: string;

    /* =========================================================
     * VENUE PRICE INFORMATION
     *
     * This is the restaurant's price level,
     * NOT the dish price.
     * ========================================================= */

    venuePriceLevel?: 1 | 2 | 3 | 4;

    venuePriceLabel?:
        | "cheap"
        | "moderate"
        | "expensive"
        | "very-expensive";

    /* =========================================================
     * FOOD / PLACE MATCH
     * ========================================================= */

    foodMatchConfirmed?: boolean;

    foodMatchSource?: FoodMatchSource;

    placeProvider?:
        | "foursquare"
        | "geoapify";

    /* =========================================================
     * RECOGNITION
     * ========================================================= */

    confidence?: number;

    /* =========================================================
     * DATA SOURCES
     * ========================================================= */

    informationSources?: string[];
}