"use client";

import {
    ArrowUpRight,
    type LucideIcon,
} from "lucide-react";

interface JourneyOptionProps {
    type: "nearby" | "destination";
    icon: LucideIcon;
    title: string;
    description: string;
    onClick?: () => void;
}

export default function JourneyOption({
    type,
    icon: Icon,
    title,
    description,
    onClick,
}: JourneyOptionProps) {
    const nearby = type === "nearby";

    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "group relative min-h-[250px] overflow-hidden rounded-[30px]",
                "border border-[#123c35]/10 p-6 text-left",
                "transition duration-300 hover:-translate-y-1",
                "focus:outline-none focus:ring-2 focus:ring-[#123c35] focus:ring-offset-2",
                nearby
                    ? "bg-[#e8f58d] hover:bg-[#e3f27e]"
                    : "bg-[#f9dfd0] hover:bg-[#f7d8c7]",
            ].join(" ")}
        >
            {/* Decorative circle */}
            <div
                className={[
                    "absolute -right-16 -top-16 h-56 w-56 rounded-full",
                    "border-[24px] opacity-20 transition duration-500",
                    "group-hover:scale-110",
                    nearby
                        ? "border-[#123c35]"
                        : "border-[#ef713d]",
                ].join(" ")}
            />

            <div
                className={[
                    "relative z-10 flex h-14 w-14 items-center justify-center rounded-[18px]",
                    nearby
                        ? "bg-[#cbe95b] text-[#123c35]"
                        : "bg-[#f8d4c1] text-[#ef713d]",
                ].join(" ")}
            >
                <Icon className="h-6 w-6" />
            </div>

            <div className="relative z-10 mt-8 max-w-[340px]">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50">
                    {nearby
                        ? "Discover around you"
                        : "Plan ahead"}
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
                    {title}
                </h2>

                <p className="mt-3 max-w-[320px] text-sm leading-6 opacity-65">
                    {description}
                </p>
            </div>

            <span
                className={[
                    "absolute bottom-6 right-6 z-10 flex h-11 w-11",
                    "items-center justify-center rounded-full",
                    "transition duration-300 group-hover:scale-110",
                    nearby
                        ? "bg-[#cbe95b] text-[#123c35]"
                        : "bg-[#f8d4c1] text-[#ef713d]",
                ].join(" ")}
            >
                <ArrowUpRight className="h-5 w-5" />
            </span>
        </button>
    );
}