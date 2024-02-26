"use client";

import { Recommended, RecommendedSkeleton } from "./recommended";
import { Toggle, ToggleSkeleton } from "./toggle";
import { Wrapper } from "./wrapper";

import { useGraphQL } from "@/hooks/use-graphql";
import { GetRecommendedDocument } from "@/gql/graphql";

export const Sidebar = () => {
  const { data, isLoading } = useGraphQL(GetRecommendedDocument, {
    input: { limit: 10, page: 0 },
  });

  if (isLoading) {
    return <SidebarSkeleton />;
  }

  return (
    <Wrapper>
      <Toggle />
      <div className="space-y-4 pt-4 lg:pt-0">
        {!isLoading && (
          <Recommended data={data?.data?.getRecommended.items || []} />
        )}
      </div>
    </Wrapper>
  );
};

export const SidebarSkeleton = () => {
  return (
    <aside className="fixed left-0 flex flex-col w-[70px] lg:w-60 h-full bg-background border-r border-[#2D2E35] z-50">
      <ToggleSkeleton />
      <RecommendedSkeleton />
    </aside>
  );
};

Sidebar.Skeleton = SidebarSkeleton;
