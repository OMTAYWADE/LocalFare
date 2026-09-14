"use client";

import {
    ArrowRight,
    Eye,
    EyeOff,
    Loader2,
    MapPin,
    Navigation,
    ShieldCheck,
    Sparkles,
    WalletCards,
} from "lucide-react";
import gsap from "gsap";
import Link from "next/link";
import {
    useRouter,
    useSearchParams,
} from "next/navigation";
import {
    useEffect,
    useRef,
    useState,
} from "react";
import { signIn } from "next-auth/react";

interface SignInFormProps {
    onSuccess?: () => void;
}

export default function SignInForm({
    onSuccess,
}: SignInFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const pageRef =
        useRef<HTMLDivElement>(null);

    const routeRef =
        useRef<SVGPathElement>(null);

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [googleLoading, setGoogleLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {
        if (!pageRef.current) {
            return;
        }

        const context = gsap.context(() => {
            const timeline =
                gsap.timeline({
                    defaults: {
                        ease: "power3.out",
                    },
                });

            timeline
                .fromTo(
                    "[data-brand]",
                    {
                        opacity: 0,
                        y: -12,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                    },
                )
                .fromTo(
                    "[data-travel-copy]",
                    {
                        opacity: 0,
                        y: 22,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.65,
                    },
                    "-=0.2",
                )
                .fromTo(
                    "[data-route-art]",
                    {
                        opacity: 0,
                        scale: 0.96,
                    },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 0.6,
                    },
                    "-=0.35",
                )
                .fromTo(
                    "[data-login-card]",
                    {
                        opacity: 0,
                        x: 24,
                        scale: 0.98,
                    },
                    {
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        duration: 0.7,
                        ease: "back.out(1.1)",
                    },
                    "-=0.45",
                )
                .fromTo(
                    "[data-login-field]",
                    {
                        opacity: 0,
                        y: 10,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.35,
                        stagger: 0.06,
                    },
                    "-=0.3",
                );

            if (routeRef.current) {
                const length =
                    routeRef.current.getTotalLength();

                gsap.set(
                    routeRef.current,
                    {
                        strokeDasharray: length,
                        strokeDashoffset: length,
                    },
                );

                gsap.to(
                    routeRef.current,
                    {
                        strokeDashoffset: 0,
                        duration: 2,
                        delay: 0.35,
                        ease: "power2.inOut",
                    },
                );
            }

            gsap.to(
                "[data-pin]",
                {
                    y: -5,
                    duration: 2.2,
                    repeat: -1,
                    yoyo: true,
                    stagger: 0.25,
                    ease: "sine.inOut",
                },
            );

            gsap.to(
                "[data-fare-card]",
                {
                    y: -4,
                    duration: 2.7,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                },
            );
        }, pageRef);

        return () =>
            context.revert();
    }, []);

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        if (
            loading ||
            googleLoading
        ) {
            return;
        }

        setError("");
        setLoading(true);

        const cleanEmail =
            email
                .trim()
                .toLowerCase();

        if (
            !cleanEmail ||
            !cleanEmail.includes("@")
        ) {
            setError(
                "Enter a valid email address.",
            );

            setLoading(false);
            return;
        }

        if (!password) {
            setError(
                "Enter your password.",
            );

            setLoading(false);
            return;
        }

        try {
            const callbackUrl =
                searchParams.get(
                    "callbackUrl",
                ) || "/";

            const result = await signIn("credentials", {
                email: cleanEmail,
                password,
                redirect: false,
                callbackUrl,
            });

            console.log("CREDENTIAL LOGIN RESULT:", result);

            if (!result || result.error) {
                setError(
                    `Login failed: ${result?.error ?? "No result returned"}`,
                );
                return;
            }

            console.log("CREDENTIAL LOGIN SUCCESS");

            window.location.href = result.url ?? callbackUrl;

            onSuccess?.();

            router.replace(
                result.url ??
                callbackUrl,
            );

            router.refresh();
        } catch {
            setError(
                "Something went wrong while signing you in. Please try again.",
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleSignIn() {
        if (
            loading ||
            googleLoading
        ) {
            return;
        }

        setError("");
        setGoogleLoading(true);

        try {
            const callbackUrl =
                searchParams.get(
                    "callbackUrl",
                ) || "/";

            await signIn(
                "google",
                {
                    callbackUrl,
                },
            );
        } catch {
            setError(
                "Google sign-in could not be completed. Please try again.",
            );

            setGoogleLoading(false);
        }
    }

    return (
        <main
            ref={pageRef}
            className="min-h-screen overflow-hidden bg-[#f5f1e8] text-[#123c35]"
        >
            {/* =====================================================
                BACKGROUND
            ===================================================== */}

            <div className="pointer-events-none fixed -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#e8f58d]/30 blur-3xl" />

            <div className="pointer-events-none fixed -bottom-48 -right-40 h-[500px] w-[500px] rounded-full bg-[#ef713d]/10 blur-3xl" />

            {/* =====================================================
                BRAND BAR
            ===================================================== */}

            <header
                data-brand
                className="relative z-20 mx-auto flex w-full max-w-[1380px] items-center justify-between px-5 py-5 sm:px-8 lg:px-10"
            >
                <Link
                    href="/"
                    className="group flex items-center gap-3"
                >
                    <span className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#123c35] text-[#e8f58d] transition duration-300 group-hover:rotate-[-6deg]">
                        <Navigation className="h-[17px] w-[17px]" />
                    </span>

                    <span>
                        <span className="block text-[11px] font-black tracking-[-0.02em]">
                            FairTrip
                        </span>

                        <span className="hidden text-[7px] font-bold uppercase tracking-[0.15em] text-[#87938e] sm:block">
                            Travel smarter. Pay fairly.
                        </span>
                    </span>
                </Link>

                <div className="flex items-center gap-3">
                    <span className="hidden text-[9px] font-bold text-[#8a9590] sm:block">
                        First trip with FairTrip?
                    </span>

                    <Link
                        href="/auth/register"
                        className="rounded-full border border-[#123c35]/10 bg-white px-4 py-2.5 text-[9px] font-black transition hover:-translate-y-0.5 hover:border-[#123c35]/20 hover:shadow-sm"
                    >
                        Create account
                    </Link>
                </div>
            </header>

            {/* =====================================================
                CONTENT
            ===================================================== */}

            <div className="mx-auto grid min-h-[calc(100vh-82px)] w-full max-w-[1380px] items-center gap-7 px-5 pb-7 pt-1 sm:px-8 lg:grid-cols-[1.15fr_0.72fr] lg:gap-10 lg:px-10 lg:pb-10">

                {/* =================================================
                    LEFT TRAVEL EXPERIENCE
                ================================================= */}

                <section
                    data-travel-copy
                    className="relative hidden min-h-[620px] overflow-hidden rounded-[40px] bg-[#123c35] lg:block"
                >
                    {/* subtle landscape */}

                    <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#0d302b] to-transparent" />

                    <svg
                        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]"
                        viewBox="0 0 900 650"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M-30 115 C130 30 230 200 390 115 C540 35 690 170 930 70"
                            fill="none"
                            stroke="white"
                            strokeWidth="1"
                        />

                        <path
                            d="M-30 155 C130 70 230 240 390 155 C540 75 690 210 930 110"
                            fill="none"
                            stroke="white"
                            strokeWidth="1"
                        />

                        <path
                            d="M-30 195 C130 110 230 280 390 195 C540 115 690 250 930 150"
                            fill="none"
                            stroke="white"
                            strokeWidth="1"
                        />

                        <path
                            d="M-30 490 C130 405 260 600 440 500 C610 405 740 535 930 430"
                            fill="none"
                            stroke="white"
                            strokeWidth="1"
                        />

                        <path
                            d="M-30 530 C130 445 260 640 440 540 C610 445 740 575 930 470"
                            fill="none"
                            stroke="white"
                            strokeWidth="1"
                        />
                    </svg>

                    {/* header inside panel */}

                    <div className="relative z-10 flex items-center justify-between p-8 xl:p-10">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-[#e8f58d] text-[#123c35]">
                                <Navigation className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#e8f58d]">
                                    Local intelligence
                                </p>

                                <p className="mt-1 text-[10px] font-bold text-white/45">
                                    Know before you pay.
                                </p>
                            </div>
                        </div>

                        <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-[7px] font-black uppercase tracking-[0.14em] text-white/40">
                            FairTrip
                        </span>
                    </div>

                    {/* headline */}

                    <div className="relative z-10 px-8 pt-16 xl:px-10">
                        <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[#ef713d]">
                            Your journey starts here
                        </p>

                        <h1 className="mt-5 max-w-[590px] text-[clamp(3.4rem,6vw,6.4rem)] font-black leading-[0.86] tracking-[-0.075em]">
                            Travel
                            <br />

                            <span className="text-[#e8f58d]">
                                like a local.
                            </span>
                        </h1>

                        <p className="mt-7 max-w-[440px] text-[12px] leading-6 text-white/50 sm:text-sm sm:leading-7">
                            Understand local transport,
                            discover trusted places and learn
                            what other travelers experienced
                            before you spend.
                        </p>
                    </div>

                    {/* =================================================
                        ROUTE
                    ================================================= */}

                    <div
                        data-route-art
                        className="absolute inset-x-0 bottom-[125px] h-[245px]"
                    >
                        <svg
                            viewBox="0 0 900 280"
                            className="absolute inset-0 h-full w-full"
                            fill="none"
                        >
                            <path
                                d="M70 225 C160 195 135 90 270 100 C390 110 330 235 470 205 C600 178 535 65 660 90 C755 108 740 165 835 47"
                                stroke="#e8f58d"
                                strokeOpacity="0.08"
                                strokeWidth="24"
                                strokeLinecap="round"
                            />

                            <path
                                ref={routeRef}
                                d="M70 225 C160 195 135 90 270 100 C390 110 330 235 470 205 C600 178 535 65 660 90 C755 108 740 165 835 47"
                                stroke="#e8f58d"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />

                            <circle
                                cx="70"
                                cy="225"
                                r="6"
                                fill="#ef713d"
                            />

                            <circle
                                cx="270"
                                cy="100"
                                r="6"
                                fill="#e8f58d"
                            />

                            <circle
                                cx="470"
                                cy="205"
                                r="6"
                                fill="#e8f58d"
                            />

                            <circle
                                cx="660"
                                cy="90"
                                r="6"
                                fill="#e8f58d"
                            />

                            <circle
                                cx="835"
                                cy="47"
                                r="8"
                                fill="#ef713d"
                            />
                        </svg>

                        {/* Mumbai */}

                        <div
                            data-pin
                            className="absolute left-[5%] top-[66%]"
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ef713d] text-white shadow-lg">
                                    <MapPin className="h-4 w-4" />
                                </div>

                                <span className="text-[8px] font-black uppercase tracking-[0.12em] text-white/50">
                                    Mumbai
                                </span>
                            </div>
                        </div>

                        {/* Goa */}

                        <div
                            data-pin
                            className="absolute left-[68%] top-[10%]"
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8f58d] text-[#123c35] shadow-lg">
                                    <MapPin className="h-4 w-4" />
                                </div>

                                <span className="text-[8px] font-black uppercase tracking-[0.12em] text-white/50">
                                    Goa
                                </span>
                            </div>
                        </div>

                        {/* destination */}

                        <div
                            data-pin
                            className="absolute right-[4%] top-[-2%]"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ef713d] text-white shadow-lg">
                                <Navigation className="h-4 w-4" />
                            </div>
                        </div>

                        {/* fare card */}

                        <div
                            data-fare-card
                            className="absolute bottom-[-4px] right-[6%] w-[205px] rounded-[21px] bg-[#fffdf8] p-3.5 text-[#123c35] shadow-[0_20px_55px_rgba(0,0,0,0.2)]"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[7px] font-black uppercase tracking-[0.14em] text-[#8b9691]">
                                        Local fare
                                    </p>

                                    <p className="mt-1 text-[10px] font-black">
                                        Auto · 2.4 km
                                    </p>
                                </div>

                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f58d]">
                                    <WalletCards className="h-3.5 w-3.5" />
                                </div>
                            </div>

                            <div className="mt-3 flex items-end justify-between">
                                <div>
                                    <p className="text-xl font-black tracking-[-0.04em]">
                                        ₹42
                                    </p>

                                    <p className="text-[7px] font-bold text-[#8b9691]">
                                        fair estimate
                                    </p>
                                </div>

                                <span className="rounded-full bg-[#edf5df] px-2 py-1 text-[6px] font-black uppercase tracking-[0.1em] text-[#54704e]">
                                    Fair
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* bottom values */}

                    <div className="absolute bottom-8 left-8 right-[240px] grid grid-cols-3 gap-2 xl:left-10 xl:right-[250px]">
                        <div className="rounded-[17px] border border-white/10 bg-white/[0.05] p-3">
                            <p className="text-sm font-black text-[#e8f58d]">
                                ₹42
                            </p>

                            <p className="mt-1 text-[6px] font-black uppercase tracking-[0.12em] text-white/30">
                                Fair fare
                            </p>
                        </div>

                        <div className="rounded-[17px] border border-white/10 bg-white/[0.05] p-3">
                            <p className="text-sm font-black text-[#e8f58d]">
                                1.2k+
                            </p>

                            <p className="mt-1 text-[6px] font-black uppercase tracking-[0.12em] text-white/30">
                                Places
                            </p>
                        </div>

                        <div className="rounded-[17px] border border-white/10 bg-white/[0.05] p-3">
                            <p className="text-sm font-black text-[#e8f58d]">
                                Real
                            </p>

                            <p className="mt-1 text-[6px] font-black uppercase tracking-[0.12em] text-white/30">
                                Travelers
                            </p>
                        </div>
                    </div>
                </section>

                {/* =================================================
                    LOGIN
                ================================================= */}

                <section
                    data-login-card
                    className="mx-auto w-full max-w-[450px]"
                >
                    <div className="rounded-[34px] border border-[#123c35]/8 bg-[#fffefa] p-6 shadow-[0_25px_80px_rgba(18,60,53,0.10)] sm:p-8">

                        {/* heading */}

                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-[#f7f3ea] px-3 py-2">
                                <Sparkles className="h-3 w-3 text-[#ef713d]" />

                                <span className="text-[7px] font-black uppercase tracking-[0.17em] text-[#68756f]">
                                    Welcome back
                                </span>
                            </div>

                            <h2 className="mt-5 text-[2.8rem] font-black leading-[0.9] tracking-[-0.07em]">
                                Ready to
                                <br />

                                <span className="text-[#ef713d]">
                                    explore?
                                </span>
                            </h2>

                            <p className="mt-4 max-w-[370px] text-[10px] leading-5 text-[#89948f]">
                                Sign in to save journeys,
                                compare local fares and carry
                                your travel memory with you.
                            </p>
                        </div>

                        {/* error */}

                        {error && (
                            <div className="mt-5 rounded-[17px] border border-[#ef713d]/20 bg-[#fff4ef] p-3.5">
                                <p className="text-[9px] font-black text-[#c95731]">
                                    We couldn't sign you in
                                </p>

                                <p className="mt-1 text-[8px] leading-5 text-[#9a6655]">
                                    {error}
                                </p>

                                <Link
                                    href="/auth/register"
                                    className="mt-2 inline-flex items-center gap-1 text-[8px] font-black text-[#123c35]"
                                >
                                    Create a FairTrip account

                                    <ArrowRight className="h-3 w-3" />
                                </Link>
                            </div>
                        )}

                        {/* Google */}

                        <button
                            data-login-field
                            type="button"
                            onClick={
                                handleGoogleSignIn
                            }
                            disabled={
                                loading ||
                                googleLoading
                            }
                            className="mt-7 flex h-12 w-full items-center justify-center gap-3 rounded-[17px] border border-[#123c35]/10 bg-[#f9f8f2] text-[10px] font-black transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {googleLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-black shadow-sm">
                                    G
                                </span>
                            )}

                            {googleLoading
                                ? "Connecting..."
                                : "Continue with Google"}
                        </button>

                        {/* divider */}

                        <div
                            data-login-field
                            className="my-5 flex items-center gap-3"
                        >
                            <div className="h-px flex-1 bg-[#123c35]/8" />

                            <span className="text-[7px] font-black uppercase tracking-[0.16em] text-[#a1aaa6]">
                                or email
                            </span>

                            <div className="h-px flex-1 bg-[#123c35]/8" />
                        </div>

                        {/* EMAIL */}

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="space-y-4"
                        >
                            <div data-login-field>
                                <label
                                    htmlFor="signin-email"
                                    className="text-[7px] font-black uppercase tracking-[0.16em] text-[#74807b]"
                                >
                                    Email address
                                </label>

                                <input
                                    id="signin-email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(
                                        event,
                                    ) =>
                                        setEmail(
                                            event.target.value,
                                        )
                                    }
                                    placeholder="traveler@example.com"
                                    className="mt-2 h-12 w-full rounded-[16px] bg-[#f9f8f2] px-4 text-[11px] font-bold text-[#123c35] outline-none ring-1 ring-inset ring-[#123c35]/8 transition focus:bg-white focus:ring-[#ef713d]/35"
                                />
                            </div>

                            {/* PASSWORD */}

                            <div data-login-field>
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor="signin-password"
                                        className="text-[7px] font-black uppercase tracking-[0.16em] text-[#74807b]"
                                    >
                                        Password
                                    </label>

                                    <Link
                                        href="/auth/register"
                                        className="text-[7px] font-black text-[#ef713d]"
                                    >
                                        New traveler?
                                    </Link>
                                </div>

                                <div className="mt-2 flex items-center rounded-[16px] bg-[#f9f8f2] pr-2 ring-1 ring-inset ring-[#123c35]/8 transition focus-within:bg-white focus-within:ring-[#ef713d]/35">
                                    <input
                                        id="signin-password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        autoComplete="current-password"
                                        value={
                                            password
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            setPassword(
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                        placeholder="Your password"
                                        className="h-12 min-w-0 flex-1 bg-transparent px-4 text-[11px] font-bold text-[#123c35] outline-none placeholder:text-[#a6afab]"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (
                                                    value,
                                                ) =>
                                                    !value,
                                            )
                                        }
                                        className="flex h-8 w-8 items-center justify-center rounded-full text-[#89948f] transition hover:bg-white hover:text-[#123c35]"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-3.5 w-3.5" />
                                        ) : (
                                            <Eye className="h-3.5 w-3.5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* SUBMIT */}

                            <button
                                data-login-field
                                type="submit"
                                disabled={
                                    loading ||
                                    googleLoading
                                }
                                className="group flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#123c35] px-5 text-[10px] font-black text-white shadow-[0_12px_30px_rgba(18,60,53,0.16)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#0d302a] hover:shadow-[0_16px_36px_rgba(18,60,53,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                )}

                                {loading
                                    ? "Finding your journey..."
                                    : "Start exploring"}
                            </button>
                        </form>

                        {/* account */}

                        <div
                            data-login-field
                            className="mt-6 flex items-center justify-between gap-3 rounded-[18px] bg-[#eef4d7] p-3.5"
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8f58d] text-[#123c35]">
                                    <MapPin className="h-3.5 w-3.5" />
                                </div>

                                <div>
                                    <p className="text-[8px] font-black text-[#123c35]">
                                        First time here?
                                    </p>

                                    <p className="mt-0.5 text-[7px] text-[#77836f]">
                                        Build your first journey.
                                    </p>
                                </div>
                            </div>

                            <Link
                                href="/auth/register"
                                className="shrink-0 rounded-full bg-[#ef713d] px-3 py-2 text-[7px] font-black text-white transition hover:bg-[#df6134]"
                            >
                                Join FairTrip
                            </Link>
                        </div>

                        {/* privacy */}

                        <div
                            data-login-field
                            className="mt-5 flex items-center justify-center gap-1.5 text-center text-[7px] font-bold text-[#a0aaa6]"
                        >
                            <ShieldCheck className="h-3 w-3 shrink-0" />

                            Your personal travel memory stays
                            private.
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}