import { Follow, UserPublic } from "@/gql/graphql";
import { useSidebar } from "@/store/use-sidebar";

import { UserItem, UserItemSkeleton } from "./user-item";

interface FollowingProps {
  data: Follow & { following: UserPublic }[];
}

export const Following = (props: FollowingProps) => {
  const { data } = props;

  const { collapsed } = useSidebar((state) => state);

  if (!data.length) {
    return null;
  }

  return (
    <div>
      {!collapsed && (
        <div className="pl-6 mb-4">
          <p className="text-sm text-muted-foreground">Following</p>
        </div>
      )}
      <ul className="space-y-2 px-2">
        {data.map((follow) => (
          <UserItem
            key={follow.following.id}
            {...follow.following}
            isLive={follow.following.stream?.isLive}
          />
        ))}
      </ul>
    </div>
  );
};

export const FollowingSkeleton = () => {
  return (
    <ul className="px-2 pt-2 lg:pt-0">
      {new Array(3).fill(1).map((_, i) => (
        <UserItemSkeleton key={i} />
      ))}
    </ul>
  );
};

Following.Skeleton = FollowingSkeleton;
