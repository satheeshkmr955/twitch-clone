import { Resolvers } from "@/gql/types";

import { createIngress, resetIngress } from "@/services/ingress.service";

export const IngressResolvers: Resolvers = {
  Mutation: {
    createIngress: async (_, { input }, { user }) => {
      const responseObj = await createIngress({ input, user });
      return responseObj;
    },
    resetIngress: async (_, { input }, { user }) => {
      const responseObj = await resetIngress({ input, user });
      return responseObj;
    },
  },
};
