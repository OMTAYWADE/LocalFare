"use client";

import {
    ArrowLeft,
    Check,
    Clock3,
    Filter,
    Loader2,
    Search,
    Sparkles,
    Utensils,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import FoodFilters, { type FoodRestriction } from "@/features/food/components/FoodFilters";
import { getFoodRecommendations } from "@/features/food/services/foodRecommendation.service";

import type {
    FoodCuisine,
    FoodDiet,
    FoodItem,
    MealType,
    SpiceLevel,
} from "@/features/food/types/food.types";

interface ApiRecommendation {
    food?: FoodItem;
}

interface ApiResponse {
    recommendations?: ApiRecommendation[];
    error?: string;
}

interface MenuScanResultsProps {
    items: string;
    latitude?: string;
    longitude?: string;
}

function getCurrentMeal(): MealType {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 11) return "breakfast";
    if (hour >= 11 && hour < 16) return "lunch";
    if (hour >= 16 && hour < 19) return "snack";
    if (hour >= 19 && hour < 23) return "dinner";

    return "late-night";
}

function readItems(
    value: string | null,
): string[] {
    if (!value) {
        return [];
    }

    return Array.from(
        new Set(
            value
                .split(",")
                .map((item) => {
                    try {
                        return decodeURIComponent(item.trim());
                    } catch {
                        return item.trim();
                    }
                })
                .map((item) =>
                    item.replace(/\s+/g, " ").trim(),
                )
                .filter(Boolean),
        ),
    );
}

function normalize(value: string): string {
    return value.trim().toLowerCase();
}

function PreferenceChip({
    active,
    children,
    onClick,
}: {
    active: boolean;
    children: React.ReactNode;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                rounded-full px-3 py-2
                text-[10px] font-black transition
                ${active
                    ? "bg-[#123c35] text-white"
                    : "border border-[#123c35]/10 bg-white text-[#31544d] hover:bg-[#fbfaf5]"
                }
            `}
        >
            {children}
        </button>
    );
}

function DishCard({
    food,
    selected,
    rank,
    onToggle,
}: {
    food: FoodItem;
    selected: boolean;
    rank: number;
    onToggle: () => void;
}) {
    const price =
        typeof food.priceMinInr === "number" &&
            typeof food.priceMaxInr === "number"
            ? `₹${food.priceMinInr}–₹${food.priceMaxInr}`
            : food.priceRange;

    return (
        <button
            type="button"
            onClick={onToggle}
            className={`
                w-full rounded-[24px] border p-4 text-left
                transition-all duration-200
                ${selected
                    ? "border-[#123c35]/20 bg-[#123c35] shadow-[0_14px_32px_rgba(18,60,53,0.11)]"
                    : "border-[#123c35]/8 bg-white hover:-translate-y-0.5 hover:shadow-md"
                }
            `}
        >
            <div className="flex gap-3">
                <div
                    className={`
                        flex h-10 w-10 shrink-0 items-center
                        justify-center rounded-full
                        ${selected
                            ? "bg-[#e8f58d] text-[#123c35]"
                            : "bg-[#f7f3ea] text-[#31544d]"
                        }
                    `}
                >
                    {selected ? (
                        <Check className="h-4 w-4" />
                    ) : (
                        <span className="text-[10px] font-black">
                            {rank}
                        </span>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <h3
                            className={`
                                text-sm font-black
                                ${selected
                                    ? "text-white"
                                    : "text-[#123c35]"
                                }
                            `}
                        >
                            {food.name}
                        </h3>

                        {price && (
                            <span
                                className={`
                                    shrink-0 text-[10px] font-black
                                    ${selected
                                        ? "text-[#cbe95b]"
                                        : "text-[#ef713d]"
                                    }
                                `}
                            >
                                {price}
                            </span>
                        )}
                    </div>

                    {food.description && (
                        <p
                            className={`
                                mt-2 line-clamp-2 text-[10px] leading-5
                                ${selected
                                    ? "text-white/60"
                                    : "text-[#6d7974]"
                                }
                            `}
                        >
                            {food.description}
                        </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-1.5">
                        {food.cuisine?.slice(0, 2).map(
                            (item) => (
                                <span
                                    key={`${food.id}-${item}`}
                                    className={`
                                        rounded-full px-2.5 py-1
                                        text-[8px] font-bold
                                        ${selected
                                            ? "bg-white/10 text-white/65"
                                            : "bg-[#f7f3ea] text-[#6d7974]"
                                        }
                                    `}
                                >
                                    {item}
                                </span>
                            ),
                        )}

                        {food.diet && (
                            <span
                                className={`
                                    rounded-full px-2.5 py-1
                                    text-[8px] font-bold
                                    ${selected
                                        ? "bg-white/10 text-white/65"
                                        : "bg-[#f7f3ea] text-[#6d7974]"
                                    }
                                `}
                            >
                                {food.diet}
                            </span>
                        )}

                        {food.spiceLevel && (
                            <span
                                className={`
                                    rounded-full px-2.5 py-1
                                    text-[8px] font-bold
                                    ${selected
                                        ? "bg-white/10 text-white/65"
                                        : "bg-[#f7f3ea] text-[#6d7974]"
                                    }
                                `}
                            >
                                {food.spiceLevel}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </button>
    );
}

export default function MenuScanResults({
    items,
    latitude,
    longitude,
}: MenuScanResultsProps) {
    const router = useRouter();

    const scannedItems = useMemo(
        () => readItems(items),
        [items],
    );

    const currentMeal = useMemo(
        () => getCurrentMeal(),
        [],
    );

    const [search, setSearch] =
        useState("");

    const [budget, setBudget] =
        useState(300);

    const [diet, setDiet] =
        useState<FoodDiet | "all">("all");

    const [spice, setSpice] =
        useState<SpiceLevel | "all">("all");

    const [cuisine, setCuisine] =
        useState<FoodCuisine | "all">("all");

    const [foodRestriction, setFoodRestriction] =
        useState<FoodRestriction>("none");

    const [meal, setMeal] =
        useState<MealType>(
            currentMeal,
        );

    const [taste, setTaste] =
        useState("all");

    const [foods, setFoods] =
        useState<FoodItem[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [selectedIds, setSelectedIds] =
        useState<Set<string>>(
            new Set(),
        );

    /*
     * IMPORTANT:
     * There is no local foodSearch.service or
     * food-categories file in this project.
     *
     * We use the existing recommendation API
     * to retrieve the food objects for the scanned
     * dish names.
     */
    useEffect(() => {
        let cancelled = false;

        async function loadScannedFoods() {
            if (
                scannedItems.length === 0
            ) {
                setFoods([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError("");

            try {
                const params =
                    new URLSearchParams();

                params.set(
                    "q",
                    scannedItems.join(","),
                );

                const response =
                    await fetch(
                        `/api/food/recommendations?${params.toString()}`,
                        {
                            method: "GET",
                            cache: "no-store",
                        },
                    );

                const data =
                    (await response.json()) as ApiResponse;

                if (!response.ok) {
                    throw new Error(
                        data.error ??
                        `Unable to load menu data (${response.status}).`,
                    );
                }

                const apiFoods =
                    (data.recommendations ??
                        [])
                        .map(
                            (item) =>
                                item.food,
                        )
                        .filter(
                            (
                                food,
                            ): food is FoodItem =>
                                Boolean(
                                    food,
                                ),
                        );

                /*
                 * De-duplicate foods because the
                 * recommendation API returns
                 * place-level candidates.
                 */
                const uniqueFoods =
                    Array.from(
                        new Map(
                            apiFoods.map(
                                (food) => [
                                    normalize(
                                        food.name,
                                    ),
                                    food,
                                ],
                            ),
                        ).values(),
                    );

                /*
                 * Prefer a scanned item directly when
                 * the API returned a matching food name.
                 * Keep all actual returned food knowledge.
                 */
                if (!cancelled) {
                    setFoods(
                        uniqueFoods,
                    );

                    setSelectedIds(
                        new Set(
                            uniqueFoods.map(
                                (food) =>
                                    food.id,
                            ),
                        ),
                    );
                }
            } catch (loadError) {
                console.error(
                    "[MenuScanResults] Failed:",
                    loadError,
                );

                if (!cancelled) {
                    setError(
                        loadError instanceof
                            Error
                            ? loadError.message
                            : "Unable to load scanned menu data.",
                    );
                    setFoods([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadScannedFoods();

        return () => {
            cancelled = true;
        };
    }, [scannedItems]);

    const tasteOptions = useMemo(
        () =>
            Array.from(
                new Set(
                    foods.flatMap(
                        (food) =>
                            food.tasteProfile ??
                            [],
                    ),
                ),
            ).sort(),
        [foods],
    );

    const filteredFoods = useMemo(() => {
        const query =
            normalize(search);

        return foods.filter(
            (food) => {
                if (
                    query &&
                    !normalize(
                        food.name,
                    ).includes(query) &&
                    !(food.tags ?? []).some(
                        (tag) =>
                            normalize(
                                tag,
                            ).includes(
                                query,
                            ),
                    )
                ) {
                    return false;
                }

                const maxPrice =
                    food.priceMaxInr ??
                    food.priceInr;

                if (
                    typeof maxPrice ===
                    "number" &&
                    maxPrice > budget
                ) {
                    return false;
                }

                if (
                    diet !== "all" &&
                    food.diet !== diet
                ) {
                    return false;
                }

                if (
                    spice !== "all" &&
                    food.spiceLevel !==
                    spice
                ) {
                    return false;
                }

                if (
                    cuisine !==
                    "all" &&
                    !food.cuisine.includes(
                        cuisine,
                    )
                ) {
                    return false;
                }

                if (!food.mealTypes.includes(meal)) {
                    return false;
                }

                if (
                    taste !== "all" &&
                    !(food.tasteProfile ?? []).some(
                        (item) =>
                            normalize(item) ===
                            normalize(taste),
                    )
                ) {
                    return false;
                }

                if (
                    foodRestriction ===
                    "jain" &&
                    food.jainSuitable !== true
                ) {
                    return false;
                }

                if (
                    foodRestriction ===
                    "no-onion" &&
                    food.containsOnion !== false
                ) {
                    return false;
                }

                if (
                    foodRestriction ===
                    "no-garlic" &&
                    food.containsGarlic !== false
                ) {
                    return false;
                }

                if (
                    foodRestriction ===
                    "no-onion-garlic" &&
                    (
                        food.containsOnion !==
                        false ||
                        food.containsGarlic !==
                        false
                    )
                ) {
                    return false;
                }

                return true;
            },
        );
    }, [
        foods,
        search,
        budget,
        diet,
        spice,
        cuisine,
        meal,
        taste,
    ]);

    const rankedFoods =
        useMemo(() => {
            return getFoodRecommendations(
                filteredFoods.map(
                    (food) => ({
                        food,
                        budgetInr:
                            budget,
                        vegetarian:
                            diet ===
                            "vegetarian",
                        preferredSpice:
                            spice === "all"
                                ? undefined
                                : spice,
                        preferredCuisine:
                            cuisine ===
                                "all"
                                ? undefined
                                : cuisine,
                        currentMeal: meal,
                        minimumRating: 0,
                    }),
                ),
            ).map(
                (item) => item.food,
            );
        }, [
            filteredFoods,
            budget,
            diet,
            spice,
            cuisine,
            meal,
            foodRestriction,
        ]);

    function toggleFood(
        food: FoodItem,
    ) {
        setSelectedIds(
            (current) => {
                const next =
                    new Set(current);

                if (
                    next.has(food.id)
                ) {
                    next.delete(food.id);
                } else {
                    next.add(food.id);
                }

                return next;
            },
        );
    }

    function selectAll() {
        setSelectedIds(
            new Set(
                rankedFoods.map(
                    (food) =>
                        food.id,
                ),
            ),
        );
    }

    function clearAll() {
        setSelectedIds(
            new Set(),
        );
    }

    function findNearby() {
        const selected =
            rankedFoods.filter(
                (food) =>
                    selectedIds.has(
                        food.id,
                    ),
            );

        if (
            selected.length === 0
        ) {
            return;
        }

        const params =
            new URLSearchParams();

        params.set(
            "items",
            selected
                .map(
                    (food) =>
                        food.name,
                )
                .join(","),
        );

        if (latitude && longitude) {
            params.set("latitude", latitude);
            params.set("longitude", longitude);
        }

        router.push(
            `/food/recommendations?${params.toString()}`,
        );
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-[#f7f3ea] px-4 pb-20 pt-8 sm:px-6">
                <div className="mx-auto max-w-6xl">
                    <div className="flex min-h-[60vh] items-center justify-center">
                        <div className="text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#123c35]">
                                <Loader2 className="h-6 w-6 animate-spin text-[#e8f58d]" />
                            </div>

                            <h1 className="mt-5 text-xl font-black text-[#123c35]">
                                Understanding your menu
                            </h1>

                            <p className="mt-2 text-sm text-[#6d7974]">
                                Matching scanned dishes with
                                available FairTrip food information...
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f7f3ea]">
            <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
                {/* HEADER */}
                <header className="flex h-20 items-center justify-between">
                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/food/scanner?mode=menu",
                            )
                        }
                        className="inline-flex h-10 items-center gap-2 rounded-full border border-[#123c35]/10 bg-white px-4 text-xs font-black text-[#123c35]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Menu scan
                    </button>

                    <div className="inline-flex items-center gap-2 rounded-full border border-[#123c35]/10 bg-white px-3.5 py-2 text-[9px] font-black uppercase tracking-[0.15em] text-[#31544d]">
                        <Sparkles className="h-3.5 w-3.5 text-[#ef713d]" />
                        Personalized menu
                    </div>
                </header>

                {/* HERO */}
                <section className="pt-5">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#ef713d]">
                                Menu intelligence
                            </p>

                            <h1 className="mt-2 text-4xl font-black leading-[0.95] tracking-[-0.055em] text-[#123c35] sm:text-5xl">
                                Find what fits
                                <br />
                                <span className="text-[#ef713d]">
                                    you right now.
                                </span>
                            </h1>

                            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#6d7974]">
                                FairTrip starts with the dishes
                                actually detected from your menu,
                                then narrows them using your taste,
                                cuisine, diet, spice, budget and
                                eating time.
                            </p>
                        </div>

                        <div className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#123c35] px-4 py-2.5 text-[10px] font-black text-white">
                            <Clock3 className="h-3.5 w-3.5 text-[#cbe95b]" />
                            {meal} now
                        </div>
                    </div>
                </section>

                {/* DETECTED ITEMS */}
                <section className="mt-7 rounded-[26px] border border-[#123c35]/10 bg-white p-5 shadow-[0_12px_35px_rgba(18,60,53,0.05)]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f58d] text-[#123c35]">
                            <Utensils className="h-4 w-4" />
                        </div>

                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#ef713d]">
                                From your scan
                            </p>

                            <p className="mt-1 text-sm font-black text-[#123c35]">
                                {scannedItems.length}{" "}
                                {scannedItems.length === 1
                                    ? "dish"
                                    : "dishes"}{" "}
                                detected
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {scannedItems.map(
                            (item) => (
                                <span
                                    key={item}
                                    className="rounded-full bg-[#f7f3ea] px-3 py-1.5 text-[10px] font-black text-[#123c35]"
                                >
                                    {item}
                                </span>
                            ),
                        )}
                    </div>
                </section>

                {error && (
                    <div className="mt-5 rounded-[22px] border border-[#b84f2c]/10 bg-[#f9dfd0] p-5 text-xs font-semibold leading-5 text-[#93432e]">
                        {error}
                    </div>
                )}

                {/* MAIN */}
                <section className="mt-7 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
                    <aside className="space-y-4 lg:sticky lg:top-5">
                        <div className="rounded-[26px] border border-[#123c35]/10 bg-white p-5">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-[#ef713d]" />

                                <p className="text-sm font-black text-[#123c35]">
                                    Your preferences
                                </p>
                            </div>

                            <p className="mt-1 text-[10px] leading-5 text-[#89938f]">
                                Change these to reorder the
                                scanned dishes.
                            </p>
                        </div>

                        <FoodFilters
                            budget={budget}
                            diet={diet}
                            spice={spice}
                            cuisine={cuisine}
                            mealTime={meal}
                            foodRestriction={
                                foodRestriction
                            }
                            onBudgetChange={
                                setBudget
                            }
                            onDietChange={
                                setDiet
                            }
                            onSpiceChange={
                                setSpice
                            }
                            onCuisineChange={
                                setCuisine
                            }
                            onMealTimeChange={
                                setMeal
                            }
                            onFoodRestrictionChange={
                                setFoodRestriction
                            }
                        />

                        {tasteOptions.length > 0 && (
                            <div className="rounded-[24px] border border-[#123c35]/10 bg-white p-5">
                                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#ef713d]">
                                    Taste
                                </p>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    <PreferenceChip
                                        active={
                                            taste ===
                                            "all"
                                        }
                                        onClick={() =>
                                            setTaste(
                                                "all",
                                            )
                                        }
                                    >
                                        Any
                                    </PreferenceChip>

                                    {tasteOptions.map(
                                        (
                                            option,
                                        ) => (
                                            <PreferenceChip
                                                key={
                                                    option
                                                }
                                                active={
                                                    taste ===
                                                    option
                                                }
                                                onClick={() =>
                                                    setTaste(
                                                        option,
                                                    )
                                                }
                                            >
                                                {
                                                    option
                                                }
                                            </PreferenceChip>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="rounded-[24px] border border-[#123c35]/10 bg-white p-5">
                            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#ef713d]">
                                Eating time
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                                {(
                                    [
                                        "breakfast",
                                        "lunch",
                                        "snack",
                                        "dinner",
                                        "late-night",
                                    ] as MealType[]
                                ).map(
                                    (
                                        option,
                                    ) => (
                                        <PreferenceChip
                                            key={
                                                option
                                            }
                                            active={
                                                meal ===
                                                option
                                            }
                                            onClick={() =>
                                                setMeal(
                                                    option,
                                                )
                                            }
                                        >
                                            {
                                                option
                                            }
                                        </PreferenceChip>
                                    ),
                                )}
                            </div>
                        </div>
                    </aside>

                    <div className="min-w-0">
                        <div className="rounded-[24px] border border-[#123c35]/10 bg-white p-3">
                            <div className="flex items-center gap-3 rounded-[18px] bg-[#fbfaf5] px-4 py-3">
                                <Search className="h-4 w-4 text-[#89938f]" />

                                <input
                                    value={
                                        search
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        setSearch(
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                    placeholder="Search dishes..."
                                    className="w-full bg-transparent text-sm font-semibold text-[#123c35] outline-none placeholder:text-[#a1aaa6]"
                                />
                            </div>
                        </div>

                        <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#ef713d]">
                                    Personalized ranking
                                </p>

                                <h2 className="mt-1 text-2xl font-black tracking-[-0.04em] text-[#123c35] sm:text-3xl">
                                    Best choices for you
                                </h2>

                                <p className="mt-1.5 text-xs leading-5 text-[#6d7974]">
                                    Ranked for your current
                                    eating time and preferences.
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={
                                        selectAll
                                    }
                                    className="rounded-full border border-[#123c35]/10 bg-white px-4 py-2 text-[10px] font-black text-[#123c35]"
                                >
                                    Select all
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        clearAll
                                    }
                                    className="rounded-full border border-[#123c35]/10 bg-white px-4 py-2 text-[10px] font-black text-[#6d7974]"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        {rankedFoods.length >
                            0 ? (
                            <div className="mt-5 grid gap-3 md:grid-cols-2">
                                {rankedFoods.map(
                                    (
                                        food,
                                        index,
                                    ) => (
                                        <DishCard
                                            key={
                                                food.id
                                            }
                                            food={
                                                food
                                            }
                                            rank={
                                                index +
                                                1
                                            }
                                            selected={selectedIds.has(
                                                food.id,
                                            )}
                                            onToggle={() =>
                                                toggleFood(
                                                    food,
                                                )
                                            }
                                        />
                                    ),
                                )}
                            </div>
                        ) : (
                            <div className="mt-5 rounded-[26px] border border-[#123c35]/10 bg-white p-8 text-center">
                                <Sparkles className="mx-auto h-7 w-7 text-[#ef713d]" />

                                <h3 className="mt-3 text-lg font-black text-[#123c35]">
                                    No recognized dishes fit
                                    these choices
                                </h3>

                                <p className="mt-2 text-xs leading-5 text-[#6d7974]">
                                    Broaden a filter or scan a
                                    clearer menu.
                                </p>
                            </div>
                        )}

                        <div className="sticky bottom-4 z-30 mt-7">
                            <div className="rounded-[26px] border border-[#123c35]/10 bg-white/95 p-4 shadow-[0_18px_45px_rgba(18,60,53,0.12)] backdrop-blur">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-xs font-black text-[#123c35]">
                                            {
                                                selectedIds.size
                                            }{" "}
                                            {selectedIds.size ===
                                                1
                                                ? "dish"
                                                : "dishes"}{" "}
                                            selected
                                        </p>

                                        <p className="mt-1 text-[10px] leading-4 text-[#89938f]">
                                            Next, find real nearby
                                            places serving your
                                            selected dishes.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={
                                            findNearby
                                        }
                                        disabled={
                                            selectedIds.size ===
                                            0
                                        }
                                        className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#123c35] px-6 text-xs font-black text-white transition hover:bg-[#0d312b] disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <Utensils className="h-4 w-4 text-[#cbe95b]" />
                                        Find nearby places
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}