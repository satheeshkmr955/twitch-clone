"use client";

import { Stream, User } from "@/gql/graphql";
import { useViewerToken } from "@/hooks/use-viewer-token";

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

  return <div>Allowed to watch the stream</div>;
};
