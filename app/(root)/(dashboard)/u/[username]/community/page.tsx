import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { useServerGraphQL } from "@/hooks/use-graphql";
import { GetBlockedUsersDocument } from "@/gql/graphql";

import { Community } from "./_components/Community";

const CommunityPage = async () => {
  const queryClient = await useServerGraphQL(GetBlockedUsersDocument);

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Community />
      </HydrationBoundary>
    </>
  );
};

export default CommunityPage;
