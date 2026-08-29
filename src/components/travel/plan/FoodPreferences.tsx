"use client";

import { Flame, Fish, Leaf, MapPin, Star, Utensils } from "lucide-react";
import type { ComponentType } from "react";
import type { FoodPreference } from "@/features/travel/types";

interface FoodPreferencesProps {
  selected: FoodPreference;
  onChange: (preference: FoodPreference) => void;
}

const preferences: { id: FoodPreference; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: "local", label: "Local favourites", icon: MapPin },
  { id: "spicy", label: "Spicy", icon: Flame },
  { id: "indian", label: "Indian", icon: Utensils },
  { id: "seafood", label: "Seafood", icon: Fish },
  { id: "vegetarian", label: "Vegetarian", icon: Leaf },
  { id: "famous", label: "Must try", icon: Star },
];

export default function FoodPreferences({ selected, onChange }: FoodPreferencesProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {preferences.map(({ id, label, icon: Icon }) => {
        const active = selected === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-xs font-black transition-all duration-200 active:scale-95 ${
              active
                ? "bg-[#123c35] text-white shadow-sm scale-[1.02]"
                : "border border-[#123c35]/10 bg-white text-[#31544d] hover:bg-[#e8f58d] hover:-translate-y-0.5"
            }`}
          >
            <Icon className={`h-3.5 w-3.5 transition-transform duration-200 ${active ? "scale-110" : ""}`} />
            {label}
          </button>
        );
      })}
    </div>
  );
}