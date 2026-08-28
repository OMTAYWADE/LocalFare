"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
    ArrowLeft,
    Clock3,
    Leaf,
    Sparkles,
    Utensils,
    Wheat,
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
   TYPES
   ============================================================ */

type FoodType =
    | "all"
    | "vegetarian"
    | "non-vegetarian"
    | "egg"
    | "vegan";

type DietaryRestriction =
    | "none"
    | "jain"
    | "no-onion"
    | "no-garlic"
    | "no-onion-garlic";

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

export default function FoodRecommendationsContent() {
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
       BASIC PREFERENCES
       --------------------------------------------------------- */

    const [budget, setBudget] =
        useState(300);

    const [diet, setDiet] =
        useState<FoodDiet | "all">("all");

    const [spice, setSpice] =
        useState<SpiceLevel | "all">("all");

    const [cuisine, setCuisine] =
        useState<FoodCuisine | "all">("all");

    /* ---------------------------------------------------------
       FOOD TYPE
       --------------------------------------------------------- */

    const [foodType, setFoodType] =
        useState<FoodType>("all");

    /* ---------------------------------------------------------
       DIETARY RESTRICTIONS
       --------------------------------------------------------- */

    const [
        dietaryRestriction,
        setDietaryRestriction,
    ] = useState<DietaryRestriction>("none");

    /* ---------------------------------------------------------
       MEAL TIME
       --------------------------------------------------------- */

    const currentMeal = useMemo(
        () => getCurrentMeal(),
        [],
    );

    const [mealTime, setMealTime] =
        useState<MealType | "all">(
            currentMeal,
        );

    /* =========================================================
       FIND FOODS
       ========================================================= */

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
         * If scanner detected something
         * outside our dataset, don't show
         * an empty page.
         */

        if (uniqueFoods.length === 0) {
            return foodItems;
        }

        return uniqueFoods;
    }, [detectedItems]);

    /* =========================================================
       FILTER
       ========================================================= */

    const filteredFoods = useMemo(() => {
        return matchingFoods.filter((food) => {
            /* -------------------------------------------------
               BUDGET
            ------------------------------------------------- */

            if (food.priceInr > budget) {
                return false;
            }

            /* -------------------------------------------------
               EXISTING DIET
            ------------------------------------------------- */

            if (
                diet !== "all" &&
                food.diet !== diet
            ) {
                return false;
            }

            /* -------------------------------------------------
               FOOD TYPE
            ------------------------------------------------- */

            /*
             * We use the existing food.diet field
             * wherever possible.
             *
             * This keeps this page compatible with
             * the current FoodItem structure.
             */

            if (foodType === "vegetarian") {
                if (
                    food.diet !== "vegetarian"
                ) {
                    return false;
                }
            }

            if (foodType === "vegan") {
                /*
                 * Vegan food must already be
                 * represented as vegetarian in
                 * the current dataset.
                 *
                 * Until FoodItem gets a dedicated
                 * vegan field, this remains a
                 * conservative filter.
                 */
                if (
                    food.diet !== "vegetarian"
                ) {
                    return false;
                }
            }

            if (
                foodType === "non-vegetarian"
            ) {
                if (
                    food.diet === "vegetarian"
                ) {
                    return false;
                }
            }

            /*
             * Egg is intentionally not guessed
             * from the current data model.
             *
             * Add an `containsEgg` field to
             * FoodItem before enabling exact
             * egg filtering.
             */

            /* -------------------------------------------------
               SPICE
            ------------------------------------------------- */

            if (
                spice !== "all" &&
                food.spiceLevel !== spice
            ) {
                return false;
            }

            /* -------------------------------------------------
               CUISINE
            ------------------------------------------------- */

            if (
                cuisine !== "all" &&
                !food.cuisine.includes(cuisine)
            ) {
                return false;
            }

            /*
             * Dietary restrictions such as Jain,
             * no onion and no garlic require
             * explicit ingredient metadata.
             *
             * We do NOT guess these values from
             * food names.
             */

            if (
                dietaryRestriction !== "none"
            ) {
                const foodWithRestrictions =
                    food as FoodItem & {
                        jain?: boolean;
                        containsOnion?: boolean;
                        containsGarlic?: boolean;
                    };

                if (
                    dietaryRestriction ===
                    "jain" &&
                    foodWithRestrictions.jain !== true
                ) {
                    return false;
                }

                if (
                    dietaryRestriction ===
                    "no-onion" &&
                    foodWithRestrictions.containsOnion ===
                        true
                ) {
                    return false;
                }

                if (
                    dietaryRestriction ===
                    "no-garlic" &&
                    foodWithRestrictions.containsGarlic ===
                        true
                ) {
                    return false;
                }

                if (
                    dietaryRestriction ===
                    "no-onion-garlic"
                ) {
                    if (
                        foodWithRestrictions.containsOnion ===
                            true ||
                        foodWithRestrictions.containsGarlic ===
                            true
                    ) {
                        return false;
                    }
                }
            }

            return true;
        });
    }, [
        matchingFoods,
        budget,
        diet,
        spice,
        cuisine,
        foodType,
        dietaryRestriction,
    ]);

    /* =========================================================
       RECOMMENDATION ENGINE
       ========================================================= */

    const recommendations = useMemo(() => {
        return getFoodRecommendations(
            filteredFoods.map((food) => ({
                food,

                budgetInr:
                    budget,

                vegetarian:
                    foodType ===
                    "vegetarian",

                preferredSpice:
                    spice === "all"
                        ? undefined
                        : spice,

                preferredCuisine:
                    cuisine === "all"
                        ? undefined
                        : cuisine,

                /*
                 * Only pass meal time when
                 * the user actually selected one.
                 */

                currentMeal:
                    mealTime === "all"
                        ? undefined
                        : mealTime,

                minimumRating: 4,
            })),
        );
    }, [
        filteredFoods,
        budget,
        foodType,
        spice,
        cuisine,
        mealTime,
    ]);

    /* =========================================================
       RENDER
       ========================================================= */

    return (
        <main
            className="
                min-h-screen
                bg-[#f7f3ea]
            "
        >
            <div
                className="
                    mx-auto
                    w-full
                    max-w-6xl
                    px-4
                    pb-20
                    sm:px-6
                    lg:px-8
                "
            >
                {/* =================================================
                    HEADER
                ================================================= */}

                <header
                    className="
                        flex
                        min-h-20
                        items-center
                        justify-between
                        gap-3
                    "
                >
                    <button
                        type="button"
                        onClick={() =>
                            router.push("/food")
                        }
                        className="
                            inline-flex
                            h-10
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-[#123c35]/10
                            bg-white
                            px-4
                            text-xs
                            font-black
                            text-[#123c35]
                            transition
                            hover:bg-[#fbfaf5]
                        "
                    >
                        <ArrowLeft className="h-4 w-4" />

                        Food
                    </button>

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-[#123c35]/10
                            bg-white
                            px-3
                            py-2
                        "
                    >
                        <Sparkles
                            className="
                                h-3.5
                                w-3.5
                                text-[#ef713d]
                            "
                        />

                        <span
                            className="
                                text-[9px]
                                font-black
                                uppercase
                                tracking-[0.15em]
                                text-[#31544d]
                            "
                        >
                            FairTrip Food
                        </span>
                    </div>
                </header>

                {/* =================================================
                    HERO
                ================================================= */}

                <section className="pt-5 sm:pt-8">
                    <div className="max-w-3xl">
                        <p
                            className="
                                text-[10px]
                                font-black
                                uppercase
                                tracking-[0.18em]
                                text-[#ef713d]
                            "
                        >
                            Personalize your food
                        </p>

                        <h1
                            className="
                                mt-2
                                text-4xl
                                font-black
                                leading-[0.94]
                                tracking-[-0.055em]
                                text-[#123c35]
                                sm:text-5xl
                                lg:text-6xl
                            "
                        >
                            What do you
                            <br />

                            <span className="text-[#ef713d]">
                                want to eat?
                            </span>
                        </h1>

                        <p
                            className="
                                mt-4
                                max-w-xl
                                text-sm
                                leading-6
                                text-[#6d7974]
                                sm:text-[15px]
                            "
                        >
                            Tell FairTrip what works
                            for you first. We'll then
                            rank food using your budget,
                            dietary needs, taste and
                            preferred eating time.
                        </p>
                    </div>

                    {/* =================================================
                        DETECTED FOOD
                    ================================================= */}

                    {detectedItems.length > 0 && (
                        <div
                            className="
                                mt-6
                                rounded-[24px]
                                border
                                border-[#123c35]/10
                                bg-white
                                p-4
                                sm:p-5
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-start
                                    gap-3
                                "
                            >
                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-[#e8f58d]
                                        text-[#123c35]
                                    "
                                >
                                    <Utensils className="h-4 w-4" />
                                </div>

                                <div className="min-w-0">
                                    <p
                                        className="
                                            text-[9px]
                                            font-black
                                            uppercase
                                            tracking-[0.15em]
                                            text-[#ef713d]
                                        "
                                    >
                                        Detected from
                                        your scan
                                    </p>

                                    <div
                                        className="
                                            mt-2
                                            flex
                                            flex-wrap
                                            gap-2
                                        "
                                    >
                                        {detectedItems.map(
                                            (
                                                item,
                                                index,
                                            ) => (
                                                <span
                                                    key={`${item}-${index}`}
                                                    className="
                                                        rounded-full
                                                        bg-[#f7f3ea]
                                                        px-3
                                                        py-1.5
                                                        text-xs
                                                        font-black
                                                        text-[#123c35]
                                                    "
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
                        MEAL TIME
                    ================================================= */}

                    <div
                        className="
                            mt-5
                            rounded-[22px]
                            border
                            border-[#123c35]/10
                            bg-white
                            p-4
                        "
                    >
                        <div
                            className="
                                flex
                                flex-col
                                gap-3
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >
                                <span
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-[#f9dfd0]
                                        text-[#ef713d]
                                    "
                                >
                                    <Clock3 className="h-4 w-4" />
                                </span>

                                <div>
                                    <p
                                        className="
                                            text-[9px]
                                            font-black
                                            uppercase
                                            tracking-[0.14em]
                                            text-[#6d7974]
                                        "
                                    >
                                        Meal time
                                    </p>

                                    <p
                                        className="
                                            text-sm
                                            font-black
                                            text-[#123c35]
                                        "
                                    >
                                        When are you eating?
                                    </p>
                                </div>
                            </div>

                            <select
                                value={mealTime}
                                onChange={(event) =>
                                    setMealTime(
                                        event.target
                                            .value as
                                            | MealType
                                            | "all",
                                    )
                                }
                                className="
                                    h-10
                                    rounded-full
                                    border
                                    border-[#123c35]/10
                                    bg-[#fbfaf5]
                                    px-4
                                    text-xs
                                    font-black
                                    text-[#123c35]
                                    outline-none
                                    focus:border-[#123c35]/30
                                "
                            >
                                <option value="all">
                                    Any time
                                </option>

                                <option value="breakfast">
                                    Breakfast
                                </option>

                                <option value="lunch">
                                    Lunch
                                </option>

                                <option value="snack">
                                    Snack
                                </option>

                                <option value="dinner">
                                    Dinner
                                </option>

                                <option value="late-night">
                                    Late night
                                </option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* =================================================
                    MAIN CONTENT
                ================================================= */}

                <section
                    className="
                        mt-8
                        grid
                        gap-6
                        lg:grid-cols-[270px_minmax(0,1fr)]
                        lg:items-start
                    "
                >
                    {/* =================================================
                        FILTERS
                    ================================================= */}

                    <aside
                        className="
                            lg:sticky
                            lg:top-5
                        "
                    >
                        <div className="space-y-4">
                            {/* =================================================
                                FOOD TYPE
                            ================================================= */}

                            <PreferenceCard
                                icon={
                                    <Leaf className="h-4 w-4" />
                                }
                                title="What kind?"
                            >
                                <div className="grid grid-cols-2 gap-2">
                                    <PreferenceButton
                                        active={
                                            foodType ===
                                            "all"
                                        }
                                        onClick={() =>
                                            setFoodType(
                                                "all",
                                            )
                                        }
                                    >
                                        Everything
                                    </PreferenceButton>

                                    <PreferenceButton
                                        active={
                                            foodType ===
                                            "vegetarian"
                                        }
                                        onClick={() =>
                                            setFoodType(
                                                "vegetarian",
                                            )
                                        }
                                    >
                                        Vegetarian
                                    </PreferenceButton>

                                    <PreferenceButton
                                        active={
                                            foodType ===
                                            "non-vegetarian"
                                        }
                                        onClick={() =>
                                            setFoodType(
                                                "non-vegetarian",
                                            )
                                        }
                                    >
                                        Non-veg
                                    </PreferenceButton>

                                    <PreferenceButton
                                        active={
                                            foodType ===
                                            "vegan"
                                        }
                                        onClick={() =>
                                            setFoodType(
                                                "vegan",
                                            )
                                        }
                                    >
                                        Vegan
                                    </PreferenceButton>

                                    <PreferenceButton
                                        active={
                                            foodType ===
                                            "egg"
                                        }
                                        onClick={() =>
                                            setFoodType(
                                                "egg",
                                            )
                                        }
                                    >
                                        Egg
                                    </PreferenceButton>
                                </div>
                            </PreferenceCard>

                            {/* =================================================
                                DIETARY RESTRICTIONS
                            ================================================= */}

                            <PreferenceCard
                                icon={
                                    <Wheat className="h-4 w-4" />
                                }
                                title="Dietary restrictions"
                            >
                                <div className="space-y-2">
                                    <PreferenceButton
                                        active={
                                            dietaryRestriction ===
                                            "none"
                                        }
                                        onClick={() =>
                                            setDietaryRestriction(
                                                "none",
                                            )
                                        }
                                    >
                                        No restriction
                                    </PreferenceButton>

                                    <PreferenceButton
                                        active={
                                            dietaryRestriction ===
                                            "jain"
                                        }
                                        onClick={() =>
                                            setDietaryRestriction(
                                                "jain",
                                            )
                                        }
                                    >
                                        Jain
                                    </PreferenceButton>

                                    <PreferenceButton
                                        active={
                                            dietaryRestriction ===
                                            "no-onion"
                                        }
                                        onClick={() =>
                                            setDietaryRestriction(
                                                "no-onion",
                                            )
                                        }
                                    >
                                        No onion
                                    </PreferenceButton>

                                    <PreferenceButton
                                        active={
                                            dietaryRestriction ===
                                            "no-garlic"
                                        }
                                        onClick={() =>
                                            setDietaryRestriction(
                                                "no-garlic",
                                            )
                                        }
                                    >
                                        No garlic
                                    </PreferenceButton>

                                    <PreferenceButton
                                        active={
                                            dietaryRestriction ===
                                            "no-onion-garlic"
                                        }
                                        onClick={() =>
                                            setDietaryRestriction(
                                                "no-onion-garlic",
                                            )
                                        }
                                    >
                                        No onion & garlic
                                    </PreferenceButton>
                                </div>
                            </PreferenceCard>

                            {/* =================================================
                                EXISTING FILTERS
                            ================================================= */}

                            <FoodFilters
                                budget={budget}
                                diet={diet}
                                spice={spice}
                                cuisine={cuisine}
                                onBudgetChange={setBudget}
                                onDietChange={setDiet}
                                onSpiceChange={setSpice}
                                onCuisineChange={
                                    setCuisine
                                }
                            />
                        </div>
                    </aside>

                    {/* =================================================
                        RESULTS
                    ================================================= */}

                    <div className="min-w-0">
                        <div
                            className="
                                mb-5
                                flex
                                flex-wrap
                                items-end
                                justify-between
                                gap-3
                            "
                        >
                            <div>
                                <p
                                    className="
                                        text-[9px]
                                        font-black
                                        uppercase
                                        tracking-[0.16em]
                                        text-[#ef713d]
                                    "
                                >
                                    Ranked for you
                                </p>

                                <h2
                                    className="
                                        mt-1
                                        text-2xl
                                        font-black
                                        tracking-[-0.04em]
                                        text-[#123c35]
                                        sm:text-3xl
                                    "
                                >
                                    Best food choices
                                </h2>

                                <p
                                    className="
                                        mt-1.5
                                        text-xs
                                        text-[#6d7974]
                                    "
                                >
                                    {mealTime === "all"
                                        ? "Any meal time"
                                        : `Optimized for ${mealTime}`}
                                </p>
                            </div>

                            <div
                                className="
                                    rounded-full
                                    bg-[#e8f58d]
                                    px-3
                                    py-1.5
                                    text-[9px]
                                    font-black
                                    text-[#123c35]
                                "
                            >
                                {recommendations.length}{" "}
                                options
                            </div>
                        </div>

                        {recommendations.length === 0 ? (
                            <div
                                className="
                                    rounded-[28px]
                                    border
                                    border-[#123c35]/10
                                    bg-white
                                    p-8
                                    text-center
                                "
                            >
                                <div
                                    className="
                                        mx-auto
                                        flex
                                        h-12
                                        w-12
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-[#f9dfd0]
                                        text-[#ef713d]
                                    "
                                >
                                    <Utensils className="h-5 w-5" />
                                </div>

                                <h3
                                    className="
                                        mt-4
                                        text-lg
                                        font-black
                                        text-[#123c35]
                                    "
                                >
                                    No matching food found
                                </h3>

                                <p
                                    className="
                                        mx-auto
                                        mt-2
                                        max-w-md
                                        text-sm
                                        leading-6
                                        text-[#6d7974]
                                    "
                                >
                                    Try increasing your
                                    budget or relaxing one
                                    of your food preferences.
                                </p>
                            </div>
                        ) : (
                            <FoodRecommendationList
                                recommendations={
                                    recommendations
                                }
                            />
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}

/* ============================================================
   PREFERENCE CARD
   ============================================================ */

function PreferenceCard({
    icon,
    title,
    children,
}: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div
            className="
                rounded-[24px]
                border
                border-[#123c35]/10
                bg-white
                p-4
                shadow-[0_8px_30px_rgba(18,60,53,0.04)]
            "
        >
            <div
                className="
                    mb-3
                    flex
                    items-center
                    gap-2
                "
            >
                <span
                    className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        bg-[#e8f58d]
                        text-[#123c35]
                    "
                >
                    {icon}
                </span>

                <p
                    className="
                        text-xs
                        font-black
                        text-[#123c35]
                    "
                >
                    {title}
                </p>
            </div>

            {children}
        </div>
    );
}

/* ============================================================
   PREFERENCE BUTTON
   ============================================================ */

function PreferenceButton({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "min-h-10 rounded-xl px-3 py-2",
                "text-[11px] font-black text-left",
                "transition-all duration-200",
                "focus:outline-none",
                "focus:ring-2 focus:ring-[#123c35]/20",
                active
                    ? "bg-[#123c35] text-white shadow-sm"
                    : "bg-[#fbfaf5] text-[#31544d] hover:bg-[#e8f58d]",
            ].join(" ")}
        >
            {children}
        </button>
    );
}