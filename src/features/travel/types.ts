import type { AvailabilityStatus, Confidence, PriceRange, PriceStatus, TravelMode, } from "@/types";

export interface TravelLocation {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
}

export interface DestinationPreview {
    id: string;
    name: string;
    shortDescription: string;
    category: string;
    city: string;
    image?: string;
    estimatedBudget: number;
    distanceKm: number;
    travelMinutes: number;
}

export interface DestinationDetails
    extends DestinationPreview {
    history: string;
    famousFor: string[];
    highlights: string[];
    bestTimeToVisit: string;
    popularWith: string[];
}

export type TripExpenseCategory =
    | "travel"
    | "food"
    | "localTransport"
    | "entry"
    | "other";

export interface TripExpense {
    id: string;
    category: TripExpenseCategory;
    name: string;
    amount: number;
    description: string;
}

export interface TravelOption {
    id: string;
    name: string;
    mode: TravelMode;
    price: PriceRange;
    durationMinutes: number;
    availability: AvailabilityStatus;
    priceStatus: PriceStatus;
    recommended?: boolean;
    recommendationReason?: string;
    confidence: Confidence;
}

export interface TripPlan {
    source: TravelLocation;
    destination: DestinationDetails;
    distanceKm: number;
    estimatedDurationMinutes: number;
    maximumBudget: number;
    expenses: TripExpense[];
    travelOptions: TravelOption[];
}

export type FoodPreference =
    | "spicy"
    | "indian"
    | "seafood"
    | "vegetarian"
    | "famous"
    | "local";

export interface FoodRecommendation {
    id: string;
    name: string
    localName?: string;
    description: string;
    category: string;
    preferences: FoodPreference[];
    priceMin: number;
    priceMax: number;
    currency: string;
    rating: number;
    reviewCount: number;
    distanceKm: number;
    address: string;
    image?: string;
    priceStatus: PriceStatus;
    confidence: Confidence;
    priceEvidence: string[];
    popularReason?: string;
    mapLatitude: number;
    mapLongitude: number;
    openingHours?: string;
    vegetarian?: boolean;
}


export type TransportChoice =
  | "rapido"
  | "uber"
  | "local"
  | "walk";

export type VisitPlan =
  | "day-trip"
  | "stay";

export interface DestinationTravelOption {
  id: string;
  provider: TransportChoice;
  name: string;
  minPrice: number;
  maxPrice: number;
  durationMinutes: number;
  priceStatus: PriceStatus;
  confidence: Confidence;
}

export interface NearbyDestination {
  id: string;
  name: string;
  category: string;
  description: string;
  distanceKm: number;
  estimatedVisitMinutes: number;
  rating: number;
  reviewCount: number;
  image?: string;
  entryFee: number;
  foodBudgetMin: number;
  foodBudgetMax: number;
  localTransportBudget: number;
  otherBudget: number;
  priceStatus: PriceStatus;
  confidence: Confidence;
  highlights: string[];
  address: string;
  latitude: number;
  longitude: number;
  travelOptions: DestinationTravelOption[];
  stayAvailable: boolean;
  stayMinPrice?: number;
  stayMaxPrice?: number;
}

export interface DestinationCostBreakdown {
  travel: number;
  entry: number;
  food: number;
  localTransport: number;
  other: number;
  stay: number;
  total: number;
}