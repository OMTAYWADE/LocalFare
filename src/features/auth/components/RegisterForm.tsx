"use client";

import {
    ArrowRight,
    Eye,
    EyeOff,
    Loader2,
    Mail,
    MapPin,
    Navigation,
    ShieldCheck,
    UserRound,
} from "lucide-react";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
    const router = useRouter();

    const [name, setName] =
        useState("");

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

        try {
            const response =
                await fetch(
                    "/api/auth/register",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            name:
                                name.trim(),
                            email:
                                email
                                    .trim()
                                    .toLowerCase(),
                            password,
                        }),
                    },
                );

            const data =
                (await response.json()) as {
                    error?: string;
                };

            if (!response.ok) {
                setError(
                    data.error ??
                        "Unable to create your account.",
                );

                return;
            }

            const result =
                await signIn(
                    "credentials",
                    {
                        email:
                            email
                                .trim()
                                .toLowerCase(),

                        password,

                        redirect: false,
                    },
                );

            if (
                !result ||
                result.error
            ) {
                router.replace(
                    "/auth/signin",
                );

                return;
            }

            router.replace("/");
            router.refresh();
        } catch {
            setError(
                "Something went wrong. Please try again.",
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogle() {
        if (
            loading ||
            googleLoading
        ) {
            return;
        }

        setGoogleLoading(true);
        setError("");

        await signIn("google", {
            callbackUrl: "/",
        });
    }

    return (
        <main className="min-h-screen bg-[#f7f4ec] px-4 py-6 text-[#123c35]">
            <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-[900px] items-center">
                <div className="grid w-full overflow-hidden rounded-[34px] border border-[#123c35]/10 bg-white shadow-[0_30px_100px_rgba(18,60,53,0.10)] lg:grid-cols-[0.9fr_1fr]">

                    {/* TRAVEL MESSAGE */}

                    <div className="hidden bg-[#123c35] p-9 text-white lg:block">
                        <div className="flex h-full flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f58d] text-[#123c35]">
                                        <Navigation className="h-4 w-4" />
                                    </div>

                                    <div>
                                        <p className="text-xs font-black">
                                            FairTrip
                                        </p>

                                        <p className="text-[8px] text-white/40">
                                            Travel smarter. Pay fairly.
                                        </p>
                                    </div>
                                </div>

                                <p className="mt-20 text-[8px] font-black uppercase tracking-[0.2em] text-[#ef713d]">
                                    Start your journey
                                </p>

                                <h1 className="mt-4 text-5xl font-black leading-[0.9] tracking-[-0.06em]">
                                    Know the
                                    <br />
                                    <span className="text-[#e8f58d]">
                                        local fare.
                                    </span>
                                </h1>

                                <p className="mt-6 max-w-xs text-xs leading-6 text-white/50">
                                    Save your journeys, understand local
                                    transport and remember what you learn
                                    along the way.
                                </p>
                            </div>

                            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-4 w-4 text-[#e8f58d]" />

                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-[0.15em] text-white/35">
                                            Your memory
                                        </p>

                                        <p className="mt-1 text-[10px] font-bold text-white/70">
                                            Places · routes · fares
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FORM */}

                    <div className="p-6 sm:p-9">
                        <div>
                            <p className="text-[8px] font-black uppercase tracking-[0.18em] text-[#ef713d]">
                                New traveler
                            </p>

                            <h2 className="mt-2 text-3xl font-black tracking-[-0.055em]">
                                Create your account
                            </h2>

                            <p className="mt-2 text-[10px] leading-5 text-[#87918d]">
                                Your FairTrip journey starts here.
                            </p>
                        </div>

                        {error && (
                            <div className="mt-5 rounded-[17px] bg-[#fff2ed] px-4 py-3 text-[9px] font-bold leading-5 text-[#b65336]">
                                {error}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={
                                handleGoogle
                            }
                            disabled={
                                loading ||
                                googleLoading
                            }
                            className="mt-6 flex h-12 w-full items-center justify-center gap-3 rounded-[16px] border border-[#123c35]/10 bg-[#fbfaf5] text-[10px] font-black transition hover:bg-white hover:shadow-md disabled:opacity-50"
                        >
                            {googleLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white font-black shadow-sm">
                                    G
                                </span>
                            )}

                            Continue with Google
                        </button>

                        <div className="my-5 flex items-center gap-3">
                            <div className="h-px flex-1 bg-[#123c35]/8" />

                            <span className="text-[7px] font-black uppercase tracking-[0.15em] text-[#a0aaa6]">
                                or
                            </span>

                            <div className="h-px flex-1 bg-[#123c35]/8" />
                        </div>

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="space-y-4"
                        >
                            <div>
                                <label
                                    htmlFor="register-name"
                                    className="text-[8px] font-black uppercase tracking-[0.15em] text-[#74807b]"
                                >
                                    Name
                                </label>

                                <div className="mt-2 flex items-center gap-2 rounded-[16px] bg-[#fbfaf5] px-4 ring-1 ring-inset ring-[#123c35]/8 focus-within:ring-[#ef713d]/35">
                                    <UserRound className="h-4 w-4 text-[#9aa39f]" />

                                    <input
                                        id="register-name"
                                        type="text"
                                        required
                                        autoComplete="name"
                                        value={
                                            name
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            setName(
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                        placeholder="Your name"
                                        className="h-12 flex-1 bg-transparent text-xs font-bold outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="register-email"
                                    className="text-[8px] font-black uppercase tracking-[0.15em] text-[#74807b]"
                                >
                                    Email
                                </label>

                                <div className="mt-2 flex items-center gap-2 rounded-[16px] bg-[#fbfaf5] px-4 ring-1 ring-inset ring-[#123c35]/8 focus-within:ring-[#ef713d]/35">
                                    <Mail className="h-4 w-4 text-[#9aa39f]" />

                                    <input
                                        id="register-email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        value={
                                            email
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            setEmail(
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                        placeholder="you@example.com"
                                        className="h-12 flex-1 bg-transparent text-xs font-bold outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="register-password"
                                    className="text-[8px] font-black uppercase tracking-[0.15em] text-[#74807b]"
                                >
                                    Password
                                </label>

                                <div className="mt-2 flex items-center rounded-[16px] bg-[#fbfaf5] px-4 ring-1 ring-inset ring-[#123c35]/8 focus-within:ring-[#ef713d]/35">
                                    <input
                                        id="register-password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        required
                                        minLength={
                                            8
                                        }
                                        autoComplete="new-password"
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
                                        placeholder="At least 8 characters"
                                        className="h-12 flex-1 bg-transparent text-xs font-bold outline-none"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (
                                                    current,
                                                ) =>
                                                    !current,
                                            )
                                        }
                                        className="text-[#8d9792]"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={
                                    loading ||
                                    googleLoading
                                }
                                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#ef713d] text-[10px] font-black text-white shadow-[0_12px_30px_rgba(239,113,61,0.18)] transition hover:-translate-y-0.5 hover:bg-[#e26134] disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <ArrowRight className="h-4 w-4" />
                                )}

                                {loading
                                    ? "Creating account..."
                                    : "Start my journey"}
                            </button>
                        </form>

                        <div className="mt-5 flex items-center justify-center gap-1.5 text-[7px] text-[#9aa39f]">
                            <ShieldCheck className="h-3 w-3" />

                            Your travel memory is private by default.
                        </div>

                        <p className="mt-5 text-center text-[9px] text-[#89948f]">
                            Already have an account?{" "}
                            <Link
                                href="/auth/signin"
                                className="font-black text-[#123c35] underline decoration-[#e8f58d] decoration-2 underline-offset-2"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}