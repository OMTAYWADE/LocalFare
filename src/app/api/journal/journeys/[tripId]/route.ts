import { NextResponse } from "next/server";

import { auth } from "../../../../../../auth";

import {
    finishJourney,
    getJourney,
} from "@/features/travelMemory/services/journeyPersistence.service";

export const runtime = "nodejs";

type RouteContext = {
    params: Promise<{
        tripId: string;
    }>;
};

async function getAuthenticatedUserId() {
    const session = await auth();

    return session?.user?.id ?? "";
}

export async function GET(
    _request: Request,
    context: RouteContext,
) {
    try {
        const userId = await getAuthenticatedUserId();
        const { tripId } = await context.params;

        if (!userId) {
            return NextResponse.json(
                {
                    error: "Authentication required.",
                },
                {
                    status: 401,
                },
            );
        }

        if (!tripId) {
            return NextResponse.json(
                {
                    error: "Journey ID is required.",
                },
                {
                    status: 400,
                },
            );
        }

        const journey = await getJourney(
            userId,
            tripId,
        );

        if (!journey) {
            return NextResponse.json(
                {
                    error: "Journey not found.",
                },
                {
                    status: 404,
                },
            );
        }

        return NextResponse.json({
            journey,
        });
    } catch (error) {
        console.error(
            "GET_JOURNEY_ERROR:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to load journey.",
            },
            {
                status: 500,
            },
        );
    }
}

export async function PATCH(
    request: Request,
    context: RouteContext,
) {
    try {
        const userId = await getAuthenticatedUserId();
        const { tripId } = await context.params;

        if (!userId) {
            return NextResponse.json(
                {
                    error: "Authentication required.",
                },
                {
                    status: 401,
                },
            );
        }

        if (!tripId) {
            return NextResponse.json(
                {
                    error: "Journey ID is required.",
                },
                {
                    status: 400,
                },
            );
        }

        const body = (await request.json()) as {
            action?: unknown;
        };

        if (body.action !== "finish") {
            return NextResponse.json(
                {
                    error: "Unsupported journey action.",
                },
                {
                    status: 400,
                },
            );
        }

        const journey = await finishJourney(
            userId,
            tripId,
        );

        return NextResponse.json({
            journey,
        });
    } catch (error) {
        console.error(
            "PATCH_JOURNEY_ERROR:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to update journey.",
            },
            {
                status: 500,
            },
        );
    }
}