import {
  ALREADY_FOLLOWING,
  CANNOT_FOLLOW_YOURSELF,
  NOT_AUTHORIZED,
  USER_NOT_FOUND,
} from "@/constants/message.constants";
import { Resolvers } from "@/gql/types";
import {
  AlreadyFollowing,
  CannotFollowYourself,
  NotAuthorized,
  UserNotFoundError,
} from "@/lib/errors";

export const FollowResolvers: Resolvers = {
  Query: {
    isFollowingUser: async (_, { input }, { db, user }) => {
      const { id } = input || {};

      const otherUser = await db.user.findUnique({ where: { id } });

      if (!otherUser) {
        throw UserNotFoundError(USER_NOT_FOUND);
      }

      if (otherUser.id === user?.id) {
        return true;
      }

      const existingFollow = await db.follow.findFirst({
        where: { followerId: user?.id, followingId: otherUser.id },
      });

      return !!existingFollow;
    },
  },
  Mutation: {
    followUser: async (_, { input }, { db, user }) => {
      const { id } = input || {};

      if (!user) {
        throw NotAuthorized(NOT_AUTHORIZED);
      }

      const otherUser = await db.user.findUnique({
        where: { id },
      });

      if (!otherUser) {
        throw UserNotFoundError(USER_NOT_FOUND);
      }

      if (otherUser.id === user.id) {
        throw CannotFollowYourself(CANNOT_FOLLOW_YOURSELF);
      }

      const existingFollow = await db.follow.findFirst({
        where: {
          followerId: user.id,
          followingId: otherUser.id,
        },
      });

      if (existingFollow) {
        throw AlreadyFollowing(ALREADY_FOLLOWING);
      }

      const follow = await db.follow.create({
        data: {
          followerId: user.id,
          followingId: otherUser.id,
        },
        include: {
          following: true,
          follower: true,
        },
      });

      return follow;
    },
  },
};
