import type {
    FoodCuisine,
    FoodDiet,
    MealType,
    PriceRange,
    SpiceLevel,
} from "../types/food.types";

export interface FoodClassification {
    cuisine?: FoodCuisine[];

    diet?: FoodDiet;

    spiceLevel?: SpiceLevel;

    mealTypes?: MealType[];

    ingredients?: string[];

    tags?: string[];

    tasteProfile?: string[];

    texture?: string[];

    servingStyle?: string;

    preparationMethod?: string;

    allergens?: string[];

    origin?: string;

    goodFor?: string[];

    isVegan?: boolean;

    containsEgg?: boolean;

    containsOnion?: boolean;

    containsGarlic?: boolean;

    jainSuitable?: boolean;

    isPopular?: boolean;

    popularityLevel?:
        | "low"
        | "medium"
        | "high";

    popularityScore?: number;

    popularityReason?: string;

    priceMinInr?: number;

    priceMaxInr?: number;

    priceRange?: PriceRange;
}

function normalize(
    value: string,
): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ");
}

const KNOWLEDGE: Record<
    string,
    FoodClassification
> = {
    samosa: {
        cuisine: [
            "indian",
            "street-food",
        ],

        diet: "vegetarian",

        spiceLevel: "medium",

        mealTypes: [
            "snack",
        ],

        ingredients: [
            "potato",
            "peas",
            "flour",
            "cumin",
            "chilli",
            "ginger",
        ],

        tags: [
            "crispy",
            "fried",
            "stuffed",
            "street food",
            "tea-time",
        ],

        tasteProfile: [
            "savory",
            "spiced",
            "slightly tangy",
        ],

        texture: [
            "crispy outside",
            "soft filling",
        ],

        servingStyle:
            "Usually served hot with chutney.",

        preparationMethod:
            "Spiced filling wrapped in pastry and deep-fried.",

        allergens: [
            "gluten",
        ],

        origin:
            "Indian subcontinent",

        goodFor: [
            "quick snack",
            "tea-time",
            "street-food experience",
        ],

        isVegan: true,

        containsEgg: false,

        containsOnion: true,

        containsGarlic: true,

        jainSuitable: false,

        isPopular: true,

        popularityLevel: "high",

        popularityScore: 0.95,

        popularityReason:
            "A widely recognized Indian snack.",

        priceMinInr: 10,

        priceMaxInr: 50,

        priceRange: "₹",
    },

    "vada pav": {
        cuisine: [
            "maharashtrian",
            "street-food",
            "indian",
        ],

        diet: "vegetarian",

        spiceLevel: "medium",

        mealTypes: [
            "breakfast",
            "snack",
            "late-night",
        ],

        ingredients: [
            "potato",
            "gram flour",
            "pav",
            "green chilli",
            "garlic",
            "mustard seeds",
        ],

        tags: [
            "mumbai street food",
            "street food",
            "quick bite",
            "spicy",
        ],

        tasteProfile: [
            "spicy",
            "savory",
            "garlicky",
        ],

        texture: [
            "crispy fritter",
            "soft bun",
        ],

        servingStyle:
            "Served inside pav with chutney and dry garlic powder.",

        preparationMethod:
            "Spiced potato fritter coated in gram-flour batter and fried.",

        allergens: [
            "gluten",
        ],

        origin:
            "Maharashtra, India",

        goodFor: [
            "quick meal",
            "street-food experience",
            "budget eating",
        ],

        isVegan: true,

        containsEgg: false,

        containsOnion: false,

        containsGarlic: true,

        jainSuitable: false,

        isPopular: true,

        popularityLevel: "high",

        popularityScore: 0.98,

        popularityReason:
            "Iconic Maharashtrian street food.",

        priceMinInr: 15,

        priceMaxInr: 60,

        priceRange: "₹",
    },

    poha: {
        cuisine: [
            "maharashtrian",
            "indian",
        ],

        diet: "vegetarian",

        spiceLevel: "mild",

        mealTypes: [
            "breakfast",
            "snack",
        ],

        ingredients: [
            "flattened rice",
            "onion",
            "peanuts",
            "mustard seeds",
            "turmeric",
            "lemon",
            "coriander",
        ],

        tags: [
            "breakfast",
            "light meal",
            "comfort food",
            "maharashtrian",
        ],

        tasteProfile: [
            "savory",
            "mildly spicy",
            "lemony",
        ],

        texture: [
            "soft",
            "light",
            "slightly crunchy",
        ],

        servingStyle:
            "Usually served warm with lemon and coriander.",

        preparationMethod:
            "Flattened rice cooked with tempering, vegetables and peanuts.",

        allergens: [
            "peanuts",
        ],

        origin:
            "Western and Central India",

        goodFor: [
            "breakfast",
            "light meal",
            "quick start to the day",
        ],

        isVegan: true,

        containsEgg: false,

        containsOnion: true,

        containsGarlic: false,

        jainSuitable: false,

        isPopular: true,

        popularityLevel: "high",

        popularityScore: 0.90,

        popularityReason:
            "A common everyday Indian breakfast.",

        priceMinInr: 20,

        priceMaxInr: 70,

        priceRange: "₹",
    },

    "misal pav": {
        cuisine: [
            "maharashtrian",
            "street-food",
            "indian",
        ],

        diet: "vegetarian",

        spiceLevel: "hot",

        mealTypes: [
            "breakfast",
            "lunch",
            "snack",
        ],

        ingredients: [
            "sprouted lentils",
            "spicy gravy",
            "onion",
            "farsan",
            "coriander",
            "pav",
        ],

        tags: [
            "spicy",
            "maharashtrian",
            "street food",
            "sprouts",
            "farsan",
        ],

        tasteProfile: [
            "spicy",
            "savory",
            "tangy",
        ],

        texture: [
            "brothy",
            "crunchy",
            "soft",
        ],

        servingStyle:
            "Served with pav, farsan, onion and lemon.",

        preparationMethod:
            "Sprouted legumes cooked in a spicy regional gravy and topped with farsan.",

        allergens: [
            "gluten",
        ],

        origin:
            "Maharashtra, India",

        goodFor: [
            "spicy food lovers",
            "local food exploration",
            "hearty breakfast",
        ],

        isVegan: true,

        containsEgg: false,

        containsOnion: true,

        containsGarlic: true,

        jainSuitable: false,

        isPopular: true,

        popularityLevel: "high",

        popularityScore: 0.94,

        popularityReason:
            "A signature Maharashtrian dish.",

        priceMinInr: 50,

        priceMaxInr: 160,

        priceRange: "₹₹",
    },

    "pav bhaji": {
        cuisine: [
            "maharashtrian",
            "street-food",
            "indian",
        ],

        diet: "vegetarian",

        spiceLevel: "medium",

        mealTypes: [
            "lunch",
            "snack",
            "dinner",
        ],

        ingredients: [
            "potato",
            "tomato",
            "peas",
            "capsicum",
            "butter",
            "spice blend",
            "pav",
        ],

        tags: [
            "street food",
            "mumbai",
            "buttery",
            "comfort food",
        ],

        tasteProfile: [
            "savory",
            "buttery",
            "tangy",
            "spiced",
        ],

        texture: [
            "smooth",
            "mashed",
            "soft",
        ],

        servingStyle:
            "Served hot with buttered pav, onion and lemon.",

        preparationMethod:
            "Mixed vegetables mashed and cooked with a spiced tomato gravy.",

        allergens: [
            "gluten",
            "dairy",
        ],

        origin:
            "Mumbai, Maharashtra",

        goodFor: [
            "comfort meal",
            "street-food experience",
        ],

        isVegan: false,

        containsEgg: false,

        containsOnion: true,

        containsGarlic: true,

        jainSuitable: false,

        isPopular: true,

        popularityLevel: "high",

        popularityScore: 0.97,

        popularityReason:
            "Classic Mumbai street food.",

        priceMinInr: 60,

        priceMaxInr: 180,

        priceRange: "₹₹",
    },

    dosa: {
        cuisine: [
            "south-indian",
            "indian",
        ],

        diet: "vegetarian",

        spiceLevel: "mild",

        mealTypes: [
            "breakfast",
            "lunch",
            "snack",
            "dinner",
        ],

        ingredients: [
            "rice",
            "urad dal",
            "salt",
        ],

        tags: [
            "crispy",
            "fermented",
            "south indian",
            "breakfast",
        ],

        tasteProfile: [
            "savory",
            "slightly tangy",
        ],

        texture: [
            "crispy edges",
            "thin",
            "soft center",
        ],

        servingStyle:
            "Typically served with sambar and chutneys.",

        preparationMethod:
            "Fermented rice and lentil batter cooked on a hot griddle.",

        origin:
            "South India",

        goodFor: [
            "breakfast",
            "light meal",
            "vegetarian eating",
        ],

        isVegan: true,

        containsEgg: false,

        containsOnion: false,

        containsGarlic: false,

        jainSuitable: true,

        isPopular: true,

        popularityLevel: "high",

        popularityScore: 0.96,

        popularityReason:
            "One of India's most widely known dishes.",

        priceMinInr: 40,

        priceMaxInr: 180,

        priceRange: "₹₹",
    },

    idli: {
        cuisine: [
            "south-indian",
            "indian",
        ],

        diet: "vegetarian",

        spiceLevel: "none",

        mealTypes: [
            "breakfast",
            "snack",
        ],

        ingredients: [
            "rice",
            "urad dal",
            "salt",
        ],

        tags: [
            "steamed",
            "soft",
            "fermented",
            "breakfast",
        ],

        tasteProfile: [
            "mild",
            "savory",
            "slightly tangy",
        ],

        texture: [
            "soft",
            "fluffy",
        ],

        servingStyle:
            "Usually served with sambar and chutney.",

        preparationMethod:
            "Fermented rice and lentil batter steamed in molds.",

        origin:
            "South India",

        goodFor: [
            "light breakfast",
            "mild food",
        ],

        isVegan: true,

        containsEgg: false,

        containsOnion: false,

        containsGarlic: false,

        jainSuitable: true,

        isPopular: true,

        popularityLevel: "high",

        popularityScore: 0.93,

        popularityReason:
            "A widely eaten South Indian breakfast.",

        priceMinInr: 25,

        priceMaxInr: 100,

        priceRange: "₹",
    },

    biryani: {
        cuisine: [
            "indian",
        ],

        diet: "non-vegetarian",

        spiceLevel: "medium",

        mealTypes: [
            "lunch",
            "dinner",
            "late-night",
        ],

        ingredients: [
            "basmati rice",
            "spices",
            "onion",
            "ginger",
            "garlic",
        ],

        tags: [
            "rice dish",
            "aromatic",
            "spiced",
            "hearty meal",
        ],

        tasteProfile: [
            "savory",
            "aromatic",
            "spiced",
        ],

        texture: [
            "fluffy rice",
            "tender",
        ],

        servingStyle:
            "Often served with raita, salad or gravy.",

        preparationMethod:
            "Rice and seasoned ingredients cooked together with aromatic spices.",

        allergens: [
            "dairy",
        ],

        origin:
            "South Asia",

        goodFor: [
            "hearty meal",
            "lunch",
            "dinner",
        ],

        isPopular: true,

        popularityLevel: "high",

        popularityScore: 0.99,

        popularityReason:
            "One of the most popular rice dishes in India.",

        priceMinInr: 100,

        priceMaxInr: 350,

        priceRange: "₹₹₹",
    },

    "pani puri": {
        cuisine: [
            "indian",
            "street-food",
        ],

        diet: "vegetarian",

        spiceLevel: "hot",

        mealTypes: [
            "snack",
        ],

        ingredients: [
            "semolina",
            "potato",
            "chickpeas",
            "mint",
            "coriander",
            "tamarind",
            "chilli",
        ],

        tags: [
            "street food",
            "tangy",
            "spicy",
            "chaat",
        ],

        tasteProfile: [
            "tangy",
            "spicy",
            "sweet-sour",
        ],

        texture: [
            "crispy shell",
            "soft filling",
        ],

        servingStyle:
            "Crispy puris filled with potato, chutney and spiced water.",

        preparationMethod:
            "Crispy puris filled with seasoned ingredients and flavored water.",

        allergens: [
            "gluten",
        ],

        origin:
            "Indian subcontinent",

        goodFor: [
            "street-food exploration",
            "quick snack",
        ],

        isVegan: true,

        containsEgg: false,

        containsOnion: true,

        containsGarlic: true,

        jainSuitable: false,

        isPopular: true,

        popularityLevel: "high",

        popularityScore: 0.97,

        popularityReason:
            "One of India's best-known street foods.",

        priceMinInr: 20,

        priceMaxInr: 100,

        priceRange: "₹",
    },
};

const ALIASES: Record<
    string,
    string
> = {
    "vada-pav": "vada pav",
    "batata vada pav": "vada pav",

    misal: "misal pav",
    "misal-pav": "misal pav",

    "pav-bhaji": "pav bhaji",
    pavbhaji: "pav bhaji",

    panipuri: "pani puri",
    "gol gappe": "pani puri",
    golgappe: "pani puri",

    "masala tea": "masala chai",

    tea: "chai",
};

export function classifyFood(
    foodName: string,
): FoodClassification | undefined {
    const normalized =
        normalize(foodName);

    const key =
        ALIASES[normalized] ??
        normalized;

    const classification =
        KNOWLEDGE[key];

    if (!classification) {
        return undefined;
    }

    return {
        ...classification,

        cuisine:
            classification.cuisine
                ? [...classification.cuisine]
                : undefined,

        mealTypes:
            classification.mealTypes
                ? [...classification.mealTypes]
                : undefined,

        ingredients:
            classification.ingredients
                ? [...classification.ingredients]
                : undefined,

        tags:
            classification.tags
                ? [...classification.tags]
                : undefined,

        tasteProfile:
            classification.tasteProfile
                ? [
                      ...classification.tasteProfile,
                  ]
                : undefined,

        texture:
            classification.texture
                ? [
                      ...classification.texture,
                  ]
                : undefined,

        allergens:
            classification.allergens
                ? [
                      ...classification.allergens,
                  ]
                : undefined,

        goodFor:
            classification.goodFor
                ? [
                      ...classification.goodFor,
                  ]
                : undefined,
    };
}