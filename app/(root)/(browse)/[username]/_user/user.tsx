"use client";

import { notFound } from "next/navigation";

import {
  GetUserByNameWithAllDetailsDocument,
  Stream,
  User,
} from "@/gql/graphql";
import { useGraphQL } from "@/hooks/use-graphql";

import { UserProps } from "./types";
import { Skeleton } from "@/components/ui/skeleton";
import { StreamPlayer } from "@/components/stream-player";

const User = (props: UserProps) => {
  const { params } = props;
  const { username } = params;

  const { data } = useGraphQL(GetUserByNameWithAllDetailsDocument, {
    input: { name: decodeURI(username) },
  });

  const isUserExists = data?.data?.getUserByNameWithAllDetails.user || null;

  if (!isUserExists) {
    notFound();
  }

  const isFollowing = data?.data?.getUserByNameWithAllDetails.isFollowing;
  const isBlocked = data?.data?.getUserByNameWithAllDetails.isBlocked;

  if (isBlocked) {
    notFound();
  }

  return (
    <>
      <StreamPlayer
        user={isUserExists as User}
        isFollowing={isFollowing!}
        stream={isUserExists.stream as Stream}
      />
    </>
  );
};

export const FollowSkeleton = () => {
  return (
    <>
      <Skeleton className="h-4 w-36 mt-2" />
      <Skeleton className="h-10 w-full" />
    </>
  );
};

export default User;
