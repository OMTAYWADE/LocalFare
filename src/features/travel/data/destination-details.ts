import type { DestinationDetails } from "../types";

export const destinationDetails: Record< string, DestinationDetails> = {
  "gateway-of-india": {
    id: "gateway-of-india",
    name: "Gateway of India",
    shortDescription: "A historic waterfront landmark overlooking Mumbai Harbour and one of the city's most visited places.",
    category: "Historic Landmark",
    city: "Mumbai",
    image: "/images/fairtrip-cityscape.png",

    estimatedBudget: 500,
    distanceKm: 8.4,
    travelMinutes: 34,

    history: "The Gateway of India was built during the early twentieth century and became one of Mumbai's most recognizable landmarks. Its location beside the Arabian Sea has made it an important part of the city's tourism identity.",

    famousFor: [
      "Mumbai Harbour views",
      "Historic architecture",
      "Taj Mahal Palace nearby",
      "Elephanta Caves ferry point",
      "Sunrise and sunset views",
    ],

    highlights: [
      "Waterfront promenade",
      "Photography",
      "Colaba Causeway nearby",
      "Ferry rides",
      "Historic architecture",
    ],

    bestTimeToVisit: "Early morning or evening",

    popularWith: [
      "First-time visitors",
      "Families",
      "Photographers",
      "History lovers",
    ],
  },

  "marine-drive": {
    id: "marine-drive",

    name: "Marine Drive",
    shortDescription:"Mumbai's iconic seafront promenade, famous for sunset views, evening walks and the city's coastal skyline.",
    category: "Waterfront",
    city: "Mumbai",
    image:"/images/fairtrip-journey-scene.png",

    estimatedBudget: 450,
    distanceKm: 7.2,
    travelMinutes: 29,
    history:"Marine Drive developed as one of Mumbai's most recognizable coastal promenades. The curved waterfront and city skyline have made it an enduring symbol of Mumbai.",

    famousFor: [
      "Queen's Necklace",
      "Sunset views",
      "Arabian Sea",
      "Night skyline",
      "Evening walks",
    ],

    highlights: [
      "Sunset",
      "Photography",
      "Street food",
      "Long walks",
      "City skyline",
    ],
    bestTimeToVisit: "Late afternoon and evening",
    popularWith: [
      "Couples",
      "Families",
      "Photographers",
      "Solo travelers",
    ],
  },

  "colaba-causeway": {
    id: "colaba-causeway",
    name: "Colaba Causeway",
    shortDescription: "A lively shopping and food destination known for street markets, cafés, local snacks and colonial-era surroundings.",
    category: "Market & Food",
    city: "Mumbai",
    estimatedBudget: 700,
    distanceKm: 8.1,
    travelMinutes: 32,
    history: "Colaba developed as an important southern part of Mumbai and later became known for its markets, cafés, shops and heritage architecture.",

    famousFor: [
      "Street shopping",
      "Local food",
      "Cafés",
      "Fashion accessories",
      "Nearby heritage buildings",
    ],

    highlights: [
      "Street shopping",
      "Food",
      "Photography",
      "Cafés",
      "Heritage walks",
    ],

    bestTimeToVisit: "Late morning to evening",
    popularWith: [
      "Shoppers",
      "Food lovers",
      "Tourists",
      "Young travelers",
    ],
  },
};