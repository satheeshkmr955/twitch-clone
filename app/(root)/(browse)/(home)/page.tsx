import { Suspense } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { Results, ResultsSkeleton } from "./_components/results";
import { useServerGraphQL } from "@/hooks/use-graphql";
import { GetStreamsDocument } from "@/gql/graphql";

export default async function Home() {
  const queryClient = await useServerGraphQL(GetStreamsDocument);

  return (
    <div className="h-full p-8 max-w-screen-2xl mx-auto">
      <Suspense fallback={<ResultsSkeleton />}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Results />
        </HydrationBoundary>
      </Suspense>
    </div>
  );
}
