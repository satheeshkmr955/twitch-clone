import _ from "lodash";

import { Resolvers } from "@/gql/types";

import { UsersResolvers } from "./user.resolvers";

export const RootResolvers: Resolvers = _.merge({}, UsersResolvers);
