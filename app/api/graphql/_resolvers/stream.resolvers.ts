import { Resolvers } from "@/gql/types";

import { getStreamByUserId, updateStream } from "@/services/stream.service";

export const StreamResolvers: Resolvers = {
  Query: {
    getStreamByUserId: async (_, { input }, {}) => {
      const responseObj = await getStreamByUserId({ input });
      return responseObj;
    },
  },
  Mutation: {
    updateStream: async (_, { input = {} }, { user }) => {
      const responseObj = await updateStream({ input, user });
      return responseObj;
    },
  },
};
