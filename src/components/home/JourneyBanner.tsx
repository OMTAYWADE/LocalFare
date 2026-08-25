import { ArrowUpRight, Binoculars, Send, } from "lucide-react";

interface JourneyBannerProps {
    onNearby?: () => void;
    onDestination?: () => void;
}

export default function JourneyBanner({ onNearby, onDestination, }: JourneyBannerProps) {
    return (
        <section className=" relative min-h-[470px] overflow-hidden rounded-[32px] bg-[#ccecf3] ">
            {/* Scenic image */}
            <img src="/images/fairtrip-journey-scene.png" alt="" aria-hidden="true" className=" absolute inset-0 h-full w-full object-cover object-right" />

            {/* left readability overlay */}
            <div className=" absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#ccecf3] via-[#ccecf3]/85 to-transparent lg:w-[65%] " />

            {/* Content */}
            <div className="relative z-10 flex min-h-[470px] flex-col justify-between p-7 sm:p-9 lg:p-10">
                <div className="max-w-[430px]">
                    <p className="text-sm font-medium text-[#245d78]">
                        Good to see you!
                    </p>

                    <h2 className=" mt-2 text-4xl font-black leading-[0.98] tracking-[-0.055em] text-[#123c35] sm:text-5xl ">
                        Where shall
                        <br />
                        we{" "}
                        <span className="handwritten text-[#ef713d]">
                            take you?
                        </span>
                    </h2>
                </div>

                <div className="mt-auto">
                    {/* location */}
                    <div className="mb-4 flex h-14 max-w-[390px] items-center justify-between rounded-full bg-white/90 px-5 shadow-lg backdrop-blur">
                        <div className="flex items-center gap-3">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e8f58d] text-[#123c35]">
                                <span className="h-2.5 w-2.5 rounded-full bg-[#123c35]" />
                            </span>

                            <span className="text-sm font-bold text-[#123c35]">
                                Mumbai, Maharashtra
                            </span>
                        </div>

                        <span className="text-[#123c35]">
                            ◎
                        </span>
                    </div>

                    {/* action buttons */}
                    <div className="grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={onNearby}
                            className=" flex min-h-[76px] items-center gap-4 rounded-[24px] bg-[#123c35] px-5 text-left text-white transition hover:-translate-y-0.5 hover:bg-[#0d312b]">
                            <Binoculars className="h-8 w-8 shrink-0 text-white" />

                            <span className="flex-1">
                                <strong className="block text-sm font-black">
                                    Explore Nearby
                                </strong>

                                <small className="mt-1 block text-xs text-white/55">
                                    Discover around you
                                </small>
                            </span>

                            <ArrowUpRight className="h-5 w-5 text-[#cbe95b]" />
                        </button>

                        <button type="button" onClick={onDestination}
                            className=" flex min-h-[76px] items-center gap-4 rounded-[24px] bg-[#123c35] px-5 text-left text-white transition hover:-translate-y-0.5 hover:bg-[#0d312b]">
                            <Send className="h-7 w-7 shrink-0 text-[#ef713d]" />

                            <span className="flex-1">
                                <strong className="block text-sm font-black">
                                    I Know My Destination
                                </strong>

                                <small className="mt-1 block text-xs text-white/55">
                                    Plan and compare
                                </small>
                            </span>

                            <ArrowUpRight className="h-5 w-5 text-[#ef713d]" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}