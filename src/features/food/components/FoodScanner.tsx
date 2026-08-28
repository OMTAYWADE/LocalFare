"use client";

import { useRef, useState } from "react";
import { ArrowLeft, Camera, Check, ImagePlus, Loader2, Menu, RotateCcw, Sparkles, Upload, Utensils } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type ScanMode = "food" | "menu";

export default function FoodScanner() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const initialMode: ScanMode =
        searchParams.get("mode") === "menu" ? "menu" : "food";

    const [mode, setMode] = useState<ScanMode>(initialMode);
    const [image, setImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string[] | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    function handleFile(selectedFile?: File) {
        if (!selectedFile) {
            return;
        }

        if (!selectedFile.type.startsWith("image/")) {
            return;
        }

        if (image) {
            URL.revokeObjectURL(image);
        }

        const objectUrl = URL.createObjectURL(selectedFile);

        setFile(selectedFile);
        setImage(objectUrl);
        setResult(null);
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>,) {
        const selectedFile = event.target.files?.[0];
        handleFile(selectedFile);
    }

    function reset() {
        if (image) {
            URL.revokeObjectURL(image);
        }

        setImage(null);
        setFile(null);
        setResult(null);
        setLoading(false);

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    function changeMode(nextMode: ScanMode) {
        setMode(nextMode);
        reset();
    }

    async function analyze() {
        if (!file || loading) {
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const formData = new FormData();

            formData.append("image", file);
            formData.append("mode", mode);

            const response = await fetch("/api/food/scan", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Food scan failed: ${response.status}`,);
            }

            const data: unknown = await response.json();

            if (typeof data === "object" && data !== null && "items" in data && Array.isArray((data as { items?: unknown }).items,)) {
                setResult(
                    (data as { items: unknown[] }).items.filter((item): item is string => typeof item === "string",),
                );
            } else {
                setResult([]);
            }
        } catch (error) {
            console.error("Food scanning failed:", error);
            setResult([]);
        } finally {
            setLoading(false);
        }
    }

    function handleRecommendations() {
    if (!result || result.length === 0) {
        return;
    }

    const params = new URLSearchParams();

    params.set(
        "items",
        result.join(","),
    );

    router.push(
        `/food/recommendations?${params.toString()}`,
    );
}

    const isFoodMode = mode === "food";

    return (
        <section className="mx-auto max-w-4xl pb-20 pt-8 sm:pt-12">
            {/* Header */}

            <div className="flex items-center justify-between gap-4">
                <button type="button" onClick={() => router.push("/food")} className=" inline-flex h-10 items-center gap-2 rounded-full border border-[#123c35]/10 bg-white px-4 text-xs font-bold text-[#123c35] transition hover:border-[#123c35]/20 hover:bg-[#fbfaf5]">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>

                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#31544d]">
                    <Sparkles className="h-3.5 w-3.5 text-[#ef713d]" />
                    Smart scan
                </div>
            </div>

            {/* Title */}

            <div className="mt-8">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#ef713d]">
                    {isFoodMode ? "Food recognition" : "Menu recognition"}
                </p>

                <h1 className="mt-2 text-4xl font-black tracking-[-0.05em] text-[#123c35] sm:text-5xl">
                    {isFoodMode ? "What are you eating?" : "What's on the menu?"}
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-6 text-[#6d7974]">
                    {isFoodMode
                        ? "Take a photo or upload a dish. FairTrip will identify it and help you understand whether it fits your preferences."
                        : "Take a photo of a restaurant menu. FairTrip will extract dishes and later rank them for you."}
                </p>
            </div>

            {/* Mode switch */}

            <div className="mt-7 inline-flex rounded-full border border-[#123c35]/10 bg-white p-1">
                <button type="button" onClick={() => changeMode("food")} className={` inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-black transition ${isFoodMode ? "bg-[#123c35] text-white" : "text-[#31544d] hover:bg-[#f7f3ea]"}`} >
                    <Camera className="h-4 w-4" />
                    Food
                </button>

                <button type="button" onClick={() => changeMode("menu")} className={` inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-black transition ${!isFoodMode ? "bg-[#123c35] text-white" : "text-[#31544d] hover:bg-[#f7f3ea]"} `}>
                    <Menu className="h-4 w-4" />
                    Menu
                </button>
            </div>

            {/* Scanner */}

            <div className="mt-6 overflow-hidden rounded-[30px] border border-[#123c35]/10 bg-white shadow-[0_20px_60px_rgba(18,60,53,0.07)]">
                {!image ? (
                    <div className="p-5 sm:p-7">
                        <label htmlFor="food-image" className=" flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#123c35]/10 bg-[#fbfaf5] px-6 text-center transition hover:border-[#123c35]/20 hover:bg-[#f8f6ed]">
                            <span className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#e8f58d] text-[#123c35]">
                                {isFoodMode ? (
                                    <Camera className="h-7 w-7" />
                                ) : (
                                    <Menu className="h-7 w-7" />
                                )}
                            </span>

                            <h2 className="mt-5 text-lg font-black text-[#123c35]">
                                {isFoodMode ? "Scan your food" : "Scan your menu"}
                            </h2>

                            <p className="mt-2 max-w-sm text-xs leading-5 text-[#6d7974]">
                                Take a picture with your camera
                                or choose an image from your
                                device.
                            </p>

                            <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#123c35] px-5 py-3 text-xs font-black text-white">
                                <Upload className="h-4 w-4" />
                                Choose image
                            </span>
                        </label>

                        <input ref={inputRef} id="food-image" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={handleInputChange} className="hidden" />

                        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold text-[#6d7974]">
                            <ImagePlus className="h-3.5 w-3.5" />
                            JPG, PNG or WEBP
                        </div>
                    </div>
                ) : (
                    <div className="p-5 sm:p-7">
                        {/* Image preview */}

                        <div className="relative overflow-hidden rounded-[24px] bg-[#123c35]">
                            <img src={image} alt={isFoodMode ? "Selected food" : "Selected menu"} className="max-h-[500px] w-full object-contain" />

                            <button type="button" onClick={reset} disabled={loading} aria-label="Remove selected image"
                                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70 disabled:opacity-50">
                                <RotateCcw className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Analyze */}

                        {result === null && (
                            <button type="button" onClick={analyze} disabled={loading} className=" mt-5 flex min-h-[54px] w-full items-center justify-center gap-2 rounded-full bg-[#123c35] px-6 text-sm font-black text-white transition hover:bg-[#0d312b] disabled:cursor-not-allowed disabled:opacity-60">
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4 text-[#cbe95b]" />
                                        Analyze{" "}
                                        {isFoodMode ? "food" : "menu"}
                                    </>
                                )}
                            </button>
                        )}

                        {/* Result */}

                        {result !== null && (
                            <div className="mt-5 rounded-[22px] bg-[#fbfaf5] p-5">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e8f58d] text-[#123c35]">
                                        <Check className="h-4 w-4" />
                                    </span>

                                    <div>
                                        <p className="text-sm font-black text-[#123c35]">
                                            Scan complete
                                        </p>

                                        <p className="text-xs text-[#6d7974]">
                                            {isFoodMode ? "Detected food" : "Detected menu items"}
                                        </p>
                                    </div>
                                </div>

                                {result.length > 0 ? (
                                    <div className="mt-5 grid gap-2 sm:grid-cols-2">
                                        {result.map((item, index) => (
                                            <div
                                                key={`${item}-${index}`}
                                                className=" rounded-2xl border border-[#123c35]/8 bg-white px-4 py-3 text-sm font-bold text-[#123c35]">
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                ) : (

                                    <div className="mt-5 rounded-2xl border border-[#123c35]/8 bg-white p-4">
                                        <p className="text-sm font-bold text-[#123c35]">
                                            Nothing was detected yet.
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-[#6d7974]">
                                            Try a clearer image with
                                            the food or menu fully
                                            visible.
                                        </p>
                                    </div>
                                )}
                                {isFoodMode && result.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleRecommendations}
                                        className="mt-4 flex min-h-[54px] w-full items-center justify-center gap-2 rounded-full bg-[#ef713d] px-6 text-sm font-black text-white transition hover:bg-[#df6030]"
                                    >
                                        <Utensils className="h-4 w-4" />

                                        Find food recommendations
                                    </button>
                                )}

                                <button type="button" onClick={reset} className=" mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-[#123c35]/10 bg-white py-3 text-xs font-black text-[#123c35] transition hover:bg-[#f7f3ea]">
                                    <RotateCcw className="h-4 w-4" />
                                    Scan another
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Information */}

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#123c35]/8 bg-white p-4">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#ef713d]" />

                <p className="text-[11px] leading-5 text-[#6d7974]">
                    FairTrip will use the detected food or menu
                    items to provide recommendations based on
                    your taste, eating time, dietary preferences
                    and budget.
                </p>
            </div>
            
        </section>
    );
}