import { Suspense } from "react";

import AppHeader from "@/components/layout/AppHeader";
import PageContainer from "@/components/layout/PageContainer";
import FoodScanner from "@/features/food/components/FoodScanner";

function ScannerLoading() {
    return (
        <div className="mx-auto max-w-5xl px-1 py-12 sm:py-16">
            <div className="mx-auto max-w-2xl animate-pulse">
                <div className="mx-auto h-4 w-28 rounded-full bg-[#123c35]/10" />

                <div className="mx-auto mt-4 h-10 w-72 rounded-xl bg-[#123c35]/10" />

                <div className="mx-auto mt-3 h-4 w-full max-w-lg rounded-full bg-[#123c35]/10" />

                <div className="mt-8 h-[420px] rounded-[28px] bg-white shadow-sm sm:h-[500px]" />
            </div>
        </div>
    );
}

export default function FoodScanPage() {
    return (
        <main className="min-h-screen bg-[#f7f3ea]">
            <PageContainer>
                <AppHeader />

                <Suspense fallback={<ScannerLoading />}>
                    <FoodScanner />
                </Suspense>
            </PageContainer>
        </main>
    );
}