"use client";

import { Suspense } from "react";
import { DehydratedState, HydrationBoundary } from "@tanstack/react-query";

import { GetStreamsDocument } from "@/gql/graphql";
import { useSuspenseQueryGraphQL } from "@/hooks/use-graphql";

import { Skeleton } from "@/components/ui/skeleton";

import { ResultCard, ResultCardSkeleton } from "./result-card";

type ResultsProps = {
  dehydratedState: DehydratedState;
};

export const Results = (props: ResultsProps) => {
  const { dehydratedState } = props;

  const { data, isLoading } = useSuspenseQueryGraphQL(GetStreamsDocument);

  if (isLoading) {
    return null;
  }

  const streams = data?.data?.getStreams.streams || [];

  return (
    <Suspense fallback={<ResultsSkeleton />}>
      <HydrationBoundary state={dehydratedState}>
        <div className="h-full">
          <h2 className="text-lg font-semibold mb-4">
            Streams we think you&apos;ll like
          </h2>
          {streams.length === 0 && (
            <div className="text-muted-foreground text-sm">
              No streams found.
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {streams.map((result) => {
              return <ResultCard key={result.id} data={result} />;
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
      <Skeleton className="h-8 w-[290px] m-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {[...Array(4).map((_, i) => <ResultCardSkeleton key={i} />)]}
      </div>
    </div>
  );
};

Results.Skeleton = ResultsSkeleton;
