"use client";

import { Suspense } from "react";
import { DehydratedState, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";

import { useSuspenseQueryGraphQL } from "@/hooks/use-graphql";
import { GetStreamByUserIdDocument } from "@/gql/graphql";

import { ToggleCard } from "./toggle-card";
import ChatLoading from "../loading";

import type { Session } from "next-auth";

interface ChatProps {
  session: Session;
  dehydratedState: DehydratedState;
}

export const Chat = (props: ChatProps) => {
  const { session, dehydratedState } = props;

  const { data, isLoading } = useSuspenseQueryGraphQL(
    GetStreamByUserIdDocument,
    {
      input: { userId: session.user?.id! },
    }
  );

  if (isLoading) {
    return null;
  }

  if (!data?.data?.getStreamByUserId) {
    notFound();
  }

  return (
    <Suspense fallback={<ChatLoading />}>
      <HydrationBoundary state={dehydratedState}>
        <div className="p-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">Chat Settings</h1>
          </div>
          <div className="space-y-4">
            <ToggleCard
              field="isChatEnabled"
              label="Enable Chat"
              value={data.data.getStreamByUserId.isChatEnabled}
            />
            <ToggleCard
              field="isChatDelayed"
              label="Delay Chat"
              value={data.data.getStreamByUserId.isChatDelayed}
            />
            <ToggleCard
              field="isChatFollowersOnly"
              label="Must be following to chat"
              value={data.data.getStreamByUserId.isChatFollowersOnly}
            />
          </div>
        </div>
      </HydrationBoundary>
    </Suspense>
  );
};
