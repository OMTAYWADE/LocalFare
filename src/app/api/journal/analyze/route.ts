import { NextResponse } from "next/server";

import { extractTravelExperience } from "@/features/travelMemory/services/experienceExtraction.service";
import { parseTravelSource } from "@/features/travelMemory/services/sourceParser.service";
import { fetchYouTubeContent } from "@/features/travelMemory/services/youtube.service";

export const runtime = "nodejs";

/*
 * Analyze is deliberately non-persistent.
 *
 * The frontend first understands the source, then asks:
 * "Continue an existing journey or start a new one?"
 *
 * Persistence happens only after the user chooses the destination journey.
 */
export async function POST(request: Request) {
    try {
        const body = (await request.json()) as {
            url?: unknown;
            transcript?: unknown;
        };

        const url = typeof body.url === "string" ? body.url.trim() : "";
        const transcript =
            typeof body.transcript === "string" && body.transcript.trim()
                ? body.transcript.trim()
                : undefined;

        if (!url) {
            return NextResponse.json(
                { error: "Source URL is required." },
                { status: 400 },
            );
        }

        const source = parseTravelSource(url);

        if (source.platform !== "youtube") {
            return NextResponse.json(
                {
                    error:
                        "Instagram retrieval is not enabled yet. Paste its caption/transcript when the Instagram connector is available.",
                },
                { status: 422 },
            );
        }

        const content = await fetchYouTubeContent(source);
        const extracted = await extractTravelExperience(content, transcript);

        return NextResponse.json({
            source,
            content,
            extracted,
            privacy: {
                defaultVisibility: "private",
                publicPromotionRequired: true,
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to analyze travel source.",
            },
            { status: 500 },
        );
    }
}
