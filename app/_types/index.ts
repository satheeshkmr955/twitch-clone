import { toast } from "sonner";
import type { GraphQLErrorExtensions } from "graphql/error";

import {
  QueryGetRecommendedArgs,
  QueryGetSelfByNameArgs,
  QueryGetUserByNameArgs,
  MutationFollowUserArgs,
  MutationUnFollowUserArgs,
  QueryGetUserByNameWithAllDetailsArgs,
  QueryIsFollowingUserArgs,
  QueryIsBlockedByUserArgs,
  MutationBlockUserArgs,
  MutationUnBlockUserArgs,
  QueryGetStreamByUserIdArgs,
  MutationUpdateStreamArgs,
  MutationCreateIngressArgs,
  MutationResetIngressArgs,
} from "@/gql/types";

import type { User } from "@prisma/client";

export interface Success {
  toast?: Toast;
  isEmailExists?: boolean;
}

export interface Error {
  errors?: Errors;
  toast?: Toast;
}

export type ToastTypes = keyof Pick<
  typeof toast,
  "success" | "info" | "warning" | "error"
>;

export interface CustomerExtensions extends GraphQLErrorExtensions {
  toast?: Toast;
}

export interface Toast {
  text?: string;
  type?: ToastTypes;
}

export interface Errors {
  name?: string[];
  email?: string[];
  password?: string[];
}

export type CheckEmailsExistsInput = {
  email: string;
};

export type SignupInput = {
  email: string;
  password: string;
  name: string;
};

export interface TriggerToastProps {
  toast?: Toast | undefined;
}

export interface GetRecommendedProps extends QueryGetRecommendedArgs {
  user: User | null;
}

export interface GetUserByNameProps extends QueryGetUserByNameArgs {}

export interface GetSelfByNameProps extends QueryGetSelfByNameArgs {
  user: User | null;
}

export interface GetUserByIdProps {
  id: string;
}

export interface IsFollowingUserProps extends QueryIsFollowingUserArgs {
  user: User | null;
}

export interface GetFollowByIdProps {
  followerId: string;
  followingId: string;
}

export interface GetUserByNameWithAllDetailsProps
  extends QueryGetUserByNameWithAllDetailsArgs {
  user: User | null;
}

export interface GetFollowedUsersProps {
  user: User | null;
}

export interface FollowUserProps extends MutationFollowUserArgs {
  user: User | null;
}

export interface UnFollowUserProps extends MutationUnFollowUserArgs {
  user: User | null;
}

export interface IsBlockedByUserProps extends QueryIsBlockedByUserArgs {
  user: User | null;
}

export interface GetBlockByIdProps {
  blockerId: string;
  blockedId: string;
}

export interface BlockUserProps extends MutationBlockUserArgs {
  user: User | null;
}

export interface UnBlockUserProps extends MutationUnBlockUserArgs {
  user: User | null;
}

export interface GetStreamByUserIdProps extends QueryGetStreamByUserIdArgs {}

export interface UpdateStreamProps extends MutationUpdateStreamArgs {
  user: User | null;
}

export interface CreateIngressProps extends MutationCreateIngressArgs {
  user: User | null;
}

export interface ResetIngressProps extends MutationResetIngressArgs {
  user: User | null;
}

export interface UpdateStreamByIdProps {
  user: User;
  ingress: {
    ingressId: string | null;
    serverUrl: string | null;
    streamKey: string | null;
  };
}
