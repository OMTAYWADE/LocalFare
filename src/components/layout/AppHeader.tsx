"use client";

import {
    BusFront,
    ChevronDown,
    ChevronRight,
    Compass,
    LogIn,
    LogOut,
    Menu,
    ScanSearch,
    UserRound,
    Utensils,
    X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    signOut,
    useSession,
} from "next-auth/react";

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
        label: "Scan",
        href: "/scan",
        icon: ScanSearch,
    },
    {
        label: "Transport",
        href: "/transport",
        icon: BusFront,
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

function isActivePath(
    pathname: string,
    href: string,
) {
    if (href === "/") {
        return pathname === "/";
    }

    return (
        pathname === href ||
        pathname.startsWith(`${href}/`)
    );
}

function getInitials(
    name?: string | null,
    email?: string | null,
) {
    const value =
        name?.trim() ||
        email?.split("@")[0] ||
        "U";

    return value
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
}

export default function AppHeader() {
    const pathname = usePathname();

    const {
        data: session,
        status,
    } = useSession();

    const [mobileOpen, setMobileOpen] =
        useState(false);

    const [accountOpen, setAccountOpen] =
        useState(false);

    const moreActive =
        secondaryLinks.some((link) =>
            isActivePath(
                pathname,
                link.href,
            ),
        ) ||
        isActivePath(pathname, "/scan") ||
        isActivePath(pathname, "/transport");

    const isAuthenticated =
        status === "authenticated";

    const user = session?.user;

    const initials = getInitials(
        user?.name,
        user?.email,
    );

    async function handleLogout() {
        setAccountOpen(false);
        setMobileOpen(false);

        await signOut({
            callbackUrl: "/auth/signin",
        });
    }

    function closeMenus() {
        setMobileOpen(false);
        setAccountOpen(false);
    }

    return (
        <header className="relative z-50 px-3 py-4 sm:px-5 sm:py-5 lg:px-6">
            <div className="mx-auto flex h-[68px] max-w-[1380px] items-center gap-3 rounded-[24px] border border-[#123c35]/10 bg-[#fffdf8]/95 px-3 shadow-[0_16px_50px_rgba(18,60,53,0.09)] backdrop-blur-2xl sm:h-[74px] sm:px-4 lg:px-5">

                {/* ====================================================== */}
                {/* BRAND                                                   */}
                {/* ====================================================== */}

                <Link
                    href="/"
                    onClick={closeMenus}
                    className="group flex shrink-0 items-center gap-2.5"
                >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#123c35] text-[#e8f58d] shadow-sm transition duration-300 group-hover:rotate-6 group-hover:scale-105">
                        <Compass className="h-5 w-5" />
                    </span>

                    <span className="text-lg font-black tracking-[-0.05em] text-[#123c35] sm:text-xl">
                        FairTrip
                    </span>
                </Link>

                {/* ====================================================== */}
                {/* DESKTOP NAV                                            */}
                {/* ====================================================== */}

                <nav className="hidden min-w-0 flex-1 items-center justify-center md:flex">
                    <div className="flex items-center gap-0.5">

                        {/* ------------------------------------------------ */}
                        {/* EXPLORE                                             */}
                        {/* ------------------------------------------------ */}

                        <Link
                            href="/explore"
                            className={[
                                "group inline-flex items-center gap-2 rounded-[14px]",
                                "px-3 py-2.5 text-[11px] font-black",
                                "transition-all duration-200",
                                "2xl:px-3.5",
                                isActivePath(
                                    pathname,
                                    "/explore",
                                )
                                    ? "bg-[#123c35] text-white shadow-sm"
                                    : "text-[#53635e] hover:-translate-y-0.5 hover:bg-[#e8f58d]/60 hover:text-[#123c35]",
                            ].join(" ")}
                        >
                            <Compass
                                className={[
                                    "h-3.5 w-3.5",
                                    isActivePath(
                                        pathname,
                                        "/explore",
                                    )
                                        ? "text-[#e8f58d]"
                                        : "transition-transform group-hover:scale-110",
                                ].join(" ")}
                            />

                            <span>Explore</span>
                        </Link>

                        {/* ------------------------------------------------ */}
                        {/* FOOD                                               */}
                        {/* ------------------------------------------------ */}

                        <Link
                            href="/food"
                            className={[
                                "group inline-flex items-center gap-2 rounded-[14px]",
                                "px-3 py-2.5 text-[11px] font-black",
                                "transition-all duration-200",
                                "2xl:px-3.5",
                                isActivePath(
                                    pathname,
                                    "/food",
                                )
                                    ? "bg-[#123c35] text-white shadow-sm"
                                    : "text-[#53635e] hover:-translate-y-0.5 hover:bg-[#e8f58d]/60 hover:text-[#123c35]",
                            ].join(" ")}
                        >
                            <Utensils
                                className={[
                                    "h-3.5 w-3.5",
                                    isActivePath(
                                        pathname,
                                        "/food",
                                    )
                                        ? "text-[#e8f58d]"
                                        : "transition-transform group-hover:scale-110",
                                ].join(" ")}
                            />

                            <span>Food</span>
                        </Link>

                        {/* ------------------------------------------------ */}
                        {/* SCAN                                                */}
                        {/* Visible from lg onwards                          */}
                        {/* ------------------------------------------------ */}

                        <Link
                            href="/scan"
                            className={[
                                "group hidden items-center gap-2 rounded-[14px]",
                                "px-3 py-2.5 text-[11px] font-black",
                                "transition-all duration-200",
                                "lg:inline-flex",
                                "2xl:px-3.5",
                                isActivePath(
                                    pathname,
                                    "/scan",
                                )
                                    ? "bg-[#123c35] text-white shadow-sm"
                                    : "text-[#53635e] hover:-translate-y-0.5 hover:bg-[#e8f58d]/60 hover:text-[#123c35]",
                            ].join(" ")}
                        >
                            <ScanSearch
                                className={[
                                    "h-3.5 w-3.5",
                                    isActivePath(
                                        pathname,
                                        "/scan",
                                    )
                                        ? "text-[#e8f58d]"
                                        : "transition-transform group-hover:scale-110",
                                ].join(" ")}
                            />

                            <span>Scan</span>
                        </Link>

                        {/* ------------------------------------------------ */}
                        {/* TRANSPORT                                           */}
                        {/* Visible only on very wide screens                */}
                        {/* ------------------------------------------------ */}

                        <Link
                            href="/transport"
                            className={[
                                "group hidden items-center gap-2 rounded-[14px]",
                                "px-3 py-2.5 text-[11px] font-black",
                                "transition-all duration-200",
                                "2xl:inline-flex",
                            ].join(" ")}
                        >
                            <BusFront
                                className={[
                                    "h-3.5 w-3.5",
                                    isActivePath(
                                        pathname,
                                        "/transport",
                                    )
                                        ? "text-[#123c35]"
                                        : "transition-transform group-hover:scale-110",
                                ].join(" ")}
                            />

                            <span
                                className={
                                    isActivePath(
                                        pathname,
                                        "/transport",
                                    )
                                        ? "text-[#123c35]"
                                        : "text-[#53635e] group-hover:text-[#123c35]"
                                }
                            >
                                Transport
                            </span>

                            {!isActivePath(
                                pathname,
                                "/transport",
                            ) && (
                                <span className="h-1.5 w-1.5 rounded-full bg-[#ef713d]" />
                            )}
                        </Link>

                        {/* ================================================== */}
                        {/* MORE                                                */}
                        {/* ================================================== */}

                        <div className="group relative ml-0.5">
                            <button
                                type="button"
                                aria-label="Open more navigation"
                                className={[
                                    "flex items-center gap-1.5 rounded-[14px]",
                                    "px-3 py-2.5 text-[11px] font-black",
                                    "transition",
                                    moreActive
                                        ? "bg-[#f7f3ea] text-[#123c35]"
                                        : "text-[#53635e] hover:bg-[#f7f3ea] hover:text-[#123c35]",
                                ].join(" ")}
                            >
                                More

                                <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
                            </button>

                            {/* DROPDOWN */}
                            <div className="pointer-events-none invisible absolute right-0 top-full z-[60] w-64 pt-3 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
                                <div className="rounded-[22px] border border-[#123c35]/10 bg-white p-2 shadow-[0_24px_60px_rgba(18,60,53,0.14)]">

                                    <div className="mb-1 rounded-[16px] bg-[#f7f3ea] px-3.5 py-3">
                                        <p className="text-[8px] font-black uppercase tracking-[0.18em] text-[#ef713d]">
                                            More from FairTrip
                                        </p>

                                        <p className="mt-1 text-[10px] font-bold text-[#123c35]/55">
                                            More ways to travel smarter.
                                        </p>
                                    </div>

                                    {/* SCAN */}
                                    <Link
                                        href="/scan"
                                        className="hidden items-center gap-3 rounded-[15px] px-3 py-3 text-xs font-bold text-[#53635e] transition hover:bg-[#f7f3ea] hover:text-[#123c35] lg:flex 2xl:hidden"
                                    >
                                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#e8f58d] text-[#123c35]">
                                            <ScanSearch size={14} />
                                        </span>

                                        <span className="flex-1">
                                            Scan
                                        </span>

                                        <ChevronRight
                                            size={14}
                                            className="text-[#a0aaa5]"
                                        />
                                    </Link>

                                    {/* TRANSPORT */}
                                    <Link
                                        href="/transport"
                                        className="flex items-center gap-3 rounded-[15px] px-3 py-3 text-xs font-bold text-[#53635e] transition hover:bg-[#f7f3ea] hover:text-[#123c35] 2xl:hidden"
                                    >
                                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#e8f58d] text-[#123c35]">
                                            <BusFront size={14} />
                                        </span>

                                        <span className="flex-1">
                                            Transport
                                        </span>

                                        <ChevronRight
                                            size={14}
                                            className="text-[#a0aaa5]"
                                        />
                                    </Link>

                                    <div className="my-1 h-px bg-[#123c35]/8" />

                                    {/* SECONDARY */}
                                    {secondaryLinks.map(
                                        (link) => {
                                            const active =
                                                isActivePath(
                                                    pathname,
                                                    link.href,
                                                );

                                            return (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    className={[
                                                        "flex items-center rounded-[15px] px-3 py-3 text-xs font-bold transition",
                                                        active
                                                            ? "bg-[#f7f3ea] text-[#123c35]"
                                                            : "text-[#53635e] hover:bg-[#f7f3ea] hover:text-[#123c35]",
                                                    ].join(" ")}
                                                >
                                                    <span className="flex-1">
                                                        {link.label}
                                                    </span>

                                                    <ChevronRight
                                                        className={[
                                                            "h-3.5 w-3.5",
                                                            active
                                                                ? "text-[#ef713d]"
                                                                : "text-[#a0aaa5]",
                                                        ].join(" ")}
                                                    />
                                                </Link>
                                            );
                                        },
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* ====================================================== */}
                {/* DESKTOP ACCOUNT                                        */}
                {/* ====================================================== */}

                <div className="hidden shrink-0 items-center gap-2 md:flex">

                    {status === "loading" ? (
                        <div className="h-10 w-24 animate-pulse rounded-xl bg-[#123c35]/5" />
                    ) : isAuthenticated ? (
                        <div className="relative">

                            {/* ACCOUNT BUTTON */}
                            <button
                                type="button"
                                onClick={() =>
                                    setAccountOpen(
                                        (value) =>
                                            !value,
                                    )
                                }
                                aria-expanded={
                                    accountOpen
                                }
                                className="flex items-center gap-2 rounded-[16px] border border-[#123c35]/10 bg-white px-2 py-1.5 transition hover:border-[#123c35]/20 hover:shadow-md"
                            >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#123c35] text-[10px] font-black text-[#e8f58d]">
                                    {user?.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={user.image}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        initials
                                    )}
                                </span>

                                <span className="hidden max-w-[82px] truncate text-xs font-black text-[#123c35] lg:block 2xl:max-w-[110px]">
                                    {user?.name ||
                                        "Traveler"}
                                </span>

                                <ChevronDown
                                    className={[
                                        "h-3.5 w-3.5 text-[#7c8883] transition-transform",
                                        accountOpen
                                            ? "rotate-180"
                                            : "",
                                    ].join(" ")}
                                />
                            </button>

                            {/* ACCOUNT DROPDOWN */}
                            {accountOpen && (
                                <div className="absolute right-0 top-full z-[70] w-64 pt-3">
                                    <div className="rounded-[22px] border border-[#123c35]/10 bg-white p-2 shadow-[0_24px_60px_rgba(18,60,53,0.16)]">

                                        {/* USER INFO */}
                                        <div className="mb-1 rounded-[17px] bg-[#f7f3ea] p-3">
                                            <p className="truncate text-sm font-black text-[#123c35]">
                                                {user?.name ||
                                                    "Traveler"}
                                            </p>

                                            <p className="mt-0.5 truncate text-[11px] text-[#123c35]/45">
                                                {user?.email}
                                            </p>
                                        </div>

                                        {/* MEMORY */}
                                        <Link
                                            href="/"
                                            onClick={() =>
                                                setAccountOpen(
                                                    false,
                                                )
                                            }
                                            className="flex items-center gap-3 rounded-[15px] px-3 py-3 text-xs font-bold text-[#53635e] transition hover:bg-[#f7f3ea] hover:text-[#123c35]"
                                        >
                                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#e8f58d] text-[#123c35]">
                                                <UserRound
                                                    size={15}
                                                />
                                            </span>

                                            <span className="flex-1">
                                                My travel memory
                                            </span>

                                            <ChevronRight
                                                size={14}
                                                className="text-[#a0aaa5]"
                                            />
                                        </Link>

                                        <div className="my-1 h-px bg-[#123c35]/8" />

                                        {/* LOGOUT */}
                                        <button
                                            type="button"
                                            onClick={
                                                handleLogout
                                            }
                                            className="group flex w-full items-center gap-3 rounded-[15px] px-3 py-3 text-xs font-bold text-[#53635e] transition hover:bg-[#ef713d]/10 hover:text-[#ef713d]"
                                        >
                                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ef713d]/10 text-[#ef713d] transition group-hover:bg-[#ef713d] group-hover:text-white">
                                                <LogOut
                                                    size={15}
                                                />
                                            </span>

                                            <span>
                                                Sign out
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* SIGN IN */}
                            <Link
                                href="/auth/signin"
                                className="flex items-center gap-2 rounded-[15px] px-3 py-2.5 text-[11px] font-black text-[#53635e] transition hover:bg-[#f7f3ea] hover:text-[#123c35]"
                            >
                                <LogIn size={14} />

                                Sign in
                            </Link>

                            {/* REGISTER */}
                            <Link
                                href="/auth/register"
                                className="flex items-center gap-2 rounded-[15px] bg-[#123c35] px-4 py-2.5 text-[11px] font-black text-[#f5f1e8] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#0d302a] hover:shadow-md"
                            >
                                Create account

                                <ChevronRight
                                    size={14}
                                />
                            </Link>
                        </>
                    )}
                </div>

                {/* ====================================================== */}
                {/* MOBILE MENU BUTTON                                     */}
                {/* ====================================================== */}

                <button
                    type="button"
                    aria-label={
                        mobileOpen
                            ? "Close navigation"
                            : "Open navigation"
                    }
                    aria-expanded={mobileOpen}
                    onClick={() => {
                        setMobileOpen(
                            (value) => !value,
                        );
                        setAccountOpen(false);
                    }}
                    className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#123c35] text-[#e8f58d] transition hover:bg-[#0d312b] md:hidden"
                >
                    {mobileOpen ? (
                        <X className="h-4 w-4" />
                    ) : (
                        <Menu className="h-4 w-4" />
                    )}
                </button>
            </div>

            {/* ========================================================== */}
            {/* MOBILE MENU                                                */}
            {/* ========================================================== */}

            <div
                className={[
                    "absolute left-3 right-3 top-[82px] overflow-hidden rounded-[26px]",
                    "border border-[#123c35]/10 bg-[#fffdf8]/95",
                    "shadow-[0_25px_70px_rgba(18,60,53,0.15)]",
                    "backdrop-blur-xl md:hidden",
                    "transition-all duration-300",
                    mobileOpen
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-2 opacity-0",
                ].join(" ")}
            >
                <nav className="p-3">

                    {/* HEADER */}
                    <div className="mb-2 flex items-center justify-between px-3 pt-1">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#ef713d]">
                            Navigate
                        </p>

                        <span className="rounded-full bg-[#e8f58d] px-2 py-1 text-[8px] font-black text-[#123c35]">
                            FAIRTRIP
                        </span>
                    </div>

                    {/* PRIMARY LINKS */}
                    {primaryLinks.map(
                        (link) => {
                            const Icon =
                                link.icon;

                            const active =
                                isActivePath(
                                    pathname,
                                    link.href,
                                );

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() =>
                                        setMobileOpen(
                                            false,
                                        )
                                    }
                                    className={[
                                        "flex items-center gap-3 rounded-[17px] px-3 py-3.5 text-sm font-black transition",
                                        active
                                            ? "bg-[#123c35] text-white"
                                            : "text-[#123c35] hover:bg-[#f7f3ea]",
                                    ].join(" ")}
                                >
                                    <span
                                        className={[
                                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                                            active
                                                ? "bg-[#e8f58d] text-[#123c35]"
                                                : "bg-[#e8f58d] text-[#123c35]",
                                        ].join(" ")}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </span>

                                    <span className="flex-1">
                                        {link.label}
                                    </span>

                                    {link.href ===
                                        "/transport" && (
                                        <span className="rounded-full bg-[#ef713d] px-2 py-1 text-[7px] font-black uppercase tracking-wide text-white">
                                            Fair Fare
                                        </span>
                                    )}

                                    <ChevronRight
                                        className={[
                                            "h-4 w-4",
                                            active
                                                ? "text-[#e8f58d]"
                                                : "text-[#a0aaa5]",
                                        ].join(" ")}
                                    />
                                </Link>
                            );
                        },
                    )}

                    <div className="my-2 h-px bg-[#123c35]/10" />

                    {/* MORE */}
                    <p className="px-3 pb-2 pt-1 text-[9px] font-black uppercase tracking-[0.2em] text-[#6d7974]">
                        More
                    </p>

                    {secondaryLinks.map(
                        (link) => {
                            const active =
                                isActivePath(
                                    pathname,
                                    link.href,
                                );

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() =>
                                        setMobileOpen(
                                            false,
                                        )
                                    }
                                    className={[
                                        "block rounded-[16px] px-3 py-3 text-xs font-bold transition",
                                        active
                                            ? "bg-[#f7f3ea] text-[#123c35]"
                                            : "text-[#53635e] hover:bg-[#f7f3ea] hover:text-[#123c35]",
                                    ].join(" ")}
                                >
                                    {link.label}
                                </Link>
                            );
                        },
                    )}

                    {/* ================================================== */}
                    {/* MOBILE ACCOUNT                                     */}
                    {/* ================================================== */}

                    <div className="my-2 h-px bg-[#123c35]/10" />

                    {status === "loading" ? (
                        <div className="h-12 animate-pulse rounded-[17px] bg-[#123c35]/5" />
                    ) : isAuthenticated ? (
                        <div className="rounded-[18px] bg-[#f7f3ea] p-2">

                            {/* USER */}
                            <div className="flex items-center gap-3 px-2 py-2">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#123c35] text-[10px] font-black text-[#e8f58d]">
                                    {user?.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={user.image}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        initials
                                    )}
                                </span>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-black text-[#123c35]">
                                        {user?.name ||
                                            "Traveler"}
                                    </p>

                                    <p className="truncate text-[10px] text-[#123c35]/45">
                                        {user?.email}
                                    </p>
                                </div>
                            </div>

                            {/* MEMORY */}
                            <Link
                                href="/"
                                onClick={() =>
                                    setMobileOpen(
                                        false,
                                    )
                                }
                                className="mt-1 flex items-center gap-2 rounded-[14px] px-3 py-2.5 text-xs font-bold text-[#53635e] transition hover:bg-white hover:text-[#123c35]"
                            >
                                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#e8f58d] text-[#123c35]">
                                    <UserRound size={14} />
                                </span>

                                <span className="flex-1">
                                    My travel memory
                                </span>

                                <ChevronRight
                                    size={14}
                                    className="text-[#a0aaa5]"
                                />
                            </Link>

                            {/* LOGOUT */}
                            <button
                                type="button"
                                onClick={
                                    handleLogout
                                }
                                className="group mt-1 flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-xs font-bold text-[#53635e] transition hover:bg-white hover:text-[#ef713d]"
                            >
                                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ef713d]/10 text-[#ef713d] transition group-hover:bg-[#ef713d] group-hover:text-white">
                                    <LogOut size={14} />
                                </span>

                                <span>
                                    Sign out
                                </span>
                            </button>
                        </div>
                    ) : (
                        /* LOGGED OUT */
                        <div className="grid grid-cols-2 gap-2">
                            <Link
                                href="/auth/signin"
                                onClick={() =>
                                    setMobileOpen(
                                        false,
                                    )
                                }
                                className="flex items-center justify-center gap-2 rounded-[16px] border border-[#123c35]/10 bg-white px-3 py-3 text-xs font-black text-[#123c35] transition hover:border-[#123c35]/20 hover:bg-[#f7f3ea]"
                            >
                                <LogIn size={14} />

                                Sign in
                            </Link>

                            <Link
                                href="/auth/register"
                                onClick={() =>
                                    setMobileOpen(
                                        false,
                                    )
                                }
                                className="flex items-center justify-center rounded-[16px] bg-[#123c35] px-3 py-3 text-xs font-black text-[#f5f1e8] transition hover:bg-[#0d302a]"
                            >
                                Join FairTrip
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}