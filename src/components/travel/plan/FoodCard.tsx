"use client";

import { ChevronDown, Clock3, MapPin, Navigation, Star } from "lucide-react";
import PriceBadge from "@/components/ui/PriceBadge";
import FreshnessBadge from "@/components/ui/FreshnessBadge";
import type { FoodRecommendation } from "@/features/travel/types";

interface FoodCardProps {
  food: FoodRecommendation;
  expanded: boolean;
  onToggle: () => void;
}

export default function FoodCard({ food, expanded, onToggle }: FoodCardProps) {
  const hasCoordinates =
    typeof food.mapLatitude === "number" && typeof food.mapLongitude === "number";

  const googleMapsUrl = hasCoordinates
    ? `https://www.google.com/maps/search/?api=1&query=${food.mapLatitude},${food.mapLongitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        food.address || food.name,
      )}`;

  return (
    <article className="overflow-hidden rounded-[26px] border border-[#123c35]/10 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_45px_rgba(18,60,53,0.07)]">
      <button type="button" onClick={onToggle} className="w-full p-5 text-left sm:p-6">
        <div className="flex gap-4">
          {/* Food visual */}
          <div className="group relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[20px] bg-[#f7f3ea] sm:h-28 sm:w-28">
            {food.image ? (
              <img
                src={food.image}
                alt={food.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <span className="text-4xl">🍽️</span>
            )}

            {food.vegetarian && (
              <span className="absolute bottom-2 left-2 flex h-5 w-5 items-center justify-center rounded-md bg-white/95 text-[#3f9b68] shadow-sm">
                ●
              </span>
            )}
          </div>

          {/* Main information */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                {food.category && (
                  <p className="text-[10px] font-black uppercase tracking-[0.13em] text-[#ef713d]">
                    {food.category}
                  </p>
                )}

                <h3 className="mt-1 text-lg font-black tracking-[-0.03em] text-[#123c35] sm:text-xl">
                  {food.name}
                </h3>

                {food.localName && (
                  <p className="mt-0.5 text-xs text-[#6d7974]">{food.localName}</p>
                )}
              </div>

              <ChevronDown
                className={`h-5 w-5 shrink-0 text-[#6d7974] transition-transform duration-300 ${
                  expanded ? "rotate-180" : ""
                }`}
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              {food.rating !== undefined && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#123c35]">
                  <Star className="h-3.5 w-3.5 fill-[#f2c94c] text-[#f2c94c]" />
                  {food.rating}
                  {food.reviewCount !== undefined && (
                    <span className="font-medium text-[#6d7974]">({food.reviewCount})</span>
                  )}
                </span>
              )}

              {food.distanceKm !== undefined && (
                <span className="inline-flex items-center gap-1 text-xs text-[#6d7974]">
                  <MapPin className="h-3.5 w-3.5" />
                  {food.distanceKm} km
                </span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {food.priceMin !== undefined && food.priceMax !== undefined && (
                <span className="text-sm font-black text-[#123c35]">
                  {food.currency}
                  {food.priceMin}–{food.priceMax}
                </span>
              )}

              <PriceBadge status={food.priceStatus} />
            </div>
          </div>
        </div>
      </button>

      {/* Expanded details */}
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-[#123c35]/8 bg-[#f7f3ea]/50 px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
            {food.description && (
              <p className="text-sm leading-6 text-[#5f6e68]">{food.description}</p>
            )}

            {food.popularReason && (
              <div className="mt-4 rounded-[18px] bg-[#e8f58d]/60 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#123c35]">
                  Why try it?
                </p>
                <p className="mt-1.5 text-xs font-semibold leading-5 text-[#31544d]">
                  {food.popularReason}
                </p>
              </div>
            )}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[18px] bg-white p-4 transition-shadow duration-200 hover:shadow-sm">
                <div className="flex items-center gap-2 text-[#123c35]">
                  <MapPin className="h-4 w-4" />
                  <span className="text-xs font-black">Address</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-[#6d7974]">
                  {food.address || "Address not available."}
                </p>
              </div>

              <div className="rounded-[18px] bg-white p-4 transition-shadow duration-200 hover:shadow-sm">
                <div className="flex items-center gap-2 text-[#123c35]">
                  <Clock3 className="h-4 w-4" />
                  <span className="text-xs font-black">Opening</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-[#6d7974]">
                  {food.openingHours || "Check current hours before visiting."}
                </p>
              </div>
            </div>

            {/* Price evidence */}
            {food.priceEvidence && food.priceEvidence.length > 0 && (
              <div className="mt-3 rounded-[18px] bg-white p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#123c35]">
                  Price signal
                </p>

                <div className="mt-3 space-y-2">
                  {food.priceEvidence.map((evidence) => (
                    <p key={evidence} className="text-xs leading-5 text-[#6d7974]">
                      • {evidence}
                    </p>
                  ))}
                </div>

                {food.confidence && (
                  <>
                    <div className="mt-4">
                      <FreshnessBadge
                        status={food.confidence.freshness}
                        lastUpdated={food.confidence.lastUpdated}
                      />
                    </div>

                    <p className="mt-2 text-[11px] text-[#6d7974]">
                      {food.confidence.score}% confidence from {food.confidence.sourceCount}{" "}
                      sources.
                    </p>
                  </>
                )}
              </div>
            )}

            {/* Directions */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex h-12 items-center justify-center gap-2 rounded-full bg-[#123c35] text-xs font-black text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0d312b] active:scale-95"
            >
              <Navigation className="h-4 w-4" />
              Get directions
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}