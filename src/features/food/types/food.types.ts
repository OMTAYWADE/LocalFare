export type FoodDiet = "vegetarian" | "non-vegetarian" | "vegan" | "egg";
export type SpiceLevel = "none" | "mild" | "medium" | "hot" | "very-hot";
export type MealType = "breakfast" | "lunch" | "snack" | "dinner" | "late-night";
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

export type PriceRange = "₹" | "₹₹" | "₹₹₹";

export interface FoodItem {
    id: string;
    name: string;
    description?: string;
    cuisine: FoodCuisine[];
    diet?: FoodDiet;
    spiceLevel?: SpiceLevel;
    mealTypes: MealType[];
    priceInr?: number; // real price, e.g. from a scanned menu
    priceRange?: PriceRange; // estimated range, e.g. from restaurant category
    priceRangeEstimated?: boolean; // true when priceRange is inferred, not exact
    rating?: number;
    imageUrl?: string;
    ingredients?: string[];
    tags?: string[];
    latitude?: number;
    longitude?: number;
    distanceKm?: number;
    restaurantId?: string;
    restaurantName?: string;
    openingHours?: string[];
    website?: string;
    phone?: string;
    mapUrl?: string;
    isVegan?: boolean;
    containsEgg?: boolean;
    containsOnion?: boolean;
    containsGarlic?: boolean;
    jainSuitable?: boolean;
    priceEstimated?: boolean;
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface UserLocation extends Coordinates {
    name?: string;
    address?: string;
    accuracy?: number;
    updatedAt?: string;
}

export interface DistanceResult {
    meters: number;
    kilometers: number;
    walkingMinutes?: number;
    drivingMinutes?: number;
}

export interface LocationSearchResult {
    id: string;
    name: string;
    address: string;
    location: Coordinates;
    distance?: DistanceResult;
}
/* =========================================================
   FOOD RECOGNITION
   ========================================================= */

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