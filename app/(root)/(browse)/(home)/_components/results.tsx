"use client";

import { GetStreamsDocument } from "@/gql/graphql";
import { useGraphQL } from "@/hooks/use-graphql";

import { Skeleton } from "@/components/ui/skeleton";

import { ResultCard, ResultCardSkeleton } from "./result-card";

export const Results = () => {
  const { data, isLoading } = useGraphQL(GetStreamsDocument);

  const streams = data?.data?.getStreams.streams || [];

  return (
    <div className="h-full">
      <h2 className="text-lg font-semibold mb-4">
        Streams we think you&apos;ll like
      </h2>
      {streams.length === 0 && (
        <div className="text-muted-foreground text-sm">No streams found.</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {streams.map((result) => {
          return <ResultCard key={result.id} data={result} />;
        })}
      </div>
    </div>
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
