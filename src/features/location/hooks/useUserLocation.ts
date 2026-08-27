"use client";

import { useCallback, useState } from "react";

import { getCurrentLocation } from "../services/location.service";

import type {
    UserLocation,
} from "../types/location.types";

export function useUserLocation() {
    const [location, setLocation] =
        useState<UserLocation | null>(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const detectLocation =
        useCallback(async () => {
            setLoading(true);
            setError(null);

            try {
                const result =
                    await getCurrentLocation();

                setLocation(result);

                return result;
            } catch (err) {
                const message =
                    err instanceof Error
                        ? err.message
                        : "Unable to detect location.";

                setError(message);

                return null;
            } finally {
                setLoading(false);
            }
        }, []);

    return {
        location,
        loading,
        error,
        detectLocation,
    };
}