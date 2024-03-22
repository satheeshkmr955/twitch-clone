import { Resolvers } from "@/gql/types";
import { createViewerToken } from "@/services/token.service";

export const TokenResolvers: Resolvers = {
  Query: {},
  Mutation: {
    createViewerToken: async (_, { input }, { user }) => {
      const responseObj = await createViewerToken({ input, user });
      return responseObj;
    },
  },
};
