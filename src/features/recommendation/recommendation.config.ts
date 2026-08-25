export const RECOMMENDATION_WEIGHTS = {
  budget: 30,
  distance: 20,
  rating: 15,
  time: 15,
  priceFairness: 10,
  freshness: 10,
} as const;

export const RECOMMENDATION_LIMITS = {
  maximumDistanceKm: 20,
  defaultAvailableMinutes: 240,
  excellentRating: 4.7,
  goodRating: 4.3,
} as const;