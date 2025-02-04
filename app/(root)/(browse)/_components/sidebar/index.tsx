"use client";

import { Suspense } from "react";
import { DehydratedState, HydrationBoundary } from "@tanstack/react-query";

import { useSuspenseQueryGraphQL } from "@/hooks/use-graphql";
import {
  FollowPublic,
  GetFollowedAndRecommendedUserDocument,
  UserPublic,
} from "@/gql/graphql";

import { Recommended, RecommendedSkeleton } from "./recommended";
import { Toggle, ToggleSkeleton } from "./toggle";
import { Wrapper } from "./wrapper";
import { Following, FollowingSkeleton } from "./following";

type SidebarProps = {
  dehydratedState: DehydratedState;
};

export const Sidebar = (props: SidebarProps) => {
  const { dehydratedState } = props;

  const { data, isLoading } = useSuspenseQueryGraphQL(
    GetFollowedAndRecommendedUserDocument,
    {
      input: { limit: 10, page: 0 },
    }
  );

  if (isLoading) {
    return <SidebarSkeleton />;
  }

  return (
    <Suspense fallback={<SidebarSkeleton />}>
      <HydrationBoundary state={dehydratedState}>
        <Wrapper>
          <Toggle />
          <div className="space-y-4 pt-4 lg:pt-0">
            {!isLoading && (
              <>
                <Following
                  data={
                    (data?.data?.getFollowedUsers.items as FollowPublic[]) || []
                  }
                />
                <Recommended
                  data={
                    (data?.data?.getRecommended.items as UserPublic[]) || []
                  }
                />
              </>
            )}
          </div>
        </Wrapper>
      </HydrationBoundary>
    </Suspense>
  );
};

export const SidebarSkeleton = () => {
  return (
    <aside className="fixed left-0 flex flex-col w-[70px] lg:w-60 h-full bg-background border-r border-[#2D2E35] z-50">
      <ToggleSkeleton />
      <FollowingSkeleton />
      <RecommendedSkeleton />
    </aside>
  );
};

Sidebar.Skeleton = SidebarSkeleton;
