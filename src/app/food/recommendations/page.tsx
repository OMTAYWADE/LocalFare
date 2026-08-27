"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
    ArrowLeft,
    Clock3,
    Sparkles,
    Utensils,
} from "lucide-react";

import FoodFilters from "@/features/food/components/FoodFilters";
import FoodRecommendationList from "@/features/food/components/FoodRecommendationList";

import { foodItems } from "@/features/food/data/food-categories";

import { searchFood } from "@/features/food/services/foodSearch.service";

import {
    getFoodRecommendations,
} from "@/features/food/services/foodRecommendation.service";

import type {
    FoodCuisine,
    FoodDiet,
    FoodItem,
    MealType,
    SpiceLevel,
} from "@/features/food/types/food.types";


/* ============================================================
   CURRENT MEAL
   ============================================================ */

function getCurrentMeal(): MealType {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 11) {
        return "breakfast";
    }

    if (hour >= 11 && hour < 16) {
        return "lunch";
    }

    if (hour >= 16 && hour < 19) {
        return "snack";
    }

    if (hour >= 19 && hour < 23) {
        return "dinner";
    }

    return "late-night";
}


/* ============================================================
   PAGE
   ============================================================ */

export default function FoodRecommendationsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    /* ---------------------------------------------------------
       SCANNED ITEMS
       --------------------------------------------------------- */

    const detectedItems = useMemo(() => {
        const value = searchParams.get("items");

        if (!value) {
            return [];
        }

        return value
            .split(",")
            .map((item) => {
                try {
                    return decodeURIComponent(
                        item.trim(),
                    );
                } catch {
                    return item.trim();
                }
            })
            .filter(Boolean);
    }, [searchParams]);


    /* ---------------------------------------------------------
       PREFERENCES
       --------------------------------------------------------- */

    const [budget, setBudget] = useState(300);

    const [diet, setDiet] =
        useState<FoodDiet | "all">("all");

    const [spice, setSpice] =
        useState<SpiceLevel | "all">("all");

    const [cuisine, setCuisine] =
        useState<FoodCuisine | "all">("all");


    /* ---------------------------------------------------------
       MEAL TIME
       --------------------------------------------------------- */

    const currentMeal = useMemo(
        () => getCurrentMeal(),
        [],
    );


    /* ---------------------------------------------------------
       FIND FOODS
       --------------------------------------------------------- */

    const matchingFoods = useMemo(() => {
        /*
         * No scanned food:
         * show complete food dataset.
         */

        if (detectedItems.length === 0) {
            return foodItems;
        }

        const found: FoodItem[] = [];

        for (const item of detectedItems) {
            const results = searchFood({
                query: item,
            });

            found.push(...results);
        }

        /*
         * Remove duplicate food items.
         */

        const uniqueFoods = Array.from(
            new Map(
                found.map((food) => [
                    food.id,
                    food,
                ]),
            ).values(),
        );

        /*
         * If the scanner detected something
         * which doesn't exist in our local
         * dataset, don't show an empty page.
         */

        if (uniqueFoods.length === 0) {
            return foodItems;
        }

        return uniqueFoods;
    }, [detectedItems]);


    /* ---------------------------------------------------------
       FILTER
       --------------------------------------------------------- */

    const filteredFoods = useMemo(() => {
        return matchingFoods.filter((food) => {

            /*
             * Budget
             */

            if (food.priceInr > budget) {
                return false;
            }


            /*
             * Diet
             */

            if (
                diet !== "all" &&
                food.diet !== diet
            ) {
                return false;
            }


            /*
             * Spice
             */

            if (
                spice !== "all" &&
                food.spiceLevel !== spice
            ) {
                return false;
            }


            /*
             * Cuisine
             */

            if (
                cuisine !== "all" &&
                !food.cuisine.includes(cuisine)
            ) {
                return false;
            }


            return true;
        });
    }, [
        matchingFoods,
        budget,
        diet,
        spice,
        cuisine,
    ]);


    /* ---------------------------------------------------------
       RECOMMENDATION ENGINE
       --------------------------------------------------------- */

    const recommendations = useMemo(() => {
        return getFoodRecommendations(
            filteredFoods.map((food) => ({
                food,

                budgetInr: budget,

                vegetarian:
                    diet === "vegetarian",

                preferredSpice:
                    spice === "all"
                        ? undefined
                        : spice,

                preferredCuisine:
                    cuisine === "all"
                        ? undefined
                        : cuisine,

                currentMeal,

                minimumRating: 4,
            })),
        );
    }, [
        filteredFoods,
        budget,
        diet,
        spice,
        cuisine,
        currentMeal,
    ]);


    /* ---------------------------------------------------------
       RENDER
       --------------------------------------------------------- */

    return (
        <main className="min-h-screen bg-[#f7f3ea]">

            <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">

                {/* =================================================
                    HEADER
                   ================================================= */}

                <header className="flex h-20 items-center justify-between">

                    <button
                        type="button"
                        onClick={() =>
                            router.push("/food")
                        }
                        className="inline-flex h-10 items-center gap-2 rounded-full border border-[#123c35]/10 bg-white px-4 text-xs font-black text-[#123c35] transition hover:bg-[#fbfaf5]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Food
                    </button>


                    <div className="flex items-center gap-2 rounded-full border border-[#123c35]/10 bg-white px-3 py-2">

                        <Sparkles className="h-3.5 w-3.5 text-[#ef713d]" />

                        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#31544d]">
                            FairTrip Food
                        </span>

                    </div>

                </header>


                {/* =================================================
                    HERO
                   ================================================= */}

                <section className="pt-5 sm:pt-8">

                    <div className="max-w-3xl">

                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#ef713d]">
                            Smart food recommendations
                        </p>

                        <h1 className="mt-2 text-4xl font-black leading-[0.94] tracking-[-0.055em] text-[#123c35] sm:text-5xl lg:text-6xl">
                            Find something
                            <br />
                            <span className="text-[#ef713d]">
                                worth eating.
                            </span>
                        </h1>

                        <p className="mt-4 max-w-xl text-sm leading-6 text-[#6d7974] sm:text-[15px]">
                            FairTrip compares your food
                            choices with your budget,
                            dietary preferences, spice level,
                            cuisine and current eating time.
                        </p>

                    </div>


                    {/* =================================================
                        DETECTED FOOD
                       ================================================= */}

                    {detectedItems.length > 0 && (
                        <div className="mt-6 rounded-[24px] border border-[#123c35]/10 bg-white p-4 sm:p-5">

                            <div className="flex items-start gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8f58d] text-[#123c35]">
                                    <Utensils className="h-4 w-4" />
                                </div>

                                <div className="min-w-0">

                                    <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#ef713d]">
                                        Detected from your scan
                                    </p>

                                    <div className="mt-2 flex flex-wrap gap-2">

                                        {detectedItems.map(
                                            (item, index) => (
                                                <span
                                                    key={`${item}-${index}`}
                                                    className="rounded-full bg-[#f7f3ea] px-3 py-1.5 text-xs font-black text-[#123c35]"
                                                >
                                                    {item}
                                                </span>
                                            ),
                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>
                    )}


                    {/* =================================================
                        TIME
                       ================================================= */}

                    <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-[#6d7974]">

                        <Clock3 className="h-3.5 w-3.5" />

                        Recommendations for

                        <span className="font-black text-[#123c35]">
                            {currentMeal}
                        </span>

                    </div>

                </section>


                {/* =================================================
                    MAIN CONTENT
                   ================================================= */}

                <section className="mt-8 grid gap-6 lg:grid-cols-[270px_minmax(0,1fr)] lg:items-start">

                    {/* =================================================
                        FILTERS
                       ================================================= */}

                    <aside className="lg:sticky lg:top-5">

                        <FoodFilters
                            budget={budget}
                            diet={diet}
                            spice={spice}
                            cuisine={cuisine}
                            onBudgetChange={setBudget}
                            onDietChange={setDiet}
                            onSpiceChange={setSpice}
                            onCuisineChange={setCuisine}
                        />

                    </aside>


                    {/* =================================================
                        RESULTS
                       ================================================= */}

                    <div className="min-w-0">

                        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">

                            <div>

                                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#ef713d]">
                                    Ranked for you
                                </p>

                                <h2 className="mt-1 text-2xl font-black tracking-[-0.04em] text-[#123c35] sm:text-3xl">
                                    Best food choices
                                </h2>

                            </div>

                            <div className="rounded-full bg-[#e8f58d] px-3 py-1.5 text-[9px] font-black text-[#123c35]">
                                {recommendations.length}{" "}
                                options
                            </div>

                        </div>


                        <FoodRecommendationList
                            recommendations={
                                recommendations
                            }
                        />

                    </div>

                </section>

            </div>

        </main>
    );
}