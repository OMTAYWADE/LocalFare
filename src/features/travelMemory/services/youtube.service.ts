import type { ParsedTravelSource } from "./sourceParser.service";

interface YouTubeErrorResponse {
    error?: {
        message?: string;
    };
}

interface ChannelResponse {
    items?: Array<{
        id?: string;
        snippet?: {
            title?: string;
            description?: string;
        };
        contentDetails?: {
            relatedPlaylists?: {
                uploads?: string;
            };
        };
    }>;
}

interface PlaylistItemsResponse {
    items?: Array<{
        contentDetails?: {
            videoId?: string;
            videoPublishedAt?: string;
        };
        snippet?: {
            title?: string;
            description?: string;
            publishedAt?: string;
            channelTitle?: string;
            thumbnails?: Record<string, { url?: string }>;
        };
    }>;
}

interface VideosResponse {
    items?: Array<{
        id?: string;
        snippet?: {
            title?: string;
            description?: string;
            publishedAt?: string;
            channelTitle?: string;
            thumbnails?: Record<string, { url?: string }>;
        };
        contentDetails?: {
            duration?: string;
        };
    }>;
}

interface SearchResponse {
    items?: Array<{
        id?: {
            channelId?: string;
        };
    }>;
}

export interface YouTubeContent {
    contentId: string;
    title: string;
    description: string;
    publishedAt?: string;
    channelTitle?: string;
    thumbnailUrl?: string;
    duration?: string;
    sourceUrl: string;
}

async function youtubeRequest<T>(
    endpoint: string,
    params: Record<string, string>,
): Promise<T> {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) throw new Error("YOUTUBE_API_KEY is not configured.");

    const query = new URLSearchParams({ ...params, key: apiKey });
    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/${endpoint}?${query.toString()}`,
        { cache: "no-store" },
    );

    const data = (await response.json()) as T & YouTubeErrorResponse;

    if (!response.ok) {
        throw new Error(data.error?.message ?? "YouTube API request failed.");
    }

    return data;
}

function thumbnailUrl(
    thumbnails?: Record<string, { url?: string }>,
): string | undefined {
    return (
        thumbnails?.maxres?.url ??
        thumbnails?.standard?.url ??
        thumbnails?.high?.url ??
        thumbnails?.medium?.url ??
        thumbnails?.default?.url
    );
}

async function resolveChannelId(sourceId: string): Promise<string> {
    if (!sourceId.startsWith("@")) return sourceId;

    const channel = await youtubeRequest<ChannelResponse>("channels", {
        part: "id",
        forHandle: sourceId,
    });

    const id = channel.items?.[0]?.id;
    if (!id) throw new Error("Could not resolve that YouTube handle to a channel.");
    return id;
}

async function getLatestFromChannel(channelIdOrHandle: string): Promise<YouTubeContent> {
    const channelId = await resolveChannelId(channelIdOrHandle);

    const channel = await youtubeRequest<ChannelResponse>("channels", {
        part: "snippet,contentDetails",
        id: channelId,
    });

    const item = channel.items?.[0];
    const uploadsPlaylistId = item?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
        throw new Error("Could not find the channel uploads playlist.");
    }

    const playlist = await youtubeRequest<PlaylistItemsResponse>("playlistItems", {
        part: "snippet,contentDetails",
        playlistId: uploadsPlaylistId,
        maxResults: "1",
    });

    const latest = playlist.items?.[0];
    const videoId = latest?.contentDetails?.videoId;

    if (!videoId) {
        throw new Error("No uploaded videos were found for this YouTube channel.");
    }

    return {
        contentId: videoId,
        title: latest?.snippet?.title ?? "Untitled video",
        description: latest?.snippet?.description ?? "",
        publishedAt:
            latest?.contentDetails?.videoPublishedAt ?? latest?.snippet?.publishedAt,
        channelTitle: latest?.snippet?.channelTitle ?? item?.snippet?.title,
        thumbnailUrl: thumbnailUrl(latest?.snippet?.thumbnails),
        sourceUrl: `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`,
    };
}

async function getVideo(videoId: string): Promise<YouTubeContent> {
    const data = await youtubeRequest<VideosResponse>("videos", {
        part: "snippet,contentDetails",
        id: videoId,
    });

    const item = data.items?.[0];
    if (!item?.id) {
        throw new Error("YouTube video was not found or is not accessible.");
    }

    return {
        contentId: item.id,
        title: item.snippet?.title ?? "Untitled video",
        description: item.snippet?.description ?? "",
        publishedAt: item.snippet?.publishedAt,
        channelTitle: item.snippet?.channelTitle,
        thumbnailUrl: thumbnailUrl(item.snippet?.thumbnails),
        duration: item.contentDetails?.duration,
        sourceUrl: `https://www.youtube.com/watch?v=${encodeURIComponent(item.id)}`,
    };
}

export async function fetchYouTubeContent(
    source: ParsedTravelSource,
): Promise<YouTubeContent> {
    if (source.platform !== "youtube") {
        throw new Error("This source is not a YouTube source.");
    }

    if (!source.sourceId) {
        throw new Error("The YouTube source does not contain an ID.");
    }

    if (source.sourceType === "video") {
        return getVideo(source.sourceId);
    }

    if (source.sourceType === "channel") {
        return getLatestFromChannel(source.sourceId);
    }

    throw new Error("Unsupported YouTube source type.");
}

// Kept intentionally unused in the MVP. Search can be enabled later for discovery.
export async function searchYouTubeChannel(query: string): Promise<string | undefined> {
    const data = await youtubeRequest<SearchResponse>("search", {
        part: "snippet",
        q: query,
        type: "channel",
        maxResults: "1",
    });

    return data.items?.[0]?.id?.channelId;
}
