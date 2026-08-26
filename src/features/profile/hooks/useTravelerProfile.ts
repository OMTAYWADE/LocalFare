"use client";

import { useCallback, useSyncExternalStore,} from "react";
import { getTravelerProfile, saveTravelerType,} from "../services/travelerProfile.service";
import type { TravelerProfile, TravelerType,} from "../types";

function subscribe( callback: () => void,) {
    window.addEventListener( "localfare:profile-change", callback,);
    window.addEventListener( "storage", callback,);

    return () => {
        window.removeEventListener( "localfare:profile-change", callback,);
        window.removeEventListener( "storage", callback,);
    };
}

function getSnapshot():
    TravelerProfile | null {
    return getTravelerProfile();
}

function getServerSnapshot():TravelerProfile | null { return null;}

export function useTravelerProfile() {
    const profile = useSyncExternalStore(
            subscribe,
            getSnapshot,
            getServerSnapshot,
        );

    const travelerType =
        profile?.travelerType;

    const changeTravelerType =
        useCallback(
            (type: TravelerType) => {
                saveTravelerType(type);
            },
            [],
        );

    return {
        profile,
        travelerType,
        hasProfile: Boolean(profile),
        visitedPlaceIds: profile?.visitedPlaceIds ?? [],
        savedPlaceIds: profile?.savedPlaceIds ?? [],
        plannedPlaceIds: profile?.plannedPlaceIds ?? [],
        changeTravelerType,
    };
}