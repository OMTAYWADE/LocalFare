"use client";

import {
    BusFront,
    CarFront,
    ChevronRight,
    ExternalLink,
    Gauge,
    MapPin,
    Navigation,
    ShieldCheck,
    Users,
    WalletCards,
} from "lucide-react";

import {
    useMemo,
    useState,
} from "react";

import type {
    FareResult,
    LocalTransportMode,
} from "../types/localTransport.types";

const OPTIONS: {
    mode: LocalTransportMode;
    title: string;
    description: string;
    icon: typeof CarFront;
}[] = [
        {
            mode: "meter-auto",
            title: "Meter Auto",
            description:
                "Best choice when you want the fare calculated by the meter.",
            icon: CarFront,
        },
        {
            mode: "shared-auto",
            title: "Shared Auto",
            description:
                "Useful for short local routes, but fares can vary by route.",
            icon: Users,
        },
        {
            mode: "meter-taxi",
            title: "Meter Taxi",
            description:
                "Black-and-yellow taxi with a regulated meter tariff.",
            icon: Gauge,
        },
        {
            mode: "app-taxi",
            title: "App Taxi",
            description:
                "Check the live price in the booking app before confirming.",
            icon: Navigation,
        },
        {
            mode: "bus",
            title: "Bus",
            description:
                "Find the stop, route and live bus information.",
            icon: BusFront,
        },
    ];

export default function LocalTransport() {
    const [selectedMode, setSelectedMode] =
        useState<LocalTransportMode>(
            "meter-auto",
        );

    const [city, setCity] =
        useState("Mumbai");

    const [distance, setDistance] =
        useState("");

    const [fare, setFare] =
        useState<FareResult | null>(null);

    const [loading, setLoading] =
        useState(false);

    const selectedOption =
        useMemo(
            () =>
                OPTIONS.find(
                    (option) =>
                        option.mode ===
                        selectedMode,
                ),
            [selectedMode],
        );

    async function calculateFare() {
        setLoading(true);

        try {
            const response =
                await fetch(
                    "/api/transport/fare",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            mode:
                                selectedMode,

                            city,

                            distanceKm:
                                distance
                                    ? Number(
                                        distance,
                                    )
                                    : undefined,
                        }),
                    },
                );

            const data =
                (await response.json()) as FareResult;

            setFare(data);
        } catch {
            setFare({
                confidence:
                    "unavailable",

                sourceType:
                    "local-guidance",

                currency: "INR",

                title:
                    "Fare could not be checked",

                message:
                    "FairTrip could not retrieve the fare right now. Ask a local or check the official tariff before travelling.",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#f5f1e8] text-[#123c35]">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <section className="mb-8">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#123c35]/10 bg-white/70 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#ef713d]">
                        <WalletCards className="h-3.5 w-3.5" />
                        Fair Fare
                    </div>

                    <h1 className="max-w-3xl text-4xl font-black tracking-[-0.055em] sm:text-5xl">
                        Travel locally
                        <span className="text-[#ef713d]">
                            {" "}
                            without guessing.
                        </span>
                    </h1>

                    <p className="mt-4 max-w-2xl text-sm leading-6 text-[#66736e] sm:text-base">
                        Choose your local transport.
                        FairTrip shows a verified fare
                        when reliable tariff data exists
                        — and tells you what to ask a local
                        when it doesn't.
                    </p>
                </section>

                {/* Main card */}
                <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    {/* Transport choices */}
                    <div className="rounded-[30px] border border-[#123c35]/10 bg-[#fffdf8] p-5 shadow-[0_20px_70px_rgba(18,60,53,0.07)] sm:p-7">
                        <div className="mb-6">
                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#ef713d]">
                                01 / Choose transport
                            </p>

                            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
                                How do you want to travel?
                            </h2>
                        </div>

                        <div className="grid gap-3">
                            {OPTIONS.map(
                                (option) => {
                                    const Icon =
                                        option.icon;

                                    const active =
                                        selectedMode ===
                                        option.mode;

                                    return (
                                        <button
                                            key={
                                                option.mode
                                            }
                                            type="button"
                                            onClick={() => {
                                                setSelectedMode(
                                                    option.mode,
                                                );
                                                setFare(
                                                    null,
                                                );
                                            }}
                                            className={[
                                                "group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition",
                                                active
                                                    ? "border-[#123c35] bg-[#123c35] text-white shadow-[0_12px_30px_rgba(18,60,53,0.16)]"
                                                    : "border-[#123c35]/10 bg-[#f8f5ed] hover:border-[#123c35]/25 hover:bg-white",
                                            ].join(
                                                " ",
                                            )}
                                        >
                                            <span
                                                className={[
                                                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                                                    active
                                                        ? "bg-[#e8f58d] text-[#123c35]"
                                                        : "bg-white text-[#123c35]",
                                                ].join(
                                                    " ",
                                                )}
                                            >
                                                <Icon className="h-5 w-5" />
                                            </span>

                                            <span className="min-w-0 flex-1">
                                                <span className="flex items-center gap-2">
                                                    <span className="font-bold">
                                                        {
                                                            option.title
                                                        }
                                                    </span>

                                                    {option.mode ===
                                                        "meter-auto" && (
                                                            <span className="rounded-full bg-[#e8f58d] px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-[#123c35]">
                                                                Recommended
                                                            </span>
                                                        )}
                                                </span>

                                                <span
                                                    className={[
                                                        "mt-1 block text-xs leading-5",
                                                        active
                                                            ? "text-white/70"
                                                            : "text-[#71807a]",
                                                    ].join(
                                                        " ",
                                                    )}
                                                >
                                                    {
                                                        option.description
                                                    }
                                                </span>
                                            </span>

                                            <ChevronRight
                                                className={[
                                                    "h-5 w-5 transition",
                                                    active
                                                        ? "text-[#e8f58d]"
                                                        : "text-[#9aa39f]",
                                                ].join(
                                                    " ",
                                                )}
                                            />
                                        </button>
                                        
                                    );
                                },
                            )}
                        </div>
                    </div>

                    {/* Fare panel */}
                    <div className="rounded-[30px] border border-[#123c35]/10 bg-[#123c35] p-5 text-white shadow-[0_20px_70px_rgba(18,60,53,0.14)] sm:p-7">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#e8f58d]">
                            02 / Check fare
                        </p>

                        <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
                            {selectedOption?.title}
                        </h2>

                        <div className="mt-7 grid gap-4">
                            <label className="block">
                                <span className="mb-2 block text-xs font-bold text-white/70">
                                    Your city
                                </span>

                                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                    <MapPin className="h-4 w-4 text-[#e8f58d]" />

                                    <input
                                        value={city}
                                        onChange={(
                                            event,
                                        ) =>
                                            setCity(
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                        className="w-full bg-transparent text-sm outline-none placeholder:text-white/30"
                                        placeholder="Mumbai"
                                    />
                                </div>
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-xs font-bold text-white/70">
                                    Route distance
                                    <span className="font-normal">
                                        {" "}
                                        (optional)
                                    </span>
                                </span>

                                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                    <Navigation className="h-4 w-4 text-[#e8f58d]" />

                                    <input
                                        value={
                                            distance
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            setDistance(
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        className="w-full bg-transparent text-sm outline-none placeholder:text-white/30"
                                        placeholder="e.g. 5.2 km"
                                    />

                                    <span className="text-xs text-white/50">
                                        km
                                    </span>
                                </div>
                            </label>

                            <button
                                type="button"
                                onClick={
                                    calculateFare
                                }
                                disabled={loading}
                                className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-[#e8f58d] px-5 py-4 text-sm font-black text-[#123c35] transition hover:bg-[#f0f89e] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? "Checking..."
                                    : "Check fair fare"}

                                <ChevronRight className="h-4 w-4" />
                            </button>
                            <TouristTip mode={selectedMode} />
                        </div>

                        {fare && (
                            <FareResultCard
                                result={fare}
                            />
                        )}
                    </div>
                </section>

                {/* Meter safety */}
                {selectedMode ===
                    "meter-auto" && (
                        <MeterReminder />
                    )}

                {/* Bus guidance */}
                {selectedMode ===
                    "bus" && (
                        <BusGuidance />
                    )}

                {/* Shared auto */}
                {selectedMode ===
                    "shared-auto" && (
                        <LocalGuidance
                            title="Share-auto prices are local"
                            text="Don't let FairTrip invent a fare. Ask someone nearby what the normal share fare is before getting in."
                            question='“What is the share fare from here to ___?”'
                        />
                    )}
            </div>
        </div>
    );
}

function FareResultCard({
    result,
}: {
    result: FareResult;
}) {
    const verified =
        result.confidence ===
        "verified";

    return (
        <div className="mt-6 overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.07]">
            <div className="p-5">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f58d] text-[#123c35]">
                        {verified ? (
                            <ShieldCheck className="h-5 w-5" />
                        ) : (
                            <WalletCards className="h-5 w-5" />
                        )}
                    </div>

                    <div>
                        <p className="text-sm font-black">
                            {result.title}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-white/60">
                            {result.message}
                        </p>
                    </div>
                </div>

                {result.fare !==
                    undefined && (
                        <div className="mt-5 flex items-end justify-between rounded-2xl bg-white/5 p-4">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/40">
                                    Estimated meter fare
                                </p>

                                <p className="mt-1 text-4xl font-black tracking-[-0.05em] text-[#e8f58d]">
                                    ₹
                                    {
                                        result.fare
                                    }
                                </p>
                            </div>

                            {result.distanceKm !==
                                undefined && (
                                    <p className="text-xs text-white/50">
                                        {
                                            result.distanceKm
                                        }{" "}
                                        km
                                    </p>
                                )}
                        </div>
                    )}

                {result.sourceUrl && (
                    <a
                        href={
                            result.sourceUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#e8f58d] hover:underline"
                    >
                        View official tariff source
                        <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                )}
            </div>
        </div>
    );
}

function TouristTip({
    mode,
}: {
    mode: LocalTransportMode;
}) {
    const tips: Record<
        LocalTransportMode,
        {
            label: string;
            title: string;
            message: string;
            quote?: string;
        }
    > = {
        "meter-auto": {
            label: "Tourist tip",
            title: "Use the meter, not a guessed price.",
            message:
                "Before getting in, ask the driver to confirm that this is a meter auto and make sure the meter starts before the ride begins. Even if you pay online, the fare should still be based on the meter.",
            quote:
                'Ask: “Is this a meter rickshaw?”',
        },

        "shared-auto": {
            label: "Before you board",
            title: "Confirm the share fare first.",
            message:
                "Share-auto fares can depend on the local route, stages and destination. FairTrip won't invent a price when it cannot verify one. Ask a local or another passenger before getting in.",
            quote:
                'Ask: “What is the share fare from here to ___?”',
        },

        "meter-taxi": {
            label: "Tourist tip",
            title: "Let the meter decide the fare.",
            message:
                "Before the taxi starts, confirm that the meter is being used. If the driver gives you a fixed price instead, ask for the meter fare or check with a local before agreeing.",
            quote:
                'Ask: “Meter se chaloge?”',
        },

        "app-taxi": {
            label: "Before you book",
            title: "Check the final price in the app.",
            message:
                "App-taxi prices can change with demand, traffic and route conditions. Check the fare shown before confirming and make sure the pickup location is correct.",
            quote:
                "Tip: Check fare + pickup + tolls before confirming.",
        },

        bus: {
            label: "Local bus tip",
            title: "Don't know the bus stop? Ask locally.",
            message:
                "A nearby shopkeeper, hotel receptionist or another passenger can often tell you the nearest stop and which bus to take. Use Google Maps for the route and Chalo for live tracking where available.",
            quote:
                'Ask: “Where is the bus stop for ___?”',
        },

        walk: {
            label: "Walking tip",
            title: "Sometimes the local way is the easiest way.",
            message:
                "For short distances, walking can save money and avoid waiting for transport. Check the walking route before leaving and ask locally if there is a safer or easier entrance.",
        },
    };

    const tip = tips[mode];

    return (
        <div className="mt-5 rounded-[22px] border border-white/10 bg-white/[0.06] p-5">
            <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e8f58d] text-[#123c35]">
                    <ShieldCheck className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#e8f58d]">
                        {tip.label}
                    </p>

                    <h3 className="mt-1 text-base font-black text-white">
                        {tip.title}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-white/60">
                        {tip.message}
                    </p>

                    {tip.quote && (
                        <div className="mt-4 rounded-xl border border-[#e8f58d]/15 bg-[#e8f58d]/[0.07] px-3.5 py-3">
                            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/40">
                                Useful question
                            </p>

                            <p className="mt-1 text-xs font-bold text-[#e8f58d]">
                                {tip.quote}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function MeterReminder() {
    return (
        <section className="mt-6 grid gap-5 rounded-[30px] border border-[#ef713d]/20 bg-[#f9dfd0] p-5 sm:p-7 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#ef713d] text-white">
                    <Gauge className="h-5 w-5" />
                </div>

                <p className="mt-5 text-[10px] font-black uppercase tracking-[0.16em] text-[#ef713d]">
                    Before you get in
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#123c35]">
                    Make sure the meter is being used.
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#66736e]">
                    Meter auto is our recommended
                    option for tourists because the
                    fare is calculated from the regulated
                    tariff.
                </p>
            </div>

            <div className="grid gap-3">
                <ReminderStep
                    number="01"
                    text='Ask: “Is this a meter rickshaw?”'
                />

                <ReminderStep
                    number="02"
                    text="Ask the driver to start the meter before moving."
                />

                <ReminderStep
                    number="03"
                    text="If you pay online, the amount should still be based on the meter/tariff."
                />

                <ReminderStep
                    number="04"
                    text="If something looks wrong, check the official tariff card before paying."
                />
            </div>
        </section>
    );
}

function ReminderStep({
    number,
    text,
}: {
    number: string;
    text: string;
}) {
    return (
        <div className="flex items-center gap-4 rounded-2xl border border-[#123c35]/10 bg-white/70 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#123c35] text-xs font-black text-[#e8f58d]">
                {number}
            </span>

            <p className="text-sm font-semibold leading-5 text-[#123c35]">
                {text}
            </p>
        </div>
    );
}

function BusGuidance() {
    return (
        <section className="mt-6 rounded-[30px] border border-[#123c35]/10 bg-[#fffdf8] p-5 shadow-[0_20px_70px_rgba(18,60,53,0.06)] sm:p-7">
            <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f58d] text-[#123c35]">
                    <BusFront className="h-5 w-5" />
                </div>

                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#ef713d]">
                        Bus help
                    </p>

                    <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">
                        Let local information do the work.
                    </h2>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#66736e]">
                        Bus routes and fares vary by city.
                        If FairTrip cannot verify a fare,
                        we won't make one up.
                    </p>
                </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
                <BusTip
                    number="01"
                    title="Find the stop"
                    text="Ask a nearby shopkeeper, hotel desk, or local where the nearest bus stop is."
                />

                <BusTip
                    number="02"
                    title="Check the route"
                    text="Use Google Maps to check public-transit directions and available routes."
                />

                <BusTip
                    number="03"
                    title="Track the bus"
                    text="Use Chalo where live bus tracking is available."
                />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
                <a
                    href="https://www.google.com/maps"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#123c35] px-4 py-3 text-xs font-black text-white"
                >
                    Open Google Maps
                    <ExternalLink className="h-3.5 w-3.5" />
                </a>

                <a
                    href="https://chalo.com/chalo-app/track-your-bus-live"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#123c35]/15 bg-white px-4 py-3 text-xs font-black text-[#123c35]"
                >
                    Track with Chalo
                    <ExternalLink className="h-3.5 w-3.5" />
                </a>
            </div>
        </section>
    );
}

function BusTip({
    number,
    title,
    text,
}: {
    number: string;
    title: string;
    text: string;
}) {
    return (
        <div className="rounded-2xl bg-[#f7f3ea] p-5">
            <span className="text-[10px] font-black text-[#ef713d]">
                {number}
            </span>

            <h3 className="mt-2 font-black">
                {title}
            </h3>

            <p className="mt-2 text-xs leading-5 text-[#6d7974]">
                {text}
            </p>
        </div>
    );
}

function LocalGuidance({
    title,
    text,
    question,
}: {
    title: string;
    text: string;
    question: string;
}) {
    return (
        <section className="mt-6 rounded-[30px] border border-[#123c35]/10 bg-[#e8f58d] p-5 sm:p-7">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#123c35]/60">
                Local knowledge
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
                {title}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#123c35]/70">
                {text}
            </p>

            <div className="mt-5 rounded-2xl bg-[#123c35] p-5 text-sm font-bold text-white">
                Ask:
                <span className="mt-2 block text-[#e8f58d]">
                    {question}
                </span>
            </div>
        </section>
    );
}