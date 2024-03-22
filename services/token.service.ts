import { v4 } from "uuid";
import { AccessToken } from "livekit-server-sdk";

import { getUserById } from "@/services/user.service";
import { getBlockById } from "@/services/block.service";
import { BlockedByUser, NotAuthorized, UserNotFound } from "@/lib/errors";
import {
  BLOCKED_BY_USER,
  NOT_AUTHORIZED,
  USER_NOT_FOUND,
} from "@/constants/message.constants";

import { CreateViewerTokenProps, CurrentUser } from "@/app/_types";

export const createViewerToken = async (inputObj: CreateViewerTokenProps) => {
  const { user, input } = inputObj;

  if (!user) {
    throw NotAuthorized(NOT_AUTHORIZED);
  }

  let currentUser: CurrentUser;

  if (user) {
    currentUser = {
      id: user.id,
      name: user.name,
      slugName: user.slugName,
    };
  } else {
    const name = `guest#${Math.floor(Math.random() * 1000)}`;
    currentUser = {
      id: v4(),
      name,
      slugName: name,
    };
  }

  const { hostIdentity = "" } = input || {};

  const host = await getUserById({ id: hostIdentity });

  if (!host) {
    throw UserNotFound(USER_NOT_FOUND);
  }

  const isBlocked = await getBlockById({
    blockerId: host.id,
    blockedId: user.id,
  });

  if (isBlocked) {
    throw BlockedByUser(BLOCKED_BY_USER);
  }

  const isHost = currentUser.id === host.id;

  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
    {
      identity: isHost ? `host-${currentUser.id}` : currentUser.id,
      name: currentUser.name!,
    }
  );

  token.addGrant({
    room: host.id,
    roomJoin: true,
    canPublish: false,
    canPublishData: true,
  });

  const tokenStr = await Promise.resolve(token.toJwt());

  return { token: tokenStr };
};
