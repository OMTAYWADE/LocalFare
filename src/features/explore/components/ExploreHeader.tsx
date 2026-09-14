"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import {
    ArrowDownRight,
    MapPin,
    ShieldCheck,
    Sparkles,
    WalletCards,
} from "lucide-react";

export default function ExploreHeader() {
    const headerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const header = headerRef.current;
        if (!header) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            tl.fromTo(
                "[data-header-badge]",
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
            )
            .fromTo(
                "[data-header-title]",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
                "-=0.18",
            )
            .fromTo(
                "[data-header-copy]",
                { opacity: 0, y: 14 },
                { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
                "-=0.3",
            )
            .fromTo(
                "[data-header-pill]",
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power3.out" },
                "-=0.2",
            );
        }, header);

        return () => ctx.revert();
    }, []);

    return (
        <header
            ref={headerRef}
            className="
                relative
                isolate
                overflow-hidden
                min-h-[430px]
                rounded-[24px]
                border
                border-[#123c35]/10
                bg-gradient-to-br
                from-[#dff1d7]
                via-[#eef1c5]
                to-[#f7d4b5]
                px-4
                py-6
                shadow-[0_24px_70px_rgba(18,60,53,0.08)]
                sm:min-h-[455px]
                sm:rounded-[32px]
                sm:px-7
                sm:py-9
                lg:min-h-[470px]
                lg:px-10
                lg:py-10
                xl:px-12
            "
        >
            {/* =====================================================
                DECORATIVE BACKGROUND
            ====================================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    overflow-hidden
                "
            >
                {/* large gradient glow */}

                <div
                    className="
                        absolute
                        -right-24
                        -top-24
                        h-64
                        w-64
                        rounded-full
                        bg-[#cbe95b]/45
                        blur-3xl
                        sm:h-80
                        sm:w-80
                    "
                />

                <div
                    className="
                        absolute
                        -bottom-32
                        right-[18%]
                        h-72
                        w-72
                        rounded-full
                        bg-[#8ccfc0]/30
                        blur-3xl
                    "
                />

                {/* sun */}

                <div
                    className="
                        absolute
                        right-[12%]
                        top-10
                        h-14
                        w-14
                        rounded-full
                        bg-[#f5b84b]/80
                        shadow-[0_0_60px_rgba(245,184,75,0.35)]
                        sm:right-[18%]
                        sm:h-20
                        sm:w-20
                    "
                />

                {/* hills */}

                <div
                    className="
                        absolute
                        -bottom-8
                        right-[-8%]
                        h-28
                        w-[65%]
                        rotate-[-4deg]
                        rounded-[50%_50%_0_0]
                        bg-[#76a878]/35
                        sm:h-40
                    "
                />

                <div
                    className="
                        absolute
                        -bottom-12
                        right-[4%]
                        h-24
                        w-[52%]
                        rotate-[3deg]
                        rounded-[50%_50%_0_0]
                        bg-[#39745e]/45
                        sm:h-32
                    "
                />

                {/* road */}

                <div
                    className="
                        absolute
                        bottom-0
                        right-[20%]
                        h-2
                        w-36
                        rotate-[-7deg]
                        rounded-full
                        bg-[#f5d69b]/80
                        sm:w-48
                    "
                />

                <div
                    className="
                        absolute
                        bottom-7
                        right-[12%]
                        h-1.5
                        w-20
                        rotate-[5deg]
                        rounded-full
                        bg-[#f5d69b]/60
                        sm:w-28
                    "
                />
            </div>

            {/* =====================================================
                CONTENT
            ====================================================== */}

            <div
                className="
                    relative
                    z-10
                    w-full
                    max-w-[760px]
                "
            >
                {/* Badge */}

                <div
                    data-header-badge
                    className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-[#06483f]/10
                        bg-[#06483f]
                        px-3
                        py-1.5
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.16em]
                        text-[#e8f58d]
                        shadow-sm
                    "
                >
                    <Sparkles
                        className="h-3 w-3"
                        strokeWidth={2.5}
                    />

                    Smart local discovery
                </div>

                {/* Heading */}

                <h1
                    data-header-title
                    className="
                        mt-4
                        max-w-[660px]
                        text-[2rem]
                        sm:text-[2.9rem]
                        font-black
                        leading-[0.96]
                        tracking-[-0.065em]
                        text-[#073f37]
                        lg:text-[3.8rem]
                    "
                >
                    Find what is worth
                    <br />

                    <span className="text-[#ed6b31]">
                        exploring nearby.
                    </span>
                </h1>

                {/* Description */}

                <p
                    data-header-copy
                    className="
                        mt-4
                        max-w-[540px]
                        text-sm
                        leading-6
                        text-[#49625c]
                        sm:text-base
                    "
                >
                    Discover places around you with
                    distance, travel time, ratings and
                    estimated costs — so you can make
                    better local decisions.
                </p>

                {/* =================================================
                    TRUST POINTS
                ================================================== */}

                <div
                    data-header-pill
                    className="
                        mt-5
                        grid
                        grid-cols-1
                        gap-2
                        sm:grid-cols-2
                        lg:grid-cols-3
                    "
                >
                    <FeaturePill
                        icon={
                            <MapPin
                                className="h-3.5 w-3.5"
                            />
                        }
                        title="Nearby"
                        description="Real locations"
                    />

                    <FeaturePill
                        icon={
                            <WalletCards
                                className="h-3.5 w-3.5"
                            />
                        }
                        title="Budget aware"
                        description="Know your cost"
                    />

                    <FeaturePill
                        icon={
                            <ShieldCheck
                                className="h-3.5 w-3.5"
                            />
                        }
                        title="FairTrip"
                        description="Avoid bad deals"
                    />
                </div>

                {/* =================================================
                    BOTTOM HINT
                ================================================== */}

                <div
                    className="
                        mt-5
                        hidden
                        items-center
                        gap-2
                        sm:flex
                        text-[10px]
                        font-bold
                        text-[#49625c]
                    "
                >
                    <span
                        className="
                            flex
                            h-6
                            w-6
                            items-center
                            justify-center
                            rounded-full
                            bg-white/70
                        "
                    >
                        <ArrowDownRight
                            className="h-3 w-3"
                        />
                    </span>

                    Set your location and start exploring
                </div>
            </div>
        </header>
    );
}

/* ================================================================
   FEATURE PILL
================================================================ */

function FeaturePill({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div
            className="
                flex
                items-center
                gap-2.5
                rounded-[17px]
                border
                border-white/50
                bg-white/55
                px-3
                py-2.5
                backdrop-blur-md
                transition
                duration-200
                hover:-translate-y-0.5
                hover:bg-white/75
            "
        >
            <span
                className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#e8f58d]
                    text-[#123c35]
                "
            >
                {icon}
            </span>

            <span className="min-w-0">
                <span
                    className="
                        block
                        text-[10px]
                        font-black
                        text-[#123c35]
                    "
                >
                    {title}
                </span>

                <span
                    className="
                        mt-0.5
                        block
                        text-[9px]
                        text-[#667872]
                    "
                >
                    {description}
                </span>
            </span>
        </div>
    );
}