"use client";

import { Suspense } from "react";
import { DehydratedState, HydrationBoundary } from "@tanstack/react-query";

import { GetSearchDocument } from "@/gql/graphql";
import { useSuspenseQueryGraphQL } from "@/hooks/use-graphql";

import { Skeleton } from "@/components/ui/skeleton";
import { ResultCard, ResultCardSkeleton } from "./result-card";

interface ResultsProps {
  term?: string;
  dehydratedState: DehydratedState;
}

export const Results = (props: ResultsProps) => {
  const { term = "", dehydratedState } = props;

  const { data, isPending } = useSuspenseQueryGraphQL(GetSearchDocument, {
    input: { term },
  });

  if (isPending) {
    return <ResultsSkeleton />;
  }

  const streams = data?.data?.getSearch.streams || [];

  return (
    <Suspense fallback={<ResultsSkeleton />}>
      <HydrationBoundary state={dehydratedState}>
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Results for term &quot;{term}&quot;
          </h2>
          {streams.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No results found. Try searching for something else
            </p>
          )}
          <div className="flex flex-col gap-y-4">
            {streams.map((result) => {
              return <ResultCard data={result} key={result.id} />;
            })}
          </div>
        </div>
      </HydrationBoundary>
    </Suspense>
  );
};

export const ResultsSkeleton = () => {
  return (
    <div>
      <Skeleton className="h-8 w-[290px] mb-4" />
      <div className="flex flex-col gap-y-4">
        {new Array(4).fill(1).map((_, i) => (
          <ResultCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

Results.Skeleton = ResultsSkeleton;
