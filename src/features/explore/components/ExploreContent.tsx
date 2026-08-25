"use client";

import { Compass, MapPin, Navigation, Search, Sparkles,} from "lucide-react";
import { useRouter } from "next/navigation";

const nearbyPlaces = [
  {
    id: "marine-drive",
    name: "Marine Drive",
    category: "Waterfront",
    distance: "7.2 km",
    estimatedCost: "₹250–₹450",
    rating: 4.7,
    description:
      "A famous seafront promenade perfect for sunset views and an evening walk.",
  },
  {
    id: "gateway",
    name: "Gateway of India",
    category: "Historic",
    distance: "8.4 km",
    estimatedCost: "₹300–₹500",
    rating: 4.6,
    description:
      "A historic waterfront landmark with harbour views and nearby attractions.",
  },
  {
    id: "colaba",
    name: "Colaba Causeway",
    category: "Market & Food",
    distance: "8.1 km",
    estimatedCost: "₹350–₹600",
    rating: 4.5,
    description:
      "A lively area for street food, shopping, cafés and heritage surroundings.",
  },
];

export default function ExploreContent() {
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-80px)] py-8 sm:py-12">
      {/* Hero */}
      <section className="overflow-hidden rounded-[34px] bg-[#123c35] px-6 py-10 text-white sm:px-10 sm:py-14">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#cbe95b]">
            <Sparkles className="h-3.5 w-3.5" />

            FairTrip Explore
          </div>

          <h1 className="mt-5 text-4xl font-black tracking-[-0.055em] sm:text-5xl">
            Where do you want
            <br />
            to go today?
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-white/60">
            Discover nearby places, compare the
            expected cost and find options that fit
            your time and budget.
          </p>
        </div>

        {/* Search */}
        <div className="mt-8 flex max-w-2xl items-center gap-3 rounded-[22px] bg-white p-2">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#f7f3ea]">
            <Search className="h-5 w-5 text-[#123c35]" />
          </div>

          <input type="text" placeholder="Search a place or destination..."
            className="min-w-0 flex-1 bg-transparent px-2 text-sm font-semibold text-[#123c35] outline-none placeholder:text-[#8b9792]"/>

          <button type="button" onClick={() => router.push("/travel/plan") } className="rounded-full bg-[#ef713d] px-5 py-3 text-xs font-black text-white">
            Plan trip
          </button>
        </div>
      </section>

      {/* Nearby */}

      <section className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#ef713d]">
              Around you
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-[-0.04em] text-[#123c35]">
              Explore nearby
            </h2>

            <p className="mt-2 text-sm text-[#6d7974]">
              Places you can realistically visit.
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-[#e8f58d]/60 px-4 py-2 sm:flex">
            <Navigation className="h-3.5 w-3.5 text-[#123c35]" />

            <span className="text-[10px] font-black text-[#123c35]">
              Location enabled
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {nearbyPlaces.map((place) => (
            <article key={place.id} className="rounded-[28px] border border-[#123c35]/10 bg-white p-5 transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(18,60,53,0.08)]"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#f7f3ea] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.1em] text-[#31544d]">
                  {place.category}
                </span>

                <span className="text-xs font-black text-[#123c35]">
                  ⭐ {place.rating}
                </span>
              </div>

              <h3 className="mt-5 text-xl font-black tracking-[-0.04em] text-[#123c35]">
                {place.name}
              </h3>

              <p className="mt-2 text-xs leading-5 text-[#6d7974]">
                {place.description}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <div className="rounded-[16px] bg-[#f7f3ea] p-3">
                  <MapPin className="h-4 w-4 text-[#ef713d]" />

                  <p className="mt-2 text-[9px] font-black uppercase tracking-[0.08em] text-[#6d7974]">
                    Distance
                  </p>

                  <p className="mt-1 text-xs font-black text-[#123c35]">
                    {place.distance}
                  </p>
                </div>

                <div className="rounded-[16px] bg-[#e8f58d]/50 p-3">
                  <Compass className="h-4 w-4 text-[#123c35]" />

                  <p className="mt-2 text-[9px] font-black uppercase tracking-[0.08em] text-[#6d7974]">
                    Expected
                  </p>

                  <p className="mt-1 text-xs font-black text-[#123c35]">
                    {place.estimatedCost}
                  </p>
                </div>
              </div>

              <button type="button" onClick={() => router.push(`/travel/plan?destination=${encodeURIComponent( place.name,)}`,)
                } className="mt-5 w-full rounded-full bg-[#123c35] px-5 py-3.5 text-xs font-black text-white transition hover:bg-[#0d312b]">
                Compare trip cost
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}