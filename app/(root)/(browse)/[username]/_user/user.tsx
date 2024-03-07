"use client";

import { notFound } from "next/navigation";

import { GetUserByNameWithFollowingStatusDocument } from "@/gql/graphql";
import { useGraphQL } from "@/hooks/use-graphql";

import { UserProps } from "./types";
import { Actions } from "../_components/actions";
import { Skeleton } from "@/components/ui/skeleton";

const User = (props: UserProps) => {
  const { params } = props;
  const { username } = params;

  const { data } = useGraphQL(GetUserByNameWithFollowingStatusDocument, {
    input: { name: decodeURI(username) },
  });

  const isUserExists =
    data?.data?.getUserByNameWithFollowingStatus.user || null;

  const isFollowing = data?.data?.getUserByNameWithFollowingStatus.isFollowing;

  if (!isUserExists) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-y-4">
      <p>name: {isUserExists.name}</p>
      <p>email: {isUserExists.email}</p>
      <p>id: {isUserExists.id}</p>
      <p>is following: {`${isFollowing!}`}</p>
      <Actions userId={isUserExists.id} isFollowingUser={isFollowing!} />
    </div>
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
