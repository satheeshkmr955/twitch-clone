import { Resolvers } from "@/gql/types";

export const UsersResolvers: Resolvers = {
  Query: {
    getRecommended: async (_, { input }, { db }) => {
      const pagination = {
        totalRecords: 0,
        currentLimit: 0,
        currentPage: 0,
        hasNextPage: false,
      };

      let defaultLimit = 20;
      let defaultPage = 0;

      let { limit, page } = input || {};
      if (typeof limit === "number") {
        defaultLimit = limit;
      }
      if (typeof page === "number") {
        defaultPage = page;
      }

      pagination["totalRecords"] = await db.user.count();
      pagination["currentLimit"] = defaultLimit;
      pagination["currentPage"] = defaultPage;

      const users = await db.user.findMany({
        skip: defaultPage * defaultLimit,
        take: defaultLimit + 1,
        orderBy: { createdAt: "desc" },
      });

      if (users.length > defaultLimit) {
        pagination["hasNextPage"] = true;
        users.splice(-1);
      }

      return { items: users, pagination };
    },
  },
};
