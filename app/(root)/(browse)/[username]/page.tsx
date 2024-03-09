import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { useServerGraphQL } from "@/hooks/use-graphql";
import { GetUserByNameWithAllDetailsDocument } from "@/gql/graphql";

import User from "./_user/user";
import { UserProps } from "./_user/types";

const UserPage = async (props: UserProps) => {
  const { params } = props;
  const { username } = params;

  const queryClient = await useServerGraphQL(
    GetUserByNameWithAllDetailsDocument,
    {
      input: { name: decodeURI(username) },
    }
  );

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <User {...props} />
      </HydrationBoundary>
    </>
  );
};

export default UserPage;
