"use client";

import { ArrowRight, Clock3, MapPin, Sparkles, } from "lucide-react";
import type { ExploreRecommendation, } from "@/features/recommendation/types";

interface ExploreRecommendationsProps {
  places: ExploreRecommendation[];
  loading: boolean;
  error: string;
  hasLocation: boolean;
  filter:
  | "all"
  | "distance"
  | "time";
  setFilter: (
    filter:
      | "all"
      | "distance"
      | "time",
  ) => void;

  onPlan: (place: ExploreRecommendation,) => void;
}

export default function ExploreRecommendations({ places, loading, error, hasLocation, filter, setFilter, onPlan, }: ExploreRecommendationsProps) {

  const filteredPlaces = [...places].sort((first, second,) => {

    if (filter === "distance") {
      return ((first.distanceKm ?? Infinity) - (second.distanceKm ?? Infinity));
    }

    if (filter === "time") {
      return ((first.durationMinutes ?? Infinity) - (second.durationMinutes ?? Infinity)
      );
    }

    return (second.recommendationScore - first.recommendationScore);
  },
  );

  return (
    <section className="mt-10 sm:mt-12">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#ef713d]">
            Around you
          </p>

          <h2 className="mt-1 text-2xl font-black tracking-[-0.05em] text-[#123c35] sm:text-3xl">
            Places worth discovering
          </h2>

          <p className="mt-1.5 max-w-2xl text-xs leading-5 text-[#667872] sm:text-sm">
            Recommendations are based on your traveler type, location and places you have already visited.
          </p>

        </div>

        {/* FILTERS */}
        <div className="flex w-full gap-2 overflow-x-auto sm:w-auto">

          <button type="button" onClick={() => setFilter("all",)}
            className={` shrink-0 rounded-full px-4 py-2 text-[10px] font-black transition ${filter === "all" ? "bg-[#123c35] text-white" : "bg-white text-[#31544d] border border-[#123c35]/10"}`}>
            Best match
          </button>

          <button type="button" onClick={() => setFilter("distance",)}
            className={` shrink-0 rounded-full px-4 py-2 text-[10px] font-black transition ${filter === "distance" ? "bg-[#123c35] text-white" : "bg-white text-[#31544d] border border-[#123c35]/10"}`}>
            Nearest
          </button>

          <button type="button" onClick={() => setFilter("time",)}
            className={` shrink-0 rounded-full px-4 py-2 text-[10px] font-black transition ${filter === "time" ? "bg-[#123c35] text-white" : "bg-white text-[#31544d] border border-[#123c35]/10"}`}>
            Fastest
          </button>

        </div>

      </div>

      {/* ERROR */}
      {error && (
        <div className="mt-5 rounded-2xl border border-[#ef713d]/20 bg-[#fff5ef] px-4 py-3 text-xs font-semibold text-[#a84f2c]">
          {error}
        </div>
      )}

      {/* NO LOCATION */}
      {!hasLocation &&
        !loading && (
          <div className="mt-6 rounded-[24px] border border-[#123c35]/10 bg-white p-8 text-center">
            <MapPin className="mx-auto h-7 w-7 text-[#ef713d]" />
            <h3 className="mt-3 text-lg font-black text-[#123c35]">
              Set your starting point
            </h3>
            <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-[#667872]">
              Allow your location or choose a starting point above to get personalized destinations.
            </p>

          </div>
        )}

      {/* LOADING */}

      {loading && (

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6, }).map((_, index,) => (
            <div key={index} className="h-[300px] animate-pulse rounded-[24px] bg-[#e9e5da]" />
          ),
          )}

        </div>
      )}

      {/* RESULTS */}
      {!loading && hasLocation &&
        filteredPlaces.length > 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPlaces.map((place,) => (

              <article key={place.id} className="group overflow-hidden rounded-[24px] border border-[#123c35]/10 bg-white shadow-[0_10px_30px_rgba(18,60,53,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(18,60,53,0.10)]" >

                {/* IMAGE */}
                <div className="relative h-44 overflow-hidden bg-[#123c35]">
                  {place.imageUrl ? (
                    <img src={place.imageUrl} alt={place.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  ) : (

                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(232,245,141,0.35),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(239,113,61,0.3),transparent_35%)]" />
                  )}

                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                    <span className="rounded-full bg-[#06483f] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.08em] text-[#e8f58d]">
                      {place.recommendationType.replace("_", " ",)}

                    </span>

                    {place.isNew && (
                      <span className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1.5 text-[9px] font-black text-[#123c35]">
                        <Sparkles className="h-3 w-3" />
                        New for you
                      </span>
                    )}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-4">
                  <h3 className="line-clamp-2 text-lg font-black tracking-[-0.035em] text-[#123c35]">
                    {place.name}
                  </h3>

                  {place.address && (
                    <p className="mt-1 line-clamp-1 text-[10px] text-[#7a8580]">
                      {place.address}
                    </p>
                  )}

                  {/* METRICS */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {place.distanceKm !== undefined && (
                      <span className="flex items-center gap-1 rounded-full bg-[#f7f3ea] px-2.5 py-1.5 text-[9px] font-bold text-[#31544d]">
                        <MapPin className="h-3 w-3" />
                        {place.distanceKm < 10 ? place.distanceKm.toFixed(1,) : Math.round(place.distanceKm,)}{" "}
                        km

                      </span>
                    )}

                    {place.durationMinutes !== undefined && (
                      <span className="flex items-center gap-1 rounded-full bg-[#f7f3ea] px-2.5 py-1.5 text-[9px] font-bold text-[#31544d]">
                        <Clock3 className="h-3 w-3" />

                        {Math.round(place.durationMinutes,)}{" "}
                        min
                      </span>
                    )}

                    {place.rating !== undefined && (
                      <span className="rounded-full bg-[#e8f58d]/70 px-2.5 py-1.5 text-[9px] font-black text-[#31544d]">

                        ★{" "}
                        {place.rating.toFixed(1,)}
                      </span>
                    )}

                  </div>

                  {/* REASON */}
                  <div className="mt-4 rounded-[16px] bg-[#f7f3ea] p-3">

                    <p className="text-[9px] font-black uppercase tracking-[0.08em] text-[#ef713d]">
                      Why this place?
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-[#52655f]">
                      {place.recommendationReason}
                    </p>

                  </div>

                  {/* ACTION */}
                  <button type="button" onClick={() => onPlan(place,)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#123c35] px-4 py-3.5 text-xs font-black text-white transition hover:bg-[#0b302a]">
                    Compare travel cost

                    <ArrowRight className="h-4 w-4" />
                  </button>

                </div>
              </article>
            ),
            )}

          </div>
        )}

      {/* EMPTY */}
      {!loading && hasLocation && filteredPlaces.length === 0 && !error && (
        <div className="mt-6 rounded-[24px] border border-[#123c35]/10 bg-white p-8 text-center">

          <Sparkles className="mx-auto h-7 w-7 text-[#ef713d]" />

          <h3 className="mt-3 text-lg font-black text-[#123c35]">
            Looking for something new
          </h3>

          <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-[#667872]">
            We couldn't find a suitable new destination from this location yet.
          </p>

        </div>
      )}

    </section>
  );
} 