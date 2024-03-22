"use client";

import { LiveKitRoom } from "@livekit/components-react";

import { Stream, User } from "@/gql/graphql";
import { useViewerToken } from "@/hooks/use-viewer-token";
import { Video } from "@/components/stream-player/video";

interface StreamPlayerProps {
  user: User;
  stream: Stream;
  isFollowing: boolean;
}

export const StreamPlayer = (props: StreamPlayerProps) => {
  const { user } = props;

  const { token, name, identity } = useViewerToken(user.id);

  if (!token || !name || !identity) {
    return <div>Cannot watch the stream</div>;
  }

  return (
    <>
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL!}
        className="grid grid-cols-1 lg:gap-y-0 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full"
      >
        <div className="space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar pb-10">
          <Video hostName={user.name} hostIdentity={user.id} />
        </div>
      </LiveKitRoom>
    </>
  );
};
