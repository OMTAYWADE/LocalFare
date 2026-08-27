"use client";

import {
    useEffect,
    useState,
} from "react";

import type { CurrencyCode } from "../types";

import {
    convertFromInr,
} from "../currency.service";

import {
    formatCurrency,
} from "../currency.utils";

interface PriceDisplayProps {
    inr: number;
    currency?: CurrencyCode;
    showInr?: boolean;
    className?: string;
}

export default function PriceDisplay({
    inr,
    currency = "INR",
    showInr = true,
    className = "",
}: PriceDisplayProps) {
    const [
        convertedAmount,
        setConvertedAmount,
    ] = useState<number | null>(
        currency === "INR" ? inr : null,
    );

    useEffect(() => {
        let cancelled = false;

        if (currency === "INR") {
            return;
        }

        async function loadConversion() {
            try {
                const amount =
                    await convertFromInr(
                        inr,
                        currency,
                    );

                if (!cancelled) {
                    setConvertedAmount(amount);
                }
            } catch (error) {
                console.error(
                    "Currency conversion failed:",
                    error,
                );

                if (!cancelled) {
                    setConvertedAmount(null);
                }
            }
        }

        loadConversion();

        return () => {
            cancelled = true;
        };
    }, [inr, currency]);

    /*
     * INR is the base currency.
     */
    if (currency === "INR") {
        return (
            <span
                className={`font-black text-[#123c35] ${className}`}
            >
                {formatCurrency(inr, "INR")}
            </span>
        );
    }

    /*
     * Conversion is still loading.
     */
    if (convertedAmount === null) {
        return (
            <span
                className={`inline-flex flex-wrap items-baseline gap-1.5 ${className}`}
            >
                {showInr && (
                    <span className="font-black text-[#123c35]">
                        {formatCurrency(
                            inr,
                            "INR",
                        )}
                    </span>
                )}

                <span className="text-xs font-medium text-[#6d7974]">
                    (converting...)
                </span>
            </span>
        );
    }

    /*
     * Example:
     *
     * ₹500 ($5.90)
     */
    return (
        <span
            className={`inline-flex flex-wrap items-baseline gap-1.5 ${className}`}
        >
            {showInr && (
                <span className="font-black text-[#123c35]">
                    {formatCurrency(
                        inr,
                        "INR",
                    )}
                </span>
            )}

            <span className="text-xs font-bold text-[#6d7974]">
                (
                {" "}
                {formatCurrency(
                    convertedAmount,
                    currency,
                )}
                {" "}
                )
            </span>
        </span>
    );
}