"use client";

import gsap from "gsap";
import {
    ArrowDown,
    ArrowRight,
    BusFront,
    CarFront,
    Check,
    Clock3,
    Footprints,
    MapPin,
    Route,
    TrainFront,
    WalletCards,
    Waves,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import type { JourneyDetail } from "../types/travelMemory.types";

interface JourneyMapProps {
    journey: JourneyDetail;
    mode?: "journey" | "profile";
    className?: string;
}

function formatDistance(value?: number) {
    if (!value || value <= 0) {
        return "";
    }

    if (value < 1000) {
        return `${Math.round(value)} m`;
    }

    return `${(value / 1000).toFixed(1)} km`;
}

function formatDuration(value?: number) {
    if (!value || value <= 0) {
        return "";
    }

    const minutes = Math.round(value);

    if (minutes < 60) {
        return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;

    return remaining > 0
        ? `${hours}h ${remaining}m`
        : `${hours}h`;
}

function getTransportLabel(
    mode: JourneyDetail["routes"][number]["transportMode"],
) {
    switch (mode) {
        case "walk":
            return "Walk";
        case "bus":
            return "Bus";
        case "train":
            return "Train";
        case "metro":
            return "Metro";
        case "shared-auto":
            return "Shared auto";
        case "meter-auto":
            return "Meter auto";
        case "taxi":
            return "Taxi";
        case "app-taxi":
            return "App taxi";
        case "ferry":
            return "Ferry";
        case "flight":
            return "Flight";
        case "other":
            return "Travel";
        case "unknown":
        default:
            return "Transport";
    }
}

function TransportIcon({
    mode,
}: {
    mode: JourneyDetail["routes"][number]["transportMode"];
}) {
    switch (mode) {
        case "walk":
            return <Footprints className="h-3.5 w-3.5" />;
        case "bus":
            return <BusFront className="h-3.5 w-3.5" />;
        case "train":
        case "metro":
            return <TrainFront className="h-3.5 w-3.5" />;
        case "taxi":
        case "app-taxi":
        case "shared-auto":
        case "meter-auto":
            return <CarFront className="h-3.5 w-3.5" />;
        case "ferry":
            return <Waves className="h-3.5 w-3.5" />;
        default:
            return <ArrowRight className="h-3.5 w-3.5" />;
    }
}

export default function JourneyMap({
    journey,
    mode = "journey",
    className = "",
}: JourneyMapProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const [openIndex, setOpenIndex] =
        useState<number | null>(null);

    const places = useMemo(
        () =>
            [...journey.places].sort(
                (a, b) => a.sequence - b.sequence,
            ),
        [journey.places],
    );

    const routes = useMemo(
        () =>
            [...journey.routes].sort(
                (a, b) => a.sequence - b.sequence,
            ),
        [journey.routes],
    );

    const totalDistance = useMemo(
        () =>
            routes.reduce(
                (total, route) =>
                    total + (route.distanceMeters ?? 0),
                0,
            ),
        [routes],
    );

    const totalDuration = useMemo(
        () =>
            routes.reduce(
                (total, route) =>
                    total + (route.durationMinutes ?? 0),
                0,
            ),
        [routes],
    );

    const compact = mode === "profile";

    useEffect(() => {
        if (!rootRef.current) {
            return;
        }

        const ctx = gsap.context(() => {
            gsap.fromTo(
                "[data-roadmap-header]",
                {
                    opacity: 0,
                    y: 14,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power3.out",
                },
            );

            gsap.fromTo(
                "[data-roadmap-stat]",
                {
                    opacity: 0,
                    y: 10,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    stagger: 0.06,
                    delay: 0.08,
                    ease: "power3.out",
                },
            );

            gsap.fromTo(
                "[data-roadmap-stop]",
                {
                    opacity: 0,
                    x: -12,
                },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.4,
                    stagger: 0.07,
                    delay: 0.12,
                    ease: "power3.out",
                },
            );
        }, rootRef);

        return () => {
            ctx.revert();
        };
    }, [journey.id]);

    return (
        <section
            ref={rootRef}
            className={[
                "overflow-hidden rounded-[30px] border border-[#123c35]/10 bg-white shadow-[0_20px_70px_rgba(18,60,53,0.08)]",
                className,
            ].join(" ")}
        >
            <div
                data-roadmap-header
                className="border-b border-[#123c35]/8 p-5 sm:p-7"
            >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f58d] px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.15em] text-[#123c35]">
                                <Route className="h-3 w-3" />
                                {compact
                                    ? "Journey memory"
                                    : "Journey roadmap"}
                            </span>

                            <span className="rounded-full bg-[#f7f3ea] px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.12em] text-[#6e7a75]">
                                {journey.status}
                            </span>
                        </div>

                        <h2 className="mt-3 text-xl font-black tracking-[-0.045em] text-[#123c35] sm:text-2xl">
                            {journey.name}
                        </h2>

                        <p className="mt-1 max-w-xl text-[10px] leading-5 text-[#88938e]">
                            A simple timeline of the places,
                            movement and spending FairTrip
                            found in your saved travel content.
                        </p>
                    </div>

                    {!compact && (
                        <div className="rounded-[18px] bg-[#123c35] px-4 py-3">
                            <p className="text-[7px] font-black uppercase tracking-[0.14em] text-[#cbe95b]">
                                Private memory
                            </p>
                            <p className="mt-1 text-[9px] font-bold text-white/55">
                                Stored in your journey.
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <div
                        data-roadmap-stat
                        className="rounded-[18px] border border-[#123c35]/8 bg-[#fbfaf5] p-3.5"
                    >
                        <MapPin className="h-4 w-4 text-[#ef713d]" />
                        <p className="mt-3 text-sm font-black text-[#123c35]">
                            {places.length}
                        </p>
                        <p className="mt-1 text-[7px] font-black uppercase tracking-[0.12em] text-[#8b9691]">
                            Stops
                        </p>
                    </div>

                    <div
                        data-roadmap-stat
                        className="rounded-[18px] border border-[#123c35]/8 bg-[#fbfaf5] p-3.5"
                    >
                        <Route className="h-4 w-4 text-[#ef713d]" />
                        <p className="mt-3 text-sm font-black text-[#123c35]">
                            {routes.length}
                        </p>
                        <p className="mt-1 text-[7px] font-black uppercase tracking-[0.12em] text-[#8b9691]">
                            Routes
                        </p>
                    </div>

                    <div
                        data-roadmap-stat
                        className="rounded-[18px] border border-[#123c35]/8 bg-[#fbfaf5] p-3.5"
                    >
                        <Clock3 className="h-4 w-4 text-[#ef713d]" />
                        <p className="mt-3 text-sm font-black text-[#123c35]">
                            {formatDuration(
                                totalDuration,
                            ) || "—"}
                        </p>
                        <p className="mt-1 text-[7px] font-black uppercase tracking-[0.12em] text-[#8b9691]">
                            Travel time
                        </p>
                    </div>

                    <div
                        data-roadmap-stat
                        className="rounded-[18px] border border-[#123c35]/8 bg-[#fbfaf5] p-3.5"
                    >
                        <WalletCards className="h-4 w-4 text-[#ef713d]" />
                        <p className="mt-3 text-sm font-black text-[#123c35]">
                            ₹
                            {journey.totalKnownSpendInr.toLocaleString(
                                "en-IN",
                            )}
                        </p>
                        <p className="mt-1 text-[7px] font-black uppercase tracking-[0.12em] text-[#8b9691]">
                            Known spend
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-[#fbfaf5] px-4 py-6 sm:px-7 sm:py-8">
                {places.length === 0 ? (
                    <div className="rounded-[24px] border border-[#123c35]/8 bg-white p-8 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f58d] text-[#123c35]">
                            <MapPin className="h-5 w-5" />
                        </div>

                        <h3 className="mt-4 text-sm font-black text-[#123c35]">
                            Your journey roadmap is empty
                        </h3>

                        <p className="mx-auto mt-2 max-w-sm text-[10px] leading-5 text-[#7d8984]">
                            Analyze and save a travel source to
                            build the sequence of places here.
                        </p>
                    </div>
                ) : (
                    <div className="mx-auto max-w-3xl">
                        <div className="relative">
                            <div className="absolute bottom-9 left-[17px] top-9 w-px border-l border-dashed border-[#123c35]/15 sm:left-[20px]" />

                            {places.map(
                                (place, index) => {
                                    const route =
                                        routes.find(
                                            (item) =>
                                                item.sequence ===
                                                place.sequence,
                                        ) ??
                                        routes[index];

                                    const isOpen =
                                        openIndex === index;

                                    const nextPlace =
                                        places[index + 1];

                                    return (
                                        <div
                                            key={place.id}
                                            data-roadmap-stop
                                            className="relative"
                                        >
                                            <div className="flex gap-4 sm:gap-5">
                                                <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[3px] border-[#fbfaf5] bg-[#123c35] text-[9px] font-black text-white shadow-[0_6px_18px_rgba(18,60,53,0.18)] sm:h-10 sm:w-10">
                                                    {index + 1}
                                                </div>

                                                <div className="min-w-0 flex-1 pb-3">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setOpenIndex(
                                                                isOpen
                                                                    ? null
                                                                    : index,
                                                            )
                                                        }
                                                        className={[
                                                            "w-full rounded-[22px] border p-4 text-left transition-all duration-200 sm:p-5",
                                                            isOpen
                                                                ? "border-[#123c35]/15 bg-white shadow-[0_12px_35px_rgba(18,60,53,0.07)]"
                                                                : "border-[#123c35]/7 bg-white hover:-translate-y-0.5 hover:border-[#123c35]/12 hover:shadow-[0_10px_28px_rgba(18,60,53,0.05)]",
                                                        ].join(
                                                            " ",
                                                        )}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <span className="text-[7px] font-black uppercase tracking-[0.15em] text-[#ef713d]">
                                                                        Stop{" "}
                                                                        {index + 1}
                                                                    </span>

                                                                    {index ===
                                                                        0 && (
                                                                        <span className="rounded-full bg-[#e8f58d] px-2 py-1 text-[7px] font-black uppercase tracking-[0.1em] text-[#123c35]">
                                                                            Start
                                                                        </span>
                                                                    )}

                                                                    {index ===
                                                                        places.length -
                                                                            1 && (
                                                                        <span className="rounded-full bg-[#123c35] px-2 py-1 text-[7px] font-black uppercase tracking-[0.1em] text-white">
                                                                            End
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <h3 className="mt-1 truncate text-sm font-black tracking-[-0.025em] text-[#123c35] sm:text-base">
                                                                    {
                                                                        place.name
                                                                    }
                                                                </h3>

                                                                <p className="mt-1 truncate text-[9px] text-[#89958f]">
                                                                    {place.city ??
                                                                        place.state ??
                                                                        place.country ??
                                                                        "Travel stop"}
                                                                </p>
                                                            </div>

                                                            <span
                                                                className={[
                                                                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f7f3ea] text-[#123c35] transition-transform",
                                                                    isOpen
                                                                        ? "rotate-180"
                                                                        : "",
                                                                ].join(
                                                                    " ",
                                                                )}
                                                            >
                                                                <ArrowDown className="h-4 w-4" />
                                                            </span>
                                                        </div>

                                                        <div className="mt-3 flex flex-wrap items-center gap-2">
                                                            {route && (
                                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef4d7] px-2.5 py-1.5 text-[7px] font-black uppercase tracking-[0.1em] text-[#123c35]">
                                                                    <TransportIcon
                                                                        mode={
                                                                            route.transportMode
                                                                        }
                                                                    />
                                                                    {getTransportLabel(
                                                                        route.transportMode,
                                                                    )}
                                                                </span>
                                                            )}

                                                            {route?.distanceMeters ? (
                                                                <span className="text-[8px] font-bold text-[#8a9691]">
                                                                    {formatDistance(
                                                                        route.distanceMeters,
                                                                    )}
                                                                </span>
                                                            ) : null}

                                                            {route?.durationMinutes ? (
                                                                <span className="text-[8px] font-bold text-[#8a9691]">
                                                                    {formatDuration(
                                                                        route.durationMinutes,
                                                                    )}
                                                                </span>
                                                            ) : null}

                                                            {route?.amountPaidInr !==
                                                            undefined ? (
                                                                <span className="text-[8px] font-black text-[#123c35]">
                                                                    ₹
                                                                    {route.amountPaidInr.toLocaleString(
                                                                        "en-IN",
                                                                    )}
                                                                </span>
                                                            ) : null}

                                                            <span className="ml-auto text-[8px] font-black text-[#123c35]/35">
                                                                {isOpen
                                                                    ? "Hide"
                                                                    : "Details"}
                                                            </span>
                                                        </div>
                                                    </button>

                                                    {isOpen && (
                                                        <div className="mt-2 rounded-[20px] border border-[#123c35]/8 bg-white p-4 sm:p-5">
                                                            <div className="grid gap-2 sm:grid-cols-2">
                                                                <div className="rounded-[16px] bg-[#fbfaf5] p-3">
                                                                    <p className="text-[7px] font-black uppercase tracking-[0.13em] text-[#8b9691]">
                                                                        Place
                                                                    </p>

                                                                    <p className="mt-1 text-[10px] font-black text-[#123c35]">
                                                                        {
                                                                            place.name
                                                                        }
                                                                    </p>

                                                                    {place.address && (
                                                                        <p className="mt-1 text-[8px] leading-4 text-[#7d8984]">
                                                                            {
                                                                                place.address
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                <div className="rounded-[16px] bg-[#fbfaf5] p-3">
                                                                    <p className="text-[7px] font-black uppercase tracking-[0.13em] text-[#8b9691]">
                                                                        Extraction
                                                                        confidence
                                                                    </p>

                                                                    <p className="mt-1 text-[10px] font-black text-[#123c35]">
                                                                        {Math.round(
                                                                            place.confidence *
                                                                                100,
                                                                        )}
                                                                        %
                                                                    </p>

                                                                    <p className="mt-1 text-[8px] leading-4 text-[#7d8984]">
                                                                        Based on
                                                                        FairTrip's
                                                                        extracted
                                                                        travel
                                                                        content.
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {route && (
                                                                <div className="mt-2 rounded-[16px] bg-[#123c35] p-4 text-white">
                                                                    <p className="text-[7px] font-black uppercase tracking-[0.13em] text-[#cbe95b]">
                                                                        Route
                                                                    </p>

                                                                    <div className="mt-2 flex items-center gap-2">
                                                                        <span className="min-w-0 flex-1 truncate text-[10px] font-black">
                                                                            {
                                                                                route.fromName
                                                                            }
                                                                        </span>

                                                                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#ef713d]" />

                                                                        <span className="min-w-0 flex-1 truncate text-right text-[10px] font-black">
                                                                            {
                                                                                route.toName
                                                                            }
                                                                        </span>
                                                                    </div>

                                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                                        <span className="rounded-full bg-white/10 px-2.5 py-1.5 text-[7px] font-black text-white/70">
                                                                            {getTransportLabel(
                                                                                route.transportMode,
                                                                            )}
                                                                        </span>

                                                                        {route.distanceMeters ? (
                                                                            <span className="rounded-full bg-white/10 px-2.5 py-1.5 text-[7px] font-black text-white/60">
                                                                                {formatDistance(
                                                                                    route.distanceMeters,
                                                                                )}
                                                                            </span>
                                                                        ) : null}

                                                                        {route.durationMinutes ? (
                                                                            <span className="rounded-full bg-white/10 px-2.5 py-1.5 text-[7px] font-black text-white/60">
                                                                                {formatDuration(
                                                                                    route.durationMinutes,
                                                                                )}
                                                                            </span>
                                                                        ) : null}

                                                                        {route.amountPaidInr !==
                                                                        undefined ? (
                                                                            <span className="ml-auto rounded-full bg-[#e8f58d] px-2.5 py-1.5 text-[7px] font-black text-[#123c35]">
                                                                                Paid ₹
                                                                                {route.amountPaidInr.toLocaleString(
                                                                                    "en-IN",
                                                                                )}
                                                                            </span>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {nextPlace && route && (
                                                        <div className="flex items-center gap-2 px-2 py-2">
                                                            <div className="flex-1 border-t border-dashed border-[#123c35]/10" />

                                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f7f3ea] px-2.5 py-1.5 text-[7px] font-black uppercase tracking-[0.09em] text-[#7d8984]">
                                                                <TransportIcon
                                                                    mode={
                                                                        route.transportMode
                                                                    }
                                                                />
                                                                {
                                                                    getTransportLabel(
                                                                        route.transportMode,
                                                                    )
                                                                }
                                                            </span>

                                                            <ArrowDown className="h-3 w-3 text-[#ef713d]" />

                                                            <div className="flex-1 border-t border-dashed border-[#123c35]/10" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="border-t border-[#123c35]/8 bg-white px-5 py-4 sm:px-7">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e8f58d] text-[#123c35]">
                            <Check className="h-3.5 w-3.5" />
                        </div>

                        <p className="text-[9px] leading-5 text-[#7e8a85]">
                            This roadmap is your private travel
                            memory, not a live location tracker.
                        </p>
                    </div>

                    {totalDistance > 0 && (
                        <span className="rounded-full bg-[#eef4d7] px-3 py-1.5 text-[8px] font-black text-[#123c35]">
                            {formatDistance(
                                totalDistance,
                            )}{" "}
                            known distance
                        </span>
                    )}
                </div>
            </div>
        </section>
    );
}
