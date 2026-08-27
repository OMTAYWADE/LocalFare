"use client";

import {
    ChevronDown,
    SlidersHorizontal,
} from "lucide-react";

import type {
    FoodCuisine,
    FoodDiet,
    SpiceLevel,
} from "../types/food.types";

interface FoodFiltersProps {
    budget: number;
    diet: FoodDiet | "all";
    spice: SpiceLevel | "all";
    cuisine: FoodCuisine | "all";

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
}

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

export default function FoodFilters({
    budget,
    diet,
    spice,
    cuisine,
    onBudgetChange,
    onDietChange,
    onSpiceChange,
    onCuisineChange,
}: FoodFiltersProps) {
    return (
        <aside className="rounded-[24px] border border-[#123c35]/10 bg-white p-4 sm:p-5">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">

                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f58d] text-[#123c35]">
                        <SlidersHorizontal className="h-4 w-4" />
                    </span>

                    <div>
                        <p className="text-sm font-black text-[#123c35]">
                            Preferences
                        </p>

                        <p className="text-[10px] text-[#6d7974]">
                            Personalize results
                        </p>
                    </div>

                </div>

            </div>


            {/* Budget */}

            <div className="mt-6">

                <div className="flex items-center justify-between">

                    <label
                        htmlFor="food-budget"
                        className="text-[10px] font-black uppercase tracking-[0.14em] text-[#31544d]"
                    >
                        Budget
                    </label>

                    <span className="rounded-full bg-[#f7f3ea] px-2.5 py-1 text-[10px] font-black text-[#123c35]">
                        ₹{budget}
                    </span>

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
                    className="mt-4 w-full accent-[#123c35]"
                />

                <div className="mt-1 flex justify-between text-[9px] font-bold text-[#6d7974]">
                    <span>₹50</span>
                    <span>₹2,000</span>
                </div>

            </div>


            {/* Diet */}

            <FilterSelect
                label="Diet"
                value={diet}
                options={DIET_OPTIONS}
                onChange={(value) =>
                    onDietChange(
                        value as FoodDiet | "all",
                    )
                }
            />


            {/* Spice */}

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


            {/* Cuisine */}

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


            {/* Reset */}

            <button
                type="button"
                onClick={() => {
                    onBudgetChange(300);
                    onDietChange("all");
                    onSpiceChange("all");
                    onCuisineChange("all");
                }}
                className="mt-5 w-full rounded-full border border-[#123c35]/10 bg-[#fbfaf5] px-4 py-2.5 text-xs font-black text-[#31544d] transition hover:bg-[#e8f58d]"
            >
                Reset preferences
            </button>

        </aside>
    );
}


/* ============================================================
   SELECT
   ============================================================ */

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
        <div className="mt-5">

            <label className="text-[10px] font-black uppercase tracking-[0.14em] text-[#31544d]">
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
                    className="h-11 w-full appearance-none rounded-xl border border-[#123c35]/10 bg-[#fbfaf5] px-3 pr-9 text-xs font-bold text-[#123c35] outline-none transition focus:border-[#123c35]/30"
                >
                    {options.map(
                        (option) => (
                            <option
                                key={
                                    option.value
                                }
                                value={
                                    option.value
                                }
                            >
                                {
                                    option.label
                                }
                            </option>
                        ),
                    )}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6d7974]" />

            </div>

        </div>
    );
}