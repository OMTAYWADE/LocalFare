import type { PriceStatus } from "@/types";
import Badge from "./Badge";

interface Props {
  status: PriceStatus;
}

const config: Record<PriceStatus, { label: string; variant: "green" | "orange" | "red"; dot: string; }> = {
  cheap: {
    label: "Great value",
    variant: "green",
    dot: "bg-emerald-500",
  },

  fair: {
    label: "Fair price",
    variant: "green",
    dot: "bg-emerald-500",
  },

  high: {
    label: "Above local range",
    variant: "orange",
    dot: "bg-orange-500",
  },

  expensive: {
    label: "Very high",
    variant: "red",
    dot: "bg-red-500",
  },
};

export default function PriceBadge({ status,}: Props) {
  const item = config[status];

  return (
    <Badge variant={item.variant}>
      <span className={` mr-1.5 h-1.5 w-1.5 rounded-full ${item.dot} `} />
      {item.label}
    </Badge>
  );
}