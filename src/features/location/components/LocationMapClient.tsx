"use client";

import dynamic from "next/dynamic";

import type { UserLocation } from "../types";

export interface LocationMapDestination {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
}

interface LocationMapClientProps {
    location?: UserLocation;
    destinations?: LocationMapDestination[];
}

const LocationMap = dynamic(
    () => import("./LocationMap"),
    {
        ssr: false,
        loading: () => (
            <div className="flex h-full min-h-[290px] w-full items-center justify-center bg-[#d7e6df]">
                <div className="text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#123c35]/20 border-t-[#ef713d]" />

                    <p className="mt-3 text-xs font-bold text-[#6d7974]">
                        Loading map...
                    </p>
                </div>
            </div>
        ),
    },
);

export default function LocationMapClient({
    location,
    destinations = [],
}: LocationMapClientProps) {
    return (
        <LocationMap
            location={location}
            destinations={destinations}
        />
    );
}