"use client";

import { Bike, Car, ChevronDown, Footprints, Hotel, IndianRupee, Navigation, RotateCcw, } from "lucide-react";
import { useMemo, useState } from "react";
import PriceBadge from "@/components/ui/PriceBadge";
import FreshnessBadge from "@/components/ui/FreshnessBadge";
import type { NearbyDestination, TransportChoice, VisitPlan, } from "@/features/travel/types";
import { calculateDestinationCost } from "@/features/travel/utils/calculateDestinationCost";

interface DestinationCostPlannerProps {
    destination: NearbyDestination;
    currentRemainingBudget?: number;
    onClose: () => void;
    onRecalculate?: (total: number,) => void;
}

const transportConfig: Record<TransportChoice, { label: string; icon: typeof Bike; }> = {
    rapido: { label: "Rapido", icon: Bike, },
    uber: { label: "Uber", icon: Car, },
    local: { label: "Local", icon: Navigation, },
    walk: { label: "Walk", icon: Footprints, },
};

export default function DestinationCostPlanner({ destination, currentRemainingBudget, onClose, onRecalculate, }: DestinationCostPlannerProps) {
    const [transport, setTransport] = useState<TransportChoice>("rapido");
    const [visitPlan, setVisitPlan] = useState<VisitPlan>("day-trip");
    const [showBreakdown, setShowBreakdown] = useState(true);
    const calculation = useMemo(() => calculateDestinationCost(destination, transport, visitPlan,), [destination, transport, visitPlan,],
    );

    const budgetDifference = currentRemainingBudget !== undefined ? currentRemainingBudget - calculation.total : undefined;
    const handleRecalculate = () => { onRecalculate?.(calculation.total,); };

    return (
        <div className="mt-4 overflow-hidden rounded-[30px] border border-[#123c35]/10 bg-[#fffdf8] shadow-[0_20px_60px_rgba(18,60,53,0.08)]">
            {/* Header */}

            <div className="flex items-start justify-between gap-4 border-b border-[#123c35]/8 p-5 sm:p-7">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#ef713d]">
                        Cost planner
                    </p>

                    <h3 className="mt-1 text-2xl font-black tracking-[-0.04em] text-[#123c35]">
                        {destination.name}
                    </h3>

                    <p className="mt-2 text-xs text-[#6d7974]">
                        Choose how you want to travel and
                        whether you're staying.
                    </p>
                </div>

                <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f7f3ea] text-[#123c35]" aria-label="Close details"
                >
                    ×
                </button>
            </div>

            {/* Transport */}

            <div className="p-5 sm:p-7">
                <div>
                    <p className="text-xs font-black text-[#123c35]">
                        How would you like to travel?
                    </p>

                    <p className="mt-1 text-[11px] text-[#6d7974]">
                        We will recalculate the trip using
                        your selected option.
                    </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {destination.travelOptions.map((option) => {
                        const config = transportConfig[option.provider];
                        const Icon = config.icon;
                        const active = transport === option.provider;
                        return (
                            <button key={option.id} type="button" onClick={() => setTransport(option.provider,)}
                                className={` rounded-[20px] border p-4 text-left transition
                    ${active ? "border-[#123c35] bg-[#123c35] text-white" : "border-[#123c35]/10 bg-white text-[#123c35] hover:bg-[#e8f58d]/40"} `}>
                                <Icon className={`h-5 w-5 ${active ? "text-[#cbe95b]" : "text-[#ef713d]"}`} />

                                <p className="mt-3 text-xs font-black">
                                    {option.name}
                                </p>

                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <p className={`text-[11px] ${active ? "text-white/55" : "text-[#6d7974]"}`}>
                                        ₹{option.minPrice}
                                        {option.maxPrice !== option.minPrice ? `–₹${option.maxPrice}` : ""}
                                    </p>

                                    <PriceBadge status={option.priceStatus}/>
                                </div>

                                <p className={`mt-1 text-[10px] ${active ? "text-white/45" : "text-[#6d7974]"}`}>
                                    {option.durationMinutes} min
                                </p>
                            </button>
                        );
                    },
                    )}
                </div>
            </div>

            {/* Stay */}

            <div className="border-t border-[#123c35]/8 px-5 py-5 sm:px-7">
                <p className="text-xs font-black text-[#123c35]">
                    What's your plan?
                </p>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <button type="button" onClick={() => setVisitPlan("day-trip")}
                        className={` flex items-center gap-3 rounded-[20px] border p-4 text-left
              ${visitPlan === "day-trip" ? "border-[#123c35] bg-[#e8f58d]/60" : "border-[#123c35]/10 bg-white"} `}>
                        <RotateCcw className="h-5 w-5 text-[#123c35]" />

                        <span>
                            <strong className="block text-xs font-black text-[#123c35]">
                                Day trip
                            </strong>

                            <small className="mt-1 block text-[10px] text-[#6d7974]">
                                Visit and continue your journey
                            </small>
                        </span>
                    </button>

                    <button type="button" disabled={!destination.stayAvailable} onClick={() => setVisitPlan("stay")}
                        className={` flex items-center gap-3 rounded-[20px] border p-4 text-left disabled:cursor-not-allowed disabled:opacity-40
              ${visitPlan === "stay" ? "border-[#123c35] bg-[#e8f58d]/60" : "border-[#123c35]/10 bg-white"} `}>
                        <Hotel className="h-5 w-5 text-[#ef713d]" />

                        <span>
                            <strong className="block text-xs font-black text-[#123c35]">
                                Stay overnight
                            </strong>

                            <small className="mt-1 block text-[10px] text-[#6d7974]">
                                + ₹ {destination.stayMinPrice ?? 0}
                                –₹ {destination.stayMaxPrice ?? 0}
                            </small>
                        </span>
                    </button>
                </div>
            </div>

            {/* Calculation */}
            <div className="border-t border-[#123c35]/8 bg-[#f7f3ea]/60">
                <button type="button" onClick={() => setShowBreakdown((value) => !value,)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left sm:px-7">
                    <span className="text-xs font-black text-[#123c35]">
                        Where will your money go?
                    </span>

                    <ChevronDown className={`h-4 w-4 text-[#6d7974] transition-transform ${showBreakdown ? "rotate-180" : ""}`} />
                </button>

                {showBreakdown && (
                    <div className="px-5 pb-5 sm:px-7 sm:pb-7">
                        <div className="divide-y divide-[#123c35]/8 rounded-[20px] bg-white px-4">
                            <ExpenseRow label="Travel" amount={calculation.travel} />
                            <ExpenseRow label="Entry" amount={calculation.entry} />
                            <ExpenseRow label="Food" amount={calculation.food} />
                            <ExpenseRow label="Local transport" amount={calculation.localTransport} />
                            <ExpenseRow label="Other" amount={calculation.other} />

                            {calculation.stay > 0 && (
                                <ExpenseRow label="Stay" amount={calculation.stay} />
                            )}

                            <div className="flex items-center justify-between py-4">
                                <span className="text-sm font-black text-[#123c35]">
                                    New estimated total
                                </span>

                                <span className="text-xl font-black text-[#123c35]">
                                    ₹
                                    {calculation.total.toLocaleString("en-IN",)}
                                </span>
                            </div>
                        </div>

                        {/* Budget comparison */}
                        {budgetDifference !== undefined && (
                            <div className={` mt-4 rounded-[20px] p-4 ${budgetDifference >= 0 ? "bg-[#e8f58d]" : "bg-[#f9dfd0]"} `}>
                                <p className="text-[10px] font-black uppercase tracking-[0.13em] text-[#123c35]">
                                    Compared with your remaining budget
                                </p>

                                <p className="mt-1 text-lg font-black text-[#123c35]">
                                    {budgetDifference >= 0 ? `₹${budgetDifference.toLocaleString("en-IN",)} left` : `₹${Math.abs(budgetDifference,).toLocaleString("en-IN",)} over budget`}
                                </p>
                            </div>
                        )}

                        {/* Freshness */}
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            <FreshnessBadge status={destination.confidence.freshness} lastUpdated={destination.confidence.lastUpdated} />

                            <span className="text-[10px] font-semibold text-[#6d7974]">
                                {destination.confidence.score}%
                                confidence
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Recalculate */}

            <div className="p-5 sm:p-7">
                <button type="button" onClick={handleRecalculate} className=" flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[#123c35] px-6 py-3.5 text-sm font-black text-white transition hover:bg-[#0d312b]">
                    <IndianRupee className="h-4 w-4 text-[#cbe95b]" />

                    Recalculate my trip
                </button>
            </div>
        </div>
    );
}

function ExpenseRow({ label, amount, }: { label: string; amount: number; }) {
    return (
        <div className="flex items-center justify-between py-3.5">
            <span className="text-xs font-semibold text-[#6d7974]">
                {label}
            </span>

            <span className="text-sm font-black text-[#123c35]">
                ₹{amount.toLocaleString("en-IN")}
            </span>
        </div>
    );
}