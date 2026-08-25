"use client";

import { useMemo, useState } from "react";
import type { NearbyDestination, } from "@/features/travel/types";
import NearbyDestinationCard from "./NearbyDestinationCard";
import DestinationCostPlanner from "./DestinationCostPlanner";

interface NearbyDestinationsProps {
    destinations: NearbyDestination[];
    remainingBudget?: number;
}

export default function NearbyDestinations({ destinations, remainingBudget, }: NearbyDestinationsProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [updatedBudget, setUpdatedBudget] = useState<number | undefined>(remainingBudget,);
    const selectedDestination = destinations.find((destination) => destination.id === selectedId,);
    const sortedDestinations = useMemo(() => {
        return [...destinations].sort((a, b) => {
            if (updatedBudget !== undefined) {
                const aCost = a.foodBudgetMin + a.localTransportBudget + a.entryFee + a.otherBudget;
                const bCost = b.foodBudgetMin + b.localTransportBudget + b.entryFee + b.otherBudget;
                const aFits = aCost <= updatedBudget;
                const bFits = bCost <= updatedBudget;

                if (aFits !== bFits) {
                    return aFits ? -1 : 1;
                }
            }

            return (a.distanceKm - b.distanceKm);
        },
        );
    }, [destinations, updatedBudget,]);

    return (
        <section className="mt-14">
            <div className="mb-6">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#ef713d]">
                    Around your destination
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-[-0.04em] text-[#123c35] sm:text-3xl">
                    Places you can visit
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-[#6d7974]">
                    We prioritize places that are nearby and
                    practical for your remaining budget.
                </p>
            </div>

            {updatedBudget !== undefined && (
                <div className="mb-5 flex items-center justify-between rounded-[20px] bg-[#e8f58d]/60 px-5 py-4">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.13em] text-[#123c35]">
                            Budget available
                        </p>

                        <p className="mt-1 text-lg font-black text-[#123c35]">
                            ₹
                            {updatedBudget.toLocaleString("en-IN",)}
                        </p>
                    </div>

                    <span className="text-right text-[10px] font-bold text-[#31544d]">
                        Distance + budget
                        <br />
                        recommendations
                    </span>
                </div>
            )}

            <div className="space-y-4">
                {sortedDestinations.map(
                    (destination) => (
                        <div key={destination.id}>
                            <NearbyDestinationCard destination={destination} onDetails={() =>
                                setSelectedId(selectedId === destination.id ? null : destination.id,)}
                            />

                            {selectedId === destination.id && selectedDestination && (
                                <DestinationCostPlanner destination={selectedDestination} currentRemainingBudget={updatedBudget}
                                    onClose={() => setSelectedId(null,)} onRecalculate={(total,) => {
                                        if (updatedBudget !== undefined) {
                                            setUpdatedBudget(Math.max(0, updatedBudget - total,),);
                                        }
                                    }}
                                />
                            )}
                        </div>
                    ),
                )}
            </div>
        </section>
    );
}