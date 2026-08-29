// PriceBadge.tsx (final version, with fallback + animation)
import type { PriceStatus } from "@/types";
import Badge from "./Badge";

interface Props {
  status: PriceStatus;
}

const config: Record<PriceStatus, { label: string; variant: "green" | "orange" | "red"; dot: string }> = {
  cheap: { label: "Great value", variant: "green", dot: "bg-emerald-500" },
  fair: { label: "Fair price", variant: "green", dot: "bg-emerald-500" },
  high: { label: "Above local range", variant: "orange", dot: "bg-orange-500" },
  expensive: { label: "Very high", variant: "red", dot: "bg-red-500" },
};

const fallback = { label: "Price unknown", variant: "neutral" as const, dot: "bg-slate-400" };

export default function PriceBadge({ status }: Props) {
  const item = config[status] ?? fallback;

  return (
    <Badge variant={item.variant}>
      <span className={`relative mr-1.5 flex h-1.5 w-1.5`}>
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${item.dot} opacity-60`} />
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${item.dot}`} />
      </span>
      {item.label}
    </Badge>
  );
}