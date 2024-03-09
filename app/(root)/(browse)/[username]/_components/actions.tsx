"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { getCacheKey, useMutationGraphQL } from "@/hooks/use-graphql";

import {
  BlockUserDocument,
  FollowUserDocument,
  GetFollowedAndRecommendedUserDocument,
  GetUserByNameWithAllDetailsDocument,
  UnBlockUserDocument,
  UnFollowUserDocument,
} from "@/gql/graphql";
import { triggerToast } from "@/lib/utils";
import { getQueryClient } from "@/lib/queryclient";
import { TriggerToastProps } from "@/app/_types";

interface ActionProps {
  isFollowingUser: boolean;
  isBlocked: boolean;
  userId: string;
}

export const Actions = (props: ActionProps) => {
  const { isFollowingUser, userId, isBlocked } = props;

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
            getCacheKey(GetUserByNameWithAllDetailsDocument),
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
            getCacheKey(GetUserByNameWithAllDetailsDocument),
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

  const onClickFollowHandler = () => {
    if (isFollowingUser) {
      onUnfollowClickHandler();
    } else {
      onFollowClickHandler();
    }
  };

  const { mutate: blockMutate } = useMutationGraphQL(
    BlockUserDocument,
    {
      input: { id: userId },
    },
    {
      onSuccess: (data) => {
        triggerToast(data.data?.blockUser?.toast! as TriggerToastProps);
        // triggerToast(data.data?.toast);
        if (data.data?.blockUser?.block) {
          const queryKey2 = [
            getCacheKey(GetFollowedAndRecommendedUserDocument),
          ];
          const queryClient = getQueryClient();
          queryClient.invalidateQueries({ queryKey: queryKey2 });
        }
      },
      onError(error) {
        // console.log("error", error);
      },
    }
  );

  const { mutate: unBlockMutate } = useMutationGraphQL(
    UnBlockUserDocument,
    {
      input: { id: userId },
    },
    {
      onSuccess: (data) => {
        triggerToast(data.data?.unBlockUser?.toast! as TriggerToastProps);
        // triggerToast(data.data?.toast);
        if (data.data?.unBlockUser?.block) {
          const queryKey2 = [
            getCacheKey(GetFollowedAndRecommendedUserDocument),
          ];
          const queryClient = getQueryClient();
          queryClient.invalidateQueries({ queryKey: queryKey2 });
        }
      },
      onError(error) {
        // console.log("error", error);
      },
    }
  );

  const onBlockClickHandler = () => {
    startTransition(() => {
      blockMutate();
    });
  };

  const onUnblockClickHandler = () => {
    startTransition(() => {
      unBlockMutate();
    });
  };

  const onClickBlockHandler = () => {
    if (isBlocked) {
      onUnblockClickHandler();
    } else {
      onBlockClickHandler();
    }
  };

  return (
    <>
      <Button
        disabled={isPending}
        onClick={onClickFollowHandler}
        variant={"primary"}
      >
        {isFollowingUser ? "Unfollow" : "Follow"}
      </Button>
      <Button
        disabled={isPending}
        onClick={onClickBlockHandler}
        variant={"primary"}
      >
        {isBlocked ? "Unblock" : "Block"}
      </Button>
    </>
  );
};
