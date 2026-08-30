"use client";

import { CheckCircle2, ExternalLink, MapPin, Star, Utensils } from "lucide-react";
import type { ReactNode } from "react";
import type { FoodRecommendation } from "../services/foodRecommendation.service";

interface FoodRecommendationCardProps {
    recommendation: FoodRecommendation;
}

export default function FoodRecommendationCard({ recommendation }: FoodRecommendationCardProps) {
    const { food, score, reasons } = recommendation;

    return (
        <article className="group overflow-hidden rounded-[26px] border border-[#123c35]/10 bg-white shadow-[0_10px_35px_rgba(18,60,53,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(18,60,53,0.10)]">
            <div className="relative h-52 overflow-hidden bg-[#dfe9df]">
                {food.imageUrl ? (
                    <img
                        src={food.imageUrl}
                        alt={food.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_20%_20%,rgba(232,245,141,0.45),transparent_30%),linear-gradient(135deg,#06483f,#2d7768)]">
                        <Utensils className="h-10 w-10 text-white/50" />
                    </div>
                )}

                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 to-transparent" />

                <div className="absolute left-4 top-4 rounded-full bg-[#123c35] px-3 py-2 text-[10px] font-black text-white">
                    {food.distanceKm !== undefined ? `${food.distanceKm.toFixed(1)} km` : "Nearby"}
                </div>

                <div className="absolute right-4 top-4 rounded-full border border-white/30 bg-white/90 px-3 py-2">
                    <span className="text-xs font-black text-[#123c35]">{score}</span>
                    <span className="ml-1 text-[9px] font-bold text-[#6d7974]">match</span>
                </div>

                {food.diet && (
                    <div className="absolute bottom-4 left-4">
                        <span className="rounded-full bg-[#e8f58d] px-3 py-1.5 text-[9px] font-black capitalize text-[#123c35]">
                            {food.diet}
                        </span>
                    </div>
                )}
            </div>

            <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        {food.cuisine.length > 0 && (
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

                {food.restaurantName && (
                    <div className="mt-4 rounded-[18px] bg-[#f7f3ea] p-4">
                        <div className="flex items-start gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e8f58d]">
                                <MapPin className="h-4 w-4 text-[#123c35]" />
                            </span>

                            <div className="min-w-0">
                                <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#89938f]">
                                    Nearby place
                                </p>
                                <p className="mt-1 text-sm font-black text-[#123c35]">{food.restaurantName}</p>

                                {food.description && (
                                    <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-[#6d7974]">
                                        {food.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                    {food.priceRange && (
                        <MetaPill>
                            {food.priceRange}
                            {food.priceRangeEstimated ? " (estimated)" : ""}
                        </MetaPill>
                    )}

                    {food.spiceLevel && <MetaPill>🌶️ {formatLabel(food.spiceLevel)}</MetaPill>}

                    <MetaPill>
                        📍 {food.distanceKm !== undefined ? `${food.distanceKm.toFixed(1)} km` : "Nearby"}
                    </MetaPill>

                    {food.cuisine[0] && <MetaPill>{formatLabel(food.cuisine[0])}</MetaPill>}
                </div>

                {reasons.length > 0 && (
                    <div className="mt-4 rounded-[18px] border border-[#123c35]/5 bg-[#fbfaf5] p-4">
                        <p className="text-[9px] font-black uppercase tracking-[0.13em] text-[#ef713d]">
                            Why FairTrip recommends it
                        </p>

                        <div className="mt-2.5 space-y-2">
                            {reasons.slice(0, 4).map((reason, index) => (
                                <div key={`${reason}-${index}`} className="flex items-start gap-2">
                                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#123c35]" />
                                    <span className="text-[10px] font-bold leading-4 text-[#31544d]">{reason}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {food.mapUrl && (
                    <a
                        href={food.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#123c35] px-5 text-xs font-black text-white transition hover:bg-[#0d312b]"
                    >
                        View nearby place
                        <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                )}
            </div>
        </article>
    );
}

function MetaPill({ children }: { children: ReactNode }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f7f3ea] px-3 py-1.5 text-[9px] font-black text-[#31544d]">
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