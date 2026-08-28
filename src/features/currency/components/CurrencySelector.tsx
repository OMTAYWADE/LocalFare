"use client";

import {
    ChevronDown,
} from "lucide-react";

import {
    CURRENCIES,
} from "../currency.config";

import type {
    CurrencyCode,
} from "../types";

interface CurrencySelectorProps {
    value: CurrencyCode;

    onChange: (
        currency: CurrencyCode,
    ) => void;

    compact?: boolean;
}

export default function CurrencySelector({
    value,
    onChange,
    compact = false,
}: CurrencySelectorProps) {
    return (
        <div className="relative inline-flex">
            <select
                value={value}
                onChange={(event) =>
                    onChange(
                        event.target
                            .value as CurrencyCode,
                    )
                }
                aria-label="Choose currency"
                className={[
                    "appearance-none",
                    "cursor-pointer",
                    "border",
                    "border-[#123c35]/10",
                    "bg-white",
                    "font-black",
                    "text-[#123c35]",
                    "outline-none",
                    "transition",
                    "hover:border-[#123c35]/25",
                    "focus:border-[#ef713d]/40",
                    compact
                        ? "h-9 rounded-full pl-3 pr-8 text-[10px]"
                        : "h-11 rounded-[14px] pl-3 pr-9 text-xs",
                ].join(" ")}
            >
                {Object.values(
                    CURRENCIES,
                ).map((item) => (
                    <option
                        key={item.code}
                        value={item.code}
                    >
                        {item.flag}{" "}
                        {item.code} —{" "}
                        {item.name}
                    </option>
                ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6d7974]" />
        </div>
    );
}