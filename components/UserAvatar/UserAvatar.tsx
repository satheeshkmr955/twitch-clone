"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { LiveBadge } from "@/components/live-badge";
import { cn } from "@/lib/utils";
import { User } from "@/gql/graphql";

interface UserAvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarSizes>,
    Omit<User, "email" | "id" | "slugName"> {
  isLive?: boolean;
  showBadge?: boolean;
}

const avatarSizes = cva("", {
  variants: {
    size: {
      default: "h-8 w-8",
      lg: "h-14 w-14",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface UserAvatarComponent
  extends React.ForwardRefExoticComponent<UserAvatarProps> {
  Skeleton: React.FC;
}

export const UserAvatar = React.forwardRef<HTMLDivElement, UserAvatarProps>(
  (props, ref) => {
    const {
      image = null,
      name = "A",
      size,
      showBadge,
      isLive,
      className,
    } = props;
    const canShowBadge = showBadge && isLive;

    const { isLive: _, ...avatarProps } = props;

    return (
      <div className="relative">
        <Avatar
          {...avatarProps}
          ref={ref}
          className={cn(
            isLive && "ring-2 ring-rose-500 border border-background",
            avatarSizes({ size }),
            className
          )}
        >
          <AvatarImage src={image!} />
          <AvatarFallback className="uppercase">
            {name[0]}
            {name[name.length - 1]}
          </AvatarFallback>
        </Avatar>
        {canShowBadge && (
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
            <LiveBadge className="ml-auto" />
          </div>
        )}
      </div>
    );
  }
) as UserAvatarComponent;

UserAvatar.displayName = "UserAvatar";

interface UserAvatarSkeletonProps extends VariantProps<typeof avatarSizes> {}

export const UserAvatarSkeleton = (props: UserAvatarSkeletonProps) => {
  const { size } = props;

  return (
    <Skeleton
      className={cn("w-[40px] h-[40px] rounded-full", avatarSizes({ size }))}
    />
  );
};

UserAvatar.Skeleton = UserAvatarSkeleton;
