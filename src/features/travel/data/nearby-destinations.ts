import type { NearbyDestination,} from "../types";

export const nearbyDestinations: NearbyDestination[] = [
  {
    id: "marine-drive-nearby",
    name: "Marine Drive",
    category: "Waterfront",
    description: "A famous Mumbai seafront promenade known for sunset views, evening walks and the city skyline.",
    distanceKm: 7.2,
    estimatedVisitMinutes: 120,
    rating: 4.7,
    reviewCount: 18400,
    image: "/images/fairtrip-journey-scene.png",
    entryFee: 0,
    foodBudgetMin: 100,
    foodBudgetMax: 250,
    localTransportBudget: 50,
    otherBudget: 30,
    priceStatus: "cheap",

    confidence: {
      score: 94,
      sourceCount: 9,
      lastUpdated: "Today",
      freshness: "fresh",
    },

    highlights: [
      "Sunset",
      "Sea view",
      "Photography",
      "Evening walk",
    ],

    address: "Netaji Subhash Chandra Bose Road, Mumbai",
    latitude: 18.943,
    longitude: 72.823,

    travelOptions: [
      {
        id: "marine-rapido",
        provider: "rapido",
        name: "Rapido",
        minPrice: 140,
        maxPrice: 190,
        durationMinutes: 31,
        priceStatus: "fair",

        confidence: {
          score: 87,
          sourceCount: 5,
          lastUpdated: "Today",
          freshness: "fresh",
        },
      },

      {
        id: "marine-uber",
        provider: "uber",
        name: "Uber",
        minPrice: 220,
        maxPrice: 300,
        durationMinutes: 27,
        priceStatus: "fair",
        confidence: {
          score: 91,
          sourceCount: 6,
          lastUpdated: "Today",
          freshness: "fresh",
        },
      },

      {
        id: "marine-local",
        provider: "local",
        name: "Local Auto",
        minPrice: 160,
        maxPrice: 220,
        durationMinutes: 34,
        priceStatus: "fair",
        confidence: {
          score: 82,
          sourceCount: 7,
          lastUpdated: "1 day ago",
          freshness: "recent",
        },
      },

      {
        id: "marine-walk",
        provider: "walk",
        name: "Walk",
        minPrice: 0,
        maxPrice: 0,
        durationMinutes: 95,
        priceStatus: "cheap",
        confidence: {
          score: 98,
          sourceCount: 3,
          lastUpdated: "Today",
          freshness: "fresh",
        },
      },
    ],

    stayAvailable: true,
    stayMinPrice: 900,
    stayMaxPrice: 1800,
  },

  {
    id: "gateway-nearby",
    name: "Gateway of India",
    category: "Historic Landmark",
    description:"A historic waterfront landmark overlooking Mumbai Harbour and the Taj Mahal Palace.",
    distanceKm: 8.4,
    estimatedVisitMinutes: 120,
    rating: 4.6,
    reviewCount: 32000,
    image: "/images/fairtrip-cityscape.png",
    entryFee: 0,
    foodBudgetMin: 120,
    foodBudgetMax: 300,
    localTransportBudget: 60,
    otherBudget: 40,
    priceStatus: "cheap",
    confidence: { score: 93, sourceCount: 8, lastUpdated: "1 day ago", freshness: "recent",},

    highlights: [
      "Historic landmark",
      "Harbour views",
      "Photography",
      "Elephanta ferry",
    ],

    address: "Apollo Bandar, Colaba, Mumbai",
    latitude: 18.922,
    longitude: 72.834,

    travelOptions: [
      {
        id: "gateway-rapido",
        provider: "rapido",
        name: "Rapido",
        minPrice: 160,
        maxPrice: 220,
        durationMinutes: 32,
        priceStatus: "fair",
        confidence: {
          score: 87,
          sourceCount: 5,
          lastUpdated: "Today",
          freshness: "fresh",
        },
      },

      {
        id: "gateway-uber",
        provider: "uber",
        name: "Uber",
        minPrice: 250,
        maxPrice: 340,
        durationMinutes: 28,
        priceStatus: "fair",

        confidence: {
          score: 91,
          sourceCount: 6,
          lastUpdated: "Today",
          freshness: "fresh",
        },
      },

      {
        id: "gateway-local",
        provider: "local",
        name: "Local Auto",
        minPrice: 180,
        maxPrice: 240,
        durationMinutes: 35,
        priceStatus: "fair",

        confidence: {
          score: 84,
          sourceCount: 7,
          lastUpdated: "1 day ago",
          freshness: "recent",
        },
      },

      {
        id: "gateway-walk",
        provider: "walk",
        name: "Walk",
        minPrice: 0,
        maxPrice: 0,
        durationMinutes: 105,
        priceStatus: "cheap",
        confidence: {
          score: 98,
          sourceCount: 3,
          lastUpdated: "Today",
          freshness: "fresh",
        },
      },
    ],

    stayAvailable: true,
    stayMinPrice: 1000,
    stayMaxPrice: 2200,
  },

  {
    id: "colaba-nearby",
    name: "Colaba Causeway",
    category: "Market & Food",
    description: "A lively market area with shopping, cafés, street food and heritage surroundings.",
    distanceKm: 8.1,
    estimatedVisitMinutes: 180,
    rating: 4.5,
    reviewCount: 12800,
    entryFee: 0,
    foodBudgetMin: 150,
    foodBudgetMax: 350,
    localTransportBudget: 70,
    otherBudget: 100,
    priceStatus: "fair",
    confidence: {
      score: 89,
      sourceCount: 7,
      lastUpdated: "2 days ago",
      freshness: "recent",
    },

    highlights: [
      "Shopping",
      "Street food",
      "Cafés",
      "Heritage buildings",
    ],

    address:"Shahid Bhagat Singh Road, Colaba, Mumbai",
    latitude: 18.922,
    longitude: 72.831,

    travelOptions: [
      {
        id: "colaba-rapido",
        provider: "rapido",
        name: "Rapido",
        minPrice: 150,
        maxPrice: 210,
        durationMinutes: 31,
        priceStatus: "fair",
        confidence: {
          score: 86,
          sourceCount: 5,
          lastUpdated: "Today",
          freshness: "fresh",
        },
      },

      {
        id: "colaba-uber",
        provider: "uber",
        name: "Uber",
        minPrice: 230,
        maxPrice: 320,
        durationMinutes: 28,
        priceStatus: "fair",
        confidence: {
          score: 90,
          sourceCount: 6,
          lastUpdated: "Today",
          freshness: "fresh",
        },
      },

      {
        id: "colaba-local",
        provider: "local",
        name: "Local Auto",
        minPrice: 170,
        maxPrice: 230,
        durationMinutes: 34,
        priceStatus: "fair",
        confidence: {
          score: 83,
          sourceCount: 7,
          lastUpdated: "1 day ago",
          freshness: "recent",
        },
      },

      {
        id: "colaba-walk",
        provider: "walk",
        name: "Walk",
        minPrice: 0,
        maxPrice: 0,
        durationMinutes: 100,
        priceStatus: "cheap",
        confidence: {
          score: 98,
          sourceCount: 3,
          lastUpdated: "Today",
          freshness: "fresh",
        },
      },
    ],

    stayAvailable: true,
    stayMinPrice: 850,
    stayMaxPrice: 1700,
  },
];