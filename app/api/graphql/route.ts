/* eslint-disable react-hooks/rules-of-hooks */
import { readFileSync } from "fs";
import { join } from "path";
import { createSchema, createYoga } from "graphql-yoga";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
// import DataLoader from "dataloader";
import { useLogger } from "@envelop/core";
import { trace } from "@opentelemetry/api";
import { useOpenTelemetry } from "@envelop/opentelemetry";
import { EnvelopArmorPlugin } from "@escape.tech/graphql-armor";
import { useResponseCache } from "@envelop/response-cache";
import { createRedisCache } from "@envelop/response-cache-redis";
// import { useDataLoader } from "@envelop/dataloader";

import type { PrismaClient, User } from "@prisma/client";

import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { logger, writeLogs } from "@/lib/logger";
import { usePrometheusWithRegistry } from "@/lib/prometheus";
// import { useSetResponseHeader } from "@/lib/utils";

import { RootResolvers } from "./_resolvers";

export type ContextType = {
  request: NextRequest;
  user: User | null;
};

export interface GraphQLContext extends ContextType {
  db: PrismaClient;
}

const graphqlEndpoint: string = "/api/graphql";

async function createContext(
  defaultContext: ContextType
): Promise<GraphQLContext> {
  const { request } = defaultContext;

  const token = await getToken({ req: request });

  let user = null;

  if (token) {
    user = await db.user.findUnique({
      where: {
        id: token.sub!,
      },
    });
  }

  return {
    ...defaultContext,
    db,
    user,
  };
}

const typeDefs = readFileSync(join(process.cwd(), "schema.graphql"), {
  encoding: "utf-8",
});

const schema = createSchema({
  typeDefs: typeDefs,
  resolvers: RootResolvers,
});

const cache = createRedisCache({ redis });

const { handleRequest } = createYoga({
  graphqlEndpoint,
  schema,
  logging: {
    debug(...args) {
      logger.debug(args);
    },
    info(...args) {
      logger.info(args);
    },
    warn(...args) {
      logger.warn(args);
    },
    error(...args) {
      logger.error(args);
    },
  },
  // fetchAPI: {
  //   Request: NextRequest,
  //   Response: NextResponse,
  // },
  context: createContext,
  plugins: [
    EnvelopArmorPlugin(),
    useLogger({
      logFn: writeLogs,
    }),
    // useSetResponseHeader(),
    useResponseCache({
      cache,
      session: ({ user }: GraphQLContext) => user?.id ?? null,
      ttlPerSchemaCoordinate: {
        // "Query.hello": 1000 * 60 * 5,
      },
      ttlPerType: {
        IsUserFollowing: 1000 * 30,
        IsUserBlocked: 1000 * 30,
      },
      // includeExtensionMetadata: false,
      ttl: 1000 * 60 * 60 * 1,
    }),
    usePrometheusWithRegistry(),
    useOpenTelemetry(
      {
        resolvers: true, // Tracks resolvers calls, and tracks resolvers thrown errors
        variables: true, // Includes the operation variables values as part of the metadata collected
        result: true, // Includes execution result object as part of the metadata collected
      },
      trace.getTracerProvider()
    ),
  ],
});

export { handleRequest as GET, handleRequest as POST };
