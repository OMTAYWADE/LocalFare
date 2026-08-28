"use client";

import { Sparkles } from "lucide-react";

import type { NearbyDestination } from "@/features/travel/types";

import {
    getDestinationRecommendations,
} from "@/features/recommendation/services/recommendation.service";

import SmartRecommendationCard from "./SmartRecommendationCard";

interface SmartRecommendationsProps {
    destinations: NearbyDestination[];

    remainingBudget: number;

    availableMinutes?: number;

    preferredTransport?:
        | "rapido"
        | "uber"
        | "local"
        | "walk";

    onPlanPlace?: (
        destination: NearbyDestination,
    ) => void;
}

export default function SmartRecommendations({
    destinations,
    remainingBudget,
    availableMinutes = 240,
    preferredTransport = "rapido",
    onPlanPlace,
}: SmartRecommendationsProps) {
    /*
    |--------------------------------------------------------------------------
    | No destinations
    |--------------------------------------------------------------------------
    */

    if (destinations.length === 0) {
        return (
            <section className="mt-14 rounded-[28px] border border-[#123c35]/10 bg-white p-6 sm:p-8">
                <div className="flex items-center gap-2 text-[#ef713d]">
                    <Sparkles className="h-4 w-4" />

                    <p className="text-[10px] font-black uppercase tracking-[0.18em]">
                        FairTrip intelligence
                    </p>
                </div>

                <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#123c35]">
                    No places found
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-[#6d7974]">
                    We couldn't find any places around
                    your current location.
                </p>
            </section>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Convert destinations into recommendation inputs
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | getDestinationRecommendations() expects:
    |
    | {
    |     destination,
    |     remainingBudget,
    |     availableMinutes,
    |     preferredTransport
    | }
    |
    |--------------------------------------------------------------------------
    */

    const recommendationInputs =
        destinations.map(
            (destination) => ({
                destination,
                remainingBudget,
                availableMinutes,
                preferredTransport,
            }),
        );

    /*
    |--------------------------------------------------------------------------
    | Calculate recommendations
    |--------------------------------------------------------------------------
    */

    const recommendations =
        getDestinationRecommendations(
            recommendationInputs,
        );

    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    return (
        <section className="mt-14">
            {/* HEADER */}

            <div className="mb-6">
                <div className="flex items-center gap-2 text-[#ef713d]">
                    <Sparkles className="h-4 w-4" />

                    <p className="text-[10px] font-black uppercase tracking-[0.18em]">
                        FairTrip intelligence
                    </p>
                </div>

                <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black tracking-[-0.04em] text-[#123c35] sm:text-3xl">
                            Best places for you
                        </h2>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-[#6d7974]">
                            We compare your budget,
                            distance, ratings, travel
                            time and price signals
                            before ranking these
                            places.
                        </p>
                    </div>

                    <div className="rounded-full bg-[#e8f58d] px-3 py-1.5 text-[10px] font-black text-[#123c35]">
                        {recommendations.length}{" "}
                        places compared
                    </div>
                </div>
            </div>

            {/* RECOMMENDATION CARDS */}

            <div className="space-y-4">
                {recommendations.map(
                    (recommendation) => (
                        <SmartRecommendationCard
                            key={
                                recommendation
                                    .destination.id
                            }
                            recommendation={
                                recommendation
                            }
                            onDetails={() =>
                                onPlanPlace?.(
                                    recommendation.destination,
                                )
                            }
                        />
                    ),
                )}
            </div>
        </section>
    );
}