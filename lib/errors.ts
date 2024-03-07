import { GraphQLError } from "graphql";
import { CustomerExtensions } from "@/app/_types";

export const NotFoundError = (message: string) => {
  const extensions: CustomerExtensions = {
    code: "NOT_FOUND",
    toast: {
      text: message,
      type: "error",
    },
  };

  return new GraphQLError(message, {
    extensions,
  });
};

export const InvalidInputError = (message: string) => {
  const extensions: CustomerExtensions = {
    code: "INVALID_INPUT",
    toast: {
      text: message,
      type: "error",
    },
  };

  return new GraphQLError(message, {
    extensions,
  });
};

export const InvalidTokenError = (message: string) => {
  const extensions: CustomerExtensions = {
    code: "INVALID_TOKEN",
    toast: {
      text: message,
      type: "error",
    },
  };

  return new GraphQLError(message, {
    extensions,
  });
};

export const UserNotFoundError = (message: string) => {
  const extensions: CustomerExtensions = {
    code: "USER_NOT_FOUND",
    toast: {
      text: message,
      type: "error",
    },
  };

  return new GraphQLError(message, {
    extensions,
  });
};

export const NotAuthorized = (message: string) => {
  const extensions: CustomerExtensions = {
    code: "NOT_AUTHORIZED",
    toast: {
      text: message,
      type: "error",
    },
  };

  return new GraphQLError(message, {
    extensions,
  });
};

export const CannotFollowYourself = (message: string) => {
  const extensions: CustomerExtensions = {
    code: "CANNOT_FOLLOW_YOURSELF",
    toast: {
      text: message,
      type: "error",
    },
  };

  return new GraphQLError(message, {
    extensions,
  });
};

export const CannotUnfollowYourself = (message: string) => {
  const extensions: CustomerExtensions = {
    code: "CANNOT_UNFOLLOW_YOURSELF",
    toast: {
      text: message,
      type: "error",
    },
  };

  return new GraphQLError(message, {
    extensions,
  });
};

export const NotFollowing = (message: string) => {
  const extensions: CustomerExtensions = {
    code: "NOT_FOLLOWING",
    toast: {
      text: message,
      type: "error",
    },
  };

  return new GraphQLError(message, {
    extensions,
  });
};

export const AlreadyFollowing = (message: string) => {
  const extensions: CustomerExtensions = {
    code: "ALREADY_FOLLOWING",
    toast: {
      text: message,
      type: "error",
    },
  };

  return new GraphQLError(message, {
    extensions,
  });
};
