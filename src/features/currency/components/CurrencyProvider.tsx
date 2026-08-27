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
    DEFAULT_CURRENCY,
} from "../currency.config";

import type {
    CurrencyCode,
} from "../types";

interface CurrencyContextValue {
    currency: CurrencyCode;
    setCurrency: (currency: CurrencyCode) => void;
}

const CurrencyContext =
    createContext<CurrencyContextValue | null>(
        null,
    );

interface CurrencyProviderProps {
    children: ReactNode;
}

export function CurrencyProvider({
    children,
}: CurrencyProviderProps) {
    const [currency, setCurrencyState] =
        useState<CurrencyCode>(DEFAULT_CURRENCY);

    /*
     * Read saved currency after the component
     * has mounted.
     *
     * setTimeout prevents the React cascading-render
     * warning in strict development mode.
     */
    useEffect(() => {
        const saved = window.localStorage.getItem("fairtrip-currency") as CurrencyCode | null;

        if (saved) {
            setTimeout(() => { setCurrencyState(saved); }, 0);
        }
    }, []);

    const setCurrency = ( nextCurrency: CurrencyCode,) => {
        setCurrencyState(nextCurrency);
        window.localStorage.setItem( "fairtrip-currency", nextCurrency,);
    };
    const value = useMemo(() => ({ currency, setCurrency,}), [currency], );

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);

    if (!context) {
        throw new Error("useCurrency must be used inside CurrencyProvider",);
    }

    return context;
}