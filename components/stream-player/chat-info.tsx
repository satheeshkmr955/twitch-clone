"use client";

import { useMemo } from "react";
import { InfoIcon } from "lucide-react";

import { Hint } from "@/components/hint";

interface ChatInfoProps {
  isDelayed: boolean;
  isFollowingsOnly: boolean;
}

export const ChatInfo = (props: ChatInfoProps) => {
  const { isDelayed, isFollowingsOnly } = props;

  const hint = useMemo(() => {
    if (isFollowingsOnly && !isDelayed) {
      return "Only followers can chat";
    }

    if (isDelayed && !isFollowingsOnly) {
      return "Messages are delayed by 3 seconds";
    }

    if (isDelayed && isFollowingsOnly) {
      return "Only followers can chat. Messages are delayed by 3 seconds";
    }

    return "";
  }, [isDelayed, isFollowingsOnly]);

  const label = useMemo(() => {
    if (isFollowingsOnly && !isDelayed) {
      return "Followers only";
    }

    if (isDelayed && !isFollowingsOnly) {
      return "Slow mode";
    }

    if (isDelayed && isFollowingsOnly) {
      return "Followers only and slow mode";
    }

    return "";
  }, [isDelayed, isFollowingsOnly]);

  if (!isDelayed && !isFollowingsOnly) {
    return null;
  }

  return (
    <div className="p-2 text-muted-foreground bg-white/5 border border-white/10 w-full rounded-t-md flex items-center gap-x-2">
      <Hint label={hint}>
        <InfoIcon className="h-4 w-4" />
      </Hint>
      <p className="text-xs font-semibold">{label}</p>
    </div>
  );
};
