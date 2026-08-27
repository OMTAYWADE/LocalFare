import type { CurrencyCode, CurrencyInfo } from "./types";

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
    INR: {
        code: "INR",
        name: "Indian Rupee",
        symbol: "₹",
        flag: "🇮🇳",
    },

    USD: {
        code: "USD",
        name: "US Dollar",
        symbol: "$",
        flag: "🇺🇸",
    },

    EUR: {
        code: "EUR",
        name: "Euro",
        symbol: "€",
        flag: "🇪🇺",
    },

    GBP: {
        code: "GBP",
        name: "British Pound",
        symbol: "£",
        flag: "🇬🇧",
    },

    JPY: {
        code: "JPY",
        name: "Japanese Yen",
        symbol: "¥",
        flag: "🇯🇵",
    },

    AUD: {
        code: "AUD",
        name: "Australian Dollar",
        symbol: "A$",
        flag: "🇦🇺",
    },

    CAD: {
        code: "CAD",
        name: "Canadian Dollar",
        symbol: "C$",
        flag: "🇨🇦",
    },

    SGD: {
        code: "SGD",
        name: "Singapore Dollar",
        symbol: "S$",
        flag: "🇸🇬",
    },

    AED: {
        code: "AED",
        name: "UAE Dirham",
        symbol: "د.إ",
        flag: "🇦🇪",
    },
};

export const DEFAULT_CURRENCY: CurrencyCode = "INR";