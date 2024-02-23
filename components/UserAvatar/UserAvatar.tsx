"use client";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface UserAvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  url?: string;
  name: string;
}

export interface UserAvatarComponent
  extends React.ForwardRefExoticComponent<
    UserAvatarProps & React.RefAttributes<HTMLSpanElement>
  > {
  Skeleton: React.FC;
}

export const UserAvatar = React.forwardRef<HTMLSpanElement, UserAvatarProps>(
  (props, ref) => {
    const { url = null, name = "A" } = props;

    return (
      <Avatar {...props} ref={ref}>
        <AvatarImage src={url!} />
        <AvatarFallback className="uppercase">{name}</AvatarFallback>
      </Avatar>
    );
  }
) as UserAvatarComponent;

UserAvatar.displayName = "UserAvatar";

UserAvatar.Skeleton = function UserAvatarSkeleton() {
  return <Skeleton className=" w-[40px] h-[40px] rounded-[50%]" />;
};
