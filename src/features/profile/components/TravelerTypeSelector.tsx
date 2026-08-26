"use client";

import { Compass, Home, Map, Sparkles,} from "lucide-react";
import type { TravelerType,} from "../types";

interface TravelerTypeSelectorProps {
    value?: TravelerType;
    onChange: ( value: TravelerType,) => void;
    compact?: boolean;
}

export default function TravelerTypeSelector({ value, onChange, compact = false,}: TravelerTypeSelectorProps) {
    return (
        <section className={ compact ? "rounded-2xl border border-[#123c35]/10 bg-white p-3" : "rounded-[28px] border border-[#123c35]/10 bg-white p-5 sm:p-6"}>
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#e8f58d] text-[#123c35]">
                    <Compass className="h-5 w-5" />
                </div>

                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#ef713d]">
                        Personalize Explore
                    </p>

                    <h2 className="mt-1 text-lg font-black tracking-[-0.03em] text-[#123c35]">
                        How are you exploring?
                    </h2>

                    {!compact && (
                        <p className="mt-1 text-sm leading-5 text-[#6d7974]">
                            We'll use this along with places you've already visited to find better recommendations.
                        </p>
                    )}
                </div>
            </div>

            <div className={ compact ? "mt-3 grid grid-cols-2 gap-2" : "mt-5 grid gap-3 sm:grid-cols-2"}>
                <button type="button" onClick={() => onChange("tourist") } className={["group rounded-[20px] border p-4 text-left transition", value === "tourist" ? "border-[#123c35] bg-[#123c35] text-white shadow-[0_10px_30px_rgba(18,60,53,0.15)]" : "border-[#123c35]/10 bg-[#f7f3ea] text-[#123c35] hover:border-[#123c35]/25",].join(" ")}>
                    <div className="flex items-center justify-between">
                        <div className={["flex h-9 w-9 items-center justify-center rounded-xl", value === "tourist" ? "bg-[#e8f58d] text-[#123c35]" : "bg-white text-[#123c35]",].join(" ")}>
                            <Map className="h-4 w-4" />
                        </div>

                        {value === "tourist" && ( <Sparkles className="h-4 w-4 text-[#e8f58d]" />)}
                    </div>

                    <p className="mt-4 text-sm font-black">
                        I'm a Tourist
                    </p>

                    {!compact && (
                        <p className={[ "mt-1 text-xs leading-5", value === "tourist" ? "text-white/60" : "text-[#6d7974]",].join(" ")}>
                            Show famous places, attractions and things worth seeing nearby.
                        </p>
                    )}
                </button>

                <button type="button" onClick={() => onChange("citizen") }
                    className={[ "group rounded-[20px] border p-4 text-left transition", value === "citizen" ? "border-[#123c35] bg-[#123c35] text-white shadow-[0_10px_30px_rgba(18,60,53,0.15)]" : "border-[#123c35]/10 bg-[#f7f3ea] text-[#123c35] hover:border-[#123c35]/25",].join(" ")}>
                    <div className="flex items-center justify-between">
                        <div className={[ "flex h-9 w-9 items-center justify-center rounded-xl", value === "citizen" ? "bg-[#e8f58d] text-[#123c35]" : "bg-white text-[#123c35]",].join(" ")}>
                            <Home className="h-4 w-4" />
                        </div>

                        {value === "citizen" && (
                            <Sparkles className="h-4 w-4 text-[#e8f58d]" />
                        )}
                    </div>

                    <p className="mt-4 text-sm font-black">
                        I'm a Local
                    </p>

                    {!compact && (
                        <p className={[ "mt-1 text-xs leading-5", value === "citizen" ? "text-white/60" : "text-[#6d7974]",].join(" ")}>
                            Discover new places
                            beyond your usual
                            surroundings.
                        </p>
                    )}
                </button>
            </div>
        </section>
    );
}