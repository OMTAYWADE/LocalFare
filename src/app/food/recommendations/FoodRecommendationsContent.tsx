"use client";

import {
    useMemo,
    useState,
} from "react";

import {
    ArrowLeft,
    Clock3,
    Leaf,
    Search,
    ShieldCheck,
    Sparkles,
    Utensils,
} from "lucide-react";

import { useRouter } from "next/navigation";

import FoodFilters from "@/features/food/components/FoodFilters";
import FoodRecommendationList from "@/features/food/components/FoodRecommendationList";

import CurrencySelector from "@/features/currency/components/CurrencySelector";
import PriceDisplay from "@/features/currency/components/PriceDisplay";
import {
    useCurrency,
} from "@/features/currency/components/CurrencyProvider";

import {
    TEMP_FOOD_DATA,
} from "@/features/food/data/temp-food-data";

import type {
    FoodCuisine,
    FoodDiet,
    FoodItem,
    MealType,
    SpiceLevel,
} from "@/features/food/types/food.types";

interface FoodRecommendation {
    food: FoodItem;
    score: number;
    reasons: string[];
}

type FoodChoice =
    | "all"
    | "vegetarian"
    | "vegan"
    | "non-vegetarian"
    | "egg";

type Restriction =
    | "none"
    | "jain"
    | "no-onion"
    | "no-garlic"
    | "no-onion-garlic";

const FOOD_CHOICES: {
    value: FoodChoice;
    label: string;
    description: string;
}[] = [
        {
            value: "all",
            label: "Anything",
            description: "Show all suitable food",
        },
        {
            value: "vegetarian",
            label: "Vegetarian",
            description: "No meat or fish",
        },
        {
            value: "vegan",
            label: "Vegan",
            description: "Plant-based options",
        },
        {
            value: "non-vegetarian",
            label: "Non-veg",
            description: "Chicken, meat and more",
        },
        {
            value: "egg",
            label: "Egg",
            description: "Egg-based options",
        },
    ];

const RESTRICTIONS: {
    value: Restriction;
    label: string;
    description: string;
}[] = [
        {
            value: "none",
            label: "No restriction",
            description: "Normal food options",
        },
        {
            value: "jain",
            label: "Jain",
            description: "Verified Jain suitable",
        },
        {
            value: "no-onion",
            label: "No onion",
            description: "Avoid onion",
        },
        {
            value: "no-garlic",
            label: "No garlic",
            description: "Avoid garlic",
        },
        {
            value: "no-onion-garlic",
            label: "No onion & garlic",
            description: "Avoid both",
        },
    ];

const MEAL_OPTIONS: {
    value: MealType;
    label: string;
}[] = [
        {
            value: "breakfast",
            label: "Breakfast",
        },
        {
            value: "lunch",
            label: "Lunch",
        },
        {
            value: "snack",
            label: "Snack",
        },
        {
            value: "dinner",
            label: "Dinner",
        },
        {
            value: "late-night",
            label: "Late night",
        },
    ];

const SPICE_OPTIONS: {
    value: SpiceLevel | "all";
    label: string;
}[] = [
        {
            value: "all",
            label: "Any spice",
        },
        {
            value: "none",
            label: "No spice",
        },
        {
            value: "mild",
            label: "Mild",
        },
        {
            value: "medium",
            label: "Medium",
        },
        {
            value: "hot",
            label: "Hot",
        },
        {
            value: "very-hot",
            label: "Very hot",
        },
    ];

const CUISINE_OPTIONS: {
    value: FoodCuisine | "all";
    label: string;
}[] = [
        {
            value: "all",
            label: "All cuisines",
        },
        {
            value: "indian",
            label: "Indian",
        },
        {
            value: "maharashtrian",
            label: "Maharashtrian",
        },
        {
            value: "south-indian",
            label: "South Indian",
        },
        {
            value: "north-indian",
            label: "North Indian",
        },
        {
            value: "street-food",
            label: "Street food",
        },
        {
            value: "chinese",
            label: "Chinese",
        },
        {
            value: "continental",
            label: "Continental",
        },
        {
            value: "dessert",
            label: "Dessert",
        },
        {
            value: "beverage",
            label: "Beverage",
        },
    ];

export default function FoodRecommendationsContent() {
    const router = useRouter();

    const {
        currency,
        setCurrency,
    } = useCurrency();

    /* SEARCH */

    const [search, setSearch] =
        useState("");

    /* FOOD TYPE */

    const [foodChoice, setFoodChoice] =
        useState<FoodChoice>("all");

    /* DIETARY RESTRICTION */

    const [restriction, setRestriction] =
        useState<Restriction>("none");

    /* MEAL */

    const [mealType, setMealType] =
        useState<MealType>("lunch");

    /* OTHER FILTERS */

    /*
     * IMPORTANT:
     * Budget is ALWAYS stored internally in INR.
     *
     * Currency only changes what the user sees.
     */
    const [budget, setBudget] =
        useState(300);

    const [spice, setSpice] =
        useState<SpiceLevel | "all">(
            "all",
        );

    const [cuisine, setCuisine] =
        useState<FoodCuisine | "all">(
            "all",
        );

    /* RECOMMENDATIONS */

    const recommendations =
        useMemo<FoodRecommendation[]>(
            () => {
                const normalizedSearch =
                    search
                        .trim()
                        .toLowerCase();

                return TEMP_FOOD_DATA
                    .filter((food) => {
                        /* SEARCH */

                        if (
                            normalizedSearch &&
                            !food.name
                                .toLowerCase()
                                .includes(
                                    normalizedSearch,
                                ) &&
                            !food.description
                                ?.toLowerCase()
                                .includes(
                                    normalizedSearch,
                                )
                        ) {
                            return false;
                        }

                        /* FOOD TYPE */

                        if (
                            foodChoice !== "all" &&
                            foodChoice !==
                            food.diet
                        ) {
                            /*
                             * Vegan is vegetarian too.
                             */

                            if (
                                !(
                                    foodChoice ===
                                    "vegetarian" &&
                                    (
                                        food.diet ===
                                        "vegetarian" ||
                                        food.diet ===
                                        "vegan" ||
                                        food.isVegan ===
                                        true
                                    )
                                )
                            ) {
                                return false;
                            }
                        }

                        /* DIETARY RESTRICTIONS */

                        if (
                            restriction ===
                            "jain" &&
                            food.jainSuitable !==
                            true
                        ) {
                            return false;
                        }

                        if (
                            restriction ===
                            "no-onion" &&
                            food.containsOnion ===
                            true
                        ) {
                            return false;
                        }

                        if (
                            restriction ===
                            "no-garlic" &&
                            food.containsGarlic ===
                            true
                        ) {
                            return false;
                        }

                        if (
                            restriction ===
                            "no-onion-garlic" &&
                            (
                                food.containsOnion ===
                                true ||
                                food.containsGarlic ===
                                true
                            )
                        ) {
                            return false;
                        }

                        /* MEAL */

                        if (
                            !food.mealTypes.includes(
                                mealType,
                            )
                        ) {
                            return false;
                        }

                        /* BUDGET */

                        /*
                         * food.priceInr and budget are
                         * both INR values internally.
                         */
                        if (
                            food.priceInr >
                            budget
                        ) {
                            return false;
                        }

                        /* SPICE */

                        if (
                            spice !== "all" &&
                            food.spiceLevel !==
                            spice
                        ) {
                            return false;
                        }

                        /* CUISINE */

                        if (
                            cuisine !== "all" &&
                            !food.cuisine.includes(
                                cuisine,
                            )
                        ) {
                            return false;
                        }

                        return true;
                    })
                    .map((food) => {
                        let score = 50;

                        const reasons: string[] =
                            [];

                        /* MEAL MATCH */

                        if (
                            food.mealTypes.includes(
                                mealType,
                            )
                        ) {
                            score += 20;

                            reasons.push(
                                `Suitable for ${formatMeal(
                                    mealType,
                                )}.`,
                            );
                        }

                        /* BUDGET */

                        if (
                            food.priceInr <=
                            budget
                        ) {
                            score += 10;

                            reasons.push(
                                "Fits your selected budget.",
                            );
                        }

                        /* RATING */

                        if (
                            typeof food.rating ===
                            "number" &&
                            food.rating >= 4.5
                        ) {
                            score += 10;

                            reasons.push(
                                "Highly rated by travellers.",
                            );
                        }

                        /* RESTRICTIONS */

                        if (
                            restriction ===
                            "jain"
                        ) {
                            reasons.push(
                                "Marked as verified Jain suitable.",
                            );
                        }

                        if (
                            restriction ===
                            "no-onion"
                        ) {
                            reasons.push(
                                "Contains no onion according to the food data.",
                            );
                        }

                        if (
                            restriction ===
                            "no-garlic"
                        ) {
                            reasons.push(
                                "Contains no garlic according to the food data.",
                            );
                        }

                        if (
                            restriction ===
                            "no-onion-garlic"
                        ) {
                            reasons.push(
                                "Contains neither onion nor garlic according to the food data.",
                            );
                        }

                        /* VEGAN */

                        if (
                            food.isVegan ===
                            true
                        ) {
                            reasons.push(
                                "Plant-based option.",
                            );
                        }

                        return {
                            food,
                            score: Math.min(
                                score,
                                100,
                            ),
                            reasons,
                        };
                    })
                    .sort(
                        (a, b) =>
                            b.score -
                            a.score,
                    );
            },
            [
                search,
                foodChoice,
                restriction,
                mealType,
                budget,
                spice,
                cuisine,
            ],
        );

    /* RESET */

    function resetFilters() {
        setSearch("");
        setFoodChoice("all");
        setRestriction("none");
        setMealType("lunch");
        setBudget(300);
        setSpice("all");
        setCuisine("all");
    }

    return (
        <main className="min-h-screen bg-[#f7f3ea]">
            <div className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">

                {/* TOP BAR */}

                <header className="flex min-h-20 items-center justify-between gap-4">
                    <button
                        type="button"
                        onClick={() =>
                            router.back()
                        }
                        className="flex h-10 items-center gap-2 rounded-full border border-[#123c35]/10 bg-white px-4 text-xs font-black text-[#123c35] transition hover:-translate-x-0.5 hover:bg-[#e8f58d]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </button>

                    {/* CURRENCY */}

                    <div className="flex items-center gap-2">
                        <span className="hidden text-[9px] font-black uppercase tracking-[0.12em] text-[#6d7974] sm:block">
                            Currency
                        </span>

                        <CurrencySelector
                            value={currency}
                            onChange={
                                setCurrency
                            }
                            compact
                        />
                    </div>
                </header>

                {/* HERO */}

                <section className="relative mt-4 overflow-hidden rounded-[30px] bg-gradient-to-br from-[#dff3cf] via-[#e8f58d] to-[#f7c7a7] px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
                    <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/30 blur-2xl" />

                    <div className="pointer-events-none absolute bottom-[-100px] right-[10%] h-64 w-64 rounded-full bg-[#ef713d]/20 blur-3xl" />

                    <div className="relative max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#123c35] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-[#e8f58d]">
                            <Sparkles className="h-3 w-3" />
                            Fair food finder
                        </div>

                        <h1 className="mt-5 text-[2.4rem] font-black leading-[0.95] tracking-[-0.06em] text-[#123c35] sm:text-5xl lg:text-6xl">
                            Find food that
                            <br />
                            actually fits{" "}
                            <span className="text-[#ef713d]">
                                you.
                            </span>
                        </h1>

                        <p className="mt-5 max-w-2xl text-sm leading-6 text-[#49625c] sm:text-base">
                            Tell FairTrip what you
                            eat, your dietary
                            restrictions, when you
                            are eating and your
                            budget. We then rank
                            suitable local food
                            options.
                        </p>

                        <div className="mt-5 flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-2 text-[9px] font-black text-[#123c35]">
                                <ShieldCheck className="h-3.5 w-3.5 text-[#ef713d]" />
                                Dietary aware
                            </span>

                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-2 text-[9px] font-black text-[#123c35]">
                                <Leaf className="h-3.5 w-3.5 text-[#5c9b72]" />
                                Jain options
                            </span>

                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-2 text-[9px] font-black text-[#123c35]">
                                <Utensils className="h-3.5 w-3.5 text-[#ef713d]" />
                                Local food
                            </span>
                        </div>
                    </div>
                </section>

                {/* SEARCH */}

                <section className="mt-6">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71817b]" />

                        <input
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target
                                        .value,
                                )
                            }
                            placeholder="Search for poha, biryani, dosa..."
                            className="h-12 w-full rounded-2xl border border-[#123c35]/10 bg-white pl-11 pr-4 text-sm font-semibold text-[#123c35] outline-none placeholder:text-[#9aa49f] focus:border-[#123c35]/30"
                        />
                    </div>
                </section>

                {/* STEP 1 */}

                <section className="mt-8">
                    <div className="mb-4">
                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#ef713d]">
                            Step 1
                        </p>

                        <h2 className="mt-1 text-2xl font-black tracking-[-0.05em] text-[#123c35]">
                            What do you want to eat?
                        </h2>

                        <p className="mt-1 text-xs text-[#6d7974]">
                            Start with your main food
                            preference.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                        {FOOD_CHOICES.map(
                            (option) => {
                                const active =
                                    foodChoice ===
                                    option.value;

                                return (
                                    <button
                                        key={
                                            option.value
                                        }
                                        type="button"
                                        onClick={() =>
                                            setFoodChoice(
                                                option.value,
                                            )
                                        }
                                        className={[
                                            "min-h-[110px] rounded-[22px] border p-4 text-left transition duration-200",
                                            active
                                                ? "border-[#123c35] bg-[#123c35] text-white shadow-[0_14px_35px_rgba(18,60,53,0.15)]"
                                                : "border-[#123c35]/10 bg-white text-[#123c35] hover:-translate-y-0.5 hover:border-[#123c35]/20",
                                        ].join(
                                            " ",
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <Utensils
                                                className={[
                                                    "h-5 w-5",
                                                    active
                                                        ? "text-[#e8f58d]"
                                                        : "text-[#ef713d]",
                                                ].join(
                                                    " ",
                                                )}
                                            />

                                            {active && (
                                                <span className="h-2 w-2 rounded-full bg-[#e8f58d]" />
                                            )}
                                        </div>

                                        <p className="mt-5 text-sm font-black">
                                            {
                                                option.label
                                            }
                                        </p>

                                        <p
                                            className={[
                                                "mt-1 text-[10px] leading-4",
                                                active
                                                    ? "text-white/60"
                                                    : "text-[#7a8580]",
                                            ].join(
                                                " ",
                                            )}
                                        >
                                            {
                                                option.description
                                            }
                                        </p>
                                    </button>
                                );
                            },
                        )}
                    </div>
                </section>

                {/* STEP 2 */}

                <section className="mt-8">
                    <div className="mb-4">
                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#ef713d]">
                            Step 2
                        </p>

                        <h2 className="mt-1 text-2xl font-black tracking-[-0.05em] text-[#123c35]">
                            Any dietary restrictions?
                        </h2>

                        <p className="mt-1 text-xs text-[#6d7974]">
                            Especially useful for Jain
                            and ingredient-specific
                            preferences.
                        </p>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {RESTRICTIONS.map(
                            (option) => {
                                const active =
                                    restriction ===
                                    option.value;

                                return (
                                    <button
                                        key={
                                            option.value
                                        }
                                        type="button"
                                        onClick={() =>
                                            setRestriction(
                                                option.value,
                                            )
                                        }
                                        className={[
                                            "min-w-[155px] shrink-0 rounded-[20px] border px-4 py-4 text-left transition",
                                            active
                                                ? "border-[#ef713d] bg-[#fff0e8]"
                                                : "border-[#123c35]/10 bg-white hover:bg-[#fbfaf5]",
                                        ].join(
                                            " ",
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck
                                                className={[
                                                    "h-4 w-4",
                                                    active
                                                        ? "text-[#ef713d]"
                                                        : "text-[#6d7974]",
                                                ].join(
                                                    " ",
                                                )}
                                            />

                                            <span className="text-xs font-black text-[#123c35]">
                                                {
                                                    option.label
                                                }
                                            </span>
                                        </div>

                                        <p className="mt-2 text-[9px] leading-4 text-[#7a8580]">
                                            {
                                                option.description
                                            }
                                        </p>
                                    </button>
                                );
                            },
                        )}
                    </div>
                </section>

                {/* STEP 3 */}

                <section className="mt-8">
                    <div className="mb-4">
                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#ef713d]">
                            Step 3
                        </p>

                        <h2 className="mt-1 text-2xl font-black tracking-[-0.05em] text-[#123c35]">
                            When are you eating?
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                        {MEAL_OPTIONS.map(
                            (option) => {
                                const active =
                                    mealType ===
                                    option.value;

                                return (
                                    <button
                                        key={
                                            option.value
                                        }
                                        type="button"
                                        onClick={() =>
                                            setMealType(
                                                option.value,
                                            )
                                        }
                                        className={[
                                            "flex min-h-12 items-center justify-center gap-2 rounded-full border px-4 text-xs font-black transition",
                                            active
                                                ? "border-[#123c35] bg-[#123c35] text-white"
                                                : "border-[#123c35]/10 bg-white text-[#31544d] hover:bg-[#e8f58d]",
                                        ].join(
                                            " ",
                                        )}
                                    >
                                        <Clock3 className="h-3.5 w-3.5" />

                                        {
                                            option.label
                                        }
                                    </button>
                                );
                            },
                        )}
                    </div>
                </section>

                {/* RESULTS */}

                <section className="mt-10 grid gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
                    {/* FILTERS */}

                    <div className="lg:sticky lg:top-5 lg:self-start">
                        <FoodFilters
                            budget={budget}

                            diet={
                                foodChoice === "all"
                                    ? "all"
                                    : foodChoice
                            }

                            spice={spice}

                            cuisine={cuisine}

                            mealTime={mealType}

                            foodRestriction={restriction}

                            onBudgetChange={setBudget}

                            onDietChange={(value) => {
                                setFoodChoice(
                                    value === "all"
                                        ? "all"
                                        : value,
                                );
                            }}

                            onSpiceChange={setSpice}

                            onCuisineChange={setCuisine}

                            onMealTimeChange={setMealType}

                            onFoodRestrictionChange={
                                setRestriction
                            }
                        />

                        <button
                            type="button"
                            onClick={
                                resetFilters
                            }
                            className="mt-3 w-full rounded-full border border-[#123c35]/10 bg-white px-4 py-3 text-xs font-black text-[#31544d] transition hover:bg-[#e8f58d]"
                        >
                            Reset all preferences
                        </button>
                    </div>

                    {/* RESULTS */}

                    <div className="min-w-0">
                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#ef713d]">
                                    Your matches
                                </p>

                                <h2 className="mt-1 text-2xl font-black tracking-[-0.05em] text-[#123c35]">
                                    Food worth trying
                                </h2>

                                <p className="mt-1 text-xs text-[#6d7974]">
                                    {
                                        recommendations.length
                                    }{" "}
                                    option
                                    {recommendations.length ===
                                        1
                                        ? ""
                                        : "s"}{" "}
                                    match your
                                    preferences.
                                </p>
                            </div>

                            {/* BUDGET + CONVERTED CURRENCY */}

                            <div className="rounded-2xl border border-[#123c35]/10 bg-white px-4 py-3">
                                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#6d7974]">
                                    Budget
                                </p>

                                <PriceDisplay
                                    inr={budget}
                                    currency={
                                        currency
                                    }
                                    className="mt-1"
                                />
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

function formatMeal(
    meal: MealType,
): string {
    return meal
        .replaceAll("-", " ")
        .replace(
            /\b\w/g,
            (letter) =>
                letter.toUpperCase(),
        );
}