"use client";

import {
    ArrowLeft,
    Camera,
    Check,
    ChevronRight,
    Loader2,
    Menu as MenuIcon,
    RotateCcw,
    Sparkles,
    Upload,
    Utensils,
    X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface ScanApiResponse {
    items?: unknown;
    foods?: unknown;
    confidence?: unknown;
    message?: unknown;
    error?: unknown;
}

function isObject(
    value: unknown,
): value is Record<string, unknown> {
    return (
        typeof value === "object" &&
        value !== null
    );
}

function getStringItems(
    value: unknown,
): string[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return Array.from(
        new Set(
            value
                .filter(
                    (
                        item,
                    ): item is string =>
                        typeof item === "string",
                )
                .map((item) =>
                    item
                        .replace(/\s+/g, " ")
                        .trim(),
                )
                .filter(Boolean),
        ),
    );
}

export default function MenuScanner() {
    const router = useRouter();

    const inputRef =
        useRef<HTMLInputElement>(null);

    const [image, setImage] =
        useState<string | null>(null);

    const [file, setFile] =
        useState<File | null>(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [scanDone, setScanDone] =
        useState(false);

    const [detectedItems, setDetectedItems] =
        useState<string[]>([]);

    const [confidence, setConfidence] =
        useState<number | null>(null);

    useEffect(() => {
        return () => {
            if (image) {
                URL.revokeObjectURL(image);
            }
        };
    }, [image]);

    function handleFile(
        selectedFile?: File,
    ) {
        if (!selectedFile) {
            return;
        }

        if (
            !selectedFile.type.startsWith(
                "image/",
            )
        ) {
            setError(
                "Please choose a JPG, PNG or WEBP image.",
            );
            return;
        }

        if (image) {
            URL.revokeObjectURL(image);
        }

        setImage(
            URL.createObjectURL(
                selectedFile,
            ),
        );
        setFile(selectedFile);
        setDetectedItems([]);
        setConfidence(null);
        setScanDone(false);
        setError("");
    }

    function handleInputChange(
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        handleFile(
            event.target.files?.[0],
        );
    }

    function reset() {
        if (image) {
            URL.revokeObjectURL(image);
        }

        setImage(null);
        setFile(null);
        setDetectedItems([]);
        setConfidence(null);
        setScanDone(false);
        setError("");
        setLoading(false);

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    async function scanMenu() {
        if (!file || loading) {
            return;
        }

        setLoading(true);
        setError("");
        setDetectedItems([]);
        setConfidence(null);
        setScanDone(false);

        try {
            const formData =
                new FormData();

            formData.append(
                "image",
                file,
            );

            formData.append(
                "mode",
                "menu",
            );

            const response =
                await fetch(
                    "/api/food/scan",
                    {
                        method: "POST",
                        body: formData,
                        cache: "no-store",
                    },
                );

            const data =
                (await response.json()) as ScanApiResponse;

            if (!response.ok) {
                throw new Error(
                    typeof data.error === "string"
                        ? data.error
                        : `Menu scan failed: ${response.status}`,
                );
            }

            const items =
                getStringItems(
                    data.items,
                );

            if (items.length === 0) {
                throw new Error(
                    typeof data.message ===
                        "string"
                        ? data.message
                        : "No menu items were detected. Try a clearer photo.",
                );
            }

            const rawConfidence =
                typeof data.confidence ===
                "number"
                    ? data.confidence
                    : null;

            setDetectedItems(
                items,
            );

            setConfidence(
                rawConfidence === null
                    ? null
                    : rawConfidence > 1
                      ? Math.min(
                            rawConfidence /
                                100,
                            1,
                        )
                      : Math.min(
                            Math.max(
                                rawConfidence,
                                0,
                            ),
                            1,
                        ),
            );

            setScanDone(true);
        } catch (scanError) {
            console.error(
                "[MenuScanner] Failed:",
                scanError,
            );

            setError(
                scanError instanceof Error
                    ? scanError.message
                    : "Unable to scan this menu.",
            );
        } finally {
            setLoading(false);
        }
    }

    function continueToResults() {
        if (
            detectedItems.length ===
            0
        ) {
            return;
        }

        const params =
            new URLSearchParams();

        params.set(
            "items",
            detectedItems.join(","),
        );

        router.push(
            `/food/menu?${params.toString()}`,
        );
    }

    return (
        <main className="min-h-screen bg-[#f7f3ea] px-4 pb-20 pt-5 sm:px-6 lg:px-8">
            <section className="mx-auto max-w-6xl">
                {/* TOP BAR */}
                <div className="flex items-center justify-between gap-4">
                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/food",
                            )
                        }
                        className="
                            inline-flex h-10 items-center gap-2
                            rounded-full border border-[#123c35]/10
                            bg-white px-4 text-xs font-black
                            text-[#123c35] transition hover:bg-[#fbfaf5]
                        "
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </button>

                    <div
                        className="
                            inline-flex items-center gap-2
                            rounded-full border border-[#123c35]/10
                            bg-white px-3.5 py-2
                            text-[9px] font-black uppercase
                            tracking-[0.16em] text-[#31544d]
                        "
                    >
                        <Sparkles className="h-3.5 w-3.5 text-[#ef713d]" />
                        Menu recognition
                    </div>
                </div>

                {/* HERO */}
                <section className="mt-10 max-w-3xl">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#ef713d]">
                        Scan your restaurant menu
                    </p>

                    <h1
                        className="
                            mt-2 text-4xl font-black
                            leading-[0.94] tracking-[-0.055em]
                            text-[#123c35] sm:text-6xl
                        "
                    >
                        See what&apos;s on the menu.
                    </h1>

                    <p className="mt-5 max-w-2xl text-sm leading-6 text-[#6d7974] sm:text-base">
                        Take one clear photo. FairTrip
                        extracts the visible dishes first,
                        then lets you search, filter and
                        personalize the menu before choosing
                        where to eat.
                    </p>
                </section>

                {/* SCANNER */}
                <section
                    className="
                        mt-8 overflow-hidden rounded-[34px]
                        border border-[#123c35]/10 bg-white
                        shadow-[0_24px_80px_rgba(18,60,53,0.08)]
                    "
                >
                    <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
                        {/* IMAGE SIDE */}
                        <div className="p-5 sm:p-8">
                            {!image ? (
                                <>
                                    <label
                                        htmlFor="menu-image"
                                        className="
                                            flex min-h-[430px]
                                            cursor-pointer flex-col
                                            items-center justify-center
                                            rounded-[28px]
                                            border-2 border-dashed
                                            border-[#123c35]/12
                                            bg-[#fbfaf5] px-6 text-center
                                            transition hover:border-[#123c35]/25
                                            hover:bg-[#f9f7ef]
                                        "
                                    >
                                        <span
                                            className="
                                                flex h-20 w-20
                                                items-center justify-center
                                                rounded-[24px] bg-[#123c35]
                                                text-[#e8f58d]
                                                shadow-[0_14px_30px_rgba(18,60,53,0.16)]
                                            "
                                        >
                                            <MenuIcon className="h-9 w-9" />
                                        </span>

                                        <h2 className="mt-6 text-xl font-black text-[#123c35]">
                                            Scan your menu
                                        </h2>

                                        <p className="mt-2 max-w-md text-xs leading-5 text-[#6d7974]">
                                            Photograph the complete menu
                                            page straight on, or choose
                                            an existing image.
                                        </p>

                                        <span
                                            className="
                                                mt-7 inline-flex
                                                min-h-[50px] items-center gap-2
                                                rounded-full bg-[#ef713d]
                                                px-6 text-xs font-black text-white
                                            "
                                        >
                                            <Camera className="h-4 w-4" />
                                            Take or choose photo
                                        </span>

                                        <div className="mt-5 text-[9px] font-bold text-[#89938f]">
                                            JPG, PNG or WEBP
                                        </div>
                                    </label>

                                    <input
                                        ref={
                                            inputRef
                                        }
                                        id="menu-image"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        capture="environment"
                                        onChange={
                                            handleInputChange
                                        }
                                        className="hidden"
                                    />
                                </>
                            ) : (
                                <>
                                    <div className="relative overflow-hidden rounded-[28px] bg-[#123c35]">
                                        <img
                                            src={
                                                image
                                            }
                                            alt="Selected restaurant menu"
                                            className="
                                                max-h-[560px]
                                                min-h-[360px]
                                                w-full
                                                object-contain
                                            "
                                        />

                                        <button
                                            type="button"
                                            onClick={
                                                reset
                                            }
                                            disabled={
                                                loading
                                            }
                                            aria-label="Remove menu image"
                                            className="
                                                absolute right-4 top-4
                                                flex h-10 w-10 items-center
                                                justify-center rounded-full
                                                bg-black/55 text-white
                                                backdrop-blur transition
                                                hover:bg-black/75
                                                disabled:opacity-40
                                            "
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {error && (
                                        <div className="mt-4 rounded-[18px] bg-[#f9dfd0] px-4 py-3 text-xs font-semibold leading-5 text-[#9b4c36]">
                                            {error}
                                        </div>
                                    )}

                                    {!scanDone && (
                                        <button
                                            type="button"
                                            onClick={
                                                scanMenu
                                            }
                                            disabled={
                                                loading
                                            }
                                            className="
                                                mt-5 flex min-h-[56px]
                                                w-full items-center justify-center
                                                gap-2 rounded-full bg-[#123c35]
                                                px-6 text-sm font-black text-white
                                                transition hover:bg-[#0d312b]
                                                disabled:cursor-not-allowed
                                                disabled:opacity-50
                                            "
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Reading menu...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="h-4 w-4 text-[#cbe95b]" />
                                                    Scan this menu
                                                </>
                                            )}
                                        </button>
                                    )}

                                    {scanDone && (
                                        <div className="mt-5 rounded-[24px] bg-[#fbfaf5] p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f58d] text-[#123c35]">
                                                    <Check className="h-5 w-5" />
                                                </div>

                                                <div>
                                                    <p className="text-sm font-black text-[#123c35]">
                                                        Menu scanned
                                                    </p>

                                                    <p className="mt-0.5 text-[10px] text-[#89938f]">
                                                        {
                                                            detectedItems.length
                                                        }{" "}
                                                        dishes detected
                                                    </p>
                                                </div>
                                            </div>

                                            {confidence !==
                                                null && (
                                                <div className="mt-4 rounded-full bg-white px-3 py-2 text-[9px] font-black text-[#31544d]">
                                                    {Math.round(
                                                        confidence *
                                                            100,
                                                    )}
                                                    % recognition
                                                    confidence
                                                </div>
                                            )}

                                            <button
                                                type="button"
                                                onClick={
                                                    continueToResults
                                                }
                                                className="
                                                    mt-4 flex min-h-[54px]
                                                    w-full items-center justify-center
                                                    gap-2 rounded-full bg-[#ef713d]
                                                    px-6 text-sm font-black text-white
                                                "
                                            >
                                                Review menu choices
                                                <ChevronRight className="h-4 w-4" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={
                                                    reset
                                                }
                                                className="
                                                    mt-3 flex w-full
                                                    items-center justify-center
                                                    gap-2 py-3 text-xs
                                                    font-black text-[#31544d]
                                                "
                                            >
                                                <RotateCcw className="h-4 w-4" />
                                                Scan another menu
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* EXPLANATION SIDE */}
                        <div className="bg-[#123c35] p-6 sm:p-8">
                            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#cbe95b]">
                                What happens next
                            </p>

                            <h2 className="mt-3 text-2xl font-black tracking-[-0.035em] text-white sm:text-3xl">
                                A menu should become
                                useful, not just readable.
                            </h2>

                            <div className="mt-7 space-y-3">
                                <div className="rounded-[20px] bg-white/8 p-4">
                                    <p className="text-xs font-black text-white">
                                        01 · Extract
                                    </p>
                                    <p className="mt-1 text-[10px] leading-5 text-white/55">
                                        Detect the dishes that are
                                        actually visible in your
                                        menu photograph.
                                    </p>
                                </div>

                                <div className="rounded-[20px] bg-white/8 p-4">
                                    <p className="text-xs font-black text-white">
                                        02 · Understand
                                    </p>
                                    <p className="mt-1 text-[10px] leading-5 text-white/55">
                                        Match recognized dishes
                                        with available FairTrip
                                        food information.
                                    </p>
                                </div>

                                <div className="rounded-[20px] bg-white/8 p-4">
                                    <p className="text-xs font-black text-white">
                                        03 · Personalize
                                    </p>
                                    <p className="mt-1 text-[10px] leading-5 text-white/55">
                                        Rank dishes using your
                                        taste, cuisine, diet,
                                        spice, budget and eating
                                        time.
                                    </p>
                                </div>

                                <div className="rounded-[20px] bg-white/8 p-4">
                                    <p className="text-xs font-black text-white">
                                        04 · Locate
                                    </p>
                                    <p className="mt-1 text-[10px] leading-5 text-white/55">
                                        After you choose dishes,
                                        FairTrip searches real
                                        nearby places.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center gap-2 text-[9px] font-bold text-white/45">
                                <Utensils className="h-3.5 w-3.5" />
                                Food details appear only when
                                supported by available data.
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        </main>
    );
}