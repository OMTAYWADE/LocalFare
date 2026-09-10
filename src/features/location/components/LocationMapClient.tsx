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

function MapLoading() {
    return (
        <div
            className="
                flex
                h-full
                min-h-[320px]
                w-full
                items-center
                justify-center
                overflow-hidden
                rounded-[28px]
                bg-[#dfeae5]
                sm:min-h-[380px]
                lg:min-h-[440px]
            "
            role="status"
            aria-live="polite"
            aria-label="Loading map"
        >
            {/* Decorative map-like background */}
            <div
                aria-hidden="true"
                className="
                    absolute
                    inset-0
                    overflow-hidden
                    rounded-[28px]
                    opacity-70
                "
            >
                <div
                    className="
                        absolute
                        -left-16
                        top-10
                        h-44
                        w-44
                        rounded-full
                        bg-[#e8f58d]/40
                        blur-3xl
                    "
                />

                <div
                    className="
                        absolute
                        -right-10
                        bottom-0
                        h-52
                        w-52
                        rounded-full
                        bg-[#8ccfc0]/30
                        blur-3xl
                    "
                />

                <div
                    className="
                        absolute
                        left-[12%]
                        top-[34%]
                        h-px
                        w-[80%]
                        rotate-[8deg]
                        bg-white/70
                    "
                />

                <div
                    className="
                        absolute
                        left-[22%]
                        top-[58%]
                        h-px
                        w-[65%]
                        rotate-[-12deg]
                        bg-white/55
                    "
                />

                <div
                    className="
                        absolute
                        left-[48%]
                        top-[8%]
                        h-[88%]
                        w-px
                        rotate-[18deg]
                        bg-white/45
                    "
                />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
                <div
                    className="
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-full
                        bg-[#123c35]
                        shadow-[0_10px_30px_rgba(18,60,53,0.15)]
                    "
                >
                    <div
                        className="
                            h-6
                            w-6
                            animate-spin
                            rounded-full
                            border-2
                            border-white/20
                            border-t-[#e8f58d]
                        "
                    />
                </div>

                <p
                    className="
                        mt-4
                        text-sm
                        font-black
                        text-[#123c35]
                    "
                >
                    Loading your map
                </p>

                <p
                    className="
                        mt-1.5
                        max-w-xs
                        px-4
                        text-[10px]
                        leading-5
                        text-[#6d7974]
                    "
                >
                    Preparing nearby destinations and your
                    starting point.
                </p>
            </div>
        </div>
    );
}

const LocationMap = dynamic(
    () => import("./LocationMap"),
    {
        ssr: false,

        loading: () => (
            <MapLoading />
        ),
    },
);

export default function LocationMapClient({
    location,
    destinations = [],
}: LocationMapClientProps) {
    return (
        <section
            className="
                relative
                h-full
                min-h-[320px]
                w-full
                overflow-hidden
                rounded-[28px]
                bg-[#dfeae5]
                sm:min-h-[380px]
                lg:min-h-[440px]
            "
            aria-label="Nearby places map"
        >
            <LocationMap
                location={location}
                destinations={destinations}
            />

            {/* MAP STATUS */}
            <div
                className="
                    pointer-events-none
                    absolute
                    left-3
                    top-3
                    z-10
                    flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-white/70
                    bg-white/90
                    px-3
                    py-2
                    text-[9px]
                    font-black
                    text-[#123c35]
                    shadow-[0_6px_20px_rgba(18,60,53,0.10)]
                    backdrop-blur-md
                    sm:left-4
                    sm:top-4
                "
            >
                <span
                    className="
                        h-2
                        w-2
                        rounded-full
                        bg-[#5c9b72]
                        shadow-[0_0_0_4px_rgba(92,155,114,0.12)]
                    "
                />

                {destinations.length > 0
                    ? `${destinations.length} nearby places`
                    : "Nearby map"}
            </div>

            {/* LOCATION STATUS */}
            {location && (
                <div
                    className="
                        pointer-events-none
                        absolute
                        bottom-3
                        left-3
                        z-10
                        rounded-full
                        border
                        border-white/60
                        bg-[#123c35]/90
                        px-3
                        py-2
                        text-[9px]
                        font-black
                        text-white
                        shadow-lg
                        backdrop-blur-md
                        sm:bottom-4
                        sm:left-4
                    "
                >
                    Your location
                </div>
            )}
        </section>
    );
}