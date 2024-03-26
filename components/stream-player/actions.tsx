"use client";

import { HeartIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { SIGN_IN } from "@/constants/route.constants";
import { getQueryClient } from "@/lib/queryclient";
import { cn, triggerToast } from "@/lib/utils";
import { getCacheKey, useMutationGraphQL } from "@/hooks/use-graphql";
import {
  FollowUserDocument,
  GetFollowedAndRecommendedUserDocument,
  GetUserByNameWithAllDetailsDocument,
  UnFollowUserDocument,
} from "@/gql/graphql";
import { TriggerToastProps } from "@/app/_types";

interface ActionsProps {
  hostIdentity: string;
  isFollowing: boolean;
  isHost: boolean;
}

export const Actions = (props: ActionsProps) => {
  const { isFollowing, isHost, hostIdentity } = props;

  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id || "";

  const { mutate: followMutate, isPending: followPending } = useMutationGraphQL(
    FollowUserDocument,
    {
      input: { id: hostIdentity },
    },
    {
      onSuccess: (data) => {
        triggerToast(data.data?.followUser?.toast! as TriggerToastProps);
        if (data.data?.followUser?.follow) {
          const queryKey1 = [
            getCacheKey(GetUserByNameWithAllDetailsDocument),
            {
              input: { name: data.data.followUser.follow.following.slugName },
            },
          ];
          const queryKey2 = [
            getCacheKey(GetFollowedAndRecommendedUserDocument),
          ];
          const queryClient = getQueryClient();
          queryClient.invalidateQueries({ queryKey: queryKey1 });
          queryClient.invalidateQueries({ queryKey: queryKey2 });
        }
      },
      onError(error) {
        // console.log("error", error);
      },
    }
  );

  const { mutate: unFollowMutate, isPending: unFPending } = useMutationGraphQL(
    UnFollowUserDocument,
    {
      input: { id: hostIdentity },
    },
    {
      onSuccess: (data) => {
        triggerToast(data.data?.unFollowUser?.toast! as TriggerToastProps);
        if (data.data?.unFollowUser?.follow) {
          const queryKey1 = [
            getCacheKey(GetUserByNameWithAllDetailsDocument),
            {
              input: { name: data.data.unFollowUser.follow.following.slugName },
            },
          ];
          const queryKey2 = [
            getCacheKey(GetFollowedAndRecommendedUserDocument),
          ];
          const queryClient = getQueryClient();
          queryClient.invalidateQueries({ queryKey: queryKey1 });
          queryClient.invalidateQueries({ queryKey: queryKey2 });
        }
      },
      onError(error) {
        // console.log("error", error);
      },
    }
  );

  const toggleFollow = () => {
    if (!userId) {
      return router.push(SIGN_IN);
    }

    if (isHost) return;

    if (isFollowing) {
      unFollowMutate();
    } else {
      followMutate();
    }
  };

  const isPending = followPending || unFPending;

  return (
    <Button
      onClick={toggleFollow}
      disabled={isPending || isHost}
      variant="primary"
      size="sm"
      className="w-full lg:w-auto"
    >
      <HeartIcon
        className={cn("h-4 w-4 mr-2", isFollowing ? "fill-white" : "fill-none")}
      />

      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

export const ActionsSkeleton = () => {
  return <Skeleton className="h-10 w-full lg:w-24" />;
};

Actions.Skeleton = ActionsSkeleton;
