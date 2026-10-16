import type { ChannelGroup } from "@/lib/types";
import { ChannelCard } from "./ChannelCard";

export function ChannelGroupGrid({ groups }: { groups: ChannelGroup[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {groups.map((g) => (
        <ChannelCard key={g.main.channelId} channel={g.main} subChannels={g.subs} />
      ))}
    </div>
  );
}
