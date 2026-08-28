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

export interface FoodItem {
    id: string;
    name: string;

    description?: string;

    cuisine: FoodCuisine[];

    diet: FoodDiet;

    spiceLevel: SpiceLevel;

    mealTypes: MealType[];

    priceInr: number;

    rating?: number;

    imageUrl?: string;

    ingredients?: string[];

    tags?: string[];

    latitude?: number;

    longitude?: number;

    restaurantId?: string;

    restaurantName?: string;

    /*
     * ---------------------------------------------------------
     * DIETARY SAFETY METADATA
     * ---------------------------------------------------------
     */

    /**
     * Explicitly marks whether the food is vegan.
     *
     * This is kept separate from diet because your existing
     * food data already uses this field.
     */
    isVegan?: boolean;

    /**
     * Whether the food contains egg.
     */
    containsEgg?: boolean;

    /**
     * Whether the food contains onion.
     */
    containsOnion?: boolean;

    /**
     * Whether the food contains garlic.
     */
    containsGarlic?: boolean;

    /**
     * Explicitly verified Jain suitability.
     *
     * Do not infer this from the food name.
     */
    jainSuitable?: boolean;
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface UserLocation
    extends Coordinates {
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