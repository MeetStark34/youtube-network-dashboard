import { NextResponse } from "next/server";
import { channels } from "@/lib/channels";
import { getVideoType } from "@/lib/shorts";

const API_BASE = "https://www.googleapis.com/youtube/v3";
const UPLOAD_PAGE_SIZE = 50;

type YoutubeVideo = {
  id: string;
  snippet: {
    title: string;
    publishedAt: string;
    tags?: string[];
    thumbnails?: { high?: { url?: string } };
  };
  statistics?: { viewCount?: string; likeCount?: string; commentCount?: string };
  contentDetails?: { duration?: string };
};

async function youtubeRequest(
  endpoint: string,
  params: Record<string, string>
) {
  const apiKey = process.env.YOUTUBE_API_KEY;

  const searchParams = new URLSearchParams({
    ...params,
    key: apiKey || "",
  });

  const response = await fetch(
    `${API_BASE}/${endpoint}?${searchParams.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.status}`);
  }

  return response.json();
}

export async function GET() {
  try {
    const results = await Promise.all(
      channels.map(async (channel) => {
        const channelData = await youtubeRequest("channels", {
          part: "snippet,statistics,contentDetails",
          forHandle: channel.handle,
        });

        const item = channelData.items?.[0];

        if (!item) {
          return {
            ...channel,
            error: "Channel not found",
          };
        }

        const uploadsPlaylist =
          item.contentDetails.relatedPlaylists.uploads;

        const playlistData = await youtubeRequest("playlistItems", {
          part: "snippet,contentDetails",
          playlistId: uploadsPlaylist,
          maxResults: String(UPLOAD_PAGE_SIZE),
        });

        const videoIds = playlistData.items
          .map((video: { contentDetails?: { videoId?: string } }) => video.contentDetails?.videoId)
          .filter((id: string | undefined): id is string => Boolean(id))
          .join(",");

        let videos: YoutubeVideo[] = [];

        if (videoIds) {
          const videoData = await youtubeRequest("videos", {
            part: "snippet,statistics,contentDetails",
            id: videoIds,
          });

          videos = (videoData.items || []) as YoutubeVideo[];
        }

        return {
          ...channel,
          channelId: item.id,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails?.high?.url,
          subscribers: Number(item.statistics.subscriberCount || 0),
          totalViews: Number(item.statistics.viewCount || 0),
          videoCount: Number(item.statistics.videoCount || 0),
          latestVideos: videos.map((video) => {
            const title = video.snippet.title || "";
            const duration = video.contentDetails?.duration ?? null;
            const type = getVideoType({ title, duration, tags: video.snippet.tags });

            return {
              id: video.id,
              title,
              thumbnail: video.snippet.thumbnails?.high?.url,
              publishedAt: video.snippet.publishedAt,
              views: Number(video.statistics?.viewCount || 0),
              likes: Number(video.statistics?.likeCount || 0),
              comments: Number(video.statistics?.commentCount || 0),
              duration,
              isShort: type === "unknown" ? null : type === "short",
            };
          }),
        };
      })
    );

    return NextResponse.json({
      success: true,
      channels: results,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch YouTube data",
      },
      { status: 500 }
    );
  }
}
