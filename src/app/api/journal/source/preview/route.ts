import { NextResponse } from "next/server";

import { parseTravelSource } from "@/features/travelMemory/services/sourceParser.service";
import { fetchYouTubeContent } from "@/features/travelMemory/services/youtube.service";

export const runtime = "nodejs";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as { url?: unknown };
        const url = typeof body.url === "string" ? body.url.trim() : "";

        if (!url) {
            return NextResponse.json(
                { error: "Source URL is required." },
                { status: 400 },
            );
        }

        const source = parseTravelSource(url);

        if (source.platform === "instagram") {
            return NextResponse.json({
                source,
                supported: false,
                message:
                    "Instagram URL detected. Direct public-content retrieval is not enabled in this MVP. You can still paste the caption/transcript for analysis.",
            });
        }

        const latest = await fetchYouTubeContent(source);

        return NextResponse.json({
            source,
            supported: true,
            latest,
        });
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to preview source.",
            },
            { status: 400 },
        );
    }
}
