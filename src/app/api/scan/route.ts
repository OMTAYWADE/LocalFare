import {
    NextResponse,
} from "next/server";

import {
    recognizeUniversal,
} from "@/features/universalScan/services/universalScan.service";

import type {
    ScanInputType,
    UniversalScanRequest,
} from "@/features/universalScan/types/universalScan.types";

export const runtime = "nodejs";

export const dynamic = "force-dynamic";

export async function POST(
    request: Request,
) {
    try {
        const formData =
            await request.formData();

        const inputTypeValue =
            formData.get("inputType");

        const textValue =
            formData.get("text");

        const imageValue =
            formData.get("image");

        const latitudeValue =
            formData.get("latitude");

        const longitudeValue =
            formData.get("longitude");

        if (
            inputTypeValue !== "image" &&
            inputTypeValue !== "text"
        ) {
            return NextResponse.json(
                {
                    error:
                        "Invalid input type.",
                },
                {
                    status: 400,
                },
            );
        }

        const inputType =
            inputTypeValue as ScanInputType;

        const input: UniversalScanRequest = {
            inputType,
        };

        if (inputType === "text") {
            if (
                typeof textValue !==
                    "string" ||
                !textValue.trim()
            ) {
                return NextResponse.json(
                    {
                        error:
                            "Text input is required.",
                    },
                    {
                        status: 400,
                    },
                );
            }

            input.text =
                textValue.trim();
        }

        if (inputType === "image") {
            if (
                !imageValue ||
                !(imageValue instanceof File)
            ) {
                return NextResponse.json(
                    {
                        error:
                            "Image input is required.",
                    },
                    {
                        status: 400,
                    },
                );
            }

            input.image =
                imageValue;
        }

        if (
            typeof latitudeValue ===
                "string" &&
            typeof longitudeValue ===
                "string"
        ) {
            const latitude =
                Number(latitudeValue);

            const longitude =
                Number(longitudeValue);

            if (
                Number.isFinite(latitude) &&
                Number.isFinite(longitude)
            ) {
                input.latitude =
                    latitude;

                input.longitude =
                    longitude;
            }
        }

        const result =
            await recognizeUniversal(
                input,
            );

        return NextResponse.json(
            result,
            {
                status: 200,
            },
        );
    } catch (error) {
        console.error(
            "[POST /api/scan]",
            error,
        );

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Universal scan failed.",
            },
            {
                status: 500,
            },
        );
    }
}