import {
    isMumbaiMMR,
    MUMBAI_AUTO_TARIFF,
    MUMBAI_TAXI_TARIFF,
    type MeterTariff,
} from "../data/mumbaiTariffs";

import type {
    FareResult,
    LocalTransportRequest,
} from "../types/localTransport.types";

function calculateMeterFare(
    distanceKm: number,
    tariff: MeterTariff,
    isNight: boolean,
): number {
    if (
        !Number.isFinite(distanceKm) ||
        distanceKm <= 0
    ) {
        return tariff.minimumFare;
    }

    let fare =
        distanceKm <=
            tariff.minimumDistanceKm
            ? tariff.minimumFare
            : tariff.minimumFare +
            (distanceKm -
                tariff.minimumDistanceKm) *
            tariff.subsequentRatePerKm;

    fare = Math.round(fare);

    if (isNight) {
        fare = Math.round(
            fare *
            (1 +
                tariff.nightSurchargePercent /
                100),
        );
    }

    return fare;
}

function isNightTime(): boolean {
    const hour =
        new Date().getHours();

    return (
        hour >=
        MUMBAI_AUTO_TARIFF.nightStartHour &&
        hour <
        MUMBAI_AUTO_TARIFF.nightEndHour
    );
}

export function getMeterFare(
    request: LocalTransportRequest,
): FareResult {
    const {
        mode,
        city,
        distanceKm,
        isNight = isNightTime(),
    } = request;

    if (!isMumbaiMMR(city)) {
        return {
            confidence: "unavailable",

            sourceType: "local-guidance",

            currency: "INR",

            title:
                "We couldn't verify a local meter fare",

            message:
                "FairTrip does not have a reliable current tariff for this location yet. Ask a local, hotel desk, shopkeeper, or the transport stand for the current fare before starting the journey.",
        };
    }

    const tariff =
        mode === "meter-taxi"
            ? MUMBAI_TAXI_TARIFF
            : MUMBAI_AUTO_TARIFF;

    if (
        typeof distanceKm !== "number" ||
        !Number.isFinite(distanceKm) ||
        distanceKm <= 0
    ) {
        return {
            confidence: "verified",

            sourceType: "official-tariff",

            currency: "INR",

            minFare:
                tariff.minimumFare,

            distanceKm: tariff.minimumDistanceKm,

            title:
                tariff.name,

            message:
                `The official tariff starts at ₹${tariff.minimumFare} for the first ${tariff.minimumDistanceKm} km. The meter/tariff card determines the final fare.`,

            sourceName:
                tariff.sourceName,

            sourceUrl:
                tariff.sourceUrl,

            updatedAt:
                tariff.effectiveFrom,
        };
    }

    const fare =
        calculateMeterFare(
            distanceKm,
            tariff,
            isNight,
        );

    return {
        confidence: "verified",

        sourceType: "official-tariff",

        currency: "INR",

        fare,

        distanceKm,

        title:
            "Meter fare estimate",

        message:
            isNight
                ? "Estimated from the current MMR tariff with the 25% midnight–5 AM surcharge."
                : "Estimated from the current MMR tariff. The actual meter/tariff card determines the final amount.",

        sourceName:
            tariff.sourceName,

        sourceUrl:
            tariff.sourceUrl,

        updatedAt:
            tariff.effectiveFrom,
    };
}

export function getTransportFare(
    request: LocalTransportRequest,
): FareResult {
    switch (request.mode) {
        case "meter-auto":
            return getMeterFare({
                ...request,
                mode: "meter-auto",
            });

        case "meter-taxi":
            return getMeterFare({
                ...request,
                mode: "meter-taxi",
            });

        case "shared-auto":
            return {
                confidence: "unavailable",

                sourceType:
                    "local-guidance",

                currency: "INR",

                title:
                    "Share-auto fare varies locally",

                message:
                    "FairTrip could not verify a reliable current share-auto fare for this route. Ask a local or another passenger: “What is the share fare from here to ___?”",
            };

        case "bus":
            return {
                confidence: "unavailable",

                sourceType:
                    "local-guidance",

                currency: "INR",

                title:
                    "Bus fare depends on the route",

                message:
                    "FairTrip won't invent a bus fare. Check the route and fare in a transit app or ask a local at the bus stop.",
            };

        case "app-taxi":
            return {
                confidence: "unavailable",

                sourceType:
                    "local-guidance",

                currency: "INR",

                title:
                    "Check the app before booking",

                message:
                    "App-taxi prices change with route, traffic and demand. Check the fare shown by the booking app before confirming.",
            };

        case "walk":
            return {
                confidence: "verified",

                sourceType:
                    "route-estimate",

                currency: "INR",

                fare: 0,

                title:
                    "No transport fare",

                message:
                    "Walking has no transport fare.",
            };

        default:
            return {
                confidence: "unavailable",

                sourceType:
                    "local-guidance",

                currency: "INR",

                title:
                    "Fare unavailable",

                message:
                    "FairTrip could not verify a reliable fare for this transport option.",
            };
    }
}