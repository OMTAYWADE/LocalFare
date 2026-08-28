"use client";

import {
    ArrowUpRight,
    Compass,
    MapPinned,
    Sparkles,
    WalletCards,
} from "lucide-react";

import { useRouter } from "next/navigation";

import AppHeader from "@/components/layout/AppHeader";
import PageContainer from "@/components/layout/PageContainer";

export default function TravelPage() {
    const router = useRouter();

    return (
        <main className="min-h-screen overflow-x-hidden bg-[#f7f3ea]">
            <PageContainer>
                <AppHeader />

                <section className="mx-auto max-w-6xl pb-16 pt-4 sm:pb-24 sm:pt-8">
                    {/* HERO */}
                    <div className="relative overflow-hidden rounded-[30px] bg-[#123c35] px-5 py-8 text-white shadow-[0_25px_70px_rgba(18,60,53,0.12)] sm:rounded-[38px] sm:px-8 sm:py-12 lg:px-12 lg:py-14">
                        {/* Decorative gradient */}
                        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#e8f58d]/10 blur-3xl" />

                        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-[#ef713d]/10 blur-3xl" />

                        {/* Decorative circle */}
                        <div className="pointer-events-none absolute right-[-80px] top-1/2 hidden h-64 w-64 -translate-y-1/2 rounded-full border-[30px] border-white/5 lg:block" />

                        <div className="relative z-10 max-w-3xl">
                            {/* EYEBROW */}
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur-md">
                                <Sparkles className="h-3.5 w-3.5 text-[#e8f58d]" />

                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/75">
                                    Smart trip planner
                                </span>
                            </div>

                            {/* TITLE */}
                            <h1 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                                Plan your trip.
                                <br />

                                <span className="text-[#e8f58d]">
                                    Know your cost.
                                </span>
                            </h1>

                            <p className="mt-5 max-w-xl text-sm leading-6 text-white/60 sm:text-base">
                                Enter a destination and FairTrip helps you
                                understand routes, travel options, food
                                expenses and your estimated trip budget.
                            </p>
                        </div>
                    </div>

                    {/* PLANNING OPTIONS */}
                    <section className="mt-8 sm:mt-10">
                        <div className="mb-5">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#ef713d]">
                                Plan your journey
                            </p>

                            <h2 className="mt-1 text-2xl font-black tracking-[-0.045em] text-[#123c35] sm:text-3xl">
                                Choose how you want to plan
                            </h2>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {/* DESTINATION PLANNER */}
                            <button
                                type="button"
                                onClick={() =>
                                    router.push("/travel/plan")
                                }
                                className="group relative overflow-hidden rounded-[28px] border border-[#123c35]/10 bg-white p-5 text-left shadow-[0_15px_45px_rgba(18,60,53,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(18,60,53,0.1)] sm:p-7"
                            >
                                <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-[#ccecf3]/60 blur-2xl transition duration-500 group-hover:scale-125" />

                                <div className="relative z-10 flex items-start justify-between gap-4">
                                    <span className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#ccecf3] text-[#245d78]">
                                        <MapPinned className="h-5 w-5" />
                                    </span>

                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7f3ea] text-[#ef713d] transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                                        <ArrowUpRight className="h-4 w-4" />
                                    </span>
                                </div>

                                <div className="relative z-10 mt-10">
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#6d7974]">
                                        I know where I'm going
                                    </p>

                                    <h3 className="mt-2 text-2xl font-black tracking-[-0.045em] text-[#123c35]">
                                        Plan a Destination
                                    </h3>

                                    <p className="mt-2 max-w-md text-xs leading-5 text-[#6d7974] sm:text-sm sm:leading-6">
                                        Enter your destination and build a
                                        journey around your available budget.
                                    </p>
                                </div>
                            </button>

                            {/* SMART PLANNER */}
                            <button
                                type="button"
                                onClick={() =>
                                    router.push("/travel/smart")
                                }
                                className="group relative overflow-hidden rounded-[28px] bg-[#e8f58d] p-5 text-left text-[#123c35] transition-all duration-300 hover:-translate-y-1 hover:bg-[#e3f27e] hover:shadow-[0_25px_60px_rgba(18,60,53,0.1)] sm:p-7"
                            >
                                <div className="absolute -bottom-20 -right-20 h-52 w-52 rounded-full border-[25px] border-[#123c35]/5 transition duration-500 group-hover:scale-125" />

                                <div className="relative z-10 flex items-start justify-between gap-4">
                                    <span className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#cbe95b]">
                                        <Compass className="h-5 w-5" />
                                    </span>

                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#cbe95b] transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                                        <ArrowUpRight className="h-4 w-4" />
                                    </span>
                                </div>

                                <div className="relative z-10 mt-10">
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-50">
                                        Let FairTrip decide
                                    </p>

                                    <h3 className="mt-2 text-2xl font-black tracking-[-0.045em]">
                                        Smart Planning
                                    </h3>

                                    <p className="mt-2 max-w-md text-xs leading-5 opacity-70 sm:text-sm sm:leading-6">
                                        Get recommendations based on budget,
                                        distance, time and available travel
                                        options.
                                    </p>
                                </div>
                            </button>
                        </div>
                    </section>

                    {/* WHY TRIP PLANNING */}
                    <section className="mt-8">
                        <div className="grid gap-3 sm:grid-cols-3">
                            <PlanningFeature
                                icon={WalletCards}
                                title="Budget first"
                                text="Understand estimated expenses before you travel."
                            />

                            <PlanningFeature
                                icon={MapPinned}
                                title="Route aware"
                                text="Compare travel options and estimated journey time."
                            />

                            <PlanningFeature
                                icon={Compass}
                                title="Smart choices"
                                text="Use FairTrip recommendations to make better decisions."
                            />
                        </div>
                    </section>

                    {/* RETURN TO CORE FEATURES */}
                    <section className="mt-8 rounded-[26px] border border-[#123c35]/10 bg-white p-5 sm:p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#ef713d]">
                                    FairTrip
                                </p>

                                <h2 className="mt-1 text-lg font-black tracking-[-0.03em] text-[#123c35]">
                                    Looking for nearby places or prices?
                                </h2>

                                <p className="mt-1 text-xs leading-5 text-[#6d7974]">
                                    Explore your surroundings or check food
                                    and local fares before you pay.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    router.push("/explore")
                                }
                                className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-[#123c35] px-5 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-[#0d312b]"
                            >
                                Explore nearby
                                <ArrowUpRight className="h-3.5 w-3.5 text-[#e8f58d]" />
                            </button>
                        </div>
                    </section>
                </section>
            </PageContainer>
        </main>
    );
}

function PlanningFeature({
    icon: Icon,
    title,
    text,
}: {
    icon: typeof WalletCards;
    title: string;
    text: string;
}) {
    return (
        <div className="rounded-[22px] border border-[#123c35]/8 bg-white p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_35px_rgba(18,60,53,0.06)]">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f7f3ea] text-[#123c35]">
                <Icon className="h-4 w-4" />
            </span>

            <h3 className="mt-4 text-xs font-black text-[#123c35]">
                {title}
            </h3>

            <p className="mt-1 text-[11px] leading-4 text-[#6d7974]">
                {text}
            </p>
        </div>
    );
}