import { dehydrate } from "@tanstack/react-query";

import { getServerGraphQL } from "@/hooks/use-graphql";
import { GetSelfByNameDocument } from "@/gql/graphql";

import { Navbar } from "./_components/navbar/index";
import { Sidebar } from "./_components/sidebar";
import { Container } from "./_components/container";

interface CreatorLayoutProps {
  params: Promise<{ username: string }>;
  children: React.ReactNode;
}

const CreatorLayout = async (props: CreatorLayoutProps) => {
  const { children, params } = props;

  const { username } = await params;

  const queryClient = await getServerGraphQL(GetSelfByNameDocument, {
    input: { name: decodeURI(username) },
  });

  return (
    <>
      <Navbar />
      <div className="flex h-full pt-20">
        <Sidebar />
        <Container dehydratedState={dehydrate(queryClient)}>
          {children}
        </Container>
      </div>
    </>
  );
};

export default CreatorLayout;
