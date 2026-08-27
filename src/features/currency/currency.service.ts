import type { CurrencyCode, ExchangeRates } from "./types";

const FALLBACK_RATES: ExchangeRates = {
    INR: 1,

    // Approximate fallback values.
    // Live API rates are preferred whenever available.
    USD: 0.0118,
    EUR: 0.0101,
    GBP: 0.0088,
    JPY: 1.73,
    AUD: 0.0165,
    CAD: 0.0161,
    SGD: 0.0151,
    AED: 0.0433,
};

let cachedRates: ExchangeRates | null = null;
let cachedAt = 0;

const CACHE_DURATION = 60 * 60 * 1000;

export async function getExchangeRates(): Promise<ExchangeRates> {
    const now = Date.now();

    if (
        cachedRates &&
        now - cachedAt < CACHE_DURATION
    ) {
        return cachedRates;
    }

    try {
        const response = await fetch(
            "https://open.er-api.com/v6/latest/INR",
            {
                cache: "no-store",
            },
        );

        if (!response.ok) {
            throw new Error(
                `Currency API failed: ${response.status}`,
            );
        }

        const data = await response.json();

        const rates: ExchangeRates = {
            INR: 1,
            USD: Number(data?.rates?.USD) || FALLBACK_RATES.USD,
            EUR: Number(data?.rates?.EUR) || FALLBACK_RATES.EUR,
            GBP: Number(data?.rates?.GBP) || FALLBACK_RATES.GBP,
            JPY: Number(data?.rates?.JPY) || FALLBACK_RATES.JPY,
            AUD: Number(data?.rates?.AUD) || FALLBACK_RATES.AUD,
            CAD: Number(data?.rates?.CAD) || FALLBACK_RATES.CAD,
            SGD: Number(data?.rates?.SGD) || FALLBACK_RATES.SGD,
            AED: Number(data?.rates?.AED) || FALLBACK_RATES.AED,
        };

        cachedRates = rates;
        cachedAt = now;

        return rates;
    } catch (error) {
        console.warn(
            "Currency API unavailable. Using fallback rates.",
            error,
        );

        return FALLBACK_RATES;
    }
}

export async function convertFromInr(
    amountInr: number,
    targetCurrency: CurrencyCode,
): Promise<number> {
    if (!Number.isFinite(amountInr)) {
        return 0;
    }

    if (targetCurrency === "INR") {
        return amountInr;
    }

    const rates = await getExchangeRates();
    const rate = rates[targetCurrency];

    if (!rate || !Number.isFinite(rate)) {
        return amountInr;
    }

    return amountInr * rate;
}