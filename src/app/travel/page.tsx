"use client";

import {
    ArrowUpRight,
    Binoculars,
    Compass,
    MapPin,
    Send,
    Sparkles,
    WalletCards,
} from "lucide-react";
import { useRouter } from "next/navigation";

import AppHeader from "@/components/layout/AppHeader";
import PageContainer from "@/components/layout/PageContainer";

export default function TravelPage() {
    const router = useRouter();

    return (
        <main className="min-h-screen bg-[#f7f3ea]">
            <PageContainer>
                <AppHeader />

                <section className="mx-auto max-w-6xl pb-24 pt-12 sm:pt-16">

                    {/* HERO */}
                    <div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-end">

                        <div className="max-w-3xl">

                            <div className="inline-flex items-center gap-2 rounded-full border border-[#123c35]/10 bg-white px-3 py-1.5 shadow-sm">
                                <Sparkles className="h-3.5 w-3.5 text-[#ef713d]" />

                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#123c35]">
                                    Smart trip planner
                                </span>
                            </div>

                            <h1 className="mt-6 text-5xl font-black leading-[0.92] tracking-[-0.065em] text-[#123c35] sm:text-7xl">
                                Plan less.
                                <br />

                                <span className="text-[#ef713d]">
                                    Explore more.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-[620px] text-sm leading-6 text-[#6d7974] sm:text-base">
                                Choose how you want to plan your journey.
                                FairTrip helps you discover places,
                                understand costs and make better travel
                                decisions.
                            </p>
                        </div>

                        {/* SMART + BUDGET */}
                        <div className="grid grid-cols-2 gap-3">

                            {/* SMART */}
                            <button
                                type="button"
                                onClick={() =>
                                    router.push("/travel/smart")
                                }
                                className="group min-h-[175px] rounded-[28px] bg-[#123c35] p-5 text-left text-white transition duration-300 hover:-translate-y-1 hover:bg-[#0d312b]"
                            >
                                <span className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#e8f58d] text-[#123c35]">
                                    <Compass className="h-5 w-5" />
                                </span>

                                <div className="mt-8">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-black">
                                            Smart
                                        </h2>

                                        <ArrowUpRight className="h-4 w-4 text-[#e8f58d]" />
                                    </div>

                                    <p className="mt-1 text-xs leading-5 text-white/55">
                                        Let FairTrip find the
                                        better option.
                                    </p>
                                </div>
                            </button>

                            {/* Destination */}
                            <button
                                type="button"
                                onClick={() =>
                                    router.push("/travel/plan")
                                }
                                className="group min-h-[175px] rounded-[28px] border border-[#123c35]/10 bg-white p-5 text-left text-[#123c35] transition duration-300 hover:-translate-y-1"
                            >
                                <span className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#e8f58d]">
                                    <WalletCards className="h-5 w-5" />
                                </span>

                                <div className="mt-8">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-black">
                                            Destination
                                        </h2>

                                        <ArrowUpRight className="h-4 w-4 text-[#ef713d]" />
                                    </div>

                                    <p className="mt-1 text-xs leading-5 text-[#6d7974]">
                                        Find budgets and other information of destination
                                    </p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* MAIN CHOICES */}
                    <section className="mt-14">

                        <div className="mb-5">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#ef713d]">
                                Choose your journey
                            </p>

                            <h2 className="mt-1 text-2xl font-black tracking-[-0.045em] text-[#123c35] sm:text-3xl">
                                How do you want to travel?
                            </h2>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">

                            {/* NEARBY */}
                            <button
                                type="button"
                                onClick={() =>
                                    router.push("/explore")
                                }
                                className="group relative min-h-[250px] overflow-hidden rounded-[30px] bg-[#e8f58d] p-7 text-left text-[#123c35] transition duration-300 hover:-translate-y-1 sm:p-8"
                            >
                                <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full border-[35px] border-[#123c35]/5" />

                                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#cbe95b]">
                                    <Binoculars className="h-7 w-7" />
                                </div>

                                <div className="relative z-10 mt-7">
                                    <p className="text-[10px] font-black uppercase tracking-[0.18em] opacity-50">
                                        I don't know where to go
                                    </p>

                                    <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                                        Explore Nearby
                                    </h2>

                                    <p className="mt-3 max-w-[340px] text-sm leading-6 opacity-70">
                                        Find nearby attractions,
                                        food, places and fair prices
                                        around your current location.
                                    </p>
                                </div>

                                <span className="absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#cbe95b] transition group-hover:scale-110">
                                    <ArrowUpRight className="h-5 w-5" />
                                </span>
                            </button>

                            {/* DESTINATION */}
                            <button
                                type="button"
                                onClick={() =>
                                    router.push("/travel/plan")
                                }
                                className="group relative min-h-[250px] overflow-hidden rounded-[30px] bg-[#f9dfd0] p-7 text-left text-[#123c35] transition duration-300 hover:-translate-y-1 sm:p-8"
                            >
                                <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full border-[35px] border-[#ef713d]/5" />

                                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#f8d4c1]">
                                    <Send className="h-7 w-7 text-[#ef713d]" />
                                </div>

                                <div className="relative z-10 mt-7">
                                    <p className="text-[10px] font-black uppercase tracking-[0.18em] opacity-50">
                                        I already know
                                    </p>

                                    <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                                        I Know My Destination
                                    </h2>

                                    <p className="mt-3 max-w-[340px] text-sm leading-6 opacity-70">
                                        Enter your destination and
                                        compare routes, costs, food
                                        and nearby places.
                                    </p>
                                </div>

                                <span className="absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#f8d4c1] transition group-hover:scale-110">
                                    <ArrowUpRight className="h-5 w-5 text-[#ef713d]" />
                                </span>
                            </button>
                        </div>
                    </section>

                    {/* INFO STRIP */}
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">

                        <InfoCard
                            icon={MapPin}
                            title="Real places"
                            text="Places stored in the FairTrip database."
                        />

                        <InfoCard
                            icon={WalletCards}
                            title="Fair planning"
                            text="Understand what your journey may cost."
                        />

                        <InfoCard
                            icon={Compass}
                            title="Smart choices"
                            text="Recommendations based on your trip."
                        />

                    </div>
                </section>
            </PageContainer>
        </main>
    );
}

function InfoCard({
    icon: Icon,
    title,
    text,
}: {
    icon: typeof MapPin;
    title: string;
    text: string;
}) {
    return (
        <div className="rounded-[22px] border border-[#123c35]/8 bg-white px-5 py-4">
            <div className="flex items-center gap-3">

                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e8f58d] text-[#123c35]">
                    <Icon className="h-4 w-4" />
                </span>

                <div>
                    <p className="text-xs font-black text-[#123c35]">
                        {title}
                    </p>

                    <p className="mt-0.5 text-[11px] leading-4 text-[#6d7974]">
                        {text}
                    </p>
                </div>

            </div>
        </div>
    );
}