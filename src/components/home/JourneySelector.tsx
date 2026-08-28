"use client";

import {
    ArrowUpRight,
    Binoculars,
    ScanSearch,
    Send,
} from "lucide-react";

import { useRouter } from "next/navigation";

interface JourneySelectorProps {
    compact?: boolean;
}

const options = [
    {
        title: "Explore Nearby",
        description:
            "Discover attractions, food and useful places around you.",
        eyebrow: "Discover around you",
        icon: Binoculars,
        href: "/explore",
        cardClass:
            "bg-[#e8f58d] text-[#123c35]",
        iconClass:
            "bg-[#123c35] text-[#e8f58d]",
        arrowClass:
            "bg-[#cbe95b] text-[#123c35]",
    },
    {
        title: "I Know My Destination",
        description:
            "Compare routes, travel costs and options before you leave.",
        eyebrow: "Plan before you go",
        icon: Send,
        href: "/travel",
        cardClass:
            "bg-[#f8d4c1] text-[#123c35]",
        iconClass:
            "bg-[#ef713d] text-white",
        arrowClass:
            "bg-white/70 text-[#ef713d]",
    },
    {
        title: "Food & LocalFare",
        description:
            "Check food prices and local fare signals before you pay.",
        eyebrow: "Check before you pay",
        icon: ScanSearch,
        href: "/food",
        cardClass:
            "bg-[#123c35] text-white",
        iconClass:
            "bg-[#e8f58d] text-[#123c35]",
        arrowClass:
            "bg-white/10 text-[#e8f58d]",
    },
];

export default function JourneySelector({
    compact = false,
}: JourneySelectorProps) {
    const router = useRouter();

    return (
        <section className={compact ? "" : "mt-8"}>
            {!compact && (
                <div className="mb-5">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#ef713d]">
                        Start here
                    </p>

                    <h2 className="mt-1 text-2xl font-black tracking-[-0.045em] text-[#123c35]">
                        What are you looking for?
                    </h2>
                </div>
            )}

            <div className="grid gap-3 md:grid-cols-3">
                {options.map((option) => {
                    const Icon = option.icon;

                    return (
                        <button
                            key={option.href}
                            type="button"
                            onClick={() => router.push(option.href)}
                            className={[
                                "group relative overflow-hidden rounded-[26px]",
                                "border border-[#123c35]/10",
                                "text-left",
                                "transition-all duration-300",
                                "hover:-translate-y-1",
                                "hover:shadow-[0_20px_50px_rgba(18,60,53,0.12)]",
                                "focus:outline-none focus:ring-2",
                                "focus:ring-[#123c35]/30",
                                option.cardClass,
                            ].join(" ")}
                        >
                            {/* Decorative circle */}
                            <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/10 blur-2xl transition duration-500 group-hover:scale-150" />

                            <div className="relative z-10 flex min-h-[175px] flex-col justify-between p-5 sm:p-6">
                                <div className="flex items-start justify-between gap-3">
                                    <span
                                        className={[
                                            "flex h-11 w-11 items-center justify-center rounded-[15px]",
                                            "transition duration-300 group-hover:scale-105",
                                            option.iconClass,
                                        ].join(" ")}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </span>

                                    <span
                                        className={[
                                            "flex h-9 w-9 items-center justify-center rounded-full",
                                            "transition duration-300",
                                            "group-hover:translate-x-1 group-hover:-translate-y-1",
                                            option.arrowClass,
                                        ].join(" ")}
                                    >
                                        <ArrowUpRight className="h-4 w-4" />
                                    </span>
                                </div>

                                <div className="mt-6">
                                    <p className="text-[8px] font-black uppercase tracking-[0.18em] opacity-55">
                                        {option.eyebrow}
                                    </p>

                                    <h3 className="mt-1.5 text-xl font-black tracking-[-0.04em]">
                                        {option.title}
                                    </h3>

                                    <p className="mt-2 max-w-[320px] text-xs leading-5 opacity-70">
                                        {option.description}
                                    </p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}