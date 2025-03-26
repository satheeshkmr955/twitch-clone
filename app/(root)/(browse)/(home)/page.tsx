import { dehydrate } from "@tanstack/react-query";

import { Results } from "./_components/results";
import { getServerGraphQL } from "@/hooks/use-graphql";
import { GetStreamsDocument } from "@/gql/graphql";

export default async function Home() {
  const queryClient = await getServerGraphQL(GetStreamsDocument);

  return (
    <div className="h-full p-8 max-w-(--breakpoint-2xl) mx-auto">
      <Results dehydratedState={dehydrate(queryClient)} />
    </div>
  );
}
