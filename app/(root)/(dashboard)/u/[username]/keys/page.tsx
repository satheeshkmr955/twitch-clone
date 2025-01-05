import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";

import { GetStreamByUserIdDocument } from "@/gql/graphql";
import { getSession } from "@/lib/auth";
import { HOME } from "@/constants/route.constants";
import { getServerGraphQL } from "@/hooks/use-graphql";

import { Keys } from "./_components/Keys";

const KeyPage = async () => {
  const session = await getSession();

  if (!session) {
    redirect(HOME);
  }

  const queryClient = await getServerGraphQL(GetStreamByUserIdDocument, {
    input: { userId: session?.user?.id! },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Keys session={session} />
    </HydrationBoundary>
  );
};

export default KeyPage;
