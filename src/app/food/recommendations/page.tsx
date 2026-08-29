import { Suspense } from "react";
import FoodRecommendationsContent from "./FoodRecommendationsContent";

function Loading() {
  return (
    <main className="min-h-screen bg-[#f7f3ea]">
      <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="h-10 w-24 animate-pulse rounded-full bg-white" />
          <div className="h-9 w-32 animate-pulse rounded-full bg-white" />
        </div>

        <div className="pt-8">
          <div className="h-4 w-48 animate-pulse rounded bg-white" />
          <div className="mt-4 h-20 w-full max-w-2xl animate-pulse rounded-2xl bg-white" />
          <div className="mt-4 h-12 w-full max-w-xl animate-pulse rounded-2xl bg-white" />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
          <div className="h-80 animate-pulse rounded-[28px] bg-white" />

          <div className="space-y-4">
            <div className="h-10 w-48 animate-pulse rounded-xl bg-white" />
            <div
              className="h-40 animate-pulse rounded-[28px] bg-white"
              style={{ animationDelay: "100ms" }}
            />
            <div
              className="h-40 animate-pulse rounded-[28px] bg-white"
              style={{ animationDelay: "200ms" }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function FoodRecommendationsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <FoodRecommendationsContent />
    </Suspense>
  );
}