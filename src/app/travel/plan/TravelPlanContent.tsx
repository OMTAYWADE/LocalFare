"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    MapPin,
    Navigation,
    Search,
    Sparkles,
} from "lucide-react";

import AppHeader from "@/components/layout/AppHeader";
import PageContainer from "@/components/layout/PageContainer";

import DestinationSummary from "@/components/travel/plan/DestinationSummary";
import DestinationDetails from "@/components/travel/plan/DestinationDetails";
import TripBudgetCard from "@/components/travel/plan/TripBudgetCard";
import TravelOptions from "@/components/travel/plan/TravelOptions";
import FoodRecommendations from "@/components/travel/plan/FoodRecommendations";
import NearbyDestinations from "@/components/travel/plan/NearbyDestinations";
import SmartRecommendations from "@/components/travel/recommendation/SmartRecommendations";

import { destinationDetails } from "@/features/travel/data/destination-details";

import {
    defaultSource,
    tripExpenses,
    travelOptions,
} from "@/features/travel/data/trip-plan";

import { foodRecommendations } from "@/features/travel/data/food-details";
import { nearbyDestinations } from "@/features/travel/data/nearby-destinations";

/* =========================================================
   MAIN
========================================================= */

export default function TravelPlanContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const source =
        searchParams.get("source") ||
        defaultSource.name;

    const destinationQuery =
        searchParams.get("destination");

    /*
     * No destination yet.
     * Show compact destination search.
     */
    if (!destinationQuery) {
        return (
            <DestinationSearch
                source={source}
                onBack={() => router.push("/travel")}
                onSubmit={(nextSource, destination) => {
                    const params = new URLSearchParams({
                        source: nextSource,
                        destination,
                    });

                    router.push(
                        `/travel/plan?${params.toString()}`,
                    );
                }}
            />
        );
    }

    return (
        <TripPlan
            source={source}
            destinationQuery={destinationQuery}
        />
    );
}

/* =========================================================
   DESTINATION SEARCH
========================================================= */

function DestinationSearch({
    source,
    onBack,
    onSubmit,
}: {
    source: string;
    onBack: () => void;
    onSubmit: (
        source: string,
        destination: string,
    ) => void;
}) {
    const [startLocation, setStartLocation] =
        useState(source);

    const [destination, setDestination] =
        useState("");

    const quickPlaces = [
        "Gateway of India",
        "Marine Drive",
        "Colaba Causeway",
    ];

    return (
        <main className="min-h-screen bg-[#f7f3ea]">
            <PageContainer>
                <AppHeader />

                <section className="mx-auto w-full max-w-[1080px] px-1 pb-16 pt-6 sm:px-2 sm:pb-20 sm:pt-10">

                    {/* BACK */}

                    <button
                        type="button"
                        onClick={onBack}
                        className="mb-6 inline-flex items-center gap-2 rounded-full px-2 py-1.5 text-xs font-bold text-[#6d7974] transition hover:bg-white hover:text-[#123c35]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to travel
                    </button>

                    {/* HERO */}

                    <div className="grid items-end gap-6 lg:grid-cols-[1fr_300px]">

                        <div>

                            <div className="inline-flex items-center gap-2 rounded-full border border-[#123c35]/10 bg-white px-3 py-1.5 shadow-sm">
                                <Navigation className="h-3.5 w-3.5 text-[#ef713d]" />

                                <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#31544d]">
                                    Destination planner
                                </span>
                            </div>

                            <h1 className="mt-5 max-w-[650px] text-4xl font-black leading-[0.95] tracking-[-0.055em] text-[#123c35] sm:text-5xl lg:text-[58px]">
                                Where are you{" "}
                                <span className="text-[#ef713d]">
                                    headed?
                                </span>
                            </h1>

                            <p className="mt-4 max-w-[590px] text-sm leading-6 text-[#6d7974] sm:text-[15px]">
                                Enter your starting point and destination.
                                FairTrip will help you understand the
                                journey, cost and places worth exploring.
                            </p>

                        </div>

                        {/* SMALL INFO CARD */}

                        <div className="hidden rounded-[22px] border border-[#123c35]/10 bg-[#123c35] p-5 text-white lg:block">

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f58d] text-[#123c35]">
                                <Sparkles className="h-4 w-4" />
                            </div>

                            <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-white/50">
                                Smart planning
                            </p>

                            <p className="mt-1 text-sm leading-5 text-white/80">
                                Compare your journey before you leave.
                            </p>

                        </div>

                    </div>

                    {/* FORM */}

                    <div className="mt-8 rounded-[26px] border border-[#123c35]/10 bg-white p-4 shadow-[0_18px_55px_rgba(18,60,53,0.06)] sm:p-5 lg:mt-10 lg:p-6">

                        {/* FORM HEADER */}

                        <div className="flex flex-wrap items-center justify-between gap-3">

                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#ef713d]">
                                    Your journey
                                </p>

                                <h2 className="mt-1 text-xl font-black tracking-[-0.035em] text-[#123c35] sm:text-2xl">
                                    Start planning
                                </h2>
                            </div>

                            <div className="rounded-full bg-[#f7f3ea] px-3 py-1.5 text-[10px] font-bold text-[#6d7974]">
                                Mumbai trip
                            </div>

                        </div>

                        {/* INPUTS */}

                        <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_44px_1fr] lg:items-end">

                            {/* SOURCE */}

                            <div>

                                <label
                                    htmlFor="source"
                                    className="mb-2 block text-[9px] font-black uppercase tracking-[0.16em] text-[#6d7974]"
                                >
                                    Starting from
                                </label>

                                <div className="flex h-14 items-center rounded-2xl border border-[#123c35]/10 bg-[#fffdf8] px-4 transition focus-within:border-[#123c35]/30 focus-within:bg-white">

                                    <MapPin className="h-4 w-4 shrink-0 text-[#123c35]" />

                                    <input
                                        id="source"
                                        value={startLocation}
                                        onChange={(event) =>
                                            setStartLocation(
                                                event.target.value,
                                            )
                                        }
                                        className="ml-3 min-w-0 w-full bg-transparent text-sm font-bold text-[#123c35] outline-none"
                                        placeholder="Starting location"
                                    />

                                </div>

                            </div>

                            {/* ARROW */}

                            <div className="hidden h-11 w-11 items-center justify-center rounded-full bg-[#e8f58d] text-[#123c35] lg:flex">
                                <ArrowRight className="h-4 w-4" />
                            </div>

                            {/* DESTINATION */}

                            <div>

                                <label
                                    htmlFor="destination"
                                    className="mb-2 block text-[9px] font-black uppercase tracking-[0.16em] text-[#6d7974]"
                                >
                                    Destination
                                </label>

                                <div className="flex h-14 items-center rounded-2xl border border-[#123c35]/10 bg-[#fffdf8] px-4 transition focus-within:border-[#ef713d]/40 focus-within:bg-white">

                                    <Search className="h-4 w-4 shrink-0 text-[#ef713d]" />

                                    <input
                                        id="destination"
                                        value={destination}
                                        onChange={(event) =>
                                            setDestination(
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Where do you want to go?"
                                        className="ml-3 min-w-0 w-full bg-transparent text-sm text-[#123c35] outline-none placeholder:text-[#6d7974]/60"
                                    />

                                </div>

                            </div>

                        </div>

                        {/* QUICK PLACES */}

                        <div className="mt-5 flex flex-wrap items-center gap-2">

                            <span className="mr-1 text-[9px] font-black uppercase tracking-[0.14em] text-[#6d7974]">
                                Try
                            </span>

                            {quickPlaces.map((place) => (
                                <button
                                    key={place}
                                    type="button"
                                    onClick={() =>
                                        setDestination(place)
                                    }
                                    className="rounded-full border border-[#123c35]/10 bg-[#f7f3ea] px-3 py-1.5 text-[11px] font-bold text-[#31544d] transition hover:border-[#123c35]/20 hover:bg-[#e8f58d]"
                                >
                                    {place}
                                </button>
                            ))}

                        </div>

                        {/* ACTION */}

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                            <p className="hidden text-xs text-[#6d7974] sm:block">
                                Add a destination to calculate your trip.
                            </p>

                            <button
                                type="button"
                                disabled={!destination.trim()}
                                onClick={() =>
                                    onSubmit(
                                        startLocation,
                                        destination.trim(),
                                    )
                                }
                                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#123c35] px-6 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#0d312b] disabled:cursor-not-allowed disabled:opacity-35 sm:w-auto"
                            >
                                Calculate my trip

                                <ArrowRight className="h-4 w-4 text-[#e8f58d]" />
                            </button>

                        </div>

                    </div>

                </section>
            </PageContainer>
        </main>
    );
}

/* =========================================================
   ACTUAL TRIP PLAN
========================================================= */

function TripPlan({
    source,
    destinationQuery,
}: {
    source: string;
    destinationQuery: string;
}) {
    const router = useRouter();

    const [showDetails, setShowDetails] =
        useState(false);

    const destination = useMemo(() => {
        const normalized =
            destinationQuery
                .toLowerCase()
                .trim();

        const found =
            Object.values(destinationDetails).find(
                (item) =>
                    item.name
                        .toLowerCase()
                        .includes(normalized),
            );

        return (
            found ||
            destinationDetails["gateway-of-india"]
        );
    }, [destinationQuery]);

    const maximumBudget =
        tripExpenses.reduce(
            (total, expense) =>
                total + expense.amount,
            0,
        );

    return (
        <main className="min-h-screen bg-[#f7f3ea]">
            <PageContainer>
                <AppHeader />

                <section className="mx-auto w-full max-w-[1080px] px-1 pb-16 pt-5 sm:px-2 sm:pb-20 sm:pt-7">

                    {/* TOP NAV */}

                    <div className="mb-5 flex items-center justify-between gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                router.push("/travel")
                            }
                            className="inline-flex items-center gap-2 rounded-full px-2 py-1.5 text-xs font-bold text-[#6d7974] transition hover:bg-white hover:text-[#123c35]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Change journey
                        </button>

                        <div className="hidden items-center gap-2 text-[10px] font-bold text-[#6d7974] sm:flex">

                            <span className="rounded-full bg-white px-3 py-1.5">
                                {source}
                            </span>

                            <ArrowRight className="h-3.5 w-3.5 text-[#ef713d]" />

                            <span className="rounded-full bg-[#e8f58d] px-3 py-1.5 text-[#123c35]">
                                {destination.name}
                            </span>

                        </div>

                    </div>

                    {/* MOBILE ROUTE */}

                    <div className="mb-4 flex items-center gap-2 text-[10px] font-bold sm:hidden">

                        <span className="min-w-0 max-w-[45%] truncate rounded-full bg-white px-3 py-1.5 text-[#6d7974]">
                            {source}
                        </span>

                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#ef713d]" />

                        <span className="min-w-0 max-w-[45%] truncate rounded-full bg-[#e8f58d] px-3 py-1.5 text-[#123c35]">
                            {destination.name}
                        </span>

                    </div>

                    {/* DESTINATION SUMMARY */}

                    <DestinationSummary
                        destination={destination}
                        sourceName={source}
                        onBack={() =>
                            router.push("/travel")
                        }
                        onMore={() =>
                            setShowDetails(!showDetails)
                        }
                    />

                    {/* DETAILS */}

                    {showDetails && (
                        <div className="mt-4">
                            <DestinationDetails
                                destination={destination}
                            />
                        </div>
                    )}

                    {/* OVERVIEW GRID */}

                    <div className="mt-5 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">

                        <TripBudgetCard
                            expenses={tripExpenses}
                            maximumBudget={maximumBudget}
                        />

                        <TravelOptions
                            options={travelOptions}
                        />

                    </div>

                    {/* FOOD + NEARBY */}

                    <div className="mt-5 grid gap-4 lg:grid-cols-2">

                        <FoodRecommendations
                            foods={foodRecommendations}
                            remainingBudget={300}
                        />

                        <NearbyDestinations
                            destinations={
                                nearbyDestinations
                            }
                            remainingBudget={300}
                        />

                    </div>

                    {/* SMART RECOMMENDATIONS */}

                    <div className="mt-7">

                        <SmartRecommendations
                            destinations={
                                nearbyDestinations
                            }
                            remainingBudget={300}
                            availableMinutes={240}
                        />

                    </div>

                </section>
            </PageContainer>
        </main>
    );
}