"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { fetchChannels } from "@/lib/api";
import { buildGroups, collectUploads } from "@/lib/network";
import type { Channel, ChannelGroup, UploadItem, VideoTypeFilter } from "@/lib/types";

type Status = "loading" | "ready" | "error";
const VIDEO_FILTER_KEY = "youtube-dashboard-video-filter";
const filterListeners = new Set<() => void>();

function getVideoFilter(): VideoTypeFilter {
  if (typeof window === "undefined") return "all";
  const saved = window.localStorage.getItem(VIDEO_FILTER_KEY);
  return saved === "videos" || saved === "shorts" ? saved : "all";
}

function subscribeToVideoFilter(listener: () => void) {
  filterListeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    filterListeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

interface NetworkState {
  status: Status;
  error: string | null;
  updatedAt: Date | null;
  refreshing: boolean;
  refresh: () => void;
  channels: Channel[];
  groups: ChannelGroup[];
  /** The four main channels, in display order. */
  mains: Channel[];
  /** Every fetched video from every channel, newest first. */
  uploads: UploadItem[];
  videoType: VideoTypeFilter;
  setVideoType: (filter: VideoTypeFilter) => void;
}

const NetworkContext = createContext<NetworkState | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>("loading");
  const [channels, setChannels] = useState<Channel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState(0);
  const videoType = useSyncExternalStore(subscribeToVideoFilter, getVideoFilter, () => "all" as VideoTypeFilter);

  const setVideoType = useCallback((filter: VideoTypeFilter) => {
    window.localStorage.setItem(VIDEO_FILTER_KEY, filter);
    filterListeners.forEach((listener) => listener());
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchChannels(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setChannels(data);
        setError(null);
        setStatus("ready");
        setUpdatedAt(new Date());
      })
      .catch((e: unknown) => {
        if (controller.signal.aborted) return;
        setError(e instanceof Error ? e.message : "Something went wrong while loading data.");
        // Keep showing the last good data if a refresh fails.
        setStatus((prev) => (prev === "ready" ? "ready" : "error"));
      })
      .finally(() => {
        if (!controller.signal.aborted) setRefreshing(false);
      });
    return () => controller.abort();
  }, [token]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    setToken((t) => t + 1);
  }, []);

  const groups = useMemo(() => buildGroups(channels), [channels]);
  const mains = useMemo(() => groups.map((g) => g.main), [groups]);
  const uploads = useMemo(() => collectUploads(channels), [channels]);

  const value = useMemo<NetworkState>(
    () => ({ status, error, updatedAt, refreshing, refresh, channels, groups, mains, uploads, videoType, setVideoType }),
    [status, error, updatedAt, refreshing, refresh, channels, groups, mains, uploads, videoType, setVideoType]
  );

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
}

export function useNetwork(): NetworkState {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error("useNetwork must be used inside <DataProvider>.");
  return ctx;
}
