import { Suspense } from "react";

import TravelPlanContent from "./TravelPlanContent";

export default function TravelPlanPage() {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen bg-[#f7f3ea]">
                    <div className="mx-auto max-w-5xl px-5 py-20">
                        <div className="h-8 w-48 animate-pulse rounded-lg bg-white" />

                        <div className="mt-6 h-32 animate-pulse rounded-[28px] bg-white" />
                    </div>
                </main>
            }
        >
            <TravelPlanContent />
        </Suspense>
    );
}