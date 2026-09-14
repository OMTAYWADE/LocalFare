"use client";

import gsap from "gsap";
import Link from "next/link";
import {
    Bookmark,
    ChevronRight,
    Clock3,
    Compass,
    Footprints,
    History,
    MapPin,
    Route,
    Search,
    Sparkles,
    Utensils,
    WalletCards,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import AppHeader from "@/components/layout/AppHeader";
import JourneyMap from "@/features/travelMemory/components/JourneyMap";
import type {
    JourneyDetail,
    JourneySummary,
} from "@/features/travelMemory/types/travelMemory.types";

interface ProfileData {
    profile: {
        id: string;
        name: string;
        email: string;
        createdAt: string;
        travelerType: string;
        currency: string;
        vegetarian: boolean;
        vegan: boolean;
        preferredSpice: string | null;
        preferredCuisine: string | null;
    };
    stats: {
        journeys: number;
        placesVisited: number;
        savedPlaces: number;
        foodScans: number;
        searches: number;
        knownSpend: number;
    };
    journeys: JourneySummary[];
    visitedPlaces: Array<{
        id: string;
        visitedAt: string;
        note: string | null;
        place: {
            id: string;
            name: string;
            type: string;
            address: string | null;
            city: string | null;
            state: string | null;
            country: string | null;
            imageUrl: string | null;
        };
    }>;
    savedPlaces: Array<{
        id: string;
        createdAt: string;
        place: {
            id: string;
            name: string;
            type: string;
            address: string | null;
            city: string | null;
            state: string | null;
            country: string | null;
            imageUrl: string | null;
        };
    }>;
    foodScans: Array<{
        id: string;
        recognizedName: string;
        confidence: number | null;
        imageUrl: string | null;
        mode: string;
        source: string | null;
        createdAt: string;
        food: {
            id: string;
            name: string;
            imageUrl: string | null;
            cuisine: string[];
            spiceLevel: string | null;
        } | null;
    }>;
    searchHistory: Array<{
        id: string;
        query: string;
        locationQuery: string | null;
        travelerType: string | null;
        createdAt: string;
    }>;
}

type Tab = "overview" | "journeys" | "food" | "history";

function initials(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0] ?? "")
        .join("")
        .toUpperCase();
}

function pretty(value: string | null | undefined) {
    if (!value) return "";
    return value
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function dateLabel(value: string) {
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(value));
}

function JourneyCard({
    journey,
    selected,
    onClick,
}: {
    journey: JourneySummary;
    selected: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "w-full rounded-[24px] border p-4 text-left transition-all sm:p-5",
                selected
                    ? "border-[#123c35] bg-[#123c35] text-white shadow-[0_18px_45px_rgba(18,60,53,0.16)]"
                    : "border-[#123c35]/8 bg-white hover:-translate-y-0.5 hover:border-[#123c35]/15 hover:shadow-[0_14px_35px_rgba(18,60,53,0.07)]",
            ].join(" ")}
        >
            <div className="flex items-center gap-3">
                <div
                    className={[
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px]",
                        selected
                            ? "bg-[#e8f58d] text-[#123c35]"
                            : "bg-[#eef4d7] text-[#123c35]",
                    ].join(" ")}
                >
                    <Route className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="truncate text-sm font-black">
                            {journey.name}
                        </h3>
                        <span
                            className={[
                                "hidden rounded-full px-2 py-1 text-[7px] font-black uppercase tracking-[0.1em] sm:inline-flex",
                                selected
                                    ? "bg-white/10 text-[#cbe95b]"
                                    : "bg-[#f7f3ea] text-[#74817b]",
                            ].join(" ")}
                        >
                            {journey.status}
                        </span>
                    </div>

                    <p
                        className={[
                            "mt-1 text-[9px]",
                            selected
                                ? "text-white/50"
                                : "text-[#8b9691]",
                        ].join(" ")}
                    >
                        {journey.placeCount} places · {journey.sourceCount} source
                        {journey.sourceCount === 1 ? "" : "s"} · ₹
                        {journey.totalKnownSpendInr.toLocaleString("en-IN")}
                    </p>
                </div>

                <ChevronRight
                    className={[
                        "h-4 w-4 shrink-0",
                        selected
                            ? "text-[#e8f58d]"
                            : "text-[#9ba6a1]",
                    ].join(" ")}
                />
            </div>
        </button>
    );
}

export default function TravelMemoryProfile({
    data,
}: {
    data: ProfileData;
}) {
    const rootRef = useRef<HTMLDivElement>(null);
    const [tab, setTab] = useState<Tab>("overview");
    const [selectedJourneyId, setSelectedJourneyId] = useState<string | null>(null);
    const [selectedJourney, setSelectedJourney] = useState<JourneyDetail | null>(null);
    const [loadingJourney, setLoadingJourney] = useState(false);
    const [journeyError, setJourneyError] = useState("");

    useEffect(() => {
        if (!rootRef.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                "[data-memory-section]",
                { opacity: 0, y: 18 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.55,
                    stagger: 0.06,
                    ease: "power3.out",
                    clearProps: "transform,opacity",
                },
            );
        }, rootRef);

        return () => ctx.revert();
    }, [tab]);

    const foodHighlights = useMemo(() => {
        const map = new Map<string, { name: string; imageUrl: string | null; count: number }>();

        for (const scan of data.foodScans) {
            const name = scan.food?.name ?? scan.recognizedName;
            const current = map.get(name);
            map.set(name, {
                name,
                imageUrl: current?.imageUrl ?? scan.food?.imageUrl ?? scan.imageUrl,
                count: (current?.count ?? 0) + 1,
            });
        }

        return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 4);
    }, [data.foodScans]);

    async function openJourney(journey: JourneySummary) {
        setSelectedJourneyId(journey.id);
        setJourneyError("");

        if (selectedJourney?.id === journey.id) return;

        setLoadingJourney(true);

        try {
            const response = await fetch(`/api/journal/journeys/${journey.id}`, {
                cache: "no-store",
            });

            const result = (await response.json()) as {
                journey?: JourneyDetail;
                error?: string;
            };

            if (!response.ok || !result.journey) {
                throw new Error(result.error ?? "Unable to open this journey.");
            }

            setSelectedJourney(result.journey);
        } catch (error) {
            setJourneyError(
                error instanceof Error
                    ? error.message
                    : "Unable to open this journey.",
            );
        } finally {
            setLoadingJourney(false);
        }
    }

    return (
        <main
            ref={rootRef}
            className="min-h-screen bg-[#f7f3ea] text-[#123c35]"
        >
            <AppHeader />

            <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
                <section
                    data-memory-section
                    className="overflow-hidden rounded-[32px] bg-[#123c35] p-6 text-[#f7f3ea] shadow-[0_25px_80px_rgba(18,60,53,0.14)] sm:p-8 lg:p-10"
                >
                    <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f58d] px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.15em] text-[#123c35]">
                                <Sparkles className="h-3 w-3" />
                                My travel memory
                            </span>

                            <div className="mt-6 flex items-center gap-4">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[21px] bg-[#f7f3ea] text-lg font-black text-[#123c35] sm:h-20 sm:w-20 sm:text-xl">
                                    {initials(data.profile.name)}
                                </div>

                                <div className="min-w-0">
                                    <h1 className="truncate text-3xl font-black tracking-[-0.06em] sm:text-5xl">
                                        {data.profile.name}
                                    </h1>
                                    <p className="mt-1 truncate text-xs text-white/50 sm:text-sm">
                                        {data.profile.email}
                                    </p>
                                </div>
                            </div>

                            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/62">
                                One place for the trips you remember, places you visited,
                                food you discovered, things you searched and the places you
                                decided to keep.
                            </p>
                        </div>

                        <div className="rounded-[23px] border border-white/10 bg-white/5 p-5 backdrop-blur">
                            <p className="text-[7px] font-black uppercase tracking-[0.15em] text-[#cbe95b]">
                                Traveler profile
                            </p>
                            <p className="mt-2 text-lg font-black">
                                {pretty(data.profile.travelerType)}
                            </p>
                            <p className="mt-1 text-[9px] text-white/45">
                                Member since {dateLabel(data.profile.createdAt)}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                    <div data-memory-section className="rounded-[20px] border border-[#123c35]/8 bg-white p-4 shadow-sm">
                        <Compass className="h-4 w-4 text-[#ef713d]" />
                        <p className="mt-3 text-lg font-black tracking-[-0.04em]">{data.stats.journeys}</p>
                        <p className="mt-1 text-[7px] font-black uppercase tracking-[0.12em] text-[#8b9691]">Journeys</p>
                    </div>
                    <div data-memory-section className="rounded-[20px] border border-[#123c35]/8 bg-white p-4 shadow-sm">
                        <MapPin className="h-4 w-4 text-[#ef713d]" />
                        <p className="mt-3 text-lg font-black tracking-[-0.04em]">{data.stats.placesVisited}</p>
                        <p className="mt-1 text-[7px] font-black uppercase tracking-[0.12em] text-[#8b9691]">Places visited</p>
                    </div>
                    <div data-memory-section className="rounded-[20px] border border-[#123c35]/8 bg-white p-4 shadow-sm">
                        <Bookmark className="h-4 w-4 text-[#ef713d]" />
                        <p className="mt-3 text-lg font-black tracking-[-0.04em]">{data.stats.savedPlaces}</p>
                        <p className="mt-1 text-[7px] font-black uppercase tracking-[0.12em] text-[#8b9691]">Saved places</p>
                    </div>
                    <div data-memory-section className="rounded-[20px] border border-[#123c35]/8 bg-white p-4 shadow-sm">
                        <Utensils className="h-4 w-4 text-[#ef713d]" />
                        <p className="mt-3 text-lg font-black tracking-[-0.04em]">{data.stats.foodScans}</p>
                        <p className="mt-1 text-[7px] font-black uppercase tracking-[0.12em] text-[#8b9691]">Food scans</p>
                    </div>
                    <div data-memory-section className="rounded-[20px] border border-[#123c35]/8 bg-white p-4 shadow-sm">
                        <Search className="h-4 w-4 text-[#ef713d]" />
                        <p className="mt-3 text-lg font-black tracking-[-0.04em]">{data.stats.searches}</p>
                        <p className="mt-1 text-[7px] font-black uppercase tracking-[0.12em] text-[#8b9691]">Searches</p>
                    </div>
                    <div data-memory-section className="rounded-[20px] border border-[#123c35]/8 bg-white p-4 shadow-sm">
                        <WalletCards className="h-4 w-4 text-[#ef713d]" />
                        <p className="mt-3 truncate text-lg font-black tracking-[-0.04em]">₹{data.stats.knownSpend.toLocaleString("en-IN")}</p>
                        <p className="mt-1 text-[7px] font-black uppercase tracking-[0.12em] text-[#8b9691]">Known spend</p>
                    </div>
                </section>

                <nav
                    data-memory-section
                    className="mt-8 flex gap-2 overflow-x-auto rounded-[22px] border border-[#123c35]/8 bg-white p-2"
                >
                    <button type="button" onClick={() => setTab("overview")} className={["inline-flex shrink-0 items-center gap-2 rounded-[15px] px-4 py-3 text-[9px] font-black transition", tab === "overview" ? "bg-[#123c35] text-white" : "text-[#69766f] hover:bg-[#f7f3ea] hover:text-[#123c35]"].join(" ")}>
                        <Compass className="h-3.5 w-3.5" /> Overview
                    </button>
                    <button type="button" onClick={() => setTab("journeys")} className={["inline-flex shrink-0 items-center gap-2 rounded-[15px] px-4 py-3 text-[9px] font-black transition", tab === "journeys" ? "bg-[#123c35] text-white" : "text-[#69766f] hover:bg-[#f7f3ea] hover:text-[#123c35]"].join(" ")}>
                        <Route className="h-3.5 w-3.5" /> Journeys
                    </button>
                    <button type="button" onClick={() => setTab("food")} className={["inline-flex shrink-0 items-center gap-2 rounded-[15px] px-4 py-3 text-[9px] font-black transition", tab === "food" ? "bg-[#123c35] text-white" : "text-[#69766f] hover:bg-[#f7f3ea] hover:text-[#123c35]"].join(" ")}>
                        <Utensils className="h-3.5 w-3.5" /> Food memory
                    </button>
                    <button type="button" onClick={() => setTab("history")} className={["inline-flex shrink-0 items-center gap-2 rounded-[15px] px-4 py-3 text-[9px] font-black transition", tab === "history" ? "bg-[#123c35] text-white" : "text-[#69766f] hover:bg-[#f7f3ea] hover:text-[#123c35]"].join(" ")}>
                        <History className="h-3.5 w-3.5" /> History
                    </button>
                </nav>

                {(tab === "overview" || tab === "journeys") && (
                    <section className="mt-5 grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
                        <div
                            data-memory-section
                            className="rounded-[28px] border border-[#123c35]/8 bg-[#fbfaf5] p-5 sm:p-6"
                        >
                            <div className="flex items-end justify-between gap-3">
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-[0.16em] text-[#ef713d]">
                                        Saved journeys
                                    </p>
                                    <h2 className="mt-1 text-xl font-black tracking-[-0.04em]">
                                        Your travel story
                                    </h2>
                                </div>

                                <Link
                                    href="/travel-memory"
                                    className="rounded-full bg-[#123c35] px-3 py-2 text-[7px] font-black uppercase tracking-[0.1em] text-white"
                                >
                                    Add memory
                                </Link>
                            </div>

                            <div className="mt-4 space-y-2">
                                {data.journeys.length === 0 ? (
                                    <div className="rounded-[20px] border border-dashed border-[#123c35]/10 bg-white p-6 text-center">
                                        <Route className="mx-auto h-5 w-5 text-[#ef713d]" />
                                        <p className="mt-3 text-xs font-black">
                                            Your first journey is waiting.
                                        </p>
                                        <p className="mt-1 text-[9px] leading-5 text-[#84908a]">
                                            Analyze a travel source and save it to start building
                                            your memory.
                                        </p>
                                    </div>
                                ) : (
                                    data.journeys.map((journey) => (
                                        <JourneyCard
                                            key={journey.id}
                                            journey={journey}
                                            selected={selectedJourneyId === journey.id}
                                            onClick={() => void openJourney(journey)}
                                        />
                                    ))
                                )}
                            </div>
                        </div>

                        <div data-memory-section>
                            {loadingJourney ? (
                                <div className="flex min-h-[420px] items-center justify-center rounded-[28px] bg-[#123c35] text-center text-white">
                                    <div>
                                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#e8f58d]" />
                                        <p className="mt-3 text-[8px] font-black uppercase tracking-[0.15em]">
                                            Opening your journey
                                        </p>
                                    </div>
                                </div>
                            ) : selectedJourney ? (
                                <JourneyMap journey={selectedJourney} mode="profile" />
                            ) : (
                                <div className="flex min-h-[420px] items-center justify-center rounded-[28px] bg-[#123c35] p-8 text-center text-white">
                                    <div className="max-w-sm">
                                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f58d] text-[#123c35]">
                                            <Route className="h-5 w-5" />
                                        </div>
                                        <p className="mt-5 text-[8px] font-black uppercase tracking-[0.16em] text-[#cbe95b]">
                                            Journey roadmap
                                        </p>
                                        <h2 className="mt-2 text-2xl font-black tracking-[-0.05em]">
                                            Select a journey
                                        </h2>
                                        <p className="mt-2 text-[10px] leading-5 text-white/50">
                                            Choose a trip on the left to see its travel roadmap,
                                            places, movement, time and spend.
                                        </p>
                                    </div>
                                </div>
                            )}
                            {journeyError && (
                                <p className="mt-2 rounded-[16px] bg-[#ef713d]/10 px-4 py-3 text-[9px] font-bold text-[#a94324]">
                                    {journeyError}
                                </p>
                            )}
                        </div>
                    </section>
                )}

                {tab === "overview" && (
                    <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
                        <div
                            data-memory-section
                            className="rounded-[28px] border border-[#123c35]/8 bg-white p-5 sm:p-6"
                        >
                            <div className="flex items-end justify-between gap-3">
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-[0.16em] text-[#ef713d]">
                                        Food memory
                                    </p>
                                    <h2 className="mt-1 text-xl font-black tracking-[-0.04em]">
                                        Flavours you discovered
                                    </h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setTab("food")}
                                    className="text-[8px] font-black uppercase tracking-[0.1em]"
                                >
                                    View all
                                </button>
                            </div>

                            <div className="mt-5 grid grid-cols-2 gap-2">
                                {foodHighlights.length === 0 ? (
                                    <div className="col-span-2 rounded-[20px] bg-[#fbfaf5] p-6 text-center text-[10px] text-[#88938e]">
                                        No food memories yet.
                                    </div>
                                ) : (
                                    foodHighlights.map((food) => (
                                        <article
                                            key={food.name}
                                            className="overflow-hidden rounded-[20px] bg-[#fbfaf5]"
                                        >
                                            {food.imageUrl ? (
                                                <img
                                                    src={food.imageUrl}
                                                    alt=""
                                                    className="h-24 w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-24 items-center justify-center bg-[#e8f58d] text-2xl">
                                                    🍛
                                                </div>
                                            )}
                                            <div className="p-3">
                                                <p className="truncate text-[10px] font-black">
                                                    {food.name}
                                                </p>
                                                <p className="mt-1 text-[8px] text-[#87928d]">
                                                    Scanned {food.count}×
                                                </p>
                                            </div>
                                        </article>
                                    ))
                                )}
                            </div>
                        </div>

                        <div
                            data-memory-section
                            className="rounded-[28px] bg-[#ef713d] p-5 text-white sm:p-6"
                        >
                            <p className="text-[8px] font-black uppercase tracking-[0.16em] text-[#123c35]">
                                Your trail
                            </p>
                            <h2 className="mt-1 text-xl font-black tracking-[-0.04em]">
                                Recent places you kept in your story.
                            </h2>
                            <div className="mt-5 space-y-2">
                                {data.visitedPlaces.slice(0, 4).map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-3 rounded-[18px] bg-white/10 p-3"
                                    >
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#123c35] text-[#e8f58d]">
                                            <MapPin className="h-3.5 w-3.5" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-[10px] font-black">
                                                {item.place.name}
                                            </p>
                                            <p className="mt-1 truncate text-[8px] text-white/50">
                                                {item.place.city ?? item.place.state ?? "Travel stop"} · {dateLabel(item.visitedAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {tab === "food" && (
                    <section
                        data-memory-section
                        className="mt-5 rounded-[28px] border border-[#123c35]/8 bg-white p-5 sm:p-7"
                    >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-[8px] font-black uppercase tracking-[0.16em] text-[#ef713d]">
                                    Food history
                                </p>
                                <h2 className="mt-1 text-2xl font-black tracking-[-0.05em]">
                                    Your food memory
                                </h2>
                            </div>
                            <Link
                                href="/food"
                                className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#123c35] px-3 py-2 text-[7px] font-black uppercase tracking-[0.1em] text-white"
                            >
                                Explore food
                                <ChevronRight className="h-3 w-3" />
                            </Link>
                        </div>

                        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {data.foodScans.map((scan) => (
                                <article
                                    key={scan.id}
                                    className="overflow-hidden rounded-[22px] border border-[#123c35]/8 bg-[#fbfaf5]"
                                >
                                    {scan.imageUrl || scan.food?.imageUrl ? (
                                        <img
                                            src={scan.imageUrl ?? scan.food?.imageUrl ?? ""}
                                            alt=""
                                            className="h-32 w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-32 items-center justify-center bg-[#e8f58d] text-3xl">
                                            🍽️
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="truncate text-sm font-black">
                                                {scan.food?.name ?? scan.recognizedName}
                                            </h3>
                                            <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[7px] font-black uppercase tracking-[0.08em] text-[#77837d]">
                                                {pretty(scan.mode)}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-[9px] text-[#87928d]">
                                            {scan.food?.cuisine?.slice(0, 2).join(" · ") || "Food discovery"}
                                        </p>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-[8px] text-[#89948f]">
                                                {dateLabel(scan.createdAt)}
                                            </span>
                                            {scan.confidence !== null && (
                                                <span className="text-[8px] font-black text-[#123c35]">
                                                    {Math.round(scan.confidence * 100)}% confidence
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                {tab === "history" && (
                    <section className="mt-5 grid gap-5 lg:grid-cols-2">
                        <div
                            data-memory-section
                            className="rounded-[28px] border border-[#123c35]/8 bg-white p-5 sm:p-7"
                        >
                            <p className="text-[8px] font-black uppercase tracking-[0.16em] text-[#ef713d]">
                                Places
                            </p>
                            <h2 className="mt-1 text-xl font-black tracking-[-0.04em]">
                                Where you have been
                            </h2>
                            <div className="mt-5 space-y-2">
                                {data.visitedPlaces.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-start gap-3 rounded-[18px] bg-[#fbfaf5] p-3"
                                    >
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e8f58d] text-[#123c35]">
                                            <Footprints className="h-3.5 w-3.5" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-[10px] font-black">
                                                {item.place.name}
                                            </p>
                                            <p className="mt-1 text-[8px] text-[#87938d]">
                                                {item.place.city ?? item.place.state ?? "Place"} · {dateLabel(item.visitedAt)}
                                            </p>
                                            {item.note && (
                                                <p className="mt-2 text-[8px] leading-4 text-[#75817b]">
                                                    {item.note}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div
                            data-memory-section
                            className="rounded-[28px] border border-[#123c35]/8 bg-white p-5 sm:p-7"
                        >
                            <p className="text-[8px] font-black uppercase tracking-[0.16em] text-[#ef713d]">
                                Search trail
                            </p>
                            <h2 className="mt-1 text-xl font-black tracking-[-0.04em]">
                                Things you looked for
                            </h2>
                            <div className="mt-5 space-y-2">
                                {data.searchHistory.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-3 rounded-[18px] bg-[#fbfaf5] p-3"
                                    >
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f9dfd0] text-[#ef713d]">
                                            <Search className="h-3.5 w-3.5" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-[10px] font-black">
                                                {item.query}
                                            </p>
                                            <p className="mt-1 truncate text-[8px] text-[#87928d]">
                                                {item.locationQuery ?? pretty(item.travelerType)} · {dateLabel(item.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div
                            data-memory-section
                            className="rounded-[28px] border border-[#123c35]/8 bg-white p-5 sm:p-7 lg:col-span-2"
                        >
                            <div className="flex items-end justify-between gap-3">
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-[0.16em] text-[#ef713d]">
                                        Saved places
                                    </p>
                                    <h2 className="mt-1 text-xl font-black tracking-[-0.04em]">
                                        Places you want to remember
                                    </h2>
                                </div>
                                <Bookmark className="h-5 w-5 text-[#ef713d]" />
                            </div>

                            <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                                {data.savedPlaces.map((item) => (
                                    <div
                                        key={item.id}
                                        className="rounded-[20px] bg-[#fbfaf5] p-4"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#e8f58d] text-[#123c35]">
                                            <Bookmark className="h-4 w-4" />
                                        </div>
                                        <p className="mt-4 truncate text-[10px] font-black">
                                            {item.place.name}
                                        </p>
                                        <p className="mt-1 truncate text-[8px] text-[#87938d]">
                                            {item.place.city ?? item.place.state ?? "Saved place"}
                                        </p>
                                        <p className="mt-3 text-[7px] font-black uppercase tracking-[0.1em] text-[#a0aaa5]">
                                            Saved {dateLabel(item.createdAt)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <footer
                    data-memory-section
                    className="mt-8 flex flex-col gap-3 border-t border-[#123c35]/8 pt-6 sm:flex-row sm:items-center sm:justify-between"
                >
                    <div>
                        <p className="text-[8px] font-black uppercase tracking-[0.16em] text-[#ef713d]">
                            FairTrip memory
                        </p>
                        <p className="mt-1 text-[9px] text-[#7e8a85]">
                            Your travel history is organized around the things worth remembering.
                        </p>
                    </div>
                    <Link
                        href="/travel-memory"
                        className="inline-flex w-fit items-center gap-2 rounded-full bg-[#123c35] px-4 py-2.5 text-[8px] font-black uppercase tracking-[0.11em] text-white"
                    >
                        Add another memory
                        <ChevronRight className="h-3.5 w-3.5 text-[#e8f58d]" />
                    </Link>
                </footer>
            </div>
        </main>
    );
}
