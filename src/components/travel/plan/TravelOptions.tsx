"use client";

import { Bike, Bus, Car, ChevronDown, Clock3, TrainFront, } from "lucide-react";
import { useState } from "react";
import PriceBadge from "@/components/ui/PriceBadge";
import FreshnessBadge from "@/components/ui/FreshnessBadge";
import type { TravelOption, } from "@/features/travel/types";

interface Props {
    options: TravelOption[];
}

const icons = {
    metro: TrainFront,
    bus: Bus,
    auto: Car,
    bike: Bike,
    cab: Car,
    walk: TrainFront,
};

export default function TravelOptions({ options, }: Props) {
    const [expanded, setExpanded] = useState<string | null>(null);

    return (
        <section className="mt-10">
            <div className="mb-5">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#ef713d]">
                    How to get there
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-[-0.04em] text-[#123c35]">
                    Travel options
                </h2>

                <p className="mt-2 text-sm text-[#6d7974]">
                    Compare cost, time and price fairness.
                </p>
            </div>

            <div className="space-y-3">
                {options.map((option) => {
                    const Icon = icons[option.mode];
                    const isOpen = expanded === option.id;

                    return (
                        <div key={option.id} className=" overflow-hidden rounded-[24px] border border-[#123c35]/10 bg-white ">
                            <button type="button" onClick={() => setExpanded(isOpen ? null : option.id,)
                            } className="w-full p-5 text-left sm:p-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#f7f3ea] text-[#123c35]">
                                        <Icon className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-sm font-black text-[#123c35]">
                                                {option.name}
                                            </h3>

                                            {option.recommended && (
                                                <span className="rounded-full bg-[#e8f58d] px-2 py-1 text-[9px] font-black uppercase tracking-wide text-[#123c35]">
                                                    Recommended
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-[#6d7974]">
                                            <span className="inline-flex items-center gap-1">
                                                <Clock3 className="h-3 w-3" />

                                                {option.durationMinutes} min
                                            </span>

                                            <span>
                                                {option.availability === "available" ? "Available" : "Limited"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="hidden text-right sm:block">
                                        <p className="text-lg font-black text-[#123c35]">
                                            ₹
                                            {option.price.min}
                                            <span className="text-xs font-bold text-[#6d7974]">
                                                {" "}
                                                – ₹
                                                {option.price.max}
                                            </span>
                                        </p>

                                        <div className="mt-1">
                                            <PriceBadge status={option.priceStatus} />
                                        </div>
                                    </div>

                                    <ChevronDown className={` h-5 w-5 shrink-0 text-[#6d7974] transition-transform ${isOpen ? "rotate-180" : ""}`}/>
                                </div>

                                <div className="mt-4 flex items-center justify-between sm:hidden">
                                    <p className="text-lg font-black text-[#123c35]">
                                        ₹{option.price.min}
                                        <span className="text-xs font-bold text-[#6d7974]">
                                            {" "}
                                            – ₹{option.price.max}
                                        </span>
                                    </p>

                                    <PriceBadge status={option.priceStatus}/>
                                </div>
                            </button>

                            {isOpen && (
                                <div className="border-t border-[#123c35]/8 bg-[#f7f3ea]/50 px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                                    {option.recommendationReason && (
                                        <p className="text-xs font-bold text-[#123c35]">
                                            Why we recommend it:{" "}
                                            <span className="font-medium text-[#6d7974]">
                                                {option.recommendationReason}
                                            </span>
                                        </p>
                                    )}

                                    <div className="mt-4">
                                        <FreshnessBadge status={ option.confidence.freshness} lastUpdated={ option.confidence.lastUpdated}/>
                                    </div>

                                    <p className="mt-3 text-[11px] text-[#6d7974]">
                                        {option.confidence.score}%
                                        confidence based on{" "}
                                        {option.confidence.sourceCount}{" "}
                                        current data sources.
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}