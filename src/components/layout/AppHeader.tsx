"use client";

import {
    ChevronDown,
    Compass,
    Menu,
    ScanSearch,
    Utensils,
    X,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const primaryLinks = [
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
        label: "LocalFare",
        href: "/food/scan",
        icon: ScanSearch,
    },
];

const secondaryLinks = [
    {
        label: "Travel Plan",
        href: "/travel",
    },
    {
        label: "Smart Recommendations",
        href: "/travel/smart",
    },
    {
        label: "Food Recommendations",
        href: "/food/recommendations",
    },
];

export default function AppHeader() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="relative z-50 px-1 py-4 sm:py-5">
            <div className="flex h-[62px] items-center justify-between rounded-full border border-[#123c35]/10 bg-white/75 px-3 shadow-[0_12px_35px_rgba(18,60,53,0.06)] backdrop-blur-xl sm:h-[68px] sm:px-5">
                {/* BRAND */}
                <Link
                    href="/"
                    onClick={() => setMobileOpen(false)}
                    className="group flex items-center gap-2.5"
                >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#123c35] text-[#e8f58d] transition duration-300 group-hover:rotate-6 group-hover:scale-105">
                        <Compass className="h-5 w-5" />
                    </span>

                    <span className="text-lg font-black tracking-[-0.05em] text-[#123c35] sm:text-xl">
                        FairTrip
                    </span>
                </Link>

                {/* DESKTOP NAV */}
                <nav className="hidden items-center gap-1 md:flex">
                    {primaryLinks.map((link) => {
                        const active =
                            pathname === link.href ||
                            pathname.startsWith(`${link.href}/`);

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={[
                                    "rounded-full px-4 py-2.5 text-xs font-black transition",
                                    active
                                        ? "bg-[#123c35] text-white"
                                        : "text-[#53635e] hover:bg-[#e8f58d]/60 hover:text-[#123c35]",
                                ].join(" ")}
                            >
                                {link.label}
                            </Link>
                        );
                    })}

                    {/* MORE */}
                    <div className="group relative ml-1">
                        <button
                            type="button"
                            className="flex items-center gap-1 rounded-full px-4 py-2.5 text-xs font-black text-[#53635e] transition hover:bg-[#f7f3ea] hover:text-[#123c35]"
                        >
                            More
                            <ChevronDown className="h-3.5 w-3.5 transition group-hover:rotate-180" />
                        </button>

                        <div className="pointer-events-none invisible absolute right-0 top-full w-56 pt-3 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
                            <div className="rounded-[20px] border border-[#123c35]/10 bg-white p-2 shadow-[0_20px_50px_rgba(18,60,53,0.12)]">
                                {secondaryLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="block rounded-[14px] px-3 py-3 text-xs font-bold text-[#53635e] transition hover:bg-[#f7f3ea] hover:text-[#123c35]"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* MOBILE BUTTON */}
                <button
                    type="button"
                    aria-label={
                        mobileOpen
                            ? "Close navigation"
                            : "Open navigation"
                    }
                    aria-expanded={mobileOpen}
                    onClick={() => setMobileOpen((value) => !value)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#123c35] text-white transition hover:bg-[#0d312b] md:hidden"
                >
                    {mobileOpen ? (
                        <X className="h-4 w-4" />
                    ) : (
                        <Menu className="h-4 w-4" />
                    )}
                </button>
            </div>

            {/* MOBILE MENU */}
            <div
                className={[
                    "absolute left-1 right-1 top-[82px] overflow-hidden rounded-[26px]",
                    "border border-[#123c35]/10 bg-white/95 shadow-[0_25px_70px_rgba(18,60,53,0.15)] backdrop-blur-xl",
                    "transition-all duration-300 md:hidden",
                    mobileOpen
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-2 opacity-0",
                ].join(" ")}
            >
                <nav className="p-3">
                    <p className="px-3 pb-2 pt-1 text-[9px] font-black uppercase tracking-[0.2em] text-[#ef713d]">
                        Main
                    </p>

                    {primaryLinks.map((link) => {
                        const Icon = link.icon;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-3 rounded-[16px] px-3 py-3.5 text-sm font-black text-[#123c35] transition hover:bg-[#f7f3ea]"
                            >
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8f58d]">
                                    <Icon className="h-4 w-4" />
                                </span>

                                {link.label}
                            </Link>
                        );
                    })}

                    <div className="my-2 h-px bg-[#123c35]/10" />

                    <p className="px-3 pb-2 pt-1 text-[9px] font-black uppercase tracking-[0.2em] text-[#6d7974]">
                        More
                    </p>

                    {secondaryLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="block rounded-[16px] px-3 py-3 text-xs font-bold text-[#53635e] transition hover:bg-[#f7f3ea]"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}