"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    CircleMarker,
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    useMap,
} from "react-leaflet";

import L from "leaflet";

import {
    LocateFixed,
    Search,
} from "lucide-react";

import type { UserLocation } from "../types";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

interface Destination {
    id: string | number;
    name: string;

    latitude?: number;
    longitude?: number;

    lat?: number;
    lon?: number;

    category?: string;
    description?: string;

    distanceKm?: number;
    rating?: number;

    estimatedCost?: number | string;
}

/* -------------------------------------------------------------------------- */
/* PROPS                                                                      */
/* -------------------------------------------------------------------------- */

interface LocationMapClientProps {
    location?: UserLocation;

    destinations?: Destination[];

    onSelectPlace?: (
        destination: Destination,
    ) => void;
}

/* -------------------------------------------------------------------------- */
/* DEFAULT LOCATION                                                           */
/* -------------------------------------------------------------------------- */

const DEFAULT_LOCATION = {
    latitude: 18.9402,
    longitude: 72.8355,
};

/* -------------------------------------------------------------------------- */
/* MAP ICONS                                                                  */
/* -------------------------------------------------------------------------- */

function createPlaceIcon(
    selected = false,
) {
    return L.divIcon({
        className: "fairtrip-map-marker",

        html: `
            <div
                style="
                    width:${selected ? 42 : 34}px;
                    height:${selected ? 42 : 34}px;
                    border-radius:9999px;
                    background:#ef713d;
                    border:3px solid white;
                    box-shadow:0 8px 22px rgba(18,60,53,.28);
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    color:white;
                    font-size:${selected ? 18 : 14}px;
                    font-weight:900;
                "
            >
                ${selected ? "★" : "•"}
            </div>
        `,

        iconSize: [
            selected ? 42 : 34,
            selected ? 42 : 34,
        ],

        iconAnchor: [
            selected ? 21 : 17,
            selected ? 21 : 17,
        ],

        popupAnchor: [
            0,
            selected ? -20 : -17,
        ],
    });
}

/* -------------------------------------------------------------------------- */
/* MAP CENTER                                                                 */
/* -------------------------------------------------------------------------- */

function MapCenterController({
    latitude,
    longitude,
}: {
    latitude: number;
    longitude: number;
}) {
    const map = useMap();

    useEffect(() => {
        map.setView(
            [latitude, longitude],
            Math.max(map.getZoom(), 14),
            {
                animate: true,
            },
        );
    }, [
        latitude,
        longitude,
        map,
    ]);

    return null;
}

/* -------------------------------------------------------------------------- */
/* MAP SEARCH CONTROLLER                                                      */
/* -------------------------------------------------------------------------- */

function MapSearchController({
    query,
    destinations,
}: {
    query: string;
    destinations: Destination[];
}) {
    const map = useMap();

    useEffect(() => {
        if (!query.trim()) {
            return;
        }

        const normalized =
            query
                .trim()
                .toLowerCase();

        const match =
            destinations.find(
                (destination) =>
                    destination.name
                        .toLowerCase()
                        .includes(normalized),
            );

        if (!match) {
            return;
        }

        const coordinates =
            getDestinationCoordinates(
                match,
            );

        if (!coordinates) {
            return;
        }

        map.flyTo(
            [
                coordinates.latitude,
                coordinates.longitude,
            ],
            16,
            {
                duration: 0.8,
            },
        );
    }, [
        query,
        destinations,
        map,
    ]);

    return null;
}

/* -------------------------------------------------------------------------- */
/* COORDINATE HELPER                                                          */
/* -------------------------------------------------------------------------- */

function getDestinationCoordinates(
    destination: Destination,
) {
    const latitude =
        destination.latitude ??
        destination.lat;

    const longitude =
        destination.longitude ??
        destination.lon;

    if (
        typeof latitude !== "number" ||
        typeof longitude !== "number"
    ) {
        return null;
    }

    return {
        latitude,
        longitude,
    };
}

/* -------------------------------------------------------------------------- */
/* DISTANCE                                                                    */
/* -------------------------------------------------------------------------- */

function formatDistance(
    destination: Destination,
): string | null {
    if (
        typeof destination.distanceKm !==
        "number"
    ) {
        return null;
    }

    if (
        destination.distanceKm < 1
    ) {
        return `${Math.round(
            destination.distanceKm * 1000,
        )} m`;
    }

    return `${destination.distanceKm.toFixed(
        1,
    )} km`;
}

/* -------------------------------------------------------------------------- */
/* CATEGORY                                                                    */
/* -------------------------------------------------------------------------- */

function getCategory(
    destination: Destination,
): string {
    if (
        destination.category
    ) {
        return destination.category;
    }

    return "Place to explore";
}

/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT                                                             */
/* -------------------------------------------------------------------------- */

export default function LocationMapClient({
    location,
    destinations = [],
    onSelectPlace,
}: LocationMapClientProps) {
    const [search, setSearch] =
        useState("");

    const [
        selectedId,
        setSelectedId,
    ] = useState<
        string | number | null
    >(null);

    /*
     * Current user location.
     */

    const center = useMemo(
        () => ({
            latitude:
                location?.latitude ??
                DEFAULT_LOCATION.latitude,

            longitude:
                location?.longitude ??
                DEFAULT_LOCATION.longitude,
        }),
        [location],
    );

    /*
     * Only places having valid coordinates
     * should become markers.
     */

    const validDestinations =
        useMemo(
            () =>
                destinations.filter(
                    (destination) =>
                        Boolean(
                            getDestinationCoordinates(
                                destination,
                            ),
                        ),
                ),
            [destinations],
        );

    /*
     * Search suggestions.
     */

    const searchResults =
        useMemo(() => {
            const query =
                search
                    .trim()
                    .toLowerCase();

            if (!query) {
                return [];
            }

            return validDestinations
                .filter(
                    (destination) =>
                        destination.name
                            .toLowerCase()
                            .includes(query),
                )
                .slice(0, 5);
        }, [
            search,
            validDestinations,
        ]);

    function handleSelect(
        destination: Destination,
    ) {
        setSelectedId(
            destination.id,
        );

        setSearch(
            destination.name,
        );

        onSelectPlace?.(
            destination,
        );
    }

    return (
        <div className="relative h-full w-full overflow-hidden rounded-[24px]">

            {/* ========================================================== */}
            {/* SEARCH BAR                                                 */}
            {/* ========================================================== */}

            <div className="absolute left-4 right-4 top-4 z-[1000] sm:left-5 sm:right-auto sm:w-[360px]">

                <div className="flex h-12 items-center rounded-full border border-[#123c35]/10 bg-white/95 px-4 shadow-[0_12px_35px_rgba(18,60,53,.15)] backdrop-blur">

                    <Search className="h-4 w-4 shrink-0 text-[#ef713d]" />

                    <input
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value,
                            )
                        }
                        placeholder="Search nearby places..."
                        className="ml-3 w-full bg-transparent text-sm font-semibold text-[#123c35] outline-none placeholder:text-[#6d7974]/60"
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() =>
                                setSearch("")
                            }
                            className="ml-2 text-xs font-black text-[#6d7974]"
                            aria-label="Clear search"
                        >
                            ×
                        </button>
                    )}
                </div>

                {/* SEARCH RESULTS */}

                {searchResults.length >
                    0 && (
                    <div className="mt-2 overflow-hidden rounded-[18px] border border-[#123c35]/10 bg-white shadow-[0_18px_40px_rgba(18,60,53,.16)]">

                        {searchResults.map(
                            (
                                destination,
                            ) => (
                                <button
                                    key={
                                        destination.id
                                    }
                                    type="button"
                                    onClick={() =>
                                        handleSelect(
                                            destination,
                                        )
                                    }
                                    className="flex w-full items-center gap-3 border-b border-[#123c35]/5 px-4 py-3 text-left last:border-0 hover:bg-[#f7f3ea]"
                                >
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8f58d] text-[#123c35]">
                                        <Search className="h-3.5 w-3.5" />
                                    </span>

                                    <span className="min-w-0">
                                        <span className="block truncate text-xs font-black text-[#123c35]">
                                            {
                                                destination.name
                                            }
                                        </span>

                                        <span className="mt-0.5 block text-[10px] font-medium text-[#6d7974]">
                                            {
                                                getCategory(
                                                    destination,
                                                )
                                            }
                                        </span>
                                    </span>
                                </button>
                            ),
                        )}
                    </div>
                )}
            </div>

            {/* ========================================================== */}
            {/* MAP                                                         */}
            {/* ========================================================== */}

            <MapContainer
                center={[
                    center.latitude,
                    center.longitude,
                ]}
                zoom={14}
                scrollWheelZoom
                className="h-full w-full"
                zoomControl={false}
            >

                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Move map when location changes */}

                <MapCenterController
                    latitude={
                        center.latitude
                    }
                    longitude={
                        center.longitude
                    }
                />

                {/* Move map to searched place */}

                <MapSearchController
                    query={search}
                    destinations={
                        validDestinations
                    }
                />

                {/* ====================================================== */}
                {/* CURRENT LOCATION                                       */}
                {/* ====================================================== */}

                <CircleMarker
                    center={[
                        center.latitude,
                        center.longitude,
                    ]}
                    radius={9}
                    pathOptions={{
                        color: "#ffffff",
                        weight: 4,
                        fillColor:
                            "#123c35",
                        fillOpacity: 1,
                    }}
                >
                    <Popup>
                        <div className="min-w-[150px]">
                            <p className="text-[9px] font-black uppercase tracking-[.15em] text-[#ef713d]">
                                Your location
                            </p>

                            <p className="mt-1 text-sm font-black text-[#123c35]">
                                Current location
                            </p>

                            <p className="mt-1 text-[10px] text-[#6d7974]">
                                {center.latitude.toFixed(
                                    4,
                                )}
                                {" · "}
                                {center.longitude.toFixed(
                                    4,
                                )}
                            </p>
                        </div>
                    </Popup>
                </CircleMarker>

                {/* ====================================================== */}
                {/* DESTINATION MARKERS                                    */}
                {/* ====================================================== */}

                {validDestinations.map(
                    (
                        destination,
                    ) => {
                        const coordinates =
                            getDestinationCoordinates(
                                destination,
                            );

                        if (
                            !coordinates
                        ) {
                            return null;
                        }

                        const selected =
                            selectedId ===
                            destination.id;

                        return (
                            <Marker
                                key={
                                    destination.id
                                }
                                position={[
                                    coordinates.latitude,
                                    coordinates.longitude,
                                ]}
                                icon={createPlaceIcon(
                                    selected,
                                )}
                                eventHandlers={{
                                    click: () =>
                                        handleSelect(
                                            destination,
                                        ),
                                }}
                            >
                                <Popup>
                                    <div className="w-[210px]">

                                        <p className="text-[9px] font-black uppercase tracking-[.15em] text-[#ef713d]">
                                            {
                                                getCategory(
                                                    destination,
                                                )
                                            }
                                        </p>

                                        <h3 className="mt-1 text-base font-black text-[#123c35]">
                                            {
                                                destination.name
                                            }
                                        </h3>

                                        <div className="mt-2 flex flex-wrap gap-2">

                                            {formatDistance(
                                                destination,
                                            ) && (
                                                <span className="rounded-full bg-[#f7f3ea] px-2.5 py-1 text-[9px] font-bold text-[#31544d]">
                                                    {
                                                        formatDistance(
                                                            destination,
                                                        )
                                                    }
                                                </span>
                                            )}

                                            {typeof destination.rating ===
                                                "number" && (
                                                <span className="rounded-full bg-[#e8f58d] px-2.5 py-1 text-[9px] font-bold text-[#123c35]">
                                                    ★{" "}
                                                    {
                                                        destination.rating
                                                    }
                                                </span>
                                            )}
                                        </div>

                                        {destination.description && (
                                            <p className="mt-3 text-[10px] leading-4 text-[#6d7974]">
                                                {
                                                    destination.description
                                                }
                                            </p>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleSelect(
                                                    destination,
                                                )
                                            }
                                            className="mt-4 flex h-9 w-full items-center justify-center rounded-full bg-[#123c35] text-[10px] font-black text-white"
                                        >
                                            Explore this place
                                        </button>

                                    </div>
                                </Popup>
                            </Marker>
                        );
                    },
                )}
            </MapContainer>

            {/* ========================================================== */}
            {/* MAP STATUS                                                 */}
            {/* ========================================================== */}

            <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-[900] flex items-end justify-between gap-3">

                <div className="rounded-full border border-white/70 bg-white/90 px-3 py-2 shadow-sm backdrop-blur">
                    <span className="text-[9px] font-black text-[#123c35]">
                        {validDestinations.length}{" "}
                        nearby{" "}
                        {validDestinations.length ===
                        1
                            ? "place"
                            : "places"}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setSearch("");

                        setSelectedId(
                            null,
                        );
                    }}
                    className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/95 text-[#123c35] shadow-lg backdrop-blur transition hover:scale-105"
                    aria-label="Center on my location"
                >
                    <LocateFixed className="h-4 w-4" />
                </button>

            </div>
        </div>
    );
}