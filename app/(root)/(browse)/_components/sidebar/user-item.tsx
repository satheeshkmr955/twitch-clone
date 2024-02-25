"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { User } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/store/use-sidebar";
import { UserAvatar } from "@/components/UserAvatar/UserAvatar";
import { LiveBadge } from "@/components/live-badge";
import { Skeleton } from "@/components/ui/skeleton";

interface UserItemProps extends User {
  isLive?: boolean;
}

export const UserItem = (props: UserItemProps) => {
  const { name, image, isLive } = props;
  const pathName = usePathname();

  const { collapsed } = useSidebar((state) => state);

  const href = `/${name}`;
  const isActive = pathName === href;

  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "w-full h-12",
        collapsed ? "justify-center" : "justify-start",
        isActive && "bg-accent"
      )}
    >
      <Link href={href}>
        <div
          className={cn(
            "flex items-center w-full gap-x-4",
            collapsed && "justify-center"
          )}
        >
          <UserAvatar image={image!} name={name!} isLive={isLive} />
          {!collapsed && <p className="truncate">{name}</p>}
          {!collapsed && isLive && <LiveBadge />}
        </div>
      </Link>
    </Button>
  );
};

export const UserItemSkeleton = () => {
  return (
    <li className="flex items-center gap-x-4 px-3 py-2">
      <Skeleton className="min-h-[32px] min-w-[32px] rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-6" />
      </div>
    </li>
  );
};

UserItem.Skeleton = UserItemSkeleton;
