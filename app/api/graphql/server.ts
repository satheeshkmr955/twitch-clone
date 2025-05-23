/* eslint-disable react-hooks/rules-of-hooks */
import { readFileSync } from "fs";
import { createServer, IncomingMessage, ServerResponse } from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";
import { parse, UrlWithParsedQuery } from "url";
import next from "next";
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
import { HttpStatusCode } from "axios";

import type { ExecutionArgs } from "graphql";
import type { PrismaClient, User } from "@prisma/client";

import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { logger, writeLogs } from "@/lib/serverLogger";
import { usePrometheusWithRegistry } from "@/lib/prometheus";
import { useSetResponseHeader } from "@/lib/utils";

import { RootResolvers } from "./_resolvers";

interface CustomerExecutionArgs extends ExecutionArgs {
  rootValue?: any;
  contextValue?: any;
}

export type ContextType = {
  request: NextRequest;
  req?: NextRequest;
  user: User | null;
};

export interface GraphQLContext extends ContextType {
  db: PrismaClient;
}

const graphqlEndpoint: string = "/subscription";
const webpackEndpoint: string = "/_next/webpack-hmr";
const dev: boolean = process.env.NODE_ENV !== "production";
const hostname: string = process.env.HOSTNAME!;
const port: number = Number(process.env.PORT!);

const app = next({ dev, hostname, port });

async function createContext(
  defaultContext: ContextType
): Promise<GraphQLContext> {
  const { request, req } = defaultContext;

  const token = await getToken({
    req: request ? request : req!,
    secret: process.env.NEXTAUTH_SECRET!,
    salt: process.env.AUTH_SECRET!,
  });

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

const yoga = createYoga({
  graphqlEndpoint,
  graphiql: {
    subscriptionsProtocol: "WS",
  },
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
    useSetResponseHeader(),
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

/**
 * @param {number} port
 * @param {import('next/dist/server/next').RequestHandler} [handle]
 */
async function start(
  port: number,
  handle?: (
    req: IncomingMessage,
    res: ServerResponse,
    parsedUrl: UrlWithParsedQuery
  ) => Promise<void>,
  handleUpgrade?: (
    req: IncomingMessage,
    socket: any,
    head: any
  ) => Promise<void>
): Promise<() => Promise<void>> {
  // create http server
  const server = createServer(
    async (req: IncomingMessage, res: ServerResponse) => {
      try {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.
        const url = parse(req.url!, true);

        if (url.pathname!.startsWith(graphqlEndpoint)) {
          await yoga(req, res);
        } else {
          if (!handle) {
            throw new Error(
              `Cannot handle ${url} since handler is not implemented`
            );
          }
          await handle(req, res, url);
        }
      } catch (err) {
        logger.error(err);
        console.error(`Error while handling ${req.url}`, err);
        res.writeHead(HttpStatusCode.InternalServerError).end();
      }
    }
  );

  // create websocket server
  const wsServer = new WebSocketServer({ server, path: graphqlEndpoint });

  // prepare graphql-ws
  // eslint-disable-next-line
  useServer(
    {
      execute: (args: CustomerExecutionArgs) => args.rootValue?.execute?.(args),
      subscribe: (args: CustomerExecutionArgs) =>
        args.rootValue?.subscribe?.(args),
      onSubscribe: async (ctx, id, payload) => {
        const customPayload = { ...payload, id };
        const { schema, execute, subscribe, contextFactory, parse, validate } =
          yoga.getEnveloped({
            ...ctx,
            req: ctx.extra.request,
            socket: ctx.extra.socket,
            params: customPayload,
          });

        const args = {
          schema,
          operationName: customPayload.operationName,
          document: parse(customPayload.query),
          variableValues: customPayload.variables,
          contextValue: await contextFactory(),
          rootValue: {
            execute,
            subscribe,
          },
        };

        const errors = validate(args.schema, args.document);
        if (errors.length) return errors;
        return args;
      },
    },
    wsServer
  );

  await new Promise<void>((resolve, reject) => {
    server.on("upgrade", (req: IncomingMessage, socket, head) => {
      const url = parse(req.url!, true);

      if (!handleUpgrade) {
        throw new Error(`Cannot handle since handleUpgrade is not implemented`);
      }
      if (url.pathname!.startsWith(webpackEndpoint)) {
        handleUpgrade(req, socket, head);
      }
    });

    return server.listen(port, () => {
      resolve();
    });
  });

  return () =>
    new Promise<void>((resolve, reject) =>
      server.close((err) => (err ? reject(err) : resolve()))
    );
}

// dont start the next.js app when testing the server
if (process.env.NODE_ENV !== "test") {
  (async () => {
    try {
      await app.prepare();
      await start(port, app.getRequestHandler(), app.getUpgradeHandler());
      console.log(
        `App started!
HTTP server running on http://${hostname}:${port}
GraphQL WebSocket server running on ws://${hostname}:${port}${graphqlEndpoint}
`
      );
    } catch (error) {
      logger.error(error);
      console.error(error);
    }
  })();
}

export { start };
