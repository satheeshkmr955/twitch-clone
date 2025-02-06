"use client";

import { Suspense, useEffect } from "react";
import { DehydratedState, HydrationBoundary } from "@tanstack/react-query";
import { useMediaQuery } from "usehooks-ts";

import { cn } from "@/lib/utils";
import { useCreateSidebar } from "@/store/use-creator-sidebar";

interface ContainerProps {
  children: React.ReactNode;
  dehydratedState: DehydratedState;
}

export const Container = (props: ContainerProps) => {
  const { children, dehydratedState } = props;

  const { collapsed, onCollapse, onExpand } = useCreateSidebar(
    (state) => state
  );
  const matches = useMediaQuery(`(max-width: 1024px)`);

  useEffect(() => {
    if (matches) {
      onCollapse();
    } else {
      onExpand();
    }
  }, [matches, onCollapse, onExpand]);

  return (
    <Suspense>
      <HydrationBoundary state={dehydratedState}>
        <div
          className={cn(
            "flex-1",
            collapsed ? "ml-[70px]" : "ml-[70px] lg:ml-60"
          )}
        >
          {children}
        </div>
      </HydrationBoundary>
    </Suspense>
  );
};
