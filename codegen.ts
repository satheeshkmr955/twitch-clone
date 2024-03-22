import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "schema.graphql",
  documents: ["app/**/*{.tsx,.ts}"],
  ignoreNoDocuments: true,
  generates: {
    "gql/types.ts": {
      config: {
        mapperTypeSuffix: "Modal",
        mappers: {
          User: "@prisma/client#User",
          UserPublic: "@prisma/client#User",
          Follow: "@prisma/client#Follow",
          FollowPublic: "@prisma/client#Follow",
          Block: "@prisma/client#Block",
          Stream: "@prisma/client#Stream",
          StreamPublic: "@prisma/client#Stream",
        },
        contextType: "../app/api/graphql/route#GraphQLContext",
      },
      plugins: ["typescript", "typescript-resolvers"],
    },
    "gql/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: false,
      },
    },
    "./graphql.schema.json": {
      plugins: ["introspection"],
    },
  },
};

export default config;
