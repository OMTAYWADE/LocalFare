"use client";

import {
    ArrowRight,
    Clock3,
    Heart,
    MapPin,
    ShieldCheck,
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
    const priceLabel = getPriceLabel(place.priceLevel);

    return (
        <article
            className="
                group
                overflow-hidden
                rounded-[26px]
                border
                border-[#123c35]/8
                bg-white
                shadow-[0_10px_35px_rgba(18,60,53,0.055)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_22px_55px_rgba(18,60,53,0.11)]
            "
        >
            {/* =====================================================
                IMAGE
            ====================================================== */}

            <div
                className="
                    relative
                    h-[175px]
                    overflow-hidden
                    bg-[#06483f]
                    sm:h-[190px]
                "
            >
                {place.imageUrl ? (
                    <img
                        src={place.imageUrl}
                        alt={place.name}
                        loading="lazy"
                        className="
                            h-full
                            w-full
                            object-cover
                            transition-transform
                            duration-700
                            group-hover:scale-[1.06]
                        "
                    />
                ) : (
                    <div
                        className="
                            h-full
                            w-full
                            bg-[radial-gradient(circle_at_20%_20%,rgba(232,245,141,0.55),transparent_25%),radial-gradient(circle_at_80%_70%,rgba(239,113,61,0.45),transparent_35%),linear-gradient(135deg,#06483f,#236d5e)]
                        "
                    />
                )}

                {/* Image overlay */}

                <div
                    className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/65
                        via-black/5
                        to-transparent
                    "
                />

                {/* Distance */}

                {place.distanceKm !== undefined && (
                    <span
                        className="
                            absolute
                            left-3
                            top-3
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-full
                            border
                            border-white/15
                            bg-[#06483f]/90
                            px-2.5
                            py-1.5
                            text-[9px]
                            font-black
                            text-white
                            shadow-lg
                            backdrop-blur-md
                        "
                    >
                        <MapPin className="h-3 w-3 text-[#e8f58d]" />

                        {place.distanceKm.toFixed(1)} km
                    </span>
                )}

                {/* Save */}

                <button
                    type="button"
                    aria-label={`Save ${place.name}`}
                    className="
                        absolute
                        right-3
                        top-3
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/20
                        bg-black/25
                        text-white
                        backdrop-blur-md
                        transition-all
                        duration-200
                        hover:scale-105
                        hover:bg-white
                        hover:text-[#ef713d]
                        focus:outline-none
                        focus:ring-2
                        focus:ring-[#e8f58d]
                    "
                >
                    <Heart className="h-4 w-4" />
                </button>

                {/* Bottom information */}

                <div
                    className="
                        absolute
                        inset-x-3
                        bottom-3
                        flex
                        items-end
                        justify-between
                        gap-3
                    "
                >
                    {/* Category */}

                    <span
                        className="
                            rounded-full
                            bg-[#06483f]/90
                            px-2.5
                            py-1.5
                            text-[8px]
                            font-black
                            uppercase
                            tracking-[0.12em]
                            text-[#e8f58d]
                            backdrop-blur-md
                        "
                    >
                        {formatCategory(place.category)}
                    </span>

                    {/* Rating */}

                    {place.rating !== undefined && (
                        <div
                            className="
                                flex
                                items-center
                                gap-1
                                rounded-full
                                bg-white/90
                                px-2.5
                                py-1.5
                                backdrop-blur-md
                            "
                        >
                            <Star
                                className="
                                    h-3.5
                                    w-3.5
                                    fill-[#ff9f1c]
                                    text-[#ff9f1c]
                                "
                            />

                            <span
                                className="
                                    text-[10px]
                                    font-black
                                    text-[#123c35]
                                "
                            >
                                {place.rating.toFixed(1)}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* =====================================================
                CONTENT
            ====================================================== */}

            <div className="p-4 sm:p-5">
                {/* Name */}

                <div className="flex items-start justify-between gap-3">
                    <h3
                        className="
                            min-w-0
                            flex-1
                            text-[17px]
                            font-black
                            leading-[1.15]
                            tracking-[-0.04em]
                            text-[#123c35]
                            sm:text-[18px]
                        "
                    >
                        {place.name}
                    </h3>
                </div>

                {/* Address */}

                {place.address && (
                    <p
                        className="
                            mt-2
                            line-clamp-2
                            text-[10px]
                            leading-4
                            text-[#71817b]
                        "
                    >
                        {place.address}
                    </p>
                )}

                {/* =================================================
                    QUICK INFO
                ================================================== */}

                <div
                    className="
                        mt-4
                        flex
                        flex-wrap
                        items-center
                        gap-2
                    "
                >
                    {/* Travel time */}

                    {place.durationMinutes !== undefined && (
                        <InfoPill
                            icon={
                                <Clock3
                                    className="
                                        h-3.5
                                        w-3.5
                                    "
                                />
                            }
                            text={`${place.durationMinutes} min`}
                            className="text-[#ef713d]"
                        />
                    )}

                    {/* Distance */}

                    {place.distanceKm !== undefined && (
                        <InfoPill
                            icon={
                                <MapPin
                                    className="
                                        h-3.5
                                        w-3.5
                                    "
                                />
                            }
                            text={`${place.distanceKm.toFixed(1)} km`}
                            className="text-[#5c9b72]"
                        />
                    )}

                    {/* Price signal */}

                    {priceLabel && (
                        <InfoPill
                            icon={
                                <span className="text-[11px] font-black">
                                    ₹
                                </span>
                            }
                            text={priceLabel}
                            className="text-[#245d78]"
                        />
                    )}
                </div>

                {/* =================================================
                    FAIRTRIP TRUST MESSAGE
                ================================================== */}

                <div
                    className="
                        mt-4
                        flex
                        items-center
                        gap-2.5
                        rounded-[16px]
                        border
                        border-[#e8f58d]/70
                        bg-[#f5f8dd]
                        px-3
                        py-2.5
                    "
                >
                    <span
                        className="
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-[#e8f58d]
                            text-[#123c35]
                        "
                    >
                        <ShieldCheck
                            className="h-3.5 w-3.5"
                        />
                    </span>

                    <div className="min-w-0">
                        <p
                            className="
                                text-[9px]
                                font-black
                                uppercase
                                tracking-[0.12em]
                                text-[#123c35]
                            "
                        >
                            FairTrip check
                        </p>

                        <p
                            className="
                                mt-0.5
                                text-[9px]
                                leading-4
                                text-[#64736e]
                            "
                        >
                            Compare travel cost before you go.
                        </p>
                    </div>
                </div>

                {/* =================================================
                    ACTION
                ================================================== */}

                <button
                    type="button"
                    onClick={onPlan}
                    className="
                        group/button
                        mt-4
                        flex
                        min-h-11
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-full
                        bg-[#123c35]
                        px-4
                        py-3
                        text-[10px]
                        font-black
                        text-white
                        shadow-[0_8px_20px_rgba(18,60,53,0.12)]
                        transition-all
                        duration-200
                        hover:bg-[#075348]
                        hover:shadow-[0_12px_25px_rgba(18,60,53,0.18)]
                        focus:outline-none
                        focus:ring-2
                        focus:ring-[#123c35]
                        focus:ring-offset-2
                    "
                >
                    Compare travel cost

                    <ArrowRight
                        className="
                            h-3.5
                            w-3.5
                            transition-transform
                            duration-200
                            group-hover/button:translate-x-1
                        "
                    />
                </button>
            </div>
        </article>
    );
}

/* ================================================================
   INFO PILL
================================================================ */

function InfoPill({
    icon,
    text,
    className = "",
}: {
    icon: React.ReactNode;
    text: string;
    className?: string;
}) {
    return (
        <span
            className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                border-[#123c35]/8
                bg-[#f7f8f3]
                px-2.5
                py-1.5
                text-[9px]
                font-bold
                text-[#526761]
            "
        >
            <span className={className}>
                {icon}
            </span>

            {text}
        </span>
    );
}

/* ================================================================
   PRICE LEVEL
================================================================ */

function getPriceLabel(
    priceLevel?: string,
): string | null {
    if (!priceLevel) {
        return null;
    }

    switch (priceLevel) {
        case "PRICE_LEVEL_FREE":
            return "Free";

        case "PRICE_LEVEL_INEXPENSIVE":
            return "Budget";

        case "PRICE_LEVEL_MODERATE":
            return "Moderate";

        case "PRICE_LEVEL_EXPENSIVE":
            return "Expensive";

        case "PRICE_LEVEL_VERY_EXPENSIVE":
            return "Premium";

        default:
            return null;
    }
}

/* ================================================================
   CATEGORY
================================================================ */

function formatCategory(category: string): string {
    if (!category) {
        return "Place";
    }

    return category
        .replaceAll("_", " ")
        .replace(
            /\b\w/g,
            (letter) => letter.toUpperCase(),
        );
}