"use client";

import { Sparkles } from "lucide-react";
import type { NearbyDestination,} from "@/features/travel/types";
import { getDestinationRecommendations,} from "@/features/recommendation/recommendation.service";
import SmartRecommendationCard from "./SmartRecommendationCard";

interface Props {
  destinations: NearbyDestination[];
  remainingBudget: number;
  availableMinutes?: number;
  onPlanPlace?: ( destination: NearbyDestination,) => void;
}

export default function SmartRecommendations({ destinations, remainingBudget, availableMinutes = 240, onPlanPlace,}: Props) {
  const recommendations =getDestinationRecommendations(
      destinations.map((destination) => ({ destination, remainingBudget, availableMinutes,}),),
    );

  return (
    <section className="mt-14">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[#ef713d]">
          <Sparkles className="h-4 w-4" />

          <p className="text-[10px] font-black uppercase tracking-[0.18em]">
            FairTrip intelligence
          </p>
        </div>

        <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#123c35] sm:text-3xl">
          Best places for you
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-[#6d7974]">
          We compare your remaining budget,
          distance, ratings, travel time and
          price signals before ranking these
          places.
        </p>
      </div>

      <div className="space-y-4">
        {recommendations.map((recommendation) => (
            <SmartRecommendationCard key={ recommendation.destination.id} recommendation={ recommendation} onDetails={() => onPlanPlace?.( recommendation.destination,) }/>
          ),
        )}
      </div>
    </section>
  );
}