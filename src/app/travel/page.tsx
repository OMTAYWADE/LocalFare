"use client";

import { useRouter } from "next/navigation";

import AppHeader from "@/components/layout/AppHeader";
import PageContainer from "@/components/layout/PageContainer";

import SourceDestination from "@/components/travel/SourceDestination";

export default function TravelPage() {
  const router = useRouter();

  const handleSearch = ( source: string, destination: string,) => {
    const params = new URLSearchParams({ source, destination,});

    router.push(`/travel/plan?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-[#f7f3ea]">
      <PageContainer>
        <AppHeader />

        <section className="mx-auto max-w-5xl pb-20 pt-10 sm:pt-16">
          <div className="max-w-3xl">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ef713d]">
              Plan your journey
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-[-0.055em] text-[#123c35] sm:text-6xl">
              Where are you
              <br />
              going?
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-6 text-[#6d7974] sm:text-base">
              Tell us where you're starting and where
              you want to go. We'll use the journey to
              estimate your total trip cost and build
              recommendations around your budget.
            </p>
          </div>

          <div className="mt-10">
            <SourceDestination onSearch={handleSearch}/>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {[
              "Gateway of India",
              "Marine Drive",
              "Colaba Causeway",
            ].map((place) => (
              <button key={place} type="button"
                className=" rounded-full border border-[#123c35]/10 bg-white px-4 py-2 text-xs font-bold text-[#31544d] transition hover:border-[#123c35]/20 hover:bg-[#e8f58d] "
              >
                {place}
              </button>
            ))}
          </div>
        </section>
      </PageContainer>
    </main>
  );
}