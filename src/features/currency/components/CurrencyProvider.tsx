"use client";

import {
    createContext,
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
    createContext<CurrencyContextValue | null>(
        null,
    );

interface CurrencyProviderProps {
    children: ReactNode;
}

function isCurrencyCode(
    value: string | null,
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
    /*
     * Always start with USD.
     *
     * This is also our default currency.
     */
    const [
        currency,
        setCurrencyState,
    ] = useState<CurrencyCode>(
        DEFAULT_CURRENCY,
    );

    /*
     * Load saved currency after hydration.
     *
     * We use a microtask so the state update does
     * not happen synchronously during the effect body.
     */
    useEffect(() => {
        const saved =
            window.localStorage.getItem(
                "fairtrip-currency",
            );

        if (!isCurrencyCode(saved)) {
            return;
        }

        if (saved === DEFAULT_CURRENCY) {
            return;
        }

        queueMicrotask(() => {
            setCurrencyState(saved);
        });
    }, []);

    /*
     * Change currency.
     */
    const setCurrency = (
        nextCurrency: CurrencyCode,
    ) => {
        setCurrencyState(nextCurrency);

        window.localStorage.setItem(
            "fairtrip-currency",
            nextCurrency,
        );
    };

    const value = useMemo(
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
        useContext(CurrencyContext);

    if (!context) {
        throw new Error(
            "useCurrency must be used inside CurrencyProvider",
        );
    }

    return context;
}