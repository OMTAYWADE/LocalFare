"use client";

import {
    ArrowUpRight,
    BadgeCheck,
    Building2,
    ChevronRight,
    CircleAlert,
    MapPin,
    Navigation,
    Package,
    Tag,
    TextSearch,
} from "lucide-react";

import type {
    UniversalLocation,
    UniversalPrice,
    UniversalRecognition,
} from "../types/universalScan.types";

interface UniversalScanResultProps {
    recognition: UniversalRecognition;
    price?: UniversalPrice;
    location?: UniversalLocation;
    message?: string;
    latitude?: number;
    longitude?: number;
}

function formatConfidence(confidence: number): string {
    return `${Math.round(confidence * 100)}%`;
}

function formatKey(key: string): string {
    return key
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase(),
        );
}

function getPriceLabel(price: UniversalPrice): string {
    switch (price.status) {
        case "verified":
            return "Verified price";

        case "location-estimate":
            return "Local estimate";

        case "variable":
            return "Variable price";

        case "unavailable":
        default:
            return "Price unavailable";
    }
}

function getPriceValue(price: UniversalPrice): string | null {
    if (typeof price.exact === "number") {
        return `₹${price.exact.toLocaleString("en-IN")}`;
    }

    if (
        typeof price.min === "number" &&
        typeof price.max === "number"
    ) {
        return `₹${price.min.toLocaleString(
            "en-IN",
        )} – ₹${price.max.toLocaleString("en-IN")}`;
    }

    if (typeof price.min === "number") {
        return `From ₹${price.min.toLocaleString(
            "en-IN",
        )}`;
    }

    if (typeof price.max === "number") {
        return `Up to ₹${price.max.toLocaleString(
            "en-IN",
        )}`;
    }

    return null;
}

function getLocationTitle(
    location?: UniversalLocation,
): string {
    if (!location) {
        return "Location unavailable";
    }

    return (
        location.name ??
        location.city ??
        location.state ??
        location.country ??
        "Detected location"
    );
}

function getLocationDescription(
    location?: UniversalLocation,
): string | null {
    if (!location) {
        return null;
    }

    if (location.address) {
        return location.address;
    }

    const parts = [
        location.city,
        location.state,
        location.country,
    ].filter(Boolean);

    return parts.length > 0
        ? parts.join(", ")
        : null;
}

function openMap(
    latitude?: number,
    longitude?: number,
) {
    if (
        typeof latitude !== "number" ||
        typeof longitude !== "number"
    ) {
        return;
    }

    const url =
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${latitude},${longitude}`,
        )}`;

    window.open(
        url,
        "_blank",
        "noopener,noreferrer",
    );
}

export default function UniversalScanResult({
    recognition,
    price,
    location,
    message,
    latitude,
    longitude,
}: UniversalScanResultProps) {
    const priceValue = price
        ? getPriceValue(price)
        : null;

    const locationDescription =
        getLocationDescription(location);

    const hasCoordinates =
        typeof latitude === "number" &&
        typeof longitude === "number";

    return (
        <section className="mt-7 space-y-4">

            {/* -------------------------------------------------
             * Result overview
             * ------------------------------------------------- */}
            <div className="overflow-hidden rounded-[30px] border border-[#123c35]/10 bg-white shadow-[0_18px_50px_rgba(18,60,53,0.08)]">

                <div className="border-b border-[#123c35]/8 bg-[#fbfaf5] p-6 sm:p-7">

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                        <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-2">

                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#123c35] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-white">
                                    <BadgeCheck className="h-3 w-3 text-[#e8f58d]" />
                                    Identified
                                </span>

                                <span className="rounded-full bg-[#e8f58d] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-[#123c35]">
                                    {formatConfidence(
                                        recognition.confidence,
                                    )}
                                </span>

                            </div>

                            <h2 className="mt-4 break-words text-3xl font-black tracking-[-0.045em] text-[#123c35] sm:text-4xl">
                                {recognition.name}
                            </h2>

                            <div className="mt-3 flex flex-wrap gap-2">

                                <span className="rounded-full bg-[#123c35]/7 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-[#31544d]">
                                    {recognition.type}
                                </span>

                                <span className="rounded-full bg-[#123c35]/7 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-[#31544d]">
                                    {recognition.kind}
                                </span>

                            </div>

                        </div>

                        {(recognition.brand ||
                            recognition.model) && (
                            <div className="grid grid-cols-2 gap-2 sm:min-w-[280px]">

                                {recognition.brand && (
                                    <div className="rounded-[20px] border border-[#123c35]/8 bg-white p-4">
                                        <p className="text-[8px] font-black uppercase tracking-[0.14em] text-[#8b9691]">
                                            Brand
                                        </p>

                                        <p className="mt-1 text-sm font-black text-[#123c35]">
                                            {recognition.brand}
                                        </p>
                                    </div>
                                )}

                                {recognition.model && (
                                    <div className="rounded-[20px] border border-[#123c35]/8 bg-white p-4">
                                        <p className="text-[8px] font-black uppercase tracking-[0.14em] text-[#8b9691]">
                                            Model
                                        </p>

                                        <p className="mt-1 text-sm font-black text-[#123c35]">
                                            {recognition.model}
                                        </p>
                                    </div>
                                )}

                            </div>
                        )}

                    </div>

                    {message && (
                        <div className="mt-5 flex items-start gap-3 rounded-[18px] bg-[#123c35] p-4 text-white">

                            <SparkleIcon />

                            <p className="text-xs leading-5 text-white/75">
                                {message}
                            </p>

                        </div>
                    )}

                </div>

                {/* -------------------------------------------------
                 * Attributes
                 * ------------------------------------------------- */}
                {Object.keys(
                    recognition.attributes ?? {},
                ).length > 0 && (
                    <div className="p-6 sm:p-7">

                        <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f7f3ea] text-[#123c35]">
                                <Package className="h-4 w-4" />
                            </div>

                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#ef713d]">
                                    What we know
                                </p>

                                <h3 className="mt-0.5 text-sm font-black text-[#123c35]">
                                    Item details
                                </h3>
                            </div>

                        </div>

                        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">

                            {Object.entries(
                                recognition.attributes,
                            ).map(([key, value]) => (
                                <div
                                    key={key}
                                    className="rounded-[20px] border border-[#123c35]/8 bg-[#fbfaf5] p-4"
                                >
                                    <p className="text-[8px] font-black uppercase tracking-[0.13em] text-[#8b9691]">
                                        {formatKey(key)}
                                    </p>

                                    <p className="mt-1.5 text-xs font-bold leading-5 text-[#123c35]">
                                        {value}
                                    </p>
                                </div>
                            ))}

                        </div>

                    </div>
                )}

            </div>

            {/* -------------------------------------------------
             * Price + Location
             * ------------------------------------------------- */}
            <div className="grid gap-4 lg:grid-cols-2">

                {/* Price */}
                {price && (
                    <div className="rounded-[28px] border border-[#123c35]/10 bg-white p-6 shadow-[0_16px_45px_rgba(18,60,53,0.06)]">

                        <div className="flex items-start justify-between gap-4">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f58d] text-[#123c35]">
                                    <Tag className="h-4 w-4" />
                                </div>

                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#ef713d]">
                                        Market information
                                    </p>

                                    <h3 className="mt-0.5 text-sm font-black text-[#123c35]">
                                        {getPriceLabel(price)}
                                    </h3>
                                </div>

                            </div>

                            {price.status === "verified" && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#123c35] px-2.5 py-1.5 text-[8px] font-black uppercase tracking-[0.1em] text-white">
                                    <BadgeCheck className="h-3 w-3 text-[#e8f58d]" />
                                    Verified
                                </span>
                            )}

                        </div>

                        {priceValue ? (
                            <p className="mt-6 text-3xl font-black tracking-[-0.04em] text-[#123c35]">
                                {priceValue}
                            </p>
                        ) : (
                            <div className="mt-5 flex items-start gap-3 rounded-[18px] bg-[#fbfaf5] p-4">

                                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#ef713d]" />

                                <p className="text-xs leading-5 text-[#6d7974]">
                                    {price.message ??
                                        "A reliable price could not be determined for this item."}
                                </p>

                            </div>
                        )}

                        {price.locationName && (
                            <p className="mt-3 text-[10px] font-semibold text-[#89938f]">
                                Around {price.locationName}
                            </p>
                        )}

                        {price.sourceName && (
                            <p className="mt-1 text-[10px] text-[#a0aaa5]">
                                Source: {price.sourceName}
                            </p>
                        )}

                        {price.sourceUrl && (
                            <a
                                href={price.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#ef713d] transition hover:text-[#123c35]"
                            >
                                View source
                                <ArrowUpRight className="h-3 w-3" />
                            </a>
                        )}

                    </div>
                )}

                {/* Location */}
                <div className="rounded-[28px] border border-[#123c35]/10 bg-white p-6 shadow-[0_16px_45px_rgba(18,60,53,0.06)]">

                    <div className="flex items-start justify-between gap-4">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7f3ea] text-[#123c35]">
                                <MapPin className="h-4 w-4" />
                            </div>

                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#ef713d]">
                                    Local context
                                </p>

                                <h3 className="mt-0.5 text-sm font-black text-[#123c35]">
                                    {getLocationTitle(
                                        location,
                                    )}
                                </h3>
                            </div>

                        </div>

                        {location?.city && (
                            <span className="rounded-full bg-[#123c35]/7 px-2.5 py-1.5 text-[8px] font-black uppercase tracking-[0.1em] text-[#31544d]">
                                {location.city}
                            </span>
                        )}

                    </div>

                    {locationDescription ? (
                        <p className="mt-5 text-xs leading-5 text-[#6d7974]">
                            {locationDescription}
                        </p>
                    ) : (
                        <div className="mt-5 rounded-[18px] bg-[#fbfaf5] p-4">
                            <p className="text-xs leading-5 text-[#89938f]">
                                We could not determine a readable
                                address for this location.
                            </p>
                        </div>
                    )}

                    {hasCoordinates && (
                        <button
                            type="button"
                            onClick={() =>
                                openMap(
                                    latitude,
                                    longitude,
                                )
                            }
                            className="mt-5 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#123c35] px-5 text-[9px] font-black uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:bg-[#0d312b]"
                        >
                            <Navigation className="h-3.5 w-3.5 text-[#e8f58d]" />
                            Open on map
                        </button>
                    )}

                </div>

            </div>

            {/* -------------------------------------------------
             * Detected text
             * ------------------------------------------------- */}
            {recognition.detectedText &&
                recognition.detectedText.length > 0 && (
                    <div className="rounded-[28px] border border-[#123c35]/10 bg-white p-6 shadow-[0_16px_45px_rgba(18,60,53,0.06)]">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7f3ea] text-[#123c35]">
                                <TextSearch className="h-4 w-4" />
                            </div>

                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#ef713d]">
                                    Visual text
                                </p>

                                <h3 className="mt-0.5 text-sm font-black text-[#123c35]">
                                    Text detected in the scan
                                </h3>
                            </div>

                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">

                            {recognition.detectedText.map(
                                (item, index) => (
                                    <span
                                        key={`${item}-${index}`}
                                        className="rounded-full border border-[#123c35]/8 bg-[#fbfaf5] px-4 py-2 text-xs font-bold text-[#31544d]"
                                    >
                                        {item}
                                    </span>
                                ),
                            )}

                        </div>

                    </div>
                )}

            {/* -------------------------------------------------
             * Future local search entry
             * ------------------------------------------------- */}
            <div className="rounded-[28px] border border-[#123c35]/10 bg-[#123c35] p-6 text-white shadow-[0_18px_50px_rgba(18,60,53,0.12)] sm:p-7">

                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                    <div className="flex items-start gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e8f58d] text-[#123c35]">
                            <Building2 className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#cbe95b]">
                                Next layer
                            </p>

                            <h3 className="mt-1 text-lg font-black tracking-[-0.025em]">
                                Find this around you
                            </h3>

                            <p className="mt-1 max-w-xl text-xs leading-5 text-white/55">
                                Recognition tells you what the
                                item is. Local search can
                                compare nearby sellers,
                                availability and real prices.
                            </p>
                        </div>

                    </div>

                    <button
                        type="button"
                        disabled={!location}
                        className="inline-flex min-h-[46px] shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 text-[9px] font-black uppercase tracking-[0.12em] text-[#123c35] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Search local
                        <ChevronRight className="h-3.5 w-3.5" />
                    </button>

                </div>

            </div>

        </section>
    );
}

/*
 * Small local icon component so we don't need another
 * dependency just for the message icon.
 */
function SparkleIcon() {
    return (
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e8f58d] text-[#123c35]">
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-3.5 w-3.5"
                aria-hidden="true"
            >
                <path d="m12 3 1.4 5.6L19 10l-5.6 1.4L12 17l-1.4-5.6L5 10l5.6-1.4L12 3Z" />
                <path d="m19 16 .6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6L19 16Z" />
            </svg>
        </div>
    );
}