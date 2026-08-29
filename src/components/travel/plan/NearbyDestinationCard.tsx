"use client";

import { ChevronDown, Clock3, MapPin, Star } from "lucide-react";
import PriceBadge from "@/components/ui/PriceBadge";
import type { NearbyDestination } from "@/features/travel/types";

interface NearbyDestinationCardProps {
  destination: NearbyDestination;
  onDetails: () => void;
}

export default function NearbyDestinationCard({ destination, onDetails }: NearbyDestinationCardProps) {
  const visitEstimate =
    (destination.foodBudgetMin ?? 0) +
    (destination.localTransportBudget ?? 0) +
    (destination.entryFee ?? 0) +
    (destination.otherBudget ?? 0);

  return (
    <article className="group overflow-hidden rounded-[28px] border border-[#123c35]/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(18,60,53,0.08)]">
      <div className="grid md:grid-cols-[190px_1fr]">
        <div className="relative h-52 overflow-hidden bg-[#ccecf3] md:h-full">
          {destination.image ? (
            <img
              src={destination.image}
              alt={destination.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <MapPin className="h-10 w-10 text-[#123c35]/30" />
            </div>
          )}

          {destination.category && (
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.1em] text-[#123c35] backdrop-blur">
              {destination.category}
            </span>
          )}
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-black tracking-[-0.04em] text-[#123c35]">
                {destination.name}
              </h3>

              <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#6d7974]">
                {destination.distanceKm !== undefined && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {destination.distanceKm} km
                  </span>
                )}

                {destination.estimatedVisitMinutes !== undefined && (
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5" />
                    {destination.estimatedVisitMinutes} min visit
                  </span>
                )}

                {destination.rating !== undefined && (
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-[#f2c94c] text-[#f2c94c]" />
                    {destination.rating}
                  </span>
                )}
              </div>
            </div>

            <PriceBadge status={destination.priceStatus} />
          </div>

          {destination.description && (
            <p className="mt-4 text-sm leading-6 text-[#6d7974]">{destination.description}</p>
          )}

          {destination.highlights && destination.highlights.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {destination.highlights.slice(0, 3).map((highlight) => (
                <span
                  key={highlight}
                  className="rounded-full bg-[#f7f3ea] px-3 py-1.5 text-[10px] font-bold text-[#31544d] transition-colors duration-200 hover:bg-[#e8f58d]"
                >
                  {highlight}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 flex items-center justify-between gap-4 border-t border-[#123c35]/8 pt-5">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#6d7974]">
                Visit estimate
              </p>

              <p className="mt-1 text-lg font-black text-[#123c35]">
                ₹{visitEstimate.toLocaleString("en-IN")}
                <span className="text-xs font-semibold text-[#6d7974]"> + travel</span>
              </p>
            </div>

            <button
              type="button"
              onClick={onDetails}
              className="flex items-center gap-2 rounded-full bg-[#123c35] px-5 py-3 text-xs font-black text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0d312b] active:scale-95"
            >
              See full cost
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}