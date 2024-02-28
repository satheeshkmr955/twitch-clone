import { GraphQLError } from "graphql";

export const NotFoundError = (message: string) => {
  return new GraphQLError(message, {
    extensions: { code: "NOT_FOUND" },
  });
};

export const InvalidInputError = (message: string) => {
  return new GraphQLError(message, {
    extensions: { code: "INVALID_INPUT" },
  });
};

export const InvalidTokenError = (message: string) => {
  return new GraphQLError(message, {
    extensions: { code: "INVALID_TOKEN" },
  });
};

export const UserNotFoundError = (message: string) => {
  return new GraphQLError(message, {
    extensions: { code: "USER_NOT_FOUND" },
  });
};

export const NotAuthorized = (message: string) => {
  return new GraphQLError(message, {
    extensions: { code: "NOT_AUTHORIZED" },
  });
};

export const CannotFollowYourself = (message: string) => {
  return new GraphQLError(message, {
    extensions: { code: "CANNOT_FOLLOW_YOURSELF" },
  });
};

export const AlreadyFollowing = (message: string) => {
  return new GraphQLError(message, {
    extensions: { code: "ALREADY_FOLLOWING" },
  });
};
