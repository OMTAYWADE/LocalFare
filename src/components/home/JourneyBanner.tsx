"use client";

import {
    ArrowUpRight,
    Binoculars,
    Camera,
    MapPin,
    Navigation,
    ScanSearch,
    Send,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

interface JourneyBannerProps {
    location?: string;
    onNearby?: () => void;
    onDestination?: () => void;
    onLocalFare?: () => void;
}

interface JourneyCardProps {
    icon: React.ReactNode;
    eyebrow: string;
    title: string;
    description: string;
    className: string;
    iconClassName: string;
    arrowClassName: string;
    onClick?: () => void;
    image?: string;
}

function JourneyCard({
    icon,
    eyebrow,
    title,
    description,
    className,
    iconClassName,
    arrowClassName,
    onClick,
    image,
}: JourneyCardProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "group relative min-h-[180px] overflow-hidden rounded-[28px]",
                "border border-[#123c35]/10 text-left",
                "transition-all duration-500",
                "hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(18,60,53,0.14)]",
                "focus:outline-none focus:ring-2 focus:ring-[#123c35]/30",
                "active:scale-[0.99]",
                className,
            ].join(" ")}
        >
            {image && (
                <>
                    <img
                        src={image}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-cover opacity-20 transition duration-700 group-hover:scale-105 group-hover:opacity-25"
                    />

                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-[#123c35]/10" />
                </>
            )}

            {/* Decorative glow */}
            <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/20 blur-2xl transition duration-700 group-hover:scale-150" />

            <div className="relative z-10 flex h-full min-h-[180px] flex-col justify-between p-5 sm:p-6">
                <div>
                    <div className="flex items-start justify-between gap-3">
                        <span
                            className={[
                                "flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px]",
                                "transition duration-500 group-hover:scale-105",
                                iconClassName,
                            ].join(" ")}
                        >
                            {icon}
                        </span>

                        <span
                            className={[
                                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                                "transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1",
                                arrowClassName,
                            ].join(" ")}
                        >
                            <ArrowUpRight className="h-4 w-4" />
                        </span>
                    </div>

                    <p className="mt-5 text-[9px] font-black uppercase tracking-[0.2em] opacity-55">
                        {eyebrow}
                    </p>

                    <h2 className="mt-1.5 text-xl font-black tracking-[-0.04em] sm:text-2xl">
                        {title}
                    </h2>

                    <p className="mt-2 max-w-[340px] text-xs leading-5 opacity-70 sm:text-sm">
                        {description}
                    </p>
                </div>
            </div>
        </button>
    );
}

export default function JourneyBanner({
    location = "Your current location",
    onNearby,
    onDestination,
    onLocalFare,
}: JourneyBannerProps) {
    return (
        <section className="relative mt-3 overflow-hidden rounded-[32px] border border-[#123c35]/10 bg-[#f7f3ea] sm:mt-5 sm:rounded-[40px]">
            {/* Background decoration */}
            <div className="pointer-events-none absolute -left-32 -top-32 h-[360px] w-[360px] rounded-full bg-[#e8f58d]/50 blur-3xl" />

            <div className="pointer-events-none absolute -right-32 top-20 h-[320px] w-[320px] rounded-full bg-[#f5b79b]/25 blur-3xl" />

            {/* HERO */}
            <div className="relative grid min-h-[500px] lg:grid-cols-[1.05fr_0.95fr]">
                {/* LEFT */}
                <div className="relative z-10 flex flex-col justify-center px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
                    {/* Badge */}
                    <div className="animate-fade-up inline-flex w-fit items-center gap-2 rounded-full border border-[#123c35]/10 bg-white/75 px-3 py-2 shadow-sm backdrop-blur-xl">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#123c35] text-[#e8f58d]">
                            <Sparkles className="h-3 w-3" />
                        </span>

                        <span className="text-[9px] font-black uppercase tracking-[0.17em] text-[#123c35]">
                            Travel with confidence
                        </span>
                    </div>

                    {/* Heading */}
                    <div className="animate-fade-up animation-delay-100 mt-7 max-w-[600px]">
                        <p className="text-sm font-bold text-[#ef713d]">
                            Welcome to FairTrip
                        </p>

                        <h1 className="mt-2 text-[clamp(3rem,7vw,6rem)] font-black leading-[0.88] tracking-[-0.075em] text-[#123c35]">
                            Travel
                            <br />
                            <span className="relative inline-block">
                                smarter.
                                <span className="absolute -bottom-2 left-0 h-2 w-[70%] rounded-full bg-[#e8f58d] sm:h-3" />
                            </span>
                            <br />
                            <span className="font-serif italic text-[#ef713d]">
                                pay fairly.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-[480px] text-sm leading-6 text-[#52635e] sm:text-base sm:leading-7">
                            Discover places, plan your destination and
                            understand local food and travel prices before
                            you spend.
                        </p>
                    </div>

                    {/* LOCATION */}
                    <div className="animate-fade-up animation-delay-200 mt-8">
                        <div className="flex w-full max-w-[470px] items-center gap-3 rounded-[20px] border border-[#123c35]/10 bg-white/80 p-3 shadow-[0_16px_40px_rgba(18,60,53,0.08)] backdrop-blur-xl">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8f58d] text-[#123c35]">
                                <MapPin className="h-4 w-4" />
                            </span>

                            <div className="min-w-0 flex-1">
                                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-[#6d7974]">
                                    Starting from
                                </p>

                                <p className="mt-0.5 truncate text-sm font-black text-[#123c35]">
                                    {location}
                                </p>
                            </div>

                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#123c35] text-[#e8f58d]">
                                <Navigation className="h-3.5 w-3.5" />
                            </span>
                        </div>
                    </div>
                </div>

                {/* RIGHT IMAGE */}
                <div className="relative hidden min-h-[500px] overflow-hidden lg:block">
                    <img
                        src="/images/fairtrip-journey-scene.png"
                        alt="Travel destination"
                        className="absolute inset-0 h-full w-full object-cover object-center"
                    />

                    <div className="absolute inset-0 bg-gradient-to-r from-[#f7f3ea] via-[#f7f3ea]/20 to-transparent" />

                    {/* Floating trust card */}
                    <div className="animate-float absolute bottom-10 right-8 max-w-[240px] rounded-[22px] border border-white/40 bg-[#123c35]/90 p-4 text-white shadow-[0_20px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                        <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8f58d] text-[#123c35]">
                                <ShieldCheck className="h-4 w-4" />
                            </span>

                            <div>
                                <p className="text-xs font-black">
                                    Know before you pay
                                </p>

                                <p className="mt-0.5 text-[10px] leading-4 text-white/55">
                                    Compare local prices with confidence.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* JOURNEY SELECTOR */}
            <div className="relative z-20 border-t border-[#123c35]/10 bg-white/45 p-4 backdrop-blur-xl sm:p-6 lg:p-8">
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#ef713d]">
                            Start here
                        </p>

                        <h2 className="mt-1 text-xl font-black tracking-[-0.04em] text-[#123c35] sm:text-2xl">
                            What are you looking for?
                        </h2>
                    </div>

                    <p className="max-w-[360px] text-xs leading-5 text-[#6d7974] sm:text-right">
                        Choose what you need and FairTrip will take you to the
                        right tool.
                    </p>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                    {/* EXPLORE */}
                    <JourneyCard
                        icon={<Binoculars className="h-5 w-5" />}
                        eyebrow="Discover around you"
                        title="Explore Nearby"
                        description="Find attractions, food and useful places around your current location."
                        className="bg-[#e8f58d] text-[#123c35]"
                        iconClassName="bg-[#123c35] text-[#e8f58d]"
                        arrowClassName="bg-[#cbe95b] text-[#123c35]"
                        image="/images/fairtrip-journey-scene.png"
                        onClick={onNearby}
                    />

                    {/* DESTINATION */}
                    <JourneyCard
                        icon={<Send className="h-5 w-5" />}
                        eyebrow="Plan before you go"
                        title="I Know My Destination"
                        description="Choose a destination and compare routes, travel costs and options."
                        className="bg-[#f8d4c1] text-[#123c35]"
                        iconClassName="bg-[#ef713d] text-white"
                        arrowClassName="bg-white/70 text-[#ef713d]"
                        onClick={onDestination}
                    />

                    {/* LOCALFARE */}
                    <JourneyCard
                        icon={<ScanSearch className="h-5 w-5" />}
                        eyebrow="Check before you pay"
                        title="Food & LocalFare"
                        description="Check food prices and compare local fare signals to avoid overpaying."
                        className="bg-[#123c35] text-white"
                        iconClassName="bg-[#e8f58d] text-[#123c35]"
                        arrowClassName="bg-white/10 text-[#e8f58d]"
                        onClick={onLocalFare}
                    />
                </div>

                {/* TRUST MESSAGE */}
                <div className="mt-4 flex flex-col gap-3 rounded-[20px] border border-[#123c35]/10 bg-[#f7f3ea]/80 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dcefe5] text-[#123c35]">
                            <ShieldCheck className="h-4 w-4" />
                        </span>

                        <div>
                            <p className="text-xs font-black text-[#123c35]">
                                Built to make local travel more transparent
                            </p>

                            <p className="mt-0.5 text-[10px] text-[#6d7974]">
                                Places · Food · Routes · Local prices
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] text-[#6d7974]">
                        <Camera className="h-3.5 w-3.5" />
                        Scan & compare
                    </div>
                </div>
            </div>
        </section>
    );
}