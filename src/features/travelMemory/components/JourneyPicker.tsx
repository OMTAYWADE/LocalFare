"use client";

import {
    Archive,
    ChevronRight,
    Loader2,
    Plus,
    Route,
    Wallet,
} from "lucide-react";

import type {
    JourneySummary,
} from "../types/travelMemory.types";

interface JourneyPickerProps {
    journeys: JourneySummary[];
    loading?: boolean;
    onSelect: (
        journey: JourneySummary,
    ) => void;
    onNew: () => void;
}

export default function JourneyPicker({
    journeys,
    loading = false,
    onSelect,
    onNew,
}: JourneyPickerProps) {
    if (loading) {
        return (
            <div className="space-y-3">
                <div className="flex items-center justify-center rounded-[22px] border border-[#123c35]/8 bg-[#fbfaf5] px-5 py-10">
                    <Loader2 className="h-5 w-5 animate-spin text-[#ef713d]" />
                </div>

                <NewJourneyButton
                    onClick={onNew}
                />
            </div>
        );
    }

    return (
        <div className="space-y-3">

            {journeys.length === 0 ? (
                <div className="rounded-[22px] border border-dashed border-[#123c35]/10 bg-[#fbfaf5] p-5">
                    <p className="text-xs font-black">
                        No saved journeys yet.
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-[#7b8782]">
                        Start a new journey for this travel
                        story. You can keep adding sources
                        later.
                    </p>
                </div>
            ) : (
                <div className="max-h-[310px] space-y-2 overflow-y-auto pr-1">
                    {journeys.map(
                        (journey) => (
                            <JourneyItem
                                key={
                                    journey.id
                                }
                                journey={
                                    journey
                                }
                                onClick={() =>
                                    onSelect(
                                        journey,
                                    )
                                }
                            />
                        ),
                    )}
                </div>
            )}

            <NewJourneyButton
                onClick={onNew}
            />
        </div>
    );
}

function JourneyItem({
    journey,
    onClick,
}: {
    journey: JourneySummary;
    onClick: () => void;
}) {
    const isArchived =
        journey.status ===
        "ARCHIVED";

    const isCompleted =
        journey.status ===
        "COMPLETED";

    return (
        <button
            type="button"
            onClick={onClick}
            className="group flex w-full items-center gap-4 rounded-[22px] border border-[#123c35]/8 bg-[#fbfaf5] p-4 text-left transition hover:-translate-y-0.5 hover:border-[#123c35]/15 hover:bg-white hover:shadow-[0_10px_30px_rgba(18,60,53,0.08)]"
        >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-[#e8f58d]/70 text-[#123c35]">
                {isArchived ? (
                    <Archive className="h-4 w-4" />
                ) : (
                    <Route className="h-4 w-4" />
                )}
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <p className="truncate text-xs font-black text-[#123c35]">
                        {journey.name}
                    </p>

                    {isCompleted && (
                        <span className="shrink-0 rounded-full bg-[#123c35]/6 px-2 py-0.5 text-[7px] font-black uppercase tracking-[0.1em] text-[#75817c]">
                            Saved
                        </span>
                    )}

                    {isArchived && (
                        <span className="shrink-0 rounded-full bg-[#ef713d]/10 px-2 py-0.5 text-[7px] font-black uppercase tracking-[0.1em] text-[#b65a37]">
                            Archived
                        </span>
                    )}
                </div>

                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-bold text-[#87918d]">
                    <span>
                        {journey.sourceCount}{" "}
                        source
                        {journey.sourceCount ===
                        1
                            ? ""
                            : "s"}
                    </span>

                    <span>
                        {journey.placeCount}{" "}
                        place
                        {journey.placeCount ===
                        1
                            ? ""
                            : "s"}
                    </span>

                    <span className="inline-flex items-center gap-1">
                        <Wallet className="h-3 w-3" />

                        ₹
                        {journey.totalKnownSpendInr.toLocaleString(
                            "en-IN",
                        )}
                    </span>
                </div>
            </div>

            <ChevronRight className="h-4 w-4 shrink-0 text-[#a0aaa6] transition-transform group-hover:translate-x-0.5" />
        </button>
    );
}

function NewJourneyButton({
    onClick,
}: {
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center justify-center gap-2 rounded-[20px] border border-dashed border-[#ef713d]/35 bg-[#fff8f4] px-4 py-3.5 text-[10px] font-black text-[#b65a37] transition hover:bg-[#fff1e9]"
        >
            <Plus className="h-3.5 w-3.5" />
            Start a new journey
        </button>
    );
}