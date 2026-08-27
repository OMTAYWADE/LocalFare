"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FoodLocationCard from "@/features/food/components/FoodLocationCard";
import { useUserLocation } from "@/features/location/hooks/useUserLocation";

import {
    ArrowRight,
    Camera,
    ChevronRight,
    Clock3,
    Heart,
    MapPin,
    Search,
    Sparkles,
    Utensils,
} from "lucide-react";

import AppHeader from "@/components/layout/AppHeader";
import PageContainer from "@/components/layout/PageContainer";

const QUICK_SEARCHES = [
    {
        name: "Vada Pav",
        emoji: "🌶️",
    },
    {
        name: "Biryani",
        emoji: "🍛",
    },
    {
        name: "Dosa",
        emoji: "🥞",
    },
    {
        name: "Misal Pav",
        emoji: "🥘",
    },
    {
        name: "Chai",
        emoji: "☕",
    },
];

const FOOD_FEATURES = [
    {
        title: "Scan a dish",
        description:
            "Don't know the name? Let FairTrip identify what is on your plate.",
        icon: Camera,
        route: "/food/scan?mode=food",
        className:
            "bg-[#e8f58d] hover:bg-[#e3f27e]",
        iconClass:
            "bg-[#cbe95b] text-[#123c35]",
        accent:
            "text-[#123c35]",
        label:
            "Identify food",
    },
    {
        title: "Scan a menu",
        description:
            "Find dishes from a restaurant menu that match your taste and budget.",
        icon: Utensils,
        route: "/food/scan?mode=menu",
        className:
            "bg-[#f9dfd0] hover:bg-[#f6d7c6]",
        iconClass:
            "bg-[#f8d4c1] text-[#ef713d]",
        accent:
            "text-[#ef713d]",
        label:
            "Read menu",
    },
];

export default function FoodPage() {
    const router = useRouter();

    const [query, setQuery] =
        useState("");

    const handleSearch = () => {
        const trimmed =
            query.trim();

        if (!trimmed) {
            router.push(
                "/food/search",
            );
            return;
        }

        router.push(
            `/food/search?q=${encodeURIComponent(
                trimmed,
            )}`,
        );
    };

    const handleQuickSearch = (
        food: string,
    ) => {
        router.push(
            `/food/search?q=${encodeURIComponent(
                food,
            )}`,
        );
    };

    return (
        <main className="min-h-screen bg-[#f7f3ea] text-[#123c35]">

            <PageContainer>
                <AppHeader />

                <section className="mx-auto max-w-6xl pb-20 pt-5 sm:pt-8">

                    {/* =====================================================
                        HERO
                    ===================================================== */}

                    <div className="grid gap-5 lg:grid-cols-[1fr_340px] lg:items-stretch">

                        {/* Main hero */}

                        <div className="relative overflow-hidden rounded-[30px] bg-[#123c35] px-6 py-8 text-white sm:px-9 sm:py-10 lg:min-h-[365px]">

                            {/* Decorative circles */}

                            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border-[35px] border-[#cbe95b]/10" />

                            <div className="pointer-events-none absolute -bottom-24 -right-8 h-48 w-48 rounded-full bg-[#ef713d]/10" />

                            <div className="relative z-10 max-w-2xl">

                                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur">

                                    <Sparkles className="h-3.5 w-3.5 text-[#cbe95b]" />

                                    <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/80">
                                        Smart food guide
                                    </span>

                                </div>

                                <h1 className="mt-5 max-w-xl text-4xl font-black leading-[0.92] tracking-[-0.055em] sm:text-5xl lg:text-[58px]">

                                    Eat better.
                                    <br />

                                    <span className="text-[#ef713d]">
                                        Travel smarter.
                                    </span>

                                </h1>

                                <p className="mt-5 max-w-lg text-sm leading-6 text-white/65 sm:text-[15px]">
                                    Search a dish, scan your
                                    food or read a menu.
                                    FairTrip helps you choose
                                    based on taste, budget,
                                    dietary preferences and
                                    eating time.
                                </p>

                            </div>

                            {/* Search */}

                            <div className="relative z-10 mt-7 max-w-2xl">

                                <div className="flex min-h-[58px] items-center gap-2 rounded-full bg-white p-1.5 shadow-[0_15px_45px_rgba(0,0,0,0.15)]">

                                    <Search className="ml-4 h-5 w-5 shrink-0 text-[#ef713d]" />

                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(event) =>
                                            setQuery(
                                                event.target.value,
                                            )
                                        }
                                        onKeyDown={(event) => {
                                            if (
                                                event.key ===
                                                "Enter"
                                            ) {
                                                handleSearch();
                                            }
                                        }}
                                        placeholder="Search biryani, dosa, chai..."
                                        className="min-w-0 flex-1 bg-transparent px-2 text-sm font-semibold text-[#123c35] outline-none placeholder:text-[#6d7974]/60"
                                    />

                                    <button
                                        type="button"
                                        onClick={
                                            handleSearch
                                        }
                                        className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-[#ef713d] px-4 text-xs font-black text-white transition hover:bg-[#df6332]"
                                    >
                                        <span className="hidden sm:inline">
                                            Search
                                        </span>

                                        <ArrowRight className="h-4 w-4" />
                                    </button>

                                </div>

                            </div>

                        </div>


                        {/* Smart explanation */}

                        <div className="relative overflow-hidden rounded-[30px] bg-[#e8f58d] p-6 sm:p-7">

                            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full border-[22px] border-[#123c35]/5" />

                            <div className="relative">

                                <div className="flex items-center justify-between">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#cbe95b]">

                                        <Sparkles className="h-5 w-5" />

                                    </div>

                                    <span className="rounded-full bg-[#123c35]/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.14em]">
                                        FairTrip AI
                                    </span>

                                </div>

                                <h2 className="mt-7 text-2xl font-black leading-tight tracking-[-0.04em] sm:text-3xl">

                                    Your food.
                                    <br />
                                    Your way.

                                </h2>

                                <p className="mt-3 text-sm leading-6 text-[#31544d]/75">
                                    Recommendations can
                                    consider more than just
                                    the dish name.
                                </p>

                                <div className="mt-6 space-y-2.5">

                                    <InfoRow
                                        icon={
                                            <Heart className="h-3.5 w-3.5" />
                                        }
                                        text="Your taste"
                                    />

                                    <InfoRow
                                        icon={
                                            <Clock3 className="h-3.5 w-3.5" />
                                        }
                                        text="Eating time"
                                    />

                                    <InfoRow
                                        icon={
                                            <span className="text-xs font-black">
                                                ₹
                                            </span>
                                        }
                                        text="Your budget"
                                    />

                                    <InfoRow
                                        icon={
                                            <Utensils className="h-3.5 w-3.5" />
                                        }
                                        text="Diet & spice"
                                    />

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =====================================================
                        QUICK SEARCH
                    ===================================================== */}

                    <section className="mt-7">

                        <div className="mb-3 flex items-end justify-between gap-3">

                            <div>

                                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#ef713d]">
                                    Start quickly
                                </p>

                                <h2 className="mt-1 text-lg font-black tracking-[-0.03em]">
                                    Popular searches
                                </h2>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    router.push(
                                        "/food/search",
                                    )
                                }
                                className="hidden items-center gap-1 text-xs font-black text-[#31544d] sm:flex"
                            >
                                View all

                                <ChevronRight className="h-3.5 w-3.5" />
                            </button>

                        </div>

                        <div className="flex gap-2.5 overflow-x-auto pb-1">

                            {QUICK_SEARCHES.map(
                                (food) => (
                                    <button
                                        key={
                                            food.name
                                        }
                                        type="button"
                                        onClick={() =>
                                            handleQuickSearch(
                                                food.name,
                                            )
                                        }
                                        className="flex shrink-0 items-center gap-2 rounded-full border border-[#123c35]/10 bg-white px-4 py-2.5 text-xs font-black text-[#31544d] shadow-sm transition hover:-translate-y-0.5 hover:border-[#123c35]/20 hover:bg-[#e8f58d]"
                                    >
                                        <span>
                                            {
                                                food.emoji
                                            }
                                        </span>

                                        {
                                            food.name
                                        }
                                    </button>
                                ),
                            )}

                        </div>

                    </section>


                    {/* =====================================================
                        LOCATION / DISCOVERY STRIP
                    ===================================================== */}

                    <section className="mt-7 grid gap-3 sm:grid-cols-2">

                        <div className="flex min-h-[72px] items-center gap-3 rounded-[22px] border border-[#123c35]/10 bg-white px-4">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8f58d] text-[#123c35]">

                                <MapPin className="h-4 w-4" />

                            </div>

                            <div className="min-w-0">

                                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#6d7974]">
                                    Discover nearby
                                </p>

                                <p className="mt-0.5 truncate text-sm font-black">
                                    Food around your location
                                </p>

                            </div>

                            <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-[#6d7974]" />

                        </div>


                        <div className="flex min-h-[72px] items-center gap-3 rounded-[22px] border border-[#123c35]/10 bg-white px-4">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f9dfd0] text-[#ef713d]">

                                <Clock3 className="h-4 w-4" />

                            </div>

                            <div className="min-w-0">

                                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#6d7974]">
                                    Right now
                                </p>

                                <p className="mt-0.5 truncate text-sm font-black">
                                    Recommendations for your meal time
                                </p>

                            </div>

                        </div>

                    </section>


                    {/* =====================================================
                        SCAN / DISCOVER
                    ===================================================== */}

                    <section className="mt-9">

                        <div className="mb-5">

                            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#ef713d]">
                                Don't know what it is?
                            </p>

                            <div className="mt-1 flex flex-wrap items-end justify-between gap-3">

                                <div>

                                    <h2 className="text-2xl font-black tracking-[-0.04em] sm:text-3xl">
                                        Let FairTrip identify it
                                    </h2>

                                    <p className="mt-1.5 text-sm text-[#6d7974]">
                                        Use your camera instead of
                                        searching manually.
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="grid gap-4 md:grid-cols-2">

                            {FOOD_FEATURES.map(
                                (feature) => {
                                    const Icon =
                                        feature.icon;

                                    return (
                                        <button
                                            key={
                                                feature.title
                                            }
                                            type="button"
                                            onClick={() =>
                                                router.push(
                                                    feature.route,
                                                )
                                            }
                                            className={`group relative min-h-[205px] overflow-hidden rounded-[28px] p-6 text-left transition-all duration-300 hover:-translate-y-1 sm:p-7 ${feature.className}`}
                                        >

                                            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full border-[28px] border-[#123c35]/5" />

                                            <div className="relative">

                                                <div
                                                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${feature.iconClass}`}
                                                >
                                                    <Icon className="h-6 w-6" />
                                                </div>

                                                <div className="mt-6 flex items-end justify-between gap-4">

                                                    <div className="max-w-md">

                                                        <p className="text-[9px] font-black uppercase tracking-[0.16em] opacity-50">
                                                            {
                                                                feature.label
                                                            }
                                                        </p>

                                                        <h3 className="mt-1 text-2xl font-black tracking-[-0.04em]">
                                                            {
                                                                feature.title
                                                            }
                                                        </h3>

                                                        <p className="mt-2 text-sm leading-6 opacity-65">
                                                            {
                                                                feature.description
                                                            }
                                                        </p>

                                                    </div>

                                                    <span
                                                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-current/10 bg-white/40 transition group-hover:scale-110 ${feature.accent}`}
                                                    >
                                                        <ArrowRight className="h-4 w-4" />
                                                    </span>

                                                </div>

                                            </div>

                                        </button>
                                    );
                                },
                            )}

                        </div>

                    </section>


                    {/* =====================================================
                        HOW IT WORKS
                    ===================================================== */}

                    <section className="mt-9 rounded-[28px] border border-[#123c35]/10 bg-white p-5 sm:p-7">

                        <div className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">

                            <div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#123c35] text-[#cbe95b]">

                                    <Sparkles className="h-4 w-4" />

                                </div>

                                <h2 className="mt-4 text-2xl font-black tracking-[-0.04em] sm:text-3xl">
                                    Food discovery,
                                    <br />
                                    without guessing.
                                </h2>

                                <p className="mt-3 max-w-sm text-sm leading-6 text-[#6d7974]">
                                    FairTrip can combine
                                    different signals before
                                    recommending what you
                                    should eat.
                                </p>

                            </div>


                            <div className="grid gap-3 sm:grid-cols-2">

                                <StepCard
                                    number="01"
                                    title="Tell us"
                                    description="Search, scan or choose your preferences."
                                />

                                <StepCard
                                    number="02"
                                    title="Understand"
                                    description="We compare budget, taste, time and dietary needs."
                                />

                                <StepCard
                                    number="03"
                                    title="Compare"
                                    description="See suitable dishes ranked by your preferences."
                                />

                                <StepCard
                                    number="04"
                                    title="Choose"
                                    description="Pick the option that makes sense for your trip."
                                />

                            </div>

                        </div>

                    </section>


                    {/* =====================================================
                        BOTTOM CTA
                    ===================================================== */}

                    <section className="mt-7 overflow-hidden rounded-[28px] bg-[#f9dfd0] px-5 py-6 sm:px-7">

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-start gap-4">

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f8d4c1] text-[#ef713d]">

                                    <Utensils className="h-5 w-5" />

                                </div>

                                <div>

                                    <h3 className="text-lg font-black tracking-[-0.03em]">
                                        Already know what you want?
                                    </h3>

                                    <p className="mt-1 text-xs leading-5 text-[#31544d]/70">
                                        Search the dish and let FairTrip
                                        find the best match.
                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    router.push(
                                        "/food/search",
                                    )
                                }
                                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#123c35] px-5 text-xs font-black text-white transition hover:bg-[#0d312b]"
                            >
                                Search food

                                <ArrowRight className="h-4 w-4 text-[#cbe95b]" />
                            </button>

                        </div>

                    </section>

                </section>

            </PageContainer>

        </main>
    );
}


/* ============================================================
   SMALL UI COMPONENTS
   ============================================================ */

function InfoRow({
    icon,
    text,
}: {
    icon: React.ReactNode;
    text: string;
}) {
    return (
        <div className="flex items-center gap-2.5 text-xs font-bold text-[#31544d]">

            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/55">
                {icon}
            </span>

            {text}

        </div>
    );
}


function StepCard({
    number,
    title,
    description,
}: {
    number: string;
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-[20px] bg-[#fbfaf5] p-4">

            <div className="flex items-center justify-between">

                <span className="text-[9px] font-black tracking-[0.12em] text-[#ef713d]">
                    {number}
                </span>

                <span className="h-1.5 w-1.5 rounded-full bg-[#cbe95b]" />

            </div>

            <h3 className="mt-4 text-sm font-black">
                {title}
            </h3>

            <p className="mt-1 text-xs leading-5 text-[#6d7974]">
                {description}
            </p>

        </div>
    );
}