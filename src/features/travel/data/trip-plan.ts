import type {
  TripExpense,
  TravelLocation,
  TravelOption,
} from "../types";

export const defaultSource: TravelLocation = {
  id: "mumbai-airport",

  name: "Mumbai Airport",
  address:"Chhatrapati Shivaji Maharaj International Airport",
  latitude: 19.0896,
  longitude: 72.8656,
};

export const tripExpenses: TripExpense[] = [
  { id: "travel",
    category: "travel",
    name: "Travel to destination",
    amount: 220,
    description: "Expected one-way local travel from your starting point.",
  },
  { id: "food",
    category: "food",
    name: "Food & drinks",
    amount: 250,
    description: "Estimated food spending for a short visit.",
  },
  {
    id: "local-transport",
    category: "localTransport",
    name: "Local transport",
    amount: 150,
    description: "Short-distance travel around the destination.",
  },
  {
    id: "entry",
    category: "entry",
    name: "Entry & activities",
    amount: 100,
    description: "Estimated tickets or small activity expenses.",
  },
  {
    id: "other",
    category: "other",
    name: "Other expenses",
    amount: 100,
    description: "Small unexpected expenses and convenience costs.",
  },
];

export const travelOptions: TravelOption[] = [
  {
    id: "metro",
    name: "Metro + Walk",
    mode: "metro",
    price: {
      min: 40,
      max: 60,
      currency: "₹",
    },
    durationMinutes: 48,
    availability: "available",
    priceStatus: "cheap",
    recommended: true,
    recommendationReason: "Lowest expected cost",
    confidence: {
      score: 92,
      sourceCount: 4,
      lastUpdated: "2 days ago",
      freshness: "recent",
    },
  },

  {
    id: "bike",
    name: "Bike Taxi",
    mode: "bike",
    price: {
      min: 160,
      max: 220,
      currency: "₹",
    },
    durationMinutes: 31,
    availability: "available",
    priceStatus: "fair",
    confidence: {
      score: 89,
      sourceCount: 5,
      lastUpdated: "1 day ago",
      freshness: "fresh",
    },
  },

  {
    id: "auto",
    name: "Auto",
    mode: "auto",
    price: {
      min: 180,
      max: 250,
      currency: "₹",
    },
    durationMinutes: 34,
    availability: "available",
    priceStatus: "fair",
    confidence: {
      score: 86,
      sourceCount: 7,
      lastUpdated: "2 days ago",
      freshness: "recent",
    },
  },

  {
    id: "cab",
    name: "Cab",
    mode: "cab",
    price: {
      min: 280,
      max: 380,
      currency: "₹",
    },
    durationMinutes: 27,
    availability: "available",
    priceStatus: "high",
    confidence: {
      score: 91,
      sourceCount: 6,
      lastUpdated: "Today",
      freshness: "fresh",
    },
  },
];