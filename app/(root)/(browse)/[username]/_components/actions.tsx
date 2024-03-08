"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { getCacheKey, useMutationGraphQL } from "@/hooks/use-graphql";

import {
  FollowUserDocument,
  GetFollowedAndRecommendedUserDocument,
  GetUserByNameWithFollowingStatusDocument,
  UnFollowUserDocument,
} from "@/gql/graphql";
import { triggerToast } from "@/lib/utils";
import { getQueryClient } from "@/lib/queryclient";
import { TriggerToastProps } from "@/app/_types";

interface ActionProps {
  isFollowingUser: boolean;
  userId: string;
}

export const Actions = (props: ActionProps) => {
  const { isFollowingUser, userId } = props;

  const [isPending, startTransition] = useTransition();

  const { mutate: followMutate } = useMutationGraphQL(
    FollowUserDocument,
    {
      input: { id: userId },
    },
    {
      onSuccess: (data) => {
        triggerToast(data.data?.followUser?.toast! as TriggerToastProps);
        // triggerToast(data.data?.toast);
        if (data.data?.followUser?.follow) {
          const queryKey1 = [
            getCacheKey(GetUserByNameWithFollowingStatusDocument),
            {
              input: { name: data.data.followUser.follow.following.name },
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

  const { mutate: unFollowMutate } = useMutationGraphQL(
    UnFollowUserDocument,
    {
      input: { id: userId },
    },
    {
      onSuccess: (data) => {
        triggerToast(data.data?.unFollowUser?.toast! as TriggerToastProps);
        // triggerToast(data.data?.toast);
        if (data.data?.unFollowUser?.follow) {
          const queryKey1 = [
            getCacheKey(GetUserByNameWithFollowingStatusDocument),
            {
              input: { name: data.data.unFollowUser.follow.following.name },
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

  const onFollowClickHandler = () => {
    startTransition(() => {
      followMutate();
    });
  };

  const onUnfollowClickHandler = () => {
    startTransition(() => {
      unFollowMutate();
    });
  };

  const onClick = () => {
    if (isFollowingUser) {
      onUnfollowClickHandler();
    } else {
      onFollowClickHandler();
    }
  };

  return (
    <Button disabled={isPending} onClick={onClick} variant={"primary"}>
      {isFollowingUser ? "Unfollow" : "Follow"}
    </Button>
  );
};
