"use client";

import { Button } from "@/components/ui/button";
import { getCacheKey, useMutationGraphQL } from "@/hooks/use-graphql";

import {
  BlockUserDocument,
  FollowUserDocument,
  GetBlockedUsersDocument,
  GetFollowedAndRecommendedUserDocument,
  GetUserByNameWithAllDetailsDocument,
  UnBlockUserDocument,
  UnFollowUserDocument,
} from "@/gql/graphql";
import { triggerToast } from "@/lib/utils";
import { getQueryClient } from "@/lib/queryclient";
import { logger } from "@/lib/logger";
import { TriggerToastProps } from "@/app/_types";

interface ActionProps {
  isFollowingUser: boolean;
  isBlocked: boolean;
  userId: string;
}

export const Actions = (props: ActionProps) => {
  const { isFollowingUser, userId, isBlocked } = props;

  const { mutate: followMutate, isPending: followPending } = useMutationGraphQL(
    FollowUserDocument,
    {
      input: { id: userId },
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
        console.error(error);
        logger.error(error);
      },
    }
  );

  const { mutate: unFollowMutate, isPending: unFPending } = useMutationGraphQL(
    UnFollowUserDocument,
    {
      input: { id: userId },
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
        console.error(error);
        logger.error(error);
      },
    }
  );

  const onFollowClickHandler = () => {
    followMutate();
  };

  const onUnfollowClickHandler = () => {
    unFollowMutate();
  };

  const onClickFollowHandler = () => {
    if (isFollowingUser) {
      onUnfollowClickHandler();
    } else {
      onFollowClickHandler();
    }
  };

  const { mutate: blockMutate, isPending: blockPending } = useMutationGraphQL(
    BlockUserDocument,
    {
      input: { id: userId },
    },
    {
      onSuccess: (data) => {
        triggerToast(data.data?.blockUser?.toast! as TriggerToastProps);
        if (data.data?.blockUser?.block) {
          const queryKey2 = [
            getCacheKey(GetFollowedAndRecommendedUserDocument),
          ];
          const queryClient = getQueryClient();
          const queryKey1 = [getCacheKey(GetBlockedUsersDocument)];
          queryClient.invalidateQueries({ queryKey: queryKey1 });
          queryClient.invalidateQueries({ queryKey: queryKey2 });
        }
      },
      onError(error) {
        console.error(error);
        logger.error(error);
      },
    }
  );

  const { mutate: unBlockMutate, isPending: unBlkPending } = useMutationGraphQL(
    UnBlockUserDocument,
    {
      input: { id: userId },
    },
    {
      onSuccess: (data) => {
        triggerToast(data.data?.unBlockUser?.toast! as TriggerToastProps);
        if (data.data?.unBlockUser?.block) {
          const queryKey2 = [
            getCacheKey(GetFollowedAndRecommendedUserDocument),
          ];
          const queryClient = getQueryClient();
          const queryKey1 = [getCacheKey(GetBlockedUsersDocument)];
          queryClient.invalidateQueries({ queryKey: queryKey1 });
          queryClient.invalidateQueries({ queryKey: queryKey2 });
        }
      },
      onError(error) {
        console.error(error);
        logger.error(error);
      },
    }
  );

  const onBlockClickHandler = () => {
    blockMutate();
  };

  const onUnblockClickHandler = () => {
    unBlockMutate();
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
        disabled={followPending || unFPending || blockPending || unBlkPending}
        onClick={onClickFollowHandler}
        variant={"primary"}
      >
        {isFollowingUser ? "Unfollow" : "Follow"}
      </Button>
      <Button
        disabled={followPending || unFPending || blockPending || unBlkPending}
        onClick={onClickBlockHandler}
        variant={"primary"}
      >
        {isBlocked ? "Unblock" : "Block"}
      </Button>
    </>
  );
};
