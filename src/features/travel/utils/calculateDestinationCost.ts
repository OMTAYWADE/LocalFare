import type { DestinationCostBreakdown, NearbyDestination, TransportChoice, VisitPlan,} from "../types";

export function calculateDestinationCost( destination: NearbyDestination, transport: TransportChoice, visitPlan: VisitPlan,): DestinationCostBreakdown {
  const selectedTransport = destination.travelOptions.find((option) => option.provider === transport,);
  const travel = selectedTransport?.minPrice ?? 0;
  const food = Math.round(
      (destination.foodBudgetMin + destination.foodBudgetMax) / 2,
    );

  const stay = visitPlan === "stay" ? destination.stayMinPrice ?? 0 : 0;
  const total = travel + destination.entryFee + food + destination.localTransportBudget + destination.otherBudget + stay;

  return {
    travel,
    entry: destination.entryFee,
    food,
    localTransport: destination.localTransportBudget,
    other: destination.otherBudget,
    stay,
    total,
  };
}