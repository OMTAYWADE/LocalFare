"use client";

import { ChevronDown, Compass,} from "lucide-react";
import type { TravelerType,} from "../types";

interface TravelerTypeSwitcherProps {
    value: TravelerType;
    onChange: ( value: TravelerType, ) => void;
}

export default function TravelerTypeSwitcher({ value, onChange,}: TravelerTypeSwitcherProps) {
    const nextType = value === "tourist" ? "citizen" : "tourist";

    return (
        <button type="button" onClick={() => onChange(nextType) } className="inline-flex items-center gap-2 rounded-full border border-[#123c35]/10 bg-white px-3 py-2 text-xs font-bold text-[#123c35] shadow-sm transition hover:border-[#123c35]/20">
            <Compass className="h-3.5 w-3.5" />
            <span>
                {value === "tourist" ? "Tourist" : "Local"}
            </span>

            <ChevronDown className="h-3.5 w-3.5 text-[#6d7974]" />
        </button>
    );
}