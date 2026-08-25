import { Clock3 } from "lucide-react";
import type { FreshnessStatus } from "@/types";

import Badge from "./Badge";

interface Props {
  status: FreshnessStatus;
  lastUpdated: string;
}

export default function FreshnessBadge({ status, lastUpdated,}: Props) {
  const variant = status === "fresh" || status === "recent" ? "green" : status === "aging" ? "orange" : "red";
  const label = status === "fresh" ? "Fresh" : status === "recent" ? "Recent" : status === "aging" ? "Aging" : "Stale";
  return (
    <Badge variant={variant}>
      <Clock3 className="mr-1.5 h-3 w-3" />
      {label}
      <span className="mx-1 opacity-40">
        ·
      </span>
      {lastUpdated}
    </Badge>
  );
}