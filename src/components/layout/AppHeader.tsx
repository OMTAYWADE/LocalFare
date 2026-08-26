"use client";

import {
    Compass,
    Menu,
    UserRound,
    X,
    Utensils,
    Map,
    Heart,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface NavItem {
    label: string;
    href: string;
    icon: typeof Compass;
}

const navItems: NavItem[] = [
    {
        label: "Explore",
        href: "/explore",
        icon: Compass,
    },
    {
        label: "Food",
        href: "/food",
        icon: Utensils,
    },
    {
        label: "My trips",
        href: "/trips",
        icon: Map,
    },
];

export default function AppHeader() {
    const router = useRouter();
    const pathname = usePathname();

    const [mobileOpen, setMobileOpen] =
        useState(false);

    const isActive = (href: string) => {
        if (href === "/explore") {
            return pathname.startsWith("/explore");
        }

        if (href === "/food") {
            return pathname.startsWith("/food");
        }

        if (href === "/trips") {
            return pathname.startsWith("/trips");
        }

        return pathname === href;
    };

    const navigate = (href: string) => {
        setMobileOpen(false);
        router.push(href);
    };

    return (
        <>
            <header className="relative z-50 flex h-[72px] items-center justify-between">

                {/* =====================================================
                    LOGO
                ===================================================== */}

                <button
                    type="button"
                    onClick={() => navigate("/")}
                    aria-label="FairTrip home"
                    className="group flex items-center gap-2.5"
                >
                    {/* Brand mark */}

                    <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#123c35] shadow-[0_6px_18px_rgba(18,60,53,0.12)] transition duration-200 group-hover:-rotate-3 group-hover:scale-105">

                        <Compass className="h-[17px] w-[17px] text-[#e8f58d]" />

                    </span>

                    {/* Wordmark */}

                    <span className="text-[18px] font-black tracking-[-0.055em] text-[#123c35] sm:text-[19px]">
                        FAIRTRIP
                    </span>
                </button>


                {/* =====================================================
                    DESKTOP NAVIGATION
                ===================================================== */}

                <div className="hidden items-center gap-2 md:flex">

                    {/* Main navigation pill */}

                    <nav className="flex items-center rounded-full border border-[#123c35]/10 bg-white/75 p-1 shadow-[0_8px_30px_rgba(18,60,53,0.05)] backdrop-blur">

                        {navItems.map((item) => {
                            const active = isActive(
                                item.href,
                            );

                            return (
                                <button
                                    key={item.href}
                                    type="button"
                                    onClick={() =>
                                        navigate(item.href)
                                    }
                                    className={[
                                        "relative flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 lg:px-5",
                                        active
                                            ? "bg-[#123c35] text-white shadow-sm"
                                            : "text-[#31544d] hover:bg-[#f7f3ea]",
                                    ].join(" ")}
                                >

                                    <item.icon
                                        className={[
                                            "h-3.5 w-3.5",
                                            active
                                                ? "text-[#e8f58d]"
                                                : "text-[#6d7974]",
                                        ].join(" ")}
                                    />

                                    {item.label}

                                </button>
                            );
                        })}

                    </nav>


                    {/* Profile */}

                    <button
                        type="button"
                        aria-label="Open profile"
                        onClick={() =>
                            navigate("/profile")
                        }
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full border border-[#123c35]/10 bg-white text-[#123c35] shadow-[0_6px_20px_rgba(18,60,53,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-[#123c35]/20 hover:shadow-md"
                    >
                        <UserRound className="h-4 w-4" />
                    </button>

                </div>


                {/* =====================================================
                    MOBILE HEADER
                ===================================================== */}

                <div className="flex items-center gap-2 md:hidden">

                    {/* Small profile */}

                    <button
                        type="button"
                        aria-label="Open profile"
                        onClick={() =>
                            navigate("/profile")
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#123c35]/10 bg-white text-[#123c35] shadow-sm"
                    >
                        <UserRound className="h-4 w-4" />
                    </button>


                    {/* Menu button */}

                    <button
                        type="button"
                        aria-label={
                            mobileOpen
                                ? "Close menu"
                                : "Open menu"
                        }
                        aria-expanded={mobileOpen}
                        onClick={() =>
                            setMobileOpen(
                                !mobileOpen,
                            )
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#123c35] text-white shadow-sm transition hover:bg-[#0d312b]"
                    >
                        {mobileOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>

                </div>

            </header>


            {/* =========================================================
                MOBILE MENU
            ========================================================= */}

            {mobileOpen && (
                <div className="relative z-50 md:hidden">

                    <div className="absolute left-0 right-0 top-0 overflow-hidden rounded-[24px] border border-[#123c35]/10 bg-white p-2 shadow-[0_20px_60px_rgba(18,60,53,0.14)]">

                        {/* Menu header */}

                        <div className="flex items-center justify-between border-b border-[#123c35]/8 px-3 py-3">

                            <div>

                                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#ef713d]">
                                    FairTrip
                                </p>

                                <p className="mt-0.5 text-xs font-bold text-[#123c35]">
                                    Where shall we go?
                                </p>

                            </div>

                            <Heart className="h-4 w-4 text-[#ef713d]" />

                        </div>


                        {/* Navigation */}

                        <div className="mt-1">

                            {navItems.map((item) => {
                                const active =
                                    isActive(
                                        item.href,
                                    );

                                return (
                                    <button
                                        key={item.href}
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                item.href,
                                            )
                                        }
                                        className={[
                                            "flex w-full items-center gap-3 rounded-[16px] px-3 py-3.5 text-left transition",
                                            active
                                                ? "bg-[#123c35] text-white"
                                                : "text-[#31544d] hover:bg-[#f7f3ea]",
                                        ].join(" ")}
                                    >

                                        <span
                                            className={[
                                                "flex h-9 w-9 items-center justify-center rounded-xl",
                                                active
                                                    ? "bg-[#e8f58d] text-[#123c35]"
                                                    : "bg-[#f7f3ea] text-[#31544d]",
                                            ].join(" ")}
                                        >
                                            <item.icon className="h-4 w-4" />
                                        </span>

                                        <span className="flex-1">

                                            <span className="block text-sm font-black">
                                                {item.label}
                                            </span>

                                            <span
                                                className={[
                                                    "mt-0.5 block text-[10px]",
                                                    active
                                                        ? "text-white/55"
                                                        : "text-[#6d7974]",
                                                ].join(" ")}
                                            >
                                                {item.label ===
                                                "Explore"
                                                    ? "Discover places around you"
                                                    : item.label ===
                                                        "Food"
                                                      ? "Find food worth trying"
                                                      : "Your saved journeys"}
                                            </span>

                                        </span>

                                    </button>
                                );
                            })}

                        </div>


                        {/* Profile */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/profile")
                            }
                            className="mt-1 flex w-full items-center gap-3 rounded-[16px] border-t border-[#123c35]/8 px-3 py-3.5 text-left text-[#31544d] transition hover:bg-[#f7f3ea]"
                        >

                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f8d4c1] text-[#ef713d]">
                                <UserRound className="h-4 w-4" />
                            </span>

                            <span>
                                <span className="block text-sm font-black">
                                    Profile
                                </span>

                                <span className="block text-[10px] text-[#6d7974]">
                                    Your FairTrip account
                                </span>
                            </span>

                        </button>

                    </div>

                </div>
            )}
        </>
    );
}