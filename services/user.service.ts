import {
  NOT_AUTHORIZED,
  USER_DETAILS_UPDATED,
  USER_NOT_FOUND,
} from "@/constants/message.constants";
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  PAGINATION,
} from "@/constants/pagination.constants";

import { db } from "@/lib/db";
import { NotAuthorized, UserNotFound } from "@/lib/errors";

import {
  GetRecommendedProps,
  GetSelfByNameProps,
  GetUserByIdProps,
  GetUserByNameProps,
  UpdateUserProps,
} from "@/app/_types";
import type { Prisma } from "@prisma/client";
import { Toast, ToastTypes } from "@/gql/types";

export const getRecommended = async (inputObj: GetRecommendedProps) => {
  const { input, user } = inputObj;

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
    include: {
      stream: {
        select: {
          isLive: true,
        },
      },
    },
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
        {
          NOT: {
            blocking: {
              some: {
                blockedId: user.id,
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
};

export const getUserByName = async (inputObj: GetUserByNameProps) => {
  const { input } = inputObj;
  const { name } = input || {};

  return await db.user.findFirst({
    where: {
      slugName: name,
    },
    include: {
      stream: true,
      _count: {
        select: {
          followedBy: true,
        },
      },
    },
  });
};

export const getSelfByName = async (inputObj: GetSelfByNameProps) => {
  const { input, user } = inputObj;

  if (!user) {
    throw NotAuthorized(NOT_AUTHORIZED);
  }

  const { name } = input || {};

  const userByName = await getUserByName({ input: { name } });

  if (!userByName) {
    throw UserNotFound(USER_NOT_FOUND);
  }

  if (user.name !== userByName.name) {
    throw NotAuthorized(NOT_AUTHORIZED);
  }

  return userByName;
};

export const getUserById = async (inputObj: GetUserByIdProps) => {
  const { id } = inputObj;

  const user = await db.user.findUnique({
    where: {
      id,
    },
    include: {
      stream: true,
    },
  });
  return user;
};

export const updateUser = async (inputObj: UpdateUserProps) => {
  const { user, input } = inputObj;

  if (!user) {
    throw NotAuthorized(NOT_AUTHORIZED);
  }

  const updatedUser = await db.user.update({
    where: {
      id: user.id,
    },
    data: { ...input },
  });

  const toast: Toast = {
    text: `${USER_DETAILS_UPDATED}`,
    type: ToastTypes.Success,
  };

  return { user: updatedUser, toast };
};
