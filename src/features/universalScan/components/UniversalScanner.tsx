"use client";

import {
    Camera,
    ImagePlus,
    Loader2,
    ScanLine,
    Sparkles,
    UploadCloud,
    Utensils,
    X,
} from "lucide-react";

import gsap from "gsap";
import { useRouter } from "next/navigation";
import {
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
    type DragEvent,
} from "react";

import UniversalScanResult from "./UniversalScanResult";

import type {
    UniversalScanResponse,
} from "../types/universalScan.types";
import AppHeader from "@/components/layout/AppHeader";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

interface ScanApiError {
    error?: string;
    message?: string;
}

interface UserLocation {
    latitude: number;
    longitude: number;
}

export default function UniversalScanner() {
    const router = useRouter();

    const inputRef = useRef<HTMLInputElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const dropRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const resultRef = useRef<HTMLDivElement>(null);

    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [text, setText] = useState("");
    const [dragActive, setDragActive] = useState(false);

    const [loading, setLoading] = useState(false);
    const [loadingStage, setLoadingStage] = useState(
        "Preparing your scan...",
    );

    const [location, setLocation] =
        useState<UserLocation | null>(null);

    const [result, setResult] =
        useState<UniversalScanResponse | null>(null);

    const [error, setError] = useState("");

    /*
     * Entrance animation
     */
    useEffect(() => {
        if (!rootRef.current) {
            return;
        }

        const ctx = gsap.context(() => {
            gsap.from(".scan-reveal", {
                y: 24,
                opacity: 0,
                duration: 0.8,
                stagger: 0.08,
                ease: "power3.out",
            });

            gsap.to(".scan-orb", {
                y: -10,
                duration: 2.4,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });

            gsap.to(".scan-ring", {
                scale: 1.08,
                opacity: 0.35,
                duration: 2.2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        }, rootRef);

        return () => {
            ctx.revert();
        };
    }, []);

    /*
     * Result animation
     */
    useEffect(() => {
        if (!resultRef.current || !result) {
            return;
        }

        const ctx = gsap.context(() => {
            if (!resultRef.current) {
                return;
            }

            gsap.fromTo(
                resultRef.current,
                {
                    y: 32,
                    opacity: 0,
                    scale: 0.98,
                },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.65,
                    ease: "back.out(1.4)",
                },
            );
        }, resultRef);

        return () => {
            ctx.revert();
        };
    }, [result]);

    /*
     * Select an image
     */
    function setSelectedFile(selectedFile?: File) {
        if (!selectedFile) {
            return;
        }

        if (!selectedFile.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            return;
        }

        if (selectedFile.size > MAX_IMAGE_SIZE) {
            setError("Image must be smaller than 10 MB.");
            return;
        }

        setError("");
        setResult(null);
        setLocation(null);

        if (image) {
            URL.revokeObjectURL(image);
        }

        const objectUrl = URL.createObjectURL(selectedFile);

        setFile(selectedFile);
        setImage(objectUrl);

        if (dropRef.current) {
            gsap.fromTo(
                dropRef.current,
                {
                    scale: 0.97,
                    rotate: -1.5,
                },
                {
                    scale: 1,
                    rotate: 0,
                    duration: 0.45,
                    ease: "back.out(2)",
                },
            );
        }
    }

    /*
     * File input
     */
    function handleImageChange(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        const selectedFile = event.target.files?.[0];

        setSelectedFile(selectedFile);

        event.target.value = "";
    }

    /*
     * Drag events
     */
    function handleDragOver(
        event: DragEvent<HTMLDivElement>,
    ) {
        event.preventDefault();

        setDragActive(true);

        if (glowRef.current) {
            gsap.to(glowRef.current, {
                scale: 1.08,
                opacity: 0.9,
                duration: 0.25,
                overwrite: true,
            });
        }
    }

    function handleDragLeave(
        event: DragEvent<HTMLDivElement>,
    ) {
        event.preventDefault();

        setDragActive(false);

        if (glowRef.current) {
            gsap.to(glowRef.current, {
                scale: 1,
                opacity: 0.45,
                duration: 0.25,
                overwrite: true,
            });
        }
    }

    function handleDrop(
        event: DragEvent<HTMLDivElement>,
    ) {
        event.preventDefault();

        setDragActive(false);

        const droppedFile =
            event.dataTransfer.files?.[0];

        setSelectedFile(droppedFile);

        if (glowRef.current) {
            gsap.to(glowRef.current, {
                scale: 1,
                opacity: 0.45,
                duration: 0.35,
                overwrite: true,
            });
        }
    }

    /*
     * Remove selected image
     */
    function removeImage() {
        if (image) {
            URL.revokeObjectURL(image);
        }

        setImage(null);
        setFile(null);
        setResult(null);
        setLocation(null);
        setError("");
    }

    /*
     * Get browser location
     *
     * This happens BEFORE calling /api/scan so the
     * coordinates can be sent to the backend.
     */
    function getUserLocation(): Promise<UserLocation> {
        return new Promise((resolve, reject) => {
            if (
                typeof navigator === "undefined" ||
                !navigator.geolocation
            ) {
                reject(
                    new Error(
                        "Location is not available in this browser.",
                    ),
                );

                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },

                (locationError) => {
                    reject(locationError);
                },

                {
                    enableHighAccuracy: false,
                    timeout: 5000,
                    maximumAge: 5 * 60 * 1000,
                },
            );
        });
    }

    /*
     * Food Session
     */
    function openFoodSession() {
        router.push("/food");
    }

    /*
     * Main scan
     */
    async function scan() {
        const cleanText = text.trim();

        if (!file && !cleanText) {
            setError(
                "Drop an image, take a photo, or enter something to scan.",
            );

            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            /*
             * Get location first.
             *
             * Location is optional. The scan should still
             * work when the user denies permission.
             */
            let currentLocation: UserLocation | null = null;

            if (file) {
                setLoadingStage("Analyzing your image...");
            } else {
                setLoadingStage("Understanding your request...");
            }

            try {
                currentLocation = await getUserLocation();

                setLocation(currentLocation);
            } catch (locationError) {
                console.warn(
                    "[UniversalScanner] Location unavailable:",
                    locationError,
                );

                currentLocation = null;
                setLocation(null);
            }

            /*
             * Build request
             */
            const formData = new FormData();

            if (file) {
                formData.append("image", file);
                formData.append("inputType", "image");
            } else {
                formData.append("text", cleanText);
                formData.append("inputType", "text");
            }

            /*
             * Send coordinates when available
             */
            if (currentLocation) {
                formData.append(
                    "latitude",
                    String(currentLocation.latitude),
                );

                formData.append(
                    "longitude",
                    String(currentLocation.longitude),
                );
            }

            setLoadingStage(
                "Understanding what you scanned...",
            );

            /*
             * Call backend
             */
            const response = await fetch("/api/scan", {
                method: "POST",
                body: formData,
                cache: "no-store",
            });

            let data:
                | UniversalScanResponse
                | ScanApiError;

            try {
                data = await response.json();
            } catch {
                throw new Error(
                    "The scan server returned an invalid response.",
                );
            }

            /*
             * API error
             */
            if (!response.ok) {
                const apiError = data as ScanApiError;

                throw new Error(
                    apiError.error ??
                    apiError.message ??
                    "Scan failed. Please try again.",
                );
            }

            /*
             * Successful response
             */
            const scanResponse =
                data as UniversalScanResponse;

            if (!scanResponse.recognition) {
                throw new Error(
                    "No recognizable result was returned.",
                );
            }

            setResult(scanResponse);

            /*
             * Give user a useful final loading message
             */
            if (
                scanResponse.recognition.type
                    .trim()
                    .toLowerCase() === "food"
            ) {
                setLoadingStage(
                    "Food detected — Food Session is available.",
                );
            } else {
                setLoadingStage(
                    "Scan complete.",
                );
            }
        } catch (scanError) {
            console.error(
                "[UniversalScanner] Failed:",
                scanError,
            );

            setError(
                scanError instanceof Error
                    ? scanError.message
                    : "Unable to scan this input.",
            );
        } finally {
            setLoading(false);
        }
    }

    /*
     * Cleanup object URL
     */
    useEffect(() => {
        return () => {
            if (image) {
                URL.revokeObjectURL(image);
            }
        };
    }, [image]);

    const recognition = result?.recognition;

    const isFood =
        recognition?.type.trim().toLowerCase() === "food";

    return (
        <main
            ref={rootRef}
            className="min-h-screen overflow-hidden bg-[#f5f1e8] px-4 py-6 sm:px-6 lg:px-8"
        >
            <div className="mx-auto max-w-6xl">

                {/* Header */}
                    <AppHeader/>
                <header className="scan-reveal flex items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#123c35]/10 bg-white px-3 py-2 text-[9px] font-black uppercase tracking-[0.18em] text-[#31544d] shadow-sm">
                            <Sparkles className="h-3.5 w-3.5 text-[#ef713d]" />
                            FairTrip Intelligence
                        </div>
                    </div>

                    {/* Smart context switcher */}
                    <div
                        className="flex items-center rounded-full border border-[#123c35]/10 bg-white p-1 shadow-[0_8px_24px_rgba(18,60,53,0.08)]"
                        aria-label="Scan context"
                    >
                        <button
                            type="button"
                            aria-current="page"
                            className="flex h-9 items-center gap-2 rounded-full bg-[#e8f58d] px-3.5 text-[10px] font-black text-[#123c35] shadow-sm"
                        >
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#123c35] text-[#e8f58d]">
                                <ScanLine className="h-3 w-3" />
                            </span>
                            General
                        </button>

                        <button
                            type="button"
                            onClick={() => router.push("/food")}
                            className="flex h-9 items-center gap-2 rounded-full px-3.5 text-[10px] font-black text-[#68756f] transition hover:bg-[#f7f3ea] hover:text-[#123c35]"
                        >
                            <Utensils className="h-3.5 w-3.5" />
                            Food
                        </button>
                    </div>
                </header>

                {/* Scanner guidance */}
                <section className="scan-reveal mt-6">
                    <div className="relative overflow-hidden rounded-[30px] border border-[#123c35]/10 bg-white shadow-[0_18px_55px_rgba(18,60,53,0.07)]">
                        <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-[#e8f58d]/45 blur-3xl" />

                        <div className="relative flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
                            <div className="max-w-xl">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f58d] text-[#123c35]">
                                        <Sparkles className="h-3.5 w-3.5" />
                                    </span>
                                    <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#ef713d]">
                                        Ask FairTrip anything.
                                    </span>
                                </div>

                                <h2 className="mt-3 text-xl font-black tracking-[-0.04em] text-[#123c35] sm:text-2xl">
                                    Have a doubt? <span className="text-[#ef713d]">Scan it.</span>
                                </h2>

                                <p className="mt-1.5 text-[11px] leading-5 text-[#7d8984]">
                                    Food, clothes, products, tools or anything
                                    you cannot identify — just show it to FairTrip.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 lg:max-w-[390px] lg:justify-end">
                                {["🍛 Food", "👕 Clothes", "📦 Products", "🔧 Tools", "🎒 Objects", "✦ Anything"].map((item) => (
                                    <span key={item} className="rounded-full border border-[#123c35]/8 bg-[#fbfaf5] px-3.5 py-2 text-[9px] font-black text-[#31544d] shadow-sm">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Hero + upload */}
                <section className="grid items-center gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:py-14">

                    <div className="scan-reveal">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ef713d]">
                            See it. Understand it. Resolve it.
                        </p>

                        <h1 className="mt-3 max-w-xl text-5xl font-black leading-[0.92] tracking-[-0.065em] text-[#123c35] sm:text-6xl">
                            Have a doubt?
                            <span className="block text-[#ef713d]">
                                Scan it.
                            </span>
                        </h1>

                        <p className="mt-5 max-w-lg text-sm leading-7 text-[#6d7974]">
                            Show FairTrip a photo or describe what you&apos;re
                            looking at. We identify it first, then bring
                            useful context around it.
                        </p>
                    </div>

                    <div className="scan-reveal relative">

                        <div className="scan-orb absolute -right-4 -top-6 h-28 w-28 rounded-full bg-[#e8f58d]/70 blur-2xl" />

                        <div className="scan-ring absolute left-8 top-10 h-20 w-20 rounded-full border border-[#ef713d]/20" />

                        <div
                            ref={dropRef}
                            role="button"
                            tabIndex={0}
                            aria-label="Upload or drop an image to scan"
                            onClick={() =>
                                inputRef.current?.click()
                            }
                            onKeyDown={(event) => {
                                if (
                                    event.key === "Enter" ||
                                    event.key === " "
                                ) {
                                    event.preventDefault();

                                    inputRef.current?.click();
                                }
                            }}
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`group relative min-h-[440px] w-full cursor-pointer overflow-hidden rounded-[38px] border bg-white p-3 text-left shadow-[0_28px_80px_rgba(18,60,53,0.12)] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#ef713d]/40 ${dragActive
                                    ? "border-[#ef713d] bg-[#fffaf5]"
                                    : "border-[#123c35]/10"
                                }`}
                        >

                            <div
                                ref={glowRef}
                                className="pointer-events-none absolute inset-8 rounded-[28px] bg-[#e8f58d]/30 blur-2xl opacity-45"
                            />

                            {image ? (
                                <div className="relative h-full min-h-[408px] overflow-hidden rounded-[30px] bg-[#101916]">

                                    <img
                                        src={image}
                                        alt="Selected scan"
                                        className="absolute inset-0 h-full w-full object-contain"
                                    />

                                    <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3">

                                        <span className="rounded-full bg-white/90 px-3 py-2 text-[9px] font-black text-[#123c35] backdrop-blur">
                                            Image ready
                                        </span>

                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                removeImage();
                                            }}
                                            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/65"
                                            aria-label="Remove image"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>

                                    </div>
                                </div>
                            ) : (
                                <div className="relative flex min-h-[408px] flex-col items-center justify-center rounded-[30px] border border-dashed border-[#123c35]/12 bg-[#fbfaf5] px-6 text-center">

                                    <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#123c35] shadow-lg transition duration-300 group-hover:-translate-y-1 group-hover:rotate-1">
                                        {dragActive ? (
                                            <UploadCloud className="h-8 w-8 text-[#e8f58d]" />
                                        ) : (
                                            <Camera className="h-8 w-8 text-[#e8f58d]" />
                                        )}
                                    </div>

                                    <p className="mt-6 text-xl font-black tracking-[-0.03em] text-[#123c35]">
                                        {dragActive
                                            ? "Drop it here"
                                            : "Drop an image here"}
                                    </p>

                                    <p className="mt-2 max-w-sm text-xs leading-5 text-[#89938f]">
                                        Drag a photo into this
                                        space, or click to choose
                                        one from your device.
                                    </p>

                                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                                        {[
                                            "Food",
                                            "Clothes",
                                            "Products",
                                            "Tools",
                                            "Objects",
                                        ].map((item) => (
                                            <span
                                                key={item}
                                                className="rounded-full bg-white px-3 py-1.5 text-[8px] font-black text-[#31544d] shadow-sm"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>

                                </div>
                            )}

                        </div>

                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleImageChange}
                            className="hidden"
                        />

                    </div>
                </section>

                {/* Text input */}
                <section className="scan-reveal rounded-[30px] border border-[#123c35]/10 bg-white p-4 shadow-[0_18px_50px_rgba(18,60,53,0.07)] sm:p-5">

                    <div className="flex items-center gap-3 border-b border-[#123c35]/8 pb-4">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7f3ea] text-[#123c35]">
                            <ScanLine className="h-4 w-4" />
                        </div>

                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#ef713d]">
                                Or describe it
                            </p>

                            <p className="mt-0.5 text-sm font-black text-[#123c35]">
                                Search with text instead of a photo
                            </p>
                        </div>

                    </div>

                    <div className="mt-4 flex flex-col gap-3 lg:flex-row">

                        <textarea
                            value={text}
                            onChange={(event) =>
                                setText(event.target.value)
                            }
                            placeholder="e.g. black cotton shirt, copper wire, Nike running shoes..."
                            rows={3}
                            className="min-h-[86px] flex-1 resize-none rounded-[22px] bg-[#fbfaf5] px-4 py-3 text-sm font-semibold text-[#123c35] outline-none ring-1 ring-inset ring-[#123c35]/8 placeholder:text-[#a0aaa5] focus:ring-[#ef713d]/40"
                        />

                        <div className="flex gap-3 lg:w-[240px] lg:flex-col">

                            <button
                                type="button"
                                onClick={() =>
                                    inputRef.current?.click()
                                }
                                disabled={loading}
                                className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full border border-[#123c35]/10 bg-[#f7f3ea] px-5 text-xs font-black text-[#123c35] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 lg:flex-none"
                            >
                                <ImagePlus className="h-4 w-4" />
                                Add image
                            </button>

                            <button
                                type="button"
                                onClick={scan}
                                disabled={
                                    loading ||
                                    (!file && !text.trim())
                                }
                                className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full bg-[#123c35] px-5 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-[#0d312b] disabled:cursor-not-allowed disabled:opacity-40 lg:flex-none"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin text-[#cbe95b]" />
                                        Scanning
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4 text-[#cbe95b]" />
                                        Scan
                                    </>
                                )}
                            </button>

                        </div>
                    </div>

                    {/* Loading card OUTSIDE the button */}
                    {loading && (
                        <div className="mt-4 rounded-[22px] border border-[#123c35]/10 bg-[#fbfaf5] p-4">
                            <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#123c35]">
                                    <Loader2 className="h-4 w-4 animate-spin text-[#e8f58d]" />
                                </div>

                                <div>
                                    <p className="text-xs font-black text-[#123c35]">
                                        {loadingStage}
                                    </p>

                                    <p className="mt-0.5 text-[9px] text-[#89938f]">
                                        This may take a few seconds.
                                    </p>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div
                            role="alert"
                            className="mt-4 rounded-[18px] bg-[#f9dfd0] p-4 text-xs font-semibold leading-5 text-[#93432e]"
                        >
                            {error}
                        </div>
                    )}

                </section>

                {/* Main result */}
                {recognition && (
                    <section
                        ref={resultRef}
                        className="mt-7 rounded-[30px] border border-[#123c35]/10 bg-[#123c35] p-6 text-white shadow-[0_24px_60px_rgba(18,60,53,0.16)] sm:p-7"
                    >

                        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#cbe95b]">
                                    Identified
                                </p>

                                <h2 className="mt-2 text-3xl font-black tracking-[-0.045em]">
                                    {recognition.name}
                                </h2>

                                <div className="mt-3 flex flex-wrap gap-2">

                                    <span className="rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.12em]">
                                        {recognition.type}
                                    </span>

                                    <span className="rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.12em]">
                                        {recognition.kind}
                                    </span>

                                    <span className="rounded-full bg-[#e8f58d] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-[#123c35]">
                                        {Math.round(
                                            recognition.confidence *
                                            100,
                                        )}
                                        % confidence
                                    </span>

                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">

                                {recognition.brand && (
                                    <div className="rounded-[20px] bg-white/8 px-4 py-3">
                                        <p className="text-[8px] font-black uppercase tracking-[0.15em] text-white/45">
                                            Brand
                                        </p>

                                        <p className="mt-1 text-sm font-black">
                                            {recognition.brand}
                                        </p>
                                    </div>
                                )}

                                {recognition.model && (
                                    <div className="rounded-[20px] bg-white/8 px-4 py-3">
                                        <p className="text-[8px] font-black uppercase tracking-[0.15em] text-white/45">
                                            Model
                                        </p>

                                        <p className="mt-1 text-sm font-black">
                                            {recognition.model}
                                        </p>
                                    </div>
                                )}

                                <div className="rounded-[20px] bg-white/8 px-4 py-3">
                                    <p className="text-[8px] font-black uppercase tracking-[0.15em] text-white/45">
                                        Location
                                    </p>

                                    <p className="mt-1 text-sm font-black">
                                        {result.location?.city ??
                                            (location
                                                ? "Detected"
                                                : "Unavailable")}
                                    </p>
                                </div>

                            </div>

                        </div>

                        {/* Attributes */}
                        {Object.keys(
                            recognition.attributes ?? {},
                        ).length > 0 && (
                                <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                    {Object.entries(
                                        recognition.attributes,
                                    ).map(
                                        ([key, value]) => (
                                            <div
                                                key={key}
                                                className="rounded-[18px] bg-white/6 p-4"
                                            >
                                                <p className="text-[8px] font-black uppercase tracking-[0.13em] text-white/40">
                                                    {key}
                                                </p>

                                                <p className="mt-1 text-xs font-bold text-white/85">
                                                    {value}
                                                </p>
                                            </div>
                                        ),
                                    )}
                                </div>
                            )}

                        {/* Detected text */}
                        {recognition.detectedText &&
                            recognition.detectedText.length >
                            0 && (
                                <div className="mt-6 rounded-[22px] bg-white/6 p-4">
                                    <p className="text-[8px] font-black uppercase tracking-[0.15em] text-white/40">
                                        Detected text
                                    </p>

                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {recognition.detectedText.map(
                                            (item, index) => (
                                                <span
                                                    key={`${item}-${index}`}
                                                    className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold"
                                                >
                                                    {item}
                                                </span>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}

                        {/* Price */}
                        {result.price && (
                            <div className="mt-6 rounded-[22px] bg-white/8 p-5">

                                <p className="text-[8px] font-black uppercase tracking-[0.15em] text-[#cbe95b]">
                                    Price information
                                </p>

                                {result.price.exact !==
                                    undefined ? (
                                    <p className="mt-2 text-2xl font-black">
                                        ₹
                                        {result.price.exact.toLocaleString(
                                            "en-IN",
                                        )}
                                    </p>
                                ) : result.price.min !==
                                    undefined &&
                                    result.price.max !==
                                    undefined ? (
                                    <p className="mt-2 text-2xl font-black">
                                        ₹
                                        {result.price.min.toLocaleString(
                                            "en-IN",
                                        )}
                                        {" – "}
                                        ₹
                                        {result.price.max.toLocaleString(
                                            "en-IN",
                                        )}
                                    </p>
                                ) : (
                                    <p className="mt-2 text-sm font-bold text-white/75">
                                        {result.price.message ??
                                            "Price varies by seller and location."}
                                    </p>
                                )}

                                {result.price.locationName && (
                                    <p className="mt-1 text-[10px] text-white/45">
                                        Around{" "}
                                        {
                                            result.price
                                                .locationName
                                        }
                                    </p>
                                )}

                                {result.price.sourceName && (
                                    <p className="mt-1 text-[10px] text-white/45">
                                        Source:{" "}
                                        {
                                            result.price
                                                .sourceName
                                        }
                                    </p>
                                )}

                            </div>
                        )}

                        {/* Location */}
                        {result.location && (
                            <div className="mt-6 rounded-[22px] bg-white/8 p-5">

                                <p className="text-[8px] font-black uppercase tracking-[0.15em] text-[#cbe95b]">
                                    Local context
                                </p>

                                {result.location.name && (
                                    <p className="mt-2 text-sm font-black">
                                        {result.location.name}
                                    </p>
                                )}

                                {result.location.address && (
                                    <p className="mt-1 text-[10px] leading-5 text-white/55">
                                        {
                                            result.location
                                                .address
                                        }
                                    </p>
                                )}

                                {(result.location.city ||
                                    result.location.state) && (
                                        <p className="mt-2 text-[10px] text-white/45">
                                            {
                                                [
                                                    result.location
                                                        .city,
                                                    result.location
                                                        .state,
                                                    result.location
                                                        .country,
                                                ]
                                                    .filter(Boolean)
                                                    .join(", ")
                                            }
                                        </p>
                                    )}

                            </div>
                        )}

                        {/* Backend message */}
                        {result.message && (
                            <div className="mt-6 rounded-[18px] bg-white/6 p-4">
                                <p className="text-xs leading-5 text-white/65">
                                    {result.message}
                                </p>
                            </div>
                        )}

                        {/* Food */}
                        {isFood && (
                            <div className="mt-6 rounded-[22px] bg-white/8 p-4">

                                <p className="text-sm font-black">
                                    Food detected.
                                </p>

                                <p className="mt-1 max-w-xl text-[10px] leading-5 text-white/55">
                                    Continue to Food Session for
                                    the full food profile,
                                    preferences, nearby food
                                    search and personalized
                                    recommendations.
                                </p>

                                <button
                                    type="button"
                                    onClick={openFoodSession}
                                    className="mt-4 inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#e8f58d] px-5 text-xs font-black text-[#123c35] transition hover:-translate-y-0.5"
                                >
                                    Explore Food
                                </button>

                            </div>
                        )}

                    </section>
                )}

                {/* Secondary result component */}
                {recognition && !isFood && (
                    <UniversalScanResult
                        recognition={recognition}
                        latitude={
                            result?.location?.latitude ??
                            location?.latitude
                        }
                        longitude={
                            result?.location?.longitude ??
                            location?.longitude
                        }
                    />
                )}

                <p className="scan-reveal mt-7 pb-4 text-center text-[9px] font-semibold text-[#89938f]">
                    FairTrip identifies first. Verified sources
                    provide factual and local information afterward.
                </p>

            </div>
        </main>
    );
}