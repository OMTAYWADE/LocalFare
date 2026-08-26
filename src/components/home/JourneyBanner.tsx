"use client";

import {
    ArrowUpRight,
    Binoculars,
    MapPin,
    Navigation,
    Send,
    Sparkles,
} from "lucide-react";

interface JourneyBannerProps {
    location?: string;
    onNearby?: () => void;
    onDestination?: () => void;
}

export default function JourneyBanner({
    location = "Mumbai, Maharashtra",
    onNearby,
    onDestination,
}: JourneyBannerProps) {
    return (
        <section className="relative isolate overflow-hidden rounded-[32px] border border-[#123c35]/10 bg-[#ccecf3] shadow-[0_24px_70px_rgba(18,60,53,0.08)] sm:rounded-[38px]">
            {/* Image */}
            <img
                src="/images/fairtrip-journey-scene.png"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full min-h-[560px] w-full object-cover object-[68%_center] sm:min-h-[610px]"
            />

            {/* Desktop readability overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#ccecf3] via-[#ccecf3]/90 to-[#ccecf3]/10" />

            {/* Bottom readability */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#123c35]/25 to-transparent lg:hidden" />

            <div className="relative z-10 flex min-h-[560px] flex-col justify-between p-5 sm:min-h-[610px] sm:p-8 lg:p-10">
                {/* Eyebrow */}
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#123c35]/10 bg-white/75 px-3 py-1.5 backdrop-blur-md">
                        <Sparkles className="h-3.5 w-3.5 text-[#ef713d]" />

                        <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#123c35]">
                            Your journey starts here
                        </span>
                    </div>

                    <div className="mt-5 max-w-[470px]">
                        <p className="text-sm font-semibold text-[#245d78]">
                            Good to see you.
                        </p>

                        <h1 className="mt-2 text-4xl font-black leading-[0.94] tracking-[-0.06em] text-[#123c35] sm:text-6xl">
                            Where shall
                            <br />
                            we{" "}
                            <span className="handwritten text-[#ef713d]">
                                take you?
                            </span>
                        </h1>

                        <p className="mt-5 max-w-[390px] text-sm leading-6 text-[#31544d]/80">
                            Discover places around you or
                            build a complete journey to a
                            destination you already have in mind.
                        </p>
                    </div>
                </div>

                {/* Bottom actions */}
                <div className="mt-10 max-w-[780px]">
                    {/* Location */}
                    <div className="mb-4 flex w-full max-w-[420px] items-center gap-3 rounded-[20px] border border-white/50 bg-white/80 px-4 py-3 shadow-[0_12px_35px_rgba(18,60,53,0.1)] backdrop-blur-xl">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8f58d] text-[#123c35]">
                            <MapPin className="h-3.5 w-3.5" />
                        </span>

                        <div className="min-w-0">
                            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#6d7974]">
                                Starting from
                            </p>

                            <p className="truncate text-sm font-black text-[#123c35]">
                                {location}
                            </p>
                        </div>

                        <span className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#123c35] text-[#e8f58d]">
                            <Navigation className="h-3 w-3" />
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="grid gap-3 sm:grid-cols-2">
                        <button
                            type="button"
                            onClick={onNearby}
                            className="group flex min-h-[88px] items-center gap-4 rounded-[24px] bg-[#123c35] p-5 text-left text-white transition duration-200 hover:-translate-y-1 hover:bg-[#0d312b] focus:outline-none focus:ring-2 focus:ring-[#123c35] focus:ring-offset-2"
                        >
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#e8f58d] text-[#123c35]">
                                <Binoculars className="h-6 w-6" />
                            </span>

                            <span className="min-w-0 flex-1">
                                <strong className="block text-sm font-black">
                                    Explore Nearby
                                </strong>

                                <span className="mt-1 block text-xs leading-5 text-white/55">
                                    Discover places, food and
                                    attractions around you.
                                </span>
                            </span>

                            <ArrowUpRight className="h-5 w-5 shrink-0 text-[#e8f58d] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </button>

                        <button
                            type="button"
                            onClick={onDestination}
                            className="group flex min-h-[88px] items-center gap-4 rounded-[24px] border border-[#123c35]/10 bg-white/90 p-5 text-left text-[#123c35] shadow-sm backdrop-blur transition duration-200 hover:-translate-y-1 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#123c35] focus:ring-offset-2"
                        >
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#f8d4c1] text-[#ef713d]">
                                <Send className="h-5 w-5" />
                            </span>

                            <span className="min-w-0 flex-1">
                                <strong className="block text-sm font-black">
                                    I Know My Destination
                                </strong>

                                <span className="mt-1 block text-xs leading-5 text-[#6d7974]">
                                    Compare routes, costs and
                                    travel options.
                                </span>
                            </span>

                            <ArrowUpRight className="h-5 w-5 shrink-0 text-[#ef713d] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}