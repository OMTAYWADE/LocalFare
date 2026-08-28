"use client";

import { useRouter } from "next/navigation";

import AppHeader from "@/components/layout/AppHeader";
import PageContainer from "@/components/layout/PageContainer";
import JourneyBanner from "@/components/home/JourneyBanner";

export default function Home() {
    const router = useRouter();

    return (
        <main className="min-h-screen overflow-x-hidden bg-[#f7f3ea]">
            <PageContainer>
                <AppHeader />

                <JourneyBanner
                    onNearby={() => router.push("/explore")}
                    onDestination={() => router.push("/travel")}
                    onLocalFare={() => router.push("/food")}
                />

                <footer className="px-2 py-10 text-center">
                    <p className="text-xs font-medium text-[#6d7974]">
                        FairTrip · Travel smarter. Pay fairly.
                    </p>
                </footer>
            </PageContainer>
        </main>
    );
}