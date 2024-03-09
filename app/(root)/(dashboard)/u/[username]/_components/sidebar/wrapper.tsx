"use client";

import { cn } from "@/lib/utils";
import { useCreateSidebar } from "@/store/use-creator-sidebar";

interface WrapperProps {
  children: React.ReactNode;
}

export const Wrapper = (props: WrapperProps) => {
  const { children } = props;

  const { collapsed } = useCreateSidebar((state) => state);

  return (
    <aside
      className={cn(
        "fixed left-0 flex flex-col w-[70px] lg:w-60 h-full bg-background border-r border-[#2D2E35] z-50",
        collapsed && "lg:w-[70px]"
      )}
    >
      {children}
    </aside>
  );
};
