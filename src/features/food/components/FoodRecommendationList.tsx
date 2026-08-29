"use client";

import { SearchX } from "lucide-react";
import type { FoodRecommendation } from "../services/foodRecommendation.service";
import FoodRecommendationCard from "./FoodRecommendationCard";

interface FoodRecommendationListProps {
  recommendations: FoodRecommendation[];
}

export default function FoodRecommendationList({ recommendations }: FoodRecommendationListProps) {
  if (recommendations.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-[#123c35]/15 bg-white px-6 py-12 text-center sm:px-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f7f3ea]">
          <SearchX className="h-6 w-6 text-[#123c35]" />
        </div>

        <h3 className="mt-5 text-lg font-black tracking-[-0.03em] text-[#123c35]">
          No matching food found
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#6d7974]">
          We couldn't find food matching your current preferences.
        </p>

        <p className="mx-auto mt-1 max-w-sm text-[10px] leading-5 text-[#89938f]">
          Try increasing your budget or relaxing one of your preferences.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:gap-6">
      {recommendations.map((recommendation, index) => (
        <div
          key={recommendation.food.id}
          className="animate-[fadeInUp_0.4s_ease-out_backwards]"
          style={{ animationDelay: `${Math.min(index * 60, 400)}ms` }}
        >
          <FoodRecommendationCard recommendation={recommendation} />
        </div>
      ))}
    </div>
  );
}