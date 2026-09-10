import {
    prisma,
} from "@/lib/prisma";

import type {
    CurrencyCode,
} from "./types";

export async function getUserCurrency(
    userId: string,
): Promise<CurrencyCode> {
    const profile =
        await prisma.travelerProfile.findUnique({
            where: {
                userId,
            },
            select: {
                currency: true,
            },
        });

    return (
        profile?.currency ??
        "INR"
    ) as CurrencyCode;
}

export async function updateUserCurrency(
    userId: string,
    currency: CurrencyCode,
) {
    return prisma.travelerProfile.upsert({
        where: {
            userId,
        },

        update: {
            currency,
        },

        create: {
            userId,

            currency,

            travelerType:
                "TOURIST",
        },

        select: {
            currency: true,
        },
    });
}