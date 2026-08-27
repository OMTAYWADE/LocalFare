"use client";

import {
    SearchX,
} from "lucide-react";

import type {
    FoodRecommendation,
} from "../services/foodRecommendation.service";

import FoodRecommendationCard from "./FoodRecommendationCard";

interface FoodRecommendationListProps {
    recommendations: FoodRecommendation[];
}

export default function FoodRecommendationList({
    recommendations,
}: FoodRecommendationListProps) {
    if (
        recommendations.length === 0
    ) {
        return (
            <div className="rounded-[28px] border border-dashed border-[#123c35]/15 bg-white p-10 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f7f3ea]">

                    <SearchX className="h-5 w-5 text-[#123c35]" />

                </div>

                <h3 className="mt-4 text-lg font-black text-[#123c35]">
                    No matching food found
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#6d7974]">
                    Try increasing your budget
                    or relaxing one of your food
                    preferences.
                </p>

            </div>
        );
    }

    return (
        <div className="grid gap-5 md:grid-cols-2">

            {recommendations.map(
                (recommendation) => (
                    <FoodRecommendationCard key={ recommendation.food.id} recommendation={ recommendation}/>
                ),
            )}

        </div>
    );
}