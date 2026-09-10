import {
    Suspense,
} from "react";

import {
    MapPin,
} from "lucide-react";

import FoodRecommendationsContent from "./FoodRecommendationsContent";

function RecommendationsLoading() {
    return (
        <div className="rounded-[28px] border border-[#123c35]/10 bg-white p-8">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-full bg-[#e8f58d]" />

                <div className="flex-1">
                    <div className="h-3 w-32 animate-pulse rounded bg-[#f0ede5]" />

                    <div className="mt-2 h-2.5 w-56 animate-pulse rounded bg-[#f0ede5]" />
                </div>
            </div>

            <div className="mt-6 h-4 w-48 animate-pulse rounded bg-[#f0ede5]" />

            <div className="mt-3 h-3 w-80 max-w-full animate-pulse rounded bg-[#f0ede5]" />

            <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="h-72 animate-pulse rounded-[24px] bg-[#f7f3ea]" />
                <div className="h-72 animate-pulse rounded-[24px] bg-[#f7f3ea]" />
            </div>
        </div>
    );
}

export default function FoodRecommendationsPage() {
    return (
        <main className="min-h-screen bg-[#f7f3ea] px-4 py-8 text-[#123c35] sm:px-6">
            <div className="mx-auto max-w-6xl">

                {/* -------------------------------------------------
                    HEADER
                ------------------------------------------------- */}

                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-[#31544d] shadow-sm">
                        <MapPin className="h-3.5 w-3.5" />
                        Real nearby food
                    </div>

                    <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                        Find food worth eating.
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6d7974]">
                        FairTrip combines what you
                        scanned with your situation,
                        budget and location to find
                        useful food options nearby.
                    </p>
                </div>

                {/* -------------------------------------------------
                    CLIENT CONTENT
                ------------------------------------------------- */}

                <Suspense
                    fallback={
                        <RecommendationsLoading />
                    }
                >
                    <FoodRecommendationsContent />
                </Suspense>
            </div>
        </main>
    );
} 