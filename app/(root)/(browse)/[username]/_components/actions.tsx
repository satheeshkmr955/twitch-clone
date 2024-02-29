"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { useMutationGraphQL } from "@/hooks/use-graphql";

import { FollowUserDocument } from "@/gql/graphql";
import { triggerToast } from "@/lib/utils";
import { TriggerToastProps } from "@/app/_types";

interface ActionProps {
  isFollowingUser: boolean;
}

export const Actions = (props: ActionProps) => {
  const { isFollowingUser } = props;

  const [isPending, startTransition] = useTransition();

  const { mutate } = useMutationGraphQL(
    FollowUserDocument,
    {
      input: { id: "" },
    },
    {
      onSuccess: (data) => {
        triggerToast(data.data?.followUser?.toast! as TriggerToastProps);
        // triggerToast(data.data?.toast);
      },
      onError(error) {
        // console.log("error", error);
      },
    }
  );

  const onClick = () => {
    startTransition(() => {
      mutate();
    });
  };

  return (
    <Button
      disabled={isFollowingUser || isPending}
      onClick={onClick}
      variant={"primary"}
    >
      Follow
    </Button>
  );
};
