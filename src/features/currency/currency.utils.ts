import { CURRENCIES,} from "./currency.config";
import type { CurrencyCode,} from "./types";

export function formatCurrency( amount: number, currency: CurrencyCode,): string {
    const info = CURRENCIES[currency];

    if (!info) {
        return `${amount}`;
    }

    return new Intl.NumberFormat(
        currency === "INR" ? "en-IN" : "en-US",
        {
            style: "currency",
            currency,
            maximumFractionDigits: currency === "JPY" ? 0 : 2,
        },
    ).format(amount);
}