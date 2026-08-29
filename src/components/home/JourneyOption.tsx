"use client";

import { ArrowUpRight, type LucideIcon } from "lucide-react";

interface JourneyOptionProps {
  type: "nearby" | "destination" | "localfare";
  icon: LucideIcon;
  title: string;
  description: string;
  eyebrow?: string;
  onClick?: () => void;
}

export default function JourneyOption({
  type,
  icon: Icon,
  title,
  description,
  eyebrow,
  onClick,
}: JourneyOptionProps) {
  const styles = {
    nearby: {
      card: "bg-[#e8f58d] text-[#123c35] hover:bg-[#e3f27e]",
      icon: "bg-[#cbe95b] text-[#123c35]",
      arrow: "bg-[#cbe95b] text-[#123c35]",
      circle: "border-[#123c35]",
      defaultEyebrow: "Discover around you",
    },
    destination: {
      card: "bg-[#f8d4c1] text-[#123c35] hover:bg-[#f5cdbb]",
      icon: "bg-[#ef713d] text-white",
      arrow: "bg-[#f8d4c1] text-[#ef713d]",
      circle: "border-[#ef713d]",
      defaultEyebrow: "Plan before you go",
    },
    localfare: {
      card: "bg-[#123c35] text-white hover:bg-[#0d312b]",
      icon: "bg-[#e8f58d] text-[#123c35]",
      arrow: "bg-white/10 text-[#e8f58d]",
      circle: "border-[#e8f58d]",
      defaultEyebrow: "Check before you pay",
    },
  }[type];

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group relative w-full overflow-hidden",
        "rounded-[26px] sm:rounded-[30px]",
        "border border-[#123c35]/10",
        "p-5 sm:p-6",
        "text-left",
        "transition-all duration-300",
        "hover:-translate-y-1",
        "hover:shadow-[0_20px_50px_rgba(18,60,53,0.12)]",
        "active:scale-[0.98]",
        "focus:outline-none",
        "focus:ring-2 focus:ring-[#123c35]/30",
        "focus:ring-offset-2",
        styles.card,
      ].join(" ")}
    >
      <div
        className={[
          "pointer-events-none absolute",
          "-right-16 -top-16",
          "h-48 w-48 rounded-full",
          "border-[22px]",
          "opacity-20",
          "transition-transform duration-500",
          "group-hover:scale-125",
          styles.circle,
        ].join(" ")}
      />

      <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-white/10 blur-3xl transition duration-500 group-hover:scale-125" />

      <div className="relative z-10 flex min-h-[190px] flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div
            className={[
              "flex h-12 w-12 shrink-0",
              "items-center justify-center",
              "rounded-[16px]",
              "transition-transform duration-300",
              "group-hover:scale-105",
              styles.icon,
            ].join(" ")}
          >
            <Icon className="h-5 w-5" strokeWidth={2.2} />
          </div>

          <span
            className={[
              "flex h-10 w-10 shrink-0",
              "items-center justify-center",
              "rounded-full",
              "transition-all duration-300",
              "group-hover:-translate-y-1",
              "group-hover:translate-x-1",
              styles.arrow,
            ].join(" ")}
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <div className="mt-8 max-w-[340px]">
          <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-55">
            {eyebrow ?? styles.defaultEyebrow}
          </p>
          <h2 className="mt-2 text-xl font-black tracking-[-0.045em] sm:text-2xl">
            {title}
          </h2>
          <p className="mt-2 max-w-[320px] text-xs leading-5 opacity-70 sm:text-sm sm:leading-6">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}