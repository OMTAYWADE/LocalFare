import type { RealPlaceResult, } from "../types";
import type { OverpassElement, } from "../services/overpass.service";

function getCoordinates(element: OverpassElement,) {
    if (typeof element.lat === "number" && typeof element.lon === "number") {
        return {
            latitude: element.lat,
            longitude: element.lon,
        };
    }

    if (element.center) {
        return {
            latitude: element.center.lat,
            longitude: element.center.lon,
        };
    }

    return null;
}

function getCategory(tags: Record<string, string>,) {
    return (tags.amenity ?? tags.tourism ?? tags.shop ?? tags.leisure ?? "place");
}

export function normalizeOsmPlace(element: OverpassElement,): RealPlaceResult | null {
    const coordinates = getCoordinates(element);

    if (!coordinates) {
        return null;
    }

    const tags = element.tags ?? {};
    const name = tags.name ?? tags["name:en"];
    if (!name) {
        return null;
    }

    return {
        id: `osm-${element.type}-${element.id}`,
        name,
        category: getCategory(tags),
        address: (tags["addr:full"] ?? [
            tags["addr:housenumber"],
            tags["addr:street"],
            tags["addr:city"],
        ].filter(Boolean).join(", ")) || undefined,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        phone: tags.phone ?? tags["contact:phone"],
        website: tags.website ?? tags["contact:website"],
        openingHours: tags.opening_hours ? [tags.opening_hours] : undefined,
        osmType: element.type,
        osmId: element.id,
        mapUrl: `https://www.openstreetmap.org/${element.type}/${element.id}`,
        source: "OpenStreetMap",
        lastUpdated: new Date().toISOString(),
    };
}