"use client";

import { CURRENCIES,} from "../currency.config";
import type { CurrencyCode, } from "../types";

interface CurrencySelectorProps {
    value: CurrencyCode;
    onChange: ( currency: CurrencyCode,) => void;
}

export default function CurrencySelector({ value, onChange,}: CurrencySelectorProps) {
    return (
        <select value={value} onChange={(event) => onChange(event.target.value as CurrencyCode,)}
            className="h-10 rounded-full border border-[#123c35]/10 bg-white px-3 text-xs font-bold text-[#123c35] outline-none transition hover:border-[#123c35]/25 focus:border-[#123c35]/40">
            {Object.values(CURRENCIES).map((currency) => (
                    <option key={currency.code} value={currency.code}>
                        {currency.flag}{" "}
                        {currency.code}
                    </option>
                ),
            )}
        </select>
    );
}