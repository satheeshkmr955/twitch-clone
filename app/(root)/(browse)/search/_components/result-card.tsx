import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import { StreamPublicWithUser } from "@/gql/graphql";
import { VerifiedMark } from "@/components/stream-player/verified-mark";
import { Thumbnail, ThumbnailSkeleton } from "@/components/thumbnail";
import { Skeleton } from "@/components/ui/skeleton";

interface ResultCardProps {
  data: StreamPublicWithUser;
}

export const ResultCard = (props: ResultCardProps) => {
  const { data } = props;

  return (
    <Link href={`/${data.user.slugName}`}>
      <div className="w-full flex gap-x-4">
        <div className="relative h-[9rem] w-[16rem]">
          <Thumbnail
            src={data.thumbnailUrl || ""}
            fallback={data.user.image || ""}
            isLive={data.isLive}
            username={data.user.name}
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-x-2">
            <p className="font-bold text-lg cursor-pointer hover:text-blue-500">
              {data.user.name}
            </p>
            <VerifiedMark />
          </div>
          <p className="text-sm text-muted-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(parseInt(data.updatedAt)), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>
    </Link>
  );
};

export const ResultCardSkeleton = () => {
  return (
    <div className="w-full flex gap-x-4">
      <div className="relative h-[9rem] w-[16rem]">
        <ThumbnailSkeleton />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32"/>
        <Skeleton className="h-3 w-24"/>
        <Skeleton className="h-3 w-12"/>
      </div>
    </div>
  );
};
