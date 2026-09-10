"use client";

import {
    createContext,
    startTransition,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import {
    CURRENCIES,
    DEFAULT_CURRENCY,
} from "../currency.config";

import type {
    CurrencyCode,
} from "../types";

interface CurrencyContextValue {
    currency: CurrencyCode;

    setCurrency: (
        currency: CurrencyCode,
    ) => void;
}

const CurrencyContext =
    createContext<
        CurrencyContextValue | null
    >(null);

interface CurrencyProviderProps {
    children: ReactNode;
}

function isCurrencyCode(
    value: string | null | undefined,
): value is CurrencyCode {
    if (!value) {
        return false;
    }

    return Object.prototype.hasOwnProperty.call(
        CURRENCIES,
        value,
    );
}

export function CurrencyProvider({
    children,
}: CurrencyProviderProps) {
    const [
        currency,
        setCurrencyState,
    ] = useState<CurrencyCode>(
        DEFAULT_CURRENCY,
    );

    /*
     * =========================================================
     * LOAD SAVED CURRENCY
     * =========================================================
     *
     * Priority:
     *
     * 1. Database preference
     * 2. localStorage
     * 3. INR default
     */

    useEffect(() => {
        let cancelled = false;

        async function loadCurrency() {
            /*
             * First try the authenticated user's
             * saved database preference.
             */

            try {
                const response =
                    await fetch(
                        "/api/profile/currency",
                        {
                            method:
                                "GET",
                            cache:
                                "no-store",
                        },
                    );

                if (
                    response.ok
                ) {
                    const data =
                        (await response.json()) as {
                            currency?: unknown;
                        };

                    if (
                        isCurrencyCode(
                            typeof data.currency ===
                                "string"
                                ? data.currency
                                : undefined,
                        )
                    ) {
                        if (
                            !cancelled
                        ) {
                            startTransition(
                                () => {
                                    setCurrencyState(
                                        data.currency as CurrencyCode,
                                    );

                                    window.localStorage.setItem(
                                        "fairtrip-currency",
                                        data.currency as CurrencyCode,
                                    );
                                },
                            );
                        }

                        return;
                    }
                }
            } catch (
                error
            ) {
                console.warn(
                    "Could not load currency from profile:",
                    error,
                );
            }

            /*
             * Database unavailable/not authenticated.
             * Use the local browser preference.
             */

            const saved =
                window.localStorage.getItem(
                    "fairtrip-currency",
                );

            if (
                isCurrencyCode(
                    saved,
                ) &&
                !cancelled
            ) {
                startTransition(
                    () => {
                        setCurrencyState(
                            saved,
                        );
                    },
                );
            }
        }

        void loadCurrency();

        return () => {
            cancelled =
                true;
        };
    }, []);

    /*
     * =========================================================
     * CHANGE CURRENCY
     * =========================================================
     */

    function setCurrency(
        nextCurrency: CurrencyCode,
    ) {
        /*
         * Update UI immediately.
         */
        setCurrencyState(
            nextCurrency,
        );

        /*
         * Save locally immediately.
         */
        window.localStorage.setItem(
            "fairtrip-currency",
            nextCurrency,
        );

        /*
         * Persist to database.
         *
         * Do not block the UI waiting for the API.
         */
        void fetch(
            "/api/profile/currency",
            {
                method:
                    "PATCH",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify({
                    currency:
                        nextCurrency,
                }),
            },
        ).catch(
            (error) => {
                console.warn(
                    "Currency preference could not be saved to the database:",
                    error,
                );
            },
        );
    }

    const value =
        useMemo(
            () => ({
                currency,

                setCurrency,
            }),
            [currency],
        );

    return (
        <CurrencyContext.Provider
            value={value}
        >
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context =
        useContext(
            CurrencyContext,
        );

    if (!context) {
        throw new Error(
            "useCurrency must be used inside CurrencyProvider",
        );
    }

    return context;
}