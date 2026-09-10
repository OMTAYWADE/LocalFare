import {
    NextResponse,
} from "next/server";

import {
    prisma,
} from "@/lib/prisma";

import type {
    CurrencyCode,
} from "@/features/currency/types";

const CURRENCY_CODES:
    CurrencyCode[] = [
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

function isCurrencyCode(
    value: unknown,
): value is CurrencyCode {
    return (
        typeof value ===
            "string" &&
        CURRENCY_CODES.includes(
            value as CurrencyCode,
        )
    );
}

/*
 * IMPORTANT:
 *
 * Connect this function to your actual
 * authentication/session system.
 */
async function getCurrentUserId(): Promise<
    string | null
> {
    /*
     * Example:
     *
     * const session = await auth();
     *
     * return session?.user?.id ?? null;
     */

    return null;
}

/*
 * =========================================================
 * GET USER CURRENCY
 * =========================================================
 */

export async function GET() {
    try {
        const userId =
            await getCurrentUserId();

        /*
         * No authenticated user.
         *
         * Browser localStorage will remain
         * the temporary fallback.
         */

        if (!userId) {
            return NextResponse.json(
                {
                    currency:
                        "INR",
                },
            );
        }

        const profile =
            await prisma.travelerProfile.findUnique(
                {
                    where: {
                        userId,
                    },
                    select: {
                        currency: true,
                    },
                },
            );

        return NextResponse.json({
            currency:
                profile?.currency ??
                "INR",
        });
    } catch (error) {
        console.error(
            "[Currency GET] Failed:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Unable to load currency preference.",
            },
            {
                status: 500,
            },
        );
    }
}

/*
 * =========================================================
 * SAVE USER CURRENCY
 * =========================================================
 */

export async function PATCH(
    request: Request,
) {
    try {
        const userId =
            await getCurrentUserId();

        if (!userId) {
            return NextResponse.json(
                {
                    error:
                        "Authentication required to save currency.",
                },
                {
                    status: 401,
                },
            );
        }

        const body =
            (await request.json()) as {
                currency?: unknown;
            };

        if (
            !isCurrencyCode(
                body.currency,
            )
        ) {
            return NextResponse.json(
                {
                    error:
                        "Unsupported currency.",
                },
                {
                    status: 400,
                },
            );
        }

        const profile =
            await prisma.travelerProfile.upsert(
                {
                    where: {
                        userId,
                    },

                    update: {
                        currency:
                            body.currency,
                    },

                    create: {
                        userId,

                        travelerType:
                            "TOURIST",

                        currency:
                            body.currency,
                    },

                    select: {
                        currency:
                            true,
                    },
                },
            );

        return NextResponse.json(
            profile,
        );
    } catch (error) {
        console.error(
            "[Currency PATCH] Failed:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Unable to save currency preference.",
            },
            {
                status: 500,
            },
        );
    }
}