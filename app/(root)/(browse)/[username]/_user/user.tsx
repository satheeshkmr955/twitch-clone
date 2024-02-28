"use client";

import { notFound } from "next/navigation";

import { GetUserByNameDocument, IsFollowingUserDocument } from "@/gql/graphql";
import { useGraphQL } from "@/hooks/use-graphql";

import { UserProps } from "./types";
import { Actions } from "../_components/actions";
import { Skeleton } from "@/components/ui/skeleton";

const User = (props: UserProps) => {
  const { params } = props;
  const { username } = params;

  const { data } = useGraphQL(GetUserByNameDocument, {
    input: { name: decodeURI(username) },
  });

  const isUserExists = data?.data?.getUserByName || null;

  if (!isUserExists) {
    notFound();
  }

  const { data: followingData, isLoading } = useGraphQL(
    IsFollowingUserDocument,
    {
      input: { id: isUserExists?.id! },
    }
  );

  return (
    <div className="flex flex-col gap-y-4">
      <p>name: {isUserExists.name}</p>
      <p>email: {isUserExists.email}</p>
      <p>id: {isUserExists.id}</p>
      {isLoading ? (
        <FollowSkeleton />
      ) : (
        <>
          <p>is following: {`${followingData?.data?.isFollowingUser}`}</p>
          <Actions isFollowingUser={followingData?.data?.isFollowingUser!} />
        </>
      )}
    </div>
  );
};

const FollowSkeleton = () => {
  return (
    <>
      <Skeleton className="h-4 w-36 mt-2" />
      <Skeleton className="h-10 w-full" />
    </>
  );
};

export default User;
