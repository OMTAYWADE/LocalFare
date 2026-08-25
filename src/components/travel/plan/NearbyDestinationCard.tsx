"use client";

import { ChevronDown, Clock3, MapPin, Star, } from "lucide-react";
import PriceBadge from "@/components/ui/PriceBadge";
import type { NearbyDestination, } from "@/features/travel/types";

interface NearbyDestinationCardProps {
    destination: NearbyDestination;
    onDetails: () => void;
}

export default function NearbyDestinationCard({ destination, onDetails, }: NearbyDestinationCardProps) {
    return (
        <article className="overflow-hidden rounded-[28px] border border-[#123c35]/10 bg-white">
            <div className="grid md:grid-cols-[190px_1fr]">
                <div className="relative h-52 bg-[#ccecf3] md:h-full">
                    {destination.image ? (
                        <img src={destination.image} alt={destination.name} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <MapPin className="h-10 w-10 text-[#123c35]/30" />
                        </div>
                    )}

                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.1em] text-[#123c35] backdrop-blur">
                        {destination.category}
                    </span>
                </div>

                <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-black tracking-[-0.04em] text-[#123c35]">
                                {destination.name}
                            </h3>

                            <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#6d7974]">
                                <span className="inline-flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {destination.distanceKm} km
                                </span>

                                <span className="inline-flex items-center gap-1">
                                    <Clock3 className="h-3.5 w-3.5" />
                                    {destination.estimatedVisitMinutes} min visit
                                </span>

                                <span className="inline-flex items-center gap-1">
                                    <Star className="h-3.5 w-3.5 fill-[#f2c94c] text-[#f2c94c]" />
                                    {destination.rating}
                                </span>
                            </div>
                        </div>

                        <PriceBadge status={destination.priceStatus} />
                    </div>

                    <p className="mt-4 text-sm leading-6 text-[#6d7974]">
                        {destination.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {destination.highlights.slice(0, 3).map((highlight) => (
                            <span key={highlight} className="rounded-full bg-[#f7f3ea] px-3 py-1.5 text-[10px] font-bold text-[#31544d]">
                                {highlight}
                            </span>
                        ))}
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-4 border-t border-[#123c35]/8 pt-5">
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#6d7974]">
                                Visit estimate
                            </p>

                            <p className="mt-1 text-lg font-black text-[#123c35]">
                                ₹
                                {(destination.foodBudgetMin + destination.localTransportBudget + destination.entryFee + destination.otherBudget).toLocaleString("en-IN")}
                                <span className="text-xs font-semibold text-[#6d7974]">
                                    {" "}
                                    + travel
                                </span>
                            </p>
                        </div>

                        <button type="button" onClick={onDetails} className="flex items-center gap-2 rounded-full bg-[#123c35] px-5 py-3 text-xs font-black text-white transition hover:bg-[#0d312b]">
                            See full cost

                            <ChevronDown className="h-4 w-4 -rotate-90" />
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}