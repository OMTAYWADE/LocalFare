import type {  Coordinates,} from "../../place/types/place.types";

const EARTH_RADIUS_KM = 6371;

export function calculateDistanceKm(
    from: Coordinates,
    to: Coordinates,
): number {
    const lat1 =
        (from.latitude * Math.PI) / 180;

    const lat2 =
        (to.latitude * Math.PI) / 180;

    const deltaLat =
        ((to.latitude - from.latitude) *
            Math.PI) /
        180;

    const deltaLon =
        ((to.longitude - from.longitude) *
            Math.PI) /
        180;

    const a =
        Math.sin(deltaLat / 2) ** 2 +
        Math.cos(lat1) *
            Math.cos(lat2) *
            Math.sin(deltaLon / 2) ** 2;

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a),
        );

    return EARTH_RADIUS_KM * c;
}

export function calculateDistanceMeters(
    from: Coordinates,
    to: Coordinates,
): number {
    return (
        calculateDistanceKm(
            from,
            to,
        ) * 1000
    );
}