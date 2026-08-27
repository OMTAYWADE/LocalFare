"use client";

import {
    CheckCircle2,
    MapPin,
    Star,
    Utensils,
} from "lucide-react";

import type {
    FoodRecommendation,
} from "../services/foodRecommendation.service";

interface FoodRecommendationCardProps {
    recommendation: FoodRecommendation;
}

export default function FoodRecommendationCard({
    recommendation,
}: FoodRecommendationCardProps) {
    const {
        food,
        score,
        reasons,
    } = recommendation;

    return (
        <article className="overflow-hidden rounded-[28px] border border-[#123c35]/10 bg-white transition hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(18,60,53,0.10)]">

            {/* IMAGE */}

            <div className="relative h-48 overflow-hidden bg-[#dfe9df]">

                {food.imageUrl ? (
                    <img src={food.imageUrl} alt={food.name} className="h-full w-full object-cover"/>
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <Utensils className="h-10 w-10 text-[#123c35]/30" />
                    </div>
                )}

                {/* SCORE */}

                <div className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-2 shadow-sm backdrop-blur">

                    <span className="text-xs font-black text-[#123c35]">
                        {score}
                    </span>

                    <span className="ml-1 text-[9px] font-bold text-[#6d7974]">
                        match
                    </span>

                </div>

            </div>

            {/* CONTENT */}

            <div className="p-5">

                <div className="flex items-start justify-between gap-4">

                    <div>

                        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#ef713d]">
                            {food.cuisine
                                .slice(0, 2)
                                .join(" • ")}
                        </p>

                        <h3 className="mt-1 text-xl font-black tracking-[-0.03em] text-[#123c35]">
                            {food.name}
                        </h3>

                    </div>

                    {food.rating !== undefined && (
                        <div className="flex shrink-0 items-center gap-1">

                            <Star className="h-3.5 w-3.5 fill-current text-[#ef713d]" />

                            <span className="text-xs font-black text-[#123c35]">
                                {food.rating.toFixed(1)}
                            </span>

                        </div>
                    )}

                </div>

                {/* DESCRIPTION */}

                {food.description && (
                    <p className="mt-3 text-xs leading-5 text-[#6d7974]">
                        {food.description}
                    </p>
                )}

                {/* META */}

                <div className="mt-4 flex flex-wrap gap-2">

                    <span className="rounded-full bg-[#f7f3ea] px-3 py-1.5 text-[9px] font-black text-[#31544d]">
                        ₹{food.priceInr}
                    </span>

                    <span className="rounded-full bg-[#f7f3ea] px-3 py-1.5 text-[9px] font-black text-[#31544d]">
                        {food.spiceLevel}
                    </span>

                    <span className="rounded-full bg-[#e8f58d] px-3 py-1.5 text-[9px] font-black text-[#123c35]">
                        {food.diet}
                    </span>

                </div>

                {/* RESTAURANT */}

                {food.restaurantName && (
                    <div className="mt-4 flex items-center gap-2 border-t border-[#123c35]/8 pt-4">

                        <MapPin className="h-3.5 w-3.5 text-[#ef713d]" />

                        <span className="text-xs font-bold text-[#31544d]">
                            {food.restaurantName}
                        </span>

                    </div>
                )}

                {/* REASONS */}

                {reasons.length > 0 && (
                    <div className="mt-4 rounded-2xl bg-[#fbfaf5] p-3">

                        <p className="text-[9px] font-black uppercase tracking-[0.13em] text-[#6d7974]">
                            Why FairTrip recommends it
                        </p>

                        <div className="mt-2 space-y-2">

                            {reasons
                                .slice(0, 3)
                                .map(
                                    (
                                        reason,
                                        index,
                                    ) => (
                                        <div
                                            key={`${reason}-${index}`}
                                            className="flex items-center gap-2"
                                        >
                                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#123c35]" />

                                            <span className="text-[10px] font-bold text-[#31544d]">
                                                {reason}
                                            </span>
                                        </div>
                                    ),
                                )}

                        </div>

                    </div>
                )}

            </div>
        </article>
    );
}