// backend/src/index.js
import "dotenv/config";
import http from "http";
import express from "express";
import cors from "cors";
import path from "path";
import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";
import jwt from "jsonwebtoken";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";
import typeDefs from "./graphql/typeDefs/index.js";
import resolvers from "./graphql/resolvers/index.js";
import { authenticate, sync } from "./config/database.js";

const buildContext = (source) => {
  let token = "";

  if (source?.headers) {
    token = source.headers.authorization || "";
  } else if (source?.authorization) {
    token = source.authorization;
  }

  if (token.startsWith("Bearer ")) token = token.replace("Bearer ", "");

  let user = null;
  if (token) {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      console.warn("Token inválido o expirado");
    }
  }
  return { user, req: source };
};

(async () => {
  await authenticate();
  await sync();

  const app = express();
  app.use(cors({ origin: "*" }));

  app.use(graphqlUploadExpress({ maxFileSize: 5_000_000, maxFiles: 10 }));

  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  app.get("/healthz", (_req, res) => {
    return res.status(200).send("OK");
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const apollo = new ApolloServer({
    schema,
    context: ({ req }) => buildContext(req),
    subscriptions: false,
  });
  await apollo.start();
  apollo.applyMiddleware({ app, path: "/graphql" });

  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const wsCleanup = useServer(
    {
      schema,
      context: (ctx) => buildContext(ctx.connectionParams),
    },
    wsServer
  );

  apollo.serverWillStart = async () => ({
    async drainServer() {
      await wsCleanup.dispose();
    },
  });

  const PORT = process.env.PORT || 2159;
  httpServer.listen(PORT, () => {
    console.log(`HTTP  : http://tu_url:${PORT}${apollo.graphqlPath}`);
    console.log(`WS    : ws://tu_url:${PORT}${apollo.graphqlPath}`);
  });
})();
