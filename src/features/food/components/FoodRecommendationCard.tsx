"use client";

import { MapPin, Navigation } from "lucide-react";
import gsap from "gsap";
import { useEffect, useRef } from "react";

import type {
    FoodRecommendation,
} from "../services/foodRecommendation.service";

interface Props {
    recommendation: FoodRecommendation;
    index?: number;
}

export default function FoodRecommendationCard({
    recommendation,
    index = 0,
}: Props) {
    const { food } = recommendation;
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const card = cardRef.current;

        if (!card) {
            return;
        }

        const ctx = gsap.context(() => {
            gsap.fromTo(
                card,
                { opacity: 0, y: 14 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    delay: index * 0.05,
                    ease: "power3.out",
                },
            );
        }, cardRef);

        return () => {
            ctx.revert();
        };
    }, [index]);

    const distance =
        typeof food.distanceKm === "number"
            ? `${food.distanceKm.toFixed(1)} km`
            : "Distance unavailable";

    return (
        <div
            ref={cardRef}
            className="group rounded-[20px] border border-[#123c35]/10 bg-white px-4 py-4 shadow-[0_6px_20px_rgba(18,60,53,0.045)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#123c35]/15 hover:shadow-[0_12px_28px_rgba(18,60,53,0.08)]"
        >
            <div className="flex min-h-[64px] items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf5d1] transition-transform duration-300 group-hover:scale-105">
                        <MapPin className="h-4 w-4 text-[#123c35]" />
                    </div>

                    <div className="min-w-0">
                        <p className="text-[8px] font-black uppercase tracking-[0.14em] text-[#ef713d]">
                            Nearby place
                        </p>

                        <h3 className="mt-1 truncate text-[15px] font-black tracking-[-0.015em] text-[#123c35]">
                            {food.restaurantName ?? food.name}
                        </h3>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#123c35]/8 bg-[#f7f3ea] px-3 py-2 text-[9px] font-black text-[#31544d]">
                    <Navigation className="h-3 w-3" />
                    <span>{distance}</span>
                </div>
            </div>
        </div>
    );
}
