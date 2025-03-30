import { redirect } from "next/navigation";
import { dehydrate } from "@tanstack/react-query";

import { HOME } from "@/constants/route.constants";

import { getServerGraphQL } from "@/hooks/use-graphql";
import { GetSearchDocument } from "@/gql/graphql";

import { Results } from "./_components/results";

interface SearchPageProps {
  searchParams: Promise<{
    term?: string;
  }>;
}

const SearchPage = async (props: SearchPageProps) => {
  const { searchParams } = props;
  const { term = null } = await searchParams;

  if (term === null) {
    redirect(HOME);
  }

  const queryClient = await getServerGraphQL(GetSearchDocument, {
    input: { term },
  });

  return (
    <div className="h-full p-8 max-w-(--breakpoint-2xl) mx-auto">
      <Results term={term} dehydratedState={dehydrate(queryClient)} />
    </div>
  );
};

export default SearchPage;
