"use client";

import { useGraphQL } from "@/hooks/use-graphql";
import { GetStreamByUserIdDocument } from "@/gql/graphql";
import { STREAM_NOT_FOUND } from "@/constants/message.constants";

import { ToggleCard } from "./toggle-card";

import type { Session } from "next-auth";

interface ChatProps {
  session: Session;
}

export const Chat = (props: ChatProps) => {
  const { session } = props;

  const { data } = useGraphQL(GetStreamByUserIdDocument, {
    input: { userId: session.user?.id! },
  });

  if (!data?.data?.getStreamByUserId) {
    return STREAM_NOT_FOUND;
  }

  return (
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
  );
};
