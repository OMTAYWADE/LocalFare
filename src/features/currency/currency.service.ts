import type {
    CurrencyCode,
    ExchangeRates,
} from "./types";

const CURRENCY_CODES: CurrencyCode[] = [
    "INR",
    "USD",
    "EUR",
    "GBP",
    "JPY",
    "AUD",
    "CAD",
    "SGD",
    "AED",
];

const RATE_CACHE_DURATION =
    15 * 60 * 1000; // 15 minutes

let cachedRates:
    | ExchangeRates
    | null = null;

let cachedAt = 0;

/*
 * ---------------------------------------------------------
 * RESPONSE TYPES
 * ---------------------------------------------------------
 */

interface ExchangeRateApiResponse {
    result?: string;

    base_code?: string;

    rates?: Record<
        string,
        number
    >;
}

/*
 * ---------------------------------------------------------
 * VALIDATION
 * ---------------------------------------------------------
 */

function isValidRate(
    value: unknown,
): value is number {
    return (
        typeof value === "number" &&
        Number.isFinite(value) &&
        value > 0
    );
}

/*
 * ---------------------------------------------------------
 * GET LIVE EXCHANGE RATES
 * ---------------------------------------------------------
 *
 * All internal application prices remain INR.
 *
 * Example:
 *
 * ₹100 INR
 *      ↓
 * USD rate
 *      ↓
 * $1.17
 *
 * These are exchange/reference rates.
 * They are NOT the exact amount a bank/card provider
 * necessarily charges.
 */

export async function getExchangeRates(): Promise<ExchangeRates> {
    const now =
        Date.now();

    /*
     * Use memory cache for 15 minutes.
     */
    if (
        cachedRates &&
        now - cachedAt <
            RATE_CACHE_DURATION
    ) {
        return cachedRates;
    }

    const endpoint =
        process.env
            .EXCHANGE_RATES_API_URL ??
        "https://open.er-api.com/v6/latest/INR";

    const response =
        await fetch(
            endpoint,
            {
                method: "GET",

                cache:
                    "no-store",

                headers: {
                    Accept:
                        "application/json",
                },
            },
        );

    if (
        !response.ok
    ) {
        throw new Error(
            `Currency rate API failed (${response.status}).`,
        );
    }

    const data =
        (await response.json()) as ExchangeRateApiResponse;

    if (
        data.result ===
        "error"
    ) {
        throw new Error(
            "Currency rate provider returned an error.",
        );
    }

    if (
        !data.rates
    ) {
        throw new Error(
            "Currency rate provider returned no rates.",
        );
    }

    const rates =
        {} as ExchangeRates;

    rates.INR = 1;

    for (
        const currency of
            CURRENCY_CODES
    ) {
        if (
            currency ===
            "INR"
        ) {
            continue;
        }

        const rate =
            data.rates[
                currency
            ];

        if (
            !isValidRate(
                rate,
            )
        ) {
            throw new Error(
                `Missing or invalid exchange rate for ${currency}.`,
            );
        }

        rates[
            currency
        ] = rate;
    }

    cachedRates =
        rates;

    cachedAt =
        now;

    return rates;
}

/*
 * ---------------------------------------------------------
 * INR → SELECTED CURRENCY
 * ---------------------------------------------------------
 */

export async function convertFromInr(
    amountInr: number,
    targetCurrency: CurrencyCode,
): Promise<number> {
    if (
        !Number.isFinite(
            amountInr,
        )
    ) {
        throw new Error(
            "Invalid INR amount.",
        );
    }

    if (
        targetCurrency ===
        "INR"
    ) {
        return amountInr;
    }

    const rates =
        await getExchangeRates();

    const rate =
        rates[
            targetCurrency
        ];

    if (
        !isValidRate(
            rate,
        )
    ) {
        throw new Error(
            `Exchange rate unavailable for ${targetCurrency}.`,
        );
    }

    return (
        amountInr *
        rate
    );
}

/*
 * ---------------------------------------------------------
 * SELECTED CURRENCY → INR
 * ---------------------------------------------------------
 */

export async function convertToInr(
    amount: number,
    sourceCurrency: CurrencyCode,
): Promise<number> {
    if (
        !Number.isFinite(
            amount,
        )
    ) {
        throw new Error(
            "Invalid currency amount.",
        );
    }

    if (
        sourceCurrency ===
        "INR"
    ) {
        return amount;
    }

    const rates =
        await getExchangeRates();

    const rate =
        rates[
            sourceCurrency
        ];

    if (
        !isValidRate(
            rate,
        )
    ) {
        throw new Error(
            `Exchange rate unavailable for ${sourceCurrency}.`,
        );
    }

    return (
        amount /
        rate
    );
}

/*
 * ---------------------------------------------------------
 * GET RATE FOR ONE CURRENCY
 * ---------------------------------------------------------
 */

export async function getExchangeRate(
    currency: CurrencyCode,
): Promise<number> {
    if (
        currency ===
        "INR"
    ) {
        return 1;
    }

    const rates =
        await getExchangeRates();

    const rate =
        rates[
            currency
        ];

    if (
        !isValidRate(
            rate,
        )
    ) {
        throw new Error(
            `Exchange rate unavailable for ${currency}.`,
        );
    }

    return rate;
}

/*
 * ---------------------------------------------------------
 * CACHE CONTROL
 * ---------------------------------------------------------
 */

export function clearExchangeRateCache(): void {
    cachedRates =
        null;

    cachedAt =
        0;
}