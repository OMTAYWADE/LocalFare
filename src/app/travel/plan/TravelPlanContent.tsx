"use client";

import { useEffect, useState } from "react";
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

import CurrencySelector from "@/features/currency/components/CurrencySelector";
import { useCurrency } from "@/features/currency/components/CurrencyProvider";

import type {
    DestinationDetails as DestinationDetailsType,
    FoodRecommendation,
    NearbyDestination,
    TravelOption,
    TripExpense,
} from "@/features/travel/types";

/* =========================================================
   API RESPONSE TYPES
   ========================================================= */

interface TravelPlanResponse {
    destination: DestinationDetailsType | null;
    expenses: TripExpense[];
    travelOptions: TravelOption[];
    foodRecommendations: FoodRecommendation[];
    nearbyDestinations: NearbyDestination[];
}

/* =========================================================
   PAGE
   ========================================================= */

export default function TravelPlanContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const source =
        searchParams.get("source")?.trim() ?? "";

    const destinationQuery =
        searchParams.get("destination")?.trim() ?? "";

    /*
     * No destination entered.
     *
     * We do NOT use sample/default destination data.
     */

    if (!destinationQuery) {
        return (
            <DestinationSearch
                source={source}
                onBack={() => router.push("/travel")}
                onSubmit={(nextSource, destination) => {
                    const params =
                        new URLSearchParams();

                    if (nextSource.trim()) {
                        params.set(
                            "source",
                            nextSource.trim(),
                        );
                    }

                    params.set(
                        "destination",
                        destination.trim(),
                    );

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

    return (
        <main className="min-h-screen bg-[#f7f3ea]">
            <PageContainer>
                <AppHeader />

                <section
                    className="
                        mx-auto
                        w-full
                        max-w-[1080px]
                        px-1
                        pb-16
                        pt-6
                        sm:px-2
                        sm:pb-20
                        sm:pt-10
                    "
                >
                    {/* BACK */}

                    <button
                        type="button"
                        onClick={onBack}
                        className="
                            group
                            mb-6
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            px-2
                            py-1.5
                            text-xs
                            font-bold
                            text-[#6d7974]
                            transition-all
                            duration-300
                            hover:-translate-x-0.5
                            hover:text-[#123c35]
                        "
                    >
                        <ArrowLeft
                            className="
                                h-4
                                w-4
                                transition-transform
                                duration-300
                                group-hover:-translate-x-1
                            "
                        />

                        Back to travel
                    </button>

                    {/* HERO */}

                    <div
                        className="
                            grid
                            items-end
                            gap-6
                            lg:grid-cols-[1fr_300px]
                        "
                    >
                        <div>
                            <div
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-[#123c35]/10
                                    bg-white
                                    px-3
                                    py-1.5
                                    shadow-sm
                                "
                            >
                                <Navigation
                                    className="
                                        h-3.5
                                        w-3.5
                                        text-[#ef713d]
                                    "
                                />

                                <span
                                    className="
                                        text-[9px]
                                        font-black
                                        uppercase
                                        tracking-[0.18em]
                                        text-[#31544d]
                                    "
                                >
                                    Destination planner
                                </span>
                            </div>

                            <h1
                                className="
                                    mt-5
                                    max-w-[650px]
                                    text-4xl
                                    font-black
                                    leading-[0.95]
                                    tracking-[-0.055em]
                                    text-[#123c35]
                                    sm:text-5xl
                                    lg:text-[58px]
                                "
                            >
                                Where are you{" "}
                                <span className="text-[#ef713d]">
                                    headed?
                                </span>
                            </h1>

                            <p
                                className="
                                    mt-4
                                    max-w-[590px]
                                    text-sm
                                    leading-6
                                    text-[#6d7974]
                                    sm:text-[15px]
                                "
                            >
                                Enter your starting point and
                                destination. FairTrip will use
                                real location and travel data to
                                help you understand the journey,
                                cost and places worth exploring.
                            </p>
                        </div>

                        {/* INFO */}

                        <div
                            className="
                                hidden
                                rounded-[22px]
                                border
                                border-[#123c35]/10
                                bg-[#123c35]
                                p-5
                                text-white
                                lg:block
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-[#e8f58d]
                                    text-[#123c35]
                                "
                            >
                                <Sparkles className="h-4 w-4" />
                            </div>

                            <p
                                className="
                                    mt-4
                                    text-xs
                                    font-black
                                    uppercase
                                    tracking-[0.16em]
                                    text-white/50
                                "
                            >
                                Smart planning
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    leading-5
                                    text-white/80
                                "
                            >
                                Compare real places, prices,
                                transport and food before you
                                leave.
                            </p>
                        </div>
                    </div>

                    {/* FORM */}

                    <div
                        className="
                            mt-8
                            rounded-[26px]
                            border
                            border-[#123c35]/10
                            bg-white
                            p-4
                            shadow-[0_18px_55px_rgba(18,60,53,0.06)]
                            sm:p-5
                            lg:mt-10
                            lg:p-6
                        "
                    >
                        <div
                            className="
                                flex
                                flex-wrap
                                items-center
                                justify-between
                                gap-3
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
                                    Your journey
                                </p>

                                <h2
                                    className="
                                        mt-1
                                        text-xl
                                        font-black
                                        tracking-[-0.035em]
                                        text-[#123c35]
                                        sm:text-2xl
                                    "
                                >
                                    Start planning
                                </h2>
                            </div>

                            <div
                                className="
                                    rounded-full
                                    bg-[#f7f3ea]
                                    px-3
                                    py-1.5
                                    text-[10px]
                                    font-bold
                                    text-[#6d7974]
                                "
                            >
                                Real data
                            </div>
                        </div>

                        {/* INPUTS */}

                        <div
                            className="
                                mt-6
                                grid
                                gap-3
                                lg:grid-cols-[1fr_44px_1fr]
                                lg:items-end
                            "
                        >
                            {/* SOURCE */}

                            <div>
                                <label
                                    htmlFor="source"
                                    className="
                                        mb-2
                                        block
                                        text-[9px]
                                        font-black
                                        uppercase
                                        tracking-[0.16em]
                                        text-[#6d7974]
                                    "
                                >
                                    Starting from
                                </label>

                                <div
                                    className="
                                        flex
                                        h-14
                                        items-center
                                        rounded-2xl
                                        border
                                        border-[#123c35]/10
                                        bg-[#fffdf8]
                                        px-4
                                        transition
                                        focus-within:border-[#123c35]/30
                                        focus-within:bg-white
                                    "
                                >
                                    <MapPin
                                        className="
                                            h-4
                                            w-4
                                            shrink-0
                                            text-[#123c35]
                                        "
                                    />

                                    <input
                                        id="source"
                                        value={startLocation}
                                        onChange={(event) =>
                                            setStartLocation(
                                                event.target.value,
                                            )
                                        }
                                        className="
                                            ml-3
                                            min-w-0
                                            w-full
                                            bg-transparent
                                            text-sm
                                            font-bold
                                            text-[#123c35]
                                            outline-none
                                        "
                                        placeholder="Starting location"
                                    />
                                </div>
                            </div>

                            {/* ARROW */}

                            <div
                                className="
                                    hidden
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#e8f58d]
                                    text-[#123c35]
                                    lg:flex
                                "
                            >
                                <ArrowRight className="h-4 w-4" />
                            </div>

                            {/* DESTINATION */}

                            <div>
                                <label
                                    htmlFor="destination"
                                    className="
                                        mb-2
                                        block
                                        text-[9px]
                                        font-black
                                        uppercase
                                        tracking-[0.16em]
                                        text-[#6d7974]
                                    "
                                >
                                    Destination
                                </label>

                                <div
                                    className="
                                        flex
                                        h-14
                                        items-center
                                        rounded-2xl
                                        border
                                        border-[#123c35]/10
                                        bg-[#fffdf8]
                                        px-4
                                        transition
                                        focus-within:border-[#ef713d]/40
                                        focus-within:bg-white
                                    "
                                >
                                    <Search
                                        className="
                                            h-4
                                            w-4
                                            shrink-0
                                            text-[#ef713d]
                                        "
                                    />

                                    <input
                                        id="destination"
                                        value={destination}
                                        onChange={(event) =>
                                            setDestination(
                                                event.target.value,
                                            )
                                        }
                                        onKeyDown={(event) => {
                                            if (
                                                event.key ===
                                                "Enter"
                                            ) {
                                                event.preventDefault();

                                                if (
                                                    destination.trim()
                                                ) {
                                                    onSubmit(
                                                        startLocation,
                                                        destination,
                                                    );
                                                }
                                            }
                                        }}
                                        placeholder="Where do you want to go?"
                                        className="
                                            ml-3
                                            min-w-0
                                            w-full
                                            bg-transparent
                                            text-sm
                                            text-[#123c35]
                                            outline-none
                                            placeholder:text-[#6d7974]/60
                                        "
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ACTION */}

                        <div
                            className="
                                mt-6
                                flex
                                flex-col
                                gap-3
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                        >
                            <p
                                className="
                                    hidden
                                    text-xs
                                    text-[#6d7974]
                                    sm:block
                                "
                            >
                                Search any real destination.
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
                                className="
                                    flex
                                    h-12
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-full
                                    bg-[#123c35]
                                    px-6
                                    text-sm
                                    font-black
                                    text-white
                                    transition-all
                                    duration-300
                                    hover:-translate-y-0.5
                                    hover:bg-[#0d312b]
                                    hover:shadow-[0_12px_30px_rgba(18,60,53,0.18)]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-35
                                    sm:w-auto
                                "
                            >
                                Calculate my trip

                                <ArrowRight
                                    className="
                                        h-4
                                        w-4
                                        text-[#e8f58d]
                                    "
                                />
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

    /*
     * Global currency selected by the user.
     *
     * IMPORTANT:
     * We do not convert any API values here.
     * API values remain INR.
     */
    const {
        currency,
        setCurrency,
    } = useCurrency();

    const [showDetails, setShowDetails] =
        useState(false);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const [plan, setPlan] =
        useState<TravelPlanResponse | null>(null);

    /* =====================================================
       LOAD REAL DATA
       ===================================================== */

    useEffect(() => {
        let cancelled = false;

        async function loadPlan() {
            try {
                setLoading(true);
                setError(null);

                const params =
                    new URLSearchParams();

                params.set(
                    "destination",
                    destinationQuery,
                );

                if (source) {
                    params.set(
                        "source",
                        source,
                    );
                }

                const response =
                    await fetch(
                        `/api/travel/plan?${params.toString()}`,
                        {
                            method: "GET",
                            cache: "no-store",
                        },
                    );

                if (!response.ok) {
                    const body =
                        await response
                            .json()
                            .catch(() => null);

                    throw new Error(
                        body?.error ||
                            "Unable to load travel plan.",
                    );
                }

                const data =
                    (await response.json()) as TravelPlanResponse;

                if (!cancelled) {
                    setPlan(data);
                }
            } catch (err) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "Travel plan loading failed:",
                    err,
                );

                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to load travel plan.",
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadPlan();

        return () => {
            cancelled = true;
        };
    }, [
        source,
        destinationQuery,
    ]);

    /* =====================================================
       LOADING
       ===================================================== */

    if (loading) {
        return (
            <main className="min-h-screen bg-[#f7f3ea]">
                <PageContainer>
                    <AppHeader />

                    <section
                        className="
                            mx-auto
                            w-full
                            max-w-[1080px]
                            px-1
                            py-16
                            sm:px-2
                        "
                    >
                        <div
                            className="
                                rounded-[28px]
                                border
                                border-[#123c35]/10
                                bg-white
                                p-8
                            "
                        >
                            <div
                                className="
                                    h-5
                                    w-32
                                    animate-pulse
                                    rounded
                                    bg-[#f7f3ea]
                                "
                            />

                            <div
                                className="
                                    mt-4
                                    h-10
                                    w-72
                                    animate-pulse
                                    rounded-lg
                                    bg-[#f7f3ea]
                                "
                            />

                            <div
                                className="
                                    mt-3
                                    h-4
                                    w-96
                                    max-w-full
                                    animate-pulse
                                    rounded
                                    bg-[#f7f3ea]
                                "
                            />

                            <div
                                className="
                                    mt-8
                                    grid
                                    gap-4
                                    lg:grid-cols-2
                                "
                            >
                                <div
                                    className="
                                        h-52
                                        animate-pulse
                                        rounded-[24px]
                                        bg-[#f7f3ea]
                                    "
                                />

                                <div
                                    className="
                                        h-52
                                        animate-pulse
                                        rounded-[24px]
                                        bg-[#f7f3ea]
                                    "
                                />
                            </div>
                        </div>
                    </section>
                </PageContainer>
            </main>
        );
    }

    /* =====================================================
       ERROR
       ===================================================== */

    if (error) {
        return (
            <main className="min-h-screen bg-[#f7f3ea]">
                <PageContainer>
                    <AppHeader />

                    <section
                        className="
                            mx-auto
                            w-full
                            max-w-[1080px]
                            px-1
                            py-16
                            sm:px-2
                        "
                    >
                        <div
                            className="
                                rounded-[28px]
                                border
                                border-[#123c35]/10
                                bg-white
                                p-8
                            "
                        >
                            <p
                                className="
                                    text-[9px]
                                    font-black
                                    uppercase
                                    tracking-[0.18em]
                                    text-[#ef713d]
                                "
                            >
                                Travel planner
                            </p>

                            <h1
                                className="
                                    mt-2
                                    text-3xl
                                    font-black
                                    text-[#123c35]
                                "
                            >
                                We couldn't load this trip
                            </h1>

                            <p
                                className="
                                    mt-3
                                    max-w-xl
                                    text-sm
                                    leading-6
                                    text-[#6d7974]
                                "
                            >
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    router.push(
                                        "/travel",
                                    )
                                }
                                className="
                                    mt-6
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    bg-[#123c35]
                                    px-5
                                    py-3
                                    text-sm
                                    font-black
                                    text-white
                                    transition
                                    hover:-translate-y-0.5
                                    hover:bg-[#0d312b]
                                "
                            >
                                <ArrowLeft className="h-4 w-4" />

                                Change journey
                            </button>
                        </div>
                    </section>
                </PageContainer>
            </main>
        );
    }

    /* =====================================================
       NO DATA
       ===================================================== */

    if (
        !plan ||
        !plan.destination
    ) {
        return (
            <main className="min-h-screen bg-[#f7f3ea]">
                <PageContainer>
                    <AppHeader />

                    <section
                        className="
                            mx-auto
                            w-full
                            max-w-[1080px]
                            px-1
                            py-16
                            sm:px-2
                        "
                    >
                        <div
                            className="
                                rounded-[28px]
                                border
                                border-[#123c35]/10
                                bg-white
                                p-8
                            "
                        >
                            <p
                                className="
                                    text-[9px]
                                    font-black
                                    uppercase
                                    tracking-[0.18em]
                                    text-[#ef713d]
                                "
                            >
                                No destination
                            </p>

                            <h1
                                className="
                                    mt-2
                                    text-3xl
                                    font-black
                                    text-[#123c35]
                                "
                            >
                                No destination data found
                            </h1>

                            <p
                                className="
                                    mt-3
                                    text-sm
                                    text-[#6d7974]
                                "
                            >
                                We couldn't find real
                                information for{" "}
                                <strong>
                                    {destinationQuery}
                                </strong>
                                .
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    router.push(
                                        "/travel",
                                    )
                                }
                                className="
                                    mt-6
                                    rounded-full
                                    bg-[#123c35]
                                    px-5
                                    py-3
                                    text-sm
                                    font-black
                                    text-white
                                    transition
                                    hover:-translate-y-0.5
                                    hover:bg-[#0d312b]
                                "
                            >
                                Search another destination
                            </button>
                        </div>
                    </section>
                </PageContainer>
            </main>
        );
    }

    /* =====================================================
       REAL DATA
       ===================================================== */

    const {
        destination,
        expenses,
        travelOptions,
        foodRecommendations,
        nearbyDestinations,
    } = plan;

    /*
     * IMPORTANT:
     *
     * All backend prices are kept in INR.
     *
     * Example:
     *
     * expense.amount = 5000
     *
     * maximumBudget = 5000
     *
     * PriceDisplay later converts it into:
     *
     * ₹5,000 ($59.xx)
     *
     * or
     *
     * ₹5,000 (€xx.xx)
     */

    const maximumBudget =
        expenses.reduce(
            (total, expense) =>
                total + expense.amount,
            0,
        );

    return (
        <main className="min-h-screen bg-[#f7f3ea]">
            <PageContainer>
                <AppHeader />

                <section
                    className="
                        mx-auto
                        w-full
                        max-w-[1080px]
                        px-1
                        pb-16
                        pt-5
                        sm:px-2
                        sm:pb-20
                        sm:pt-7
                    "
                >
                    {/* =================================================
                       TOP NAV
                       ================================================= */}

                    <div
                        className="
                            mb-5
                            flex
                            items-center
                            justify-between
                            gap-3
                        "
                    >
                        {/* BACK */}

                        <button
                            type="button"
                            onClick={() =>
                                router.push(
                                    "/travel",
                                )
                            }
                            className="
                                group
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                px-2
                                py-1.5
                                text-xs
                                font-bold
                                text-[#6d7974]
                                transition-all
                                duration-300
                                hover:-translate-x-0.5
                                hover:text-[#123c35]
                            "
                        >
                            <ArrowLeft
                                className="
                                    h-4
                                    w-4
                                    transition-transform
                                    duration-300
                                    group-hover:-translate-x-1
                                "
                            />

                            Change journey
                        </button>

                        {/* RIGHT SIDE */}

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >
                            {/* =================================================
                               CURRENCY
                               ================================================= */}

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-1
                                    rounded-full
                                    border
                                    border-[#123c35]/10
                                    bg-white
                                    p-1
                                    shadow-sm
                                "
                            >
                                <span
                                    className="
                                        hidden
                                        pl-2
                                        text-[9px]
                                        font-black
                                        uppercase
                                        tracking-[0.12em]
                                        text-[#6d7974]
                                        sm:block
                                    "
                                >
                                    Currency
                                </span>

                                <CurrencySelector
                                    value={currency}
                                    onChange={setCurrency}
                                />
                            </div>

                            {/* =================================================
                               ROUTE
                               ================================================= */}

                            <div
                                className="
                                    hidden
                                    items-center
                                    gap-2
                                    text-[10px]
                                    font-bold
                                    text-[#6d7974]
                                    sm:flex
                                "
                            >
                                <span
                                    className="
                                        max-w-[220px]
                                        truncate
                                        rounded-full
                                        bg-white
                                        px-3
                                        py-1.5
                                    "
                                >
                                    {source ||
                                        "Current location"}
                                </span>

                                <ArrowRight
                                    className="
                                        h-3.5
                                        w-3.5
                                        text-[#ef713d]
                                    "
                                />

                                <span
                                    className="
                                        max-w-[220px]
                                        truncate
                                        rounded-full
                                        bg-[#e8f58d]
                                        px-3
                                        py-1.5
                                        text-[#123c35]
                                    "
                                >
                                    {destination.name}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                       DESTINATION SUMMARY
                       ================================================= */}

                    <DestinationSummary
                        destination={destination}
                        sourceName={
                            source ||
                            "Current location"
                        }
                        onBack={() =>
                            router.push(
                                "/travel",
                            )
                        }
                        onMore={() =>
                            setShowDetails(
                                (current) =>
                                    !current,
                            )
                        }
                    />

                    {/* =================================================
                       DETAILS
                       ================================================= */}

                    {showDetails && (
                        <div className="mt-4">
                            <DestinationDetails
                                destination={
                                    destination
                                }
                            />
                        </div>
                    )}

                    {/* =================================================
                       OVERVIEW
                       ================================================= */}

                    <div
                        className="
                            mt-5
                            grid
                            gap-4
                            lg:grid-cols-[1.05fr_0.95fr]
                        "
                    >
                        <TripBudgetCard
                            expenses={expenses}
                            maximumBudget={
                                maximumBudget
                            }
                        />

                        <TravelOptions
                            options={
                                travelOptions
                            }
                        />
                    </div>

                    {/* =================================================
                       FOOD + NEARBY
                       ================================================= */}

                    <div
                        className="
                            mt-5
                            grid
                            gap-4
                            lg:grid-cols-2
                        "
                    >
                        <FoodRecommendations
                            foods={
                                foodRecommendations
                            }
                            remainingBudget={
                                maximumBudget
                            }
                        />

                        <NearbyDestinations
                            destinations={
                                nearbyDestinations
                            }
                            remainingBudget={
                                maximumBudget
                            }
                        />
                    </div>

                    {/* =================================================
                       SMART RECOMMENDATIONS
                       ================================================= */}

                    <div className="mt-7">
                        <SmartRecommendations
                            destinations={
                                nearbyDestinations
                            }
                            remainingBudget={
                                maximumBudget
                            }
                        />
                    </div>
                </section>
            </PageContainer>
        </main>
    );
}