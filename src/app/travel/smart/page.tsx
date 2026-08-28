"use client";

import {
    ArrowLeft,
    ArrowRight,
    Clock3,
    Compass,
    MapPin,
    Sparkles,
    Wallet,
    LocateFixed,
    ShieldCheck,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useState } from "react";

import BudgetCurrencyInput from "@/features/currency/components/BudgetCurrencyInput";
import { useCurrency } from "@/features/currency/components/CurrencyProvider";

const interests = [
    "Attractions",
    "Nature",
    "Food",
    "History",
    "Shopping",
    "Relaxing",
];

const times = [
    "2 hours",
    "4 hours",
    "Half day",
    "Full day",
];

export default function SmartTravelPage() {
    const router = useRouter();

    /*
     * ============================================================
     * CURRENCY
     * ============================================================
     *
     * CurrencyProvider controls the user's selected currency.
     *
     * IMPORTANT:
     *
     * The budget itself remains INR internally.
     *
     * Example:
     *
     * User selects USD
     *        ↓
     * enters $100
     *        ↓
     * BudgetCurrencyInput converts it to INR
     *        ↓
     * budget = INR value
     *        ↓
     * recommendation engine receives INR
     */
    const { currency } = useCurrency();

    /*
     * Budget is ALWAYS stored in INR.
     */
    const [budget, setBudget] =
        useState<number>(5000);

    const [interest, setInterest] =
        useState("Attractions");

    const [time, setTime] =
        useState("4 hours");

    /*
     * ============================================================
     * FIND RECOMMENDATIONS
     * ============================================================
     */
    const handleFind = () => {
        if (!Number.isFinite(budget) || budget <= 0) {
            return;
        }

        const params = new URLSearchParams({
            mode: "smart",

            /*
             * Recommendation system expects INR.
             */
            budget: String(
                Math.round(budget),
            ),

            interest,
            time,
        });

        router.push(
            `/explore?${params.toString()}`,
        );
    };

    return (
        <main className="min-h-screen overflow-hidden bg-[#f7f3ea] text-[#123c35]">
            {/* =====================================================
                BACKGROUND
            ====================================================== */}

            <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
                {/* Lime glow */}
                <div
                    className="
                        absolute
                        -right-40
                        top-0
                        h-[420px]
                        w-[420px]
                        rounded-full
                        bg-[#e8f58d]/35
                        blur-[100px]
                    "
                />

                {/* Cyan glow */}
                <div
                    className="
                        absolute
                        -left-40
                        top-[38%]
                        h-[420px]
                        w-[420px]
                        rounded-full
                        bg-[#ccecf3]/50
                        blur-[100px]
                    "
                />

                {/* Orange glow */}
                <div
                    className="
                        absolute
                        bottom-[-120px]
                        right-[15%]
                        h-[320px]
                        w-[320px]
                        rounded-full
                        bg-[#f9dfd0]/50
                        blur-[90px]
                    "
                />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* =================================================
                    TOP NAV
                ================================================== */}

                <header className="flex items-center justify-between pt-5 sm:pt-7">
                    <button
                        type="button"
                        onClick={() =>
                            router.push("/travel")
                        }
                        className="
                            group
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            px-2
                            py-2
                            text-xs
                            font-black
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

                    {/* Currency indicator */}
                    <div
                        className="
                            hidden
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-[#123c35]/10
                            bg-white/75
                            px-3
                            py-2
                            shadow-sm
                            backdrop-blur-xl
                            sm:flex
                        "
                    >
                        <Wallet
                            className="h-3.5 w-3.5 text-[#ef713d]"
                        />

                        <span
                            className="
                                text-[9px]
                                font-black
                                uppercase
                                tracking-[0.15em]
                                text-[#6d7974]
                            "
                        >
                            Currency
                        </span>

                        <span
                            className="
                                rounded-full
                                bg-[#e8f58d]
                                px-2
                                py-0.5
                                text-[9px]
                                font-black
                                text-[#123c35]
                            "
                        >
                            {currency}
                        </span>
                    </div>
                </header>

                {/* =================================================
                    MAIN CONTENT
                ================================================== */}

                <section
                    className="
                        grid
                        gap-8
                        pb-12
                        pt-7
                        sm:gap-10
                        sm:pb-20
                        sm:pt-10
                        lg:grid-cols-[0.9fr_1.1fr]
                        lg:items-center
                        lg:gap-16
                        lg:pt-14
                    "
                >
                    {/* =================================================
                        LEFT / HERO
                    ================================================== */}

                    <div className="min-w-0">
                        {/* Small identity block */}
                        <div className="flex items-center gap-3">
                            <div
                                className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-[15px]
                                    bg-[#123c35]
                                    text-[#e8f58d]
                                    shadow-[0_14px_35px_rgba(18,60,53,0.18)]
                                    transition-all
                                    duration-500
                                    hover:rotate-3
                                    hover:scale-105
                                "
                            >
                                <Compass className="h-5 w-5" />
                            </div>

                            <div>
                                <p
                                    className="
                                        text-[9px]
                                        font-black
                                        uppercase
                                        tracking-[0.2em]
                                        text-[#ef713d]
                                    "
                                >
                                    FairTrip intelligence
                                </p>

                                <p
                                    className="
                                        mt-0.5
                                        text-[10px]
                                        font-bold
                                        text-[#6d7974]
                                    "
                                >
                                    Smart local discovery
                                </p>
                            </div>
                        </div>

                        {/* Heading */}
                        <h1
                            className="
                                mt-6
                                max-w-2xl
                                text-[43px]
                                font-black
                                leading-[0.91]
                                tracking-[-0.065em]
                                text-[#123c35]
                                sm:mt-7
                                sm:text-6xl
                                lg:text-[68px]
                            "
                        >
                            Let FairTrip
                            <br />

                            choose{" "}

                            <span
                                className="
                                    bg-gradient-to-r
                                    from-[#ef713d]
                                    via-[#ef713d]
                                    to-[#d85a2c]
                                    bg-clip-text
                                    text-transparent
                                "
                            >
                                better.
                            </span>
                        </h1>

                        {/* Description */}
                        <p
                            className="
                                mt-5
                                max-w-xl
                                text-sm
                                leading-6
                                text-[#6d7974]
                                sm:mt-6
                                sm:text-base
                                sm:leading-7
                            "
                        >
                            Tell us what matters to you.
                            FairTrip compares nearby places
                            using your budget, distance,
                            available time and preferences.
                        </p>

                        {/* =================================================
                            VALUE POINTS
                        ================================================== */}

                        <div
                            className="
                                mt-7
                                grid
                                grid-cols-2
                                gap-2.5
                                sm:mt-9
                                sm:gap-3
                            "
                        >
                            <SmartFeature
                                icon={MapPin}
                                title="Nearby"
                                text="Distance matters."
                            />

                            <SmartFeature
                                icon={Wallet}
                                title="Fair price"
                                text="Fits your budget."
                            />

                            <SmartFeature
                                icon={Clock3}
                                title="Time fit"
                                text="Works with your day."
                            />

                            <SmartFeature
                                icon={ShieldCheck}
                                title="FairTrip score"
                                text="Better matches first."
                            />
                        </div>

                        {/* Mobile currency information */}
                        <div
                            className="
                                mt-5
                                flex
                                items-center
                                gap-2
                                text-[10px]
                                font-bold
                                text-[#6d7974]
                                sm:hidden
                            "
                        >
                            <span
                                className="
                                    flex
                                    h-7
                                    w-7
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#e8f58d]
                                    text-[#123c35]
                                "
                            >
                                {currency}
                            </span>

                            <span>
                                Prices shown in your selected
                                currency.
                            </span>
                        </div>
                    </div>

                    {/* =================================================
                        FORM CARD
                    ================================================== */}

                    <div
                        className="
                            relative
                            overflow-hidden
                            rounded-[28px]
                            border
                            border-[#123c35]/10
                            bg-white/90
                            p-4
                            shadow-[0_25px_90px_rgba(18,60,53,0.10)]
                            backdrop-blur-xl
                            sm:rounded-[34px]
                            sm:p-7
                            lg:p-8
                        "
                    >
                        {/* Gradient decoration */}
                        <div
                            className="
                                pointer-events-none
                                absolute
                                -right-24
                                -top-24
                                h-64
                                w-64
                                rounded-full
                                bg-gradient-to-br
                                from-[#e8f58d]/60
                                via-[#ccecf3]/35
                                to-transparent
                                blur-2xl
                            "
                        />

                        <div
                            className="
                                pointer-events-none
                                absolute
                                -bottom-24
                                -left-24
                                h-52
                                w-52
                                rounded-full
                                bg-[#f9dfd0]/40
                                blur-3xl
                            "
                        />

                        <div className="relative">
                            {/* =================================================
                                FORM HEADER
                            ================================================== */}

                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-full
                                            bg-[#f7f3ea]
                                            px-3
                                            py-1.5
                                        "
                                    >
                                        <Sparkles
                                            className="
                                                h-3
                                                w-3
                                                text-[#ef713d]
                                            "
                                        />

                                        <span
                                            className="
                                                text-[8px]
                                                font-black
                                                uppercase
                                                tracking-[0.16em]
                                                text-[#123c35]
                                            "
                                        >
                                            Smart planning
                                        </span>
                                    </div>

                                    <h2
                                        className="
                                            mt-3
                                            text-xl
                                            font-black
                                            tracking-[-0.04em]
                                            text-[#123c35]
                                            sm:text-2xl
                                        "
                                    >
                                        What are you looking for?
                                    </h2>

                                    <p
                                        className="
                                            mt-1.5
                                            max-w-md
                                            text-xs
                                            leading-5
                                            text-[#6d7974]
                                        "
                                    >
                                        Set your budget,
                                        interest and available
                                        time. We'll handle the
                                        ranking.
                                    </p>
                                </div>

                                {/* Currency badge */}
                                <div
                                    className="
                                        shrink-0
                                        rounded-full
                                        bg-[#123c35]
                                        px-2.5
                                        py-1.5
                                        text-[9px]
                                        font-black
                                        text-[#e8f58d]
                                    "
                                >
                                    {currency}
                                </div>
                            </div>

                            {/* =================================================
                                LOCATION
                            ================================================== */}

                            <div className="mt-6 sm:mt-7">
                                <label
                                    className="
                                        text-[9px]
                                        font-black
                                        uppercase
                                        tracking-[0.15em]
                                        text-[#6d7974]
                                    "
                                >
                                    Starting location
                                </label>

                                <div
                                    className="
                                        mt-2
                                        flex
                                        min-h-[58px]
                                        items-center
                                        gap-3
                                        rounded-[18px]
                                        border
                                        border-[#123c35]/10
                                        bg-[#fffdf8]
                                        px-3.5
                                        transition-all
                                        duration-300
                                        hover:border-[#123c35]/20
                                        hover:bg-white
                                    "
                                >
                                    <span
                                        className="
                                            flex
                                            h-9
                                            w-9
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-[#e8f58d]
                                            text-[#123c35]
                                        "
                                    >
                                        <MapPin className="h-4 w-4" />
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <p
                                            className="
                                                text-[8px]
                                                font-black
                                                uppercase
                                                tracking-[0.14em]
                                                text-[#6d7974]
                                            "
                                        >
                                            Your current location
                                        </p>

                                        <p
                                            className="
                                                mt-0.5
                                                truncate
                                                text-sm
                                                font-black
                                                text-[#123c35]
                                            "
                                        >
                                            Current location
                                        </p>
                                    </div>

                                    <span
                                        className="
                                            flex
                                            h-8
                                            w-8
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-[#123c35]
                                            text-[#e8f58d]
                                        "
                                    >
                                        <LocateFixed className="h-3.5 w-3.5" />
                                    </span>
                                </div>
                            </div>

                            {/* =================================================
                                BUDGET
                            ================================================== */}

                            <div className="mt-5 sm:mt-6">
                                <BudgetCurrencyInput
                                    valueInr={budget}
                                    onChangeInr={setBudget}
                                    min={0}
                                    max={10000000}
                                />
                            </div>

                            {/* =================================================
                                INTEREST
                            ================================================== */}

                            <div className="mt-5 sm:mt-6">
                                <div className="flex items-center justify-between gap-3">
                                    <p
                                        className="
                                            text-[9px]
                                            font-black
                                            uppercase
                                            tracking-[0.15em]
                                            text-[#6d7974]
                                        "
                                    >
                                        What sounds good?
                                    </p>

                                    <span
                                        className="
                                            text-[9px]
                                            font-bold
                                            text-[#ef713d]
                                        "
                                    >
                                        Pick one
                                    </span>
                                </div>

                                <div
                                    className="
                                        mt-3
                                        grid
                                        grid-cols-2
                                        gap-2
                                        sm:grid-cols-3
                                    "
                                >
                                    {interests.map(
                                        (item) => {
                                            const active =
                                                interest ===
                                                item;

                                            return (
                                                <button
                                                    key={item}
                                                    type="button"
                                                    onClick={() =>
                                                        setInterest(
                                                            item,
                                                        )
                                                    }
                                                    className={`
                                                        min-h-[42px]
                                                        rounded-[14px]
                                                        px-3
                                                        py-2.5
                                                        text-[11px]
                                                        font-black
                                                        transition-all
                                                        duration-300
                                                        active:scale-95
                                                        ${
                                                            active
                                                                ? "bg-[#123c35] text-white shadow-[0_8px_22px_rgba(18,60,53,0.15)]"
                                                                : "border border-[#123c35]/10 bg-[#fffdf8] text-[#31544d] hover:-translate-y-0.5 hover:border-[#123c35]/20 hover:bg-white"
                                                        }
                                                    `}
                                                >
                                                    {item}
                                                </button>
                                            );
                                        },
                                    )}
                                </div>
                            </div>

                            {/* =================================================
                                TIME
                            ================================================== */}

                            <div className="mt-5 sm:mt-6">
                                <div className="flex items-center gap-2">
                                    <Clock3 className="h-3.5 w-3.5 text-[#ef713d]" />

                                    <p
                                        className="
                                            text-[9px]
                                            font-black
                                            uppercase
                                            tracking-[0.15em]
                                            text-[#6d7974]
                                        "
                                    >
                                        How much time do you have?
                                    </p>
                                </div>

                                <div
                                    className="
                                        mt-3
                                        grid
                                        grid-cols-2
                                        gap-2
                                    "
                                >
                                    {times.map(
                                        (item) => {
                                            const active =
                                                time ===
                                                item;

                                            return (
                                                <button
                                                    key={item}
                                                    type="button"
                                                    onClick={() =>
                                                        setTime(
                                                            item,
                                                        )
                                                    }
                                                    className={`
                                                        min-h-[44px]
                                                        rounded-[14px]
                                                        px-3
                                                        py-2.5
                                                        text-xs
                                                        font-black
                                                        transition-all
                                                        duration-300
                                                        active:scale-[0.98]
                                                        ${
                                                            active
                                                                ? "bg-[#e8f58d] text-[#123c35] shadow-[0_7px_20px_rgba(203,233,91,0.22)]"
                                                                : "border border-[#123c35]/10 bg-[#fffdf8] text-[#6d7974] hover:bg-white hover:text-[#123c35]"
                                                        }
                                                    `}
                                                >
                                                    {item}
                                                </button>
                                            );
                                        },
                                    )}
                                </div>
                            </div>

                            {/* =================================================
                                FIND BUTTON
                            ================================================== */}

                            <button
                                type="button"
                                onClick={handleFind}
                                disabled={
                                    !Number.isFinite(
                                        budget,
                                    ) ||
                                    budget <= 0
                                }
                                className="
                                    group
                                    mt-6
                                    flex
                                    min-h-[56px]
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-full
                                    bg-gradient-to-r
                                    from-[#123c35]
                                    to-[#174d44]
                                    px-5
                                    text-sm
                                    font-black
                                    text-white
                                    shadow-[0_15px_40px_rgba(18,60,53,0.18)]
                                    transition-all
                                    duration-300
                                    hover:-translate-y-1
                                    hover:shadow-[0_20px_45px_rgba(18,60,53,0.24)]
                                    active:translate-y-0
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                    sm:mt-7
                                "
                            >
                                <Sparkles
                                    className="
                                        h-4
                                        w-4
                                        text-[#e8f58d]
                                        transition-transform
                                        duration-300
                                        group-hover:rotate-12
                                    "
                                />

                                <span>
                                    Find my best places
                                </span>

                                <ArrowRight
                                    className="
                                        h-4
                                        w-4
                                        text-[#e8f58d]
                                        transition-transform
                                        duration-300
                                        group-hover:translate-x-1
                                    "
                                />
                            </button>

                            {/* =================================================
                                CURRENCY EXPLANATION
                            ================================================== */}

                            <div
                                className="
                                    mt-3
                                    flex
                                    items-start
                                    justify-center
                                    gap-2
                                    text-center
                                    text-[9px]
                                    leading-4
                                    text-[#6d7974]
                                "
                            >
                                <Wallet
                                    className="
                                        mt-0.5
                                        h-3
                                        w-3
                                        shrink-0
                                    "
                                />

                                <p>
                                    Your budget is shown in{" "}
                                    <span className="font-black text-[#123c35]">
                                        {currency}
                                    </span>{" "}
                                    and converted to INR internally
                                    for fair local-price comparison.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

/* ================================================================
   SMART FEATURE
================================================================ */

function SmartFeature({
    icon: Icon,
    title,
    text,
}: {
    icon: typeof MapPin;
    title: string;
    text: string;
}) {
    return (
        <div
            className="
                group
                rounded-[18px]
                border
                border-[#123c35]/8
                bg-white/75
                p-3.5
                backdrop-blur-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-white
                hover:shadow-[0_14px_35px_rgba(18,60,53,0.08)]
                sm:rounded-[20px]
                sm:p-4
            "
        >
            <span
                className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-[10px]
                    bg-[#f7f3ea]
                    text-[#ef713d]
                    transition-all
                    duration-300
                    group-hover:scale-105
                    group-hover:bg-[#e8f58d]
                    group-hover:text-[#123c35]
                "
            >
                <Icon className="h-4 w-4" />
            </span>

            <p
                className="
                    mt-2.5
                    text-[11px]
                    font-black
                    text-[#123c35]
                    sm:mt-3
                    sm:text-xs
                "
            >
                {title}
            </p>

            <p
                className="
                    mt-1
                    text-[10px]
                    leading-4
                    text-[#6d7974]
                    sm:text-[11px]
                "
            >
                {text}
            </p>
        </div>
    );
}