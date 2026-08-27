import type { FoodItem } from "../types/food.types";

export const foodItems: FoodItem[] = [
    // ============================================================
    // BREAKFAST
    // ============================================================

    {
        id: "food-001",
        name: "Masala Dosa",
        description:
            "Crispy South Indian dosa filled with spiced potato masala, served with chutney and sambar.",
        cuisine: ["south-indian", "indian"],
        diet: "vegetarian",
        spiceLevel: "medium",
        mealTypes: ["breakfast", "snack"],
        priceInr: 120,
        rating: 4.7,
        tags: ["dosa", "potato", "crispy", "south indian"],
        latitude: 18.943,
        longitude: 72.835,
        restaurantId: "restaurant-001",
        restaurantName: "Mumbai South Kitchen",
    },

    {
        id: "food-002",
        name: "Idli Sambar",
        description:
            "Soft steamed idlis served with hot sambar and coconut chutney.",
        cuisine: ["south-indian", "indian"],
        diet: "vegetarian",
        spiceLevel: "mild",
        mealTypes: ["breakfast"],
        priceInr: 90,
        rating: 4.5,
        tags: ["idli", "sambar", "healthy", "light"],
        latitude: 18.944,
        longitude: 72.834,
        restaurantId: "restaurant-002",
        restaurantName: "South Express",
    },

    {
        id: "food-003",
        name: "Poha",
        description:
            "Light flattened rice cooked with onion, potato, peanuts and mild spices.",
        cuisine: ["maharashtrian", "indian"],
        diet: "vegetarian",
        spiceLevel: "mild",
        mealTypes: ["breakfast", "snack"],
        priceInr: 70,
        rating: 4.4,
        tags: ["poha", "breakfast", "light", "maharashtra"],
        latitude: 18.945,
        longitude: 72.837,
        restaurantName: "Mumbai Breakfast House",
    },

    {
        id: "food-004",
        name: "Misal Pav",
        description:
            "Spicy Maharashtrian sprout curry topped with farsan, onion and coriander, served with pav.",
        cuisine: ["maharashtrian", "street-food", "indian"],
        diet: "vegetarian",
        spiceLevel: "hot",
        mealTypes: ["breakfast", "snack", "lunch"],
        priceInr: 130,
        rating: 4.8,
        tags: ["misal", "pav", "spicy", "maharashtra", "street food"],
        latitude: 18.946,
        longitude: 72.836,
        restaurantName: "Aamchi Misal",
    },

    // ============================================================
    // STREET FOOD
    // ============================================================

    {
        id: "food-005",
        name: "Vada Pav",
        description:
            "Mumbai's classic potato fritter served inside pav with chutneys and green chilli.",
        cuisine: ["street-food", "maharashtrian", "indian"],
        diet: "vegetarian",
        spiceLevel: "medium",
        mealTypes: ["breakfast", "snack", "late-night"],
        priceInr: 35,
        rating: 4.6,
        tags: ["vada pav", "mumbai", "street food", "cheap"],
        latitude: 18.947,
        longitude: 72.836,
        restaurantName: "Mumbai Street Corner",
    },

    {
        id: "food-006",
        name: "Pav Bhaji",
        description:
            "Buttery pav served with mashed vegetable bhaji, onion and lemon.",
        cuisine: ["street-food", "maharashtrian", "indian"],
        diet: "vegetarian",
        spiceLevel: "medium",
        mealTypes: ["lunch", "snack", "dinner", "late-night"],
        priceInr: 160,
        rating: 4.7,
        tags: ["pav bhaji", "mumbai", "street food"],
        latitude: 18.948,
        longitude: 72.838,
        restaurantName: "Marine Pav Bhaji",
    },

    {
        id: "food-007",
        name: "Bhel Puri",
        description:
            "Crispy puffed rice mixed with chutneys, onion, tomato, coriander and sev.",
        cuisine: ["street-food", "maharashtrian", "indian"],
        diet: "vegan",
        spiceLevel: "medium",
        mealTypes: ["snack", "late-night"],
        priceInr: 80,
        rating: 4.5,
        tags: ["bhel", "chaat", "snack", "mumbai"],
        latitude: 18.949,
        longitude: 72.839,
        restaurantName: "Marine Drive Chaat",
    },

    // ============================================================
    // LUNCH
    // ============================================================

    {
        id: "food-008",
        name: "Chicken Biryani",
        description:
            "Fragrant basmati rice cooked with chicken, herbs and aromatic spices.",
        cuisine: ["indian", "north-indian"],
        diet: "non-vegetarian",
        spiceLevel: "medium",
        mealTypes: ["lunch", "dinner"],
        priceInr: 280,
        rating: 4.8,
        tags: ["biryani", "chicken", "rice", "hyderabadi"],
        latitude: 18.951,
        longitude: 72.836,
        restaurantName: "Biryani Junction",
    },

    {
        id: "food-009",
        name: "Paneer Tikka",
        description:
            "Char-grilled paneer cubes marinated with yoghurt, herbs and spices.",
        cuisine: ["north-indian", "indian"],
        diet: "vegetarian",
        spiceLevel: "medium",
        mealTypes: ["lunch", "snack", "dinner"],
        priceInr: 240,
        rating: 4.6,
        tags: ["paneer", "tikka", "grilled", "protein"],
        latitude: 18.952,
        longitude: 72.837,
        restaurantName: "Delhi Darbar",
    },

    {
        id: "food-010",
        name: "Veg Thali",
        description:
            "Complete Indian meal with vegetables, dal, rice, roti, salad and dessert.",
        cuisine: ["indian", "maharashtrian"],
        diet: "vegetarian",
        spiceLevel: "medium",
        mealTypes: ["lunch", "dinner"],
        priceInr: 220,
        rating: 4.5,
        tags: ["thali", "meal", "vegetarian", "full meal"],
        latitude: 18.953,
        longitude: 72.838,
        restaurantName: "Ghar Ka Khana",
    },

    {
        id: "food-011",
        name: "Dal Khichdi",
        description:
            "Comforting rice and lentils cooked together with mild spices.",
        cuisine: ["indian", "maharashtrian"],
        diet: "vegetarian",
        spiceLevel: "mild",
        mealTypes: ["lunch", "dinner", "late-night"],
        priceInr: 150,
        rating: 4.4,
        tags: ["khichdi", "dal", "comfort food", "light"],
        restaurantName: "Comfort Bowl",
    },

    // ============================================================
    // DINNER
    // ============================================================

    {
        id: "food-012",
        name: "Butter Chicken",
        description:
            "Tender chicken cooked in a creamy tomato and butter-based gravy.",
        cuisine: ["north-indian", "indian"],
        diet: "non-vegetarian",
        spiceLevel: "mild",
        mealTypes: ["lunch", "dinner"],
        priceInr: 340,
        rating: 4.8,
        tags: ["butter chicken", "chicken", "creamy"],
        restaurantName: "Delhi Darbar",
    },

    {
        id: "food-013",
        name: "Chole Bhature",
        description:
            "Spiced chickpea curry served with fluffy fried bhature.",
        cuisine: ["north-indian", "indian"],
        diet: "vegetarian",
        spiceLevel: "medium",
        mealTypes: ["breakfast", "lunch", "dinner"],
        priceInr: 180,
        rating: 4.6,
        tags: ["chole", "bhature", "punjabi"],
        restaurantName: "Punjab House",
    },

    {
        id: "food-014",
        name: "Veg Hakka Noodles",
        description:
            "Stir-fried noodles with vegetables, soy sauce and aromatic seasoning.",
        cuisine: ["chinese"],
        diet: "vegetarian",
        spiceLevel: "medium",
        mealTypes: ["lunch", "dinner", "late-night"],
        priceInr: 190,
        rating: 4.3,
        tags: ["noodles", "chinese", "veg noodles"],
        restaurantName: "Wok Street",
    },

    // ============================================================
    // DESSERT
    // ============================================================

    {
        id: "food-015",
        name: "Gulab Jamun",
        description:
            "Soft milk-solid dumplings soaked in warm sugar syrup.",
        cuisine: ["dessert", "indian"],
        diet: "vegetarian",
        spiceLevel: "none",
        mealTypes: ["snack", "dinner", "late-night"],
        priceInr: 80,
        rating: 4.7,
        tags: ["sweet", "dessert", "gulab jamun"],
        restaurantName: "Sweet India",
    },

    {
        id: "food-016",
        name: "Kulfi",
        description:
            "Traditional Indian frozen dessert with creamy milk and cardamom.",
        cuisine: ["dessert", "indian"],
        diet: "vegetarian",
        spiceLevel: "none",
        mealTypes: ["snack", "dinner", "late-night"],
        priceInr: 100,
        rating: 4.6,
        tags: ["kulfi", "ice cream", "dessert"],
        restaurantName: "Kulfi House",
    },

    // ============================================================
    // BEVERAGES
    // ============================================================

    {
        id: "food-017",
        name: "Masala Chai",
        description:
            "Indian tea brewed with milk and warming spices.",
        cuisine: ["beverage", "indian"],
        diet: "vegetarian",
        spiceLevel: "none",
        mealTypes: [
            "breakfast",
            "snack",
            "late-night",
        ],
        priceInr: 40,
        rating: 4.7,
        tags: ["chai", "tea", "hot drink"],
        restaurantName: "Chai Adda",
    },

    {
        id: "food-018",
        name: "Fresh Lime Soda",
        description:
            "Refreshing lime drink available sweet or salted.",
        cuisine: ["beverage"],
        diet: "vegan",
        spiceLevel: "none",
        mealTypes: [
            "lunch",
            "snack",
            "dinner",
        ],
        priceInr: 70,
        rating: 4.4,
        tags: ["lime", "soda", "drink", "refreshing"],
        restaurantName: "Fresh Corner",
    },
];