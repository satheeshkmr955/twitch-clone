import _ from "lodash";

import { Resolvers } from "@/gql/types";

import { UsersResolvers } from "./user.resolvers";
import { FollowResolvers } from "./follow.resolvers";

export const RootResolvers: Resolvers = _.merge(
  {},
  UsersResolvers,
  FollowResolvers
);
