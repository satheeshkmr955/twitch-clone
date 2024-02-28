"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { useMutationGraphQL } from "@/hooks/use-graphql";

import { FollowUserDocument } from "@/gql/graphql";

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
        // console.log("data", data.data?.followUser);
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
