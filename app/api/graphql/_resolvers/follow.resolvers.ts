import { Resolvers } from "@/gql/types";

import {
  followUser,
  getFollowedUsers,
  getUserByNameWithAllDetails,
  isFollowingUser,
  unFollowUser,
} from "@/services/follow.service";

export const FollowResolvers: Resolvers = {
  Query: {
    isFollowingUser: async (_, { input }, { user }) => {
      const responseObj = await isFollowingUser({ input, user });
      return responseObj;
    },
    getUserByNameWithAllDetails: async (_, { input }, { user }) => {
      const responseObj = await getUserByNameWithAllDetails({ input, user });
      return responseObj;
    },
    getFollowedUsers: async (_, {}, { user }) => {
      const responseObj = await getFollowedUsers({ user });
      return responseObj;
    },
  },
  Mutation: {
    followUser: async (_, { input }, { user }) => {
      const responseObj = await followUser({ input, user });
      return responseObj;
    },
    unFollowUser: async (_, { input }, { user }) => {
      const responseObj = await unFollowUser({ input, user });
      return responseObj;
    },
  },
};
