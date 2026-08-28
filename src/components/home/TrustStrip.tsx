"use client";

import {
    ArrowRight,
    CheckCircle2,
    ScanSearch,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

interface TrustStripProps {
    onClick?: () => void;
}

export default function TrustStrip({
    onClick,
}: TrustStripProps) {
    return (
        <section className="relative overflow-hidden rounded-[26px] border border-[#123c35]/10 bg-white p-4 shadow-[0_16px_45px_rgba(18,60,53,0.05)] sm:rounded-[30px] sm:p-5">
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#e8f58d]/30 blur-3xl" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
                {/* ICONS */}
                <div className="flex shrink-0 items-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#123c35] text-[#e8f58d]">
                        <ShieldCheck className="h-4 w-4" />
                    </span>

                    <span className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#f8d4c1] text-[#ef713d]">
                        <ScanSearch className="h-4 w-4" />
                    </span>

                    <span className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#dcefe5] text-[#123c35]">
                        <CheckCircle2 className="h-4 w-4" />
                    </span>
                </div>

                {/* CONTENT */}
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-[#ef713d]" />

                        <p className="text-sm font-black tracking-[-0.02em] text-[#123c35]">
                            Know before you pay
                        </p>
                    </div>

                    <p className="mt-1 max-w-2xl text-xs leading-5 text-[#6d7974]">
                        FairTrip helps you discover places, understand food
                        prices and compare local travel costs before making
                        a decision.
                    </p>
                </div>

                {/* ACTION */}
                {onClick && (
                    <button
                        type="button"
                        onClick={onClick}
                        className="group flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-[#123c35] px-4 text-xs font-black text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#0d312b]"
                    >
                        Learn more

                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                )}
            </div>
        </section>
    );
}