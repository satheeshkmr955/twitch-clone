import {
  ALREADY_FOLLOWING,
  CANNOT_FOLLOW_YOURSELF,
  YOU_ARE_NOW_FOLLOWING,
  NOT_AUTHORIZED,
  USER_NOT_FOUND,
  CANNOT_UNFOLLOW_YOURSELF,
  NOT_FOLLOWING,
  YOU_HAVE_UNFOLLOWED,
} from "@/constants/message.constants";
import { Resolvers, Toast, ToastTypes } from "@/gql/types";
import {
  AlreadyFollowing,
  CannotFollowYourself,
  CannotUnfollowYourself,
  NotAuthorized,
  NotFollowing,
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
        return { isFollowing: true };
      }

      const existingFollow = await db.follow.findFirst({
        where: { followerId: user?.id, followingId: otherUser.id },
      });

      return { isFollowing: !!existingFollow };
    },
    getUserByNameWithFollowingStatus: async (_, { input }, { db, user }) => {
      const { name } = input || {};

      const isUserExists = await db.user.findFirst({ where: { name } });

      if (!isUserExists) {
        throw UserNotFoundError(USER_NOT_FOUND);
      }

      const otherUser = await db.user.findUnique({
        where: { id: isUserExists.id },
      });

      if (!otherUser) {
        throw UserNotFoundError(USER_NOT_FOUND);
      }

      if (otherUser.id === user?.id) {
        return { user: isUserExists, isFollowing: true };
      }

      const existingFollow = await db.follow.findFirst({
        where: { followerId: user?.id, followingId: otherUser.id },
      });

      return { user: isUserExists, isFollowing: !!existingFollow };
    },
    getFollowedUsers: async (_, {}, { db, user }) => {
      if (!user) {
        return { items: [] };
      }

      const follows = await db.follow.findMany({
        where: {
          followerId: user.id,
        },
        include: {
          following: true,
        },
      });

      return { items: follows };
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

      const toast: Toast = {
        text: `${YOU_ARE_NOW_FOLLOWING} ${follow.following.name}`,
        type: ToastTypes.Success,
      };

      return { follow, toast };
    },
    unFollowUser: async (_, { input }, { db, user }) => {
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
        throw CannotUnfollowYourself(CANNOT_UNFOLLOW_YOURSELF);
      }

      const existingFollow = await db.follow.findFirst({
        where: {
          followerId: user.id,
          followingId: otherUser.id,
        },
      });

      if (!existingFollow) {
        throw NotFollowing(NOT_FOLLOWING);
      }

      const follow = await db.follow.delete({
        where: {
          followCompoundId: {
            followerId: user.id,
            followingId: otherUser.id,
          },
        },
        include: {
          following: true,
        },
      });

      const toast: Toast = {
        text: `${YOU_HAVE_UNFOLLOWED} ${otherUser.name}`,
        type: ToastTypes.Success,
      };

      return { follow, toast };
    },
  },
};
