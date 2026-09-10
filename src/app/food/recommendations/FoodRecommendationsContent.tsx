"use client";

import {
    AlertTriangle,
    ArrowLeft,
    Clock3,
    MapPin,
    MessageCircle,
    Sparkles,
    Utensils,
} from "lucide-react";

import {
    useRouter,
    useSearchParams,
} from "next/navigation";

import FoodRecommendationList from "@/features/food/components/FoodRecommendationList";

export default function FoodRecommendationsContent() {
    const searchParams =
        useSearchParams();

    const router =
        useRouter();

    /*
     * =========================================================
     * FOOD
     * =========================================================
     */

    const items = (
        searchParams.get(
            "items",
        ) ?? ""
    )
        .split(",")
        .map(
            (item) =>
                item.trim(),
        )
        .filter(Boolean);

    /*
     * =========================================================
     * GPS
     * =========================================================
     */

    const latitude =
        Number(
            searchParams.get(
                "latitude",
            ),
        );

    const longitude =
        Number(
            searchParams.get(
                "longitude",
            ),
        );

    const hasGpsLocation =
        Number.isFinite(
            latitude,
        ) &&
        Number.isFinite(
            longitude,
        );

    /*
     * =========================================================
     * USER LOCATION / AREA
     * =========================================================
     */

    const locationQuery =
        searchParams
            .get(
                "locationQuery",
            )
            ?.trim() ?? "";

    const hasUserLocation =
        locationQuery.length > 0;

    /*
     * IMPORTANT:
     *
     * Location is NOT required.
     */

    /*
     * =========================================================
     * BUDGET
     * =========================================================
     */

    const budgetParam =
        searchParams.get(
            "budget",
        );

    const budgetInr =
        budgetParam !== null &&
        budgetParam.trim() !== ""
            ? Number(
                  budgetParam,
              )
            : undefined;

    const hasValidBudget =
        budgetInr === undefined ||
        (
            Number.isFinite(
                budgetInr,
            ) &&
            budgetInr >= 0
        );

    /*
     * =========================================================
     * NO FOOD
     * =========================================================
     *
     * Food is the only required input.
     */

    if (
        items.length ===
        0
    ) {
        return (
            <div className="rounded-[28px] border border-dashed border-[#123c35]/15 bg-white p-8 text-center sm:p-10">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f9dfd0] text-[#ef713d]">
                    <AlertTriangle className="h-6 w-6" />
                </div>

                <h2 className="mt-5 text-lg font-black text-[#123c35]">
                    No scanned food found
                </h2>

                <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#6d7974]">
                    Scan a dish first so FairTrip
                    knows what you are interested in
                    eating.
                </p>

                <button
                    type="button"
                    onClick={() =>
                        router.push(
                            "/food/scan?mode=food",
                        )
                    }
                    className="mx-auto mt-6 flex h-11 items-center gap-2 rounded-full bg-[#123c35] px-5 text-xs font-black text-white hover:bg-[#0d312b]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Scan a dish
                </button>
            </div>
        );
    }

    /*
     * =========================================================
     * INVALID BUDGET
     * =========================================================
     */

    if (
        !hasValidBudget
    ) {
        return (
            <div className="rounded-[28px] bg-white p-8 text-center">
                <AlertTriangle className="mx-auto h-7 w-7 text-[#ef713d]" />

                <h2 className="mt-4 text-lg font-black text-[#123c35]">
                    Invalid budget
                </h2>

                <p className="mt-2 text-xs text-[#6d7974]">
                    Please enter a valid food budget.
                </p>
            </div>
        );
    }

    return (
        <div>

            {/* ================================================= */}
            {/* IMPORTANT MESSAGE — ALWAYS SHOWN                  */}
            {/* ================================================= */}

            <div className="mb-6 rounded-[26px] border border-[#123c35]/10 bg-white p-5 shadow-[0_12px_35px_rgba(18,60,53,0.05)]">

                <div className="flex items-start gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e8f58d]">
                        <Sparkles className="h-5 w-5 text-[#123c35]" />
                    </div>

                    <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#ef713d]">
                            FairTrip food guide
                        </p>

                        <h2 className="mt-1 text-lg font-black tracking-[-0.03em] text-[#123c35]">
                            Let's help you find something
                            worth eating.
                        </h2>

                        <p className="mt-2 text-xs leading-5 text-[#6d7974]">
                            Maps can miss street stalls,
                            temporary vendors and small
                            local food spots. Tell us what
                            you like, where you want to
                            explore, or ask a local for a
                            recommendation.
                        </p>
                    </div>
                </div>

                {/* ================================================= */}
                {/* LOCATION STATUS — INFORMATION ONLY                */}
                {/* ================================================= */}

                <div className="mt-5 rounded-[18px] bg-[#f7f3ea] p-4">

                    <div className="flex items-start gap-3">

                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#123c35]" />

                        <div>
                            {hasGpsLocation ? (
                                <>
                                    <p className="text-xs font-black text-[#123c35]">
                                        Approximate location
                                        available
                                    </p>

                                    <p className="mt-1 text-[10px] leading-4 text-[#6d7974]">
                                        We'll use it to find
                                        mapped food places
                                        nearby.
                                    </p>
                                </>
                            ) : hasUserLocation ? (
                                <>
                                    <p className="text-xs font-black text-[#123c35]">
                                        Searching around
                                    </p>

                                    <p className="mt-1 text-[10px] font-bold text-[#31544d]">
                                        {locationQuery}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="text-xs font-black text-[#b84f2c]">
                                        Exact location
                                        unavailable
                                    </p>

                                    <p className="mt-1 text-[10px] leading-4 text-[#6d7974]">
                                        That's okay. You can
                                        still explore food
                                        or tell FairTrip an
                                        area, market, station
                                        or landmark.
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ================================================= */}
            {/* FOOD / LOCAL EXPERIENCE PROMPT                    */}
            {/* ================================================= */}

            <div className="mb-6 grid gap-3 sm:grid-cols-3">

                <button
                    type="button"
                    onClick={() => {
                        const params =
                            new URLSearchParams(
                                searchParams.toString(),
                            );

                        params.set(
                            "foodIntent",
                            "local",
                        );

                        router.push(
                            `/food/recommendations?${params.toString()}`,
                        );
                    }}
                    className="rounded-[20px] border border-[#123c35]/8 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(18,60,53,0.06)]"
                >
                    <Utensils className="h-5 w-5 text-[#ef713d]" />

                    <p className="mt-3 text-xs font-black text-[#123c35]">
                        Eat like a local
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-[#6d7974]">
                        Discover popular local
                        dishes and street food.
                    </p>
                </button>

                <button
                    type="button"
                    onClick={() => {
                        const params =
                            new URLSearchParams(
                                searchParams.toString(),
                            );

                        params.set(
                            "foodIntent",
                            "popular",
                        );

                        router.push(
                            `/food/recommendations?${params.toString()}`,
                        );
                    }}
                    className="rounded-[20px] border border-[#123c35]/8 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(18,60,53,0.06)]"
                >
                    <Clock3 className="h-5 w-5 text-[#ef713d]" />

                    <p className="mt-3 text-xs font-black text-[#123c35]">
                        Good right now
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-[#6d7974]">
                        See food that fits the
                        current meal time.
                    </p>
                </button>

                <button
                    type="button"
                    onClick={() => {
                        const params =
                            new URLSearchParams(
                                searchParams.toString(),
                            );

                        params.set(
                            "foodIntent",
                            "local-tip",
                        );

                        router.push(
                            `/food/recommendations?${params.toString()}`,
                        );
                    }}
                    className="rounded-[20px] border border-[#123c35]/8 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(18,60,53,0.06)]"
                >
                    <MessageCircle className="h-5 w-5 text-[#ef713d]" />

                    <p className="mt-3 text-xs font-black text-[#123c35]">
                        Ask a local
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-[#6d7974]">
                        Get suggestions for what
                        people eat in this area.
                    </p>
                </button>
            </div>

            {/* ================================================= */}
            {/* LOCATION SEARCH                                   */}
            {/* ================================================= */}

            {!hasGpsLocation &&
                !hasUserLocation && (
                    <div className="mb-6 rounded-[24px] border border-[#123c35]/8 bg-[#e8f58d]/30 p-5">

                        <div className="flex items-start gap-3">

                            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#123c35]" />

                            <div className="flex-1">
                                <p className="text-sm font-black text-[#123c35]">
                                    Where do you want
                                    to eat?
                                </p>

                                <p className="mt-1 text-xs leading-5 text-[#6d7974]">
                                    An exact address is not
                                    necessary. Try a market,
                                    railway station,
                                    neighbourhood or
                                    landmark.
                                </p>

                                <form
                                    className="mt-4 flex flex-col gap-2 sm:flex-row"
                                    onSubmit={(
                                        event,
                                    ) => {
                                        event.preventDefault();

                                        const form =
                                            event.currentTarget;

                                        const input =
                                            form.elements.namedItem(
                                                "locationQuery",
                                            ) as HTMLInputElement;

                                        const value =
                                            input.value.trim();

                                        if (
                                            !value
                                        ) {
                                            return;
                                        }

                                        const params =
                                            new URLSearchParams(
                                                searchParams.toString(),
                                            );

                                        params.set(
                                            "locationQuery",
                                            value,
                                        );

                                        router.push(
                                            `/food/recommendations?${params.toString()}`,
                                        );
                                    }}
                                >
                                    <input
                                        name="locationQuery"
                                        type="text"
                                        placeholder="Dadar, Crawford Market, near station..."
                                        className="h-11 min-w-0 flex-1 rounded-full border border-[#123c35]/10 bg-white px-4 text-xs font-semibold text-[#123c35] outline-none"
                                    />

                                    <button
                                        type="submit"
                                        className="h-11 rounded-full bg-[#123c35] px-5 text-xs font-black text-white"
                                    >
                                        Search area
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

            {/* ================================================= */}
            {/* REAL / AVAILABLE RECOMMENDATIONS                   */}
            {/* ================================================= */}

            <FoodRecommendationList
                items={items}
                latitude={
                    hasGpsLocation
                        ? latitude
                        : 0
                }
                longitude={
                    hasGpsLocation
                        ? longitude
                        : 0
                }
                budgetInr={
                    budgetInr
                }
                locationQuery={
                    locationQuery ||
                    undefined
                }
            />
        </div>
    );
}