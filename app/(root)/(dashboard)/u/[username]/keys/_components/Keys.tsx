"use client";

import { Suspense } from "react";
import { DehydratedState, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";

import { useSuspenseQueryGraphQL } from "@/hooks/use-graphql";
import { GetStreamByUserIdDocument } from "@/gql/graphql";

import { UrlCard } from "./url-card";
import { KeyCard } from "./key-card";
import { ConnectModal } from "./connect-modal";

import type { Session } from "next-auth";

interface KeysProps {
  session: Session;
  dehydratedState: DehydratedState;
}

export const Keys = (props: KeysProps) => {
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
    <Suspense>
      <HydrationBoundary state={dehydratedState}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap">
            <h1 className="text-2xl font-bold">Keys & Urls</h1>
            <ConnectModal />
          </div>
          <div className="space-y-4">
            <UrlCard value={data.data.getStreamByUserId.serverUrl!} />
            <KeyCard value={data.data.getStreamByUserId.streamKey!} />
          </div>
        </div>
      </HydrationBoundary>
    </Suspense>
  );
};
