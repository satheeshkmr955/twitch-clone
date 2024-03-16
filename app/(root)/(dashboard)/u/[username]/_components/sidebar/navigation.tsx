"use client";

import {
  FullscreenIcon,
  KeyRoundIcon,
  MessageSquareIcon,
  UsersIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

import { NavItem, NavItemSkeleton } from "./nav-item";

export const Navigation = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const routes = [
    {
      label: "Stream",
      href: `/u/${session?.user?.slugName}`,
      icon: FullscreenIcon,
    },
    {
      label: "Keys",
      href: `/u/${session?.user?.slugName}/keys`,
      icon: KeyRoundIcon,
    },
    {
      label: "Chat",
      href: `/u/${session?.user?.slugName}/chat`,
      icon: MessageSquareIcon,
    },
    {
      label: "Community",
      href: `/u/${session?.user?.slugName}/community`,
      icon: UsersIcon,
    },
  ];

  if (!session?.user?.slugName) {
    return (
      <ul className="space-y-2">
        {new Array(4).fill(1).map((_, i) => (
          <NavItemSkeleton key={i} />
        ))}
      </ul>
    );
  }

  return (
    <ul className="space-y-2 px-2 pt-4 lg:pt-0">
      {routes.map((route) => (
        <NavItem
          key={route.href}
          {...route}
          isActive={pathname === route.href}
        />
      ))}
    </ul>
  );
};
