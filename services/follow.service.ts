import { db } from "@/lib/db";
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
import { Toast, ToastTypes } from "@/gql/types";
import {
  AlreadyFollowing,
  CannotFollowYourself,
  CannotUnfollowYourself,
  NotAuthorized,
  NotFollowing,
  UserNotFound,
} from "@/lib/errors";

import { getUserById, getUserByName } from "@/services/user.service";
import {
  FollowUserProps,
  GetFollowByIdProps,
  GetFollowedUsersProps,
  GetUserByNameWithAllDetailsProps,
  IsFollowingUserProps,
  UnFollowUserProps,
} from "@/app/_types";

export const isFollowingUser = async (inputObj: IsFollowingUserProps) => {
  const { input, user } = inputObj;
  const { id } = input || {};

  const otherUser = await getUserById({ id });

  if (!otherUser) {
    throw UserNotFound(USER_NOT_FOUND);
  }

  if (otherUser.id === user?.id) {
    return { isFollowing: true };
  }

  const existingFollow = await getFollowById({
    followerId: user?.id! || "",
    followingId: otherUser.id,
  });

  return { isFollowing: !!existingFollow };
};

export const getUserByNameWithAllDetails = async (
  inputObj: GetUserByNameWithAllDetailsProps
) => {
  const { input, user } = inputObj;
  const { name } = input || {};

  const isUserExists = await getUserByName({ input: { name } });

  if (!isUserExists) {
    throw UserNotFound(USER_NOT_FOUND);
  }

  const otherUser = await getUserById({ id: isUserExists.id });

  if (!otherUser) {
    throw UserNotFound(USER_NOT_FOUND);
  }

  if (otherUser.id === user?.id) {
    return { user: isUserExists, isFollowing: true, isBlocked: false };
  }

  const existingFollow = await getFollowById({
    followerId: user?.id! || "",
    followingId: otherUser.id,
  });

  let isBlocked = false;

  if (user) {
    const existingBlock = await db.block.findUnique({
      where: {
        blockCompoundId: {
          blockerId: otherUser.id,
          blockedId: user.id,
        },
      },
    });

    isBlocked = !!existingBlock;
  }

  return {
    user: isUserExists,
    isFollowing: !!existingFollow,
    isBlocked,
  };
};

export const getFollowedUsers = async (inputObj: GetFollowedUsersProps) => {
  const { user } = inputObj;

  if (!user) {
    return { items: [] };
  }

  const follows = await db.follow.findMany({
    where: {
      followerId: user.id,
      following: {
        blocking: {
          none: {
            blockedId: user.id,
          },
        },
      },
    },
    include: {
      following: {
        include: {
          stream: {
            select: {
              isLive: true,
            },
          },
        },
      },
    },
  });

  return { items: follows };
};

export const followUser = async (inputObj: FollowUserProps) => {
  const { input, user } = inputObj;
  const { id } = input || {};

  if (!user) {
    throw NotAuthorized(NOT_AUTHORIZED);
  }

  const otherUser = await getUserById({ id });

  if (!otherUser) {
    throw UserNotFound(USER_NOT_FOUND);
  }

  if (otherUser.id === user.id) {
    throw CannotFollowYourself(CANNOT_FOLLOW_YOURSELF);
  }

  const existingFollow = await getFollowById({
    followerId: user.id,
    followingId: otherUser.id,
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
};

export const unFollowUser = async (inputObj: UnFollowUserProps) => {
  const { input, user } = inputObj;
  const { id } = input || {};

  if (!user) {
    throw NotAuthorized(NOT_AUTHORIZED);
  }

  const otherUser = await getUserById({ id });

  if (!otherUser) {
    throw UserNotFound(USER_NOT_FOUND);
  }

  if (otherUser.id === user.id) {
    throw CannotUnfollowYourself(CANNOT_UNFOLLOW_YOURSELF);
  }

  const existingFollow = await getFollowById({
    followerId: user.id,
    followingId: otherUser.id,
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
};

export const getFollowById = async (inputObj: GetFollowByIdProps) => {
  const { followerId, followingId } = inputObj;

  const follow = await db.follow.findUnique({
    where: {
      followCompoundId: {
        followerId: followerId,
        followingId: followingId,
      },
    },
  });

  return follow;
};
