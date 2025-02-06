import { GetStreamsProps } from "@/app/_types";
import { db } from "@/lib/db";

export const getStreams = async (inputObj: GetStreamsProps) => {
  const { user } = inputObj;
  let userId: string | null = null;
  let streams: any = [];

  if (!user) {
    return { streams };
  } else {
    userId = user.id;
  }

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
