"use client";

import { CheckCircle2, MapPin, Star, Utensils } from "lucide-react";
import type { ReactNode } from "react";

import type { FoodRecommendation } from "../services/foodRecommendation.service";
import { useCurrency } from "@/features/currency/components/CurrencyProvider";
import PriceDisplay from "@/features/currency/components/PriceDisplay";

interface FoodRecommendationCardProps {
  recommendation: FoodRecommendation;
}

export default function FoodRecommendationCard({ recommendation }: FoodRecommendationCardProps) {
  const { food, score, reasons } = recommendation;
  const { currency } = useCurrency();

  return (
    <article className="group overflow-hidden rounded-[26px] border border-[#123c35]/10 bg-white shadow-[0_10px_35px_rgba(18,60,53,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(18,60,53,0.10)]">
      <div className="relative h-48 overflow-hidden bg-[#dfe9df]">
        {food.imageUrl ? (
          <img
            src={food.imageUrl}
            alt={food.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_20%_20%,rgba(232,245,141,0.45),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(239,113,61,0.30),transparent_35%),linear-gradient(135deg,#06483f,#2d7768)] transition-transform duration-700 group-hover:scale-105">
            <Utensils className="h-10 w-10 text-white/50" />
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent" />

        <div className="absolute right-3 top-3 rounded-full border border-white/50 bg-white/90 px-3 py-2 shadow-sm backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
          <span className="text-xs font-black text-[#123c35]">{score}</span>
          <span className="ml-1 text-[9px] font-bold text-[#6d7974]">match</span>
        </div>

        {food.diet && (
          <span className="absolute bottom-3 left-3 rounded-full bg-[#e8f58d] px-3 py-1.5 text-[9px] font-black capitalize text-[#123c35] shadow-sm">
            {formatLabel(food.diet)}
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {food.cuisine && food.cuisine.length > 0 && (
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#ef713d]">
                {food.cuisine.slice(0, 2).map(formatLabel).join(" • ")}
              </p>
            )}
            <h3 className="mt-1 text-xl font-black leading-tight tracking-[-0.035em] text-[#123c35]">
              {food.name}
            </h3>
          </div>

          {food.rating !== undefined && (
            <div className="flex shrink-0 items-center gap-1 rounded-full bg-[#fff7ed] px-2 py-1">
              <Star className="h-3.5 w-3.5 fill-[#ef713d] text-[#ef713d]" />
              <span className="text-xs font-black text-[#123c35]">{food.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {food.description && (
          <p className="mt-3 line-clamp-3 text-xs leading-5 text-[#6d7974]">{food.description}</p>
        )}

        <div className="mt-4 rounded-[18px] bg-[#f7f3ea] p-3.5 transition-colors duration-300 group-hover:bg-[#f2ede0]">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.13em] text-[#6d7974]">
                Estimated price
              </p>
              <div className="mt-1">
                <PriceDisplay inr={food.priceInr} currency={currency} showInr={true} />
              </div>
            </div>

            <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.08em] text-[#31544d]">
              per person
            </span>
          </div>

          {currency !== "INR" && (
            <p className="mt-2 text-[9px] leading-4 text-[#89938f]">
              Local price in INR · converted to {currency}
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {food.spiceLevel && <MetaPill>🌶️ {formatLabel(food.spiceLevel)}</MetaPill>}
          {food.diet && <MetaPill>{formatLabel(food.diet)}</MetaPill>}
          {food.cuisine && food.cuisine.length > 0 && <MetaPill>{formatLabel(food.cuisine[0])}</MetaPill>}
        </div>

        {food.restaurantName && (
          <div className="mt-4 flex items-center gap-2 border-t border-[#123c35]/8 pt-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f9dfd0]">
              <MapPin className="h-3.5 w-3.5 text-[#ef713d]" />
            </span>
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#89938f]">
                Available at
              </p>
              <p className="truncate text-xs font-bold text-[#31544d]">{food.restaurantName}</p>
            </div>
          </div>
        )}

        {reasons.length > 0 && (
          <div className="mt-4 rounded-[18px] border border-[#123c35]/5 bg-[#fbfaf5] p-3.5">
            <p className="text-[9px] font-black uppercase tracking-[0.13em] text-[#ef713d]">
              Why FairTrip recommends it
            </p>
            <div className="mt-2.5 space-y-2">
              {reasons.slice(0, 3).map((reason, index) => (
                <div key={`${reason}-${index}`} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#123c35]" />
                  <span className="text-[10px] font-bold leading-4 text-[#31544d]">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function MetaPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f7f3ea] px-3 py-1.5 text-[9px] font-black text-[#31544d] transition-colors duration-200 hover:bg-[#efe9d9]">
      {children}
    </span>
  );
}

function formatLabel(value: string): string {
  return value
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}