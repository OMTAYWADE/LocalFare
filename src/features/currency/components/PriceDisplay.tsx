"use client";

import {
    useEffect,
    useState,
} from "react";

import type {
    CurrencyCode,
} from "../types";

import {
    convertFromInr,
} from "../currency.service";

import {
    formatCurrency,
} from "../currency.utils";

import {
    useCurrency,
} from "./CurrencyProvider";

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
        currency: userCurrency,
    } = useCurrency();

    const currency =
        providedCurrency ??
        userCurrency;

    const [
        convertedAmount,
        setConvertedAmount,
    ] = useState<number | null>(
        currency === "INR"
            ? inr
            : null,
    );

    useEffect(() => {
        let cancelled = false;

        /*
         * INR doesn't need conversion.
         */

        if (
            currency === "INR"
        ) {
            setConvertedAmount(
                inr,
            );

            return () => {
                cancelled =
                    true;
            };
        }

        /*
         * Validate price.
         */

        if (
            !Number.isFinite(
                inr,
            )
        ) {
            setConvertedAmount(
                null,
            );

            return () => {
                cancelled =
                    true;
            };
        }

        async function loadConversion() {
            try {
                const amount =
                    await convertFromInr(
                        inr,
                        currency,
                    );

                if (
                    !cancelled
                ) {
                    setConvertedAmount(
                        amount,
                    );
                }
            } catch (
                error
            ) {
                console.error(
                    "Currency conversion failed:",
                    error,
                );

                if (
                    !cancelled
                ) {
                    setConvertedAmount(
                        null,
                    );
                }
            }
        }

        void loadConversion();

        return () => {
            cancelled =
                true;
        };
    }, [
        inr,
        currency,
    ]);

    /*
     * =========================================================
     * INR
     * =========================================================
     */

    if (
        currency ===
        "INR"
    ) {
        return (
            <span
                className={[
                    "font-black text-[#123c35]",
                    className,
                ].join(" ")}
            >
                {formatCurrency(
                    inr,
                    "INR",
                )}
            </span>
        );
    }

    /*
     * =========================================================
     * CONVERSION LOADING / FAILED
     * =========================================================
     */

    if (
        convertedAmount ===
        null
    ) {
        return (
            <span
                className={[
                    "inline-flex flex-wrap items-baseline gap-1.5",
                    className,
                ].join(" ")}
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
     * =========================================================
     * FINAL DISPLAY
     * =========================================================
     */

    return (
        <span
            className={[
                "inline-flex flex-wrap items-baseline gap-1.5",
                className,
            ].join(" ")}
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
                {formatCurrency(
                    convertedAmount,
                    currency,
                )}
                )
            </span>
        </span>
    );
}