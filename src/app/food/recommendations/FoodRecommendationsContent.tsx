"use client";

import {
    AlertTriangle,
    ArrowLeft,
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
     * ---------------------------------------------------------
     * FOOD ITEMS
     * ---------------------------------------------------------
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
     * ---------------------------------------------------------
     * LOCATION
     * ---------------------------------------------------------
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

    /*
     * ---------------------------------------------------------
     * OPTIONAL BUDGET
     * ---------------------------------------------------------
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

    const hasItems =
        items.length > 0;

    const hasLocation =
        Number.isFinite(
            latitude,
        ) &&
        Number.isFinite(
            longitude,
        );

    const hasValidBudget =
        budgetInr === undefined ||
        (
            Number.isFinite(
                budgetInr,
            ) &&
            budgetInr >= 0
        );

    /*
     * ---------------------------------------------------------
     * INVALID REQUEST
     * ---------------------------------------------------------
     */

    if (
        !hasItems ||
        !hasLocation ||
        !hasValidBudget
    ) {
        let title =
            "Unable to load recommendations.";

        let description =
            "Some information required for food recommendations is missing.";

        if (!hasItems) {
            title =
                "No scanned food found";

            description =
                "Scan a dish first so FairTrip knows what food to search for.";
        } else if (!hasLocation) {
            title =
                "Location is required";

            description =
                "We need your location to find real nearby places serving this food.";
        } else if (!hasValidBudget) {
            title =
                "Invalid budget";

            description =
                "The budget supplied to FairTrip is not valid.";
        }

        return (
            <div className="rounded-[28px] border border-dashed border-[#123c35]/15 bg-white p-8 text-center sm:p-10">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f9dfd0] text-[#ef713d]">
                    <AlertTriangle className="h-6 w-6" />
                </div>

                <h2 className="mt-5 text-lg font-black tracking-[-0.03em] text-[#123c35]">
                    {title}
                </h2>

                <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#6d7974]">
                    {description}
                </p>

                <button
                    type="button"
                    onClick={() =>
                        router.push(
                            "/food/scan?mode=food",
                        )
                    }
                    className="mx-auto mt-6 flex h-11 items-center gap-2 rounded-full bg-[#123c35] px-5 text-xs font-black text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0d312b]"
                >
                    <ArrowLeft className="h-4 w-4" />

                    Scan a dish
                </button>
            </div>
        );
    }

    /*
     * ---------------------------------------------------------
     * RECOMMENDATIONS
     * ---------------------------------------------------------
     */

    return (
        <FoodRecommendationList
            items={items}
            latitude={latitude}
            longitude={longitude}
            budgetInr={
                budgetInr
            }
        />
    );
}