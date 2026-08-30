import { NextResponse } from "next/server";

import {
    getExchangeRates,
} from "@/features/currency/currency.service";

export async function GET() {
    try {
        const rates =
            await getExchangeRates();

        return NextResponse.json({
            baseCurrency:
                "INR",

            rates,

            source:
                "Exchange-rate provider",

            retrievedAt:
                new Date().toISOString(),

            /*
             * Exchange rates are reference/
             * market rates, not guaranteed card
             * or bank transaction rates.
             */
            indicative:
                true,
        });
    } catch (error) {
        console.error(
            "[Currency API] Failed:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to load current exchange rates.",
            },
            {
                status: 503,
            },
        );
    }
}