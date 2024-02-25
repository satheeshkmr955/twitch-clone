"use client";
import { forwardRef, useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { SettingsIcon, LogOutIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { UserAvatar } from "@/components/UserAvatar/UserAvatar";

import type { Session } from "next-auth";

interface UserButtonProps extends React.HtmlHTMLAttributes<HTMLDivElement> {}

export const UserButton = forwardRef<HTMLDivElement, UserButtonProps>(
  (props, ref) => {
    const { data, status } = useSession();
    const [session, setSession] = useState<null | Session>(null);

    useEffect(() => {
      if (status === "authenticated") {
        setSession(data);
      }
    }, [status, data]);

    if (status === "loading" || session === null) {
      return <UserAvatar.Skeleton />;
    }

    const {
      email = "anonymous@example.com",
      name = "anonymous",
      image,
    } = session.user || {};

    const onClickSignOut = () => {
      signOut();
    };

    return (
      <Popover>
        <PopoverTrigger asChild>
          <UserAvatar className="cursor-pointer" image={image!} name={name!} />
        </PopoverTrigger>
        <PopoverContent ref={ref} className="w-fit">
          <div className="flex flex-col">
            <div className="flex items-center">
              <UserAvatar
                className="cursor-default"
                image={image!}
                name={name!}
              />
              <div className="flex flex-col ml-4">
                <div className="text-2xl capitalize cursor-default">{name}</div>
                <div className="text-sm text-gray-500 cursor-default">
                  {email}
                </div>
              </div>
            </div>
            <Button
              className="mt-2 cursor-pointer justify-start pl-0"
              asChild
              variant={"ghost"}
            >
              <div className="flex">
                <SettingsIcon className="w-[17px] text-gray-400 ml-[10px]" />
                <div className="ml-7 text-gray-600 capitalize">manage</div>
              </div>
            </Button>
            <Button
              className="mt-2 cursor-pointer justify-start pl-0"
              asChild
              variant={"ghost"}
              onClick={onClickSignOut}
            >
              <div className="flex">
                <LogOutIcon className="w-[17px] text-gray-400 ml-[10px]" />
                <div className="ml-7 text-gray-600 capitalize">sign out</div>
              </div>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

UserButton.displayName = "UserButton";
