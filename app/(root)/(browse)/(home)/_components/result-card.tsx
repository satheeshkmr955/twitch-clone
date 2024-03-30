import Link from "next/link";

import { StreamPublicWithUser } from "@/gql/graphql";
import { Thumbnail, ThumbnailSkeleton } from "@/components/thumbnail";
import { LiveBadge } from "@/components/live-badge";
import {
  UserAvatar,
  UserAvatarSkeleton,
} from "@/components/UserAvatar/UserAvatar";
import { Skeleton } from "@/components/ui/skeleton";

interface ResultCardProps {
  data: StreamPublicWithUser;
}

export const ResultCard = (props: ResultCardProps) => {
  const { data } = props;

  return (
    <Link href={`/${data.user.slugName}`}>
      <div className="h-full w-full space-y-4">
        <Thumbnail
          src={data.thumbnailUrl || null}
          fallback={data.user.image || ""}
          isLive={data.isLive}
          username={data.user.name}
        />
        <div className="flex gap-x-3">
          <UserAvatar
            name={data.user.name}
            image={data.user.image}
            isLive={data.isLive}
          />
          <div className="flex flex-col text-sm overflow-hidden">
            <p className="truncate font-semibold hover:text-blue-500">
              {data.name}
            </p>
            <p className="text-muted-foreground">{data.user.name}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const ResultCardSkeleton = () => {
  return (
    <div className="h-full w-full space-y-4 ">
      <ThumbnailSkeleton />
      <div className="flex gap-x-3">
        <UserAvatarSkeleton />
        <div className="flex flex-col gap-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
};
