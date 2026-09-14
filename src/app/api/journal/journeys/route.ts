import { NextResponse } from "next/server";

import {
    createJourney,
    listJourneys,
} from "@/features/travelMemory/services/journeyPersistence.service";

import { getAuthenticatedUser } from "@/features/auth/server/getAuthenticatedUser";

export async function GET() {
    try {
        const user =
            await getAuthenticatedUser();

        if (!user) {
            return NextResponse.json(
                {
                    error: "Unauthorized",
                },
                {
                    status: 401,
                },
            );
        }

        const journeys =
            await listJourneys(user.id);

        return NextResponse.json(
            {
                journeys,
            },
            {
                status: 200,
            },
        );
    } catch (error) {
        console.error(
            "[GET /api/journal/journeys]",
            error,
        );

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to load journeys.",
            },
            {
                status: 500,
            },
        );
    }
}

export async function POST(
    request: Request,
) {
    try {
        const user =
            await getAuthenticatedUser();

        if (!user) {
            return NextResponse.json(
                {
                    error: "Unauthorized",
                },
                {
                    status: 401,
                },
            );
        }

        const body =
            (await request.json()) as {
                name?: unknown;
            };

        const name =
            typeof body.name === "string"
                ? body.name.trim()
                : "";

        if (!name) {
            return NextResponse.json(
                {
                    error:
                        "Journey name is required.",
                },
                {
                    status: 400,
                },
            );
        }

        if (name.length > 100) {
            return NextResponse.json(
                {
                    error:
                        "Journey name must be 100 characters or less.",
                },
                {
                    status: 400,
                },
            );
        }

        const trip =
            await createJourney(
                user.id,
                name,
            );

        return NextResponse.json(
            {
                trip,
            },
            {
                status: 201,
            },
        );
    } catch (error) {
        console.error(
            "[POST /api/journal/journeys]",
            error,
        );

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Could not create the journey.",
            },
            {
                status: 500,
            },
        );
    }
}