import { db } from "@/lib/db";
import {
  AlreadyBlocked,
  CannotBlockYourself,
  CannotUnblockYourself,
  NotAuthorized,
  NotBlocked,
  UserNotFound,
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

import { Toast, ToastTypes } from "@/gql/types";
import {
  BlockUserProps,
  GetBlockByIdProps,
  IsBlockedByUserProps,
  UnBlockUserProps,
  GetBlockedUsersProps,
} from "@/app/_types";

import { getUserById } from "@/services/user.service";
import { roomService } from "@/services/ingress.service";
import { logger } from "@/lib/serverLogger";

export const isBlockedByUser = async (inputObj: IsBlockedByUserProps) => {
  const { input, user } = inputObj;

  if (!user) {
    throw NotAuthorized(NOT_AUTHORIZED);
  }

  const { id } = input || {};

  const otherUser = await getUserById({ id });

  if (!otherUser) {
    throw UserNotFound(USER_NOT_FOUND);
  }

  if (otherUser.id === user.id) {
    return { isBlocked: false };
  }

  const existingBlock = await getBlockById({
    blockerId: otherUser.id,
    blockedId: user.id,
  });

  return { isBlocked: !!existingBlock };
};

export const blockUser = async (inputObj: BlockUserProps) => {
  const { input, user } = inputObj;

  if (!user) {
    throw NotAuthorized(NOT_AUTHORIZED);
  }

  const { id } = input || {};

  if (user.id === id) {
    throw CannotBlockYourself(CANNOT_BLOCK_YOURSELF);
  }

  const otherUser = await getUserById({ id });

  try {
    await roomService.removeParticipant(user.id, id);
  } catch (error) {
    logger.error(error);
  }

  const toast: Toast = {
    text: `${YOU_HAVE_BLOCKED}`,
    type: ToastTypes.Success,
  };

  if (!otherUser) {
    return { toast };
  }

  const existingBlock = await getBlockById({
    blockerId: user.id,
    blockedId: otherUser.id,
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

  return { block, toast };
};

export const unBlockUser = async (inputObj: UnBlockUserProps) => {
  const { input, user } = inputObj;

  if (!user) {
    throw NotAuthorized(NOT_AUTHORIZED);
  }

  const { id } = input || {};

  if (user.id === id) {
    throw CannotUnblockYourself(CANNOT_UNBLOCK_YOURSELF);
  }

  const otherUser = await getUserById({ id });

  if (!otherUser) {
    throw UserNotFound(USER_NOT_FOUND);
  }

  const existingBlock = await getBlockById({
    blockerId: user.id,
    blockedId: otherUser.id,
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
};

export const getBlockById = async (inputObj: GetBlockByIdProps) => {
  const { blockerId, blockedId } = inputObj;

  const block = await db.block.findUnique({
    where: {
      blockCompoundId: {
        blockerId: blockerId,
        blockedId: blockedId,
      },
    },
  });

  return block;
};

export const getBlockedUsers = async (inputObj: GetBlockedUsersProps) => {
  const { user } = inputObj;

  if (!user) {
    throw NotAuthorized(NOT_AUTHORIZED);
  }

  const blockedUsers = await db.block.findMany({
    where: {
      blockerId: user.id,
    },
    include: {
      blocked: true,
      blocker: true,
    },
  });

  return { block: blockedUsers };
};
