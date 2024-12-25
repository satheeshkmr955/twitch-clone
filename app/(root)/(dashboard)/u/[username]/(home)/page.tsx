"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

import { useGraphQL } from "@/hooks/use-graphql";
import { GetSelfByNameDocument, Stream, User } from "@/gql/graphql";
import { HOME } from "@/constants/route.constants";
import { StreamPlayer } from "@/components/stream-player";

interface CreatorPageProps {
  params: { username: string };
}

const CreatorPage = (props: CreatorPageProps) => {
  const { params } = props;
  const { username } = params;

  const { data: session } = useSession();

  const { data, isLoading } = useGraphQL(GetSelfByNameDocument, {
    input: { name: decodeURI(username) },
  });

  if (isLoading) {
    return null;
  }

  const self = data?.data?.getSelfByName || null;

  if (!self || !self.stream || session?.user?.id !== self.id) {
    redirect(HOME);
  }

  return (
    <div className="h-full">
      <StreamPlayer
        user={data?.data?.getSelfByName as User}
        stream={data?.data?.getSelfByName?.stream as Stream}
        isFollowing={true}
      />
    </div>
  );
};

export default CreatorPage;
