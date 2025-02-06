"use client";

import { format } from "date-fns";
import { Suspense } from "react";
import { DehydratedState, HydrationBoundary } from "@tanstack/react-query";

import { useSuspenseQueryGraphQL } from "@/hooks/use-graphql";
import { GetBlockedUsersDocument } from "@/gql/graphql";

import { columns } from "./columns";
import { DataTable } from "./data-table";

type CommunityProps = {
  dehydratedState: DehydratedState;
};

export const Community = (props: CommunityProps) => {
  const { dehydratedState } = props;

  const { data, isLoading } = useSuspenseQueryGraphQL(GetBlockedUsersDocument);

  if (isLoading) {
    return null;
  }

  const blocks = data?.data?.getBlockedUsers.block || [];

  const formattedData = blocks.map((block) => ({
    ...block,
    userId: block.blocked.id,
    image: block.blocked.image || "",
    name: block.blocked.name,
    createdAt: format(
      new Date(parseInt(block.blocked.createdAt!)),
      "dd/MM/yyyy"
    ),
    updatedAt: format(
      new Date(parseInt(block.blocked.updatedAt!)),
      "dd/MM/yyyy"
    ),
  }));

  return (
    <Suspense>
      <HydrationBoundary state={dehydratedState}>
        <div className="p-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">Community Settings</h1>
          </div>
          <DataTable columns={columns} data={formattedData} />
        </div>
      </HydrationBoundary>
    </Suspense>
  );
};
