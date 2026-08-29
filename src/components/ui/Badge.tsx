// Badge.tsx
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "neutral" | "green" | "orange" | "red";
  className?: string;
}

export default function Badge({ children, variant = "neutral", className = "" }: BadgeProps) {
  const variants = {
    neutral: "border-slate-200 bg-slate-50 text-slate-600",
    green: "border-emerald-100 bg-emerald-50 text-emerald-700",
    orange: "border-orange-100 bg-orange-50 text-orange-700",
    red: "border-red-100 bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all duration-200 ease-out hover:scale-[1.04] hover:shadow-sm animate-in fade-in slide-in-from-bottom-1 ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}