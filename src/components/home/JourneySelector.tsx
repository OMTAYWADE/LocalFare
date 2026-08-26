"use client";

import {
    Binoculars,
    Send,
} from "lucide-react";

import { useRouter } from "next/navigation";

import JourneyOption from "./JourneyOption";

export default function JourneySelector() {
    const router = useRouter();

    return (
        <section className="mt-8">
            <div className="mb-4">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#ef713d]">
                    Choose your way
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-[-0.045em] text-[#123c35]">
                    How do you want to travel?
                </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <JourneyOption
                    type="nearby"
                    icon={Binoculars}
                    title="Explore Nearby"
                    description="Find local places, food, attractions and fair options around your current location."
                    onClick={() =>
                        router.push("/explore")
                    }
                />

                <JourneyOption
                    type="destination"
                    icon={Send}
                    title="I Know My Destination"
                    description="Choose a destination and compare routes, costs and travel options before you leave."
                    onClick={() =>
                        router.push("/travel")
                    }
                />
            </div>
        </section>
    );
}