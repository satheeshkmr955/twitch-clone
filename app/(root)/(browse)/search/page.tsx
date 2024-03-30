import { Suspense } from "react";
import { redirect } from "next/navigation";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { HOME } from "@/constants/route.constants";

import { useServerGraphQL } from "@/hooks/use-graphql";
import { GetSearchDocument } from "@/gql/graphql";

import { Results, ResultsSkeleton } from "./_components/results";

interface SearchPageProps {
  searchParams: {
    term?: string;
  };
}

const SearchPage = async (props: SearchPageProps) => {
  const { searchParams } = props;
  const { term = null } = searchParams;

  if (term === null) {
    redirect(HOME);
  }

  const queryClient = await useServerGraphQL(GetSearchDocument, {
    input: { term },
  });

  return (
    <div className="h-full p-8 max-w-screen-2xl mx-auto">
      <Suspense fallback={<ResultsSkeleton />}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Results term={term} />
        </HydrationBoundary>
      </Suspense>
    </div>
  );
};

export default SearchPage;
