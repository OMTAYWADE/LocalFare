import { Suspense } from "react";

import TravelPlanContent from "./TravelPlanContent";

export default function TravelPlanPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7f3ea] p-10">
          Loading your trip...
        </div>
      }
    >
      <TravelPlanContent />
    </Suspense>
  );
}