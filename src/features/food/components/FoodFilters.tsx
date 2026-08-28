"use client";

import {
    Check,
    ChevronDown,
    Clock3,
    Leaf,
    RotateCcw,
    SlidersHorizontal,
    Utensils,
} from "lucide-react";

import type {
    FoodCuisine,
    FoodDiet,
    SpiceLevel,
} from "../types/food.types";

import { useCurrency } from "@/features/currency/components/CurrencyProvider";
import PriceDisplay from "@/features/currency/components/PriceDisplay";

interface FoodFiltersProps {
    budget: number;

    diet: FoodDiet | "all";

    spice: SpiceLevel | "all";

    cuisine: FoodCuisine | "all";

    mealTime: MealTime;

    foodRestriction: FoodRestriction;

    onBudgetChange: (
        value: number,
    ) => void;

    onDietChange: (
        value: FoodDiet | "all",
    ) => void;

    onSpiceChange: (
        value: SpiceLevel | "all",
    ) => void;

    onCuisineChange: (
        value: FoodCuisine | "all",
    ) => void;

    onMealTimeChange: (
        value: MealTime,
    ) => void;

    onFoodRestrictionChange: (
        value: FoodRestriction,
    ) => void;
}

/* ============================================================
   TYPES
============================================================ */

export type MealTime =
    | "all"
    | "breakfast"
    | "lunch"
    | "evening"
    | "dinner"
    | "late-night";

export type FoodRestriction =
    | "all"
    | "jain"
    | "no-onion"
    | "no-garlic"
    | "no-onion-garlic";

/* ============================================================
   MEAL TIME
============================================================ */

const MEAL_TIME_OPTIONS: {
    value: MealTime;
    label: string;
    description: string;
}[] = [
    {
        value: "all",
        label: "Any time",
        description: "Show food for any time",
    },
    {
        value: "breakfast",
        label: "Breakfast",
        description: "Morning meals",
    },
    {
        value: "lunch",
        label: "Lunch",
        description: "Midday meals",
    },
    {
        value: "evening",
        label: "Evening",
        description: "Snacks & light meals",
    },
    {
        value: "dinner",
        label: "Dinner",
        description: "Evening meals",
    },
    {
        value: "late-night",
        label: "Late night",
        description: "Food available at night",
    },
];

/* ============================================================
   DIET
============================================================ */

const DIET_OPTIONS: {
    value: FoodDiet | "all";
    label: string;
}[] = [
    {
        value: "all",
        label: "Everything",
    },
    {
        value: "vegetarian",
        label: "Vegetarian",
    },
    {
        value: "vegan",
        label: "Vegan",
    },
    {
        value: "egg",
        label: "Egg",
    },
    {
        value: "non-vegetarian",
        label: "Non-vegetarian",
    },
];

/* ============================================================
   FOOD RESTRICTIONS
============================================================ */

const RESTRICTION_OPTIONS: {
    value: FoodRestriction;
    label: string;
    description: string;
}[] = [
    {
        value: "all",
        label: "No restriction",
        description: "Show all suitable food",
    },
    {
        value: "jain",
        label: "Jain",
        description: "No onion, garlic & root vegetables",
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

/* ============================================================
   SPICE
============================================================ */

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

/* ============================================================
   CUISINE
============================================================ */

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

/* ============================================================
   COMPONENT
============================================================ */

export default function FoodFilters({
    budget,
    diet,
    spice,
    cuisine,
    mealTime,
    foodRestriction,
    onBudgetChange,
    onDietChange,
    onSpiceChange,
    onCuisineChange,
    onMealTimeChange,
    onFoodRestrictionChange,
}: FoodFiltersProps) {
    const { currency } = useCurrency();

    return (
        <aside
            className="
                rounded-[26px]
                border
                border-[#123c35]/10
                bg-white
                p-4
                shadow-[0_10px_35px_rgba(18,60,53,0.05)]
                sm:p-5
            "
        >
            {/* ====================================================
                HEADER
            ===================================================== */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-3
                "
            >
                <div className="flex items-center gap-3">
                    <span
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-[14px]
                            bg-[#e8f58d]
                            text-[#123c35]
                        "
                    >
                        <SlidersHorizontal
                            className="h-4 w-4"
                        />
                    </span>

                    <div>
                        <p
                            className="
                                text-sm
                                font-black
                                tracking-[-0.02em]
                                text-[#123c35]
                            "
                        >
                            Food preferences
                        </p>

                        <p
                            className="
                                mt-0.5
                                text-[10px]
                                leading-4
                                text-[#6d7974]
                            "
                        >
                            Tell us what you want to eat
                        </p>
                    </div>
                </div>
            </div>

            {/* ====================================================
                QUICK PREFERENCES
            ===================================================== */}

            <div className="mt-6">
                <div className="mb-3 flex items-center gap-2">
                    <Utensils
                        className="
                            h-3.5
                            w-3.5
                            text-[#ef713d]
                        "
                    />

                    <p
                        className="
                            text-[10px]
                            font-black
                            uppercase
                            tracking-[0.14em]
                            text-[#31544d]
                        "
                    >
                        What are you looking for?
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <QuickOption
                        active={diet === "vegetarian"}
                        onClick={() =>
                            onDietChange(
                                diet === "vegetarian"
                                    ? "all"
                                    : "vegetarian",
                            )
                        }
                        icon="🌿"
                        label="Vegetarian"
                    />

                    <QuickOption
                        active={diet === "non-vegetarian"}
                        onClick={() =>
                            onDietChange(
                                diet === "non-vegetarian"
                                    ? "all"
                                    : "non-vegetarian",
                            )
                        }
                        icon="🍗"
                        label="Non-veg"
                    />

                    <QuickOption
                        active={
                            foodRestriction ===
                            "jain"
                        }
                        onClick={() =>
                            onFoodRestrictionChange(
                                foodRestriction ===
                                    "jain"
                                    ? "all"
                                    : "jain",
                            )
                        }
                        icon="🙏"
                        label="Jain"
                    />

                    <QuickOption
                        active={
                            foodRestriction ===
                            "no-onion-garlic"
                        }
                        onClick={() =>
                            onFoodRestrictionChange(
                                foodRestriction ===
                                    "no-onion-garlic"
                                    ? "all"
                                    : "no-onion-garlic",
                            )
                        }
                        icon="🚫"
                        label="No onion / garlic"
                    />
                </div>
            </div>

            {/* ====================================================
                MEAL TIME
            ===================================================== */}

            <div className="mt-6">
                <FilterSelect
                    label="When are you eating?"
                    value={mealTime}
                    options={MEAL_TIME_OPTIONS.map(
                        (option) => ({
                            value: option.value,
                            label: option.label,
                        }),
                    )}
                    onChange={(value) =>
                        onMealTimeChange(
                            value as MealTime,
                        )
                    }
                />
            </div>

            {/* ====================================================
                DIET
            ===================================================== */}

            <div className="mt-5">
                <FilterSelect
                    label="Food type"
                    value={diet}
                    options={DIET_OPTIONS}
                    onChange={(value) =>
                        onDietChange(
                            value as FoodDiet | "all",
                        )
                    }
                />
            </div>

            {/* ====================================================
                RESTRICTIONS
            ===================================================== */}

            <div className="mt-5">
                <FilterSelect
                    label="Dietary restrictions"
                    value={foodRestriction}
                    options={RESTRICTION_OPTIONS.map(
                        (option) => ({
                            value: option.value,
                            label: option.label,
                        }),
                    )}
                    onChange={(value) =>
                        onFoodRestrictionChange(
                            value as FoodRestriction,
                        )
                    }
                />

                {foodRestriction !== "all" && (
                    <div
                        className="
                            mt-2
                            rounded-[14px]
                            bg-[#f7f3ea]
                            px-3
                            py-2.5
                        "
                    >
                        <p
                            className="
                                text-[9px]
                                font-bold
                                leading-4
                                text-[#52655f]
                            "
                        >
                            {
                                RESTRICTION_OPTIONS.find(
                                    (option) =>
                                        option.value ===
                                        foodRestriction,
                                )?.description
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* ====================================================
                SPICE
            ===================================================== */}

            <div className="mt-5">
                <FilterSelect
                    label="Spice level"
                    value={spice}
                    options={SPICE_OPTIONS}
                    onChange={(value) =>
                        onSpiceChange(
                            value as SpiceLevel | "all",
                        )
                    }
                />
            </div>

            {/* ====================================================
                CUISINE
            ===================================================== */}

            <div className="mt-5">
                <FilterSelect
                    label="Cuisine"
                    value={cuisine}
                    options={CUISINE_OPTIONS}
                    onChange={(value) =>
                        onCuisineChange(
                            value as FoodCuisine | "all",
                        )
                    }
                />
            </div>

            {/* ====================================================
                BUDGET
            ===================================================== */}

            <div className="mt-6">
                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-3
                    "
                >
                    <div>
                        <label
                            htmlFor="food-budget"
                            className="
                                text-[10px]
                                font-black
                                uppercase
                                tracking-[0.14em]
                                text-[#31544d]
                            "
                        >
                            Budget per person
                        </label>

                        <p
                            className="
                                mt-1
                                text-[9px]
                                leading-4
                                text-[#7a8580]
                            "
                        >
                            Maximum food spend
                        </p>
                    </div>

                    <div
                        className="
                            shrink-0
                            rounded-full
                            bg-[#e8f58d]
                            px-2.5
                            py-1
                        "
                    >
                        <PriceDisplay
                            inr={budget}
                            currency={currency}
                            showInr={false}
                            className="
                                text-[10px]
                                font-black
                            "
                        />
                    </div>
                </div>

                <input
                    id="food-budget"
                    type="range"
                    min={50}
                    max={2000}
                    step={50}
                    value={budget}
                    onChange={(event) =>
                        onBudgetChange(
                            Number(
                                event.target.value,
                            ),
                        )
                    }
                    className="
                        mt-4
                        w-full
                        accent-[#123c35]
                    "
                />

                <div
                    className="
                        mt-1
                        flex
                        justify-between
                        text-[9px]
                        font-bold
                        text-[#6d7974]
                    "
                >
                    <PriceDisplay
                        inr={50}
                        currency={currency}
                        showInr={false}
                    />

                    <PriceDisplay
                        inr={2000}
                        currency={currency}
                        showInr={false}
                    />
                </div>

                {/* Base INR reference */}

                {currency !== "INR" && (
                    <p
                        className="
                            mt-2
                            text-[9px]
                            font-medium
                            text-[#89938f]
                        "
                    >
                        Budget is calculated in INR and
                        displayed in {currency}.
                    </p>
                )}
            </div>

            {/* ====================================================
                RESET
            ===================================================== */}

            <button
                type="button"
                onClick={() => {
                    onBudgetChange(300);
                    onDietChange("all");
                    onSpiceChange("all");
                    onCuisineChange("all");
                    onMealTimeChange("all");
                    onFoodRestrictionChange("all");
                }}
                className="
                    mt-6
                    flex
                    min-h-11
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    border
                    border-[#123c35]/10
                    bg-[#fbfaf5]
                    px-4
                    py-3
                    text-xs
                    font-black
                    text-[#31544d]
                    transition
                    duration-200
                    hover:bg-[#e8f58d]
                "
            >
                <RotateCcw className="h-3.5 w-3.5" />

                Reset preferences
            </button>
        </aside>
    );
}

/* ================================================================
   QUICK OPTION
================================================================ */

function QuickOption({
    active,
    onClick,
    icon,
    label,
}: {
    active: boolean;
    onClick: () => void;
    icon: string;
    label: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`
                flex
                min-h-[54px]
                items-center
                gap-2.5
                rounded-[16px]
                border
                px-3
                py-2.5
                text-left
                transition-all
                duration-200
                ${
                    active
                        ? "border-[#123c35] bg-[#123c35] text-white shadow-[0_6px_18px_rgba(18,60,53,0.12)]"
                        : "border-[#123c35]/10 bg-[#fbfaf5] text-[#123c35] hover:border-[#123c35]/20 hover:bg-[#f7f3ea]"
                }
            `}
        >
            <span className="text-base">
                {icon}
            </span>

            <span className="min-w-0 flex-1">
                <span
                    className="
                        block
                        truncate
                        text-[10px]
                        font-black
                    "
                >
                    {label}
                </span>
            </span>

            {active && (
                <Check className="h-3.5 w-3.5 shrink-0" />
            )}
        </button>
    );
}

/* ================================================================
   SELECT
================================================================ */

function FilterSelect({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: string;
    options: {
        value: string;
        label: string;
    }[];
    onChange: (
        value: string,
    ) => void;
}) {
    return (
        <div>
            <label
                className="
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.14em]
                    text-[#31544d]
                "
            >
                {label}
            </label>

            <div className="relative mt-2">
                <select
                    value={value}
                    onChange={(event) =>
                        onChange(
                            event.target.value,
                        )
                    }
                    className="
                        h-11
                        w-full
                        appearance-none
                        rounded-[14px]
                        border
                        border-[#123c35]/10
                        bg-[#fbfaf5]
                        px-3
                        pr-10
                        text-xs
                        font-bold
                        text-[#123c35]
                        outline-none
                        transition
                        hover:border-[#123c35]/20
                        focus:border-[#123c35]/30
                        focus:ring-2
                        focus:ring-[#e8f58d]
                    "
                >
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                <ChevronDown
                    className="
                        pointer-events-none
                        absolute
                        right-3
                        top-1/2
                        h-4
                        w-4
                        -translate-y-1/2
                        text-[#6d7974]
                    "
                />
            </div>
        </div>
    );
}