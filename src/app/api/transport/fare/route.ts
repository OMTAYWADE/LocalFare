import { NextRequest, NextResponse } from "next/server";

import {
    getTransportFare,
} from "@/features/transport/services/localTransportFare.service";

import type {
    LocalTransportMode,
} from "@/features/transport/types/localTransport.types";

const VALID_MODES: LocalTransportMode[] = [
    "meter-auto",
    "shared-auto",
    "meter-taxi",
    "app-taxi",
    "bus",
    "walk",
];

export async function POST(
    request: NextRequest,
) {
    try {
        const body =
            await request.json();

        const mode =
            body?.mode as LocalTransportMode;

        if (
            !VALID_MODES.includes(mode)
        ) {
            return NextResponse.json(
                {
                    error:
                        "Invalid transport mode.",
                },
                {
                    status: 400,
                },
            );
        }

        const distanceKm =
            body?.distanceKm !== undefined
                ? Number(body.distanceKm)
                : undefined;

        if (
            distanceKm !== undefined &&
            (!Number.isFinite(distanceKm) ||
                distanceKm < 0)
        ) {
            return NextResponse.json(
                {
                    error:
                        "distanceKm must be a valid non-negative number.",
                },
                {
                    status: 400,
                },
            );
        }

        const result =
            getTransportFare({
                mode,

                city:
                    typeof body?.city ===
                    "string"
                        ? body.city
                        : undefined,

                distanceKm,

                isNight:
                    typeof body?.isNight ===
                    "boolean"
                        ? body.isNight
                        : undefined,
            });

        return NextResponse.json(
            result,
            {
                status: 200,
            },
        );
    } catch (error) {
        console.error(
            "[Transport Fare API]",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Unable to calculate transport fare.",
            },
            {
                status: 500,
            },
        );
    }
}