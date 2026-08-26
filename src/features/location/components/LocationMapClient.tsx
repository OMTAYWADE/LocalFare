"use client";

import dynamic from "next/dynamic";
import type { UserLocation,} from "../types";

interface LocationMapDestination {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface LocationMapClientProps {
  location?: UserLocation;
  destinations?: LocationMapDestination[];
}

const LocationMap = dynamic(() => import("./LocationMap"), {
    ssr: false,

    loading: () => (
      <div className="flex h-[360px] items-center justify-center rounded-[28px] bg-[#f7f3ea]">
        <p className="text-xs font-bold text-[#6d7974]">
          Loading map...
        </p>
      </div>
    ),
  },
);

export default function LocationMapClient({ location, destinations = [],}: LocationMapClientProps) {
  return (
    <LocationMap location={location} destinations={destinations} />
  );
}