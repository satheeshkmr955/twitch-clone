import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { getServerGraphQL } from "@/hooks/use-graphql";
import { GetSelfByNameDocument } from "@/gql/graphql";

import { Navbar } from "./_components/navbar/index";
import { Sidebar } from "./_components/sidebar";
import { Container } from "./_components/container";

interface CreatorLayoutProps {
  params: { username: string };
  children: React.ReactNode;
}

const CreatorLayout = async (props: CreatorLayoutProps) => {
  const { children, params } = props;

  const { username } = params;

  const queryClient = await getServerGraphQL(GetSelfByNameDocument, {
    input: { name: decodeURI(username) },
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Navbar />
        <div className="flex h-full pt-20">
          <Sidebar />
          <Container>{children}</Container>
        </div>
      </HydrationBoundary>
    </>
  );
};

export default CreatorLayout;
