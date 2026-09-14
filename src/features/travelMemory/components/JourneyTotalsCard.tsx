"use client";

import {
    Clock3,
    Map,
    Route,
    Wallet,
} from "lucide-react";

import type {
    ExtractedTravelContent,
} from "../types/travelMemory.types";


interface JourneyTotalsCardProps {
    result: ExtractedTravelContent;
}


function formatDistance(
    meters?: number,
): string {
    if (
        meters === undefined ||
        !Number.isFinite(meters)
    ) {
        return "—";
    }

    if (meters < 1000) {
        return `${Math.round(meters)} m`;
    }

    return `${(
        meters / 1000
    ).toFixed(
        meters >= 10000 ? 0 : 1,
    )} km`;
}


function formatDuration(
    minutes?: number,
): string {
    if (
        minutes === undefined ||
        !Number.isFinite(minutes)
    ) {
        return "—";
    }

    if (minutes < 60) {
        return `${Math.round(minutes)} min`;
    }

    const hours =
        Math.floor(minutes / 60);

    const remaining =
        Math.round(minutes % 60);

    if (remaining === 0) {
        return `${hours} hr`;
    }

    return `${hours}h ${remaining}m`;
}


function formatMoney(
    amount: number,
): string {
    return `₹${amount.toLocaleString(
        "en-IN",
    )}`;
}


export default function JourneyTotalsCard({
    result,
}: JourneyTotalsCardProps) {
    const totals =
        result.totals;


    const stats = [
        {
            icon: Map,
            label: "Known distance",
            value:
                formatDistance(
                    totals.knownDistanceMeters,
                ),
            note:
                totals.distanceStatus ===
                "calculated"
                    ? "From stated route data"
                    : totals.distanceStatus ===
                        "partially-known"
                      ? "Partially available"
                      : "Not stated",
        },

        {
            icon: Clock3,
            label: "Known travel time",
            value:
                formatDuration(
                    totals.knownDurationMinutes,
                ),
            note:
                totals.durationStatus ===
                "calculated"
                    ? "From stated route data"
                    : totals.durationStatus ===
                        "partially-known"
                      ? "Partially available"
                      : "Not stated",
        },

        {
            icon: Route,
            label: "Routes",
            value:
                String(
                    totals.routeCount,
                ),
            note:
                "Journey segments found",
        },

        {
            icon: Wallet,
            label: "Known spend",
            value:
                formatMoney(
                    totals.totalKnownSpend,
                ),
            note:
                "Only explicitly mentioned costs",
        },
    ];


    return (
        <section
            data-journey-totals
            className="
                mt-5
                overflow-hidden
                rounded-[28px]
                border
                border-[#123c35]/10
                bg-[#eef4d7]
                p-5
                sm:p-6
            "
        >
            <div
                className="
                    flex
                    flex-col
                    gap-2
                    sm:flex-row
                    sm:items-end
                    sm:justify-between
                "
            >
                <div>
                    <p
                        className="
                            text-[9px]
                            font-black
                            uppercase
                            tracking-[0.18em]
                            text-[#ef713d]
                        "
                    >
                        Journey calculation
                    </p>

                    <h3
                        className="
                            mt-1
                            text-xl
                            font-black
                            tracking-[-0.04em]
                            text-[#123c35]
                        "
                    >
                        What we know about this trip
                    </h3>
                </div>

                <p
                    className="
                        max-w-sm
                        text-[9px]
                        leading-5
                        text-[#64715d]
                    "
                >
                    FairTrip calculates totals only from
                    evidence found in the source. Unknown
                    distances and fares are never guessed.
                </p>
            </div>


            <div
                className="
                    mt-5
                    grid
                    grid-cols-2
                    gap-2
                    lg:grid-cols-4
                "
            >
                {stats.map(
                    ({
                        icon: Icon,
                        label,
                        value,
                        note,
                    }) => (
                        <div
                            key={label}
                            className="
                                rounded-[20px]
                                border
                                border-[#123c35]/8
                                bg-white
                                p-4
                            "
                        >
                            <Icon
                                className="
                                    h-4
                                    w-4
                                    text-[#ef713d]
                                "
                            />

                            <p
                                className="
                                    mt-4
                                    text-lg
                                    font-black
                                    tracking-[-0.04em]
                                    text-[#123c35]
                                "
                            >
                                {value}
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-[8px]
                                    font-black
                                    uppercase
                                    tracking-[0.12em]
                                    text-[#7c8880]
                                "
                            >
                                {label}
                            </p>

                            <p
                                className="
                                    mt-2
                                    text-[9px]
                                    leading-4
                                    text-[#9aa39f]
                                "
                            >
                                {note}
                            </p>
                        </div>
                    ),
                )}
            </div>


            <div
                className="
                    mt-3
                    grid
                    gap-2
                    sm:grid-cols-3
                "
            >
                <div
                    className="
                        rounded-[18px]
                        bg-white/70
                        p-3
                    "
                >
                    <p
                        className="
                            text-[8px]
                            font-black
                            uppercase
                            tracking-[0.12em]
                            text-[#87927f]
                        "
                    >
                        Transport
                    </p>

                    <p
                        className="
                            mt-1
                            text-sm
                            font-black
                            text-[#123c35]
                        "
                    >
                        {formatMoney(
                            totals.transportSpend,
                        )}
                    </p>
                </div>


                <div
                    className="
                        rounded-[18px]
                        bg-white/70
                        p-3
                    "
                >
                    <p
                        className="
                            text-[8px]
                            font-black
                            uppercase
                            tracking-[0.12em]
                            text-[#87927f]
                        "
                    >
                        Other expenses
                    </p>

                    <p
                        className="
                            mt-1
                            text-sm
                            font-black
                            text-[#123c35]
                        "
                    >
                        {formatMoney(
                            totals.otherSpend,
                        )}
                    </p>
                </div>


                <div
                    className="
                        rounded-[18px]
                        bg-[#123c35]
                        p-3
                        text-white
                    "
                >
                    <p
                        className="
                            text-[8px]
                            font-black
                            uppercase
                            tracking-[0.12em]
                            text-white/45
                        "
                    >
                        Total known
                    </p>

                    <p
                        className="
                            mt-1
                            text-sm
                            font-black
                        "
                    >
                        {formatMoney(
                            totals.totalKnownSpend,
                        )}
                    </p>
                </div>
            </div>
        </section>
    );
}