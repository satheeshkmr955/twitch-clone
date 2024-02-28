"use client";

import { useIsClient } from "usehooks-ts";

import { User } from "@/gql/types";
import { useSidebar } from "@/store/use-sidebar";
import { UserItem, UserItemSkeleton } from "./user-item";

interface RecommendedProps {
  data: User[];
}

export const Recommended = (props: RecommendedProps) => {
  const { data } = props;
  const isClient = useIsClient();
  const { collapsed } = useSidebar((state) => state);

  const showLabel = !collapsed && data.length > 0;

  if (!isClient) return null;

  return (
    <div>
      {showLabel && (
        <div className="pl-6 mb-4">
          <p className="text-sm text-muted-foreground">Recommended</p>
        </div>
      )}
      <ul className="space-y-2 px-2">
        {data.map((user) => (
          <UserItem key={user.id} {...user} isLive={true} />
        ))}
      </ul>
    </div>
  );
};

export const RecommendedSkeleton = () => {
  return (
    <ul className="px-2">
      {new Array(3).fill(1).map((_, i) => (
        <UserItemSkeleton key={i} />
      ))}
    </ul>
  );
};

Recommended.Skeleton = RecommendedSkeleton;
