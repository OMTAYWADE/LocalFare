"use client";

import {
    AlertTriangle,
    Bus,
    Car,
    CheckCircle2,
    Clock3,
    Footprints,
    MapPin,
    Navigation,
    TrainFront,
    Wallet,
} from "lucide-react";

import type {
    ExtractedTravelContent,
    TravelRoute,
    TravelTransportMode,
} from "../types/travelMemory.types";


interface JourneyTimelineProps {
    result: ExtractedTravelContent;
}


function transportLabel(
    mode: TravelTransportMode,
): string {
    switch (mode) {
        case "walk":
            return "Walk";

        case "bus":
            return "Bus";

        case "train":
            return "Train";

        case "metro":
            return "Metro";

        case "shared-auto":
            return "Shared auto";

        case "meter-auto":
            return "Auto";

        case "taxi":
            return "Taxi";

        case "app-taxi":
            return "App taxi";

        case "ferry":
            return "Ferry";

        case "flight":
            return "Flight";

        case "other":
            return "Transport";

        default:
            return "Transport";
    }
}


function TransportIcon({
    mode,
}: {
    mode: TravelTransportMode;
}) {
    const className =
        "h-4 w-4";

    switch (mode) {
        case "walk":
            return (
                <Footprints
                    className={className}
                />
            );

        case "bus":
            return (
                <Bus
                    className={className}
                />
            );

        case "train":
        case "metro":
            return (
                <TrainFront
                    className={className}
                />
            );

        default:
            return (
                <Car
                    className={className}
                />
            );
    }
}


function money(
    value?: number,
): string {
    if (
        value === undefined ||
        !Number.isFinite(value)
    ) {
        return "—";
    }

    return `₹${value.toLocaleString(
        "en-IN",
    )}`;
}


function distance(
    meters?: number,
): string {
    if (
        meters === undefined ||
        !Number.isFinite(meters)
    ) {
        return "Distance not stated";
    }

    if (meters < 1000) {
        return `${Math.round(meters)} m`;
    }

    return `${(
        meters / 1000
    ).toFixed(
        meters >= 10000 ? 0 : 1,
    )} km`;
}


function duration(
    minutes?: number,
): string {
    if (
        minutes === undefined ||
        !Number.isFinite(minutes)
    ) {
        return "Time not stated";
    }

    if (minutes < 60) {
        return `${Math.round(minutes)} min`;
    }

    const hours =
        Math.floor(minutes / 60);

    const remaining =
        Math.round(minutes % 60);

    if (remaining === 0) {
        return `${hours} hr`;
    }

    return `${hours} hr ${remaining} min`;
}


function routeHasCost(
    route: TravelRoute,
): boolean {
    return (
        route.amountPaid !== undefined &&
        route.amountPaid > 0
    );
}


export default function JourneyTimeline({
    result,
}: JourneyTimelineProps) {
    const routes = [
        ...result.routes,
    ].sort(
        (a, b) =>
            a.sequence -
            b.sequence,
    );

    const places = [
        ...result.places,
    ];

    const expenses = [
        ...result.expenses,
    ];

    const experiences = [
        ...result.experiences,
    ];


    return (
        <section
            data-journey-timeline
            className="
                mt-7
                overflow-hidden
                rounded-[28px]
                border
                border-[#123c35]/10
                bg-white
            "
        >
            {/* =====================================================
                HEADER
            ====================================================== */}

            <div
                className="
                    border-b
                    border-[#123c35]/8
                    bg-[#123c35]
                    p-5
                    text-white
                    sm:p-6
                "
            >
                <div
                    className="
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-end
                        sm:justify-between
                    "
                >
                    <div>
                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                text-[9px]
                                font-black
                                uppercase
                                tracking-[0.18em]
                                text-[#e8f58d]
                            "
                        >
                            <Navigation className="h-3.5 w-3.5" />

                            Journey reconstructed
                        </div>

                        <h3
                            className="
                                mt-2
                                text-2xl
                                font-black
                                tracking-[-0.05em]
                            "
                        >
                            Your trip, step by step
                        </h3>

                        <p
                            className="
                                mt-2
                                max-w-xl
                                text-[10px]
                                leading-5
                                text-white/55
                            "
                        >
                            FairTrip follows the places and
                            transport mentioned in the source
                            content in the order they were described.
                        </p>
                    </div>


                    <div
                        className="
                            flex
                            shrink-0
                            gap-2
                        "
                    >
                        <div
                            className="
                                rounded-[16px]
                                bg-white/8
                                px-3
                                py-2
                            "
                        >
                            <p
                                className="
                                    text-[8px]
                                    font-black
                                    uppercase
                                    tracking-[0.12em]
                                    text-white/40
                                "
                            >
                                Stops
                            </p>

                            <p
                                className="
                                    mt-0.5
                                    text-sm
                                    font-black
                                "
                            >
                                {places.length}
                            </p>
                        </div>

                        <div
                            className="
                                rounded-[16px]
                                bg-white/8
                                px-3
                                py-2
                            "
                        >
                            <p
                                className="
                                    text-[8px]
                                    font-black
                                    uppercase
                                    tracking-[0.12em]
                                    text-white/40
                                "
                            >
                                Routes
                            </p>

                            <p
                                className="
                                    mt-0.5
                                    text-sm
                                    font-black
                                "
                            >
                                {routes.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            {/* =====================================================
                TIMELINE
            ====================================================== */}

            <div className="p-5 sm:p-7">
                {places.length === 0 &&
                    routes.length === 0 ? (
                    <div
                        className="
                            rounded-[22px]
                            border
                            border-dashed
                            border-[#123c35]/10
                            bg-[#fbfaf5]
                            p-6
                            text-center
                        "
                    >
                        <MapPin
                            className="
                                mx-auto
                                h-6
                                w-6
                                text-[#ef713d]
                            "
                        />

                        <p
                            className="
                                mt-3
                                text-xs
                                font-black
                            "
                        >
                            No journey sequence found
                        </p>

                        <p
                            className="
                                mx-auto
                                mt-2
                                max-w-md
                                text-[10px]
                                leading-5
                                text-[#7a8580]
                            "
                        >
                            Add a transcript or caption so
                            FairTrip can understand where the
                            traveler went and how they moved
                            between places.
                        </p>
                    </div>
                ) : (
                    <div
                        className="
                            relative
                            ml-1
                            sm:ml-3
                        "
                    >
                        {/* Vertical line */}

                        <div
                            className="
                                absolute
                                bottom-5
                                left-[15px]
                                top-5
                                w-px
                                bg-[#123c35]/10
                            "
                        />


                        {/* =================================================
                            PLACE → ROUTE → PLACE
                        ================================================== */}

                        {places.map(
                            (
                                place,
                                index,
                            ) => {
                                const nextPlace =
                                    places[index + 1];

                                const route =
                                    routes.find(
                                        (
                                            item,
                                        ) =>
                                            item.sequence ===
                                            index + 1,
                                    );


                                const placeExperience =
                                    experiences.find(
                                        (
                                            experience,
                                        ) =>
                                            experience.place
                                                ?.name
                                                ?.toLowerCase() ===
                                            place.name.toLowerCase(),
                                    );


                                return (
                                    <div
                                        key={`${place.name}-${index}`}
                                        className="relative"
                                        data-journey-item
                                    >
                                        {/* PLACE */}

                                        <div
                                            className="
                                                relative
                                                flex
                                                gap-4
                                            "
                                        >
                                            <div
                                                className="
                                                    relative
                                                    z-10
                                                    flex
                                                    h-8
                                                    w-8
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    border-4
                                                    border-white
                                                    bg-[#e8f58d]
                                                    text-[#123c35]
                                                    shadow-sm
                                                "
                                            >
                                                <MapPin
                                                    className="h-3.5 w-3.5"
                                                />
                                            </div>


                                            <div
                                                className="
                                                    min-w-0
                                                    flex-1
                                                    pb-5
                                                "
                                            >
                                                <div
                                                    className="
                                                        flex
                                                        flex-wrap
                                                        items-center
                                                        gap-2
                                                    "
                                                >
                                                    <span
                                                        className="
                                                            rounded-full
                                                            bg-[#f3f6e6]
                                                            px-2
                                                            py-1
                                                            text-[8px]
                                                            font-black
                                                            uppercase
                                                            tracking-[0.12em]
                                                            text-[#61704d]
                                                        "
                                                    >
                                                        Stop{" "}
                                                        {index + 1}
                                                    </span>

                                                    {place.city && (
                                                        <span
                                                            className="
                                                                text-[9px]
                                                                font-bold
                                                                text-[#9aa39f]
                                                            "
                                                        >
                                                            {
                                                                place.city
                                                            }
                                                        </span>
                                                    )}
                                                </div>

                                                <h4
                                                    className="
                                                        mt-1
                                                        text-sm
                                                        font-black
                                                        tracking-[-0.02em]
                                                    "
                                                >
                                                    {
                                                        place.name
                                                    }
                                                </h4>

                                                {place.address && (
                                                    <p
                                                        className="
                                                            mt-1
                                                            text-[9px]
                                                            leading-4
                                                            text-[#8a9590]
                                                        "
                                                    >
                                                        {
                                                            place.address
                                                        }
                                                    </p>
                                                )}

                                                {placeExperience && (
                                                    <div
                                                        className="
                                                            mt-3
                                                            rounded-[16px]
                                                            border
                                                            border-[#123c35]/8
                                                            bg-[#fbfaf5]
                                                            p-3
                                                        "
                                                    >
                                                        <div
                                                            className="
                                                                flex
                                                                items-start
                                                                gap-2
                                                            "
                                                        >
                                                            {placeExperience.experienceType ===
                                                                "possible-overcharge" ||
                                                                placeExperience.experienceType ===
                                                                "reported-scam" ? (
                                                                <AlertTriangle
                                                                    className="
                                                                        mt-0.5
                                                                        h-3.5
                                                                        w-3.5
                                                                        shrink-0
                                                                        text-[#ef713d]
                                                                    "
                                                                />
                                                            ) : (
                                                                <CheckCircle2
                                                                    className="
                                                                        mt-0.5
                                                                        h-3.5
                                                                        w-3.5
                                                                        shrink-0
                                                                        text-[#123c35]
                                                                    "
                                                                />
                                                            )}

                                                            <div>
                                                                <p
                                                                    className="
                                                                        text-[10px]
                                                                        font-black
                                                                    "
                                                                >
                                                                    {
                                                                        placeExperience.title
                                                                    }
                                                                </p>

                                                                <p
                                                                    className="
                                                                        mt-1
                                                                        text-[9px]
                                                                        leading-5
                                                                        text-[#718079]
                                                                    "
                                                                >
                                                                    {
                                                                        placeExperience.summary
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>


                                        {/* ROUTE TO NEXT PLACE */}

                                        {nextPlace &&
                                            route && (
                                                <div
                                                    className="
                                                        relative
                                                        ml-4
                                                        border-l
                                                        border-transparent
                                                        pb-6
                                                        pl-8
                                                    "
                                                >
                                                    <div
                                                        className="
                                                            absolute
                                                            left-[-1px]
                                                            top-0
                                                            flex
                                                            h-7
                                                            w-7
                                                            -translate-x-1/2
                                                            items-center
                                                            justify-center
                                                            rounded-full
                                                            border
                                                            border-[#123c35]/10
                                                            bg-white
                                                            text-[#ef713d]
                                                        "
                                                    >
                                                        <TransportIcon
                                                            mode={
                                                                route.transportMode
                                                            }
                                                        />
                                                    </div>


                                                    <div
                                                        className="
                                                            rounded-[20px]
                                                            border
                                                            border-[#123c35]/8
                                                            bg-[#fbfaf5]
                                                            p-4
                                                        "
                                                    >
                                                        <div
                                                            className="
                                                                flex
                                                                flex-col
                                                                gap-3
                                                                sm:flex-row
                                                                sm:items-start
                                                                sm:justify-between
                                                            "
                                                        >
                                                            <div>
                                                                <div
                                                                    className="
                                                                        flex
                                                                        flex-wrap
                                                                        items-center
                                                                        gap-2
                                                                    "
                                                                >
                                                                    <span
                                                                        className="
                                                                            text-[10px]
                                                                            font-black
                                                                        "
                                                                    >
                                                                        {
                                                                            transportLabel(
                                                                                route.transportMode,
                                                                            )
                                                                        }
                                                                    </span>

                                                                    {route.confidence <
                                                                        0.65 && (
                                                                            <span
                                                                                className="
                                                                                rounded-full
                                                                                bg-[#fff5ee]
                                                                                px-2
                                                                                py-1
                                                                                text-[8px]
                                                                                font-black
                                                                                uppercase
                                                                                text-[#b76848]
                                                                            "
                                                                            >
                                                                                Lower
                                                                                confidence
                                                                            </span>
                                                                        )}
                                                                </div>

                                                                <p
                                                                    className="
                                                                        mt-1
                                                                        text-[9px]
                                                                        text-[#89938e]
                                                                    "
                                                                >
                                                                    {
                                                                        route.from.name
                                                                    }
                                                                    {" → "}
                                                                    {
                                                                        route.to.name
                                                                    }
                                                                </p>
                                                            </div>


                                                            {routeHasCost(
                                                                route,
                                                            ) && (
                                                                    <div
                                                                        className="
                                                                        shrink-0
                                                                        rounded-[14px]
                                                                        bg-[#123c35]
                                                                        px-3
                                                                        py-2
                                                                        text-right
                                                                        text-white
                                                                    "
                                                                    >
                                                                        <p
                                                                            className="
                                                                            text-[8px]
                                                                            font-bold
                                                                            uppercase
                                                                            tracking-[0.1em]
                                                                            text-white/45
                                                                        "
                                                                        >
                                                                            Paid
                                                                        </p>

                                                                        <p
                                                                            className="
                                                                            text-xs
                                                                            font-black
                                                                        "
                                                                        >
                                                                            {money(
                                                                                route.amountPaid,
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                        </div>


                                                        <div
                                                            className="
                                                                mt-3
                                                                grid
                                                                grid-cols-2
                                                                gap-2
                                                                sm:grid-cols-3
                                                            "
                                                        >
                                                            <div
                                                                className="
                                                                    rounded-[14px]
                                                                    bg-white
                                                                    p-2.5
                                                                "
                                                            >
                                                                <Navigation
                                                                    className="
                                                                        h-3.5
                                                                        w-3.5
                                                                        text-[#ef713d]
                                                                    "
                                                                />

                                                                <p
                                                                    className="
                                                                        mt-1
                                                                        text-[9px]
                                                                        font-black
                                                                    "
                                                                >
                                                                    {distance(
                                                                        route.distanceMeters,
                                                                    )}
                                                                </p>
                                                            </div>


                                                            <div
                                                                className="
                                                                    rounded-[14px]
                                                                    bg-white
                                                                    p-2.5
                                                                "
                                                            >
                                                                <Clock3
                                                                    className="
                                                                        h-3.5
                                                                        w-3.5
                                                                        text-[#ef713d]
                                                                    "
                                                                />

                                                                <p
                                                                    className="
                                                                        mt-1
                                                                        text-[9px]
                                                                        font-black
                                                                    "
                                                                >
                                                                    {duration(
                                                                        route.durationMinutes,
                                                                    )}
                                                                </p>
                                                            </div>


                                                            <div
                                                                className="
                                                                    rounded-[14px]
                                                                    bg-white
                                                                    p-2.5
                                                                "
                                                            >
                                                                <Wallet
                                                                    className="
                                                                        h-3.5
                                                                        w-3.5
                                                                        text-[#ef713d]
                                                                    "
                                                                />

                                                                <p
                                                                    className="
                                                                        mt-1
                                                                        text-[9px]
                                                                        font-black
                                                                    "
                                                                >
                                                                    {routeHasCost(
                                                                        route,
                                                                    )
                                                                        ? money(
                                                                            route.amountPaid,
                                                                        )
                                                                        : "No fare stated"}
                                                                </p>
                                                            </div>
                                                        </div>


                                                        {route.experience && (
                                                            <p
                                                                className="
                                                                    mt-3
                                                                    border-l-2
                                                                    border-[#ef713d]/50
                                                                    pl-3
                                                                    text-[9px]
                                                                    italic
                                                                    leading-5
                                                                    text-[#6e7974]
                                                                "
                                                            >
                                                                {
                                                                    route.experience
                                                                }
                                                            </p>
                                                        )}


                                                        {route.evidence && (
                                                            <p
                                                                className="
                                                                    mt-2
                                                                    text-[8px]
                                                                    leading-4
                                                                    text-[#9aa39f]
                                                                "
                                                            >
                                                                Evidence:{" "}
                                                                {
                                                                    route.evidence
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                );
                            },
                        )}


                        {/* =================================================
                            EXPENSES
                        ================================================== */}

                        {expenses.length > 0 && (
                            <div
                                className="
                                    relative
                                    mt-2
                                    flex
                                    gap-4
                                "
                                data-journey-item
                            >
                                <div
                                    className="
                                        relative
                                        z-10
                                        flex
                                        h-8
                                        w-8
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        border-4
                                        border-white
                                        bg-[#ef713d]
                                        text-white
                                    "
                                >
                                    <Wallet className="h-3.5 w-3.5" />
                                </div>

                                <div
                                    className="
                                        min-w-0
                                        flex-1
                                    "
                                >
                                    <span
                                        className="
                                            rounded-full
                                            bg-[#fff0e9]
                                            px-2
                                            py-1
                                            text-[8px]
                                            font-black
                                            uppercase
                                            tracking-[0.12em]
                                            text-[#b65a37]
                                        "
                                    >
                                        Spending
                                    </span>

                                    <h4
                                        className="
                                            mt-2
                                            text-sm
                                            font-black
                                        "
                                    >
                                        Other trip expenses
                                    </h4>

                                    <div
                                        className="
                                            mt-3
                                            grid
                                            gap-2
                                            sm:grid-cols-2
                                        "
                                    >
                                        {expenses.map(
                                            (
                                                expense,
                                                index,
                                            ) => (
                                                <div
                                                    key={`${expense.description}-${index}`}
                                                    className="
                                                        rounded-[18px]
                                                        border
                                                        border-[#123c35]/8
                                                        bg-[#fbfaf5]
                                                        p-3
                                                    "
                                                >
                                                    <div
                                                        className="
                                                            flex
                                                            items-start
                                                            justify-between
                                                            gap-3
                                                        "
                                                    >
                                                        <div>
                                                            <p
                                                                className="
                                                                    text-[10px]
                                                                    font-black
                                                                "
                                                            >
                                                                {
                                                                    expense.description
                                                                }
                                                            </p>

                                                            {expense.placeName && (
                                                                <p
                                                                    className="
                                                                        mt-1
                                                                        text-[8px]
                                                                        text-[#89938e]
                                                                    "
                                                                >
                                                                    {
                                                                        expense.placeName
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>

                                                        <span
                                                            className="
                                                                shrink-0
                                                                text-xs
                                                                font-black
                                                                text-[#123c35]
                                                            "
                                                        >
                                                            {money(
                                                                expense.amount,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}