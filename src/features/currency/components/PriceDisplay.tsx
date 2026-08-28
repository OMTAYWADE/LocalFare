"use client";

import { useEffect, useState } from "react";

import type { CurrencyCode } from "../types";

import { convertFromInr } from "../currency.service";
import { formatCurrency } from "../currency.utils";

import { useCurrency } from "./CurrencyProvider";

interface PriceDisplayProps {
    inr: number;
    currency?: CurrencyCode;
    showInr?: boolean;
    className?: string;
}

export default function PriceDisplay({
    inr,
    currency: providedCurrency,
    showInr = true,
    className = "",
}: PriceDisplayProps) {
    const {
        currency: globalCurrency,
    } = useCurrency();

    /*
     * Use explicitly provided currency when available.
     * Otherwise use the global FairTrip currency.
     */
    const currency =
        providedCurrency ?? globalCurrency;

    /*
     * Only foreign-currency conversion needs state.
     *
     * INR itself does not need conversion.
     */
    const [
        convertedAmount,
        setConvertedAmount,
    ] = useState<number | null>(null);

    useEffect(() => {
        let cancelled = false;

        /*
         * INR is already the base currency.
         *
         * IMPORTANT:
         * We do NOT call setState here.
         */
        if (currency === "INR") {
            return () => {
                cancelled = true;
            };
        }

        async function loadConversion() {
            try {
                const amount =
                    await convertFromInr(
                        inr,
                        currency,
                    );

                if (!cancelled) {
                    setConvertedAmount(
                        amount,
                    );
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
     * =====================================================
     * INR
     * =====================================================
     *
     * No state required.
     */
    if (currency === "INR") {
        return (
            <span
                className={`font-black text-[#123c35] ${className}`}
            >
                {formatCurrency(
                    inr,
                    "INR",
                )}
            </span>
        );
    }

    /*
     * =====================================================
     * FOREIGN CURRENCY - LOADING
     * =====================================================
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

                <span
                    className="
                        text-xs
                        font-bold
                        text-[#6d7974]
                    "
                >
                    (converting...)
                </span>
            </span>
        );
    }

    /*
     * =====================================================
     * FOREIGN CURRENCY
     * =====================================================
     *
     * Example:
     *
     * ₹8500 ($100.30)
     */

    return (
        <span
            className={`inline-flex flex-wrap items-baseline gap-1.5 ${className}`}
        >
            {showInr && (
                <span
                    className="
                        font-black
                        text-[#123c35]
                    "
                >
                    {formatCurrency(
                        inr,
                        "INR",
                    )}
                </span>
            )}

            <span
                className="
                    text-xs
                    font-bold
                    text-[#6d7974]
                "
            >
                (
                {formatCurrency(
                    convertedAmount,
                    currency,
                )}
                )
            </span>
        </span>
    );
}