"use client";

import { User } from "@/gql/types";
import { useSidebar } from "@/store/use-sidebar";
import { UserItem } from "./user-item";

interface RecommendedProps {
  data: User[];
}

export const Recommended = (props: RecommendedProps) => {
  const { data } = props;
  const { collapsed } = useSidebar((state) => state);

  const showLabel = !collapsed && data.length > 0;

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
        <UserItem.Skeleton key={i} />
      ))}
    </ul>
  );
};

Recommended.Skeleton = RecommendedSkeleton;
