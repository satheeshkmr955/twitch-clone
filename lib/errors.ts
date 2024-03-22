import { GraphQLError } from "graphql";
import { CustomerExtensions } from "@/app/_types";

export const NotFound = (message: string) => {
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

export const InvalidInput = (message: string) => {
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

export const InvalidToken = (message: string) => {
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

export const UserNotFound = (message: string) => {
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

export const CannotBlockYourself = (message: string) => {
  const extensions: CustomerExtensions = {
    code: "CANNOT_BLOCK_YOURSELF",
    toast: {
      text: message,
      type: "error",
    },
  };

  return new GraphQLError(message, {
    extensions,
  });
};

export const CannotUnblockYourself = (message: string) => {
  const extensions: CustomerExtensions = {
    code: "CANNOT_UNBLOCK_YOURSELF",
    toast: {
      text: message,
      type: "error",
    },
  };

  return new GraphQLError(message, {
    extensions,
  });
};

export const AlreadyBlocked = (message: string) => {
  const extensions: CustomerExtensions = {
    code: "ALREADY_BLOCKED",
    toast: {
      text: message,
      type: "error",
    },
  };

  return new GraphQLError(message, {
    extensions,
  });
};

export const BlockedByUser = (message: string) => {
  const extensions: CustomerExtensions = {
    code: "BLOCKED_BY_USER",
    toast: {
      text: message,
      type: "error",
    },
  };

  return new GraphQLError(message, {
    extensions,
  });
};

export const StreamNotFound = (message: string) => {
  const extensions: CustomerExtensions = {
    code: "STREAM_NOT_FOUND",
    toast: {
      text: message,
      type: "error",
    },
  };

  return new GraphQLError(message, {
    extensions,
  });
};

export const NotBlocked = (message: string) => {
  const extensions: CustomerExtensions = {
    code: "NOT_BLOCKED",
    toast: {
      text: message,
      type: "error",
    },
  };

  return new GraphQLError(message, {
    extensions,
  });
};

export const IngressCreatedFailed = (message: string) => {
  const extensions: CustomerExtensions = {
    code: "INGRESS_CREATED_FAILED",
    toast: {
      text: message,
      type: "error",
    },
  };

  return new GraphQLError(message, {
    extensions,
  });
};
