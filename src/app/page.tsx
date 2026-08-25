"use client";

import { useRouter } from "next/navigation";

import AppHeader from "@/components/layout/AppHeader";
import PageContainer from "@/components/layout/PageContainer";

import HomeHero from "@/components/home/HomeHero";
import JourneySelector from "@/components/home/JourneySelector";
import TrustStrip from "@/components/home/TrustStrip";
import JourneyBanner from "@/components/home/JourneyBanner";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#f7f3ea]">
      <PageContainer>
        <AppHeader />

        <HomeHero />

        <JourneySelector />

        <TrustStrip />

        <JourneyBanner
          onNearby={() => router.push("/explore")}
          onDestination={() => router.push("/travel")}
        />

        <footer className="px-2 py-8 text-center">
          <p className="text-xs text-[#6d7974]">
            FairTrip · Travel smarter. Pay fairly.
          </p>
        </footer>
      </PageContainer>
    </main>
  );
}