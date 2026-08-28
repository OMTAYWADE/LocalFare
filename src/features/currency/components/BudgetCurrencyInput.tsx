"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    ArrowRightLeft,
    Loader2,
    Wallet,
} from "lucide-react";

import {
    CURRENCIES,
} from "../currency.config";

import {
    convertFromInr,
} from "../currency.service";

import {
    formatCurrency,
} from "../currency.utils";

import {
    useCurrency,
} from "./CurrencyProvider";

import CurrencySelector from "./CurrencySelector";

interface BudgetCurrencyInputProps {
    valueInr: number;
    onChangeInr: (
        value: number,
    ) => void;
    min?: number;
    max?: number;
}

export default function BudgetCurrencyInput({
    valueInr,
    onChangeInr,
    min = 0,
    max = 10000000,
}: BudgetCurrencyInputProps) {
    const {
        currency,
        setCurrency,
    } = useCurrency();

    const [displayAmount, setDisplayAmount] =
        useState("");

    const [converting, setConverting] =
        useState(false);

    /*
     * Convert the internal INR budget
     * into the currently selected currency.
     *
     * Example:
     *
     * INR 8500
     * ↓
     * USD
     * ↓
     * $100
     */
    useEffect(() => {
        let cancelled = false;

        async function syncDisplayAmount() {
            if (!Number.isFinite(valueInr)) {
                setDisplayAmount("");
                return;
            }

            if (currency === "INR") {
                setDisplayAmount(
                    String(
                        Math.round(valueInr * 100) /
                            100,
                    ),
                );

                return;
            }

            setConverting(true);

            try {
                const converted =
                    await convertFromInr(
                        valueInr,
                        currency,
                    );

                if (!cancelled) {
                    setDisplayAmount(
                        String(
                            Math.round(
                                converted * 100,
                            ) / 100,
                        ),
                    );
                }
            } catch {
                if (!cancelled) {
                    setDisplayAmount("");
                }
            } finally {
                if (!cancelled) {
                    setConverting(false);
                }
            }
        }

        syncDisplayAmount();

        return () => {
            cancelled = true;
        };
    }, [valueInr, currency]);

    /*
     * User types in THEIR currency.
     *
     * Example:
     *
     * USD selected
     * User types 100
     * ↓
     * convert 100 USD → INR
     * ↓
     * onChangeInr(8500)
     */
    const handleAmountChange = (
        rawValue: string,
    ) => {
        setDisplayAmount(rawValue);

        if (rawValue.trim() === "") {
            onChangeInr(0);
            return;
        }

        const amount = Number(rawValue);

        if (!Number.isFinite(amount)) {
            return;
        }

        if (amount < min) {
            return;
        }

        if (currency === "INR") {
            onChangeInr(
                Math.min(amount, max),
            );

            return;
        }

        /*
         * Conversion is async.
         */
        void convertToInr(amount);
    };

    async function convertToInr(
        amount: number,
    ) {
        setConverting(true);

        try {
            /*
             * We have INR → selected currency.
             *
             * To convert selected currency → INR,
             * use the same rate.
             *
             * Example:
             *
             * 1 INR = 0.0118 USD
             *
             * $100 / 0.0118
             * = ₹8474
             */
            const ratesResponse =
                await fetch(
                    "/api/currency/rates",
                    {
                        cache: "no-store",
                    },
                );

            if (!ratesResponse.ok) {
                throw new Error(
                    "Currency rates unavailable",
                );
            }

            const data =
                await ratesResponse.json();

            const rate =
                Number(
                    data?.rates?.[currency],
                );

            if (
                !Number.isFinite(rate) ||
                rate <= 0
            ) {
                throw new Error(
                    "Invalid exchange rate",
                );
            }

            const inr =
                amount / rate;

            onChangeInr(
                Math.min(inr, max),
            );
        } catch (error) {
            console.error(
                "Currency conversion failed:",
                error,
            );
        } finally {
            setConverting(false);
        }
    }

    const info =
        CURRENCIES[currency];

    return (
        <div>
            {/* LABEL */}
            <div className="flex items-center justify-between gap-3">
                <label
                    htmlFor="smart-budget"
                    className="
                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.15em]
                        text-[#6d7974]
                    "
                >
                    Your budget
                </label>

                <span
                    className="
                        text-[9px]
                        font-bold
                        text-[#6d7974]
                    "
                >
                    Display currency
                </span>
            </div>

            {/* INPUT */}
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
                    px-3
                    transition
                    focus-within:border-[#123c35]/30
                    focus-within:bg-white
                    sm:px-4
                "
            >
                {/* Currency symbol */}
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
                        text-sm
                        font-black
                        text-[#123c35]
                    "
                >
                    {info.symbol}
                </span>

                {/* Amount */}
                <input
                    id="smart-budget"
                    type="number"
                    min={min}
                    max={max}
                    step="0.01"
                    value={displayAmount}
                    onChange={(event) =>
                        handleAmountChange(
                            event.target.value,
                        )
                    }
                    className="
                        min-w-0
                        flex-1
                        bg-transparent
                        text-lg
                        font-black
                        text-[#123c35]
                        outline-none
                        placeholder:text-[#6d7974]/40
                    "
                    placeholder="100"
                />

                {/* Currency selector */}
                <CurrencySelector
                    value={currency}
                    onChange={setCurrency}
                    compact
                />

                {/* Loading */}
                {converting && (
                    <Loader2
                        className="
                            h-4
                            w-4
                            shrink-0
                            animate-spin
                            text-[#ef713d]
                        "
                    />
                )}
            </div>

            {/* LOCAL INR REFERENCE */}
            <div
                className="
                    mt-2
                    flex
                    items-center
                    justify-between
                    gap-3
                    rounded-[14px]
                    bg-[#123c35]/[0.04]
                    px-3
                    py-2.5
                "
            >
                <div className="flex items-center gap-2">
                    <ArrowRightLeft
                        className="
                            h-3.5
                            w-3.5
                            text-[#ef713d]
                        "
                    />

                    <span
                        className="
                            text-[9px]
                            font-bold
                            text-[#6d7974]
                        "
                    >
                        FairTrip local value
                    </span>
                </div>

                <span
                    className="
                        text-[11px]
                        font-black
                        text-[#123c35]
                    "
                >
                    {formatCurrency(
                        valueInr,
                        "INR",
                    )}
                </span>
            </div>

            {/* EXPLANATION */}
            <p
                className="
                    mt-2
                    text-[9px]
                    leading-4
                    text-[#6d7974]
                "
            >
                Prices are calculated in INR for
                local comparison and shown in{" "}
                {info.name} for you.
            </p>
        </div>
    );
}