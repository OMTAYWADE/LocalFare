import {
    Suspense,
} from "react";

import {
    MapPin,
} from "lucide-react";

import FoodRecommendationPageClient from "./FoodRecommendationsContent";

export default function FoodRecommendationsPage() {
    return (
        <main className="min-h-screen bg-[#f7f3ea] px-4 py-8 text-[#123c35] sm:px-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-[#31544d]">
                        <MapPin className="h-3.5 w-3.5" />
                        Real nearby food
                    </div>

                    <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                        Find food worth eating.
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6d7974]">
                        FairTrip combines your
                        scanned food with real nearby
                        places and ranks the closest
                        matches for your current
                        situation.
                    </p>
                </div>

                <Suspense
                    fallback={
                        <div className="rounded-[28px] bg-white p-8">
                            Loading...
                        </div>
                    }
                >
                    <FoodRecommendationPageClient />
                </Suspense>
            </div>
        </main>
    );
}