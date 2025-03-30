"use client";

import { Suspense } from "react";
import { DehydratedState, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";

import { GetUserByNameWithAllDetailsDocument } from "@/gql/graphql";
import { useSuspenseQueryGraphQL } from "@/hooks/use-graphql";

import type { Stream, User } from "@/gql/graphql";

import { UserProps } from "./types";
import { Skeleton } from "@/components/ui/skeleton";
import { StreamPlayer } from "@/components/stream-player";

interface CustomUserProps extends UserProps {
  dehydratedState: DehydratedState;
}

const User = (props: CustomUserProps) => {
  const { username, dehydratedState } = props;

  const { data, isLoading } = useSuspenseQueryGraphQL(
    GetUserByNameWithAllDetailsDocument,
    {
      input: { name: decodeURI(username) },
    }
  );

  if (isLoading) {
    return null;
  }

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
      <Suspense fallback={<FollowSkeleton />}>
        <HydrationBoundary state={dehydratedState}>
          <StreamPlayer
            user={isUserExists as User}
            isFollowing={isFollowing!}
            stream={isUserExists.stream as Stream}
          />
        </HydrationBoundary>
      </Suspense>
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
