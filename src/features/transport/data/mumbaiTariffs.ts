export interface MeterTariff {
    name: string;

    minimumFare: number;

    minimumDistanceKm: number;

    subsequentRatePerKm: number;

    nightSurchargePercent: number;

    nightStartHour: number;

    nightEndHour: number;

    sourceName: string;

    sourceUrl: string;

    effectiveFrom: string;
}

/**
 * Maharashtra Transport Department
 *
 * Revised MMR tariff effective from 01/09/2026.
 *
 * Auto:
 * ₹27 for first 1.5 km
 * ₹18.22/km thereafter
 *
 * Black-yellow taxi:
 * ₹33 for first 1.5 km
 * ₹21.90/km thereafter
 */
export const MUMBAI_AUTO_TARIFF: MeterTariff = {
    name: "Mumbai MMR Meter Auto",

    minimumFare: 27,

    minimumDistanceKm: 1.5,

    subsequentRatePerKm: 18.22,

    nightSurchargePercent: 25,

    nightStartHour: 0,

    nightEndHour: 5,

    sourceName:
        "Maharashtra Motor Vehicle Department",

    sourceUrl:
        "https://transport.maharashtra.gov.in/Site/Common/ViewPdfList.aspx?Doctype=1d1f28f9-a4e5-4b09-ab8b-1d4576adca18",

    effectiveFrom:
        "2026-09-01",
};

export const MUMBAI_TAXI_TARIFF: MeterTariff = {
    name: "Mumbai MMR Black-Yellow Meter Taxi",

    minimumFare: 33,

    minimumDistanceKm: 1.5,

    subsequentRatePerKm: 21.90,

    nightSurchargePercent: 25,

    nightStartHour: 0,

    nightEndHour: 5,

    sourceName:
        "Maharashtra Motor Vehicle Department",

    sourceUrl:
        "https://transport.maharashtra.gov.in/Site/Common/ViewPdfList.aspx?Doctype=1d1f28f9-a4e5-4b09-ab8b-1d4576adca18",

    effectiveFrom:
        "2026-09-01",
};

export function isMumbaiMMR(
    city?: string,
): boolean {
    if (!city) {
        return false;
    }

    const normalized =
        city.toLowerCase().trim();

    const supportedCities = [
        "mumbai",
        "navi mumbai",
        "thane",
        "kalyan",
        "dombivli",
        "mira road",
        "bhayandar",
        "mira-bhayander",
    ];

    return supportedCities.some(
        (name) =>
            normalized === name ||
            normalized.includes(name),
    );
}