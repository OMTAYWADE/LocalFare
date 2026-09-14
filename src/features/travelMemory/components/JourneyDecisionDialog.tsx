"use client";

import {
    ArrowRight,
    Check,
    Loader2,
    Plus,
    Route,
    X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import JourneyPicker from "./JourneyPicker";
import type { JourneySummary } from "../types/travelMemory.types";

interface JourneyDecisionDialogProps {
    open: boolean;
    journeys: JourneySummary[];
    loadingJourneys?: boolean;
    saving?: boolean;
    sourceTitle?: string;
    onContinue: (journey: JourneySummary) => void;
    onCreate: (name: string) => void;
    onClose: () => void;
}

export default function JourneyDecisionDialog({
    open,
    journeys,
    loadingJourneys = false,
    saving = false,
    sourceTitle,
    onContinue,
    onCreate,
    onClose,
}: JourneyDecisionDialogProps) {
    const panelRef = useRef<HTMLDivElement>(null);
    const [mode, setMode] = useState<"choose" | "new">("choose");
    const [name, setName] = useState("");

    useEffect(() => {
        if (!open || !panelRef.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                panelRef.current,
                { opacity: 0, y: 22, scale: 0.98 },
                { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(1.2)" },
            );
        }, panelRef);

        return () => ctx.revert();
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#123c35]/45 px-4 py-6 backdrop-blur-sm">
            <div
                ref={panelRef}
                className="w-full max-w-xl rounded-[30px] border border-[#123c35]/10 bg-[#f5f1e8] p-4 shadow-[0_30px_100px_rgba(18,60,53,0.25)] sm:p-6"
                role="dialog"
                aria-modal="true"
                aria-labelledby="journey-dialog-title"
            >
                <div className="flex items-start justify-between gap-4 px-1">
                    <div>
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#ef713d]">
                            Save this travel story
                        </p>
                        <h2
                            id="journey-dialog-title"
                            className="mt-1 text-2xl font-black tracking-[-0.05em] text-[#123c35]"
                        >
                            Where should this journey go?
                        </h2>
                        <p className="mt-2 max-w-md text-[10px] leading-5 text-[#78847f]">
                            {sourceTitle
                                ? `"${sourceTitle}" has been understood. Choose whether it belongs to an existing journey or starts a new one.`
                                : "Choose the journey that should receive this travel source."}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#6f7b76] transition hover:bg-[#123c35] hover:text-white disabled:opacity-40"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="mt-5 rounded-[22px] bg-white p-1">
                    <div className="grid grid-cols-2 gap-1">
                        <button
                            type="button"
                            onClick={() => setMode("choose")}
                            className={`rounded-[18px] px-4 py-3 text-left transition ${
                                mode === "choose"
                                    ? "bg-[#123c35] text-white"
                                    : "text-[#123c35] hover:bg-[#fbfaf5]"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <Route className="h-4 w-4" />
                                <span className="text-[10px] font-black">
                                    Existing journey
                                </span>
                            </div>
                            <p className={`mt-1 text-[8px] ${mode === "choose" ? "text-white/50" : "text-[#87918d]"}`}>
                                Continue where you left off
                            </p>
                        </button>

                        <button
                            type="button"
                            onClick={() => setMode("new")}
                            className={`rounded-[18px] px-4 py-3 text-left transition ${
                                mode === "new"
                                    ? "bg-[#ef713d] text-white"
                                    : "text-[#123c35] hover:bg-[#fbfaf5]"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                <span className="text-[10px] font-black">
                                    New journey
                                </span>
                            </div>
                            <p className={`mt-1 text-[8px] ${mode === "new" ? "text-white/60" : "text-[#87918d]"}`}>
                                Save this as a separate trip
                            </p>
                        </button>
                    </div>
                </div>

                <div className="mt-4">
                    {mode === "choose" ? (
                        <JourneyPicker
                            journeys={journeys}
                            loading={loadingJourneys}
                            onSelect={onContinue}
                            onNew={() => setMode("new")}
                        />
                    ) : (
                        <div className="rounded-[22px] border border-[#123c35]/8 bg-white p-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f58d] text-[#123c35]">
                                    <Plus className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-black">Name your journey</p>
                                    <p className="mt-1 text-[9px] text-[#87918d]">
                                        You can keep adding destinations to this name later.
                                    </p>
                                </div>
                            </div>

                            <input
                                autoFocus
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" && name.trim() && !saving) {
                                        onCreate(name.trim());
                                    }
                                }}
                                placeholder="e.g. Mumbai Weekend"
                                className="mt-4 h-12 w-full rounded-[17px] bg-[#fbfaf5] px-4 text-sm font-bold text-[#123c35] outline-none ring-1 ring-inset ring-[#123c35]/8 placeholder:text-[#a0aaa6] focus:ring-[#ef713d]/35"
                            />

                            <div className="mt-3 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setMode("choose")}
                                    disabled={saving}
                                    className="h-11 rounded-full bg-[#f7f3ea] px-4 text-[10px] font-black text-[#123c35] disabled:opacity-40"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={() => name.trim() && onCreate(name.trim())}
                                    disabled={!name.trim() || saving}
                                    className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#123c35] px-5 text-[10px] font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    {saving ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Check className="h-4 w-4" />
                                    )}
                                    Save & add this source
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
