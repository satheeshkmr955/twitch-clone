import { Resolvers } from "@/gql/types";

import {
  getRecommended,
  getSelfByName,
  getUserByName,
  updateUser,
} from "@/services/user.service";

export const UsersResolvers: Resolvers = {
  Query: {
    getRecommended: async (_, { input }, { user }) => {
      const responseObj = await getRecommended({ input, user });
      return responseObj;
    },
    getUserByName: async (_, { input }, {}) => {
      const responseObj = await getUserByName({ input });
      return responseObj;
    },
    getSelfByName: async (_, { input }, { user }) => {
      const responseObj = await getSelfByName({ input, user });
      return responseObj;
    },
  },
  Mutation: {
    updateUser: async (_, { input }, { user }) => {
      const responseObj = await updateUser({ input, user });
      return responseObj;
    },
  },
};
