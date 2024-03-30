import { db } from "@/lib/db";

import { GetSearchProps } from "@/app/_types";

export const getSearch = async (inputObj: GetSearchProps) => {
  const { user, input } = inputObj;
  let userId: null | string = null;

  const { term } = input;

  if (user) {
    userId = user.id;
  }

  let streams = [];

  if (userId) {
    streams = await db.stream.findMany({
      where: {
        user: {
          NOT: {
            blocking: {
              some: {
                blockedId: userId,
              },
            },
          },
        },
        OR: [
          {
            name: {
              contains: term || "",
            },
          },
          {
            user: {
              name: {
                contains: term || "",
              },
            },
          },
        ],
      },
      include: {
        user: true,
      },
      orderBy: [
        {
          isLive: "desc",
        },
        {
          updatedAt: "desc",
        },
      ],
    });
  } else {
    streams = await db.stream.findMany({
      where: {
        OR: [
          {
            name: {
              contains: term || "",
            },
          },
          {
            user: {
              name: {
                contains: term || "",
              },
            },
          },
        ],
      },
      include: {
        user: true,
      },
      orderBy: [
        {
          isLive: "desc",
        },
        {
          updatedAt: "desc",
        },
      ],
    });
  }

  return { streams };
};
