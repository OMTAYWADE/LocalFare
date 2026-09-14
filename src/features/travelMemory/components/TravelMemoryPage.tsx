"use client";

import {
    AlertTriangle,
    ArrowRight,
    Camera,
    Check,
    ChevronDown,
    Compass,
    ExternalLink,
    Link2,
    Loader2,
    MapPin,
    Play,
    ShieldCheck,
    Sparkles,
    Video,
    Wallet,
    type LucideIcon,
} from "lucide-react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import AppHeader from "@/components/layout/AppHeader";
import JourneyDecisionDialog from "./JourneyDecisionDialog";
import JourneyMap from "./JourneyMap";

import type {
    ExtractedTravelContent,
    JourneyDetail,
    JourneySummary,
    SaveJourneySourceResponse,
} from "../types/travelMemory.types";

interface PreviewContent {
    contentId: string;
    title: string;
    description: string;
    publishedAt?: string;
    channelTitle?: string;
    thumbnailUrl?: string;
    sourceUrl: string;
}

interface PreviewResponse {
    source: {
        platform: "youtube" | "instagram";
        sourceType: string;
    };
    supported: boolean;
    latest?: PreviewContent;
    message?: string;
    error?: string;
}

interface AnalyzeResponse {
    content?: PreviewContent;
    extracted?: ExtractedTravelContent;
    error?: string;
}

interface JourneyListResponse {
    journeys?: JourneySummary[];
    error?: string;
}

function platformFromUrl(
    value: string,
): "youtube" | "instagram" | null {
    try {
        const hostname = new URL(value)
            .hostname
            .toLowerCase()
            .replace(/^www\./, "");

        if (
            hostname.includes("youtube.com") ||
            hostname === "youtu.be"
        ) {
            return "youtube";
        }

        if (hostname.includes("instagram.com")) {
            return "instagram";
        }
    } catch {
        return null;
    }

    return null;
}

function formatDate(value?: string) {
    if (!value) {
        return "Recent travel content";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Recent travel content";
    }

    return new Intl.DateTimeFormat(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        },
    ).format(date);
}

function money(value?: number) {
    if (value === undefined) {
        return "—";
    }

    return `₹${value.toLocaleString("en-IN")}`;
}

function typeLabel(
    type: ExtractedTravelContent["experiences"][number]["experienceType"],
) {
    switch (type) {
        case "reported-scam":
            return "Reported scam";

        case "possible-overcharge":
            return "Possible overcharge";

        case "warning":
            return "Travel warning";

        case "positive":
            return "Good experience";

        case "negative":
            return "Bad experience";

        default:
            return "Travel note";
    }
}

export default function TravelMemoryPage() {
    const router = useRouter();
    const rootRef = useRef<HTMLElement>(null);
    const sourceRef = useRef<HTMLDivElement>(null);

    const {
        data: session,
        status: sessionStatus,
    } = useSession();

    const [url, setUrl] = useState("");
    const [transcript, setTranscript] = useState("");

    const [preview, setPreview] =
        useState<PreviewContent | null>(null);

    const [result, setResult] =
        useState<ExtractedTravelContent | null>(null);

    const [instagramMessage, setInstagramMessage] =
        useState("");

    const [error, setError] = useState("");
    const [savedSourceMessage, setSavedSourceMessage] =
        useState("");

    const [loadingPreview, setLoadingPreview] =
        useState(false);

    const [loadingAnalysis, setLoadingAnalysis] =
        useState(false);

    const [journeys, setJourneys] =
        useState<JourneySummary[]>([]);

    const [loadingJourneys, setLoadingJourneys] =
        useState(false);

    const [journeyDialogOpen, setJourneyDialogOpen] =
        useState(false);

    const [savingToJourney, setSavingToJourney] =
        useState(false);

    const [selectedJourney, setSelectedJourney] =
        useState<JourneyDetail | null>(null);

    const [activeJourney, setActiveJourney] =
        useState<JourneySummary | null>(null);

    const [loadingJourneyDetail, setLoadingJourneyDetail] =
        useState(false);

    const [expanded, setExpanded] =
        useState<number | null>(0);

    const isAuthenticated =
        sessionStatus === "authenticated" &&
        Boolean(session?.user);

    function redirectToLogin() {
        if (typeof window === "undefined") {
            return;
        }

        const callbackUrl =
            `${window.location.pathname}${window.location.search}`;

        router.replace(
            `/auth/signin?callbackUrl=${encodeURIComponent(
                callbackUrl,
            )}`,
        );
    }

    function handleUnauthorized() {
        setJourneyDialogOpen(false);
        setSavingToJourney(false);
        redirectToLogin();
    }

    async function readJson<T>(
        response: Response,
    ): Promise<T> {
        const data = await response
            .json()
            .catch(() => ({}));

        if (response.status === 401) {
            handleUnauthorized();
        }

        return data as T;
    }

    /*
     * PAGE ANIMATION
     */

    useEffect(() => {
        if (!rootRef.current) {
            return;
        }

        const ctx = gsap.context(() => {
            const timeline =
                gsap.timeline({
                    defaults: {
                        ease: "power3.out",
                    },
                });

            timeline
                .fromTo(
                    "[data-app-header]",
                    {
                        opacity: 0,
                        y: -18,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.55,
                        ease: "power3.out",
                    },
                )
                .fromTo(
                    "[data-hero-badge]",
                    {
                        opacity: 0,
                        y: 12,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.45,
                    },
                )
                .fromTo(
                    "[data-hero-title]",
                    {
                        opacity: 0,
                        y: 28,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.7,
                    },
                    "-=0.2",
                )
                .fromTo(
                    "[data-hero-copy]",
                    {
                        opacity: 0,
                        y: 18,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                    },
                    "-=0.35",
                )
                .fromTo(
                    "[data-hero-card]",
                    {
                        opacity: 0,
                        y: 28,
                        scale: 0.98,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.65,
                    },
                    "-=0.2",
                );

            gsap.fromTo(
                "[data-section]",
                {
                    opacity: 0,
                    y: 24,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.65,
                    delay: 0.25,
                    stagger: 0.09,
                    ease: "power3.out",
                    clearProps: "transform,opacity",
                },
            );

            gsap.to(
                "[data-orb]",
                {
                    y: -12,
                    x: 8,
                    duration: 3.5,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                },
            );

            gsap.to(
                "[data-orbit]",
                {
                    rotation: 360,
                    duration: 22,
                    repeat: -1,
                    ease: "none",
                },
            );
        }, rootRef);

        return () => ctx.revert();
    }, []);

    /*
     * PREVIEW ANIMATION
     */

    useEffect(() => {
        if (
            !sourceRef.current ||
            !preview
        ) {
            return;
        }

        const ctx = gsap.context(() => {
            gsap.fromTo(
                sourceRef.current,
                {
                    opacity: 0,
                    y: 20,
                    scale: 0.985,
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.55,
                    ease: "back.out(1.3)",
                },
            );
        }, sourceRef);

        return () => ctx.revert();
    }, [preview]);

    /*
     * RESULT ANIMATION
     */

    useEffect(() => {
        if (
            !result ||
            !rootRef.current
        ) {
            return;
        }

        const cards =
            rootRef.current.querySelectorAll(
                "[data-result-card]",
            );

        gsap.fromTo(
            cards,
            {
                opacity: 0,
                y: 20,
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.07,
                ease: "power3.out",
                clearProps:
                    "transform,opacity",
            },
        );
    }, [result]);

    /*
     * LOAD JOURNEYS
     */

    async function loadJourneys() {
        if (!isAuthenticated) {
            return;
        }

        setLoadingJourneys(true);

        try {
            const response =
                await fetch(
                    "/api/journal/journeys",
                    {
                        method: "GET",
                        cache: "no-store",
                    },
                );

            const data =
                await readJson<JourneyListResponse>(
                    response,
                );

            if (
                response.status === 401
            ) {
                return;
            }

            if (!response.ok) {
                throw new Error(
                    data.error ??
                        "Unable to load saved journeys.",
                );
            }

            const loaded =
                data.journeys ?? [];

            setJourneys(
                loaded,
            );

            /*
             * Restore the currently selected
             * journey after a page reload.
             */
            if (
                selectedJourney
            ) {
                const matching =
                    loaded.find(
                        (item) =>
                            item.id ===
                            selectedJourney.id,
                    );

                if (matching) {
                    setActiveJourney(
                        matching,
                    );

                    return;
                }
            }

            /*
             * If there is no selected journey,
             * open the first saved journey.
             */
            if (
                !selectedJourney &&
                loaded.length > 0
            ) {
                setActiveJourney(
                    loaded[0],
                );

                void loadJourneyDetail(
                    loaded[0].id,
                );
            }
        } catch (journeyError) {
            setError(
                journeyError instanceof Error
                    ? journeyError.message
                    : "Unable to load saved journeys.",
            );
        } finally {
            setLoadingJourneys(false);
        }
    }

    useEffect(() => {
        if (
            sessionStatus !==
            "authenticated"
        ) {
            return;
        }

        void loadJourneys();
    }, [
        sessionStatus,
    ]);

    /*
     * LOAD COMPLETE JOURNEY
     */

    async function loadJourneyDetail(
        tripId: string,
    ) {
        if (!tripId) {
            return;
        }

        setLoadingJourneyDetail(
            true,
        );

        try {
            const response =
                await fetch(
                    `/api/journal/journeys/${tripId}`,
                    {
                        method: "GET",
                        cache: "no-store",
                    },
                );

            const data =
                await readJson<{
                    journey?: JourneyDetail;
                    trip?: JourneyDetail;
                    error?: string;
                }>(response);

            if (
                response.status === 401
            ) {
                return;
            }

            if (!response.ok) {
                throw new Error(
                    data.error ??
                        "Unable to open this journey.",
                );
            }

            const detail =
                data.journey ??
                data.trip;

            if (!detail) {
                throw new Error(
                    "Journey details were not returned.",
                );
            }

            setSelectedJourney(
                detail,
            );

            setActiveJourney({
                id: detail.id,
                name: detail.name,
                status: detail.status,
                sourceCount:
                    detail.sourceCount,
                placeCount:
                    detail.placeCount,
                routeCount:
                    detail.routeCount,
                expenseCount:
                    detail.expenseCount,
                totalKnownSpendInr:
                    detail.totalKnownSpendInr,
                startDate:
                    detail.startDate,
                endDate:
                    detail.endDate,
                createdAt:
                    detail.createdAt,
                updatedAt:
                    detail.updatedAt,
            });

            setJourneys(
                (current) =>
                    current.map(
                        (item) =>
                            item.id ===
                            detail.id
                                ? {
                                      ...item,
                                      ...detail,
                                  }
                                : item,
                    ),
            );
        } catch (journeyError) {
            setError(
                journeyError instanceof Error
                    ? journeyError.message
                    : "Unable to open this journey.",
            );
        } finally {
            setLoadingJourneyDetail(
                false,
            );
        }
    }

    /*
     * SELECT EXISTING JOURNEY
     */

    async function selectJourney(
        journey: JourneySummary,
    ) {
        setError("");

        setActiveJourney(
            journey,
        );

        await loadJourneyDetail(
            journey.id,
        );
    }

    /*
     * SAVE SOURCE TO EXISTING JOURNEY
     */

    async function saveAnalysisToJourney(
        journey: JourneySummary,
    ) {
        if (
            !result ||
            !preview
        ) {
            setError(
                "Analyze the travel source before saving it.",
            );

            return false;
        }

        if (savingToJourney) {
            return false;
        }

        setSavingToJourney(
            true,
        );

        setError("");
        setSavedSourceMessage("");

        try {
            const response =
                await fetch(
                    `/api/journal/journeys/${journey.id}/sources`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            url:
                                preview.sourceUrl,

                            transcript:
                                transcript.trim() ||
                                undefined,

                            extracted:
                                result,

                            content:
                                preview,
                        }),
                    },
                );

            const data =
                await readJson<
                    Partial<SaveJourneySourceResponse> & {
                        error?: string;
                    }
                >(response);

            if (
                response.status === 401
            ) {
                return false;
            }

            if (
                !response.ok ||
                !data.trip
            ) {
                throw new Error(
                    data.error ??
                        "Could not save this source.",
                );
            }

            /*
             * Close the dialog FIRST.
             * Then load the authoritative
             * journey from the database.
             */

            setJourneyDialogOpen(
                false,
            );

            setJourneys(
                (current) => [
                    data.trip!,
                    ...current.filter(
                        (item) =>
                            item.id !==
                            data.trip!.id,
                    ),
                ],
            );

            setSavedSourceMessage(
                `Added this source to "${data.trip.name}".`,
            );

            await loadJourneyDetail(
                data.trip.id,
            );

            return true;
        } catch (saveError) {
            setError(
                saveError instanceof Error
                    ? saveError.message
                    : "Could not save this source.",
            );

            return false;
        } finally {
            setSavingToJourney(
                false,
            );
        }
    }

    /*
     * CREATE NEW JOURNEY
     *
     * This still uses the existing API contract.
     * After creation we immediately append the
     * analyzed source and then reload the complete
     * journey.
     */

    async function createJourneyAndSave(
        name: string,
    ) {
        if (
            !result ||
            !preview
        ) {
            setError(
                "Analyze the travel source before creating a journey.",
            );

            return;
        }

        const cleanName =
            name.trim();

        if (!cleanName) {
            setError(
                "Please enter a journey name.",
            );

            return;
        }

        if (savingToJourney) {
            return;
        }

        setSavingToJourney(
            true,
        );

        setError("");
        setSavedSourceMessage("");

        try {
            const createResponse =
                await fetch(
                    "/api/journal/journeys",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            name: cleanName,
                        }),
                    },
                );

            const createData =
                await readJson<{
                    trip?: JourneySummary;
                    journey?: JourneySummary;
                    error?: string;
                }>(
                    createResponse,
                );

            if (
                createResponse.status ===
                401
            ) {
                return;
            }

            if (
                !createResponse.ok
            ) {
                throw new Error(
                    createData.error ??
                        "Could not create the journey.",
                );
            }

            const created =
                createData.trip ??
                createData.journey;

            if (!created) {
                throw new Error(
                    "The journey was created but its details were not returned.",
                );
            }

            /*
             * Immediately save the source.
             */

            const sourceResponse =
                await fetch(
                    `/api/journal/journeys/${created.id}/sources`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            url:
                                preview.sourceUrl,

                            transcript:
                                transcript.trim() ||
                                undefined,

                            extracted:
                                result,

                            content:
                                preview,
                        }),
                    },
                );

            const sourceData =
                await readJson<
                    Partial<SaveJourneySourceResponse> & {
                        error?: string;
                    }
                >(
                    sourceResponse,
                );

            if (
                sourceResponse.status ===
                401
            ) {
                return;
            }

            if (
                !sourceResponse.ok ||
                !sourceData.trip
            ) {
                throw new Error(
                    sourceData.error ??
                        "The journey was created, but the source could not be added.",
                );
            }

            /*
             * Update list.
             */

            setJourneys(
                (current) => [
                    sourceData.trip!,
                    ...current.filter(
                        (item) =>
                            item.id !==
                            sourceData.trip!.id,
                    ),
                ],
            );

            /*
             * Close modal before loading
             * the map.
             */

            setJourneyDialogOpen(
                false,
            );

            setSavedSourceMessage(
                `Created "${sourceData.trip.name}" and added this source.`,
            );

            /*
             * IMPORTANT:
             * fetch complete database state.
             */

            await loadJourneyDetail(
                sourceData.trip.id,
            );
        } catch (createError) {
            setError(
                createError instanceof Error
                    ? createError.message
                    : "Could not create the journey.",
            );
        } finally {
            setSavingToJourney(
                false,
            );
        }
    }

    function openJourneyDecision() {
        if (
            sessionStatus ===
            "unauthenticated"
        ) {
            redirectToLogin();
            return;
        }

        if (
            sessionStatus ===
            "loading"
        ) {
            return;
        }

        setError("");
        setSavedSourceMessage("");

        setJourneyDialogOpen(
            true,
        );

        void loadJourneys();
    }

    /*
     * PREVIEW
     */

    async function previewSource() {
        if (
            sessionStatus !==
            "authenticated"
        ) {
            redirectToLogin();
            return;
        }

        setError("");
        setResult(null);
        setPreview(null);
        setInstagramMessage("");

        if (!url.trim()) {
            setError(
                "Paste a YouTube or Instagram URL first.",
            );

            return;
        }

        setLoadingPreview(
            true,
        );

        try {
            const response =
                await fetch(
                    "/api/journal/source/preview",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            url: url.trim(),
                        }),
                    },
                );

            const data =
                await readJson<PreviewResponse>(
                    response,
                );

            if (
                response.status ===
                401
            ) {
                return;
            }

            if (!response.ok) {
                throw new Error(
                    data.error ??
                        "Could not read this source.",
                );
            }

            if (!data.supported) {
                setInstagramMessage(
                    data.message ??
                        "Instagram content needs a supported connector.",
                );

                return;
            }

            setPreview(
                data.latest ??
                    null,
            );
        } catch (previewError) {
            setError(
                previewError instanceof Error
                    ? previewError.message
                    : "Could not preview this source.",
            );
        } finally {
            setLoadingPreview(
                false,
            );
        }
    }

    /*
     * ANALYZE
     */

    async function analyzeSource() {
        if (
            sessionStatus !==
            "authenticated"
        ) {
            redirectToLogin();
            return;
        }

        if (!preview) {
            setError(
                "Preview the source first.",
            );

            return;
        }

        setError("");
        setLoadingAnalysis(
            true,
        );

        try {
            const response =
                await fetch(
                    "/api/journal/analyze",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            url:
                                url.trim(),

                            transcript:
                                transcript.trim() ||
                                undefined,
                        }),
                    },
                );

            const data =
                await readJson<AnalyzeResponse>(
                    response,
                );

            if (
                response.status ===
                401
            ) {
                return;
            }

            if (!response.ok) {
                throw new Error(
                    data.error ??
                        "Analysis failed.",
                );
            }

            if (!data.extracted) {
                throw new Error(
                    "FairTrip received no journey data.",
                );
            }

            setResult(
                data.extracted,
            );

            setExpanded(0);

            /*
             * Only now ask where the
             * analyzed source belongs.
             */

            setJourneyDialogOpen(
                true,
            );

            void loadJourneys();
        } catch (analysisError) {
            setError(
                analysisError instanceof Error
                    ? analysisError.message
                    : "Unable to analyze this travel content.",
            );
        } finally {
            setLoadingAnalysis(
                false,
            );
        }
    }

    if (
        sessionStatus ===
        "loading"
    ) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#f5f1e8]">
                <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-[#ef713d]" />
                    <span className="text-[10px] font-black text-[#123c35]">
                        Restoring your FairTrip session…
                    </span>
                </div>
            </main>
        );
    }

    if (
        sessionStatus ===
        "unauthenticated"
    ) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#f5f1e8]">
                <Loader2 className="h-5 w-5 animate-spin text-[#ef713d]" />
            </main>
        );
    }

    const platform =
        platformFromUrl(url);

    const experiences =
        result?.experiences ??
        [];

    const warningCount =
        experiences.filter(
            (item) =>
                item.experienceType ===
                    "possible-overcharge" ||
                item.experienceType ===
                    "reported-scam",
        ).length;

    return (
        <main
            ref={rootRef}
            className="min-h-screen overflow-hidden bg-[#f5f1e8] text-[#123c35]"
        >
            <div
                data-app-header
                className="relative z-50 px-3 pt-2 sm:px-5 sm:pt-3 lg:px-6"
            >
                <AppHeader />
            </div>

            <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
                <div
                    data-orb
                    className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-[#e8f58d]/35 blur-3xl"
                />

                <div className="absolute -left-32 bottom-20 h-80 w-80 rounded-full bg-[#ef713d]/10 blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto max-w-[1240px] px-4 pb-5 sm:px-6 lg:px-8">

                {/* HERO */}

                <section
                    data-section
                    className="grid gap-7 pb-8 pt-5 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-12 lg:pb-12 lg:pt-8"
                >
                    <div>
                        <div
                            data-hero-badge
                            className="inline-flex items-center gap-2 rounded-full border border-[#123c35]/10 bg-white px-3 py-2 text-[9px] font-black uppercase tracking-[0.18em] shadow-sm"
                        >
                            <Sparkles className="h-3.5 w-3.5 text-[#ef713d]" />
                            Traveler Memory
                        </div>

                        <h1
                            data-hero-title
                            className="mt-5 max-w-2xl text-[3.4rem] font-black leading-[0.9] tracking-[-0.065em] sm:text-6xl lg:text-[5.25rem]"
                        >
                            Your trip,
                            <br />
                            <span className="text-[#ef713d]">
                                remembered.
                            </span>
                        </h1>

                        <p
                            data-hero-copy
                            className="mt-5 max-w-xl text-sm leading-7 text-[#66736e] sm:text-base"
                        >
                            Paste a travel vlog and FairTrip turns
                            the experience into a private journey
                            memory — places, routes, spending and
                            useful warnings.
                        </p>

                        <div className="mt-7 flex flex-wrap gap-2">
                            {([
                                [
                                    ShieldCheck,
                                    "Private by default",
                                ],
                                [
                                    MapPin,
                                    "Places + routes",
                                ],
                                [
                                    AlertTriangle,
                                    "Evidence-aware warnings",
                                ],
                            ] as [
                                LucideIcon,
                                string,
                            ][]).map(
                                ([
                                    Icon,
                                    label,
                                ]) => (
                                    <span
                                        key={label}
                                        data-step
                                        className="inline-flex items-center gap-2 rounded-full border border-[#123c35]/10 bg-white/80 px-3 py-2 text-[10px] font-black"
                                    >
                                        <Icon className="h-3.5 w-3.5 text-[#ef713d]" />
                                        {label}
                                    </span>
                                ),
                            )}
                        </div>
                    </div>

                    <div
                        data-hero-card
                        className="relative"
                    >
                        <div className="absolute -inset-4 rounded-[42px] bg-[#123c35]/5 blur-2xl" />

                        <div className="relative overflow-hidden rounded-[34px] border border-[#123c35]/10 bg-[#123c35] p-5 text-white shadow-[0_30px_90px_rgba(18,60,53,0.18)] sm:p-7">
                            <div
                                className="absolute right-[-35px] top-[-35px] h-40 w-40 rounded-full border border-[#e8f58d]/15"
                                data-orbit
                            />

                            <div className="relative">
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#cbe95b]">
                                        FairTrip memory engine
                                    </span>

                                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-bold text-white/60">
                                        STEP 01
                                    </span>
                                </div>

                                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                                    {([
                                        [
                                            Link2,
                                            "Paste",
                                            "Your vlog",
                                        ],
                                        [
                                            Sparkles,
                                            "Understand",
                                            "AI extracts",
                                        ],
                                        [
                                            Compass,
                                            "Remember",
                                            "Trip memory",
                                        ],
                                    ] as [
                                        LucideIcon,
                                        string,
                                        string,
                                    ][]).map(
                                        ([
                                            Icon,
                                            title,
                                            copy,
                                        ]) => (
                                            <div
                                                key={
                                                    title
                                                }
                                                className="rounded-[22px] border border-white/10 bg-white/[0.06] p-4"
                                            >
                                                <Icon className="h-4 w-4 text-[#e8f58d]" />

                                                <p className="mt-7 text-xs font-black">
                                                    {
                                                        title
                                                    }
                                                </p>

                                                <p className="mt-1 text-[10px] text-white/45">
                                                    {
                                                        copy
                                                    }
                                                </p>
                                            </div>
                                        ),
                                    )}
                                </div>

                                <div className="mt-4 rounded-[22px] bg-[#e8f58d] p-4 text-[#123c35]">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#123c35] text-[#e8f58d]">
                                            <ShieldCheck className="h-4 w-4" />
                                        </div>

                                        <div>
                                            <p className="text-xs font-black">
                                                Public warnings are not automatic
                                            </p>

                                            <p className="mt-1 text-[10px] leading-5 text-[#31544d]">
                                                One traveler report becomes
                                                evidence, not a verdict.
                                                FairTrip keeps your journal
                                                private until you choose what
                                                to share.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CURRENT JOURNEY */}

                {activeJourney && (
                    <section data-section className="mb-5 rounded-[24px] border border-[#123c35]/10 bg-[#123c35] p-4 text-white shadow-[0_16px_45px_rgba(18,60,53,0.12)]">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8f58d] text-[#123c35]">
                                    <Compass className="h-4 w-4" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[8px] font-black uppercase tracking-[0.17em] text-[#cbe95b]">
                                        Current journey
                                    </p>

                                    <p className="truncate text-sm font-black">
                                        {
                                            activeJourney.name
                                        }
                                    </p>

                                    <p className="mt-0.5 text-[9px] text-white/45">
                                        {
                                            activeJourney.sourceCount
                                        }{" "}
                                        source
                                        {activeJourney.sourceCount ===
                                        1
                                            ? ""
                                            : "s"}{" "}
                                        ·{" "}
                                        {
                                            activeJourney.placeCount
                                        }{" "}
                                        places · ₹
                                        {activeJourney.totalKnownSpendInr.toLocaleString(
                                            "en-IN",
                                        )}{" "}
                                        known
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    openJourneyDecision
                                }
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-white/10 px-4 text-[9px] font-black text-white transition hover:bg-white/15"
                            >
                                Add another source

                                <ArrowRight className="h-3.5 w-3.5 text-[#e8f58d]" />
                            </button>
                        </div>
                    </section>
                )}

                {/* SAVED JOURNEYS */}

                {journeys.length > 0 && (
                    <section data-section className="mb-6 rounded-[30px] border border-[#123c35]/10 bg-white p-4 shadow-[0_18px_60px_rgba(18,60,53,0.07)] sm:p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#ef713d]">
                                    Saved journeys
                                </p>

                                <h2 className="mt-1 text-xl font-black tracking-[-0.04em]">
                                    Pick a journey to view its map
                                </h2>
                            </div>

                            <span className="text-[9px] font-bold text-[#87918d]">
                                Stored in your FairTrip account
                            </span>
                        </div>

                        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                            {journeys.map(
                                (journey) => {
                                    const active =
                                        selectedJourney?.id ===
                                        journey.id;

                                    return (
                                        <button
                                            key={
                                                journey.id
                                            }
                                            type="button"
                                            onClick={() =>
                                                void selectJourney(
                                                    journey,
                                                )
                                            }
                                            disabled={
                                                loadingJourneyDetail
                                            }
                                            className={[
                                                "min-w-[210px] rounded-[20px] border p-4 text-left transition",
                                                active
                                                    ? "border-[#123c35] bg-[#123c35] text-white"
                                                    : "border-[#123c35]/8 bg-[#fbfaf5] text-[#123c35] hover:-translate-y-0.5 hover:bg-white",
                                            ].join(
                                                " ",
                                            )}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="truncate text-xs font-black">
                                                    {
                                                        journey.name
                                                    }
                                                </span>

                                                {active ? (
                                                    <Check className="h-3.5 w-3.5 text-[#e8f58d]" />
                                                ) : (
                                                    <ArrowRight className="h-3.5 w-3.5 text-[#87918d]" />
                                                )}
                                            </div>

                                            <p
                                                className={[
                                                    "mt-2 text-[9px] font-bold",
                                                    active
                                                        ? "text-white/50"
                                                        : "text-[#87918d]",
                                                ].join(
                                                    " ",
                                                )}
                                            >
                                                {
                                                    journey.sourceCount
                                                }{" "}
                                                source
                                                {journey.sourceCount ===
                                                1
                                                    ? ""
                                                    : "s"}{" "}
                                                ·{" "}
                                                {
                                                    journey.placeCount
                                                }{" "}
                                                places
                                            </p>
                                        </button>
                                    );
                                },
                            )}
                        </div>
                    </section>
                )}

                {/* JOURNEY MAP */}

                {selectedJourney && (
                    <section data-section className="mb-7">
                        {loadingJourneyDetail ? (
                            <div className="flex h-[300px] items-center justify-center rounded-[30px] bg-white">
                                <Loader2 className="h-6 w-6 animate-spin text-[#ef713d]" />
                            </div>
                        ) : (
                            <JourneyMap
                                journey={
                                    selectedJourney
                                }
                            />
                        )}
                    </section>
                )}

                {/* SAVE MESSAGE */}

                {savedSourceMessage && (
                    <div className="mb-5 flex items-center gap-2 rounded-[18px] border border-[#123c35]/10 bg-[#eef4d7] px-4 py-3 text-[10px] font-bold text-[#52624f]">
                        <Check className="h-4 w-4 text-[#123c35]" />

                        {
                            savedSourceMessage
                        }
                    </div>
                )}

                {/* MAIN WORKSPACE */}

                <section data-section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">

                    {/* SOURCE */}

                    <div className="rounded-[32px] border border-[#123c35]/10 bg-white p-5 shadow-[0_18px_60px_rgba(18,60,53,0.07)] sm:p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#ef713d]">
                                    01 · Add a source
                                </p>

                                <h2 className="mt-1 text-xl font-black tracking-[-0.04em]">
                                    Bring in your travel story
                                </h2>
                            </div>

                            {platform && (
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7f3ea]">
                                    {platform ===
                                    "youtube" ? (
                                        <Video className="h-4 w-4 text-[#ef4135]" />
                                    ) : (
                                        <Camera className="h-4 w-4 text-[#ef713d]" />
                                    )}
                                </div>
                            )}
                        </div>

                        <label className="mt-6 block text-[9px] font-black uppercase tracking-[0.16em] text-[#74807b]">
                            YouTube / Instagram URL
                        </label>

                        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[18px] bg-[#fbfaf5] px-4 ring-1 ring-inset ring-[#123c35]/8 focus-within:ring-[#ef713d]/35">
                                <Link2 className="h-4 w-4 shrink-0 text-[#8b9691]" />

                                <input
                                    value={
                                        url
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        setUrl(
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                    onKeyDown={(
                                        event,
                                    ) => {
                                        if (
                                            event.key ===
                                            "Enter"
                                        ) {
                                            void previewSource();
                                        }
                                    }}
                                    placeholder="youtube.com/watch?v=..."
                                    className="h-12 min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-[#a1aaa6]"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    void previewSource()
                                }
                                disabled={
                                    loadingPreview
                                }
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-[18px] bg-[#123c35] px-5 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-[#0d312b] disabled:opacity-50"
                            >
                                {loadingPreview ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <ArrowRight className="h-4 w-4" />
                                )}

                                Preview
                            </button>
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-[10px] text-[#7c8782]">
                            <ShieldCheck className="h-3.5 w-3.5 text-[#123c35]" />

                            Nothing is published from this screen.
                        </div>

                        {instagramMessage && (
                            <div className="mt-4 rounded-[20px] border border-[#ef713d]/20 bg-[#fff7f2] p-4 text-xs leading-5 text-[#81543f]">
                                <div className="flex gap-2">
                                    <Camera className="mt-0.5 h-4 w-4 shrink-0 text-[#ef713d]" />

                                    <span>
                                        {
                                            instagramMessage
                                        }
                                    </span>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="mt-4 rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold leading-5 text-red-700">
                                {error}
                            </div>
                        )}

                        {preview && (
                            <div
                                ref={
                                    sourceRef
                                }
                                className="mt-5 rounded-[24px] bg-[#fbfaf5] p-4"
                            >
                                <div className="flex gap-4">
                                    {preview.thumbnailUrl ? (
                                        <img
                                            src={
                                                preview.thumbnailUrl
                                            }
                                            alt=""
                                            className="h-24 w-36 rounded-[18px] object-cover sm:h-28 sm:w-44"
                                        />
                                    ) : (
                                        <div className="flex h-24 w-36 items-center justify-center rounded-[18px] bg-[#123c35] text-[#e8f58d] sm:h-28 sm:w-44">
                                            <Play className="h-6 w-6 fill-current" />
                                        </div>
                                    )}

                                    <div className="min-w-0 flex-1">
                                        <p className="text-[8px] font-black uppercase tracking-[0.15em] text-[#ef713d]">
                                            Latest accessible content
                                        </p>

                                        <h3 className="mt-1 line-clamp-3 text-sm font-black leading-5">
                                            {
                                                preview.title
                                            }
                                        </h3>

                                        <p className="mt-2 text-[9px] text-[#7d8883]">
                                            {
                                                preview.channelTitle ??
                                                    "YouTube"
                                            }{" "}
                                            ·{" "}
                                            {formatDate(
                                                preview.publishedAt,
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 rounded-[18px] bg-white p-4">
                                    <p className="text-[8px] font-black uppercase tracking-[0.16em] text-[#7d8883]">
                                        Description
                                    </p>

                                    <p className="mt-2 line-clamp-6 text-[10px] leading-5 text-[#68756f]">
                                        {
                                            preview.description
                                        }
                                    </p>
                                </div>

                                <a
                                    href={
                                        preview.sourceUrl
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-4 inline-flex items-center gap-2 text-[9px] font-black text-[#123c35] underline decoration-[#ef713d]/50 underline-offset-4"
                                >
                                    Open original content

                                    <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                            </div>
                        )}

                        <div className="mt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#74807b]">
                                        Optional transcript
                                    </p>

                                    <p className="mt-1 text-[9px] text-[#8b9691]">
                                        Best for spoken fares, routes and incidents.
                                    </p>
                                </div>

                                <span className="rounded-full bg-[#f7f3ea] px-2.5 py-1 text-[7px] font-black uppercase tracking-[0.1em] text-[#7d8883]">
                                    Optional
                                </span>
                            </div>

                            <textarea
                                value={
                                    transcript
                                }
                                onChange={(
                                    event,
                                ) =>
                                    setTranscript(
                                        event
                                            .target
                                            .value,
                                    )
                                }
                                placeholder="Paste a transcript or caption here if you have it..."
                                className="mt-3 min-h-[130px] w-full resize-y rounded-[20px] bg-[#fbfaf5] p-4 text-xs leading-6 outline-none ring-1 ring-inset ring-[#123c35]/8 focus:ring-[#ef713d]/35"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                void analyzeSource()
                            }
                            disabled={
                                !preview ||
                                loadingAnalysis
                            }
                            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#ef713d] px-5 text-xs font-black text-white shadow-[0_14px_35px_rgba(239,113,61,0.18)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {loadingAnalysis ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Sparkles className="h-4 w-4" />
                            )}

                            {loadingAnalysis
                                ? "Understanding your journey..."
                                : "Build my travel memory"}
                        </button>
                    </div>

                    {/* RESULT */}

                    <div className="rounded-[32px] border border-[#123c35]/10 bg-white p-5 shadow-[0_18px_60px_rgba(18,60,53,0.07)] sm:p-6">
                        {result ? (
                            <>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#ef713d]">
                                        02 · Your memory
                                    </p>

                                    <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                        <div>
                                            <h2 className="text-2xl font-black tracking-[-0.05em]">
                                                {
                                                    result.trip.title
                                                }
                                            </h2>

                                            <p className="mt-1 text-[10px] text-[#87918d]">
                                                {result.trip.city ??
                                                    "Travel journey"}
                                                {result.trip.country
                                                    ? `, ${result.trip.country}`
                                                    : ""}
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            <span className="rounded-full bg-[#e8f58d] px-3 py-2 text-[8px] font-black">
                                                {
                                                    result.totals
                                                        .placesVisited
                                                }{" "}
                                                places
                                            </span>

                                            <span className="rounded-full bg-[#f7f3ea] px-3 py-2 text-[8px] font-black">
                                                {
                                                    result.totals
                                                        .routeCount
                                                }{" "}
                                                routes
                                            </span>
                                        </div>
                                    </div>

                                    <p className="mt-4 rounded-[20px] bg-[#fbfaf5] p-4 text-xs leading-6 text-[#68756f]">
                                        {
                                            result.trip.summary
                                        }
                                    </p>
                                </div>

                                <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
    <div
        data-result-card
        className="rounded-[20px] border border-[#123c35]/8 bg-[#fbfaf5] p-4"
    >
        <MapPin className="h-4 w-4 text-[#ef713d]" />

        <p className="mt-4 text-lg font-black">
            {result.totals.placesVisited}
        </p>

        <p className="mt-1 text-[7px] font-black uppercase tracking-[0.13em] text-[#8a9590]">
            Places
        </p>
    </div>

    <div
        data-result-card
        className="rounded-[20px] border border-[#123c35]/8 bg-[#fbfaf5] p-4"
    >
        <Compass className="h-4 w-4 text-[#ef713d]" />

        <p className="mt-4 text-lg font-black">
            {result.totals.routeCount}
        </p>

        <p className="mt-1 text-[7px] font-black uppercase tracking-[0.13em] text-[#8a9590]">
            Routes
        </p>
    </div>

    <div
        data-result-card
        className="rounded-[20px] border border-[#123c35]/8 bg-[#fbfaf5] p-4"
    >
        <Wallet className="h-4 w-4 text-[#ef713d]" />

        <p className="mt-4 text-lg font-black">
            ₹
            {result.totals.totalKnownSpend.toLocaleString(
                "en-IN",
            )}
        </p>

        <p className="mt-1 text-[7px] font-black uppercase tracking-[0.13em] text-[#8a9590]">
            Known spend
        </p>
    </div>

    <div
        data-result-card
        className="rounded-[20px] border border-[#123c35]/8 bg-[#fbfaf5] p-4"
    >
        <AlertTriangle className="h-4 w-4 text-[#ef713d]" />

        <p className="mt-4 text-lg font-black">
            {warningCount}
        </p>

        <p className="mt-1 text-[7px] font-black uppercase tracking-[0.13em] text-[#8a9590]">
            Risk notes
        </p>
    </div>
</div>

                                <div className="mt-5 space-y-2">
                                    {experiences.map(
                                        (
                                            experience,
                                            index,
                                        ) => {
                                            const isOpen =
                                                expanded ===
                                                index;

                                            const isRisk =
                                                experience.experienceType ===
                                                    "possible-overcharge" ||
                                                experience.experienceType ===
                                                    "reported-scam" ||
                                                experience.experienceType ===
                                                    "warning";

                                            return (
                                                <article
                                                    key={
                                                        experience.id ??
                                                        `${experience.title}-${index}`
                                                    }
                                                    data-result-card
                                                    className="overflow-hidden rounded-[20px] border border-[#123c35]/8"
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setExpanded(
                                                                isOpen
                                                                    ? null
                                                                    : index,
                                                            )
                                                        }
                                                        className="flex w-full items-center gap-3 p-4 text-left"
                                                    >
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8f58d]">
                                                            {isRisk ? (
                                                                <AlertTriangle className="h-3.5 w-3.5 text-[#123c35]" />
                                                            ) : (
                                                                <Check className="h-3.5 w-3.5 text-[#123c35]" />
                                                            )}
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <p className="text-[11px] font-black">
                                                                    {
                                                                        experience.title
                                                                    }
                                                                </p>

                                                                <span className="rounded-full bg-[#f7f3ea] px-2 py-1 text-[7px] font-black uppercase tracking-[0.1em]">
                                                                    {typeLabel(
                                                                        experience.experienceType,
                                                                    )}
                                                                </span>
                                                            </div>

                                                            <p className="mt-1 line-clamp-1 text-[9px] text-[#7d8883]">
                                                                {
                                                                    experience.summary
                                                                }
                                                            </p>
                                                        </div>

                                                        <ChevronDown
                                                            className={`h-4 w-4 shrink-0 transition-transform ${
                                                                isOpen
                                                                    ? "rotate-180"
                                                                    : ""
                                                            }`}
                                                        />
                                                    </button>

                                                    {isOpen && (
                                                        <div className="border-t border-[#123c35]/8 bg-[#fbfaf5] px-4 pb-4 pt-3">
                                                            <p className="text-xs leading-6 text-[#586760]">
                                                                {
                                                                    experience.summary
                                                                }
                                                            </p>

                                                            <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                                                {experience.place?.name && (
                                                                    <div className="rounded-[16px] bg-white p-3">
                                                                        <p className="text-[8px] font-black uppercase tracking-[0.14em] text-[#8b9691]">
                                                                            Place
                                                                        </p>

                                                                        <p className="mt-1 text-[11px] font-black">
                                                                            {
                                                                                experience
                                                                                    .place
                                                                                    .name
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                )}

                                                                {(
                                                                    experience.reportedAmount !==
                                                                        undefined ||
                                                                    experience.expectedAmount !==
                                                                        undefined
                                                                ) && (
                                                                    <div className="rounded-[16px] bg-white p-3">
                                                                        <p className="text-[8px] font-black uppercase tracking-[0.14em] text-[#8b9691]">
                                                                            Fare mentioned
                                                                        </p>

                                                                        <p className="mt-1 text-[11px] font-black">
                                                                            Paid{" "}
                                                                            {money(
                                                                                experience.reportedAmount,
                                                                            )}{" "}
                                                                            · Expected{" "}
                                                                            {money(
                                                                                experience.expectedAmount,
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {experience.advice.length >
                                                                0 && (
                                                                <div className="mt-3 rounded-[16px] bg-[#123c35] p-4 text-white">
                                                                    <p className="text-[8px] font-black uppercase tracking-[0.14em] text-[#cbe95b]">
                                                                        FairTrip advice
                                                                    </p>

                                                                    <ul className="mt-2 space-y-1.5 text-[10px] leading-5 text-white/70">
                                                                        {experience.advice.map(
                                                                            (
                                                                                item,
                                                                            ) => (
                                                                                <li
                                                                                    key={
                                                                                        item
                                                                                    }
                                                                                >
                                                                                    •{" "}
                                                                                    {
                                                                                        item
                                                                                    }
                                                                                </li>
                                                                            ),
                                                                        )}
                                                                    </ul>
                                                                </div>
                                                            )}

                                                            {experience.sourceQuote && (
                                                                <p className="mt-3 border-l-2 border-[#ef713d] pl-3 text-[10px] italic leading-5 text-[#6d7974]">
                                                                    “
                                                                    {
                                                                        experience.sourceQuote
                                                                    }
                                                                    ”
                                                                </p>
                                                            )}

                                                            <p className="mt-3 text-[9px] font-bold text-[#87918d]">
                                                                Confidence{" "}
                                                                {Math.round(
                                                                    experience.confidence *
                                                                        100,
                                                                )}
                                                                % · Private memory
                                                            </p>
                                                        </div>
                                                    )}
                                                </article>
                                            );
                                        },
                                    )}
                                </div>

                                <div className="mt-5 flex items-start gap-3 rounded-[20px] border border-[#123c35]/8 bg-[#eef4d7] p-4">
                                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#123c35]" />

                                    <p className="text-[10px] leading-5 text-[#52624f]">
                                        These notes stay in your personal memory.
                                        A possible scam or overcharge is treated
                                        as a traveler report, not a verified
                                        accusation.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#e8f58d]">
                                    <Sparkles className="h-6 w-6 text-[#123c35]" />
                                </div>

                                <h2 className="mt-5 text-xl font-black tracking-[-0.04em]">
                                    Your travel memory will appear here
                                </h2>

                                <p className="mt-2 max-w-sm text-[10px] leading-5 text-[#87918d]">
                                    Preview a source, optionally provide a
                                    transcript, then let FairTrip reconstruct
                                    the journey.
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                <section data-section className="grid gap-3 py-8 sm:grid-cols-3">
                    {[
                        [
                            "PRIVATE",
                            "Your journey stays yours until you choose otherwise.",
                        ],
                        [
                            "EVIDENCE",
                            "A single report is stored as a report, not a public verdict.",
                        ],
                        [
                            "USEFUL",
                            "The goal is actionable travel memory — not another social feed.",
                        ],
                    ].map(
                        ([
                            title,
                            copy,
                        ]) => (
                            <div
                                key={
                                    title
                                }
                                className="rounded-[22px] border border-[#123c35]/8 bg-white/70 p-4"
                            >
                                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-[#ef713d]">
                                    {
                                        title
                                    }
                                </p>

                                <p className="mt-2 text-[10px] font-semibold leading-5 text-[#65726c]">
                                    {
                                        copy
                                    }
                                </p>
                            </div>
                        ),
                    )}
                </section>
            </div>

            <JourneyDecisionDialog
                open={
                    journeyDialogOpen &&
                    Boolean(result)
                }
                journeys={
                    journeys
                }
                loadingJourneys={
                    loadingJourneys
                }
                saving={
                    savingToJourney
                }
                sourceTitle={
                    preview?.title
                }
                onContinue={(
                    journey,
                ) =>
                    void saveAnalysisToJourney(
                        journey,
                    )
                }
                onCreate={(
                    name,
                ) =>
                    void createJourneyAndSave(
                        name,
                    )
                }
                onClose={() =>
                    !savingToJourney &&
                    setJourneyDialogOpen(
                        false,
                    )
                }
            />
        </main>
    );
}