import type { FoodRecommendation, } from "../types";

export const foodRecommendations: FoodRecommendation[] = [
    {
        id: "apollo-vada-pav",
        name: "Vada Pav",
        localName: "मुंबई वडापाव",
        description: "Mumbai's iconic street snack made with a spiced potato fritter inside a pav, usually served with chutneys.",
        category: "Street Food",

        preferences: [
            "spicy",
            "indian",
            "vegetarian",
            "famous",
            "local",
        ],

        priceMin: 20,
        priceMax: 30,
        currency: "₹",
        rating: 4.6,
        reviewCount: 1840,
        distanceKm: 0.7,
        address: "Colaba, Mumbai, Maharashtra",
        priceStatus: "cheap",

        confidence: {
            score: 91,
            sourceCount: 8,
            lastUpdated: "2 days ago",
            freshness: "recent",
        },

        priceEvidence: [
            "Recent local observations commonly place a basic vada pav around ₹20–₹30.",
            "Multiple recent traveler references indicate similar pricing.",
        ],

        popularReason: "One of Mumbai's most recognizable local foods.",
        mapLatitude: 18.922,
        mapLongitude: 72.834,
        openingHours: "Usually available from morning until late evening",
        vegetarian: true,
    },

    {
        id: "misal-pav",
        name: "Misal Pav",
        localName: "मिसळ पाव",
        description: "A spicy Maharashtrian dish made with sprouted lentils, farsan, curry and pav.",
        category: "Maharashtrian",

        preferences: [
            "spicy",
            "indian",
            "vegetarian",
            "local",
        ],

        priceMin: 60,
        priceMax: 100,
        currency: "₹",
        rating: 4.5,
        reviewCount: 1260,
        distanceKm: 1.4,
        address: "Fort, Mumbai, Maharashtra",
        priceStatus: "fair",

        confidence: {
            score: 88,
            sourceCount: 6,
            lastUpdated: "3 days ago",
            freshness: "recent",
        },

        priceEvidence: [
            "Observed local menu prices generally fall around ₹60–₹100.",
            "Recent traveler reports indicate similar pricing.",
        ],
        popularReason: "A popular Maharashtrian breakfast and snack.",
        mapLatitude: 18.932,
        mapLongitude: 72.834,
        openingHours: "Typically served during breakfast and lunch hours",
        vegetarian: true,
    },

    {
        id: "bombay-sandwich",
        name: "Bombay Sandwich",
        localName: "बॉम्बे सँडविच",
        description: "A popular Mumbai street sandwich layered with vegetables, chutneys and local spices.",
        category: "Street Food",
        preferences: [
            "indian",
            "vegetarian",
            "local",
        ],

        priceMin: 50,
        priceMax: 90,
        currency: "₹",
        rating: 4.4,
        reviewCount: 920,
        distanceKm: 1.1,
        address: "Colaba Causeway, Mumbai, Maharashtra",
        priceStatus: "fair",

        confidence: {
            score: 84,
            sourceCount: 5,
            lastUpdated: "4 days ago",
            freshness: "recent",
        },
        priceEvidence: [
            "Typical street-side prices are approximately ₹50–₹90.",
        ],
        popularReason: "A classic Mumbai street-food option.",
        mapLatitude: 18.922,
        mapLongitude: 72.831,
        openingHours: "Generally available throughout the day",
        vegetarian: true,
    },

    {
        id: "prawns-koliwada",
        name: "Prawns Koliwada",
        localName: "कोळीवाडा प्रॉन्स",
        description: "Crispy, spiced prawns inspired by Mumbai's coastal Koli food culture.",
        category: "Seafood",

        preferences: [
            "seafood",
            "spicy",
            "famous",
            "local",
        ],

        priceMin: 280,
        priceMax: 450,
        currency: "₹",
        rating: 4.7,
        reviewCount: 740,
        distanceKm: 2.3,
        address: "Colaba, Mumbai, Maharashtra",
        priceStatus: "fair",

        confidence: {
            score: 86,
            sourceCount: 5,
            lastUpdated: "1 day ago",
            freshness: "fresh",
        },

        priceEvidence: [
            "Restaurant serving prices vary by portion size.",
            "Recent observations place common portions around ₹280–₹450.",
        ],
        popularReason: "A good option for travelers looking for Mumbai-style seafood.",
        mapLatitude: 18.915,
        mapLongitude: 72.831,
        openingHours: "Usually available during lunch and dinner",
        vegetarian: false,
    },

    {
        id: "pav-bhaji",
        name: "Pav Bhaji",
        localName: "पाव भाजी",
        description: "A buttery Mumbai classic made from spiced mashed vegetables served with toasted pav.",
        category: "Street Food",

        preferences: [
            "indian",
            "vegetarian",
            "famous",
            "local",
        ],

        priceMin: 80,
        priceMax: 140,
        currency: "₹",
        rating: 4.6,
        reviewCount: 2150,
        distanceKm: 1.8,
        address: "Marine Drive, Mumbai, Maharashtra",
        priceStatus: "fair",

        confidence: {
            score: 93,
            sourceCount: 9,
            lastUpdated: "Today",
            freshness: "fresh",
        },

        priceEvidence: [
            "Multiple recent observations indicate ₹80–₹140 for a standard serving.",
            "Prices can increase at premium restaurants.",
        ],
        popularReason: "One of Mumbai's best-known comfort foods.",
        mapLatitude: 18.943,
        mapLongitude: 72.823,
        openingHours: "Commonly available from afternoon through late evening",
        vegetarian: true,
    },
];