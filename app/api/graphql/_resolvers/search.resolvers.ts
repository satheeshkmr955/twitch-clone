import { Resolvers } from "@/gql/types";

import { getSearch } from "@/services/search.service";

export const SearchResolvers: Resolvers = {
  Query: {
    getSearch: async (_, { input }, { user }) => {
      const responseObj = await getSearch({ input, user });
      return responseObj;
    },
  },
};
