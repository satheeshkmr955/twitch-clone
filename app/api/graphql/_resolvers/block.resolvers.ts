import { Resolvers } from "@/gql/types";

import {
  blockUser,
  getBlockedUsers,
  isBlockedByUser,
  unBlockUser,
} from "@/services/block.service";

export const BlockResolvers: Resolvers = {
  Query: {
    isBlockedByUser: async (_, { input }, { user }) => {
      const responseObj = await isBlockedByUser({ input, user });
      return responseObj;
    },
    getBlockedUsers: async (_, {}, { user }) => {
      const responseObj = await getBlockedUsers({ user });
      return responseObj;
    },
  },
  Mutation: {
    blockUser: async (_, { input }, { user }) => {
      const responseObj = await blockUser({ input, user });
      return responseObj;
    },
    unBlockUser: async (_, { input }, { user }) => {
      const responseObj = await unBlockUser({ input, user });
      return responseObj;
    },
  },
};
