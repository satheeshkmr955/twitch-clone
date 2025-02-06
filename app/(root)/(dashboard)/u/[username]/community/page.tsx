import { dehydrate } from "@tanstack/react-query";

import { getServerGraphQL } from "@/hooks/use-graphql";
import { GetBlockedUsersDocument } from "@/gql/graphql";

import { Community } from "./_components/Community";

const CommunityPage = async () => {
  const queryClient = await getServerGraphQL(GetBlockedUsersDocument);

  return (
    <>
      <Community dehydratedState={dehydrate(queryClient)} />
    </>
  );
};

export default CommunityPage;
