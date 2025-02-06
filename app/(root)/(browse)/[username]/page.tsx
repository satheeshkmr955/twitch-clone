import { dehydrate } from "@tanstack/react-query";

import { getServerGraphQL } from "@/hooks/use-graphql";
import { GetUserByNameWithAllDetailsDocument } from "@/gql/graphql";

import User from "./_user/user";
import { UserProps } from "./_user/types";

const UserPage = async (props: UserProps) => {
  const { params } = props;
  const { username } = params;

  const queryClient = await getServerGraphQL(
    GetUserByNameWithAllDetailsDocument,
    {
      input: { name: decodeURI(username) },
    }
  );

  return (
    <>
      <User {...props} dehydratedState={dehydrate(queryClient)} />
    </>
  );
};

export default UserPage;
