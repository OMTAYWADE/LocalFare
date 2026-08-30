"use client";

import {
    ArrowLeft,
    Camera,
    Check,
    ImagePlus,
    Loader2,
    MapPin,
    Menu,
    RotateCcw,
    Sparkles,
    Upload,
    Utensils,
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
} from "react";

import {
    useRouter,
    useSearchParams,
} from "next/navigation";

interface UserLocation {
    latitude: number;
    longitude: number;
}

interface RecognizedFood {
    id?: string;
    name?: string;
    description?: string;

    cuisine?: string[];
    diet?: string;
    spiceLevel?: string;
    mealTypes?: string[];

    priceInr?: number;
    priceRange?: "₹" | "₹₹" | "₹₹₹";

    priceEstimated?: boolean;
    priceRangeEstimated?: boolean;

    rating?: number;

    imageUrl?: string;

    latitude?: number;
    longitude?: number;
}

interface ScanResult {
    items: string[];
    foods: RecognizedFood[];
    confidence: number;
    source?: string;
    message?: string;
}

interface ScanApiResponse {
    items?: unknown[];
    foods?: unknown[];
    confidence?: number;
    source?: string;
    message?: string;
    error?: string;
}

export default function FoodScanner() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const initialMode =
        searchParams.get("mode") === "menu"
            ? "menu"
            : "food";

    const [mode, setMode] =
        useState<"food" | "menu">(
            initialMode,
        );

    const [image, setImage] =
        useState<string | null>(null);

    const [file, setFile] =
        useState<File | null>(null);

    const [loading, setLoading] =
        useState(false);

    const [locationLoading, setLocationLoading] =
        useState(false);

    const [location, setLocation] =
        useState<UserLocation | null>(null);

    const [locationError, setLocationError] =
        useState("");

    const [error, setError] =
        useState("");

    const [result, setResult] =
        useState<ScanResult | null>(null);

    const inputRef =
        useRef<HTMLInputElement>(null);

    /*
     * ---------------------------------------------------------
     * LOCATION
     * ---------------------------------------------------------
     */

    function getUserLocation(): Promise<UserLocation> {
        return new Promise(
            (
                resolve,
                reject,
            ) => {
                if (
                    typeof navigator ===
                        "undefined" ||
                    !navigator.geolocation
                ) {
                    reject(
                        new Error(
                            "Geolocation is not supported by this browser.",
                        ),
                    );

                    return;
                }

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            latitude:
                                position.coords
                                    .latitude,
                            longitude:
                                position.coords
                                    .longitude,
                        });
                    },
                    (geoError) => {
                        let message =
                            "Unable to get your location.";

                        if (
                            geoError.code === 1
                        ) {
                            message =
                                "Location permission was denied.";
                        } else if (
                            geoError.code === 2
                        ) {
                            message =
                                "Your location could not be determined.";
                        } else if (
                            geoError.code === 3
                        ) {
                            message =
                                "Location request timed out.";
                        }

                        reject(
                            new Error(
                                message,
                            ),
                        );
                    },
                    {
                        enableHighAccuracy:
                            true,
                        timeout:
                            10000,
                        maximumAge:
                            300000,
                    },
                );
            },
        );
    }

    /*
     * ---------------------------------------------------------
     * FILE
     * ---------------------------------------------------------
     */

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
                "Please select an image file.",
            );

            return;
        }

        if (
            selectedFile.size >
            10 * 1024 * 1024
        ) {
            setError(
                "Image must be smaller than 10 MB.",
            );

            return;
        }

        setError("");
        setLocationError("");
        setResult(null);

        if (image) {
            URL.revokeObjectURL(
                image,
            );
        }

        const objectUrl =
            URL.createObjectURL(
                selectedFile,
            );

        setFile(
            selectedFile,
        );

        setImage(
            objectUrl,
        );
    }

    function handleInputChange(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        handleFile(
            event.target.files?.[0],
        );

        event.target.value = "";
    }

    /*
     * ---------------------------------------------------------
     * RESET
     * ---------------------------------------------------------
     */

    function reset() {
        if (image) {
            URL.revokeObjectURL(
                image,
            );
        }

        setImage(null);
        setFile(null);
        setResult(null);
        setLocation(null);
        setLoading(false);
        setLocationLoading(false);
        setLocationError("");
        setError("");

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    /*
     * ---------------------------------------------------------
     * MODE
     * ---------------------------------------------------------
     */

    function changeMode(
        nextMode: "food" | "menu",
    ) {
        reset();
        setMode(
            nextMode,
        );
    }

    /*
     * ---------------------------------------------------------
     * ANALYZE
     * ---------------------------------------------------------
     */

    async function analyze() {
        if (!file || loading) {
            return;
        }

        setLoading(true);
        setResult(null);
        setError("");
        setLocationError("");

        try {
            /*
             * Get location.
             *
             * Food recognition can continue even if
             * location permission fails.
             */
            let userLocation:
                | UserLocation
                | null = null;

            setLocationLoading(
                true,
            );

            try {
                userLocation =
                    await getUserLocation();

                setLocation(
                    userLocation,
                );
            } catch (
                locationException
            ) {
                console.warn(
                    "Location unavailable:",
                    locationException,
                );

                setLocation(null);

                setLocationError(
                    locationException instanceof
                        Error
                        ? locationException.message
                        : "Unable to access your location.",
                );
            } finally {
                setLocationLoading(
                    false,
                );
            }

            /*
             * Send image to recognition API.
             */
            const formData =
                new FormData();

            formData.append(
                "image",
                file,
            );

            formData.append(
                "mode",
                mode,
            );

            if (userLocation) {
                formData.append(
                    "latitude",
                    String(
                        userLocation.latitude,
                    ),
                );

                formData.append(
                    "longitude",
                    String(
                        userLocation.longitude,
                    ),
                );
            }

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

            if (
                !response.ok
            ) {
                throw new Error(
                    data.error ??
                        `Food scan failed: ${response.status}`,
                );
            }

            /*
             * Recognized names.
             */
            const items =
                Array.isArray(
                    data.items,
                )
                    ? data.items
                          .filter(
                              (
                                  item,
                              ): item is string =>
                                  typeof item ===
                                      "string" &&
                                  item.trim()
                                      .length >
                                      0,
                          )
                          .map(
                              (item) =>
                                  item
                                      .trim()
                                      .replace(
                                          /\s+/g,
                                          " ",
                                      ),
                          )
                    : [];

            /*
             * Enriched FoodItem objects.
             */
            const foods =
                Array.isArray(
                    data.foods,
                )
                    ? data.foods.filter(
                          (
                              food,
                          ): food is RecognizedFood =>
                              typeof food ===
                                  "object" &&
                              food !== null,
                      )
                    : [];

            const confidence =
                typeof data.confidence ===
                "number"
                    ? Math.min(
                          Math.max(
                              data.confidence,
                              0,
                          ),
                          1,
                      )
                    : 0;

            setResult({
                items: [
                    ...new Set(
                        items,
                    ),
                ],
                foods,
                confidence,
                source:
                    data.source,
                message:
                    data.message,
            });

            if (
                items.length === 0
            ) {
                setError(
                    data.message ??
                        "No food could be identified from this image.",
                );
            }
        } catch (exception) {
            console.error(
                "[FoodScanner] Scan failed:",
                exception,
            );

            setResult(null);

            setError(
                exception instanceof
                    Error
                    ? exception.message
                    : "Food recognition failed. Please try again.",
            );
        } finally {
            setLoading(false);
        }
    }

    /*
     * ---------------------------------------------------------
     * OPEN RECOMMENDATIONS
     * ---------------------------------------------------------
     */

    function handleRecommendations() {
        if (
            !result ||
            result.items.length ===
                0
        ) {
            return;
        }

        if (!location) {
            setLocationError(
                "Allow location access to find nearby food places.",
            );

            return;
        }

        const params =
            new URLSearchParams();

        params.set(
            "items",
            result.items.join(","),
        );

        params.set(
            "latitude",
            String(
                location.latitude,
            ),
        );

        params.set(
            "longitude",
            String(
                location.longitude,
            ),
        );

        router.push(
            `/food/recommendations?${params.toString()}`,
        );
    }

    /*
     * ---------------------------------------------------------
     * CLEANUP
     * ---------------------------------------------------------
     *
     * No state updates inside this effect.
     */
    useEffect(() => {
        return () => {
            if (image) {
                URL.revokeObjectURL(
                    image,
                );
            }
        };
    }, [image]);

    const isFoodMode =
        mode === "food";

    return (
        <section className="mx-auto max-w-4xl pb-20 pt-8 sm:pt-12">
            {/* HEADER */}
            <div className="flex items-center justify-between gap-4">
                <button
                    type="button"
                    onClick={() =>
                        router.push(
                            "/food",
                        )
                    }
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-[#123c35]/10 bg-white px-4 text-xs font-bold text-[#123c35]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>

                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#31544d]">
                    <Sparkles className="h-3.5 w-3.5 text-[#ef713d]" />
                    Smart scan
                </div>
            </div>

            {/* TITLE */}
            <div className="mt-8">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#ef713d]">
                    {isFoodMode
                        ? "Food recognition"
                        : "Menu recognition"}
                </p>

                <h1 className="mt-2 text-4xl font-black tracking-[-0.05em] text-[#123c35] sm:text-5xl">
                    {isFoodMode
                        ? "What are you eating?"
                        : "What's on the menu?"}
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-6 text-[#6d7974]">
                    {isFoodMode
                        ? "Take a photo of a dish and FairTrip identifies it, shows useful food information and can find real nearby places."
                        : "Take a photo of a menu and FairTrip extracts the food items."}
                </p>
            </div>

            {/* MODE */}
            <div className="mt-7 inline-flex rounded-full border border-[#123c35]/10 bg-white p-1">
                <button
                    type="button"
                    onClick={() =>
                        changeMode(
                            "food",
                        )
                    }
                    disabled={loading}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-black ${
                        isFoodMode
                            ? "bg-[#123c35] text-white"
                            : "text-[#31544d]"
                    }`}
                >
                    <Camera className="h-4 w-4" />
                    Food
                </button>

                <button
                    type="button"
                    onClick={() =>
                        changeMode(
                            "menu",
                        )
                    }
                    disabled={loading}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-black ${
                        !isFoodMode
                            ? "bg-[#123c35] text-white"
                            : "text-[#31544d]"
                    }`}
                >
                    <Menu className="h-4 w-4" />
                    Menu
                </button>
            </div>

            {/* SCANNER */}
            <div className="mt-6 overflow-hidden rounded-[30px] border border-[#123c35]/10 bg-white shadow-[0_20px_60px_rgba(18,60,53,0.07)]">
                {!image ? (
                    <div className="p-5 sm:p-7">
                        <label
                            htmlFor="food-image"
                            className="flex min-h-[330px] cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#123c35]/10 bg-[#fbfaf5] px-6 text-center"
                        >
                            <span className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#e8f58d] text-[#123c35]">
                                {isFoodMode ? (
                                    <Camera className="h-7 w-7" />
                                ) : (
                                    <Menu className="h-7 w-7" />
                                )}
                            </span>

                            <h2 className="mt-5 text-lg font-black text-[#123c35]">
                                {isFoodMode
                                    ? "Scan your food"
                                    : "Scan your menu"}
                            </h2>

                            <p className="mt-2 max-w-sm text-xs leading-5 text-[#6d7974]">
                                Take a picture with your
                                camera or choose an image
                                from your device.
                            </p>

                            <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#123c35] px-5 py-3 text-xs font-black text-white">
                                <Upload className="h-4 w-4" />
                                Choose image
                            </span>
                        </label>

                        <input
                            ref={inputRef}
                            id="food-image"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            capture="environment"
                            onChange={
                                handleInputChange
                            }
                            className="hidden"
                        />

                        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold text-[#6d7974]">
                            <ImagePlus className="h-3.5 w-3.5" />
                            JPG, PNG or WEBP · Max 10 MB
                        </div>
                    </div>
                ) : (
                    <div className="p-5 sm:p-7">
                        {/* IMAGE */}
                        <div className="relative overflow-hidden rounded-[24px] bg-[#123c35]">
                            <img
                                src={image}
                                alt={
                                    isFoodMode
                                        ? "Selected food"
                                        : "Selected menu"
                                }
                                className="max-h-[520px] w-full object-contain"
                            />

                            <button
                                type="button"
                                onClick={
                                    reset
                                }
                                disabled={
                                    loading
                                }
                                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur"
                            >
                                <RotateCcw className="h-4 w-4" />
                            </button>
                        </div>

                        {/* ERROR */}
                        {error && (
                            <div className="mt-4 rounded-[18px] bg-[#f9dfd0] px-4 py-3">
                                <p className="text-xs font-bold leading-5 text-[#b84f2c]">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* ANALYZE */}
                        {result === null && (
                            <button
                                type="button"
                                onClick={
                                    analyze
                                }
                                disabled={
                                    loading
                                }
                                className="mt-5 flex min-h-[54px] w-full items-center justify-center gap-2 rounded-full bg-[#123c35] px-6 text-sm font-black text-white disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />

                                        {locationLoading
                                            ? "Getting location..."
                                            : "Recognizing food..."}
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4 text-[#cbe95b]" />

                                        Analyze{" "}
                                        {
                                            isFoodMode
                                                ? "food"
                                                : "menu"
                                        }
                                    </>
                                )}
                            </button>
                        )}

                        {/* ================================================= */}
                        {/* RESULT                                            */}
                        {/* ================================================= */}

                        {result !== null && (
                            <div className="mt-5 space-y-4">
                                <div className="rounded-[24px] bg-[#fbfaf5] p-5">

                                    {/* STATUS */}

                                    <div className="flex items-center gap-3">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f58d]">
                                            <Check className="h-5 w-5 text-[#123c35]" />
                                        </span>

                                        <div>
                                            <p className="text-sm font-black text-[#123c35]">
                                                Scan complete
                                            </p>

                                            <p className="text-xs text-[#6d7974]">
                                                {isFoodMode
                                                    ? "Food identified"
                                                    : "Menu items identified"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* DETECTED FOODS */}

                                    <div className="mt-5 space-y-4">
                                        {result.items.map(
                                            (
                                                item,
                                                index,
                                            ) => {
                                                const food =
                                                    result.foods.find(
                                                        (
                                                            candidate,
                                                        ) =>
                                                            candidate.name?.toLowerCase() ===
                                                            item.toLowerCase(),
                                                    );

                                                return (
                                                    <article
                                                        key={`${item}-${index}`}
                                                        className="overflow-hidden rounded-[22px] border border-[#123c35]/8 bg-white"
                                                    >
                                                        {/* FOOD IMAGE */}

                                                        {food?.imageUrl && (
                                                            <div className="h-52 w-full overflow-hidden bg-[#f7f3ea]">
                                                                <img
                                                                    src={
                                                                        food.imageUrl
                                                                    }
                                                                    alt={
                                                                        food.name ??
                                                                        item
                                                                    }
                                                                    loading="lazy"
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            </div>
                                                        )}

                                                        <div className="p-5">

                                                            {/* NAME */}

                                                            <div className="flex items-start justify-between gap-4">
                                                                <div>
                                                                    <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#ef713d]">
                                                                        Detected food
                                                                    </p>

                                                                    <h3 className="mt-1 text-2xl font-black tracking-[-0.04em] text-[#123c35]">
                                                                        {
                                                                            food?.name ??
                                                                            item
                                                                        }
                                                                    </h3>
                                                                </div>

                                                                {result.confidence >
                                                                    0 && (
                                                                    <span className="shrink-0 rounded-full bg-[#e8f58d] px-3 py-1.5 text-[10px] font-black text-[#123c35]">
                                                                        {Math.round(
                                                                            result.confidence *
                                                                                100,
                                                                        )}
                                                                        %
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* DESCRIPTION */}

                                                            {food?.description && (
                                                                <p className="mt-3 text-sm leading-6 text-[#6d7974]">
                                                                    {
                                                                        food.description
                                                                    }
                                                                </p>
                                                            )}

                                                            {/* TAGS */}

                                                            <div className="mt-4 flex flex-wrap gap-2">
                                                                {food?.cuisine?.map(
                                                                    (
                                                                        cuisine,
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                cuisine
                                                                            }
                                                                            className="rounded-full bg-[#f7f3ea] px-3 py-1.5 text-[9px] font-black capitalize text-[#31544d]"
                                                                        >
                                                                            {cuisine.replaceAll(
                                                                                "-",
                                                                                " ",
                                                                            )}
                                                                        </span>
                                                                    ),
                                                                )}

                                                                {food?.diet && (
                                                                    <span className="rounded-full bg-[#e8f58d] px-3 py-1.5 text-[9px] font-black capitalize text-[#123c35]">
                                                                        {
                                                                            food.diet
                                                                        }
                                                                    </span>
                                                                )}

                                                                {food?.spiceLevel && (
                                                                    <span className="rounded-full bg-[#fff0e7] px-3 py-1.5 text-[9px] font-black capitalize text-[#b84f2c]">
                                                                        🌶️{" "}
                                                                        {
                                                                            food.spiceLevel
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* INFORMATION GRID */}

                                                            <div className="mt-4 grid gap-3 sm:grid-cols-2">

                                                                {/* PRICE */}

                                                                <div className="rounded-[18px] bg-[#f7f3ea] p-4">
                                                                    <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#6d7974]">
                                                                        Typical price
                                                                    </p>

                                                                    {typeof food?.priceInr ===
                                                                    "number" ? (
                                                                        <>
                                                                            <p className="mt-1 text-xl font-black text-[#123c35]">
                                                                                ₹
                                                                                {Math.round(
                                                                                    food.priceInr,
                                                                                )}
                                                                            </p>

                                                                            {food.priceEstimated && (
                                                                                <p className="mt-1 text-[9px] text-[#89938f]">
                                                                                    Estimated
                                                                                </p>
                                                                            )}
                                                                        </>
                                                                    ) : food?.priceRange ? (
                                                                        <>
                                                                            <p className="mt-1 text-xl font-black text-[#123c35]">
                                                                                {
                                                                                    food.priceRange
                                                                                }
                                                                            </p>

                                                                            {food.priceRangeEstimated && (
                                                                                <p className="mt-1 text-[9px] text-[#89938f]">
                                                                                    Estimated
                                                                                    range
                                                                                </p>
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <p className="mt-1 text-xs font-bold text-[#89938f]">
                                                                            Price
                                                                            unavailable
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                {/* MEAL */}

                                                                <div className="rounded-[18px] bg-[#e8f58d]/40 p-4">
                                                                    <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#6d7974]">
                                                                        Best time
                                                                    </p>

                                                                    <p className="mt-1 text-sm font-black capitalize text-[#123c35]">
                                                                        {food?.mealTypes?.join(
                                                                            " • ",
                                                                        ) ??
                                                                            "Information unavailable"}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </article>
                                                );
                                            },
                                        )}
                                    </div>

                                    {/* NOTHING DETECTED */}

                                    {result.items.length ===
                                        0 && (
                                        <div className="mt-5 rounded-[18px] bg-white p-5">
                                            <p className="text-sm font-bold text-[#123c35]">
                                                Nothing was detected.
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-[#6d7974]">
                                                Try a clearer
                                                image with
                                                the food
                                                fully
                                                visible.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* LOCATION */}

                                {location ? (
                                    <div className="rounded-[22px] bg-[#e8f58d]/50 p-5">
                                        <div className="flex items-start gap-3">
                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#123c35]">
                                                <MapPin className="h-4 w-4 text-white" />
                                            </span>

                                            <div>
                                                <p className="text-sm font-black text-[#123c35]">
                                                    Location
                                                    detected
                                                </p>

                                                <p className="mt-1 text-xs leading-5 text-[#6d7974]">
                                                    FairTrip
                                                    can now
                                                    find
                                                    real
                                                    nearby
                                                    food
                                                    places.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-[22px] bg-[#f9dfd0] p-5">
                                        <p className="text-xs font-bold text-[#b84f2c]">
                                            {locationError ||
                                                "Allow location access to find nearby food places."}
                                        </p>
                                    </div>
                                )}

                                {/* RECOMMENDATIONS */}

                                {isFoodMode &&
                                    result.items.length >
                                        0 && (
                                        <button
                                            type="button"
                                            onClick={
                                                handleRecommendations
                                            }
                                            disabled={
                                                !location
                                            }
                                            className="flex min-h-[54px] w-full items-center justify-center gap-2 rounded-full bg-[#ef713d] px-6 text-sm font-black text-white transition hover:bg-[#df6030] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <Utensils className="h-4 w-4" />

                                            Find nearby food
                                            places
                                        </button>
                                    )}

                                {/* RESET */}

                                <button
                                    type="button"
                                    onClick={
                                        reset
                                    }
                                    disabled={
                                        loading
                                    }
                                    className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-[#123c35]/10 bg-white text-xs font-black text-[#123c35]"
                                >
                                    <RotateCcw className="h-4 w-4" />

                                    Scan another
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#123c35]/8 bg-white p-4">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#ef713d]" />

                <p className="text-[11px] leading-5 text-[#6d7974]">
                    FairTrip identifies the food
                    from the image, enriches it with
                    available food information, and
                    can use your location to find real
                    nearby places.
                </p>
            </div>
        </section>
    );
}