"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    Clock3,
    Compass,
    MapPin,
    Sparkles,
    Wallet,
} from "lucide-react";

const interests = [
    "Attractions",
    "Nature",
    "Food",
    "History",
    "Shopping",
    "Relaxing",
];

const times = [
    "2 hours",
    "4 hours",
    "Half day",
    "Full day",
];

export default function SmartTravelPage() {
    const router = useRouter();

    const [budget, setBudget] = useState("1000");
    const [interest, setInterest] = useState("Attractions");
    const [time, setTime] = useState("4 hours");

    const handleFind = () => {
        const params = new URLSearchParams({
            mode: "smart",
            budget,
            interest,
            time,
        });

        router.push(`/explore?${params.toString()}`);
    };

    return (
        <main className="min-h-screen bg-[#f7f3ea]">

            <div className="mx-auto max-w-6xl px-5 sm:px-8">

                {/* HEADER */}
                <div className="pt-6">
                    <button
                        type="button"
                        onClick={() => router.push("/travel")}
                        className="flex items-center gap-2 text-xs font-bold text-[#6d7974] hover:text-[#123c35]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to travel
                    </button>
                </div>

                {/* HERO */}
                <section className="grid gap-10 pb-24 pt-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">

                    <div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#123c35] text-[#e8f58d]">
                            <Compass className="h-6 w-6" />
                        </div>

                        <p className="mt-6 text-[9px] font-black uppercase tracking-[0.2em] text-[#ef713d]">
                            Smart recommendations
                        </p>

                        <h1 className="mt-2 text-4xl font-black leading-[0.95] tracking-[-0.06em] text-[#123c35] sm:text-6xl">
                            Let FairTrip
                            <br />
                            choose better.
                        </h1>

                        <p className="mt-5 max-w-lg text-sm leading-6 text-[#6d7974] sm:text-base">
                            Tell us what matters to you.
                            We'll rank nearby places using distance,
                            budget, time and your travel preferences.
                        </p>

                        <div className="mt-8 grid grid-cols-2 gap-3">

                            <SmartFeature
                                icon={MapPin}
                                title="Nearest"
                                text="Distance matters."
                            />

                            <SmartFeature
                                icon={Wallet}
                                title="Fair price"
                                text="Stay within budget."
                            />

                            <SmartFeature
                                icon={Clock3}
                                title="Time fit"
                                text="Works with your day."
                            />

                            <SmartFeature
                                icon={Sparkles}
                                title="Smart score"
                                text="Best matches first."
                            />

                        </div>
                    </div>

                    {/* FORM CARD */}
                    <div className="rounded-[32px] border border-[#123c35]/10 bg-white p-5 shadow-[0_25px_80px_rgba(18,60,53,0.07)] sm:p-8">

                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#ef713d]">
                            Your preferences
                        </p>

                        <h2 className="mt-1 text-2xl font-black tracking-[-0.04em] text-[#123c35]">
                            What are you looking for?
                        </h2>

                        {/* LOCATION */}
                        <div className="mt-7">

                            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-[#6d7974]">
                                Starting location
                            </label>

                            <div className="mt-2 flex h-14 items-center gap-3 rounded-2xl border border-[#123c35]/10 bg-[#fffdf8] px-4">
                                <MapPin className="h-5 w-5 text-[#123c35]" />

                                <span className="text-sm font-bold text-[#123c35]">
                                    Current location
                                </span>

                                <span className="ml-auto rounded-full bg-[#e8f58d] px-2 py-1 text-[9px] font-black">
                                    GPS
                                </span>
                            </div>
                        </div>

                        {/* BUDGET */}
                        <div className="mt-6">

                            <label
                                htmlFor="smart-budget"
                                className="text-[10px] font-black uppercase tracking-[0.15em] text-[#6d7974]"
                            >
                                Your budget
                            </label>

                            <div className="mt-2 flex h-14 items-center rounded-2xl border border-[#123c35]/10 bg-[#fffdf8] px-4">

                                <span className="text-xl font-black text-[#123c35]">
                                    ₹
                                </span>

                                <input
                                    id="smart-budget"
                                    type="number"
                                    min="0"
                                    value={budget}
                                    onChange={(event) =>
                                        setBudget(
                                            event.target.value,
                                        )
                                    }
                                    className="ml-2 w-full bg-transparent text-lg font-black text-[#123c35] outline-none"
                                />

                            </div>
                        </div>

                        {/* INTEREST */}
                        <div className="mt-6">

                            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#6d7974]">
                                What sounds good?
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                                {interests.map((item) => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() =>
                                            setInterest(item)
                                        }
                                        className={`rounded-full px-4 py-2.5 text-xs font-black ${
                                            interest === item
                                                ? "bg-[#123c35] text-white"
                                                : "border border-[#123c35]/10 bg-white text-[#31544d]"
                                        }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* TIME */}
                        <div className="mt-6">

                            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#6d7974]">
                                How much time do you have?
                            </p>

                            <div className="mt-3 grid grid-cols-2 gap-2">

                                {times.map((item) => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() =>
                                            setTime(item)
                                        }
                                        className={`rounded-xl px-3 py-3 text-xs font-black ${
                                            time === item
                                                ? "bg-[#e8f58d] text-[#123c35]"
                                                : "border border-[#123c35]/10 bg-white text-[#6d7974]"
                                        }`}
                                    >
                                        {item}
                                    </button>
                                ))}

                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleFind}
                            className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#123c35] text-sm font-black text-white transition hover:bg-[#0d312b]"
                        >
                            <Sparkles className="h-4 w-4 text-[#e8f58d]" />
                            Find my best places
                            <ArrowRight className="h-4 w-4 text-[#e8f58d]" />
                        </button>

                    </div>

                </section>
            </div>
        </main>
    );
}

function SmartFeature({
    icon: Icon,
    title,
    text,
}: {
    icon: typeof MapPin;
    title: string;
    text: string;
}) {
    return (
        <div className="rounded-[20px] border border-[#123c35]/8 bg-white p-4">
            <Icon className="h-4 w-4 text-[#ef713d]" />

            <p className="mt-3 text-xs font-black text-[#123c35]">
                {title}
            </p>

            <p className="mt-1 text-[11px] text-[#6d7974]">
                {text}
            </p>
        </div>
    );
}