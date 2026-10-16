export type ChannelKind = "main" | "sub";
export type VideoTypeFilter = "all" | "videos" | "shorts";

export interface Video {
  id: string;
  title: string;
  thumbnail: string | null;
  /** ISO 8601 timestamp. Empty string when the API did not provide one. */
  publishedAt: string;
  views: number | null;
  likes: number | null;
  comments: number | null;
  /** ISO 8601 duration (PT12M34S) or an already formatted string. */
  duration: string | null;
  /** Shorts/video classification; null means available metadata is ambiguous. */
  isShort: boolean | null;
}

export interface Channel {
  name: string;
  handle: string;
  kind: ChannelKind;
  /** Name of the parent channel for subchannels. */
  parent: string | null;
  channelId: string;
  title: string;
  description: string;
  thumbnail: string | null;
  /** null when the channel hides its subscriber count. */
  subscribers: number | null;
  totalViews: number | null;
  videoCount: number | null;
  /** Sorted newest first; up to 50 uploads returned by the YouTube API. */
  latestVideos: Video[];
}

export interface ChannelGroup {
  main: Channel;
  subs: Channel[];
}

export interface UploadItem {
  channel: Channel;
  video: Video;
}
