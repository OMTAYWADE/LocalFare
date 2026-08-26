import type { TravelerProfile, TravelerType, } from "../types";

const PROFILE_STORAGE_KEY = "localfare:traveler-profile";
const PROFILE_CHANGE_EVENT = "localfare:profile-change";

/* =========================================================
   EMPTY PROFILE
   ========================================================= */

function createEmptyProfile(): TravelerProfile {
    const now = new Date().toISOString();

    return {
        travelerType: "tourist",
        visitedPlaceIds: [],
        savedPlaceIds: [],
        plannedPlaceIds: [],
        createdAt: now,
        updatedAt: now,
    };
}

/* =========================================================
   SAVE PROFILE
   ========================================================= */

function persistProfile( profile: TravelerProfile,): TravelerProfile {
    if ( typeof window === "undefined") {
        return profile;
    }

    window.localStorage.setItem( PROFILE_STORAGE_KEY, JSON.stringify(profile),);
    window.dispatchEvent(new Event( PROFILE_CHANGE_EVENT,), );

    return profile;
}

/* =========================================================
   READ PROFILE
   ========================================================= */

export function getTravelerProfile():
    TravelerProfile | null {

    if ( typeof window === "undefined") {
        return null;
    }

    try {
        const stored = window.localStorage.getItem( PROFILE_STORAGE_KEY,);

        if (!stored) {
            return null;
        }
        return JSON.parse( stored,) as TravelerProfile;

    } catch (error) {
        console.error( "Unable to read traveler profile:", error,);
        return null;
    }
}

/* =========================================================
   SAVE TRAVELER TYPE
   ========================================================= */
export function saveTravelerType( travelerType: TravelerType,): TravelerProfile {
    const existing = getTravelerProfile();
    const now = new Date().toISOString();
    const profile: TravelerProfile = {
        ...(existing ?? createEmptyProfile()),
        travelerType,
        updatedAt: now,
    };

    if (!existing) {
        profile.createdAt = now;
    }

    return persistProfile(
        profile,
    );
}

/* =========================================================
   MARK VISITED
   ========================================================= */

export function markPlaceVisited( placeId: string,): TravelerProfile {
    const existing = getTravelerProfile() ?? createEmptyProfile();

    if (existing.visitedPlaceIds.includes(placeId) ) {
        return existing;
    }

    const updated: TravelerProfile = {
        ...existing,
        visitedPlaceIds: [ ...existing.visitedPlaceIds, placeId,],
        updatedAt: new Date().toISOString(),
    };

    return persistProfile(
        updated,
    );
}

/* =========================================================
   SAVE PLACE
   ========================================================= */

export function markPlaceSaved( placeId: string,): TravelerProfile {
    const existing = getTravelerProfile() ?? createEmptyProfile();

    if (existing.savedPlaceIds.includes(placeId)) {
        return existing;
    }

    const updated: TravelerProfile = {
        ...existing,
        savedPlaceIds: [ ...existing.savedPlaceIds, placeId,],
        updatedAt: new Date().toISOString(),
    };

    return persistProfile( updated,);
}

/* =========================================================
   MARK PLANNED
   ========================================================= */
export function markPlacePlanned( placeId: string,): TravelerProfile {
    const existing = getTravelerProfile() ?? createEmptyProfile();

    if ( existing.plannedPlaceIds.includes(placeId)) {
        return existing;
    }

    const updated: TravelerProfile = {
        ...existing,
        plannedPlaceIds: [ ...existing.plannedPlaceIds, placeId,],
        updatedAt: new Date().toISOString(),
    };

    return persistProfile( updated,);
}

/* =========================================================
   CLEAR PROFILE
   ========================================================= */
export function clearTravelerProfile(): void {
    if (typeof window === "undefined") {
        return;
    }

    window.localStorage.removeItem( PROFILE_STORAGE_KEY,);
    window.dispatchEvent(new Event( PROFILE_CHANGE_EVENT,),
    );
}

/* =========================================================
   PROFILE CHANGE LISTENER
   ========================================================= */

export function subscribeToTravelerProfile( callback: () => void,): () => void {
    if ( typeof window ==="undefined") {
        return () => undefined;
    }

    const handler = () => { callback();};
    window.addEventListener( PROFILE_CHANGE_EVENT, handler,);

    return () => {
        window.removeEventListener( PROFILE_CHANGE_EVENT, handler,);
    };
}