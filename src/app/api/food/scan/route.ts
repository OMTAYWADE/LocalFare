import { NextResponse } from "next/server";

export async function POST(
    request: Request,
) {
    try {
        const formData =
            await request.formData();

        const image =
            formData.get("image");

        const mode =
            formData.get("mode");

        if (!(image instanceof File)) {
            return NextResponse.json(
                {
                    error:
                        "Image is required.",
                },
                {
                    status: 400,
                },
            );
        }

        if (
            mode !== "food" &&
            mode !== "menu"
        ) {
            return NextResponse.json(
                {
                    error:
                        "Invalid scan mode.",
                },
                {
                    status: 400,
                },
            );
        }

        /*
         * TEMPORARY RESPONSE
         *
         * The actual vision/OCR service will
         * be connected here next.
         */

        if (mode === "food") {
            return NextResponse.json({
                success: true,
                mode,
                items: [
                    "Food image received",
                ],
            });
        }

        return NextResponse.json({
            success: true,
            mode,
            items: [
                "Menu image received",
            ],
        });
    } catch (error) {
        console.error(
            "Food scan API error:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Unable to process scan.",
            },
            {
                status: 500,
            },
        );
    }
}