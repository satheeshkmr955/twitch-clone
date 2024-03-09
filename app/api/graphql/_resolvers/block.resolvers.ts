import {
  AlreadyBlocked,
  CannotBlockYourself,
  CannotUnblockYourself,
  NotAuthorized,
  NotBlocked,
  UserNotFoundError,
} from "@/lib/errors";
import {
  ALREADY_BLOCKED,
  CANNOT_BLOCK_YOURSELF,
  CANNOT_UNBLOCK_YOURSELF,
  NOT_AUTHORIZED,
  NOT_BLOCKED,
  USER_NOT_FOUND,
  YOU_HAVE_BLOCKED,
  YOU_HAVE_UN_BLOCKED,
} from "@/constants/message.constants";

import { Resolvers, Toast, ToastTypes } from "@/gql/types";

export const BlockResolvers: Resolvers = {
  Query: {
    isBlockedByUser: async (_, { input }, { user, db }) => {
      if (!user) {
        throw NotAuthorized(NOT_AUTHORIZED);
      }

      const { id } = input || {};

      const otherUser = await db.user.findUnique({ where: { id } });

      if (!otherUser) {
        throw UserNotFoundError(USER_NOT_FOUND);
      }

      if (otherUser.id === user.id) {
        return { isBlocked: false };
      }

      const existingBlock = await db.block.findUnique({
        where: {
          blockCompoundId: {
            blockerId: otherUser.id,
            blockedId: user.id,
          },
        },
      });

      return { isBlocked: !!existingBlock };
    },
  },
  Mutation: {
    blockUser: async (_, { input }, { user, db }) => {
      if (!user) {
        throw NotAuthorized(NOT_AUTHORIZED);
      }

      const { id } = input || {};

      if (user.id === id) {
        throw CannotBlockYourself(CANNOT_BLOCK_YOURSELF);
      }

      const otherUser = await db.user.findUnique({
        where: { id },
      });

      if (!otherUser) {
        throw UserNotFoundError(USER_NOT_FOUND);
      }

      const existingBlock = await db.block.findUnique({
        where: {
          blockCompoundId: {
            blockerId: user.id,
            blockedId: otherUser.id,
          },
        },
      });

      if (existingBlock) {
        throw AlreadyBlocked(ALREADY_BLOCKED);
      }

      const block = await db.block.create({
        data: {
          blockerId: user.id,
          blockedId: otherUser.id,
        },
        include: {
          blocked: true,
        },
      });

      const toast: Toast = {
        text: `${YOU_HAVE_BLOCKED} ${block.blocked.name}`,
        type: ToastTypes.Success,
      };

      return { block, toast };
    },

    unBlockUser: async (_, { input }, { user, db }) => {
      if (!user) {
        throw NotAuthorized(NOT_AUTHORIZED);
      }

      const { id } = input || {};

      if (user.id === id) {
        throw CannotUnblockYourself(CANNOT_UNBLOCK_YOURSELF);
      }

      const otherUser = await db.user.findUnique({
        where: { id },
      });

      if (!otherUser) {
        throw UserNotFoundError(USER_NOT_FOUND);
      }

      const existingBlock = await db.block.findUnique({
        where: {
          blockCompoundId: {
            blockerId: user.id,
            blockedId: otherUser.id,
          },
        },
      });

      if (!existingBlock) {
        throw NotBlocked(NOT_BLOCKED);
      }

      const unblock = await db.block.delete({
        where: {
          id: existingBlock.id,
        },
        include: {
          blocked: true,
        },
      });

      const toast: Toast = {
        text: `${YOU_HAVE_UN_BLOCKED} ${unblock.blocked.name}`,
        type: ToastTypes.Success,
      };

      return { block: unblock, toast };
    },
  },
};
