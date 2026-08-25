"use client";

import { Binoculars, Send,} from "lucide-react";
import { useRouter } from "next/navigation";
import JourneyOption from "./JourneyOption";

export default function JourneySelector() {
    const router = useRouter();

    return (
        <section className="mt-5">
            <div className="grid gap-4 md:grid-cols-2">
                <JourneyOption type="nearby" icon={Binoculars} title="Explore Nearby" description="Find local places, food, attractions & fair prices around you." onClick={() => router.push("/explore")} />

                <JourneyOption type="destination" icon={Send} title="I Know My Destination" description="Compare routes, prices & travel options before you go." onClick={() => router.push("/travel")} />
            </div>
        </section>
    );
}