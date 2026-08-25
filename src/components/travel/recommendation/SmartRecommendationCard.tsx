"use client";

import { ChevronDown, Clock3, MapPin, Star,} from "lucide-react";
import { useState } from "react";
import RecommendationBadge from "./RecommendationBadge";
import PriceBadge from "@/components/ui/PriceBadge";
import type { DestinationRecommendation,} from "@/features/recommendation/types";

interface Props {
    recommendation: DestinationRecommendation;
    onDetails?: () => void;
}

export default function SmartRecommendationCard({ recommendation, onDetails, }: Props) {
    const [open, setOpen] = useState(false);
    const { destination, estimatedCost, score, level, reasons, budgetRemainingAfterVisit, } = recommendation;

    return (
        <article className=" overflow-hidden rounded-[28px] border border-[#123c35]/10 bg-white ">
            <button type="button" onClick={() => setOpen((value) => !value)} className="w-full p-5 text-left sm:p-6">
                <div className="flex gap-4">
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[20px] bg-[#f7f3ea]">
                        {destination.image ? (<img src={destination.image} alt={destination.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <MapPin className="h-8 w-8 text-[#123c35]/30" />
                            </div>
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <RecommendationBadge level={level} score={score} />

                                <h3 className="mt-2 text-xl font-black tracking-[-0.04em] text-[#123c35]">
                                    {destination.name}
                                </h3>
                            </div>

                            <ChevronDown className={`h-5 w-5 shrink-0 text-[#6d7974] transition-transform ${open ? "rotate-180" : ""}`} />
                        </div>

                        <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-[#6d7974]">
                            <span className="inline-flex items-center gap-1">
                                <MapPin className="h-3 w-3" />

                                {destination.distanceKm} km
                            </span>

                            <span className="inline-flex items-center gap-1">
                                <Clock3 className="h-3 w-3" />

                                {destination.estimatedVisitMinutes} min
                            </span>

                            <span className="inline-flex items-center gap-1">
                                <Star className="h-3 w-3 fill-[#f2c94c] text-[#f2c94c]" />

                                {destination.rating}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-5 flex items-end justify-between gap-4 border-t border-[#123c35]/8 pt-4">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.13em] text-[#6d7974]">
                            Estimated visit cost
                        </p>

                        <p className="mt-1 text-xl font-black text-[#123c35]">
                            ₹
                            {estimatedCost.total.toLocaleString("en-IN",)}
                        </p>
                    </div>

                    <PriceBadge status={destination.priceStatus}
                    />
                </div>
            </button>

            {open && (
                <div className="border-t border-[#123c35]/8 bg-[#f7f3ea]/50 px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
                    <div className="rounded-[20px] bg-[#e8f58d]/60 p-4">
                        <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#123c35]">
                            Why FairTrip recommends this
                        </p>

                        <div className="mt-3 space-y-2">
                            {reasons.map((reason) => (
                                <p key={reason.text} className="text-xs font-semibold leading-5 text-[#31544d]" >
                                    ✓ {reason.text}
                                </p>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <MiniStat label="Travel" value={`₹${estimatedCost.travel}`} />
                        <MiniStat label="Food" value={`₹${estimatedCost.food}`} />
                        <MiniStat label="Local" value={`₹${estimatedCost.localTransport}`} />
                        <MiniStat label="Entry" value={`₹${estimatedCost.entry}`} />
                    </div>

                    <div className={`mt-3 rounded-[18px] p-4 ${budgetRemainingAfterVisit >= 0 ? "bg-[#dff1e5]" : "bg-[#f9dfd0]"}`}>
                        <p className="text-[9px] font-black uppercase tracking-[0.13em] text-[#123c35]">
                            After this visit
                        </p>

                        <p className="mt-1 text-lg font-black text-[#123c35]">
                            {budgetRemainingAfterVisit >= 0 ? `₹${budgetRemainingAfterVisit.toLocaleString("en-IN",)} left`
                                : `₹${Math.abs(budgetRemainingAfterVisit,).toLocaleString("en-IN",)} over budget`}
                        </p>
                    </div>

                    <button type="button" onClick={onDetails} className="mt-4 w-full rounded-full bg-[#123c35] px-5 py-3 text-xs font-black text-white transition hover:bg-[#0d312b]" >
                        Plan this place
                    </button>
                </div>
            )}
        </article>
    );
}

function MiniStat({ label, value, }: { label: string; value: string; }) {
    return (
        <div className="rounded-[16px] bg-white p-3">
            <p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#6d7974]">
                {label}
            </p>

            <p className="mt-1 text-xs font-black text-[#123c35]">
                {value}
            </p>
        </div>
    );
}