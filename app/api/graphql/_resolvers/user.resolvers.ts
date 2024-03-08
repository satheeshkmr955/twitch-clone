import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  PAGINATION,
} from "@/constants/pagination.constants";
import { Resolvers } from "@/gql/types";

import type { Prisma } from "@prisma/client";

export const UsersResolvers: Resolvers = {
  Query: {
    getRecommended: async (_, { input }, { db, user }) => {
      const pagination = PAGINATION;

      let defaultLimit = DEFAULT_LIMIT;
      let defaultPage = DEFAULT_PAGE;

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

      const query: Prisma.UserFindManyArgs = {
        skip: defaultPage * defaultLimit,
        take: defaultLimit + 1,
        orderBy: { createdAt: "desc" },
      };

      if (user) {
        query.where = {
          AND: [
            {
              NOT: {
                id: user.id,
              },
            },
            {
              NOT: {
                followedBy: {
                  some: {
                    followerId: user.id,
                  },
                },
              },
            },
          ],
        };
      }

      const users = await db.user.findMany(query);

      if (users.length > defaultLimit) {
        pagination["hasNextPage"] = true;
        users.splice(-1);
      }

      return { items: users, pagination };
    },
    getUserByName: async (_, { input }, { user, db }) => {
      const { name } = input || {};
      return db.user.findFirst({ where: { name } });
    },
  },
};
