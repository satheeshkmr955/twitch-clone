"use client";

import { MinusCircleIcon } from "lucide-react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";

import { cn, stringToColor, triggerToast } from "@/lib/utils";
import { getQueryClient } from "@/lib/queryclient";
import { getCacheKey, useMutationGraphQL } from "@/hooks/use-graphql";
import {
  BlockUserDocument,
  GetFollowedAndRecommendedUserDocument,
} from "@/gql/graphql";

import { TriggerToastProps } from "@/app/_types";

interface CommunityItemProps {
  hostName: string;
  viewerName: string;
  participantName?: string;
  participantIdentity: string;
}

export const CommunityItem = (props: CommunityItemProps) => {
  const { hostName, viewerName, participantIdentity, participantName } = props;
  const color = stringToColor(participantName || "");
  const isSelf = participantName === hostName;
  const isHost = viewerName === hostName;

  const { mutate, isPending } = useMutationGraphQL(
    BlockUserDocument,
    {
      input: { id: "" },
    },
    {
      onSuccess: (data) => {
        triggerToast(data.data?.blockUser?.toast! as TriggerToastProps);
        const queryClient = getQueryClient();
        const queryKey = [getCacheKey(GetFollowedAndRecommendedUserDocument)];
        queryClient.invalidateQueries({ queryKey });
      },
      onError(error) {
        // console.log("error", error);
      },
    }
  );

  const handleBlock = () => {
    if (!participantName || isSelf || !isHost) return;
    mutate();
  };

  return (
    <div
      className={cn(
        "group flex items-center justify-between w-full p-2 rounded-md text-sm hover:bg-white/5",
        isPending && "opacity-50 pointer-events-none"
      )}
    >
      <p style={{ color }}>{participantName}</p>
      {isHost && !isSelf && (
        <Hint label="Block">
          <Button
            variant="ghost"
            onClick={handleBlock}
            disabled={isPending}
            className="h-auto w-auto p-1 opacity-0 group-hover:opacity-100 transition"
          >
            <MinusCircleIcon className="h-4 w-4 text-muted-foreground" />
          </Button>
        </Hint>
      )}
    </div>
  );
};
