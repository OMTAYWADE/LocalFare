import { Suspense } from "react";
import { Search } from "lucide-react";
import FoodSearchContent from "./FoodSearchContent";

function Loading() {
    return (
        <div className="rounded-[28px] bg-white p-8 text-center">
            <div className="mx-auto h-4 w-32 animate-pulse rounded bg-[#f7f3ea]" />
            <div className="mx-auto mt-4 h-40 max-w-2xl animate-pulse rounded-2xl bg-[#f7f3ea]" />
        </div>
    );
}

export default function FoodSearchPage() {
    return (
        <main className="min-h-screen bg-[#f7f3ea] px-4 py-8 text-[#123c35] sm:px-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-[#31544d]">
                        <Search className="h-3.5 w-3.5" />
                        Real nearby food
                    </div>

                    <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                        Search food near you.
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6d7974]">
                        FairTrip looks up real nearby places and ranks them for
                        what you searched.
                    </p>
                </div>

                <Suspense fallback={<Loading />}>
                    <FoodSearchContent />
                </Suspense>
            </div>
        </main>
    );
}