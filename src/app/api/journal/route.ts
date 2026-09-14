import { NextResponse } from "next/server";

import {
    createJourney,
    listJourneys,
} from "@/features/travelMemory/services/journeyPersistence.service";

export const runtime = "nodejs";

function getUserId(request: Request, body?: unknown): string {
    const headerUserId = request.headers.get("x-fairtrip-user-id")?.trim();

    if (headerUserId) return headerUserId;

    if (
        typeof body === "object" &&
        body !== null &&
        "userId" in body &&
        typeof (body as { userId?: unknown }).userId === "string"
    ) {
        return (body as { userId: string }).userId.trim();
    }

    return "";
}

export async function GET(request: Request) {
    try {
        const userId = getUserId(request);

        if (!userId) {
            return NextResponse.json(
                { error: "Authenticated FairTrip user is required." },
                { status: 401 },
            );
        }

        return NextResponse.json({
            journeys: await listJourneys(userId),
        });
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to load journeys.",
            },
            { status: 500 },
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as {
            userId?: unknown;
            name?: unknown;
        };

        const userId = getUserId(request, body);
        const name = typeof body.name === "string" ? body.name.trim() : "";

        if (!userId) {
            return NextResponse.json(
                { error: "Authenticated FairTrip user is required." },
                { status: 401 },
            );
        }

        if (!name) {
            return NextResponse.json(
                { error: "Journey name is required." },
                { status: 400 },
            );
        }

        return NextResponse.json(
            { journey: await createJourney(userId, name) },
            { status: 201 },
        );
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to create journey.",
            },
            { status: 500 },
        );
    }
}
