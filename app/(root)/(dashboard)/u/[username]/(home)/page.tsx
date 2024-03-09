"use client";

import { redirect } from "next/navigation";

import { useGraphQL } from "@/hooks/use-graphql";
import { GetSelfByNameDocument } from "@/gql/graphql";
import { HOME } from "@/constants/route.constants";

interface CreatorPageProps {
  params: { username: string };
}

const CreatorPage = (props: CreatorPageProps) => {
  const { params } = props;
  const { username } = params;

  const { data } = useGraphQL(GetSelfByNameDocument, {
    input: { name: decodeURI(username) },
  });

  const self = data?.data?.getSelfByName || null;

  if (!self) {
    redirect(HOME);
  }

  return <div>CreatorPage</div>;
};

export default CreatorPage;
