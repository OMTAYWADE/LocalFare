export type CurrencyCode =
    | "INR"
    | "USD"
    | "EUR"
    | "GBP"
    | "JPY"
    | "AUD"
    | "CAD"
    | "SGD"
    | "AED";

export interface CurrencyInfo {
    code: CurrencyCode;
    name: string;
    symbol: string;
    flag: string;
}

export type ExchangeRates = Record<CurrencyCode, number>;