"use client";

import { getCacheKey, useMutationGraphQL } from "@/hooks/use-graphql";
import { getQueryClient } from "@/lib/queryclient";
import { triggerToast } from "@/lib/utils";
import { logger } from '@/lib/logger';
import {
  UnBlockUserDocument,
  GetFollowedAndRecommendedUserDocument,
  GetBlockedUsersDocument,
} from "@/gql/graphql";
import { TriggerToastProps } from "@/app/_types";
import { Button } from "@/components/ui/button";

interface UnblockButtonProps {
  userId: string;
}

export const UnblockButton = (props: UnblockButtonProps) => {
  const { userId } = props;

  const { mutate, isPending } = useMutationGraphQL(
    UnBlockUserDocument,
    {
      input: { id: userId },
    },
    {
      onSuccess: (data) => {
        triggerToast(data.data?.unBlockUser?.toast! as TriggerToastProps);
        const queryClient = getQueryClient();
        const queryKey1 = [getCacheKey(GetFollowedAndRecommendedUserDocument)];
        const queryKey2 = [getCacheKey(GetBlockedUsersDocument)];
        queryClient.invalidateQueries({ queryKey: queryKey1 });
        queryClient.invalidateQueries({ queryKey: queryKey2 });
      },
      onError(error) {
        console.error(error);
        logger.error(error);
      },
    }
  );

  const onClick = () => {
    mutate();
  };

  return (
    <Button
      disabled={isPending}
      onClick={onClick}
      variant="link"
      size="sm"
      className="text-blue-500 w-full "
    >
      Unblock
    </Button>
  );
};
