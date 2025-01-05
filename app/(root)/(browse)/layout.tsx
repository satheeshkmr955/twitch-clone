import { Suspense } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { Navbar } from "./_components/navbar";
import { Container } from "./_components/container";
import { Sidebar, SidebarSkeleton } from "./_components/sidebar";

import { getServerGraphQL } from "@/hooks/use-graphql";
import { GetFollowedAndRecommendedUserDocument } from "@/gql/graphql";

const BrowseLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const queryClient = await getServerGraphQL(
    GetFollowedAndRecommendedUserDocument,
    {
      input: { limit: 10, page: 0 },
    }
  );

  return (
    <>
      <Navbar />
      <div className="flex h-screen pt-20">
        <Suspense fallback={<SidebarSkeleton />}>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Sidebar />
          </HydrationBoundary>
        </Suspense>
        <Container>{children}</Container>
      </div>
    </>
  );
};

export default BrowseLayout;
