import { Resolvers } from "@/gql/types";

import { getStreams } from "@/services/feed.service";

export const FeedResolvers: Resolvers = {
  Query: {
    getStreams: async (_, {}, { user }) => {
      const responseObj = await getStreams({ user });
      return responseObj;
    },
  },
};
