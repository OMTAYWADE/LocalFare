import { Clock3 } from "lucide-react";
import type { FreshnessStatus } from "@/types";
import Badge from "./Badge";

interface Props {
  status: FreshnessStatus;
  lastUpdated: string;
}

const config: Record<FreshnessStatus, { variant: "green" | "orange" | "red"; label: string }> = {
  fresh: { variant: "green", label: "Fresh" },
  recent: { variant: "green", label: "Recent" },
  aging: { variant: "orange", label: "Aging" },
  stale: { variant: "red", label: "Stale" },
};

export default function FreshnessBadge({ status, lastUpdated }: Props) {
  const item = config[status] ?? { variant: "neutral" as const, label: "Unknown" };

  return (
    <Badge variant={item.variant}>
      <Clock3 className="mr-1.5 h-3 w-3" />
      {item.label}
      <span className="mx-1 opacity-40">·</span>
      {lastUpdated}
    </Badge>
  );
}