import { dehydrate } from "@tanstack/react-query";

import { getServerGraphQL } from "@/hooks/use-graphql";
import { GetUserByNameWithAllDetailsDocument } from "@/gql/graphql";

import User from "./_user/user";

interface UserProps {
  params: Promise<{
    username: string;
  }>;
}

const UserPage = async (props: UserProps) => {
  const { params } = props;
  const { username } = await params;

  const queryClient = await getServerGraphQL(
    GetUserByNameWithAllDetailsDocument,
    {
      input: { name: decodeURI(username) },
    }
  );

  return (
    <>
      <User username={username} dehydratedState={dehydrate(queryClient)} />
    </>
  );
};

export default UserPage;
