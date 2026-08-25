"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import PageContainer from "@/components/layout/PageContainer";
import DestinationSummary from "@/components/travel/plan/DestinationSummary";
import DestinationDetails from "@/components/travel/plan/DestinationDetails";
import TripBudgetCard from "@/components/travel/plan/TripBudgetCard";
import TravelOptions from "@/components/travel/plan/TravelOptions";
import { destinationDetails,} from "@/features/travel/data/destination-details";
import { defaultSource, tripExpenses, travelOptions, } from "@/features/travel/data/trip-plan";
import FoodRecommendations from "@/components/travel/plan/FoodRecommendations";
import { foodRecommendations, } from "@/features/travel/data/food-details";
import NearbyDestinations from "@/components/travel/plan/NearbyDestinations";
import { nearbyDestinations, } from "@/features/travel/data/nearby-destinations";
import SmartRecommendations from "@/components/travel/recommendation/SmartRecommendations";

export default function TravelPlanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const source = searchParams.get("source") || defaultSource.name;
  const destinationQuery = searchParams.get("destination") || "Gateway of India";
  const destination = useMemo(() => {
      const normalized = destinationQuery.toLowerCase().trim();
      const found = Object.values( destinationDetails,).find((item) => item.name.toLowerCase().includes(normalized),);

      return ( found || destinationDetails[ "gateway-of-india"] );
    }, [destinationQuery]);

  const [showDetails, setShowDetails] = useState(false);
  const maximumBudget = tripExpenses.reduce( (total, expense) => total + expense.amount, 0, );
  return (
    <main className="min-h-screen bg-[#f7f3ea]">
      <PageContainer>
        <AppHeader />

        <section className="mx-auto max-w-5xl pb-20 pt-8">
          <div className="mb-7 flex flex-wrap items-center gap-2 text-xs font-semibold text-[#6d7974]">
            <span className="rounded-full bg-white px-3 py-1.5">
              {source}
            </span>

            <span className="text-[#ef713d]">
              →
            </span>

            <span className="rounded-full bg-[#e8f58d] px-3 py-1.5 text-[#123c35]">
              {destination.name}
            </span>
          </div>

          <DestinationSummary destination={destination} sourceName={source} onBack={() => router.push("/travel")} onMore={() => setShowDetails(!showDetails)}/>

          {showDetails && (
            <DestinationDetails destination={destination}/>
          )}

          <TripBudgetCard expenses={tripExpenses} maximumBudget={maximumBudget}/>
          <TravelOptions options={travelOptions} />
          <FoodRecommendations foods={foodRecommendations} remainingBudget={300} />
          <NearbyDestinations destinations={nearbyDestinations} remainingBudget={300} />
          <SmartRecommendations destinations={nearbyDestinations} remainingBudget={300} availableMinutes={240}/>
        </section>
      </PageContainer>
    </main>
  );
}