"use client";

import { useMemo, useState } from "react";
import type { FoodPreference, FoodRecommendation as FoodRecommendationType, } from "@/features/travel/types";
import FoodPreferences from "./FoodPreferences";
import FoodCard from "./FoodCard";

interface FoodRecommendationsProps {
    foods: FoodRecommendationType[];
    remainingBudget?: number;
}

export default function FoodRecommendations({ foods, remainingBudget, }: FoodRecommendationsProps) {
    const [preference, setPreference] = useState<FoodPreference>("local");

    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filteredFoods = useMemo(() => {
        const matched = foods.filter((food) =>
            food.preferences.includes(preference,),
        );

        if (remainingBudget === undefined) {
            return matched;
        }

        const budgetFriendly = matched.filter((food) => food.priceMin <= remainingBudget,);

        return budgetFriendly.length > 0 ? budgetFriendly : matched;
    }, [foods, preference, remainingBudget,]);

    return (
        <section className="mt-12">
            <div className="mb-5">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#ef713d]">
                    Eat like a local
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-[-0.04em] text-[#123c35]">
                    Food you may like
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-[#6d7974]">
                    Tell us what you enjoy and we'll prioritize
                    local food that fits your journey.
                </p>
            </div>

            <FoodPreferences selected={preference} onChange={setPreference}/>

            {remainingBudget !== undefined && (
                <div className="mt-4 flex items-center justify-between rounded-[18px] bg-[#e8f58d]/60 px-4 py-3">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.13em] text-[#123c35]">
                            Remaining trip budget
                        </p>

                        <p className="mt-0.5 text-sm font-black text-[#123c35]">
                            ₹
                            {remainingBudget.toLocaleString(
                                "en-IN",
                            )}
                        </p>
                    </div>

                    <span className="text-[11px] font-bold text-[#31544d]">
                        Showing options that can fit
                    </span>
                </div>
            )}

            <div className="mt-5 space-y-3">
                {filteredFoods.map((food) => (
                    <FoodCard key={food.id} food={food} expanded={ expandedId === food.id }
                        onToggle={() => setExpandedId( expandedId === food.id ? null : food.id, ) }/>
                ))}
            </div>

            {filteredFoods.length === 0 && (
                <div className="rounded-[24px] bg-white p-8 text-center">
                    <p className="text-sm font-bold text-[#123c35]">
                        No matching food found.
                    </p>

                    <p className="mt-2 text-xs text-[#6d7974]">
                        Try another preference.
                    </p>
                </div>
            )}
        </section>
    );
}