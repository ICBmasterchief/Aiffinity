// backend/src/index.js
import express from "express";
import http from "http";
import { ApolloServer, AuthenticationError } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import typeDefs from "./graphql/typeDefs/index.js";
import resolvers from "./graphql/resolvers/index.js";
import { authenticate, sync } from "./config/database.js";
import redisPubSub from "./redisPubSub.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const schema = makeExecutableSchema({ typeDefs, resolvers });

const apollo = new ApolloServer({
  schema,
  context: ({ req }) => {
    const token = req.headers.authorization?.replace("Bearer ", "") || "";
    let user = null;
    if (token) {
      try {
        user = jwt.verify(token, process.env.JWT_SECRET);
      } catch {
        throw new AuthenticationError("Token expirado o inválido");
      }
    }
    return { user, pubsub: redisPubSub };
  },
  introspection: true,
  playground: true,
});
await apollo.start();
apollo.applyMiddleware({ app, path: "/graphql" });

const server = http.createServer(app);
const wsServer = new WebSocketServer({
  server,
  path: "/graphql",
});

const serverCleanup = useServer(
  {
    schema,
    context: async (ctx) => {
      const token =
        ctx.connectionParams?.authorization?.replace("Bearer ", "") || "";
      if (!token) throw new Error("Token no proporcionado, conexión rechazada");
      let user;
      try {
        user = jwt.verify(token, process.env.JWT_SECRET);
      } catch {
        throw new Error("Token inválido, conexión rechazada");
      }
      return { user, pubsub: redisPubSub };
    },
    onConnect: (ctx) => {
      console.log("WS conectado:", ctx.connectionParams);
    },
    onError: (ctx, msg, errs) => {
      console.error("WS error:", errs);
    },
  },
  wsServer
);

server.on("close", () => {
  serverCleanup.dispose();
});

try {
  await authenticate();
  console.log("DB conectada");
  await sync();
  console.log("Modelos sincronizados");

  server.listen(PORT, () => {
    console.log(`HTTP  : http://localhost:${PORT}${apollo.graphqlPath}`);
    console.log(`WS    : ws://localhost:${PORT}${apollo.graphqlPath}`);
  });
} catch (err) {
  console.error("Error al arrancar:", err);
}
