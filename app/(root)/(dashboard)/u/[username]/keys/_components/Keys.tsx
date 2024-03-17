"use client";

import { notFound } from "next/navigation";

import { useGraphQL } from "@/hooks/use-graphql";
import { GetStreamByUserIdDocument } from "@/gql/graphql";

import { UrlCard } from "./url-card";
import { KeyCard } from "./key-card";
import { ConnectModal } from "./connect-modal";

import type { Session } from "next-auth";

interface KeysProps {
  session: Session;
}

export const Keys = (props: KeysProps) => {
  const { session } = props;

  const { data } = useGraphQL(GetStreamByUserIdDocument, {
    input: { userId: session.user?.id! },
  });

  if (!data?.data?.getStreamByUserId) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Keys & Urls</h1>
        <ConnectModal />
      </div>
      <div className="space-y-4">
        <UrlCard value={data.data.getStreamByUserId.serverUrl!} />
        <KeyCard value={data.data.getStreamByUserId.streamKey!} />
      </div>
    </div>
  );
};
