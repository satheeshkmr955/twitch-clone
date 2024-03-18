import _ from "lodash";

import { Resolvers } from "@/gql/types";

import { UsersResolvers } from "./user.resolvers";
import { FollowResolvers } from "./follow.resolvers";
import { BlockResolvers } from "./block.resolvers";
import { StreamResolvers } from "./stream.resolvers";
import { IngressResolvers } from "./ingress.resolvers";

export const RootResolvers: Resolvers = _.merge(
  {},
  UsersResolvers,
  FollowResolvers,
  StreamResolvers,
  IngressResolvers,
  BlockResolvers
);
