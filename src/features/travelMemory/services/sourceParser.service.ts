import type {
    TravelSourcePlatform,
    TravelSourceType,
} from "../types/travelMemory.types";

export interface ParsedTravelSource {
    platform: TravelSourcePlatform;
    sourceType: TravelSourceType;
    sourceId?: string;
    normalizedUrl: string;
}

function createUrl(value: string): URL {
    const trimmed = value.trim();
    if (!trimmed) throw new Error("Source URL is required.");

    let url: URL;
    try {
        url = new URL(trimmed);
    } catch {
        throw new Error("Paste a valid YouTube or Instagram URL.");
    }

    url.hash = "";
    return url;
}

function hostnameOf(url: URL): string {
    return url.hostname.toLowerCase().replace(/^www\./, "");
}

function partsOf(url: URL): string[] {
    return url.pathname.split("/").filter(Boolean);
}

function parseYouTube(url: URL): ParsedTravelSource {
    const hostname = hostnameOf(url);
    const isYouTube =
        hostname === "youtube.com" ||
        hostname === "m.youtube.com" ||
        hostname === "youtu.be";

    if (!isYouTube) {
        throw new Error("Not a YouTube URL.");
    }

    if (hostname === "youtu.be") {
        const videoId = partsOf(url)[0];
        if (!videoId) throw new Error("The YouTube URL does not contain a video ID.");

        return {
            platform: "youtube",
            sourceType: "video",
            sourceId: videoId,
            normalizedUrl: `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`,
        };
    }

    const videoId =
        url.searchParams.get("v") ||
        (() => {
            const parts = partsOf(url);
            const marker = parts.findIndex(
                (part) => part === "shorts" || part === "live",
            );
            return marker >= 0 ? parts[marker + 1] : undefined;
        })();

    if (videoId) {
        return {
            platform: "youtube",
            sourceType: "video",
            sourceId: videoId,
            normalizedUrl: `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`,
        };
    }

    const parts = partsOf(url);

    if (parts[0] === "channel" && parts[1]) {
        return {
            platform: "youtube",
            sourceType: "channel",
            sourceId: parts[1],
            normalizedUrl: `https://www.youtube.com/channel/${encodeURIComponent(parts[1])}`,
        };
    }

    if (parts[0]?.startsWith("@")) {
        const handle = parts[0];
        return {
            platform: "youtube",
            sourceType: "channel",
            sourceId: handle,
            normalizedUrl: `https://www.youtube.com/${encodeURIComponent(handle)}`,
        };
    }

    if (parts[0] === "user" && parts[1]) {
        return {
            platform: "youtube",
            sourceType: "channel",
            sourceId: parts[1],
            normalizedUrl: `https://www.youtube.com/user/${encodeURIComponent(parts[1])}`,
        };
    }

    throw new Error("Paste a YouTube video, channel, or @handle URL.");
}

function parseInstagram(url: URL): ParsedTravelSource {
    if (hostnameOf(url) !== "instagram.com") {
        throw new Error("Not an Instagram URL.");
    }

    const parts = partsOf(url);
    const first = parts[0];

    if (first === "reel" || first === "reels" || first === "p" || first === "tv") {
        if (!parts[1]) throw new Error("The Instagram post URL does not contain an ID.");

        return {
            platform: "instagram",
            sourceType: "post",
            sourceId: parts[1],
            normalizedUrl: `https://www.instagram.com/${first}/${encodeURIComponent(parts[1])}/`,
        };
    }

    if (first && first !== "accounts" && first !== "explore") {
        return {
            platform: "instagram",
            sourceType: "profile",
            sourceId: first,
            normalizedUrl: `https://www.instagram.com/${encodeURIComponent(first)}/`,
        };
    }

    throw new Error("Paste a public Instagram profile or post URL.");
}

export function parseTravelSource(input: string): ParsedTravelSource {
    const url = createUrl(input);
    const hostname = hostnameOf(url);

    if (
        hostname === "youtube.com" ||
        hostname === "m.youtube.com" ||
        hostname === "youtu.be"
    ) {
        return parseYouTube(url);
    }

    if (hostname === "instagram.com") {
        return parseInstagram(url);
    }

    throw new Error("Unsupported source. Use a YouTube or Instagram URL.");
}

export function isTravelSourceUrl(input: string): boolean {
    try {
        parseTravelSource(input);
        return true;
    } catch {
        return false;
    }
}
