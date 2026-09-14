import { NextResponse } from "next/server";

import { auth } from "../../../../../../../auth";

import { parseTravelSource } from "@/features/travelMemory/services/sourceParser.service";

import { appendExtractionToJourney } from "@/features/travelMemory/services/journeyPersistence.service";

import type { ExtractedTravelContent } from "@/features/travelMemory/types/travelMemory.types";

export const runtime = "nodejs";

type RouteContext = {
    params: Promise<{
        tripId: string;
    }>;
};

function isObject(
    value: unknown,
): value is Record<string, unknown> {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
    );
}

export async function POST(
    request: Request,
    context: RouteContext,
) {
    try {
        const session = await auth();

        const userId = session?.user?.id ?? "";

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
            url?: unknown;
            transcript?: unknown;
            extracted?: unknown;
            content?: {
                title?: unknown;
                description?: unknown;
                sourceUrl?: unknown;
                contentId?: unknown;
                channelTitle?: unknown;
                publishedAt?: unknown;
                thumbnailUrl?: unknown;
            };
        };

        const url =
            typeof body.url === "string"
                ? body.url.trim()
                : "";

        const transcript =
            typeof body.transcript === "string" &&
            body.transcript.trim()
                ? body.transcript.trim()
                : undefined;

        if (!url) {
            return NextResponse.json(
                {
                    error: "Source URL is required.",
                },
                {
                    status: 400,
                },
            );
        }

        if (!isObject(body.extracted)) {
            return NextResponse.json(
                {
                    error:
                        "Analyzed travel data is required before saving.",
                },
                {
                    status: 400,
                },
            );
        }

        const source = parseTravelSource(url);

        if (source.platform !== "youtube") {
            return NextResponse.json(
                {
                    error:
                        "Instagram retrieval is not enabled yet. Add its supported connector before saving Instagram content.",
                },
                {
                    status: 422,
                },
            );
        }

        const content = body.content ?? {};

        const saved =
            await appendExtractionToJourney({
                userId,
                tripId,
                source: {
                    platform: source.platform,
                    sourceUrl: url,
                    sourceId: source.sourceId,
                    sourceType: source.sourceType,

                    title:
                        typeof content.title === "string"
                            ? content.title
                            : undefined,

                    channelName:
                        typeof content.channelTitle ===
                        "string"
                            ? content.channelTitle
                            : undefined,

                    publishedAt:
                        typeof content.publishedAt ===
                        "string"
                            ? content.publishedAt
                            : undefined,

                    thumbnailUrl:
                        typeof content.thumbnailUrl ===
                        "string"
                            ? content.thumbnailUrl
                            : undefined,

                    contentId:
                        typeof content.contentId ===
                        "string"
                            ? content.contentId
                            : undefined,
                },

                transcript,

                extraction:
                    body.extracted as unknown as ExtractedTravelContent,
            });

        return NextResponse.json({
            ...saved,
            content,
            extracted: body.extracted,
        });
    } catch (error) {
        console.error(
            "APPEND_JOURNEY_SOURCE_ERROR:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to append source to journey.",
            },
            {
                status: 500,
            },
        );
    }
}