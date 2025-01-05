import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";

import { getServerGraphQL } from "@/hooks/use-graphql";
import { GetStreamByUserIdDocument } from "@/gql/graphql";

import { Chat } from "./_component/Chat";
import { getSession } from "@/lib/auth";
import { HOME } from "@/constants/route.constants";

const ChatPage = async () => {
  const session = await getSession();

  if (!session) {
    redirect(HOME);
  }

  const queryClient = await getServerGraphQL(GetStreamByUserIdDocument, {
    input: { userId: session?.user?.id! },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Chat session={session} />
    </HydrationBoundary>
  );
};

export default ChatPage;
