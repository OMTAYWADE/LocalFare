import {
  ArrowRight,
  Clock3,
  Heart,
  MapPin,
  Star,
} from "lucide-react";

import type { RealPlaceResult } from "@/features/search/types";

interface ExploreRecommendationCardProps {
  place: RealPlaceResult;
  onPlan: () => void;
}

export default function ExploreRecommendationCard({
  place,
  onPlan,
}: ExploreRecommendationCardProps) {
  return (
    <article className="group overflow-hidden rounded-[24px] border border-[#123c35]/8 bg-white shadow-[0_8px_28px_rgba(18,60,53,0.05)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(18,60,53,0.10)]">

      {/* IMAGE */}

      <div className="relative h-[190px] overflow-hidden bg-[#06483f]">

        {place.imageUrl ? (
          <img
            src={place.imageUrl}
            alt={place.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,rgba(232,245,141,0.5),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(239,113,61,0.4),transparent_35%),linear-gradient(135deg,#06483f,#236d5e)]" />
        )}

        {/* IMAGE OVERLAY */}

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/65 to-transparent" />

        {/* DISTANCE */}

        {place.distanceKm !== undefined && (
          <span className="absolute left-3 top-3 rounded-full bg-[#06483f] px-2.5 py-1.5 text-[9px] font-black text-white shadow-sm">
            {place.distanceKm.toFixed(1)} km
          </span>
        )}

        {/* SAVE */}

        <button
          type="button"
          aria-label={`Save ${place.name}`}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-md transition hover:bg-white hover:text-[#ef713d]"
        >
          <Heart className="h-4 w-4" />
        </button>

        {/* CATEGORY */}

        <span className="absolute bottom-3 left-3 rounded-full bg-[#06483f]/90 px-2.5 py-1.5 text-[8px] font-black uppercase tracking-[0.12em] text-[#dff18c] backdrop-blur">
          {formatCategory(place.category)}
        </span>
      </div>

      {/* CONTENT */}

      <div className="p-4">

        <div className="flex items-start justify-between gap-3">

          <h3 className="min-w-0 flex-1 text-[17px] font-black leading-tight tracking-[-0.04em] text-[#123c35]">
            {place.name}
          </h3>

          {place.rating !== undefined && (
            <div className="flex shrink-0 items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-[#ff9f1c] text-[#ff9f1c]" />

              <span className="text-[10px] font-black text-[#123c35]">
                {place.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {place.address && (
          <p className="mt-2 line-clamp-2 text-[10px] leading-4 text-[#71817b]">
            {place.address}
          </p>
        )}

        {/* TRAVEL INFO */}

        <div className="mt-4 flex items-center gap-3 border-t border-[#123c35]/8 pt-3">

          {place.durationMinutes !== undefined && (
            <div className="flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5 text-[#ef713d]" />

              <span className="text-[10px] font-bold text-[#526761]">
                {place.durationMinutes} min
              </span>
            </div>
          )}

          {place.distanceKm !== undefined && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#5c9b72]" />

              <span className="text-[10px] font-bold text-[#526761]">
                {place.distanceKm.toFixed(1)} km
              </span>
            </div>
          )}

        </div>

        {/* ACTION */}

        <button
          type="button"
          onClick={onPlan}
          className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#123c35] px-4 py-3 text-[10px] font-black text-white transition hover:bg-[#075348]"
        >
          Compare travel cost

          <ArrowRight className="h-3.5 w-3.5" />
        </button>

      </div>
    </article>
  );
}

function formatCategory(
  category: string,
) {
  return category
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}