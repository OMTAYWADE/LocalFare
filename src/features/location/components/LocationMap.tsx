"use client";

import { MapContainer, Marker, Popup, TileLayer, useMap, } from "react-leaflet";
import { useEffect } from "react";
import type { LatLngExpression } from "leaflet";
import type { UserLocation } from "../types";

interface LocationMapDestination {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
}

interface LocationMapProps {
    location?: UserLocation;
    destinations?: LocationMapDestination[];
}

function RecenterMap({ location, }: { location?: UserLocation; }) {
    const map = useMap();

    useEffect(() => {
        if (!location) {
            return;
        }

        map.flyTo(
            [location.latitude, location.longitude,], 13, { duration: 0.8, },
        );
    }, [location, map]);

    return null;
}

export default function LocationMap({ location, destinations = [], }: LocationMapProps) {
    const defaultCenter: LatLngExpression = [19.076, 72.8777,];
    const center: LatLngExpression = location ? [location.latitude, location.longitude,] : defaultCenter;

    return (
        <div className="overflow-hidden rounded-[28px] border border-[#123c35]/10 bg-[#f7f3ea]">
            <MapContainer center={center} zoom={13} scrollWheelZoom className="h-[360px] w-full">
                <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <RecenterMap location={location} />

                {location && (
                    <Marker position={[location.latitude, location.longitude,]}>
                        <Popup>
                            <strong>
                                Your starting point
                            </strong>
                        </Popup>
                    </Marker>
                )}

                {destinations.map((destination) => (
                    <Marker key={destination.id} position={[destination.latitude, destination.longitude,]}>
                        <Popup>
                            <strong>
                                {destination.name}
                            </strong>
                        </Popup>
                    </Marker>
                ),
                )}
            </MapContainer>
        </div>
    );
}